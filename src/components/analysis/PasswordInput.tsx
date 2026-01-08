'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { PasswordAnalyzer } from '@/utils/passwordAnalyzer';
import { BreachDetection } from './BreachDetection';
import { cn } from '@/utils/cn';
import type { PasswordAnalysis } from '@/types';

interface PasswordInputProps {
  onAnalysisChange: (analysis: PasswordAnalysis | null) => void;
  className?: string;
  initialPassword?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  onAnalysisChange,
  className,
  initialPassword
}) => {
  const [password, setPassword] = useState(initialPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Update password when initialPassword changes
  useEffect(() => {
    if (initialPassword) {
      setPassword(initialPassword);
      const newAnalysis = PasswordAnalyzer.analyze(initialPassword);
      onAnalysisChange(newAnalysis);
    }
  }, [initialPassword, onAnalysisChange]);

  const analysis = useMemo(() => {
    if (!password) return null;
    return PasswordAnalyzer.analyze(password);
  }, [password]);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    const newAnalysis = value ? PasswordAnalyzer.analyze(value) : null;
    onAnalysisChange(newAnalysis);
  }, [onAnalysisChange]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  }, [password]);

  const getCharacterStrength = useCallback((_char: string, index: number) => {
    if (!analysis) return 'neutral';
    
    const score = analysis.score;
    const patterns = analysis.patterns;
    
    // Check if character is part of a weak pattern
    const isInWeakPattern = patterns.some((pattern) => 
      index >= pattern.i && index <= pattern.j && 
      ['dictionary', 'spatial', 'sequence', 'repeat'].includes(pattern.pattern)
    );
    
    if (isInWeakPattern) return 'weak';
    if (score >= 80) return 'strong';
    if (score >= 60) return 'medium';
    if (score >= 40) return 'fair';
    return 'weak';
  }, [analysis]);

  const renderPasswordCharacters = () => {
    if (!password) return null;

    return (
      <div className="relative p-6 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-2xl border border-gray-200/50 dark:border-slate-600/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl" />
        <div className="relative flex flex-wrap gap-2 font-mono text-lg min-h-[3rem] items-center justify-center">
          <AnimatePresence>
            {password.split('').map((char, index) => {
              const strength = getCharacterStrength(char, index);
              const strengthClass = {
                weak: 'password-char weak',
                fair: 'password-char medium',
                medium: 'password-char medium',
                strong: 'password-char strong',
                neutral: 'password-char'
              }[strength];

              return (
                <motion.span
                  key={`${index}-${char}`}
                  className={strengthClass}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  whileHover={{ 
                    scale: 1.2, 
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                >
                  {showPassword ? char : '●'}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${
          password ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        } transition-colors duration-200`}>
          🔐 Enter Your Password
        </label>
        
        <div className="relative group">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={`w-full px-6 py-4 pr-24 text-lg font-medium border-2 rounded-2xl transition-all duration-300 backdrop-blur-sm ${
              password
                ? 'text-black border-blue-500 bg-blue-50/50 dark:bg-slate-800/50 dark:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20'
                : 'text-white border-gray-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 hover:border-gray-400 dark:hover:border-slate-500 focus:ring-4 focus:ring-gray-500/10'
            } focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400`}
            placeholder="Start typing to analyze security..."
            autoComplete="new-password"
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {password && (
              <motion.button
                type="button"
                onClick={copyToClipboard}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  copied 
                    ? 'text-green-500 bg-green-100/50 dark:bg-green-900/30' 
                    : 'text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={copied ? 'Copied!' : 'Copy password'}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </motion.button>
            )}
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2.5 rounded-xl transition-all duration-200 text-gray-400 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/30"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Input glow effect */}
          {password && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10 opacity-50" />
          )}
        </div>
      </div>

      {/* Character visualization */}
      {password && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              🔍 Character Analysis
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-sm" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">Weak</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-sm" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">Fair</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-sm" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">Strong</span>
              </div>
            </div>
          </div>
          {renderPasswordCharacters()}
        </motion.div>
      )}

      {/* Quick stats */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            {
              value: analysis.composition.length,
              label: 'Characters',
              icon: '📏',
              color: analysis.composition.length >= 12 ? 'green' : analysis.composition.length >= 8 ? 'yellow' : 'red'
            },
            {
              value: Math.round(analysis.entropy),
              label: 'Entropy Bits',
              icon: '🔢',
              color: analysis.entropy >= 50 ? 'green' : analysis.entropy >= 30 ? 'yellow' : 'red'
            },
            {
              value: Math.round(analysis.score),
              label: 'Security Score',
              icon: '🎯',
              color: analysis.score >= 80 ? 'green' : analysis.score >= 60 ? 'yellow' : 'red'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`relative p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 cursor-pointer ${
                stat.color === 'green' 
                  ? 'bg-green-50/80 dark:bg-green-900/30 border-green-200/50 dark:border-green-700/50 hover:shadow-lg hover:shadow-green-500/25' 
                  : stat.color === 'yellow'
                  ? 'bg-yellow-50/80 dark:bg-yellow-900/30 border-yellow-200/50 dark:border-yellow-700/50 hover:shadow-lg hover:shadow-yellow-500/25'
                  : 'bg-red-50/80 dark:bg-red-900/30 border-red-200/50 dark:border-red-700/50 hover:shadow-lg hover:shadow-red-500/25'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl">{stat.icon}</div>
                <div className={`text-2xl font-bold ${
                  stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  stat.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Breach Detection */}
      {password && (
        <BreachDetection password={password} />
      )}
    </div>
  );
};