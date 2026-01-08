'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import type { PasswordAnalysis } from '@/types';
import { cn } from '@/utils/cn';

interface PasswordStrengthMeterProps {
  analysis: PasswordAnalysis | null;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  analysis,
  className
}) => {
  const strengthConfig = useMemo(() => {
    if (!analysis) return null;

    const configs = {
      'very-weak': {
        color: 'bg-red-500',
        textColor: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-700',
        icon: XCircle,
        label: 'Very Weak',
        description: 'Extremely vulnerable to attacks'
      },
      'weak': {
        color: 'bg-orange-500',
        textColor: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/30',
        borderColor: 'border-orange-200 dark:border-orange-700',
        icon: AlertTriangle,
        label: 'Weak',
        description: 'Vulnerable to common attacks'
      },
      'fair': {
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-200 dark:border-yellow-700',
        icon: Info,
        label: 'Fair',
        description: 'Some protection against attacks'
      },
      'good': {
        color: 'bg-blue-500',
        textColor: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        borderColor: 'border-blue-200 dark:border-blue-700',
        icon: Shield,
        label: 'Good',
        description: 'Good protection against most attacks'
      },
      'strong': {
        color: 'bg-green-500',
        textColor: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/30',
        borderColor: 'border-green-200 dark:border-green-700',
        icon: CheckCircle,
        label: 'Strong',
        description: 'Excellent protection against attacks'
      }
    };

    return configs[analysis.strength as keyof typeof configs];
  }, [analysis]);

  if (!analysis || !strengthConfig) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gray-300 dark:bg-slate-600 w-0" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Enter a password to see strength analysis</p>
      </div>
    );
  }

  const Icon = strengthConfig.icon;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Strength</span>
          <span className={cn('text-sm font-semibold', strengthConfig.textColor)}>
            {Math.round(analysis.score)}/100
          </span>
        </div>
        
        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', strengthConfig.color)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(analysis.score)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Strength Label */}
      <motion.div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border',
          strengthConfig.bgColor,
          strengthConfig.borderColor
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Icon className={cn('w-5 h-5', strengthConfig.textColor)} />
        <div>
          <h3 className={cn('font-semibold', strengthConfig.textColor)}>
            {strengthConfig.label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{strengthConfig.description}</p>
        </div>
      </motion.div>

      {/* Feedback */}
      {analysis.feedback.warning && (
        <motion.div
          className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{analysis.feedback.warning}</p>
        </motion.div>
      )}

      {analysis.feedback.suggestions.length > 0 && (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Suggestions</h4>
          <ul className="space-y-1">
            {analysis.feedback.suggestions.map((suggestion: string, index: number) => (
              <motion.li
                key={index}
                className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full" />
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};