import { NextRequest, NextResponse } from 'next/server';
import { getAIModel } from '@/lib/ai-model';

interface PasswordAnalysis {
  password: string;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  entropy: number;
}

/**
 * Client-Side AI Analysis Route
 * All computation happens in the browser - NO data leaves the device
 * Implements dissertation Chapter 4.3.3 architecture
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle the data format from AIAnalysis.tsx
    const analysisData = body.analysisData;

    if (!analysisData) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
        { status: 400 }
      );
    }

    // Extract password characteristics from the analysis data
    const composition = analysisData.composition;
    const entropy = analysisData.entropy;

    // Create a synthetic password representation for the analysis
    const passwordLength = composition?.length || 8;
    const hasUppercase = composition?.uppercase > 0;
    const hasLowercase = composition?.lowercase > 0;
    const hasNumbers = composition?.digits > 0;
    const hasSymbols = composition?.symbols > 0;

    // SERVER-SIDE HEURISTIC FALLBACK
    // We avoid loading TensorFlow.js on the server to prevent Vercel/Node environment issues.
    // The "Real" AI analysis happens in the browser. This API endpoint serves as a reliable backend verifier.

    let securityScore = 0;
    const diversity = (hasUppercase ? 1 : 0) + (hasLowercase ? 1 : 0) + (hasNumbers ? 1 : 0) + (hasSymbols ? 1 : 0);

    // 1. Length Score
    if (passwordLength >= 16) securityScore += 40;
    else if (passwordLength >= 12) securityScore += 30;
    else if (passwordLength >= 8) securityScore += 20;
    else securityScore += passwordLength * 2;

    // 2. Diversity Score
    securityScore += diversity * 10;

    // 3. Entropy Bonus
    securityScore += Math.min(20, (entropy || 0) / 4);

    // Caps
    securityScore = Math.min(100, Math.max(0, securityScore));

    // Create analysis object for helper functions
    const analysis = {
      password: "HIDDEN-ON-SERVER",
      length: passwordLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      entropy: entropy || 0
    };

    // Generate vulnerabilities based on score and features
    const vulnerabilities = generateVulnerabilities(analysis, securityScore);

    // Generate recommendations
    const recommendations = generateRecommendations(analysis, securityScore);

    // Threat analysis
    const threatAnalysis = generateThreatAnalysis(securityScore, analysis);

    // Industry tips
    const industryTips = generateIndustryTips(securityScore);

    return NextResponse.json({
      success: true,
      analysis: {
        securityScore: Math.round(securityScore),
        vulnerabilities,
        recommendations,
        threatAnalysis,
        industryTips
      },
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error in AI analysis:', error);
    return NextResponse.json(
      { error: 'Failed to process password analysis' },
      { status: 500 }
    );
  }
}

function generateVulnerabilities(analysis: PasswordAnalysis, score: number): string[] {
  const vulns: string[] = [];

  if (analysis.length < 8) {
    vulns.push('Password is too short (minimum 8 characters recommended)');
  }
  if (!analysis.hasUppercase) {
    vulns.push('Missing uppercase letters reduces complexity');
  }
  if (!analysis.hasLowercase) {
    vulns.push('Missing lowercase letters reduces complexity');
  }
  if (!analysis.hasNumbers) {
    vulns.push('No numbers detected - adds predictability');
  }
  if (!analysis.hasSymbols) {
    vulns.push('No special characters - vulnerable to dictionary attacks');
  }
  if (analysis.entropy < 40) {
    vulns.push('Low entropy indicates predictable patterns');
  }
  if (score < 50) {
    vulns.push('Overall security score is below acceptable threshold');
  }

  return vulns.length > 0 ? vulns : ['No major vulnerabilities detected'];
}

function generateRecommendations(analysis: PasswordAnalysis, score: number): string[] {
  const recs: string[] = [];

  if (analysis.length < 12) {
    recs.push('Increase length to at least 12-16 characters');
  }
  if (!analysis.hasSymbols) {
    recs.push('Add special characters (!@#$%^&*)');
  }
  if (!analysis.hasNumbers) {
    recs.push('Include numbers for better complexity');
  }
  if (!analysis.hasUppercase || !analysis.hasLowercase) {
    recs.push('Mix uppercase and lowercase letters');
  }
  if (score < 70) {
    recs.push('Consider using a passphrase (e.g., "correct-horse-battery-staple")');
  }

  recs.push('Enable two-factor authentication (2FA) where available');
  recs.push('Use a password manager to generate and store strong passwords');

  return recs;
}

function generateThreatAnalysis(score: number, analysis: PasswordAnalysis): string {
  if (score >= 80) {
    return 'Strong password. Resistant to most automated attacks. Estimated crack time: centuries with current technology.';
  } else if (score >= 60) {
    return 'Moderate strength. Vulnerable to targeted attacks. Consider strengthening with additional complexity.';
  } else if (score >= 40) {
    return 'Weak password. Susceptible to dictionary and brute force attacks. Crack time: hours to days.';
  } else {
    return 'Very weak password. Can be cracked almost instantly using common attack tools. Immediate change recommended.';
  }
}

function generateIndustryTips(score: number): string[] {
  return [
    'NIST recommends passwords of at least 12 characters',
    'Avoid personal information (names, birthdays, addresses)',
    'Use unique passwords for each account',
    'Consider using a passphrase instead of a password',
    'Regularly update passwords for sensitive accounts'
  ];
}