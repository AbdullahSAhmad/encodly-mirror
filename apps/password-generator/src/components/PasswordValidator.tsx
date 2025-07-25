import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { Copy, ClipboardPaste, Trash2, Eye, EyeOff, Check, X } from 'lucide-react';
import { StrengthIndicator } from './StrengthIndicator';

interface PasswordValidatorProps {
  onToast?: (message: string) => void;
}

export const PasswordValidator: React.FC<PasswordValidatorProps> = ({ onToast }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPassword(text.trim());
      onToast?.('Pasted from clipboard!');
    } catch (err) {
      onToast?.('Failed to paste from clipboard');
    }
  }, [onToast]);

  const handleCopy = useCallback(async () => {
    if (!password.trim()) return;
    
    try {
      await navigator.clipboard.writeText(password);
      onToast?.('Copied to clipboard!');
    } catch (err) {
      onToast?.('Failed to copy to clipboard');
    }
  }, [password, onToast]);

  const handleClear = useCallback(() => {
    setPassword('');
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Password validation checks
  const checks = [
    {
      label: 'At least 8 characters',
      passed: password.length >= 8,
    },
    {
      label: 'At least 12 characters (recommended)',
      passed: password.length >= 12,
    },
    {
      label: 'Contains uppercase letter',
      passed: /[A-Z]/.test(password),
    },
    {
      label: 'Contains lowercase letter',
      passed: /[a-z]/.test(password),
    },
    {
      label: 'Contains number',
      passed: /\d/.test(password),
    },
    {
      label: 'Contains special character',
      passed: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
    },
    {
      label: 'No common patterns',
      passed: !/123|abc|qwe|password|admin/i.test(password) && !/(.)\1{2,}/.test(password),
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Test Password Strength</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enter Password</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePaste}
                className="flex items-center gap-2"
              >
                <ClipboardPaste className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!password.trim()}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!password.trim()}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password to analyze..."
              className="font-mono pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePasswordVisibility}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Password Validation Checks */}
        {password.trim() && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Password Requirements</label>
            <div className="space-y-2">
              {checks.map((check, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    check.passed 
                      ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                      : 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}>
                    {check.passed ? (
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    check.passed 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strength Analysis */}
        {password.trim() && (
          <StrengthIndicator password={password} />
        )}

        {/* Security Tips */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Password Security Tips:
          </div>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Use at least 12 characters for better security</li>
            <li>• Include uppercase, lowercase, numbers, and symbols</li>
            <li>• Avoid dictionary words and personal information</li>
            <li>• Don't reuse passwords across different accounts</li>
            <li>• Consider using a password manager</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};