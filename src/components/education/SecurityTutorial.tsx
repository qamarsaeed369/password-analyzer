'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Clock, 
  Target,
  ChevronLeft,
  ChevronRight,
  X 
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  icon: React.ElementType;
  example?: string;
  tip?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'intro',
    title: 'Why Password Security Matters',
    content: 'Strong passwords are your first line of defense against cyber attacks. Weak passwords can be cracked in seconds, while strong ones can take centuries.',
    icon: Shield,
    tip: 'A single weak password can compromise your entire digital life.'
  },
  {
    id: 'length',
    title: 'Length is Strength',
    content: 'Every additional character exponentially increases password security. A 12-character password is vastly stronger than an 8-character one.',
    icon: Target,
    example: '8 chars: MyPass8! → 12 chars: MyLongPass123!',
    tip: 'Aim for at least 12 characters for good security.'
  },
  {
    id: 'complexity',
    title: 'Mix Character Types',
    content: 'Use a combination of uppercase letters, lowercase letters, numbers, and special characters to maximize your password\'s strength.',
    icon: Lock,
    example: 'password123 → P@ssw0rd123!',
    tip: 'Each character type adds to your password\'s unpredictability.'
  },
  {
    id: 'patterns',
    title: 'Avoid Predictable Patterns',
    content: 'Common patterns like keyboard walks (qwerty), sequences (123), and substitutions (@ for a) are easily detected by attackers.',
    icon: AlertTriangle,
    example: 'Weak: qwerty123, abc123, p@ssw0rd',
    tip: 'Randomness is key to a strong password.'
  },
  {
    id: 'cracking',
    title: 'How Passwords Get Cracked',
    content: 'Attackers use dictionary attacks, brute force, and pattern recognition. They start with common passwords and work their way up.',
    icon: Clock,
    tip: 'The longer and more random your password, the harder it is to crack.'
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    content: 'Use unique passwords for each account, consider passphrases, enable two-factor authentication, and use a password manager.',
    icon: Eye,
    tip: 'A password manager can generate and store strong, unique passwords for all your accounts.'
  }
];

interface SecurityTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const SecurityTutorial: React.FC<SecurityTutorialProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            'bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Password Security Guide
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="flex items-center gap-2 mb-4">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300 cursor-pointer',
                    index === currentStep
                      ? 'bg-primary-600 flex-1'
                      : index < currentStep
                      ? 'bg-primary-300 w-8'
                      : 'bg-gray-200 dark:bg-slate-600 w-8'
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {tutorialSteps.length}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {step.title}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.content}
                </p>

                {step.example && (
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Example:</h4>
                    <code className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {step.example}
                    </code>
                  </div>
                )}

                {step.tip && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Pro Tip:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{step.tip}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                currentStep === 0
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {currentStep === tutorialSteps.length - 1 ? (
                <button
                  onClick={onClose}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};