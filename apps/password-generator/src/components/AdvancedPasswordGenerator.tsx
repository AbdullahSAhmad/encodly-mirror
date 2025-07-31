import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { Copy, Download, Shuffle, Check, Settings, BarChart3, Shield, Zap } from 'lucide-react';
import { 
  AdvancedPasswordOptions, 
  generateRandomPassword, 
  generatePronounceablePassword, 
  generateDicewarePassphrase,
  generateBulkPasswords,
  exportPasswords,
  analyzePasswordStrength,
  validatePasswordPolicy,
  NIST_POLICIES,
  BulkGenerationOptions,
  MEMORABLE_PATTERNS
} from '../utils/advancedPasswordUtils';
import { StrengthIndicator } from './StrengthIndicator';
import { EntropyVisualization } from './EntropyVisualization';

interface AdvancedPasswordGeneratorProps {
  onToast?: (message: string) => void;
}

type GenerationMode = 'single' | 'bulk' | 'policy';
type ViewMode = 'basic' | 'advanced' | 'analysis';

export const AdvancedPasswordGenerator: React.FC<AdvancedPasswordGeneratorProps> = ({ onToast }) => {
  const [options, setOptions] = useState<AdvancedPasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
    algorithm: 'random',
    dicewareWords: 4,
    excludedCharacters: '',
    customRules: []
  });
  const [passwords, setPasswords] = useState<string[]>([]);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('single');
  const [viewMode, setViewMode] = useState<ViewMode>('basic');
  const [bulkCount, setBulkCount] = useState(10);
  const [selectedPolicy, setSelectedPolicy] = useState('nist-basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordAnalysis, setPasswordAnalysis] = useState(analyzePasswordStrength(''));
  const [policyErrors, setPolicyErrors] = useState<string[]>([]);

  useEffect(() => {
    if (generationMode === 'single') {
      handleGenerateSingle();
    }
  }, [options, generationMode]);

  useEffect(() => {
    if (passwords.length > 0) {
      const password = passwords[0];
      setCurrentPassword(password);
      setPasswordAnalysis(analyzePasswordStrength(password));
      
      if (generationMode === 'policy') {
        const policy = NIST_POLICIES[selectedPolicy];
        const errors = validatePasswordPolicy(password, policy);
        setPolicyErrors(errors);
      }
    }
  }, [passwords, selectedPolicy, generationMode]);

  const handleGenerateSingle = useCallback(() => {
    let password: string;
    
    switch (options.algorithm) {
      case 'pronounceable':
        password = generatePronounceablePassword(options);
        break;
      case 'diceware':
        password = generateDicewarePassphrase(options);
        break;
      default:
        password = generateRandomPassword(options);
    }
    
    setPasswords([password]);
  }, [options]);

  const handleGenerateBulk = useCallback(async () => {
    setIsGenerating(true);
    try {
      const bulkOptions: BulkGenerationOptions = {
        ...options,
        count: bulkCount,
        exportFormat: 'txt',
        includeHashes: false,
        hashAlgorithm: 'sha256'
      };
      
      const bulkPasswords = await generateBulkPasswords(bulkOptions);
      setPasswords(bulkPasswords);
    } catch (error) {
      onToast?.('Error generating bulk passwords');
    } finally {
      setIsGenerating(false);
    }
  }, [options, bulkCount, onToast]);

  const handlePolicyGeneration = useCallback(() => {
    const policy = NIST_POLICIES[selectedPolicy];
    const enhancedOptions: AdvancedPasswordOptions = {
      ...options,
      length: Math.max(options.length, policy.minLength),
      includeUppercase: policy.requireUppercase || options.includeUppercase,
      includeLowercase: policy.requireLowercase || options.includeLowercase,
      includeNumbers: policy.requireNumbers || options.includeNumbers,
      includeSymbols: policy.requireSymbols || options.includeSymbols,
      customRules: policy.customRules
    };
    
    let password: string;
    switch (enhancedOptions.algorithm) {
      case 'pronounceable':
        password = generatePronounceablePassword(enhancedOptions);
        break;
      case 'diceware':
        password = generateDicewarePassphrase(enhancedOptions);
        break;
      default:
        password = generateRandomPassword(enhancedOptions);
    }
    
    setPasswords([password]);
  }, [options, selectedPolicy]);

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

  const handleDownload = useCallback(async (format: 'txt' | 'csv' = 'txt', includeHashes = false) => {
    if (passwords.length === 0) return;
    
    try {
      const bulkOptions: BulkGenerationOptions = {
        ...options,
        count: passwords.length,
        exportFormat: format,
        includeHashes,
        hashAlgorithm: 'sha256'
      };
      
      const content = await exportPasswords(passwords, bulkOptions);
      const filename = `passwords-${passwords.length}-${Date.now()}.${format}`;
      
      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onToast?.('Downloaded successfully!');
    } catch (error) {
      onToast?.('Error downloading file');
    }
  }, [passwords, options, onToast]);

  const updateOption = (key: keyof AdvancedPasswordOptions, value: boolean | number | string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    switch (generationMode) {
      case 'bulk':
        handleGenerateBulk();
        break;
      case 'policy':
        handlePolicyGeneration();
        break;
      default:
        handleGenerateSingle();
    }
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
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Advanced Password Generator</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'basic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('basic')}
              >
                <Settings className="h-4 w-4 mr-1" />
                Basic
              </Button>
              <Button
                variant={viewMode === 'advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('advanced')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Advanced
              </Button>
              <Button
                variant={viewMode === 'analysis' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('analysis')}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Analysis
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Generation Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={generationMode === 'single' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGenerationMode('single')}
            >
              Single
            </Button>
            <Button
              variant={generationMode === 'bulk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGenerationMode('bulk')}
            >
              Bulk
            </Button>
            <Button
              variant={generationMode === 'policy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGenerationMode('policy')}
            >
              <Shield className="h-4 w-4 mr-1" />
              Policy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Algorithm Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Generation Algorithm</label>
            <select 
              value={options.algorithm} 
              onChange={(e) => updateOption('algorithm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="random">Random (Cryptographically Secure)</option>
              <option value="pronounceable">Pronounceable</option>
              <option value="diceware">Diceware Passphrase</option>
            </select>
          </div>

          {/* Policy Selection (Policy Mode Only) */}
          {generationMode === 'policy' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Security Policy</label>
              <select 
                value={selectedPolicy} 
                onChange={(e) => setSelectedPolicy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(NIST_POLICIES).map(([key, policy]) => (
                  <option key={key} value={key}>
                    {policy.name} - {policy.description}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Bulk Count (Bulk Mode Only) */}
          {generationMode === 'bulk' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Passwords</label>
              <Input
                type="number"
                value={bulkCount}
                onChange={(e) => setBulkCount(Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)))}
                min="1"
                max="10000"
                className="w-32"
              />
              <span className="text-xs text-muted-foreground">1-10,000 passwords</span>
            </div>
          )}

          {/* Basic Options */}
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

          {/* Diceware Options */}
          {options.algorithm === 'diceware' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Words</label>
              <Input
                type="number"
                value={options.dicewareWords}
                onChange={(e) => updateOption('dicewareWords', Math.max(2, Math.min(10, parseInt(e.target.value) || 4)))}
                min="2"
                max="10"
                className="w-20"
              />
            </div>
          )}

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
          {viewMode !== 'basic' && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium">Exclusion Options</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Excluded Characters</label>
                <Input
                  value={options.excludedCharacters || ''}
                  onChange={(e) => updateOption('excludedCharacters', e.target.value)}
                  placeholder="Enter characters to exclude"
                />
              </div>
            </>
          )}

          {/* Generation Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 
             generationMode === 'bulk' ? `Generate ${bulkCount} Passwords` :
             generationMode === 'policy' ? 'Generate Policy-Compliant Password' :
             'Generate Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Policy Validation Errors */}
      {generationMode === 'policy' && policyErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Policy Violations:
            </div>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              {policyErrors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {passwords.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Generated {passwords.length > 1 ? `${passwords.length} Passwords` : 'Password'}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAll}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload('txt')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  TXT
                </Button>
                {passwords.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload('csv')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    CSV
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md max-h-96 overflow-auto">
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
          </CardContent>
        </Card>
      )}

      {/* Analysis View */}
      {viewMode === 'analysis' && currentPassword && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Security Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <EntropyVisualization password={currentPassword} analysis={passwordAnalysis} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

AdvancedPasswordGenerator.displayName = 'AdvancedPasswordGenerator';