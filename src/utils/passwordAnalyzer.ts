import type { PasswordAnalysis, PatternMatch } from '@/types';
import * as zxcvbn from 'zxcvbn';
import { DictionaryEngine } from './dictionary';
import { DatasetProcessor } from './datasetProcessor';

export class PasswordAnalyzer {
  private static readonly COMMON_PASSWORDS = new Set([
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
    'sunshine', 'master', '123123', 'football', 'iloveyou', 'admin123',
    'welcome123', '123qwe', '1q2w3e4r', '1q2w3e', 'Qwerty123', 'Password1'
  ]);

  private static readonly KEYBOARD_PATTERNS = [
    'qwerty', 'asdf', 'zxcv', '1234', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
    '1234567890', 'qwertyui', 'asdfghjk', 'zxcvbnm', 'abcdef', 'fedcba'
  ];

  private static readonly SEQUENCES = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789',
    '9876543210'
  ];

  public static analyze(password: string): PasswordAnalysis {
    const composition = this.analyzeComposition(password);
    const patterns = this.detectPatterns(password);
    const entropyResults = this.calculateAdvancedEntropy(password, composition, patterns);
    const dictionaryAnalysis = DictionaryEngine.checkDictionaries(password);
    const datasetInsights = DatasetProcessor.analyzePasswordDataset(password);
    
    // Adjust entropy based on dictionary findings and dataset analysis
    let adjustedEntropy = entropyResults.patternReducedEntropy;
    if (dictionaryAnalysis.isInDictionary) {
      // Significantly reduce entropy for dictionary words
      adjustedEntropy = Math.min(adjustedEntropy, dictionaryAnalysis.score / 10);
    }
    
    // Further adjust based on dataset predictability
    if (datasetInsights.predictabilityIndex > 50) {
      adjustedEntropy *= (100 - datasetInsights.predictabilityIndex) / 100;
    }
    
    const score = this.calculateScore(password, composition, patterns, adjustedEntropy, dictionaryAnalysis, datasetInsights);
    const strength = this.determineStrength(score);
    const crackTime = this.estimateCrackTime(adjustedEntropy);
    const feedback = this.generateFeedback(password, composition, patterns, score, dictionaryAnalysis, datasetInsights);
    
    // Add zxcvbn analysis
    const zxcvbnResult = zxcvbn.default(password);
    const zxcvbnData = {
      score: zxcvbnResult.score,
      guesses: zxcvbnResult.guesses,
      guesses_log10: zxcvbnResult.guesses_log10,
      crack_times_seconds: {
        online_throttling_100_per_hour: Number(zxcvbnResult.crack_times_seconds.online_throttling_100_per_hour),
        online_no_throttling_10_per_second: Number(zxcvbnResult.crack_times_seconds.online_no_throttling_10_per_second),
        offline_slow_hashing_1e4_per_second: Number(zxcvbnResult.crack_times_seconds.offline_slow_hashing_1e4_per_second),
        offline_fast_hashing_1e10_per_second: Number(zxcvbnResult.crack_times_seconds.offline_fast_hashing_1e10_per_second)
      },
      crack_times_display: {
        online_throttling_100_per_hour: String(zxcvbnResult.crack_times_display.online_throttling_100_per_hour),
        online_no_throttling_10_per_second: String(zxcvbnResult.crack_times_display.online_no_throttling_10_per_second),
        offline_slow_hashing_1e4_per_second: String(zxcvbnResult.crack_times_display.offline_slow_hashing_1e4_per_second),
        offline_fast_hashing_1e10_per_second: String(zxcvbnResult.crack_times_display.offline_fast_hashing_1e10_per_second)
      },
      feedback: {
        warning: zxcvbnResult.feedback.warning || '',
        suggestions: zxcvbnResult.feedback.suggestions || []
      }
    };

    return {
      score,
      entropy: adjustedEntropy,
      entropyDetails: entropyResults,
      dictionaryAnalysis,
      datasetInsights,
      crackTime,
      feedback,
      composition,
      patterns,
      strength,
      zxcvbn: zxcvbnData
    };
  }

  private static analyzeComposition(password: string) {
    return {
      length: password.length,
      lowercase: (password.match(/[a-z]/g) || []).length,
      uppercase: (password.match(/[A-Z]/g) || []).length,
      digits: (password.match(/[0-9]/g) || []).length,
      symbols: (password.match(/[^a-zA-Z0-9\s]/g) || []).length,
      spaces: (password.match(/\s/g) || []).length
    };
  }

  private static detectPatterns(password: string): PatternMatch[] {
    const patterns: PatternMatch[] = [];
    const lower = password.toLowerCase();

    // Check for common passwords
    if (this.COMMON_PASSWORDS.has(lower)) {
      patterns.push({
        pattern: 'dictionary',
        token: password,
        i: 0,
        j: password.length - 1,
        entropy: 0,
        cardinality: this.COMMON_PASSWORDS.size
      });
    }

    // Check for keyboard patterns
    for (const pattern of this.KEYBOARD_PATTERNS) {
      const index = lower.indexOf(pattern);
      if (index !== -1) {
        patterns.push({
          pattern: 'spatial',
          token: password.slice(index, index + pattern.length),
          i: index,
          j: index + pattern.length - 1,
          entropy: Math.log2(pattern.length),
          cardinality: 95 // keyboard cardinality
        });
      }
    }

    // Check for sequences
    for (const sequence of this.SEQUENCES) {
      for (let i = 0; i < sequence.length - 2; i++) {
        const subseq = sequence.slice(i, i + 3);
        const index = lower.indexOf(subseq.toLowerCase());
        if (index !== -1) {
          patterns.push({
            pattern: 'sequence',
            token: password.slice(index, index + subseq.length),
            i: index,
            j: index + subseq.length - 1,
            entropy: Math.log2(subseq.length),
            cardinality: 26 // alphabet cardinality
          });
        }
      }
    }

    // Check for repeating characters
    const repeatMatches = password.match(/(.)\1{2,}/g);
    if (repeatMatches) {
      repeatMatches.forEach(match => {
        const index = password.indexOf(match);
        patterns.push({
          pattern: 'repeat',
          token: match,
          i: index,
          j: index + match.length - 1,
          entropy: Math.log2(match.length),
          cardinality: 1
        });
      });
    }

    // Check for dates (YYYY, MM/DD/YYYY, etc.)
    const datePatterns = [
      /\b(19|20)\d{2}\b/, // Years
      /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/, // Dates
      /\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/ // ISO dates
    ];

    datePatterns.forEach(regex => {
      const match = password.match(regex);
      if (match && match.index !== undefined) {
        patterns.push({
          pattern: 'date',
          token: match[0],
          i: match.index,
          j: match.index + match[0].length - 1,
          entropy: Math.log2(365), // approximate
          cardinality: 365
        });
      }
    });

    return patterns;
  }

  private static calculateAdvancedEntropy(
    password: string, 
    composition: { lowercase: number; uppercase: number; digits: number; symbols: number; spaces: number },
    patterns: PatternMatch[]
  ) {
    // 1. Calculate charset-based entropy (original method)
    let charset = 0;
    if (composition.lowercase > 0) charset += 26;
    if (composition.uppercase > 0) charset += 26;
    if (composition.digits > 0) charset += 10;
    if (composition.symbols > 0) charset += 32;
    if (composition.spaces > 0) charset += 1;
    
    const charsetEntropy = Math.log2(charset) * password.length;
    
    // 2. Calculate Shannon entropy (character frequency)
    const shannonEntropy = this.calculateShannonEntropy(password);
    
    // 3. Calculate minimum entropy (worst-case scenario)
    const uniqueCharCount = new Set(password).size;
    const minEntropy = Math.log2(uniqueCharCount) * password.length;
    
    // 4. Calculate pattern-reduced entropy
    let effectiveLength = password.length;
    let entropyReduction = 0;
    
    patterns.forEach(pattern => {
      switch (pattern.pattern) {
        case 'dictionary':
          entropyReduction += 20; // Dictionary words are highly predictable
          effectiveLength -= pattern.token.length * 0.8;
          break;
        case 'spatial':
          entropyReduction += 10; // Keyboard patterns
          effectiveLength -= pattern.token.length * 0.6;
          break;
        case 'sequence':
          entropyReduction += 8; // Sequences like abc, 123
          effectiveLength -= pattern.token.length * 0.5;
          break;
        case 'repeat':
          entropyReduction += 15; // Repeated characters
          effectiveLength -= pattern.token.length * 0.7;
          break;
        case 'date':
          entropyReduction += 12; // Dates are predictable
          effectiveLength -= pattern.token.length * 0.6;
          break;
      }
    });
    
    effectiveLength = Math.max(effectiveLength, password.length * 0.2); // Minimum 20% effective length
    const patternReducedEntropy = Math.max(
      Math.log2(charset) * effectiveLength - entropyReduction,
      Math.log2(uniqueCharCount) // Never go below unique character entropy
    );
    
    return {
      shannonEntropy: Math.round(shannonEntropy * 100) / 100,
      minEntropy: Math.round(minEntropy * 100) / 100,
      charsetEntropy: Math.round(charsetEntropy * 100) / 100,
      patternReducedEntropy: Math.round(patternReducedEntropy * 100) / 100,
      effectiveLength: Math.round(effectiveLength * 100) / 100,
      uniqueCharCount
    };
  }
  
  private static calculateShannonEntropy(password: string): number {
    const frequencies: { [key: string]: number } = {};
    
    // Count character frequencies
    for (const char of password) {
      frequencies[char] = (frequencies[char] || 0) + 1;
    }
    
    // Calculate Shannon entropy
    let entropy = 0;
    const length = password.length;
    
    for (const freq of Object.values(frequencies)) {
      const probability = freq / length;
      entropy -= probability * Math.log2(probability);
    }
    
    return entropy * password.length;
  }

  private static calculateScore(
    password: string,
    composition: { lowercase: number; uppercase: number; digits: number; symbols: number; spaces: number },
    patterns: PatternMatch[],
    entropy: number,
    dictionaryAnalysis: { isInDictionary: boolean; dictionaryType: string[]; strength: string; matchedWords: string[]; score: number },
    datasetInsights: { similarityScore: number; uniquenessScore: number; predictabilityIndex: number; datasetComparison: { betterThan: number } }
  ): number {
    let score = 0;

    // Base score from length
    score += Math.min(password.length * 4, 40);

    // Character variety bonus
    let varietyBonus = 0;
    if (composition.lowercase > 0) varietyBonus += 5;
    if (composition.uppercase > 0) varietyBonus += 5;
    if (composition.digits > 0) varietyBonus += 5;
    if (composition.symbols > 0) varietyBonus += 10;
    
    score += varietyBonus;

    // Length bonuses
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Entropy bonus
    score += Math.min(entropy / 2, 30);

    // Pattern penalties
    patterns.forEach(pattern => {
      switch (pattern.pattern) {
        case 'dictionary':
          score -= 30;
          break;
        case 'spatial':
          score -= 15;
          break;
        case 'sequence':
          score -= 10;
          break;
        case 'repeat':
          score -= 10;
          break;
        case 'date':
          score -= 20;
          break;
      }
    });

    // Dictionary analysis penalty
    if (dictionaryAnalysis.isInDictionary) {
      if (dictionaryAnalysis.dictionaryType.includes('common-passwords')) {
        score -= 60; // Severe penalty for common passwords
      } else if (dictionaryAnalysis.dictionaryType.includes('dictionary-words')) {
        score -= 40; // Heavy penalty for dictionary words
      } else if (dictionaryAnalysis.dictionaryType.includes('names')) {
        score -= 35; // Penalty for names
      } else if (dictionaryAnalysis.dictionaryType.includes('keyboard-patterns')) {
        score -= 50; // Heavy penalty for keyboard patterns
      } else if (dictionaryAnalysis.dictionaryType.includes('years')) {
        score -= 30; // Penalty for years
      }

      // Additional penalty for multiple dictionary matches
      if (dictionaryAnalysis.matchedWords.length > 1) {
        score -= 15;
      }

      // Incorporate dictionary score
      score = Math.min(score, dictionaryAnalysis.score);
    }

    // Dataset analysis adjustments
    if (datasetInsights.predictabilityIndex > 60) {
      score -= 25; // High predictability penalty
    } else if (datasetInsights.predictabilityIndex > 40) {
      score -= 15; // Medium predictability penalty
    }

    // Similarity penalty
    if (datasetInsights.similarityScore < 30) {
      score -= 20; // Very similar to common patterns
    } else if (datasetInsights.similarityScore < 50) {
      score -= 10; // Somewhat similar to common patterns
    }

    // Uniqueness bonus
    if (datasetInsights.uniquenessScore > 70) {
      score += 10; // Bonus for unique passwords
    }

    // Dataset comparison influence
    const datasetBonus = Math.floor(datasetInsights.datasetComparison.betterThan / 10);
    score = Math.max(score, datasetBonus); // Ensure score reflects dataset performance

    return Math.max(0, Math.min(100, score));
  }

  private static determineStrength(score: number): 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' {
    if (score < 20) return 'very-weak';
    if (score < 40) return 'weak';
    if (score < 60) return 'fair';
    if (score < 80) return 'good';
    return 'strong';
  }

  private static estimateCrackTime(entropy: number) {
    const guessesPerSecond = {
      offline_slow: 1e4,
      offline_fast: 1e10,
      online_throttled: 100 / 3600, // 100 per hour
      online_unthrottled: 10
    };

    const totalGuesses = Math.pow(2, entropy - 1); // Average case

    const seconds = {
      offline_slow: totalGuesses / guessesPerSecond.offline_slow,
      offline_fast: totalGuesses / guessesPerSecond.offline_fast,
      online_throttled: totalGuesses / guessesPerSecond.online_throttled,
      online_unthrottled: totalGuesses / guessesPerSecond.online_unthrottled
    };

    return {
      offline_slow_hashing_1e4_per_second: this.formatTime(seconds.offline_slow),
      offline_fast_hashing_1e10_per_second: this.formatTime(seconds.offline_fast),
      online_throttling_100_per_hour: this.formatTime(seconds.online_throttled),
      online_no_throttling_10_per_second: this.formatTime(seconds.online_unthrottled)
    };
  }

  private static formatTime(seconds: number): string {
    if (seconds < 1) return 'instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2629800) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31557600) return `${Math.round(seconds / 2629800)} months`;
    if (seconds < 3155760000) return `${Math.round(seconds / 31557600)} years`;
    return 'centuries';
  }

  private static generateFeedback(
    password: string,
    composition: { lowercase: number; uppercase: number; digits: number; symbols: number; spaces: number },
    patterns: PatternMatch[],
    score: number,
    dictionaryAnalysis: { isInDictionary: boolean; dictionaryType: string[]; strength: string; matchedWords: string[]; score: number },
    datasetInsights: { similarityScore: number; uniquenessScore: number; predictabilityIndex: number; patternAnalysis: { variations: string[] }; datasetComparison: { recommendation: string } }
  ) {
    const suggestions: string[] = [];
    let warning = '';

    if (password.length < 8) {
      warning = 'Password is too short';
      suggestions.push('Use at least 8 characters');
    }

    // Dictionary-based warnings and suggestions
    if (dictionaryAnalysis.isInDictionary) {
      if (dictionaryAnalysis.dictionaryType.includes('common-passwords')) {
        warning = 'This is a very common password that appears in data breaches';
        suggestions.push('Avoid common passwords like "password" or "123456"');
      } else if (dictionaryAnalysis.dictionaryType.includes('dictionary-words')) {
        warning = 'This password contains dictionary words';
        suggestions.push('Avoid using dictionary words as passwords');
      } else if (dictionaryAnalysis.dictionaryType.includes('names')) {
        warning = 'This password contains common names';
        suggestions.push('Avoid using names in passwords');
      } else if (dictionaryAnalysis.dictionaryType.includes('keyboard-patterns')) {
        warning = 'This password follows a keyboard pattern';
        suggestions.push('Avoid keyboard patterns like "qwerty" or "asdf"');
      } else if (dictionaryAnalysis.dictionaryType.includes('years')) {
        warning = 'This password contains predictable years';
        suggestions.push('Avoid using years or dates in passwords');
      }

      if (dictionaryAnalysis.dictionaryType.includes('word-variations')) {
        suggestions.push('Simple character substitutions (@ for a, 3 for e) are easily cracked');
      }
      
      if (dictionaryAnalysis.dictionaryType.includes('word-with-numbers')) {
        suggestions.push('Adding numbers to dictionary words provides little security');
      }

      if (dictionaryAnalysis.matchedWords.length > 1) {
        suggestions.push('Multiple dictionary matches make this password very predictable');
      }
    }

    if (composition.lowercase === 0) {
      suggestions.push('Add lowercase letters');
    }
    if (composition.uppercase === 0) {
      suggestions.push('Add uppercase letters');
    }
    if (composition.digits === 0) {
      suggestions.push('Add numbers');
    }
    if (composition.symbols === 0) {
      suggestions.push('Add symbols like !@#$%');
    }

    patterns.forEach(pattern => {
      switch (pattern.pattern) {
        case 'spatial':
          suggestions.push('Avoid keyboard patterns like "qwerty"');
          break;
        case 'sequence':
          suggestions.push('Avoid sequences like "abc" or "123"');
          break;
        case 'repeat':
          suggestions.push('Avoid repeated characters');
          break;
        case 'date':
          suggestions.push('Avoid dates and years');
          break;
      }
    });

    // Dataset-based suggestions
    if (datasetInsights.predictabilityIndex > 50) {
      if (!warning) warning = 'This password follows predictable patterns commonly found in data breaches';
      suggestions.push('Avoid predictable patterns that attackers commonly exploit');
    }

    if (datasetInsights.similarityScore < 40) {
      suggestions.push('Your password is too similar to commonly used patterns');
    }

    if (datasetInsights.uniquenessScore < 30) {
      suggestions.push('Consider using more unique character combinations');
    }

    // Add dataset-specific variations
    suggestions.push(...datasetInsights.patternAnalysis.variations);

    // Add dataset recommendation
    if (datasetInsights.datasetComparison.recommendation) {
      suggestions.push(datasetInsights.datasetComparison.recommendation);
    }

    if (score >= 80) {
      suggestions.length = 0;
      suggestions.push('Excellent password!');
      suggestions.push(datasetInsights.datasetComparison.recommendation);
    } else if (score >= 60) {
      suggestions.unshift('Consider making it longer');
    }

    return {
      warning,
      suggestions: [...new Set(suggestions)] // Remove duplicates
    };
  }
}