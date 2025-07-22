import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input } from '@encodly/shared-ui';
import { Search, ChevronUp, ChevronDown, ChevronLeft, X } from 'lucide-react';

interface SearchBarProps {
  content: string;
  onSearchResult?: (matches: SearchMatch[]) => void;
  onScrollToMatch?: (line: number, column: number) => void;
}

interface SearchMatch {
  line: number;
  column: number;
  text: string;
  index: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  content,
  onSearchResult,
  onScrollToMatch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const performSearch = useCallback(() => {
    if (!searchTerm.trim() || !content) {
      setMatches([]);
      setCurrentMatch(0);
      onSearchResult?.([]);
      return;
    }

    const lines = content.split('\n');
    const foundMatches: SearchMatch[] = [];
    let globalIndex = 0;

    lines.forEach((line, lineIndex) => {
      let columnIndex = 0;
      let searchInLine = line.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      while (true) {
        const foundAt = searchInLine.indexOf(searchLower, columnIndex);
        if (foundAt === -1) break;
        
        foundMatches.push({
          line: lineIndex + 1, // 1-based line numbers
          column: foundAt + 1, // 1-based column numbers
          text: line.substring(foundAt, foundAt + searchTerm.length),
          index: globalIndex++
        });
        
        columnIndex = foundAt + 1;
      }
    });

    setMatches(foundMatches);
    setCurrentMatch(foundMatches.length > 0 ? 0 : -1);
    onSearchResult?.(foundMatches);

    if (foundMatches.length > 0) {
      onScrollToMatch?.(foundMatches[0].line, foundMatches[0].column);
    }
  }, [searchTerm, content, onSearchResult, onScrollToMatch]);

  useEffect(() => {
    const timeoutId = setTimeout(performSearch, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  const navigateMatch = useCallback((direction: 'next' | 'prev') => {
    if (matches.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = currentMatch + 1 >= matches.length ? 0 : currentMatch + 1;
    } else {
      newIndex = currentMatch - 1 < 0 ? matches.length - 1 : currentMatch - 1;
    }

    setCurrentMatch(newIndex);
    const match = matches[newIndex];
    onScrollToMatch?.(match.line, match.column);
  }, [matches, currentMatch, onScrollToMatch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setMatches([]);
    setCurrentMatch(0);
    onSearchResult?.([]);
  }, [onSearchResult]);

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(true)}
        title="Search JSON (Ctrl+F)"
      >
        <Search className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-muted/50 border rounded-lg p-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search JSON..."
          className="pl-7 pr-3 py-1 h-7 text-xs"
          autoFocus
        />
      </div>
      
      {matches.length > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {currentMatch + 1} of {matches.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMatch('prev')}
            disabled={matches.length === 0}
            className="h-6 w-6 p-0"
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMatch('next')}
            disabled={matches.length === 0}
            className="h-6 w-6 p-0"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={clearSearch}
        className="h-6 w-6 p-0"
      >
        <X className="h-3 w-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(false)}
        className="h-6 w-6 p-0"
        title="Collapse search"
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>
    </div>
  );
};