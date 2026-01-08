'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Github, Moon, Sun, HelpCircle, Wand2, Lock, Key, Sparkles, Zap } from 'lucide-react';
import { PasswordInput } from '@/components/analysis/PasswordInput';
import { PasswordStrengthMeter } from '@/components/analysis/PasswordStrengthMeter';
import { PasswordGenerator } from '@/components/analysis/PasswordGenerator';
import { AdvancedAnalysis } from '@/components/analysis/AdvancedAnalysis';
import { AIAnalysis } from '@/components/analysis/AIAnalysis';
import { SecurityTutorial } from '@/components/education/SecurityTutorial';
import type { PasswordAnalysis } from '@/types';
import { cn } from '@/utils/cn';

export default function Home() {
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyze' | 'generate'>('analyze');
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem('hasSeenPasswordTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialClose = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenPasswordTutorial', 'true');
  };

  const handlePasswordFromGenerator = (password: string) => {
    setGeneratedPassword(password);
    setActiveTab('analyze');
  };

  // Clear generated password when switching tabs
  const handleTabSwitch = (tab: 'analyze' | 'generate') => {
    setActiveTab(tab);
    if (tab === 'generate') {
      setGeneratedPassword('');
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl ${
          isDark ? 'bg-purple-500' : 'bg-blue-400'
        } animate-pulse`} />
        <div className={`absolute top-3/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl ${
          isDark ? 'bg-blue-500' : 'bg-purple-400'
        } animate-pulse`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-3/4 w-64 h-64 rounded-full opacity-15 blur-3xl ${
          isDark ? 'bg-cyan-500' : 'bg-indigo-400'
        } animate-pulse`} style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900/80 border-slate-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`relative p-2 rounded-xl ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500 to-blue-600' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                <Shield className="w-8 h-8 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${
                  isDark 
                    ? 'from-white to-gray-300' 
                    : 'from-gray-900 to-gray-600'
                } bg-clip-text text-transparent`}>
                  PassShield
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Advanced Password Security
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >

              <button
                onClick={() => setShowTutorial(true)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/25' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:shadow-lg hover:shadow-blue-500/25'
                } backdrop-blur-sm`}
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/25' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:shadow-lg hover:shadow-blue-500/25'
                } backdrop-blur-sm`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <a
                href="https://github.com/qamarsaeed369/password-analyzer"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/25' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:shadow-lg hover:shadow-blue-500/25'
                } backdrop-blur-sm`}
              >
                <Github className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              Enterprise-Grade Security Analysis
            </span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${
            isDark 
              ? 'from-white via-gray-100 to-gray-300' 
              : 'from-gray-900 via-gray-800 to-gray-600'
          } bg-clip-text text-transparent`}>
            Secure Your Digital Life
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Advanced password analysis and generation with real-time security insights
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={`flex items-center justify-center gap-2 p-2 rounded-2xl backdrop-blur-md border transition-all ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white/50 border-gray-200/50'
          }`}>
            <button
              onClick={() => handleTabSwitch('analyze')}
              className={cn(
                'flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium',
                activeTab === 'analyze'
                  ? `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg ${
                      isDark ? 'shadow-purple-500/25' : 'shadow-blue-500/25'
                    } transform scale-105`
                  : `${
                      isDark 
                        ? 'text-gray-300 hover:text-white hover:bg-slate-700/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    } hover:scale-105`
              )}
            >
              <Shield className="w-5 h-5" />
              <span>Analyze Password</span>
              {activeTab === 'analyze' && (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
            <button
              onClick={() => handleTabSwitch('generate')}
              className={cn(
                'flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium',
                activeTab === 'generate'
                  ? `bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg ${
                      isDark ? 'shadow-purple-500/25' : 'shadow-purple-500/25'
                    } transform scale-105`
                  : `${
                      isDark 
                        ? 'text-gray-300 hover:text-white hover:bg-slate-700/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    } hover:scale-105`
              )}
            >
              <Wand2 className="w-5 h-5" />
              <span>Generate Password</span>
              {activeTab === 'generate' && (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* Input Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all ${
              isDark 
                ? 'bg-slate-900/50 border-slate-700/50 shadow-2xl shadow-purple-500/10' 
                : 'bg-white/70 border-gray-200/50 shadow-2xl shadow-blue-500/10'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <div className="relative p-8">
              {activeTab === 'analyze' ? (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-xl ${
                      isDark 
                        ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                        : 'bg-gradient-to-br from-blue-100 to-purple-100'
                    }`}>
                      <Lock className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Password Analysis
                      </h2>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enter your password to analyze its security strength
                      </p>
                    </div>
                  </div>
                  <PasswordInput onAnalysisChange={setAnalysis} initialPassword={generatedPassword} />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-xl ${
                      isDark 
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                        : 'bg-gradient-to-br from-purple-100 to-pink-100'
                    }`}>
                      <Key className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Password Generator
                      </h2>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Generate cryptographically secure passwords
                      </p>
                    </div>
                  </div>
                  <PasswordGenerator onPasswordGenerated={handlePasswordFromGenerator} />
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Analysis Results - Row-based Grid with Equal Heights */}
        {analysis && (
          <div className="space-y-6">
            {/* First Row - Deep Analysis - Full Width */}
            <div className="grid grid-cols-1">
              <div className="col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700/50 shadow-xl shadow-purple-500/10'
                      : 'bg-white/70 border-gray-200/50 shadow-xl shadow-purple-500/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                  <div className="relative p-6">
                    <AIAnalysis analysis={analysis} />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Second Row - Security Overview - Equal Height Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              {/* Password Strength Meter - Medium Width */}
              <div className="md:col-span-1 lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all h-full flex flex-col ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700/50 shadow-xl shadow-purple-500/10' 
                      : 'bg-white/70 border-gray-200/50 shadow-xl shadow-blue-500/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                  <div className="relative p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-lg ${
                        isDark 
                          ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                          : 'bg-gradient-to-br from-blue-100 to-purple-100'
                      }`}>
                        <Shield className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Security Score
                        </h3>
                      </div>
                    </div>
                    <div className="flex-1">
                      <PasswordStrengthMeter analysis={analysis} />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Character Composition - Small Width */}
              <div className="md:col-span-1 lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all h-full flex flex-col ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700/50 shadow-xl shadow-cyan-500/10' 
                      : 'bg-white/70 border-gray-200/50 shadow-xl shadow-cyan-500/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
                  <div className="relative p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${
                        isDark 
                          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20' 
                          : 'bg-gradient-to-br from-cyan-100 to-blue-100'
                      }`}>
                        <span className="text-lg">🔤</span>
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Character Mix
                        </h3>
                      </div>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      {[
                        { label: 'Length', value: analysis.composition.length, color: 'blue' },
                        { label: 'Uppercase', value: analysis.composition.uppercase, color: 'green' },
                        { label: 'Lowercase', value: analysis.composition.lowercase, color: 'purple' },
                        { label: 'Numbers', value: analysis.composition.digits, color: 'yellow' },
                        { label: 'Symbols', value: analysis.composition.symbols, color: 'red' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.label}
                          </span>
                          <span className={`text-sm font-bold ${
                            item.color === 'blue' ? 'text-blue-500' :
                            item.color === 'green' ? 'text-green-500' :
                            item.color === 'purple' ? 'text-purple-500' :
                            item.color === 'yellow' ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Dictionary Analysis - Medium Width */}
              <div className="md:col-span-2 lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all h-full flex flex-col ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700/50 shadow-xl shadow-yellow-500/10' 
                      : 'bg-white/70 border-gray-200/50 shadow-xl shadow-yellow-500/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
                  <div className="relative p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${
                        isDark 
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' 
                          : 'bg-gradient-to-br from-yellow-100 to-orange-100'
                      }`}>
                        <span className="text-lg">📚</span>
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Dictionary Analysis
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Common password detection
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      {analysis.dictionaryAnalysis.isInDictionary ? (
                        <div className="space-y-3">
                          <div className={`p-3 rounded-lg ${
                            isDark ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-red-500 text-sm">⚠️</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                                Found in Dictionary
                              </span>
                            </div>
                            <p className={`text-xs ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                              Score: {Math.round(analysis.dictionaryAnalysis.score)}/100
                            </p>
                          </div>
                          
                          {analysis.dictionaryAnalysis.dictionaryType.length > 0 && (
                            <div>
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                Found in categories:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {analysis.dictionaryAnalysis.dictionaryType.map((type, index) => (
                                  <span
                                    key={index}
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      isDark 
                                        ? 'bg-slate-700/50 text-slate-300' 
                                        : 'bg-gray-200/50 text-gray-700'
                                    }`}
                                  >
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`p-3 rounded-lg ${
                          isDark ? 'bg-green-900/30 border border-green-700/50' : 'bg-green-50 border border-green-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-green-500 text-sm">✓</span>
                            <span className={`text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                              Not in Dictionary
                            </span>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-green-300' : 'text-green-600'} mt-1`}>
                            Score: {Math.round(analysis.dictionaryAnalysis.score)}/100
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Second Row - Crack Time Analysis - Equal Height Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              {/* Crack Time Estimates - Large Width */}
              <div className="md:col-span-2 lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all h-full flex flex-col ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700/50 shadow-xl shadow-red-500/10' 
                      : 'bg-white/70 border-gray-200/50 shadow-xl shadow-orange-500/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5" />
                  <div className="relative p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-lg ${
                        isDark 
                          ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20' 
                          : 'bg-gradient-to-br from-red-100 to-orange-100'
                      }`}>
                        <span className="text-xl">⏱️</span>
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Crack Time Estimates
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Time to break under different attack scenarios
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 content-center">
                      {[
                        {
                          label: 'Online Throttled',
                          time: analysis.crackTime.online_throttling_100_per_hour,
                          color: 'emerald'
                        },
                        {
                          label: 'Online Fast',
                          time: analysis.crackTime.online_no_throttling_10_per_second,
                          color: 'yellow'
                        },
                        {
                          label: 'Offline Slow',
                          time: analysis.crackTime.offline_slow_hashing_1e4_per_second,
                          color: 'orange'
                        },
                        {
                          label: 'Offline Fast',
                          time: analysis.crackTime.offline_fast_hashing_1e10_per_second,
                          color: 'red'
                        }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className={`p-4 rounded-xl transition-all ${
                            isDark 
                              ? 'bg-slate-800/50 hover:bg-slate-800/70' 
                              : 'bg-gray-50/50 hover:bg-gray-50/80'
                          } border ${
                            isDark ? 'border-slate-700/50' : 'border-gray-200/50'
                          }`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {item.label}
                            </h4>
                            <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                          </div>
                          <p className={`font-mono text-sm font-bold ${
                            item.color === 'red' 
                              ? 'text-red-500' 
                              : item.color === 'orange'
                              ? 'text-orange-500'
                              : item.color === 'yellow'
                              ? 'text-yellow-500'
                              : 'text-emerald-500'
                          }`}>
                            {item.time}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Security Tips - Medium Width */}
              <div className="md:col-span-2 lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all h-full flex flex-col ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700/50 shadow-xl shadow-green-500/10' 
                      : 'bg-white/70 border-gray-200/50 shadow-xl shadow-green-500/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
                  <div className="relative p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-lg ${
                        isDark 
                          ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20' 
                          : 'bg-gradient-to-br from-green-100 to-blue-100'
                      }`}>
                        <Zap className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      </div>
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Security Best Practices
                      </h3>
                    </div>
                    <div className="grid gap-3 flex-1 content-center">
                      {[
                        { icon: '🔤', text: 'Mix uppercase, lowercase, numbers, and symbols' },
                        { icon: '📏', text: 'Use at least 12-16 characters for optimal security' },
                        { icon: '🚫', text: 'Avoid personal information and common patterns' }
                      ].map((tip, index) => (
                        <motion.div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            isDark 
                              ? 'bg-slate-800/30 hover:bg-slate-800/50' 
                              : 'bg-gray-50/50 hover:bg-gray-50/80'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-lg">{tip.icon}</span>
                          <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                            {tip.text}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Third Row - Advanced Analysis - Full Width */}
            <div className="grid grid-cols-1">
              <div className="col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700/50 shadow-xl shadow-indigo-500/10' 
                      : 'bg-white/70 border-gray-200/50 shadow-xl shadow-indigo-500/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                  <div className="relative">
                    <AdvancedAnalysis analysis={analysis} />
                  </div>
                </motion.div>
              </div>
            </div>


          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`relative mt-24 py-16 border-t transition-all ${
        isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-gray-200/50 bg-gray-50/50'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`inline-flex items-center gap-3 mb-6 p-4 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-slate-800/80 to-purple-900/80' 
                : 'bg-gradient-to-br from-white/80 to-blue-50/80'
            } backdrop-blur-md border ${
              isDark ? 'border-slate-700/50' : 'border-gray-200/50'
            }`}>
              <Shield className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-blue-600'}`} />
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                PassShield
              </span>
            </div>
            
            <div className={`max-w-2xl mx-auto mb-8 space-y-4`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🔒 Privacy-First Security Analysis
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                Your passwords are <strong>never sent to our servers</strong>. All analysis is performed 
                locally in your browser using advanced client-side algorithms for maximum security and privacy.
              </p>
            </div>

            <div className={`flex flex-wrap items-center justify-center gap-6 text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>100% Client-Side</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Real-Time Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Enterprise Security</span>
              </div>
            </div>

          </motion.div>
        </div>
      </footer>

      {/* Tutorial Modal */}
      <SecurityTutorial 
        isOpen={showTutorial} 
        onClose={handleTutorialClose} 
      />

    </div>
  );
}
