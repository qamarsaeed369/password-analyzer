'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieChartIcon, Clock, Shield, AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';
import { EntropyChart } from './EntropyChart';
import { CompositionChart } from './CompositionChart';
import { CrackTimeChart } from './CrackTimeChart';
import type { PasswordAnalysis } from '@/types';
import { cn } from '@/utils/cn';

interface AdvancedAnalysisProps {
  analysis: PasswordAnalysis | null;
  className?: string;
}

export const AdvancedAnalysis: React.FC<AdvancedAnalysisProps> = ({
  analysis,
  className
}) => {
  const [isDark, setIsDark] = useState(false);

  // Track dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        setIsDark(document.documentElement.classList.contains('dark'));
      }
    };
    
    checkDarkMode();
    
    if (typeof window !== 'undefined') {
      const observer = new MutationObserver(checkDarkMode);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      return () => observer.disconnect();
    }
  }, []);

  if (!analysis) {
    return null;
  }

  // Calculate additional metrics
  const strengthCategory = analysis.score >= 80 ? 'Excellent' : 
                          analysis.score >= 60 ? 'Good' : 
                          analysis.score >= 40 ? 'Fair' : 'Weak';
  
  const entropyCategory = analysis.entropy >= 60 ? 'High' :
                         analysis.entropy >= 40 ? 'Medium' : 'Low';

  const patternRisk = (analysis.patterns?.length || 0) > 0 ? 'High' : 
                     (analysis.dictionaryAnalysis?.matchedWords?.length || 0) > 0 ? 'Medium' : 'Low';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <motion.div
        className={`p-6 rounded-2xl backdrop-blur-md border transition-all ${
          isDark 
            ? 'bg-slate-900/50 border-slate-700/50' 
            : 'bg-white/70 border-gray-200/50'
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${
            isDark 
              ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' 
              : 'bg-gradient-to-br from-indigo-100 to-purple-100'
          }`}>
            <BarChart3 className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Advanced Analysis Dashboard
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Comprehensive password security insights
            </p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-slate-800/50' : 'bg-white/50'
          } border ${isDark ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Strength</p>
                <p className={`text-lg font-bold ${
                  strengthCategory === 'Excellent' ? 'text-green-500' :
                  strengthCategory === 'Good' ? 'text-blue-500' :
                  strengthCategory === 'Fair' ? 'text-yellow-500' : 'text-red-500'
                }`}>{strengthCategory}</p>
              </div>
              <TrendingUp className={`w-5 h-5 ${
                strengthCategory === 'Excellent' ? 'text-green-500' :
                strengthCategory === 'Good' ? 'text-blue-500' :
                strengthCategory === 'Fair' ? 'text-yellow-500' : 'text-red-500'
              }`} />
            </div>
          </div>

          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-slate-800/50' : 'bg-white/50'
          } border ${isDark ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Entropy Level</p>
                <p className={`text-lg font-bold ${
                  entropyCategory === 'High' ? 'text-green-500' :
                  entropyCategory === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                }`}>{entropyCategory}</p>
              </div>
              <Zap className={`w-5 h-5 ${
                entropyCategory === 'High' ? 'text-green-500' :
                entropyCategory === 'Medium' ? 'text-yellow-500' : 'text-red-500'
              }`} />
            </div>
          </div>

          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-slate-800/50' : 'bg-white/50'
          } border ${isDark ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pattern Risk</p>
                <p className={`text-lg font-bold ${
                  patternRisk === 'Low' ? 'text-green-500' :
                  patternRisk === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                }`}>{patternRisk}</p>
              </div>
              <Target className={`w-5 h-5 ${
                patternRisk === 'Low' ? 'text-green-500' :
                patternRisk === 'Medium' ? 'text-yellow-500' : 'text-red-500'
              }`} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Row 1: Entropy and Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className={`p-6 rounded-2xl backdrop-blur-md border transition-all ${
            isDark 
              ? 'bg-slate-900/50 border-slate-700/50' 
              : 'bg-white/70 border-gray-200/50'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Entropy Analysis
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Password randomness measurement
              </p>
            </div>
          </div>
          <EntropyChart analysis={analysis} isDark={isDark} />
        </motion.div>

        <motion.div
          className={`p-6 rounded-2xl backdrop-blur-md border transition-all ${
            isDark 
              ? 'bg-slate-900/50 border-slate-700/50' 
              : 'bg-white/70 border-gray-200/50'
          }`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <PieChartIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Character Composition
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Character type distribution
              </p>
            </div>
          </div>
          <CompositionChart analysis={analysis} isDark={isDark} />
        </motion.div>
      </div>

      {/* Charts Row 2: Crack Time and Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className={`p-6 rounded-2xl backdrop-blur-md border transition-all ${
            isDark 
              ? 'bg-slate-900/50 border-slate-700/50' 
              : 'bg-white/70 border-gray-200/50'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Crack Time Estimation
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Time to break password
              </p>
            </div>
          </div>
          <CrackTimeChart analysis={analysis} isDark={isDark} />
        </motion.div>

        {/* Industry Standard Benchmarking - zxcvbn */}
        {analysis.zxcvbn && (
          <motion.div
            className={`p-6 rounded-2xl backdrop-blur-md border transition-all ${
              isDark 
                ? 'bg-slate-900/50 border-slate-700/50' 
                : 'bg-white/70 border-gray-200/50'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Industry Benchmarking
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  vs zxcvbn standard
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PassShield Score</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.round(analysis.score)}<span className="text-sm">/100</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(analysis.entropy)} bits entropy
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min(analysis.score, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl border border-green-200/50 dark:border-green-700/50">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">zxcvbn Score</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      {analysis.zxcvbn.score}<span className="text-sm">/4</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    10^{Math.round(analysis.zxcvbn.guesses_log10)} guesses
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all" 
                      style={{ width: `${(analysis.zxcvbn.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {analysis.zxcvbn.feedback.warning && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">{analysis.zxcvbn.feedback.warning}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Additional Analysis Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Security Recommendations */}
        <motion.div
          className={`p-6 rounded-2xl backdrop-blur-md border transition-all ${
            isDark 
              ? 'bg-slate-900/50 border-slate-700/50' 
              : 'bg-white/70 border-gray-200/50'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Security Issues
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Identified vulnerabilities
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(analysis.patterns?.length || 0) > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Predictable Patterns
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {analysis.patterns?.length || 0} pattern{(analysis.patterns?.length || 0) > 1 ? 's' : ''} detected
                </p>
              </div>
            )}

            {(analysis.dictionaryAnalysis?.matchedWords?.length || 0) > 0 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Dictionary Words
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  {analysis.dictionaryAnalysis?.matchedWords?.length || 0} common word{(analysis.dictionaryAnalysis?.matchedWords?.length || 0) > 1 ? 's' : ''} found
                </p>
              </div>
            )}

            {(analysis.patterns?.length || 0) === 0 && (analysis.dictionaryAnalysis?.matchedWords?.length || 0) === 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  No Major Issues
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Good security baseline
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Password Metrics */}
        <motion.div
          className={`p-6 rounded-2xl backdrop-blur-md border transition-all ${
            isDark 
              ? 'bg-slate-900/50 border-slate-700/50' 
              : 'bg-white/70 border-gray-200/50'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Password Metrics
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Detailed statistics
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Length</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {analysis.composition.length} chars
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Unique Characters</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {analysis.entropyDetails.uniqueCharCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Character Sets</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {[
                  analysis.composition.uppercase > 0,
                  analysis.composition.lowercase > 0,
                  analysis.composition.digits > 0,
                  analysis.composition.symbols > 0
                ].filter(Boolean).length}/4
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Entropy</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(analysis.entropy)} bits
              </span>
            </div>
          </div>
        </motion.div>

        {/* Improvement Suggestions */}
        <motion.div
          className={`p-6 rounded-2xl backdrop-blur-md border transition-all ${
            isDark 
              ? 'bg-slate-900/50 border-slate-700/50' 
              : 'bg-white/70 border-gray-200/50'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Improvement Tips
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Enhancement suggestions
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {analysis.score < 80 && (
              <>
                {analysis.composition.length < 12 && (
                  <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    • Increase length to 12+ characters
                  </div>
                )}
                {analysis.composition.uppercase === 0 && (
                  <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    • Add uppercase letters (A-Z)
                  </div>
                )}
                {analysis.composition.lowercase === 0 && (
                  <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    • Add lowercase letters (a-z)
                  </div>
                )}
                {analysis.composition.digits === 0 && (
                  <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    • Add numbers (0-9)
                  </div>
                )}
                {analysis.composition.symbols === 0 && (
                  <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    • Add symbols (!@#$%^&*)
                  </div>
                )}
                {(analysis.patterns?.length || 0) > 0 && (
                  <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    • Avoid predictable patterns
                  </div>
                )}
                {(analysis.dictionaryAnalysis?.matchedWords?.length || 0) > 0 && (
                  <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    • Avoid dictionary words
                  </div>
                )}
              </>
            )}
            
            {analysis.score >= 80 && (
              <div className={`text-xs ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                ✓ Password meets security standards!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};