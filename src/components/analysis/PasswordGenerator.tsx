'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Wand2 } from 'lucide-react';
import { PasswordGenerator as Generator } from '@/utils/passwordGenerator';
import type { PasswordGeneratorOptions } from '@/types';
import { cn } from '@/utils/cn';

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
  className?: string;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onPasswordGenerated,
  className
}) => {
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [usePassphrase, setUsePassphrase] = useState(false);

  const generatePassword = useCallback(() => {
    try {
      let password: string;
      
      if (usePassphrase) {
        password = Generator.generatePassphrase(4, '-');
      } else {
        password = Generator.generate(options);
      }
      
      setGeneratedPassword(password);
      onPasswordGenerated(password);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  }, [options, usePassphrase, onPasswordGenerated]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  }, [generatedPassword]);

  const estimatedStrength = usePassphrase ? 85 : Generator.estimateStrength(options);

  const updateOption = <K extends keyof PasswordGeneratorOptions>(
    key: K,
    value: PasswordGeneratorOptions[K]
  ) => {
    setOptions((prev: PasswordGeneratorOptions) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Password Generator</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUsePassphrase(!usePassphrase)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              usePassphrase
                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            )}
          >
            {usePassphrase ? 'Passphrase' : 'Password'}
          </button>
        </div>
      </div>

      {!usePassphrase && (
        <div className="space-y-4">
          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Length</label>
              <span className="text-sm text-gray-500 dark:text-gray-400">{options.length} characters</span>
            </div>
            <input
              type="range"
              min="4"
              max="50"
              value={options.length}
              onChange={(e) => updateOption('length', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Character Type Options */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 dark:bg-slate-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 dark:bg-slate-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 dark:bg-slate-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => updateOption('includeSymbols', e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 dark:bg-slate-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Symbols (!@#$)</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 dark:bg-slate-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Exclude similar</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 dark:bg-slate-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Exclude ambiguous</span>
            </label>
          </div>
        </div>
      )}

      {/* Estimated Strength */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Strength</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(estimatedStrength)}/100</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              estimatedStrength >= 80 ? 'bg-green-500' :
              estimatedStrength >= 60 ? 'bg-blue-500' :
              estimatedStrength >= 40 ? 'bg-yellow-500' :
              'bg-red-500'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${estimatedStrength}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Wand2 className="w-4 h-4" />
        Generate {usePassphrase ? 'Passphrase' : 'Password'}
      </button>

      {/* Generated Password Display */}
      {generatedPassword && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="relative">
            <div className="bg-gray-50 dark:bg-slate-800 border dark:border-slate-600 rounded-lg p-3 font-mono text-sm break-all text-gray-800 dark:text-gray-200">
              {generatedPassword}
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <motion.button
                onClick={copyToClipboard}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
              
              <motion.button
                onClick={generatePassword}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <button
            onClick={() => onPasswordGenerated(generatedPassword)}
            className="w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Use This Password
          </button>
        </motion.div>
      )}
    </div>
  );
};