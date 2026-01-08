import type { PasswordGeneratorOptions } from '@/types';

export class PasswordGenerator {
  private static readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  private static readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly NUMBERS = '0123456789';
  private static readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  private static readonly SIMILAR_CHARS = 'il1Lo0O';
  private static readonly AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;.<>';

  public static generate(options: PasswordGeneratorOptions): string {
    let charset = '';
    let requiredChars = '';

    if (options.includeLowercase) {
      const chars = this.filterChars(this.LOWERCASE, options);
      charset += chars;
      requiredChars += this.getRandomChar(chars);
    }

    if (options.includeUppercase) {
      const chars = this.filterChars(this.UPPERCASE, options);
      charset += chars;
      requiredChars += this.getRandomChar(chars);
    }

    if (options.includeNumbers) {
      const chars = this.filterChars(this.NUMBERS, options);
      charset += chars;
      requiredChars += this.getRandomChar(chars);
    }

    if (options.includeSymbols) {
      const chars = this.filterChars(this.SYMBOLS, options);
      charset += chars;
      requiredChars += this.getRandomChar(chars);
    }

    if (options.customCharacters) {
      charset += options.customCharacters;
    }

    if (!charset) {
      throw new Error('At least one character type must be selected');
    }

    // Generate remaining characters
    const remainingLength = options.length - requiredChars.length;
    let password = requiredChars;

    for (let i = 0; i < remainingLength; i++) {
      password += this.getRandomChar(charset);
    }

    // Shuffle the password to avoid predictable patterns
    return this.shuffleString(password);
  }

  private static filterChars(chars: string, options: PasswordGeneratorOptions): string {
    let filtered = chars;

    if (options.excludeSimilar) {
      filtered = filtered.split('').filter(char => !this.SIMILAR_CHARS.includes(char)).join('');
    }

    if (options.excludeAmbiguous) {
      filtered = filtered.split('').filter(char => !this.AMBIGUOUS_CHARS.includes(char)).join('');
    }

    return filtered;
  }

  private static getRandomChar(charset: string): string {
    const randomIndex = Math.floor(Math.random() * charset.length);
    return charset[randomIndex];
  }

  private static shuffleString(str: string): string {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

  public static generatePassphrase(wordCount: number = 4, separator: string = '-'): string {
    const words = [
      'correct', 'horse', 'battery', 'staple', 'cloud', 'mountain', 'river', 'ocean',
      'forest', 'bridge', 'castle', 'garden', 'wizard', 'dragon', 'knight', 'magic',
      'crystal', 'flame', 'storm', 'thunder', 'lightning', 'rainbow', 'sunset', 'sunrise',
      'silver', 'golden', 'diamond', 'ruby', 'emerald', 'sapphire', 'violet', 'crimson',
      'azure', 'amber', 'ivory', 'pearl', 'marble', 'steel', 'copper', 'bronze',
      'warrior', 'guardian', 'sentinel', 'champion', 'hero', 'legend', 'myth', 'story',
      'journey', 'adventure', 'quest', 'voyage', 'expedition', 'discovery', 'treasure',
      'secret', 'mystery', 'enigma', 'puzzle', 'riddle', 'cipher', 'code', 'key',
      'freedom', 'liberty', 'justice', 'peace', 'harmony', 'balance', 'wisdom', 'truth',
      'courage', 'strength', 'power', 'energy', 'force', 'spirit', 'soul', 'heart'
    ];

    const selectedWords: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      selectedWords.push(words[randomIndex]);
    }

    return selectedWords.join(separator);
  }

  public static estimateStrength(options: PasswordGeneratorOptions): number {
    let charsetSize = 0;

    if (options.includeLowercase) charsetSize += 26;
    if (options.includeUppercase) charsetSize += 26;
    if (options.includeNumbers) charsetSize += 10;
    if (options.includeSymbols) charsetSize += this.SYMBOLS.length;

    if (options.excludeSimilar) charsetSize -= this.SIMILAR_CHARS.length;
    if (options.excludeAmbiguous) charsetSize -= this.AMBIGUOUS_CHARS.length;

    const entropy = Math.log2(charsetSize) * options.length;
    return Math.min(100, Math.max(0, (entropy / 128) * 100)); // Normalize to 0-100
  }
}