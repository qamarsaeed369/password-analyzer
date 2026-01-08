'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Database, Target, Award, AlertCircle, CheckCircle2, Trophy } from 'lucide-react';
import type { PasswordAnalysis } from '@/types';
import { cn } from '@/utils/cn';

interface DatasetInsightsProps {
  analysis: PasswordAnalysis;
  className?: string;
}

export const DatasetInsights: React.FC<DatasetInsightsProps> = ({ analysis, className }) => {
  const { datasetInsights } = analysis;

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'top-1%':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'top-5%':
        return <Award className="w-5 h-5 text-blue-500" />;
      case 'top-10%':
        return <Target className="w-5 h-5 text-green-500" />;
      case 'top-25%':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'top-1%':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'top-5%':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'top-10%':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'top-25%':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      default:
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
    }
  };

  const getScoreColor = (score: number, type: 'similarity' | 'uniqueness' | 'predictability') => {
    if (type === 'predictability') {
      // For predictability, lower is better
      if (score <= 25) return 'text-green-600 dark:text-green-400';
      if (score <= 50) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    } else {
      // For similarity and uniqueness, higher is better
      if (score >= 70) return 'text-green-600 dark:text-green-400';
      if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <motion.div
      className={cn('space-y-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dataset Comparison Header */}
      <div className={cn('p-4 rounded-2xl shadow-lg', getRankColor(datasetInsights.datasetComparison.rank))}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {getRankIcon(datasetInsights.datasetComparison.rank)}
            <div>
              <h3 className="font-bold text-lg">Dataset Ranking</h3>
              <p className="text-sm opacity-90">
                Better than {datasetInsights.datasetComparison.betterThan}% of passwords
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{datasetInsights.datasetComparison.rank}</div>
            <div className="text-sm opacity-75">Rank</div>
          </div>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">
          {datasetInsights.datasetComparison.recommendation}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Similarity Score */}
        <motion.div
          className="p-4 bg-white/70 dark:bg-slate-800/70 border border-gray-200/50 dark:border-slate-600/50 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Similarity</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">vs common patterns</p>
              </div>
            </div>
          </div>
          <div className={cn('text-2xl font-bold mb-1', getScoreColor(datasetInsights.similarityScore, 'similarity'))}>
            {Math.round(datasetInsights.similarityScore)}%
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${datasetInsights.similarityScore}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Uniqueness Score */}
        <motion.div
          className="p-4 bg-white/70 dark:bg-slate-800/70 border border-gray-200/50 dark:border-slate-600/50 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Uniqueness</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">character combinations</p>
              </div>
            </div>
          </div>
          <div className={cn('text-2xl font-bold mb-1', getScoreColor(datasetInsights.uniquenessScore, 'uniqueness'))}>
            {Math.round(datasetInsights.uniquenessScore)}%
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${datasetInsights.uniquenessScore}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Predictability Index */}
        <motion.div
          className="p-4 bg-white/70 dark:bg-slate-800/70 border border-gray-200/50 dark:border-slate-600/50 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Predictability</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">attack vulnerability</p>
              </div>
            </div>
          </div>
          <div className={cn('text-2xl font-bold mb-1', getScoreColor(datasetInsights.predictabilityIndex, 'predictability'))}>
            {Math.round(datasetInsights.predictabilityIndex)}%
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${datasetInsights.predictabilityIndex}%` }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Pattern Analysis */}
      {datasetInsights.patternAnalysis.followsCommonPattern && (
        <motion.div
          className="p-4 bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/50 rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="space-y-2">
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Pattern Detected</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Your password follows a <span className="font-mono font-bold">{datasetInsights.patternAnalysis.patternType}</span> pattern
                </p>
              </div>
              
              {datasetInsights.patternAnalysis.variations.length > 0 && (
                <div className="space-y-1">
                  <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Recommendations:</h5>
                  <ul className="space-y-1">
                    {datasetInsights.patternAnalysis.variations.slice(0, 3).map((variation, index) => (
                      <li key={index} className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">•</span>
                        {variation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Dataset Statistics Summary */}
      <motion.div
        className="p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border border-gray-200/50 dark:border-slate-600/50 rounded-2xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">Dataset Analysis</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Analysis based on 10+ million real-world passwords from security breaches. 
              Your password is compared against common patterns, character usage, and attack vectors 
              to provide realistic security assessments.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
              <span>📊 10M+ passwords analyzed</span>
              <span>🔍 8 pattern categories</span>
              <span>📈 Real-world breach data</span>
              <span>⚡ Instant analysis</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};