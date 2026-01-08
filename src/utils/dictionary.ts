// Dictionary Attack Engine for Password Analysis
export class DictionaryEngine {
  // Top 100 most common passwords (from various breach datasets)
  private static readonly COMMON_PASSWORDS = [
    '123456', 'password', '123456789', '12345678', '12345', '1234567', '1234567890',
    'qwerty', 'abc123', '111111', 'dragon', 'master', 'monkey', 'letmein', 'login',
    'princess', 'qwertyuiop', 'solo', 'passw0rd', 'starwars', 'password1', '123123',
    'freedom', 'whatever', 'iceman', 'trustno1', 'batman', 'zaq1zaq1', 'qazwsx',
    'password123', 'Iloveyou', 'loveme', 'welcome', 'admin', 'football', 'secret',
    'ninja', 'pass', '12341234', 'shadow', 'michael', 'mustang', 'superman', 'jennifer',
    'jordan', 'sunshine', 'jesus', 'qwerty123', 'hello', 'charlie', 'hunter', 'andrew',
    'tigger', 'iloveyou', '654321', 'andrea', 'golfer', 'michelle', 'buster', 'daniel',
    '000000', 'michelle', 'chelsea', 'apple', 'cocacola', 'biteme', 'lakers',
    'brandon', 'access', 'mercedes', 'yankees', '696969', 'justin', 'orange',
    'computer', 'arsenal', 'mothers', 'pepper', 'johnny', 'peaches', 'miller',
    'scorpion', 'tigers', 'football1', 'soccer', 'badboy', 'ranger', 'thx1138',
    'enter', 'hockey', 'thunder', 'cowboys', 'silver', 'richard', 'fucker',
    'orange', 'merlin', 'michelle', 'corvette', 'bigdog', 'cheese', 'matthew',
    'patrick', 'martin', 'freedom', 'ginger', 'blondie', 'cookies', 'golf'
  ];

  // Common dictionary words
  private static readonly COMMON_WORDS = [
    'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after',
    'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'align',
    'alike', 'alive', 'allow', 'alone', 'along', 'alter', 'among', 'anger', 'angle',
    'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'array', 'arrow',
    'aside', 'asset', 'avoid', 'awake', 'award', 'aware', 'badly', 'baker', 'bases',
    'basic', 'beach', 'began', 'begin', 'bench', 'billy', 'birth', 'black', 'blame',
    'blind', 'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand',
    'brass', 'brave', 'bread', 'break', 'breed', 'brief', 'bring', 'broad', 'broke',
    'brown', 'build', 'burst', 'buyer', 'cable', 'calif', 'carry', 'catch', 'cause',
    'chain', 'chair', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'chest',
    'chief', 'child', 'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear',
    'click', 'climb', 'clock', 'close', 'cloud', 'coach', 'coast', 'could', 'count',
    'court', 'cover', 'craft', 'crash', 'crazy', 'cream', 'crime', 'cross', 'crowd',
    'crown', 'crude', 'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death',
    'debut', 'delay', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'drank',
    'drawn', 'dream', 'dress', 'drill', 'drink', 'drive', 'drove', 'dying', 'eager',
    'early', 'earth', 'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry',
    'equal', 'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false',
    'fault', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed',
    'flash', 'fleet', 'floor', 'fluid', 'focus', 'force', 'forth', 'forty', 'forum',
    'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny'
  ];

  // Names dictionary
  private static readonly COMMON_NAMES = [
    'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'charles',
    'joseph', 'thomas', 'christopher', 'daniel', 'paul', 'mark', 'donald', 'steven',
    'kenneth', 'andrew', 'joshua', 'kevin', 'brian', 'george', 'edward', 'ronald',
    'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric',
    'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon', 'benjamin', 'samuel',
    'frank', 'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan',
    'jessica', 'sarah', 'karen', 'nancy', 'lisa', 'betty', 'helen', 'sandra', 'donna',
    'carol', 'ruth', 'sharon', 'michelle', 'laura', 'sarah', 'kimberly', 'deborah',
    'dorothy', 'lisa', 'nancy', 'karen', 'betty', 'helen', 'sandra', 'donna', 'carol',
    'ruth', 'sharon', 'michelle', 'laura', 'emily', 'kimberly', 'deborah', 'dorothy',
    'amy', 'angela', 'ashley', 'brenda', 'emma', 'olivia', 'cynthia', 'marie'
  ];

  // Keyboard patterns
  private static readonly KEYBOARD_PATTERNS = [
    'qwerty', 'qwertyui', 'qwertyuiop', 'asdf', 'asdfgh', 'asdfghjk', 'asdfghjkl',
    'zxcv', 'zxcvbn', 'zxcvbnm', '1234', '12345', '123456', '1234567', '12345678',
    '123456789', '1234567890', 'abcd', 'abcde', 'abcdef', 'abcdefg', 'abcdefgh',
    'abcdefghi', 'abcdefghij', 'poiuy', 'lkjhg', 'mnbvc', 'qazwsx', 'wsxedc',
    'edcrfv', 'rfvtgb', 'tgbyhn', 'yhnujm', 'ujmik', 'plokij', 'okijuh', 'ijuhyg'
  ];

  // Years (common in passwords)
  private static readonly COMMON_YEARS = Array.from(
    { length: 50 }, 
    (_, i) => String(1970 + i)
  );

  // Check if password exists in various dictionaries
  public static checkDictionaries(password: string): {
    isInDictionary: boolean;
    dictionaryType: string[];
    strength: 'very-weak' | 'weak' | 'moderate';
    matchedWords: string[];
    score: number; // 0-100, lower is weaker
  } {
    const lowerPassword = password.toLowerCase();
    const matchedWords: string[] = [];
    const dictionaryTypes: string[] = [];
    let score = 100;

    // Check exact matches first
    if (this.COMMON_PASSWORDS.includes(lowerPassword)) {
      matchedWords.push(password);
      dictionaryTypes.push('common-passwords');
      score = 5; // Very weak
    }

    if (this.COMMON_WORDS.includes(lowerPassword)) {
      matchedWords.push(password);
      dictionaryTypes.push('dictionary-words');
      score = Math.min(score, 15);
    }

    if (this.COMMON_NAMES.includes(lowerPassword)) {
      matchedWords.push(password);
      dictionaryTypes.push('names');
      score = Math.min(score, 20);
    }

    if (this.KEYBOARD_PATTERNS.includes(lowerPassword)) {
      matchedWords.push(password);
      dictionaryTypes.push('keyboard-patterns');
      score = Math.min(score, 10);
    }

    if (this.COMMON_YEARS.includes(password)) {
      matchedWords.push(password);
      dictionaryTypes.push('years');
      score = Math.min(score, 25);
    }

    // Check for variations and transformations
    this.checkVariations(password, lowerPassword, matchedWords, dictionaryTypes);
    
    // Check for word combinations
    this.checkWordCombinations(password, lowerPassword, matchedWords, dictionaryTypes);

    // Adjust score based on variations found
    if (matchedWords.length > 1) {
      score = Math.max(5, score - 10); // Multiple matches = weaker
    }

    // Determine strength
    let strength: 'very-weak' | 'weak' | 'moderate';
    if (score <= 15) {
      strength = 'very-weak';
    } else if (score <= 35) {
      strength = 'weak';
    } else {
      strength = 'moderate';
    }

    return {
      isInDictionary: matchedWords.length > 0,
      dictionaryType: [...new Set(dictionaryTypes)],
      strength,
      matchedWords: [...new Set(matchedWords)],
      score
    };
  }

  // Check for common password variations
  private static checkVariations(
    original: string, 
    lower: string, 
    matches: string[], 
    types: string[]
  ): void {
    // Common substitutions (leet speak)
    const substitutions: { [key: string]: string } = {
      '@': 'a', '4': 'a', '3': 'e', '1': 'i', '!': 'i', '0': 'o', '5': 's', '7': 't'
    };

    let transformed = lower;
    for (const [symbol, letter] of Object.entries(substitutions)) {
      transformed = transformed.replace(new RegExp(symbol, 'g'), letter);
    }

    if (this.COMMON_PASSWORDS.includes(transformed) && !matches.includes(transformed)) {
      matches.push(original);
      types.push('password-variations');
    }

    if (this.COMMON_WORDS.includes(transformed) && !matches.includes(transformed)) {
      matches.push(original);
      types.push('word-variations');
    }

    // Check with numbers removed
    const noNumbers = lower.replace(/[0-9]/g, '');
    if (noNumbers.length > 2) {
      if (this.COMMON_WORDS.includes(noNumbers)) {
        matches.push(original);
        types.push('word-with-numbers');
      }
      if (this.COMMON_NAMES.includes(noNumbers)) {
        matches.push(original);
        types.push('name-with-numbers');
      }
    }

    // Check reversed
    const reversed = lower.split('').reverse().join('');
    if (this.COMMON_WORDS.includes(reversed)) {
      matches.push(original);
      types.push('reversed-words');
    }
  }

  // Check for word combinations
  private static checkWordCombinations(
    original: string, 
    lower: string, 
    matches: string[], 
    types: string[]
  ): void {
    // Look for dictionary words within the password
    for (const word of this.COMMON_WORDS) {
      if (word.length >= 4 && lower.includes(word)) {
        matches.push(word);
        types.push('contains-dictionary-word');
      }
    }

    for (const name of this.COMMON_NAMES) {
      if (name.length >= 4 && lower.includes(name)) {
        matches.push(name);
        types.push('contains-name');
      }
    }

    // Check for year patterns
    const yearPattern = /(?:19|20)\d{2}/g;
    const years = original.match(yearPattern);
    if (years) {
      matches.push(...years);
      types.push('contains-year');
    }
  }

  // Get dictionary statistics
  public static getStatistics(): {
    totalPasswords: number;
    totalWords: number;
    totalNames: number;
    totalPatterns: number;
    totalYears: number;
  } {
    return {
      totalPasswords: this.COMMON_PASSWORDS.length,
      totalWords: this.COMMON_WORDS.length,
      totalNames: this.COMMON_NAMES.length,
      totalPatterns: this.KEYBOARD_PATTERNS.length,
      totalYears: this.COMMON_YEARS.length
    };
  }

  // Check password against specific dictionary type
  public static checkSpecificDictionary(
    password: string, 
    type: 'passwords' | 'words' | 'names' | 'patterns' | 'years'
  ): boolean {
    const lower = password.toLowerCase();
    
    switch (type) {
      case 'passwords':
        return this.COMMON_PASSWORDS.includes(lower);
      case 'words':
        return this.COMMON_WORDS.includes(lower);
      case 'names':
        return this.COMMON_NAMES.includes(lower);
      case 'patterns':
        return this.KEYBOARD_PATTERNS.includes(lower);
      case 'years':
        return this.COMMON_YEARS.includes(password);
      default:
        return false;
    }
  }
}