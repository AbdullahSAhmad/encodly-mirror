import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { Copy, Download, Shuffle, Check, Settings, BarChart3, Shield, Zap, ChevronDown, ChevronUp, FileText, Package } from 'lucide-react';
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
  BulkGenerationOptions
} from '../utils/advancedPasswordUtils';
import { StrengthIndicator } from './StrengthIndicator';
import { CompactEntropyVisualization } from './CompactEntropyVisualization';

interface CompactPasswordGeneratorProps {
  onToast?: (message: string) => void;
}

type GenerationMode = 'single' | 'bulk' | 'policy';

export const CompactPasswordGenerator: React.FC<CompactPasswordGeneratorProps> = ({ onToast }) => {
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
  const [bulkCount, setBulkCount] = useState(10);
  const [selectedPolicy, setSelectedPolicy] = useState('nist-basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordAnalysis, setPasswordAnalysis] = useState(analyzePasswordStrength(''));
  const [policyErrors, setPolicyErrors] = useState<string[]>([]);
  
  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [configExpanded, setConfigExpanded] = useState(true);

  useEffect(() => {
    if (generationMode === 'single' && passwords.length === 0) {
      handleGenerateSingle();
    }
  }, []);

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
      onToast?.(`${passwords.length} password${passwords.length > 1 ? 's' : ''} copied!`);
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
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer group">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
          checked
            ? 'bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-blue-300 dark:group-hover:border-blue-500'
        }`}>
          {checked && <Check className="h-2.5 w-2.5 text-white" />}
        </div>
      </div>
      <span className="text-sm select-none">{label}</span>
    </label>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Column - Configuration */}
      <div className="lg:col-span-1 space-y-4">
        {/* Mode & Options Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Generator Settings</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfigExpanded(!configExpanded)}
                className="h-8 w-8 p-0"
              >
                {configExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {configExpanded && (
            <CardContent className="space-y-4">
              {/* Generation Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mode</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <button
                    onClick={() => setGenerationMode('single')}
                    className={`px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                      generationMode === 'single' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => setGenerationMode('bulk')}
                    className={`px-2 py-1.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1 ${
                      generationMode === 'bulk' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Package className="h-3 w-3" />
                    Bulk
                  </button>
                  <button
                    onClick={() => setGenerationMode('policy')}
                    className={`px-2 py-1.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1 ${
                      generationMode === 'policy' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Shield className="h-3 w-3" />
                    Policy
                  </button>
                </div>
              </div>

              {/* Algorithm Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Algorithm</label>
                <select 
                  value={options.algorithm} 
                  onChange={(e) => updateOption('algorithm', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="random">Random</option>
                  <option value="pronounceable">Pronounceable</option>
                  <option value="diceware">Diceware</option>
                </select>
              </div>

              {/* Policy Selection (Policy Mode Only) */}
              {generationMode === 'policy' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Policy</label>
                  <select 
                    value={selectedPolicy} 
                    onChange={(e) => setSelectedPolicy(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(NIST_POLICIES).map(([key, policy]) => (
                      <option key={key} value={key}>{policy.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bulk Count (Bulk Mode Only) */}
              {generationMode === 'bulk' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Count</label>
                  <Input
                    type="number"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)))}
                    min="1"
                    max="10000"
                    className="h-8 text-sm"
                  />
                </div>
              )}

              {/* Length */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Length: {options.length}</label>
                <input
                  type="range"
                  value={options.length}
                  onChange={(e) => updateOption('length', parseInt(e.target.value))}
                  min="4"
                  max="128"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>

              {/* Diceware Words */}
              {options.algorithm === 'diceware' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Words: {options.dicewareWords}</label>
                  <input
                    type="range"
                    value={options.dicewareWords}
                    onChange={(e) => updateOption('dicewareWords', parseInt(e.target.value))}
                    min="2"
                    max="10"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              )}

              {/* Character Options */}
              <div className="space-y-2">
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

              {/* Advanced Toggle */}
              <div className="pt-2 border-t">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Settings className="h-4 w-4" />
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </button>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="space-y-2 pt-2">
                  <CustomCheckbox
                    id="exclude-similar"
                    checked={options.excludeSimilar}
                    onChange={(checked) => updateOption('excludeSimilar', checked)}
                    label="No similar chars (il1Lo0O)"
                  />
                  <CustomCheckbox
                    id="exclude-ambiguous"
                    checked={options.excludeAmbiguous}
                    onChange={(checked) => updateOption('excludeAmbiguous', checked)}
                    label="No ambiguous ({}[]())"
                  />
                  <div>
                    <Input
                      value={options.excludedCharacters || ''}
                      onChange={(e) => updateOption('excludedCharacters', e.target.value)}
                      placeholder="Custom excluded chars"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Analysis Toggle */}
        {passwords.length > 0 && (
          <Card>
            <CardContent className="py-3">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="w-full flex items-center justify-between text-sm font-medium"
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Security Analysis
                </span>
                {showAnalysis ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Middle Column - Results */}
      <div className={`${showAnalysis ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-4`}>
        {/* Policy Errors */}
        {generationMode === 'policy' && policyErrors.length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="py-3">
              <div className="text-sm">
                <div className="font-medium text-red-800 dark:text-red-200 mb-1">Policy Violations:</div>
                <ul className="text-xs text-red-700 dark:text-red-300 space-y-0.5">
                  {policyErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                {passwords.length > 0 
                  ? `Generated ${passwords.length > 1 ? `${passwords.length} Passwords` : 'Password'}`
                  : 'Results'
                }
              </CardTitle>
              {passwords.length > 0 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAll}
                    className="h-8 px-2"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload('txt')}
                    className="h-8 px-2"
                  >
                    <FileText className="h-3.5 w-3.5" />
                  </Button>
                  {passwords.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload('csv')}
                      className="h-8 px-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {passwords.length > 0 ? (
              <div className="space-y-2">
                <div className="border rounded-md max-h-96 overflow-auto">
                  <div className="p-3 space-y-2">
                    {passwords.slice(0, generationMode === 'bulk' ? 100 : passwords.length).map((password, index) => (
                      <div key={index} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                        <span className="font-mono text-sm break-all select-all">{password}</span>
                      </div>
                    ))}
                    {generationMode === 'bulk' && passwords.length > 100 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        ... and {passwords.length - 100} more
                      </div>
                    )}
                  </div>
                </div>
                {passwords.length === 1 && (
                  <StrengthIndicator password={passwords[0]} />
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Click Generate to create passwords
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Analysis (Conditional) */}
      {showAnalysis && passwords.length > 0 && (
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CompactEntropyVisualization password={currentPassword} analysis={passwordAnalysis} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

CompactPasswordGenerator.displayName = 'CompactPasswordGenerator';