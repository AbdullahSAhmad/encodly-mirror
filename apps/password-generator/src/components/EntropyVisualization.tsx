import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { calculateEntropy, PasswordStrengthAnalysis } from '../utils/advancedPasswordUtils';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface EntropyVisualizationProps {
  password: string;
  analysis: PasswordStrengthAnalysis;
}

export const EntropyVisualization: React.FC<EntropyVisualizationProps> = ({ password, analysis }) => {
  if (!password) return null;

  // Character type distribution
  const getCharacterDistribution = (password: string) => {
    const lowercase = (password.match(/[a-z]/g) || []).length;
    const uppercase = (password.match(/[A-Z]/g) || []).length;
    const numbers = (password.match(/[0-9]/g) || []).length;
    const symbols = (password.match(/[^a-zA-Z0-9]/g) || []).length;
    
    return { lowercase, uppercase, numbers, symbols };
  };

  const charDistribution = getCharacterDistribution(password);
  
  // Doughnut chart data for character distribution
  const doughnutData = {
    labels: ['Lowercase', 'Uppercase', 'Numbers', 'Symbols'],
    datasets: [
      {
        data: [
          charDistribution.lowercase,
          charDistribution.uppercase,
          charDistribution.numbers,
          charDistribution.symbols
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(245, 158, 11, 0.8)',   // Yellow
          'rgba(239, 68, 68, 0.8)',    // Red
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Security metrics bar chart
  const getSecurityScore = (value: number, max: number) => (value / max) * 100;
  
  const barData = {
    labels: ['Length', 'Complexity', 'Entropy', 'Crack Time'],
    datasets: [
      {
        label: 'Security Score',
        data: [
          getSecurityScore(password.length, 20),
          (analysis.score / 4) * 100,
          getSecurityScore(analysis.entropy, 100),
          Math.min(getSecurityScore(Math.log10(analysis.crackTimeSeconds), 10) * 10, 100)
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Character Distribution */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4 text-center">Character Distribution</h3>
          <div className="w-64 h-64 mx-auto">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div>Lowercase: {charDistribution.lowercase}</div>
              <div>Uppercase: {charDistribution.uppercase}</div>
              <div>Numbers: {charDistribution.numbers}</div>
              <div>Symbols: {charDistribution.symbols}</div>
            </div>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4 text-center">Security Metrics</h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Entropy Information */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <h3 className="text-lg font-medium mb-4">Entropy Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analysis.entropy.toFixed(1)}</div>
            <div className="text-gray-600 dark:text-gray-400">Bits of Entropy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{password.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Characters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.pow(10, analysis.guessesLog10).toExponential(1)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Possible Guesses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{analysis.score}/4</div>
            <div className="text-gray-600 dark:text-gray-400">Strength Score</div>
          </div>
        </div>
      </div>

      {/* Crack Time Visualization */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <h3 className="text-lg font-medium mb-4">Time to Crack</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Offline Attack (Slow Hashing):</span>
            <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {analysis.crackTimeDisplay}
            </span>
          </div>
          
          {/* Visual timeline */}
          <div className="mt-4">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Attack Timeline</div>
            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded">
              {/* Timeline markers */}
              <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
                <span>Instant</span>
                <span>Hours</span>
                <span>Days</span>
                <span>Years</span>
                <span>Centuries</span>
              </div>
              
              {/* Current position indicator */}
              <div 
                className="absolute top-0 h-full bg-blue-500 rounded transition-all duration-500"
                style={{
                  width: `${Math.min(90, Math.max(5, (analysis.score / 4) * 90))}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};