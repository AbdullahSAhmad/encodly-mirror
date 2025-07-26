import { useState, useEffect, useCallback } from 'react';
import { Button, Card, Input } from '@encodly/shared-ui';
import { Copy, Download, AlertCircle, RefreshCw } from 'lucide-react';

interface RegexMatch {
  match: string;
  start: number;
  end: number;
  groups: (string | undefined)[];
}

interface RegexFlag {
  flag: string;
  label: string;
  description: string;
}

const REGEX_FLAGS: RegexFlag[] = [
  { flag: 'g', label: 'Global', description: 'Find all matches' },
  { flag: 'i', label: 'Case Insensitive', description: 'Ignore case' },
  { flag: 'm', label: 'Multiline', description: '^ and $ match line breaks' },
  { flag: 's', label: 'Single Line', description: '. matches newlines' },
  { flag: 'u', label: 'Unicode', description: 'Enable Unicode support' },
  { flag: 'y', label: 'Sticky', description: 'Matches from lastIndex' },
];

const COMMON_PATTERNS = [
  { name: 'Email', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
  { name: 'Phone (US)', pattern: '^\\+?1?[\\s-]?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}$' },
  { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
  { name: 'Time (HH:MM)', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' },
  { name: 'IPv4 Address', pattern: '^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$' },
  { name: 'Hex Color', pattern: '^#?([a-f0-9]{6}|[a-f0-9]{3})$' },
  { name: 'Username', pattern: '^[a-zA-Z0-9_-]{3,16}$' },
  { name: 'Password Strong', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$' },
  { name: 'Credit Card', pattern: '^\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}$' },
];

interface RegexTesterProps {
  toast: (message: string, type?: 'success' | 'error') => void;
}

const RegexTester = ({ toast }: RegexTesterProps) => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState<string[]>(['g']);
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState<string>('');
  const [isValid, setIsValid] = useState(true);
  const [highlightedText, setHighlightedText] = useState<JSX.Element | null>(null);

  const testRegex = useCallback(() => {
    if (!pattern) {
      setMatches([]);
      setError('');
      setIsValid(true);
      setHighlightedText(null);
      return;
    }

    try {
      const flagString = flags.join('');
      const regex = new RegExp(pattern, flagString);
      setIsValid(true);
      setError('');

      const foundMatches: RegexMatch[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            start: match.index,
            end: match.index + match[0].length,
            groups: match.slice(1),
          });
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            start: match.index,
            end: match.index + match[0].length,
            groups: match.slice(1),
          });
        }
      }

      setMatches(foundMatches);

      // Create highlighted text
      if (foundMatches.length > 0 && testString) {
        const parts: JSX.Element[] = [];
        let lastIndex = 0;

        foundMatches.forEach((match, index) => {
          // Add text before match
          if (match.start > lastIndex) {
            parts.push(
              <span key={`text-${index}`}>
                {testString.substring(lastIndex, match.start)}
              </span>
            );
          }

          // Add matched text
          parts.push(
            <span
              key={`match-${index}`}
              className="bg-yellow-200 dark:bg-yellow-900 px-1 rounded"
            >
              {match.match}
            </span>
          );

          lastIndex = match.end;
        });

        // Add remaining text
        if (lastIndex < testString.length) {
          parts.push(
            <span key="text-end">{testString.substring(lastIndex)}</span>
          );
        }

        setHighlightedText(<>{parts}</>);
      } else {
        setHighlightedText(<>{testString}</>);
      }
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid regular expression');
      setMatches([]);
      setHighlightedText(null);
    }
  }, [pattern, testString, flags]);

  useEffect(() => {
    testRegex();
  }, [testRegex]);

  const toggleFlag = (flag: string) => {
    setFlags(prev =>
      prev.includes(flag)
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  const copyPattern = () => {
    navigator.clipboard.writeText(pattern);
    toast('Pattern copied to clipboard!', 'success');
  };

  const copyMatches = () => {
    const matchText = matches.map(m => m.match).join('\n');
    navigator.clipboard.writeText(matchText);
    toast('Matches copied to clipboard!', 'success');
  };

  const downloadResults = () => {
    const results = {
      pattern,
      flags: flags.join(''),
      testString,
      matches: matches.map(m => ({
        match: m.match,
        position: `${m.start}-${m.end}`,
        groups: m.groups,
      })),
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex-test-results.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Results downloaded!', 'success');
  };

  const loadPattern = (commonPattern: typeof COMMON_PATTERNS[0]) => {
    setPattern(commonPattern.pattern);
    toast(`Loaded ${commonPattern.name} pattern`, 'success');
  };

  const clearAll = () => {
    setPattern('');
    setTestString('');
    setFlags(['g']);
    setMatches([]);
    setError('');
    toast('Cleared all fields', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <Card>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Regular Expression Pattern
            </label>
            <div className="flex gap-2">
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter your regex pattern..."
                className={`flex-1 font-mono ${!isValid ? 'border-red-500' : ''}`}
              />
              <Button
                onClick={copyPattern}
                variant="outline"
                size="sm"
                disabled={!pattern}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {error && (
              <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {/* Flags */}
          <div>
            <label className="block text-sm font-medium mb-2">Flags</label>
            <div className="flex flex-wrap gap-2">
              {REGEX_FLAGS.map(({ flag, label, description }) => (
                <button
                  key={flag}
                  onClick={() => toggleFlag(flag)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    flags.includes(flag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                  title={description}
                >
                  {label} ({flag})
                </button>
              ))}
            </div>
          </div>

          {/* Common Patterns */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Common Patterns
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {COMMON_PATTERNS.map((commonPattern) => (
                <Button
                  key={commonPattern.name}
                  onClick={() => loadPattern(commonPattern)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {commonPattern.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Test String */}
      <Card>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Test String
            </label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against the regex pattern..."
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] font-mono text-sm"
              rows={6}
            />
          </div>

          {/* Highlighted Result */}
          {highlightedText && testString && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Highlighted Matches
              </label>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 font-mono text-sm whitespace-pre-wrap break-all">
                {highlightedText}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      {matches.length > 0 && (
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Matches ({matches.length})
              </h3>
              <div className="flex gap-2">
                <Button onClick={copyMatches} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Matches
                </Button>
                <Button onClick={downloadResults} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-mono text-sm">
                        <span className="text-zinc-500">Match {index + 1}:</span>{' '}
                        <span className="font-semibold">{match.match}</span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        Position: {match.start}-{match.end}
                      </div>
                      {match.groups.length > 0 && match.groups.some(g => g !== undefined) && (
                        <div className="text-xs space-y-1 mt-2">
                          <div className="text-zinc-500">Groups:</div>
                          {match.groups.map((group, gIndex) => (
                            group !== undefined && (
                              <div key={gIndex} className="ml-4 font-mono">
                                Group {gIndex + 1}: {group}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* No Matches */}
      {pattern && testString && matches.length === 0 && isValid && (
        <Card>
          <div className="p-6 text-center text-zinc-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No matches found</p>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={clearAll} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default RegexTester;