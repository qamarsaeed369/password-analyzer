/**
 * Privacy utilities for secure password handling
 * These functions ensure passwords are never sent to external services in plain text
 */

/**
 * Creates a SHA-256 hash of the password for privacy-preserving analysis
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a salted hash for additional security
 */
export async function hashPasswordWithSalt(password: string, salt: string = 'passshield-2024'): Promise<string> {
  return hashPassword(password + salt);
}

/**
 * Generates metadata about password without revealing actual content
 */
export function generatePasswordMetadata(password: string) {
  return {
    length: password.length,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSymbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    hasSpaces: /\s/.test(password),
    startsWithLetter: /^[a-zA-Z]/.test(password),
    endsWithNumber: /\d$/.test(password),
    hasRepeatingChars: /(.)\1{2,}/.test(password),
    hasKeyboardPatterns: hasKeyboardPattern(password),
    characterVariety: getCharacterVariety(password)
  };
}

/**
 * Detects common keyboard patterns
 */
function hasKeyboardPattern(password: string): boolean {
  const patterns = [
    'qwerty', 'asdfgh', 'zxcvbn', 'qwertyuiop',
    '123456', '098765', 'abcdef', 'fedcba',
    'password', 'admin', 'login', 'welcome'
  ];
  
  const lowerPassword = password.toLowerCase();
  return patterns.some(pattern => 
    lowerPassword.includes(pattern) || 
    lowerPassword.includes(pattern.split('').reverse().join(''))
  );
}

/**
 * Calculates character variety score
 */
function getCharacterVariety(password: string): number {
  const charSets = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    spaces: /\s/.test(password)
  };
  
  return Object.values(charSets).filter(Boolean).length;
}

/**
 * Creates a privacy-preserving fingerprint of the password
 * This can be used for analysis without revealing the actual password
 */
export async function createPasswordFingerprint(password: string) {
  const hash = await hashPassword(password);
  const metadata = generatePasswordMetadata(password);
  
  return {
    hash: hash.substring(0, 16), // First 16 chars of hash for identification
    metadata,
    timestamp: Date.now()
  };
}

/**
 * Validates that a password hash is properly formatted
 */
export function isValidPasswordHash(hash: string): boolean {
  return /^[a-f0-9]{64}$/i.test(hash) || /^[a-f0-9]{16}$/i.test(hash);
}

/**
 * Creates anonymous analytics data from password analysis
 */
export function createAnonymousAnalytics(analysis: {
  score: number;
  entropy: number;
  composition: {
    length: number;
    symbols: number;
    digits: number;
    uppercase: number;
    lowercase: number;
  };
  dictionaryAnalysis: {
    isInDictionary: boolean;
  };
}) {
  return {
    strengthScore: analysis.score,
    entropyLevel: Math.floor(analysis.entropy / 10) * 10, // Round to nearest 10
    lengthRange: getLengthRange(analysis.composition.length),
    hasSymbols: analysis.composition.symbols > 0,
    hasNumbers: analysis.composition.digits > 0,
    hasUppercase: analysis.composition.uppercase > 0,
    hasLowercase: analysis.composition.lowercase > 0,
    dictionaryFound: analysis.dictionaryAnalysis.isInDictionary,
    timestamp: Date.now()
  };
}

function getLengthRange(length: number): string {
  if (length < 8) return '0-7';
  if (length < 12) return '8-11';
  if (length < 16) return '12-15';
  if (length < 20) return '16-19';
  return '20+';
}