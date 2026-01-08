import type { BreachCheckResult } from '@/types';

export class BreachDetectionService {
  private static readonly API_BASE = 'https://api.pwnedpasswords.com';

  public static async checkPassword(password: string): Promise<BreachCheckResult> {
    try {
      // Use k-anonymity: only send first 5 characters of SHA-1 hash
      const hash = await this.sha1(password);
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5).toUpperCase();

      const response = await fetch(`${this.API_BASE}/range/${prefix}`);
      
      if (!response.ok) {
        throw new Error('Failed to check breach database');
      }

      const data = await response.text();
      const lines = data.split('\n');
      
      for (const line of lines) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix === suffix) {
          return {
            breached: true,
            count: parseInt(count, 10)
          };
        }
      }

      return {
        breached: false,
        count: 0
      };
    } catch (error) {
      console.error('Error checking password breach:', error);
      // Return safe default if API fails
      return {
        breached: false,
        count: 0
      };
    }
  }

  private static async sha1(message: string): Promise<string> {
    // Use Web Crypto API for SHA-1 hashing
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
  }

  public static async checkMultiplePasswords(passwords: string[]): Promise<BreachCheckResult[]> {
    const results: BreachCheckResult[] = [];
    
    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < passwords.length; i += batchSize) {
      const batch = passwords.slice(i, i + batchSize);
      const batchPromises = batch.map(password => this.checkPassword(password));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add small delay between batches to be respectful to the API
      if (i + batchSize < passwords.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }

  public static getBreachSeverity(count: number): 'low' | 'medium' | 'high' | 'critical' {
    if (count === 0) return 'low';
    if (count < 10) return 'medium';
    if (count < 1000) return 'high';
    return 'critical';
  }

  public static getBreachMessage(result: BreachCheckResult): string {
    if (!result.breached) {
      return '✅ This password has not been found in any known data breaches.';
    }

    const { count } = result;
    if (!count) return '⚠️ This password has been found in data breaches.';

    const severity = this.getBreachSeverity(count);
    
    switch (severity) {
      case 'critical':
        return `🚨 This password has been compromised ${count.toLocaleString()} times! Change it immediately.`;
      case 'high':
        return `⚠️ This password has been compromised ${count.toLocaleString()} times. Consider changing it.`;
      case 'medium':
        return `⚠️ This password has been compromised ${count} times. You should change it.`;
      default:
        return `⚠️ This password has been found in data breaches ${count} times.`;
    }
  }
}