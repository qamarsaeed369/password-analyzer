'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, AlertTriangle, Lightbulb, Target, Loader, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { PasswordAnalysis, AIPasswordAnalysis } from '@/types';
import { getAIModel, type PasswordFeatures } from '@/lib/ai-model-client';
import {
  generateVulnerabilities,
  generateRecommendations,
  generateThreatAnalysis,
  generateIndustryTips,
  type HelperAnalysisInput
} from '@/lib/analysis-utils';

interface AIAnalysisProps {
  analysis: PasswordAnalysis;
  onAIAnalysisUpdate?: (aiAnalysis: AIPasswordAnalysis) => void;
  className?: string;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({
  analysis,
  onAIAnalysisUpdate,
  className
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIPasswordAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performClientSideAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      // Artificial delay for UX (too fast feels fake) - reduced from network latency time
      await new Promise(resolve => setTimeout(resolve, 800));

      // 1. Prepare features for AI Model
      // We reconstruct the feature vector from the analysis object 
      // without needing the raw password string.
      const comp = analysis.composition;
      const entropyDetails = analysis.entropyDetails;

      const features: PasswordFeatures = {
        length: comp.length,
        hasLowercase: comp.lowercase > 0 ? 1 : 0,
        hasUppercase: comp.uppercase > 0 ? 1 : 0,
        hasDigit: comp.digits > 0 ? 1 : 0,
        hasSpecial: comp.symbols > 0 ? 1 : 0,
        entropy: analysis.entropy,
        uniqueChars: entropyDetails.uniqueCharCount,
        uniqueRatio: comp.length > 0 ? entropyDetails.uniqueCharCount / comp.length : 0,
        charDiversity: (comp.lowercase > 0 ? 1 : 0) +
          (comp.uppercase > 0 ? 1 : 0) +
          (comp.digits > 0 ? 1 : 0) +
          (comp.symbols > 0 ? 1 : 0)
      };

      // 2. Run TensorFlow.js Prediction (Client-Side)
      const aiModel = getAIModel();
      const securityScore = await aiModel.predictFeatures(features);

      // 3. Generate Report Data
      const helperInput: HelperAnalysisInput = {
        length: comp.length,
        hasLowercase: comp.lowercase > 0,
        hasUppercase: comp.uppercase > 0,
        hasNumbers: comp.digits > 0,
        hasSymbols: comp.symbols > 0,
        entropy: analysis.entropy,
        password: '' // Not needed for helpers
      };

      const vulnerabilities = generateVulnerabilities(helperInput, securityScore);
      const recommendations = generateRecommendations(helperInput, securityScore);
      const threatAnalysis = generateThreatAnalysis(securityScore, helperInput);
      const industryTips = generateIndustryTips(securityScore);

      const newAiAnalysis: AIPasswordAnalysis = {
        securityScore: Math.round(securityScore),
        vulnerabilities,
        recommendations,
        threatAnalysis,
        industryTips,
        status: 'success' as const,
        timestamp: Date.now()
      };

      setAiAnalysis(newAiAnalysis);
      onAIAnalysisUpdate?.(newAiAnalysis);

    } catch (err) {
      console.error(err);
      const errorMsg = 'Failed to analyze password securely';
      setError(errorMsg);

      // Error state
      const errorAnalysis: AIPasswordAnalysis = {
        securityScore: 0,
        vulnerabilities: [],
        recommendations: [],
        threatAnalysis: '',
        industryTips: [],
        timestamp: Date.now(),
        status: 'error' as const,
        error: errorMsg
      };
      setAiAnalysis(errorAnalysis);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    performClientSideAnalysis();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number, isDark: boolean) => {
    if (score >= 80) return isDark ? 'bg-green-900/30 border-green-700/50' : 'bg-green-50 border-green-200';
    if (score >= 60) return isDark ? 'bg-yellow-900/30 border-yellow-700/50' : 'bg-yellow-50 border-yellow-200';
    return isDark ? 'bg-red-900/30 border-red-700/50' : 'bg-red-50 border-red-200';
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  return (
    <div className={cn('space-y-6', className)}>
      {/* AI Analysis Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark
            ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
            : 'bg-gradient-to-br from-purple-100 to-pink-100'
            }`}>
            <Sparkles className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Deep Security Analysis
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Advanced threat assessment and recommendations
            </p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${loading
            ? 'opacity-50 cursor-not-allowed'
            : `hover:scale-105 ${isDark
              ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
            }`
            }`}
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {loading ? 'Analyzing...' : 'Get Deep Analysis'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50/50 border-gray-200/50'
              }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Loader className="w-5 h-5 animate-spin text-purple-500" />
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Analyzing your password security...
              </span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border ${isDark ? 'bg-red-900/30 border-red-700/50' : 'bg-red-50 border-red-200'
              }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className={`text-sm ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                {error}
              </span>
            </div>
          </motion.div>
        )}

        {aiAnalysis && aiAnalysis.status === 'success' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* AI Security Score */}
            <div className={`p-4 rounded-xl border ${getScoreBgColor(aiAnalysis.securityScore, isDark)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Security Score
                </span>
                <span className={`text-2xl font-bold ${getScoreColor(aiAnalysis.securityScore)}`}>
                  {aiAnalysis.securityScore}/100
                </span>
              </div>
              <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${aiAnalysis.securityScore >= 80 ? 'bg-green-500' :
                    aiAnalysis.securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${aiAnalysis.securityScore}%` }}
                />
              </div>
            </div>

            {/* Vulnerabilities */}
            {aiAnalysis.vulnerabilities.length > 0 && (
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Security Vulnerabilities
                  </span>
                </div>
                <div className="space-y-2">
                  {aiAnalysis.vulnerabilities.map((vulnerability, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${isDark ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'
                        }`}
                    >
                      <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                        {vulnerability}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {aiAnalysis.recommendations.length > 0 && (
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Recommendations
                  </span>
                </div>
                <div className="space-y-2">
                  {aiAnalysis.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'
                        }`}
                    >
                      <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                        {recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Threat Analysis */}
            {aiAnalysis.threatAnalysis && (
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Current Threat Landscape
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {aiAnalysis.threatAnalysis}
                </p>
              </div>
            )}

            {/* Industry Tips */}
            {aiAnalysis.industryTips.length > 0 && (
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💡</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Industry Best Practices
                  </span>
                </div>
                <div className="grid gap-2">
                  {aiAnalysis.industryTips.map((tip, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'
                        }`}
                    >
                      <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!aiAnalysis && !loading && (
        <div className={`p-8 rounded-xl border-2 border-dashed text-center ${isDark
          ? 'border-slate-600 text-gray-400'
          : 'border-gray-300 text-gray-500'
          }`}>
          <Sparkles className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-400'
            }`} />
          <h4 className="font-semibold mb-2">Deep Analysis Ready</h4>
          <p className="text-sm">
            Click &quot;Get Deep Analysis&quot; to receive advanced security insights and recommendations
          </p>
        </div>
      )}
    </div>
  );
};