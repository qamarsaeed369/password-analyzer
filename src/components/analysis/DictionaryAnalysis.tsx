'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Book, AlertTriangle, CheckCircle, Shield, Eye, Calendar, User, Keyboard } from 'lucide-react';
import type { PasswordAnalysis } from '@/types';
import { cn } from '@/utils/cn';

interface DictionaryAnalysisProps {
  analysis: PasswordAnalysis;
  className?: string;
}

export const DictionaryAnalysis: React.FC<DictionaryAnalysisProps> = ({ analysis, className }) => {
  const { dictionaryAnalysis } = analysis;

  if (!dictionaryAnalysis.isInDictionary) {
    return (
      <motion.div
        className={cn('p-4 bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/50 rounded-2xl', className)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Dictionary Check Passed</h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              Password not found in common dictionaries
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'common-passwords':
        return <Shield className="w-4 h-4" />;
      case 'dictionary-words':
        return <Book className="w-4 h-4" />;
      case 'names':
        return <User className="w-4 h-4" />;
      case 'keyboard-patterns':
        return <Keyboard className="w-4 h-4" />;
      case 'years':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'common-passwords':
        return 'Common Passwords';
      case 'dictionary-words':
        return 'Dictionary Words';
      case 'names':
        return 'Common Names';
      case 'keyboard-patterns':
        return 'Keyboard Patterns';
      case 'years':
        return 'Years/Dates';
      case 'password-variations':
        return 'Password Variations';
      case 'word-variations':
        return 'Word Variations';
      case 'word-with-numbers':
        return 'Words + Numbers';
      case 'name-with-numbers':
        return 'Names + Numbers';
      case 'reversed-words':
        return 'Reversed Words';
      case 'contains-dictionary-word':
        return 'Contains Dictionary Word';
      case 'contains-name':
        return 'Contains Name';
      case 'contains-year':
        return 'Contains Year';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very-weak':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700';
      case 'weak':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700';
      case 'moderate':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <motion.div
      className={cn('space-y-4', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Main Alert */}
      <div className={cn('p-4 border rounded-2xl', getStrengthColor(dictionaryAnalysis.strength))}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/50 dark:bg-black/20 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Dictionary Attack Vulnerability</h3>
            <p className="text-sm opacity-90">
              Password found in {dictionaryAnalysis.dictionaryType.length} dictionary type{dictionaryAnalysis.dictionaryType.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="ml-auto">
            <div className="text-right">
              <div className="text-2xl font-bold">{dictionaryAnalysis.score}/100</div>
              <div className="text-xs opacity-75">Dictionary Score</div>
            </div>
          </div>
        </div>

        {/* Dictionary Types */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Found in:</h4>
          <div className="flex flex-wrap gap-2">
            {dictionaryAnalysis.dictionaryType.map((type, index) => (
              <motion.div
                key={type}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/30 dark:bg-black/20 rounded-lg text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {getTypeIcon(type)}
                <span>{getTypeLabel(type)}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Matched Words */}
        {dictionaryAnalysis.matchedWords.length > 0 && (
          <div className="mt-3 space-y-2">
            <h4 className="font-medium text-sm">Matched Terms:</h4>
            <div className="flex flex-wrap gap-2">
              {dictionaryAnalysis.matchedWords.slice(0, 10).map((word, index) => (
                <motion.code
                  key={`${word}-${index}`}
                  className="px-2 py-1 bg-white/40 dark:bg-black/30 rounded text-sm font-mono border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {word.length > 15 ? `${word.slice(0, 15)}...` : word}
                </motion.code>
              ))}
              {dictionaryAnalysis.matchedWords.length > 10 && (
                <span className="px-2 py-1 text-sm opacity-75">
                  +{dictionaryAnalysis.matchedWords.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">Recommendations</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li>• Use a combination of random words instead of dictionary words</li>
              <li>• Consider using a passphrase with 4+ unrelated words</li>
              <li>• Avoid personal information (names, dates, etc.)</li>
              <li>• Use a password manager to generate unique passwords</li>
              {dictionaryAnalysis.dictionaryType.includes('keyboard-patterns') && (
                <li>• Avoid keyboard patterns - they&apos;re easily guessed by attackers</li>
              )}
              {dictionaryAnalysis.dictionaryType.includes('word-variations') && (
                <li>• Simple character substitutions don&apos;t significantly improve security</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};