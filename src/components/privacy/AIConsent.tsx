'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Check, AlertCircle, Lock, Eye, Users, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AIConsentProps {
  onConsentChange: (hasConsent: boolean) => void;
  className?: string;
}

export const AIConsent: React.FC<AIConsentProps> = ({
  onConsentChange,
  className
}) => {
  const [showModal, setShowModal] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const storedConsent = localStorage.getItem('ai-analysis-consent');
    const storedAsked = localStorage.getItem('ai-consent-asked');

    if (storedConsent === 'true') {
      setHasConsent(true);
      onConsentChange(true);
    }

    if (storedAsked !== 'true') {
      // Show consent modal after a delay for new users
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [onConsentChange]);

  const handleConsent = (consent: boolean) => {
    setHasConsent(consent);
    setShowModal(false);

    localStorage.setItem('ai-analysis-consent', consent.toString());
    localStorage.setItem('ai-consent-asked', 'true');

    onConsentChange(consent);
  };

  const openConsentModal = () => {
    setShowModal(true);
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  return (
    <>
      {/* Consent Status Indicator */}
      <div className={cn('flex items-center gap-2', className)}>
        <button
          onClick={openConsentModal}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all hover:scale-105 ${hasConsent
            ? isDark
              ? 'bg-green-900/30 text-green-400 border border-green-700/50 hover:bg-green-900/40'
              : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
            : isDark
              ? 'bg-slate-800/50 text-gray-400 border border-slate-600 hover:bg-slate-800/70'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
        >
          {hasConsent ? (
            <>
              <Check className="w-3 h-3" />
              <span>AI Features Enabled</span>
            </>
          ) : (
            <>
              <Shield className="w-3 h-3" />
              <span>AI Privacy Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Consent Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 z-50 rounded-2xl shadow-2xl overflow-hidden ${isDark
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-600'
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300'
                }`}
              style={{
                backdropFilter: 'blur(20px)',
                boxShadow: isDark
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(148, 163, 184, 0.1)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Header */}
              <div className={`p-8 border-b ${isDark ? 'border-slate-600/50 bg-slate-800/30' : 'border-gray-200 bg-gray-50/50'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`relative p-3 rounded-xl ${isDark
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600'
                      : 'bg-gradient-to-br from-purple-500 to-blue-500'
                      }`}>
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            AI-Powered Analysis (TensorFlow.js)
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Client-side Neural Network - No data leaves your device
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`p-2 rounded-xl transition-all hover:scale-105 ${isDark
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                      }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'
                  }`}>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                    What AI Features Offer:
                  </h4>
                  <ul className={`text-sm space-y-2 ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 flex-shrink-0" />
                      <span>Advanced threat pattern recognition</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 flex-shrink-0" />
                      <span>Personalized security recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 flex-shrink-0" />
                      <span>Interactive security chatbot</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'
                  }`}>
                  <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                    <Lock className="w-4 h-4" />
                    Your Privacy is Protected:
                  </h4>
                  <ul className={`text-sm space-y-2 ${isDark ? 'text-green-200' : 'text-green-700'}`}>
                    <li className="flex items-center gap-2">
                      <Eye className="w-3 h-3 flex-shrink-0" />
                      <span>Passwords are hashed before any AI analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-3 h-3 flex-shrink-0" />
                      <span>Only metadata and patterns are analyzed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-3 h-3 flex-shrink-0" />
                      <span>No personal data stored or shared</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-900/20 border border-yellow-700/30' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'
                      }`} />
                    <div className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                      <strong>Your Choice:</strong> AI features are completely optional.
                      You can enable or disable them at any time.
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={`p-8 border-t ${isDark ? 'border-slate-600/50 bg-slate-800/20' : 'border-gray-200 bg-gray-50/30'
                }`}>
                <div className="space-y-3">
                  <button
                    onClick={() => handleConsent(true)}
                    className={`w-full px-6 py-4 rounded-xl font-semibold transition-all text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${isDark
                      ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700'
                      : 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600'
                      }`}
                  >
                    🚀 Enable AI Features
                  </button>
                  <button
                    onClick={() => handleConsent(false)}
                    className={`w-full px-6 py-3 rounded-xl font-medium transition-all ${isDark
                      ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 border border-slate-600/50 hover:border-slate-500'
                      : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200 border border-gray-300/50 hover:border-gray-400'
                      } hover:scale-[1.01]`}
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};