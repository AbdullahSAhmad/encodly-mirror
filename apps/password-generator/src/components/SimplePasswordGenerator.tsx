import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { Copy, Download, Shuffle, Check, Settings, FileText, Package, ChevronDown, ChevronUp, MoreHorizontal, Eye, EyeOff, Clipboard, Trash2, BarChart3 } from 'lucide-react';
import { 
  AdvancedPasswordOptions, 
  generateRandomPassword, 
  generatePronounceablePassword, 
  generateDicewarePassphrase,
  generateBulkPasswords,
  exportPasswords,
  analyzePasswordStrength,
  BulkGenerationOptions
} from '../utils/advancedPasswordUtils';
import { StrengthIndicator } from './StrengthIndicator';
import { CompactEntropyVisualization } from './CompactEntropyVisualization';
import { ExportModal } from './ExportModal';

interface SimplePasswordGeneratorProps {
  onToast?: (message: string) => void;
}

export const SimplePasswordGenerator: React.FC<SimplePasswordGeneratorProps> = ({ onToast }) => {
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
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordAnalysis, setPasswordAnalysis] = useState(analyzePasswordStrength(''));
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState(analyzePasswordStrength(''));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisPassword, setShowAnalysisPassword] = useState(false);
  
  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (!isBulkMode && passwords.length === 0) {
      handleGenerateSingle();
    }
  }, []);

  useEffect(() => {
    if (passwords.length > 0) {
      const password = passwords[0];
      setCurrentPassword(password);
      setPasswordAnalysis(analyzePasswordStrength(password));
    }
  }, [passwords]);

  // Handle analysis input with debouncing
  useEffect(() => {
    if (!analysisInput.trim()) {
      setAnalysisResult(analyzePasswordStrength(''));
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);
    const debounceTimer = setTimeout(() => {
      const analysis = analyzePasswordStrength(analysisInput);
      setAnalysisResult(analysis);
      
      // Add a small delay for smooth animation
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 300);
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [analysisInput]);

  // Handle paste from clipboard
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAnalysisInput(text);
      onToast?.('Password pasted from clipboard!');
    } catch (err) {
      onToast?.('Failed to paste from clipboard');
    }
  }, [onToast]);

  // Handle clear input
  const handleClear = useCallback(() => {
    setAnalysisInput('');
    setShowAnalysisPassword(false);
  }, []);

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
    if (isBulkMode) {
      handleGenerateBulk();
    } else {
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
    <div className="grid grid-cols-2 gap-6">
      {/* Left Column - Configuration & Results */}
      <div className="space-y-4">
        {/* Configuration Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Generator Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {/* Single vs Bulk Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Generation Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={!isBulkMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsBulkMode(false)}
                    className="flex-1"
                  >
                    Single Password
                  </Button>
                  <Button
                    variant={isBulkMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsBulkMode(true)}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    Bulk Generate
                  </Button>
                </div>
              </div>

              {/* Algorithm Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Algorithm</label>
                <select 
                  value={options.algorithm} 
                  onChange={(e) => updateOption('algorithm', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="random">Random (Secure)</option>
                  <option value="pronounceable">Pronounceable</option>
                  <option value="diceware">Diceware Passphrase</option>
                </select>
              </div>

              {/* Bulk Count (Bulk Mode Only) */}
              {isBulkMode && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Passwords</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={bulkCount}
                      onChange={(e) => setBulkCount(Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)))}
                      min="1"
                      max="10000"
                      className="h-9 text-sm"
                    />
                    <span className="text-xs text-gray-500 flex items-center">max 10k</span>
                  </div>
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
                <div className="flex justify-between text-xs text-gray-500">
                  <span>4</span>
                  <span>128</span>
                </div>
              </div>

              {/* Diceware Words */}
              {options.algorithm === 'diceware' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Words: {options.dicewareWords}</label>
                  <input
                    type="range"
                    value={options.dicewareWords}
                    onChange={(e) => updateOption('dicewareWords', parseInt(e.target.value))}
                    min="2"
                    max="10"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>2</span>
                    <span>10</span>
                  </div>
                </div>
              )}

              {/* Character Options */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Character Types</label>
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
              </div>

              {/* Advanced Options Toggle */}
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
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <CustomCheckbox
                      id="exclude-similar"
                      checked={options.excludeSimilar}
                      onChange={(checked) => updateOption('excludeSimilar', checked)}
                      label="Exclude similar (il1Lo0O)"
                    />
                    <CustomCheckbox
                      id="exclude-ambiguous"
                      checked={options.excludeAmbiguous}
                      onChange={(checked) => updateOption('excludeAmbiguous', checked)}
                      label="Exclude ambiguous ({}[]())"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Custom Excluded Characters</label>
                    <Input
                      value={options.excludedCharacters || ''}
                      onChange={(e) => updateOption('excludedCharacters', e.target.value)}
                      placeholder="e.g. @#$"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                <Shuffle className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 
                 isBulkMode ? `Generate ${bulkCount} Passwords` : 'Generate Password'}
              </Button>
            </CardContent>
        </Card>

        {/* Results Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                {passwords.length > 0 
                  ? `${passwords.length > 1 ? `${passwords.length} Passwords` : 'Generated Password'}`
                  : 'Results'
                }
              </CardTitle>
              {passwords.length > 0 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAll}
                    className="h-8 px-2"
                    title="Copy all passwords"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload('txt')}
                    className="h-8 px-2"
                    title="Quick download as TXT"
                  >
                    <FileText className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExportModal(true)}
                    className="h-8 px-2"
                    title="Export options"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {passwords.length > 0 ? (
              <div className="space-y-3">
                <div className="border rounded-md max-h-80 overflow-auto">
                  <div className="p-3 space-y-2">
                    {passwords.slice(0, isBulkMode ? 50 : passwords.length).map((password, index) => (
                      <div key={index} className="group relative p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded flex items-center justify-between">
                        <span className="font-mono text-sm break-all select-all flex-1">{password}</span>
                        {passwords.length > 1 && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(password);
                              onToast?.('Password copied!');
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            title="Copy password"
                          >
                            <Copy className="h-3.5 w-3.5 text-gray-500" />
                          </button>
                        )}
                      </div>
                    ))}
                    {isBulkMode && passwords.length > 50 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        ... and {passwords.length - 50} more (scroll up to see all)
                      </div>
                    )}
                  </div>
                </div>
                {!isBulkMode && (
                  <StrengthIndicator password={passwords[0]} />
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Shuffle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Click Generate to create passwords</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Analysis (Always Visible) */}
      <div>
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Security Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Analysis Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enter password to analyze</label>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePaste}
                    className="h-8 px-2"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="h-3.5 w-3.5" />
                  </Button>
                  {analysisInput && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClear}
                      className="h-8 px-2 hover:text-red-500 hover:border-red-300"
                      title="Clear input"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="relative">
                <Input
                  type={showAnalysisPassword ? "text" : "password"}
                  value={analysisInput}
                  onChange={(e) => setAnalysisInput(e.target.value)}
                  placeholder="Type a password to analyze..."
                  className="pr-16"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {isAnalyzing && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  )}
                  {analysisInput && (
                    <button
                      type="button"
                      onClick={() => setShowAnalysisPassword(!showAnalysisPassword)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      title={showAnalysisPassword ? "Hide password" : "Show password"}
                    >
                      {showAnalysisPassword ? (
                        <EyeOff className="h-3.5 w-3.5 text-gray-500" />
                      ) : (
                        <Eye className="h-3.5 w-3.5 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Password is analyzed locally and never sent to servers
              </div>
            </div>

            {/* Analysis Results */}
            <div className={`transition-all duration-500 ease-in-out ${
              analysisInput.trim() ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              {analysisInput.trim() ? (
                <div className={`transition-opacity duration-300 ${isAnalyzing ? 'opacity-50' : 'opacity-100'}`}>
                  <CompactEntropyVisualization password={analysisInput} analysis={analysisResult} />
                </div>
              ) : null}
            </div>

            {/* Empty State */}
            {!analysisInput.trim() && (
              <div className="text-center py-12 text-gray-500 transition-opacity duration-300">
                <div className="h-8 w-8 mx-auto mb-2 opacity-50">🔒</div>
                <p className="text-sm">Enter a password above to see detailed security analysis</p>
              </div>
            )}

            {/* Quick Actions */}
            {passwords.length > 0 && !analysisInput.trim() && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAnalysisInput(passwords[0])}
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analyze Generated Password
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          passwords={passwords}
          options={options}
          onClose={() => setShowExportModal(false)}
          onToast={onToast}
        />
      )}
    </div>
  );
};

SimplePasswordGenerator.displayName = 'SimplePasswordGenerator';