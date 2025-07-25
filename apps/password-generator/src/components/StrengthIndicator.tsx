import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { calculatePasswordStrength } from '../utils/passwordUtils';

interface StrengthIndicatorProps {
  password: string;
}

export const StrengthIndicator: React.FC<StrengthIndicatorProps> = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  
  const getIcon = () => {
    if (strength.score >= 60) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (strength.score >= 40) {
      return <Shield className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Password Strength</span>
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-sm font-medium">{strength.label}</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          {strength.score}/100 points
        </div>
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          <div className="text-sm font-medium">Suggestions:</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {strength.feedback.map((feedback, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-xs mt-1">•</span>
                <span>{feedback}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};