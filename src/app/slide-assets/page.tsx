'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function SlideAssets() {
    const accuracyData = {
        labels: ['Entropy Only', 'zxcvbn', 'Proposed AI Model'],
        datasets: [
            {
                label: 'Accuracy (%)',
                data: [60, 78, 86],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Model Accuracy Comparison',
                font: { size: 24 }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-white p-8 space-y-24 text-slate-900">

            {/* 1. Accuracy Chart */}
            <section id="accuracy-chart" className="w-[800px] mx-auto border p-8 shadow-xl rounded-xl bg-white">
                <Bar data={accuracyData} options={chartOptions} />
            </section>

            {/* 2. Architecture Diagram */}
            <section id="architecture-diagram" className="w-[800px] mx-auto border p-8 shadow-xl rounded-xl bg-slate-50 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-8">PassShield NN Architecture</h2>
                <div className="flex items-center gap-12">
                    {/* Input */}
                    <div className="flex flex-col gap-2">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-blue-500 border-2 border-blue-700 shadow-md" />
                        ))}
                        <span className="text-center font-bold mt-2">Input (9)</span>
                    </div>

                    {/* Arrows */}
                    <div className="text-4xl text-gray-400">➜</div>

                    {/* Hidden 1 */}
                    <div className="flex flex-col gap-1 items-center">
                        <div className="h-48 w-12 border-2 border-purple-500 bg-purple-100 rounded-lg flex flex-col justify-center gap-1 p-1 overflow-hidden relative">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="w-full h-2 bg-purple-400 rounded-full opacity-50" />
                            ))}
                        </div>
                        <span className="text-center font-bold mt-2">Dense 1 (128)</span>
                    </div>

                    <div className="text-4xl text-gray-400">➜</div>

                    {/* Hidden 2 */}
                    <div className="flex flex-col gap-1 items-center">
                        <div className="h-32 w-12 border-2 border-purple-500 bg-purple-100 rounded-lg flex flex-col justify-center gap-1 p-1 overflow-hidden relative">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-full h-2 bg-purple-400 rounded-full opacity-50" />
                            ))}
                        </div>
                        <span className="text-center font-bold mt-2">Dense 2 (64)</span>
                    </div>

                    <div className="text-4xl text-gray-400">➜</div>

                    {/* Output */}
                    <div className="flex flex-col gap-2 items-center">
                        <div className="w-12 h-12 rounded-full bg-green-500 border-4 border-green-700 shadow-lg flex items-center justify-center text-white font-bold">
                            σ
                        </div>
                        <span className="text-center font-bold mt-2">Score (1)</span>
                    </div>
                </div>
            </section>

            {/* 3. Performance Table */}
            <section id="performance-table" className="w-[800px] mx-auto border p-8 shadow-xl rounded-xl bg-white">
                <h2 className="text-2xl font-bold mb-6 text-center">System Performance Metrics</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-300">
                            <th className="p-4 text-xl">Metric</th>
                            <th className="p-4 text-xl">Value</th>
                            <th className="p-4 text-xl">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <td className="p-4 font-semibold">Model Accuracy</td>
                            <td className="p-4">86.0%</td>
                            <td className="p-4 text-green-600">High Precision</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                            <td className="p-4 font-semibold">Inference Latency</td>
                            <td className="p-4">&lt; 10 ms</td>
                            <td className="p-4 text-green-600">Real-time</td>
                        </tr>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <td className="p-4 font-semibold">Data Transfer</td>
                            <td className="p-4">0 Bytes</td>
                            <td className="p-4 text-blue-600">100% Private</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                            <td className="p-4 font-semibold">Model Size</td>
                            <td className="p-4">~38 KB</td>
                            <td className="p-4 text-purple-600">Ultra-lightweight</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* 4. Privacy Flow Diagram */}
            <section id="privacy-flow" className="w-[800px] mx-auto border p-8 shadow-xl rounded-xl bg-slate-900 text-white flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-10">Privacy-Preserving Pipeline</h2>
                <div className="flex items-center gap-6">
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col items-center gap-2 w-48">
                        <span className="text-3xl">⌨️</span>
                        <span className="font-bold">User Input</span>
                        <span className="text-xs text-gray-400">"P@ss..."</span>
                    </div>
                    <div className="h-1 w-12 bg-blue-500"></div>
                    <div className="bg-blue-900/50 p-6 rounded-lg border border-blue-500 flex flex-col items-center gap-2 w-48">
                        <span className="text-3xl">⚙️</span>
                        <span className="font-bold">Feature Extraction</span>
                        <span className="text-xs text-blue-300">[9, 1, 0, 4...]</span>
                    </div>
                    <div className="h-1 w-12 bg-green-500"></div>
                    <div className="bg-green-900/50 p-6 rounded-lg border border-green-500 flex flex-col items-center gap-2 w-48">
                        <span className="text-3xl">🧠</span>
                        <span className="font-bold">AI Model</span>
                        <span className="text-xs text-green-300">Predict(Features)</span>
                    </div>
                </div>
                <div className="mt-8 text-sm text-gray-400 border-t border-gray-700 pt-4">
                    🔒 Protocol: Raw string is discarded immediately after extraction. Only numbers enter the AI.
                </div>
            </section>

        </div>
    );
}
