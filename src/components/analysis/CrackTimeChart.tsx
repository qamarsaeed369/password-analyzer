'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { PasswordAnalysis } from '@/types';

interface CrackTimeChartProps {
  analysis: PasswordAnalysis;
  isDark?: boolean;
}

export const CrackTimeChart: React.FC<CrackTimeChartProps> = ({ analysis, isDark = false }) => {
  // Convert crack time strings to numeric values for visualization
  const convertTimeToSeconds = (timeStr: string): number => {
    if (timeStr === 'instant') return 0;
    if (timeStr === 'centuries') return 3155760000 * 100; // 100 centuries
    
    const match = timeStr.match(/(\d+(?:\.\d+)?)\s*(\w+)/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    
    const multipliers: { [key: string]: number } = {
      'second': 1,
      'seconds': 1,
      'minute': 60,
      'minutes': 60,
      'hour': 3600,
      'hours': 3600,
      'day': 86400,
      'days': 86400,
      'month': 2629800,
      'months': 2629800,
      'year': 31557600,
      'years': 31557600
    };
    
    return value * (multipliers[unit] || 1);
  };

  const data = [
    {
      name: 'Online\nThrottled',
      displayName: 'Online (Throttled)',
      value: Math.log10(convertTimeToSeconds(analysis.crackTime.online_throttling_100_per_hour) + 1),
      originalTime: analysis.crackTime.online_throttling_100_per_hour,
      color: '#10b981',
      description: '100 guesses per hour'
    },
    {
      name: 'Online\nUnthrottled', 
      displayName: 'Online (Fast)',
      value: Math.log10(convertTimeToSeconds(analysis.crackTime.online_no_throttling_10_per_second) + 1),
      originalTime: analysis.crackTime.online_no_throttling_10_per_second,
      color: '#f59e0b',
      description: '10 guesses per second'
    },
    {
      name: 'Offline\nSlow',
      displayName: 'Offline (Slow)',
      value: Math.log10(convertTimeToSeconds(analysis.crackTime.offline_slow_hashing_1e4_per_second) + 1),
      originalTime: analysis.crackTime.offline_slow_hashing_1e4_per_second,
      color: '#f97316',
      description: '10K guesses per second'
    },
    {
      name: 'Offline\nFast',
      displayName: 'Offline (Fast)',
      value: Math.log10(convertTimeToSeconds(analysis.crackTime.offline_fast_hashing_1e10_per_second) + 1),
      originalTime: analysis.crackTime.offline_fast_hashing_1e10_per_second,
      color: '#dc2626',
      description: '10B guesses per second'
    }
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { displayName: string; description: string; originalTime: string; color: string } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark 
            ? 'bg-slate-800 border-slate-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{data.displayName}</p>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {data.description}
          </p>
          <p className="font-mono text-lg mt-1" style={{ color: data.color }}>
            {data.originalTime}
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
              fontSize: 11 
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
              value: 'Time (log scale)', 
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