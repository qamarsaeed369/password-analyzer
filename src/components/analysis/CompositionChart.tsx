'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { PasswordAnalysis } from '@/types';

interface CompositionChartProps {
  analysis: PasswordAnalysis;
  isDark?: boolean;
}

export const CompositionChart: React.FC<CompositionChartProps> = ({ analysis, isDark = false }) => {
  const data = [
    {
      name: 'Lowercase',
      value: analysis.composition.lowercase,
      color: '#3b82f6',
      icon: 'abc'
    },
    {
      name: 'Uppercase',
      value: analysis.composition.uppercase,
      color: '#8b5cf6',
      icon: 'ABC'
    },
    {
      name: 'Numbers',
      value: analysis.composition.digits,
      color: '#06b6d4',
      icon: '123'
    },
    {
      name: 'Symbols',
      value: analysis.composition.symbols,
      color: '#10b981',
      icon: '!@#'
    },
    {
      name: 'Spaces',
      value: analysis.composition.spaces,
      color: '#f59e0b',
      icon: '___'
    }
  ].filter(item => item.value > 0); // Only show character types that are present

  if (data.length === 0) return null;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; color: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark 
            ? 'bg-slate-800 border-slate-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{data.name}</p>
          <p className="font-mono text-lg" style={{ color: data.color }}>
            {data.value} characters
          </p>
          <p className="text-xs text-gray-500">
            {((data.value / analysis.composition.length) * 100).toFixed(1)}% of password
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: { cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; value?: number; name?: string }) => {
    if (!cx || !cy || typeof midAngle !== 'number' || !innerRadius || !outerRadius || !value) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const percentage = ((value / analysis.composition.length) * 100).toFixed(0);
    
    // Only show label if percentage is above 5%
    if (parseInt(percentage) < 5) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {percentage}%
      </text>
    );
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};