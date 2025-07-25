import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { Copy, Download, Shuffle, Check } from 'lucide-react';
import { generatePassword, DEFAULT_PASSWORD_OPTIONS, PasswordOptions } from '../utils/passwordUtils';
import { StrengthIndicator } from './StrengthIndicator';

interface PasswordGeneratorProps {
  onToast?: (message: string) => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onToast }) => {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_PASSWORD_OPTIONS);
  const [passwords, setPasswords] = useState<string[]>([]);

  useEffect(() => {
    handleGenerateSingle();
  }, [options]);

  const handleGenerateSingle = useCallback(() => {
    const password = generatePassword(options);
    setPasswords([password]);
  }, [options]);


  const handleCopyAll = useCallback(async () => {
    if (passwords.length === 0) return;
    
    const text = passwords.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      onToast?.(`${passwords.length} password${passwords.length > 1 ? 's' : ''} copied to clipboard!`);
    } catch (err) {
      onToast?.('Failed to copy to clipboard');
    }
  }, [passwords, onToast]);

  const handleDownload = useCallback(() => {
    if (passwords.length === 0) return;
    
    const content = passwords.join('\n');
    const filename = `passwords-${passwords.length}-${Date.now()}.txt`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onToast?.('Downloaded successfully!');
  }, [passwords, onToast]);

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  // Custom checkbox component
  const CustomCheckbox = ({ checked, onChange, label, id }: { checked: boolean; onChange: (checked: boolean) => void; label: string; id: string }) => (
    <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
          checked
            ? 'bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-blue-300 dark:group-hover:border-blue-500'
        }`}>
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
      <span className="text-sm select-none">{label}</span>
    </label>
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Generate Passwords</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Length Setting */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Password Length</label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={options.length}
              onChange={(e) => updateOption('length', Math.max(4, Math.min(128, parseInt(e.target.value) || 4)))}
              min="4"
              max="128"
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">4-128 characters</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Character Sets</label>
          <div className="grid grid-cols-1 gap-4">
            <CustomCheckbox
              id="uppercase"
              checked={options.includeUppercase}
              onChange={(checked) => updateOption('includeUppercase', checked)}
              label="Uppercase (A-Z)"
            />
            <CustomCheckbox
              id="lowercase"
              checked={options.includeLowercase}
              onChange={(checked) => updateOption('includeLowercase', checked)}
              label="Lowercase (a-z)"
            />
            <CustomCheckbox
              id="numbers"
              checked={options.includeNumbers}
              onChange={(checked) => updateOption('includeNumbers', checked)}
              label="Numbers (0-9)"
            />
            <CustomCheckbox
              id="symbols"
              checked={options.includeSymbols}
              onChange={(checked) => updateOption('includeSymbols', checked)}
              label="Symbols (!@#$)"
            />
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Advanced Options</label>
          <div className="grid grid-cols-1 gap-4">
            <CustomCheckbox
              id="exclude-similar"
              checked={options.excludeSimilar}
              onChange={(checked) => updateOption('excludeSimilar', checked)}
              label="Exclude similar characters (il1Lo0O)"
            />
            <CustomCheckbox
              id="exclude-ambiguous"
              checked={options.excludeAmbiguous}
              onChange={(checked) => updateOption('excludeAmbiguous', checked)}
              label="Exclude ambiguous characters ({}[]())"
            />
          </div>
        </div>

        {/* Generation Buttons */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleGenerateSingle}
            className="w-full flex items-center justify-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Generate Password
          </Button>
        </div>

        {/* Results */}
        {passwords.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Generated {passwords.length > 1 ? `${passwords.length} Passwords` : 'Password'}
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAll}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="p-3 space-y-2">
                {passwords.map((password, index) => (
                  <div key={index} className="space-y-2">
                    <div className="p-2 hover:bg-muted/50 rounded text-sm">
                      <span className="font-mono break-all">{password}</span>
                    </div>
                    {passwords.length === 1 && (
                      <StrengthIndicator password={password} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};