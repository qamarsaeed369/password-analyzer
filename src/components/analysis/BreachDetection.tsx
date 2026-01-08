'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { BreachDetectionService } from '@/utils/breachDetection';
import type { BreachCheckResult } from '@/types';
import { cn } from '@/utils/cn';

interface BreachDetectionProps {
  password: string;
  className?: string;
}

export const BreachDetection: React.FC<BreachDetectionProps> = ({
  password,
  className
}) => {
  const [result, setResult] = useState<BreachCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!password || password.length < 4) {
      setResult(null);
      return;
    }

    const checkBreach = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const breachResult = await BreachDetectionService.checkPassword(password);
        setResult(breachResult);
      } catch (err) {
        setError('Failed to check breach database');
        console.error('Breach check error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(checkBreach, 1000);
    return () => clearTimeout(timeoutId);
  }, [password]);

  if (!password || password.length < 4) {
    return (
      <div className={cn('p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg', className)}>
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Breach Detection</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter a password to check against known data breaches
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn('p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg', className)}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Breach Detection</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Checking against known data breaches...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg', className)}>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Breach Detection</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const severity = BreachDetectionService.getBreachSeverity(result.count || 0);
  const message = BreachDetectionService.getBreachMessage(result);

  const severityConfig = {
    low: {
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-700',
      textColor: 'text-green-700 dark:text-green-300',
      iconColor: 'text-green-600 dark:text-green-400',
      icon: CheckCircle
    },
    medium: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
      borderColor: 'border-yellow-200 dark:border-yellow-700',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      icon: AlertTriangle
    },
    high: {
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      borderColor: 'border-orange-200 dark:border-orange-700',
      textColor: 'text-orange-700 dark:text-orange-300',
      iconColor: 'text-orange-600 dark:text-orange-400',
      icon: AlertTriangle
    },
    critical: {
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-700',
      textColor: 'text-red-700 dark:text-red-300',
      iconColor: 'text-red-600 dark:text-red-400',
      icon: AlertTriangle
    }
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-lg border',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 mt-0.5', config.iconColor)} />
        <div className="flex-1">
          <h4 className={cn('font-medium mb-1', config.textColor)}>
            Breach Detection
          </h4>
          <p className={cn('text-sm', config.textColor)}>
            {message}
          </p>
          
          {result.breached && result.count && result.count > 0 && (
            <div className={cn('mt-2 text-xs', config.textColor)}>
              <p>
                This password appears in {result.count.toLocaleString()} breach records.
                Consider using a unique password that hasn&apos;t been compromised.
              </p>
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <p>
              ℹ️ This check is performed securely using k-anonymity - your full password is never sent to any server.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};