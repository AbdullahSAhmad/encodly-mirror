import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { Settings, RotateCcw, Copy, Info } from 'lucide-react';

export interface AlphabetConfig {
  id: string;
  name: string;
  alphabet: string;
  description: string;
  padding?: string;
  urlSafe?: boolean;
}

interface AlphabetSelectorProps {
  selectedAlphabet: AlphabetConfig;
  onAlphabetChange: (alphabet: AlphabetConfig) => void;
  onToast?: (message: string) => void;
}

const PREDEFINED_ALPHABETS: AlphabetConfig[] = [
  {
    id: 'standard',
    name: 'Standard Base64',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    description: 'RFC 4648 standard Base64 alphabet with + and /',
    padding: '=',
    urlSafe: false
  },
  {
    id: 'url',
    name: 'Base64URL',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    description: 'URL-safe Base64 with - and _ (RFC 4648)',
    padding: '',
    urlSafe: true
  },
  {
    id: 'filename',
    name: 'Filename Safe',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-',
    description: 'Safe for use in filenames',
    padding: '_',
    urlSafe: false
  },
  {
    id: 'xml-name',
    name: 'XML Name',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._',
    description: 'XML name token safe alphabet',
    padding: '-',
    urlSafe: false
  },
  {
    id: 'xml-token',
    name: 'XML Token',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-',
    description: 'XML token safe alphabet',
    padding: '_',
    urlSafe: false
  }
];

export const AlphabetSelector: React.FC<AlphabetSelectorProps> = ({
  selectedAlphabet,
  onAlphabetChange,
  onToast
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customAlphabet, setCustomAlphabet] = useState('');
  const [customName, setCustomName] = useState('');
  const [customPadding, setCustomPadding] = useState('=');

  const validateAlphabet = useCallback((alphabet: string): string | null => {
    if (alphabet.length !== 64) {
      return 'Alphabet must contain exactly 64 characters';
    }
    
    const uniqueChars = new Set(alphabet);
    if (uniqueChars.size !== 64) {
      return 'All characters in the alphabet must be unique';
    }
    
    // Check for problematic characters
    const problematicChars = /[\s\n\r\t]/;
    if (problematicChars.test(alphabet)) {
      return 'Alphabet cannot contain whitespace characters';
    }
    
    return null;
  }, []);

  const handlePredefinedSelect = useCallback((alphabet: AlphabetConfig) => {
    onAlphabetChange(alphabet);
    onToast?.(`Selected ${alphabet.name} alphabet`);
  }, [onAlphabetChange, onToast]);

  const handleCustomAlphabetCreate = useCallback(() => {
    const validation = validateAlphabet(customAlphabet);
    if (validation) {
      onToast?.(validation);
      return;
    }
    
    if (!customName.trim()) {
      onToast?.('Please provide a name for the custom alphabet');
      return;
    }
    
    const customConfig: AlphabetConfig = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      alphabet: customAlphabet,
      description: 'Custom alphabet',
      padding: customPadding,
      urlSafe: false
    };
    
    onAlphabetChange(customConfig);
    onToast?.(`Created custom alphabet: ${customName}`);
    
    // Reset form
    setCustomAlphabet('');
    setCustomName('');
    setCustomPadding('=');
  }, [customAlphabet, customName, customPadding, validateAlphabet, onAlphabetChange, onToast]);

  const resetToStandard = useCallback(() => {
    onAlphabetChange(PREDEFINED_ALPHABETS[0]);
    onToast?.('Reset to standard Base64 alphabet');
  }, [onAlphabetChange, onToast]);

  const copyAlphabet = useCallback(async (alphabet: string) => {
    try {
      await navigator.clipboard.writeText(alphabet);
      onToast?.('Alphabet copied to clipboard');
    } catch (error) {
      onToast?.('Failed to copy alphabet');
    }
  }, [onToast]);

  const generateRandomAlphabet = useCallback(() => {
    const baseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const shuffled = baseAlphabet.split('').sort(() => Math.random() - 0.5).join('');
    setCustomAlphabet(shuffled);
    setCustomName('Random Alphabet');
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>Alphabet Configuration</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Show'} Options
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToStandard}
              title="Reset to Standard"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Simple Explanation */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-400 rounded">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What are Base64 Alphabets?</h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
            Base64 uses 64 different characters to encode data. Different "alphabets" use different character sets:
          </p>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <strong>Standard:</strong> Uses +/ (most common)</li>
            <li>• <strong>URL-Safe:</strong> Uses -_ (safe for URLs and filenames)</li>
            <li>• <strong>Custom:</strong> You can create your own 64-character set</li>
          </ul>
        </div>

        {/* Current Selection */}
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{selectedAlphabet.name}</h4>
            <div className="flex items-center gap-2">
              {selectedAlphabet.urlSafe && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  URL Safe
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyAlphabet(selectedAlphabet.alphabet)}
                title="Copy alphabet"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {selectedAlphabet.description}
          </p>
          <div className="font-mono text-xs bg-background border rounded p-2 break-all">
            {selectedAlphabet.alphabet}
          </div>
          {selectedAlphabet.padding && (
            <div className="mt-2 text-xs text-muted-foreground">
              Padding character: <span className="font-mono">{selectedAlphabet.padding}</span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* Predefined Alphabets */}
            <div>
              <h4 className="font-medium mb-3">Predefined Alphabets</h4>
              <div className="grid gap-3">
                {PREDEFINED_ALPHABETS.map((alphabet) => (
                  <div
                    key={alphabet.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAlphabet.id === alphabet.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-accent/50'
                    }`}
                    onClick={() => handlePredefinedSelect(alphabet)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{alphabet.name}</span>
                      <div className="flex items-center gap-2">
                        {alphabet.urlSafe && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            URL Safe
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyAlphabet(alphabet.alphabet);
                          }}
                          title="Copy alphabet"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{alphabet.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Alphabet */}
            <div>
              <h4 className="font-medium mb-3">Create Custom Alphabet</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter alphabet name"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Alphabet (64 characters)</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateRandomAlphabet}
                    >
                      Generate Random
                    </Button>
                  </div>
                  <textarea
                    value={customAlphabet}
                    onChange={(e) => setCustomAlphabet(e.target.value)}
                    placeholder="Enter 64 unique characters"
                    className="w-full h-20 px-3 py-2 border rounded-md font-mono text-sm resize-none"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Length: {customAlphabet.length}/64
                    {customAlphabet.length > 0 && (
                      <span className="ml-2">
                        Unique: {new Set(customAlphabet).size}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Padding Character</label>
                  <Input
                    value={customPadding}
                    onChange={(e) => setCustomPadding(e.target.value.slice(0, 1))}
                    placeholder="="
                    maxLength={1}
                    className="w-20"
                  />
                </div>
                
                <Button
                  onClick={handleCustomAlphabetCreate}
                  disabled={!customName.trim() || customAlphabet.length !== 64}
                  className="w-full"
                >
                  Create Custom Alphabet
                </Button>
              </div>
            </div>

            {/* Information */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-400 rounded">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Alphabet Guidelines
                  </h5>
                  <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-xs">
                    <li>• Standard Base64 uses A-Z, a-z, 0-9, +, / with = padding</li>
                    <li>• Base64URL uses A-Z, a-z, 0-9, -, _ with no padding (URL safe)</li>
                    <li>• Custom alphabets must have exactly 64 unique characters</li>
                    <li>• Avoid whitespace and special characters that might cause issues</li>
                    <li>• Different alphabets produce different encoded output</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};