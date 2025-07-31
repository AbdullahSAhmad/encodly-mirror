import React from 'react';
import { PasswordStrengthAnalysis } from '../utils/advancedPasswordUtils';

interface CompactEntropyVisualizationProps {
  password: string;
  analysis: PasswordStrengthAnalysis;
}

export const CompactEntropyVisualization: React.FC<CompactEntropyVisualizationProps> = ({ password, analysis }) => {
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
  const total = password.length;

  // Calculate percentages
  const percentages = {
    lowercase: (charDistribution.lowercase / total) * 100,
    uppercase: (charDistribution.uppercase / total) * 100,
    numbers: (charDistribution.numbers / total) * 100,
    symbols: (charDistribution.symbols / total) * 100
  };

  // Strength color based on score
  const getStrengthColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    if (score >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStrengthBgColor = (score: number) => {
    if (score >= 4) return 'bg-green-100 dark:bg-green-900';
    if (score >= 3) return 'bg-yellow-100 dark:bg-yellow-900';
    if (score >= 2) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="space-y-4">
      {/* Strength Overview */}
      <div className={`p-3 rounded-lg ${getStrengthBgColor(analysis.score)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Strength Score</span>
          <span className={`text-lg font-bold ${getStrengthColor(analysis.score)}`}>
            {analysis.score}/4
          </span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {analysis.crackTimeDisplay}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{analysis.entropy.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Bits Entropy</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{password.length}</div>
          <div className="text-xs text-gray-500">Characters</div>
        </div>
      </div>

      {/* Character Distribution Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Character Mix</div>
          <div className="text-xs text-gray-500" title="Shows the distribution of different character types in your password. A good mix increases security.">
            ?
          </div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
          {charDistribution.lowercase > 0 && (
            <div 
              className="bg-blue-500" 
              style={{ width: `${percentages.lowercase}%` }}
              title={`Lowercase letters: ${charDistribution.lowercase} (${percentages.lowercase.toFixed(1)}%)`}
            />
          )}
          {charDistribution.uppercase > 0 && (
            <div 
              className="bg-green-500" 
              style={{ width: `${percentages.uppercase}%` }}
              title={`Uppercase letters: ${charDistribution.uppercase} (${percentages.uppercase.toFixed(1)}%)`}
            />
          )}
          {charDistribution.numbers > 0 && (
            <div 
              className="bg-yellow-500" 
              style={{ width: `${percentages.numbers}%` }}
              title={`Numbers: ${charDistribution.numbers} (${percentages.numbers.toFixed(1)}%)`}
            />
          )}
          {charDistribution.symbols > 0 && (
            <div 
              className="bg-red-500" 
              style={{ width: `${percentages.symbols}%` }}
              title={`Symbols: ${charDistribution.symbols} (${percentages.symbols.toFixed(1)}%)`}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded"></div>
            <span>a-z: {charDistribution.lowercase}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded"></div>
            <span>A-Z: {charDistribution.uppercase}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded"></div>
            <span>0-9: {charDistribution.numbers}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded"></div>
            <span>!@#: {charDistribution.symbols}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 italic">
          Using {Object.values(charDistribution).filter(v => v > 0).length} of 4 character types
        </div>
      </div>

      {/* Feedback */}
      {analysis.feedback.length > 0 && (
        <div className="space-y-1">
          <div className="text-sm font-medium">Suggestions</div>
          <div className="space-y-1">
            {analysis.feedback.slice(0, 2).map((feedback, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                • {feedback}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attack Timeline */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Crack Time</div>
        <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded">
          <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-gray-500">
            <span>Instant</span>
            <span>Years</span>
          </div>
          <div 
            className="absolute top-0 h-full bg-blue-500 rounded transition-all duration-500"
            style={{
              width: `${Math.min(95, Math.max(5, (analysis.score / 4) * 95))}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};