import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Home, Info, Shield, FileText, Hash, Binary, Link2, Key, Sun, Moon, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useTheme } from '../hooks/useTheme';
import { getToolUrls } from '../utils/urls';
import { cn } from '../lib/utils';

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'tools' | 'actions';
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customCommands?: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  open, 
  onOpenChange,
  customCommands = []
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const toolUrls = getToolUrls();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isMainSite = window.location.hostname === 'encodly.com' || window.location.hostname === 'localhost' && window.location.port === '5000';

  const defaultCommands: CommandItem[] = useMemo(() => {
    const commands: CommandItem[] = [];

    // Navigation commands (only for main site)
    if (isMainSite) {
      commands.push(
        {
          id: 'home',
          title: 'Home',
          description: 'Go to homepage',
          icon: <Home className="h-4 w-4" />,
          action: () => {
            window.location.href = '/';
            onOpenChange(false);
          },
          category: 'navigation',
          keywords: ['main', 'index', 'start']
        },
        {
          id: 'about',
          title: 'About',
          description: 'Learn more about Encodly',
          icon: <Info className="h-4 w-4" />,
          action: () => {
            window.location.href = '/about';
            onOpenChange(false);
          },
          category: 'navigation',
          keywords: ['info', 'information']
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          description: 'View our privacy policy',
          icon: <Shield className="h-4 w-4" />,
          action: () => {
            window.location.href = '/privacy';
            onOpenChange(false);
          },
          category: 'navigation',
          keywords: ['data', 'protection']
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          description: 'View our terms of service',
          icon: <FileText className="h-4 w-4" />,
          action: () => {
            window.location.href = '/terms';
            onOpenChange(false);
          },
          category: 'navigation',
          keywords: ['legal', 'conditions']
        }
      );
    }

    // Tool commands (available everywhere)
    commands.push(
      {
        id: 'json-formatter',
        title: 'JSON Formatter',
        description: 'Format, validate & fix JSON',
        icon: <Hash className="h-4 w-4" />,
        action: () => {
          window.location.href = toolUrls.json;
          onOpenChange(false);
        },
        category: 'tools',
        keywords: ['json', 'format', 'validate', 'pretty', 'minify']
      },
      {
        id: 'base64-converter',
        title: 'Base64 Converter',
        description: 'Encode & decode Base64',
        icon: <Binary className="h-4 w-4" />,
        action: () => {
          window.location.href = toolUrls.base64;
          onOpenChange(false);
        },
        category: 'tools',
        keywords: ['base64', 'encode', 'decode', 'convert']
      },
      {
        id: 'url-converter',
        title: 'URL Encoder/Decoder',
        description: 'Encode & decode URLs',
        icon: <Link2 className="h-4 w-4" />,
        action: () => {
          window.location.href = toolUrls.url;
          onOpenChange(false);
        },
        category: 'tools',
        keywords: ['url', 'encode', 'decode', 'percent', 'uri', 'convert']
      },
      {
        id: 'jwt-decoder',
        title: 'JWT Token Decoder',
        description: 'Decode & validate JWT tokens',
        icon: <Key className="h-4 w-4" />,
        action: () => {
          window.location.href = toolUrls.jwt;
          onOpenChange(false);
        },
        category: 'tools',
        keywords: ['jwt', 'token', 'decode', 'json', 'web', 'claims', 'validate']
      },
      {
        id: 'jwt-encoder',
        title: 'JWT Token Encoder',
        description: 'Create & sign JWT tokens',
        icon: <Key className="h-4 w-4" />,
        action: () => {
          window.location.href = toolUrls.jwtEncoder;
          onOpenChange(false);
        },
        category: 'tools',
        keywords: ['jwt', 'token', 'encode', 'create', 'sign', 'json', 'web', 'generate']
      },
      {
        id: 'hash-generator',
        title: 'Hash Generator',
        description: 'Generate MD5, SHA-256 & more hashes',
        icon: <Hash className="h-4 w-4" />,
        action: () => {
          window.location.href = toolUrls.hash;
          onOpenChange(false);
        },
        category: 'tools',
        keywords: ['hash', 'md5', 'sha256', 'sha512', 'sha1', 'checksum', 'digest', 'crypto', 'security']
      }
    );

    // Action commands (available everywhere)
    commands.push({
      id: 'toggle-theme',
      title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      description: 'Toggle between light and dark theme',
      icon: theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      shortcut: '⌘+Shift+T',
      action: () => {
        toggleTheme();
        onOpenChange(false);
      },
      category: 'actions',
      keywords: ['theme', 'dark', 'light', 'mode', 'appearance']
    });

    return commands;
  }, [theme, toggleTheme, onOpenChange, toolUrls, isMainSite]);

  const allCommands = [...defaultCommands, ...customCommands];

  const filteredCommands = useMemo(() => {
    if (!search) return allCommands;

    const searchLower = search.toLowerCase();
    return allCommands.filter(command => {
      const titleMatch = command.title.toLowerCase().includes(searchLower);
      const descriptionMatch = command.description?.toLowerCase().includes(searchLower);
      const keywordMatch = command.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      );
      return titleMatch || descriptionMatch || keywordMatch;
    });
  }, [search, allCommands]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      navigation: [],
      tools: [],
      actions: []
    };

    filteredCommands.forEach(command => {
      groups[command.category].push(command);
    });

    return Object.entries(groups).filter(([_, commands]) => commands.length > 0);
  }, [filteredCommands]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Keyboard navigation
  const shortcuts = useMemo(() => [
    {
      key: 'ArrowDown',
      callback: () => {
        if (open) {
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
        }
      }
    },
    {
      key: 'ArrowUp',
      callback: () => {
        if (open) {
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
        }
      }
    },
    {
      key: 'Enter',
      callback: () => {
        if (open && filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    },
    {
      key: 'Escape',
      callback: () => {
        if (open) {
          onOpenChange(false);
        }
      }
    }
  ], [open, filteredCommands, selectedIndex, onOpenChange]);

  useKeyboardShortcut(shortcuts);

  // Scroll selected item into view
  useEffect(() => {
    if (open && listRef.current) {
      const selectedElement = listRef.current.querySelector('[data-selected="true"]');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, open]);

  const categoryLabels = {
    navigation: 'Navigation',
    tools: 'Tools',
    actions: 'Actions'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center px-4 border-b">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 py-3 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
        
        <div ref={listRef} className="max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              No commands found
            </div>
          ) : (
            groupedCommands.map(([category, commands], groupIndex) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </div>
                {commands.map((command, index) => {
                  const globalIndex = groupedCommands
                    .slice(0, groupIndex)
                    .reduce((acc, [_, cmds]) => acc + cmds.length, 0) + index;
                  const isSelected = selectedIndex === globalIndex;

                  return (
                    <div
                      key={command.id}
                      data-selected={isSelected}
                      className={cn(
                        'px-4 py-3 cursor-pointer transition-colors',
                        isSelected ? 'bg-accent' : 'hover:bg-accent/50'
                      )}
                      onClick={() => command.action()}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {command.icon && (
                            <div className="text-muted-foreground">
                              {command.icon}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{command.title}</div>
                            {command.description && (
                              <div className="text-sm text-muted-foreground">
                                {command.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {command.shortcut && (
                          <div className="text-xs text-muted-foreground">
                            {command.shortcut}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div>
            Ctrl+K to open
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};