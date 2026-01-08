'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { PasswordAnalysis } from '@/types';

interface EntropyChartProps {
  analysis: PasswordAnalysis;
  isDark?: boolean;
}

export const EntropyChart: React.FC<EntropyChartProps> = ({ analysis, isDark = false }) => {
  const data = [
    {
      name: 'Charset',
      value: analysis.entropyDetails.charsetEntropy,
      color: '#8b5cf6',
      description: 'Based on character types used'
    },
    {
      name: 'Shannon',
      value: analysis.entropyDetails.shannonEntropy,
      color: '#06b6d4',
      description: 'Character frequency distribution'
    },
    {
      name: 'Minimum',
      value: analysis.entropyDetails.minEntropy,
      color: '#f59e0b',
      description: 'Unique characters only'
    },
    {
      name: 'Effective',
      value: analysis.entropyDetails.patternReducedEntropy,
      color: '#10b981',
      description: 'Pattern-adjusted (most realistic)'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: { description: string; value: number; color: string } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark 
            ? 'bg-slate-800 border-slate-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{label}</p>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {data.description}
          </p>
          <p className="font-mono text-lg mt-1" style={{ color: data.color }}>
            {data.value.toFixed(1)} bits
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? '#374151' : '#e5e7eb'} 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: isDark ? '#9ca3af' : '#6b7280', 
              fontSize: 12 
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: isDark ? '#9ca3af' : '#6b7280', 
              fontSize: 12 
            }}
            label={{ 
              value: 'Entropy (bits)', 
              angle: -90, 
              position: 'insideLeft',
              style: { 
                textAnchor: 'middle', 
                fill: isDark ? '#9ca3af' : '#6b7280',
                fontSize: 12
              }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};