// Comprehensive Dataset Processing for Advanced Password Analysis
export interface DatasetStats {
  totalPasswords: number;
  uniquePasswords: number;
  averageLength: number;
  commonPatterns: { pattern: string; count: number; percentage: number }[];
  lengthDistribution: { length: number; count: number; percentage: number }[];
  characterSetUsage: {
    lowercase: number;
    uppercase: number;
    digits: number;
    symbols: number;
    mixed: number;
  };
  complexityAnalysis: {
    veryWeak: number;
    weak: number;
    fair: number;
    good: number;
    strong: number;
  };
  topPasswords: { password: string; count: number; percentage: number }[];
}

export interface PasswordInsights {
  similarityScore: number; // 0-100, how similar to common patterns
  uniquenessScore: number; // 0-100, how unique compared to dataset
  predictabilityIndex: number; // 0-100, how predictable the password is
  datasetComparison: {
    betterThan: number; // percentage of passwords this one is better than
    rank: 'top-1%' | 'top-5%' | 'top-10%' | 'top-25%' | 'bottom-50%';
    recommendation: string;
  };
  patternAnalysis: {
    followsCommonPattern: boolean;
    patternType?: string;
    variations: string[];
  };
}

export class DatasetProcessor {
  // Simulated dataset statistics (in real implementation, this would come from actual breach data)
  private static readonly DATASET_STATS: DatasetStats = {
    totalPasswords: 10000000, // 10M passwords analyzed
    uniquePasswords: 6847293, // ~68% unique
    averageLength: 8.2,
    commonPatterns: [
      { pattern: 'word+digits', count: 2847352, percentage: 28.47 },
      { pattern: 'digits_only', count: 1632847, percentage: 16.33 },
      { pattern: 'word_only', count: 1284736, percentage: 12.85 },
      { pattern: 'keyboard_pattern', count: 847362, percentage: 8.47 },
      { pattern: 'name+digits', count: 726384, percentage: 7.26 },
      { pattern: 'repeated_chars', count: 584736, percentage: 5.85 },
      { pattern: 'alternating_case', count: 438592, percentage: 4.39 },
      { pattern: 'substitution_cipher', count: 375849, percentage: 3.76 },
    ],
    lengthDistribution: [
      { length: 4, count: 125847, percentage: 1.26 },
      { length: 5, count: 263847, percentage: 2.64 },
      { length: 6, count: 1847352, percentage: 18.47 },
      { length: 7, count: 1584736, percentage: 15.85 },
      { length: 8, count: 2847361, percentage: 28.47 },
      { length: 9, count: 1274859, percentage: 12.75 },
      { length: 10, count: 947382, percentage: 9.47 },
      { length: 11, count: 584736, percentage: 5.85 },
      { length: 12, count: 347291, percentage: 3.47 },
      { length: 13, count: 147382, percentage: 1.47 },
      { length: 14, count: 28495, percentage: 0.28 },
      { length: 15, count: 12847, percentage: 0.13 },
    ],
    characterSetUsage: {
      lowercase: 4500000, // 45%
      uppercase: 800000,  // 8%
      digits: 2800000,    // 28%
      symbols: 900000,    // 9%
      mixed: 1000000,     // 10%
    },
    complexityAnalysis: {
      veryWeak: 3200000, // 32%
      weak: 2800000,     // 28%
      fair: 2400000,     // 24%
      good: 1200000,     // 12%
      strong: 400000,    // 4%
    },
    topPasswords: [
      { password: '123456', count: 234875, percentage: 2.35 },
      { password: 'password', count: 187394, percentage: 1.87 },
      { password: '123456789', count: 156847, percentage: 1.57 },
      { password: 'qwerty', count: 134758, percentage: 1.35 },
      { password: 'abc123', count: 98456, percentage: 0.98 },
      { password: '12345678', count: 89374, percentage: 0.89 },
      { password: 'password123', count: 76384, percentage: 0.76 },
      { password: 'admin', count: 65847, percentage: 0.66 },
      { password: 'letmein', count: 54738, percentage: 0.55 },
      { password: 'welcome', count: 47582, percentage: 0.48 },
    ]
  };

  // Common password transformation patterns
  private static readonly TRANSFORMATION_PATTERNS = {
    'leet_speak': /[4@]|[3e]|[1!i]|[0o]|[5s]|[7t]/gi,
    'word_number': /^[a-zA-Z]+[0-9]+$/,
    'number_word': /^[0-9]+[a-zA-Z]+$/,
    'word_symbol': /^[a-zA-Z]+[!@#$%^&*]+$/,
    'keyboard_walk': /(qwe|asd|zxc|123|456|789|qaz|wsx|edc)/gi,
    'repeated_pattern': /(.{2,})\1+/,
    'year_pattern': /19[0-9]{2}|20[0-9]{2}/,
    'common_substitution': /[@4][a-z]|[3][a-z]|[0][a-z]|[1!][a-z]|[5][a-z]|[7][a-z]/gi
  };

  /**
   * Analyze a password against comprehensive dataset patterns
   */
  public static analyzePasswordDataset(password: string): PasswordInsights {
    const similarityScore = this.calculateSimilarityScore(password);
    const uniquenessScore = this.calculateUniquenessScore(password);
    const predictabilityIndex = this.calculatePredictabilityIndex(password);
    const datasetComparison = this.performDatasetComparison(password, similarityScore);
    const patternAnalysis = this.analyzePatterns(password);

    return {
      similarityScore,
      uniquenessScore,
      predictabilityIndex,
      datasetComparison,
      patternAnalysis
    };
  }

  /**
   * Calculate how similar the password is to common patterns (0-100)
   */
  private static calculateSimilarityScore(password: string): number {
    let score = 0;
    const lower = password.toLowerCase();

    // Check against top passwords
    const topPasswordMatch = this.DATASET_STATS.topPasswords.find(p => p.password === lower);
    if (topPasswordMatch) {
      return Math.max(5, 100 - (topPasswordMatch.percentage * 10));
    }

    // Check pattern matches
    for (const [patternName, regex] of Object.entries(this.TRANSFORMATION_PATTERNS)) {
      if (regex.test(password)) {
        const patternData = this.DATASET_STATS.commonPatterns.find(p => 
          p.pattern.includes(patternName.replace('_', '_'))
        );
        if (patternData) {
          score += patternData.percentage;
        }
      }
    }

    // Length similarity
    const lengthData = this.DATASET_STATS.lengthDistribution.find(l => l.length === password.length);
    if (lengthData) {
      score += lengthData.percentage;
    }

    // Character set similarity  
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigits = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);

    if (hasLower && !hasUpper && !hasDigits && !hasSymbols) {
      score += (this.DATASET_STATS.characterSetUsage.lowercase / this.DATASET_STATS.totalPasswords) * 100;
    }

    return Math.min(100, Math.max(0, 100 - score));
  }

  /**
   * Calculate uniqueness compared to dataset (0-100)
   */
  private static calculateUniquenessScore(password: string): number {
    // Base uniqueness on character variety and uncommon patterns
    let score = 50; // Start at middle

    // Length bonus for longer passwords
    if (password.length >= 12) score += 20;
    else if (password.length >= 10) score += 10;
    else if (password.length <= 6) score -= 20;

    // Character set diversity
    const charTypes = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password), 
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password)
    ].filter(Boolean).length;

    score += charTypes * 8;

    // Penalize common patterns
    for (const regex of Object.values(this.TRANSFORMATION_PATTERNS)) {
      if (regex.test(password)) {
        score -= 5;
      }
    }

    // Bonus for rare character combinations
    const rareChars = /[{}[\]\\|;:'"<>,.?/~`]/.test(password);
    if (rareChars) score += 15;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate predictability index (0-100, higher = more predictable)
   */
  private static calculatePredictabilityIndex(password: string): number {
    let predictability = 0;

    // Dictionary word check (simplified)
    const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'secret'];
    for (const word of commonWords) {
      if (password.toLowerCase().includes(word)) {
        predictability += 30;
        break;
      }
    }

    // Sequential patterns
    if (/123|abc|qwe|asd|zxc/gi.test(password)) {
      predictability += 25;
    }

    // Repeated characters
    if (/(.)\1{2,}/.test(password)) {
      predictability += 20;
    }

    // Year patterns
    if (/19[0-9]{2}|20[0-9]{2}/.test(password)) {
      predictability += 15;
    }

    // Common endings
    if (/[0-9]{1,4}$|[!@#$%]$/.test(password)) {
      predictability += 10;
    }

    return Math.min(100, predictability);
  }

  /**
   * Compare password against dataset statistics
   */
  private static performDatasetComparison(password: string, similarityScore: number): PasswordInsights['datasetComparison'] {
    let betterThan = 0;
    let rank: PasswordInsights['datasetComparison']['rank'];
    let recommendation = '';

    // Calculate percentile based on multiple factors
    const length = password.length;
    const hasVariety = /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password);
    const isCommon = this.DATASET_STATS.topPasswords.some(p => p.password === password.toLowerCase());

    if (isCommon) {
      betterThan = 5;
      rank = 'bottom-50%';
      recommendation = 'This password is extremely common. Consider using a completely different approach.';
    } else if (length >= 14 && hasVariety && similarityScore > 70) {
      betterThan = 95;
      rank = 'top-1%';
      recommendation = 'Excellent! This password is stronger than 95% of passwords in our dataset.';
    } else if (length >= 12 && hasVariety && similarityScore > 60) {
      betterThan = 85;
      rank = 'top-5%';
      recommendation = 'Very good! This password outperforms most passwords in our dataset.';
    } else if (length >= 10 && similarityScore > 50) {
      betterThan = 70;
      rank = 'top-10%';
      recommendation = 'Good password strength. Consider adding more character variety for even better security.';
    } else if (length >= 8 && similarityScore > 30) {
      betterThan = 50;
      rank = 'top-25%';
      recommendation = 'Average password strength. Increasing length and complexity would improve security significantly.';
    } else {
      betterThan = 25;
      rank = 'bottom-50%';
      recommendation = 'Below average password strength. Consider using longer passwords with mixed character types.';
    }

    return { betterThan, rank, recommendation };
  }

  /**
   * Analyze password patterns in detail
   */
  private static analyzePatterns(password: string): PasswordInsights['patternAnalysis'] {
    let followsCommonPattern = false;
    let patternType: string | undefined;
    const variations: string[] = [];

    // Check each pattern type
    for (const [name, regex] of Object.entries(this.TRANSFORMATION_PATTERNS)) {
      if (regex.test(password)) {
        followsCommonPattern = true;
        patternType = name.replace('_', ' ');
        
        // Suggest variations based on pattern
        switch (name) {
          case 'word_number':
            variations.push('Try using random words instead of dictionary words');
            variations.push('Consider using symbols between words and numbers');
            break;
          case 'leet_speak':
            variations.push('Simple substitutions are easily cracked');
            variations.push('Use completely random characters instead of substitutions');
            break;
          case 'keyboard_walk':
            variations.push('Keyboard patterns are highly predictable');
            variations.push('Use random character combinations');
            break;
          case 'year_pattern':
            variations.push('Avoid personal dates and years');
            variations.push('Use random numbers instead of meaningful dates');
            break;
        }
        break;
      }
    }

    if (!followsCommonPattern) {
      variations.push('Great! Your password doesn\'t follow common predictable patterns');
    }

    return {
      followsCommonPattern,
      patternType,
      variations
    };
  }

  /**
   * Get comprehensive dataset statistics
   */
  public static getDatasetStatistics(): DatasetStats {
    return { ...this.DATASET_STATS }; // Return a copy
  }

  /**
   * Generate security recommendations based on dataset analysis
   */
  public static generateDatasetRecommendations(insights: PasswordInsights): string[] {
    const recommendations: string[] = [];

    if (insights.predictabilityIndex > 50) {
      recommendations.push('Your password follows predictable patterns that attackers commonly exploit');
    }

    if (insights.uniquenessScore < 30) {
      recommendations.push('Consider using more unique character combinations');
    }

    if (insights.similarityScore < 40) {
      recommendations.push('Your password is too similar to commonly used passwords');
    }

    if (insights.datasetComparison.rank === 'bottom-50%') {
      recommendations.push('This password would be cracked quickly in a real attack scenario');
    }

    recommendations.push(insights.datasetComparison.recommendation);

    return [...new Set(recommendations)]; // Remove duplicates
  }
}