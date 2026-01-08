/**
 * Helper functions for generating password analysis reports
 * Used by both client and server logic
 */

export interface HelperAnalysisInput {
    password?: string;
    length: number;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
    entropy: number;
}

export function generateVulnerabilities(analysis: HelperAnalysisInput, score: number): string[] {
    const vulns: string[] = [];

    // NIST SP 800-63B Guidelines & Research Thresholds
    if (analysis.length < 8) {
        vulns.push('Crucial Vulnerability: Length < 8 characters (NIST Violation)');
    }

    if (analysis.entropy < 28) {
        vulns.push(`Critical: Very Low Entropy (${Math.round(analysis.entropy)} bits). Highly predictable.`);
    } else if (analysis.entropy < 45) {
        vulns.push(`Warning: Low Entropy (${Math.round(analysis.entropy)} bits). Vulnerable to fast dictionary attacks.`);
    }

    if (analysis.length > 8 && !analysis.hasSymbols && !analysis.hasNumbers && !analysis.hasUppercase) {
        vulns.push('Pattern Vulnerability: Contains only lowercase letters (search space is too small).');
    }

    if (!analysis.hasSymbols) {
        vulns.push('Dictionary Vulnerability: Lack of special characters increases susceptibility to rainbow table attacks.');
    }

    if (score < 40) {
        vulns.push('Security Assessment: Weak. Immediate update required.');
    }

    return vulns.length > 0 ? vulns : ['No critical vulnerabilities detected based on current heuristics.'];
}

export function generateRecommendations(analysis: HelperAnalysisInput, score: number): string[] {
    const recs: string[] = [];

    if (analysis.length < 12) {
        recs.push('Compliance: Increase length to 12+ characters (NIST recommendation).');
    }
    if (!analysis.hasSymbols) {
        recs.push('Complexity: Introduce high-entropy special characters (!@#$%^&*).');
    }
    if (!analysis.hasNumbers || !analysis.hasUppercase) {
        recs.push('Complexity: Diversify character sets (Upper + Digit) to increase search space size.');
    }
    if (score < 70) {
        recs.push('Strategy: Use a passphrase (e.g., "correct-horse-battery-staple") to maximize entropy/memorable ratio.');
    }

    recs.push('Defense: Enable Multi-Factor Authentication (MFA) to mitigate credential stuffing risks.');
    recs.push('Storage: Use a cryptographically secure Password Manager (AES-256).');

    return recs;
}

export function generateThreatAnalysis(score: number, analysis: HelperAnalysisInput): string {
    // Mapping Score to Research-Standard Resistance Levels
    if (score >= 90) {
        return 'Security Level: EXCELLENT. Entropy indicates resistance to brute-force attacks even by state-level actors. Estimated offline crack time exceeds current hardware capabilities (centuries).';
    } else if (score >= 75) {
        return 'Security Level: ROBUST. Resistant to commercial GPU clusters and dictionary attacks. Offline cracking would require significant resources (decades).';
    } else if (score >= 50) {
        return 'Security Level: MODERATE. Safe against online throttling attacks. Vulnerable to dedicated offline cracking rigs (days/weeks). Recommended for non-critical accounts only.';
    } else if (score >= 25) {
        return 'Security Level: WEAK. Vulnerable to standard dictionary attacks and rainbow tables. Estimated crack time is trivial (< 24 hours).';
    } else {
        return 'Security Level: CRITICAL RISK. Password appears in common breach lists or follows predictable patterns. Can be cracked instantly. Change immediately.';
    }
}

export function generateIndustryTips(score: number): string[] {
    return [
        'NIST SP 800-63B: Verifiers SHOULD NOT impose composition rules (e.g., "must use special char") if length is sufficient.',
        'Entropy Concept: A 12-char password (lower+upper+digit) has ~72 bits of entropy.',
        'Attack Vector: Credential Stuffing assumes you reuse passwords. Unique passwords are the best defense.',
        'Modern Hashing: Use Argon2id or bcrypt for storage, not simple SHA-256.',
        'Passphrases: "Length beats complexity" for human-memorable security.'
    ];
}
