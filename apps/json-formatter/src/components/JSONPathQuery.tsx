import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { Search, Copy, BookOpen, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { JSONPath } from 'jsonpath-plus';

interface JSONPathQueryProps {
  jsonData: string;
}

interface QueryResult {
  path: string;
  value: any;
  pointer: string;
  parent: any;
  parentProperty: string | number;
}

export const JSONPathQuery: React.FC<JSONPathQueryProps> = ({ jsonData }) => {
  const [query, setQuery] = useState('$');
  const [showExamples, setShowExamples] = useState(false);
  const [resultFormat, setResultFormat] = useState<'value' | 'path' | 'both'>('both');

  const examples = [
    { query: '$', description: 'Root element' },
    { query: '$..*', description: 'All elements' },
    { query: '$..name', description: 'All "name" properties' },
    { query: '$[0]', description: 'First array element' },
    { query: '$[-1]', description: 'Last array element' },
    { query: '$[0:3]', description: 'First 3 array elements' },
    { query: '$.store.book[*].author', description: 'All book authors' },
    { query: '$.store.book[?(@.price < 10)]', description: 'Books under $10' },
    { query: '$.store.book[?(@.author =~ /.*tolkien.*/i)]', description: 'Books by Tolkien (case insensitive)' },
    { query: '$.store.book.length', description: 'Number of books' },
    { query: '$..book[?(@.category == "fiction")]', description: 'Fiction books' },
    { query: '$..["special-property"]', description: 'Properties with special characters' },
  ];

  const queryResult = useMemo(() => {
    if (!jsonData.trim() || !query.trim()) {
      return { results: [], error: null, isValid: true };
    }

    try {
      const parsed = JSON.parse(jsonData);
      
      const results = JSONPath({
        path: query,
        json: parsed,
        resultType: 'all', // Returns objects with path, value, pointer, parent, parentProperty
        flatten: true,
        wrap: false
      });

      return {
        results: results as QueryResult[],
        error: null,
        isValid: true
      };
    } catch (parseError) {
      if (parseError instanceof SyntaxError && parseError.message.includes('JSON')) {
        return {
          results: [],
          error: 'Invalid JSON data',
          isValid: false
        };
      }
      
      return {
        results: [],
        error: parseError instanceof Error ? parseError.message : 'Invalid JSONPath query',
        isValid: false
      };
    }
  }, [jsonData, query]);

  const formatResult = (result: QueryResult) => {
    switch (resultFormat) {
      case 'value':
        return JSON.stringify(result.value, null, 2);
      case 'path':
        return result.path;
      case 'both':
        return {
          path: result.path,
          value: result.value
        };
      default:
        return result.value;
    }
  };

  const getFormattedResults = () => {
    if (queryResult.results.length === 0) {
      return '';
    }

    if (resultFormat === 'both') {
      return JSON.stringify(queryResult.results.map(formatResult), null, 2);
    }

    const formatted = queryResult.results.map(formatResult);
    return formatted.length === 1 
      ? (typeof formatted[0] === 'string' ? formatted[0] : JSON.stringify(formatted[0], null, 2))
      : JSON.stringify(formatted, null, 2);
  };

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(getFormattedResults());
    } catch (error) {
      console.error('Failed to copy results:', error);
    }
  };

  const loadExample = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            JSONPath Query
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExamples(!showExamples)}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Examples
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuery('$')}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Query Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">JSONPath Expression:</label>
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter JSONPath query (e.g., $.store.book[*].title)"
              className="font-mono"
            />
          </div>
        </div>

        {/* Result Format Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Result format:</span>
          <div className="flex gap-2">
            {[
              { value: 'both', label: 'Path + Value' },
              { value: 'value', label: 'Value Only' },
              { value: 'path', label: 'Path Only' }
            ].map(option => (
              <Button
                key={option.value}
                variant={resultFormat === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setResultFormat(option.value as any)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Query Status */}
        <div className="flex items-center gap-2">
          {queryResult.error ? (
            <>
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">{queryResult.error}</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">
                Found {queryResult.results.length} result(s)
              </span>
            </>
          )}
        </div>

        {/* Examples Panel */}
        {showExamples && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium mb-3">JSONPath Examples:</h4>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-background rounded border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => loadExample(example.query)}
                >
                  <div>
                    <code className="text-xs font-mono text-primary">{example.query}</code>
                    <div className="text-xs text-muted-foreground mt-0.5">{example.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Results:</label>
            {queryResult.results.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyResults}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            )}
          </div>
          
          <div className="bg-muted/50 rounded border p-3 max-h-64 overflow-auto">
            {queryResult.results.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                {queryResult.error ? 'Fix the error above to see results' : 'No results found'}
              </div>
            ) : (
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {getFormattedResults()}
              </pre>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 rounded p-2">
          <strong>💡 JSONPath Quick Reference:</strong>
          <ul className="mt-1 space-y-1">
            <li>• <code>$</code> - Root element</li>
            <li>• <code>@</code> - Current element (in filters)</li>
            <li>• <code>.property</code> - Child property</li>
            <li>• <code>['property']</code> - Child property (bracket notation)</li>
            <li>• <code>[n]</code> - Array index (0-based)</li>
            <li>• <code>[start:end]</code> - Array slice</li>
            <li>• <code>[*]</code> - All array elements</li>
            <li>• <code>..</code> - Recursive descent</li>
            <li>• <code>[?(@.prop &gt; value)]</code> - Filter expression</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};