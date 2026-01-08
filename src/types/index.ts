export interface PasswordAnalysis {
  score: number; // 0-100
  entropy: number;
  entropyDetails: {
    shannonEntropy: number;
    minEntropy: number;
    charsetEntropy: number;
    patternReducedEntropy: number;
    effectiveLength: number;
    uniqueCharCount: number;
  };
  dictionaryAnalysis: {
    isInDictionary: boolean;
    dictionaryType: string[];
    strength: 'very-weak' | 'weak' | 'moderate';
    matchedWords: string[];
    score: number;
  };
  datasetInsights: {
    similarityScore: number;
    uniquenessScore: number;
    predictabilityIndex: number;
    datasetComparison: {
      betterThan: number;
      rank: 'top-1%' | 'top-5%' | 'top-10%' | 'top-25%' | 'bottom-50%';
      recommendation: string;
    };
    patternAnalysis: {
      followsCommonPattern: boolean;
      patternType?: string;
      variations: string[];
    };
  };
  crackTime: {
    offline_slow_hashing_1e4_per_second: string;
    offline_fast_hashing_1e10_per_second: string;
    online_throttling_100_per_hour: string;
    online_no_throttling_10_per_second: string;
  };
  feedback: {
    warning: string;
    suggestions: string[];
  };
  composition: {
    length: number;
    lowercase: number;
    uppercase: number;
    digits: number;
    symbols: number;
    spaces: number;
  };
  patterns: PatternMatch[];
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
  aiAnalysis?: AIPasswordAnalysis;
  zxcvbn?: {
    score: number; // 0-4
    guesses: number;
    guesses_log10: number;
    crack_times_seconds: {
      online_throttling_100_per_hour: number;
      online_no_throttling_10_per_second: number;
      offline_slow_hashing_1e4_per_second: number;
      offline_fast_hashing_1e10_per_second: number;
    };
    crack_times_display: {
      online_throttling_100_per_hour: string;
      online_no_throttling_10_per_second: string;
      offline_slow_hashing_1e4_per_second: string;
      offline_fast_hashing_1e10_per_second: string;
    };
    feedback: {
      warning: string;
      suggestions: string[];
    };
  };
}

export interface PatternMatch {
  pattern: string;
  token: string;
  i: number;
  j: number;
  entropy: number;
  cardinality: number;
  matches?: PatternMatch[];
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  customCharacters?: string;
}

export interface BreachCheckResult {
  breached: boolean;
  count?: number;
  breachNames?: string[];
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  saveHistory: boolean;
}

export interface PasswordHistoryEntry {
  id: string;
  hash: string; // Client-side hashed
  score: number;
  timestamp: string;
  analysis: Partial<PasswordAnalysis>;
}

// AI-related interfaces
export interface AIPasswordAnalysis {
  securityScore: number; // 0-100, AI's assessment
  vulnerabilities: string[];
  recommendations: string[];
  threatAnalysis: string;
  industryTips: string[];
  timestamp: number;
  status: 'loading' | 'success' | 'error';
  error?: string;
}


export interface PasswordMetadata {
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasSpaces: boolean;
  startsWithLetter: boolean;
  endsWithNumber: boolean;
  hasRepeatingChars: boolean;
  hasKeyboardPatterns: boolean;
  characterVariety: number;
}

export interface PasswordFingerprint {
  hash: string;
  metadata: PasswordMetadata;
  timestamp: number;
}

export interface AISettings {
  enabled: boolean;
  showAnalysis: boolean;
  showChatbot: boolean;
  autoAnalyze: boolean;
  privacyMode: 'strict' | 'balanced' | 'enhanced';
}