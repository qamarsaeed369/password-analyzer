'use client';

/**
 * Client-Side Only AI Model Wrapper
 * This file ensures TensorFlow.js is NEVER loaded on the server
 */

// Re-export everything from ai-model, but with 'use client' directive
export { getAIModel } from './ai-model';
export type { PasswordFeatures } from './ai-model';
