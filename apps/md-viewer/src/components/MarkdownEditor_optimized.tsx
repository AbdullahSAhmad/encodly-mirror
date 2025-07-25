import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { Copy, Download, Upload, Trash2, ClipboardPaste, Bold, Italic, Link, Code, List, Hash, Image, Table, Quote } from 'lucide-react';
import { generateMarkdownStats } from '../utils/markdownUtils';

interface MarkdownEditorProps {
  markdown: string;
  onMarkdownChange: (value: string) => void;
  onToast?: (message: string) => void;
}

// Memoize the stats display to prevent unnecessary re-renders
const StatsDisplay = memo(({ stats, fileName, onFileNameChange }: { 
  stats: ReturnType<typeof generateMarkdownStats>; 
  fileName: string; 
  onFileNameChange: (name: string) => void;
}) => (
  <div className="flex items-center justify-between text-sm text-muted-foreground">
    <div className="flex items-center gap-4">
      <span>{stats.lines} lines</span>
      <span>{stats.words} words</span>
      <span>{stats.characters} chars</span>
      <span>{stats.readingTime}min read</span>
    </div>
    <Input
      value={fileName}
      onChange={(e) => onFileNameChange(e.target.value)}
      className="w-48 h-8"
      placeholder="document.md"
    />
  </div>
));

StatsDisplay.displayName = 'StatsDisplay';

export const MarkdownEditorOptimized: React.FC<MarkdownEditorProps> = ({
  markdown,
  onMarkdownChange,
  onToast
}) => {
  const [fileName, setFileName] = useState('document.md');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = generateMarkdownStats(markdown);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown') && !file.name.endsWith('.txt')) {
      onToast?.('Please select a Markdown file (.md, .markdown, or .txt)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onMarkdownChange(content);
      setFileName(file.name);
      onToast?.(`Uploaded ${file.name}`);
    };
    reader.readAsText(file);
  }, [onMarkdownChange, onToast]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newText = markdown.substring(0, start) + text + markdown.substring(end);
        onMarkdownChange(newText);
        
        // Restore cursor position
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(start + text.length, start + text.length);
          }
        }, 0);
      }
      onToast?.('Pasted from clipboard!');
    } catch (err) {
      onToast?.('Failed to read clipboard');
    }
  }, [markdown, onMarkdownChange, onToast]);

  const handleCopy = useCallback(async () => {
    if (!markdown.trim()) return;
    
    try {
      await navigator.clipboard.writeText(markdown);
      onToast?.('Copied to clipboard!');
    } catch (err) {
      onToast?.('Failed to copy to clipboard');
    }
  }, [markdown, onToast]);

  const handleDownload = useCallback(() => {
    if (!markdown.trim()) return;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onToast?.(`Downloaded ${fileName}`);
  }, [markdown, fileName, onToast]);

  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear all content?')) {
      onMarkdownChange('');
      setFileName('document.md');
      onToast?.('Content cleared');
    }
  }, [onMarkdownChange, onToast]);

  const insertAtCursor = useCallback((text: string, cursorOffset = 0) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = markdown.substring(0, start) + text + markdown.substring(end);
    
    onMarkdownChange(newText);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + text.length + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [markdown, onMarkdownChange]);

  const wrapSelection = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
    
    onMarkdownChange(newText);
    
    // Select the wrapped text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  }, [markdown, onMarkdownChange]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          wrapSelection('**', '**');
          break;
        case 'i':
          e.preventDefault();
          wrapSelection('*', '*');
          break;
        case 'k':
          e.preventDefault();
          wrapSelection('[', '](https://example.com)');
          break;
        case 'e':
          e.preventDefault();
          wrapSelection('`', '`');
          break;
      }
    }
    
    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      insertAtCursor('\t');
    }
  }, [insertAtCursor, wrapSelection]);

  const quickInsertButtons = [
    { icon: Hash, label: 'Heading', onClick: () => insertAtCursor('## ', -1) },
    { icon: Bold, label: 'Bold', onClick: () => wrapSelection('**', '**') },
    { icon: Italic, label: 'Italic', onClick: () => wrapSelection('*', '*') },
    { icon: Code, label: 'Code', onClick: () => wrapSelection('`', '`') },
    { icon: Link, label: 'Link', onClick: () => wrapSelection('[', '](https://example.com)') },
    { icon: Image, label: 'Image', onClick: () => insertAtCursor('![alt text](image-url)') },
    { icon: List, label: 'List', onClick: () => insertAtCursor('- ') },
    { icon: Quote, label: 'Quote', onClick: () => insertAtCursor('> ') },
    { icon: Table, label: 'Table', onClick: () => insertAtCursor('| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n') },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Markdown Editor</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              title="Upload file"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePaste}
              title="Paste from clipboard"
            >
              <ClipboardPaste className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!markdown.trim()}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!markdown.trim()}
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={!markdown.trim()}
              title="Clear content"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <StatsDisplay 
          stats={stats} 
          fileName={fileName} 
          onFileNameChange={setFileName} 
        />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 pt-0 overflow-hidden">
        {/* Quick Insert Toolbar */}
        <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b">
          {quickInsertButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.onClick}
              className="h-8 px-2"
              title={button.label}
            >
              <button.icon className="h-4 w-4 mr-1" />
              <span className="text-xs">{button.label}</span>
            </Button>
          ))}
        </div>

        {/* Keyboard shortcuts help */}
        <div className="text-xs text-muted-foreground mb-3">
          <span className="font-medium">Shortcuts:</span>{' '}
          <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+B</kbd> Bold,{' '}
          <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+I</kbd> Italic,{' '}
          <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+K</kbd> Link,{' '}
          <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+E</kbd> Code,{' '}
          <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Tab</kbd> Indent
        </div>

        {/* Editor Textarea */}
        <div className="flex-1 relative min-h-0">
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => onMarkdownChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start typing your markdown here..."
            className="absolute inset-0 w-full h-full p-4 border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring rounded-md font-mono leading-relaxed overflow-auto"
            spellCheck={false}
          />
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};