import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Sun, Moon, Code2, ChevronDown, Search } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../hooks/useTheme';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { getToolUrls } from '../utils/urls';
import { CommandPalette } from './CommandPalette';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const toolUrls = getToolUrls();
  
  // Check if we're on the main site
  const isMainSite = window.location.hostname === 'localhost' 
    ? window.location.port === '5000' 
    : window.location.hostname === 'encodly.com' || window.location.hostname === 'www.encodly.com';
  
  const toolCategories = {
    'Text Tools': [
      { name: 'JSON Formatter', href: toolUrls.json, description: 'Format, validate & fix JSON' },
      { name: 'Base64 Converter', href: toolUrls.base64, description: 'Encode & decode Base64' },
      { name: 'URL Encoder/Decoder', href: toolUrls.url, description: 'Encode & decode URLs' },
      { name: 'Markdown Viewer', href: toolUrls.markdown, description: 'View & edit Markdown with live preview' },
      { name: 'Regex Tester', href: toolUrls.regex, description: 'Test & debug regular expressions' },
    ],
    'Security': [
      { name: 'JWT Token Decoder', href: toolUrls.jwt, description: 'Decode & validate JWT tokens' },
      { name: 'JWT Token Encoder', href: toolUrls.jwtEncoder, description: 'Create & sign JWT tokens' },
      { name: 'Password Generator', href: toolUrls.password, description: 'Generate secure passwords' },
      { name: 'Hash Generator', href: toolUrls.hash, description: 'Generate MD5, SHA256, SHA512 hashes' },
    ],
    'Generators': [
      { name: 'UUID Generator', href: toolUrls.uuid, description: 'Generate UUID/GUID v1, v4 & more' },
      { name: 'QR Code Generator', href: toolUrls.qr, description: 'Generate QR codes from text or URLs' },
      { name: 'Percentage Calculator', href: toolUrls.calc, description: 'Calculate percentages & ratios' },
    ]
  };

  // Flatten tools for current tool detection
  const allTools = Object.values(toolCategories).flat();

  // Get current tool from domain
  const currentTool = allTools.find(tool => {
    try {
      const toolDomain = tool.href.split('//')[1]?.split('.')[0];
      return toolDomain && window.location.hostname.includes(toolDomain);
    } catch (error) {
      return false;
    }
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for command palette
  useKeyboardShortcut([
    {
      key: 'k',
      ctrlKey: true,
      callback: (event) => {
        event.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    }
  ]);

  return (
    <header className="border-b">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <a href={toolUrls.main} className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">Encodly</span>
            </a>
            
            <nav className="hidden md:flex items-center">
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-sm font-medium">
                    {currentTool ? currentTool.name : 'Tools'}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-background border rounded-md shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
                    {Object.entries(toolCategories).map(([categoryName, categoryTools]) => (
                      <div key={categoryName}>
                        <div className="px-4 py-2 bg-muted/50 border-b">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {categoryName}
                          </div>
                        </div>
                        {categoryTools.map((tool) => (
                          <a
                            key={`${categoryName}-${tool.name}`}
                            href={tool.href}
                            className={`block px-4 py-3 hover:bg-muted transition ${
                              currentTool?.name === tool.name ? 'bg-muted' : ''
                            }`}
                          >
                            <div className="font-medium text-sm">{tool.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {tool.description}
                            </div>
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {isMainSite && (
                <a
                  href="/blog"
                  className="ml-4 px-3 py-2 text-sm font-medium hover:text-primary transition"
                >
                  Blog
                </a>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Command Palette Trigger */}
            <Button
              variant="ghost"
              onClick={() => setIsCommandPaletteOpen(true)}
              aria-label="Open command palette"
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-border/40 rounded-md transition-all duration-200 min-w-[240px] justify-start"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search commands...</span>
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </Button>

            {/* Tablet Command Palette Trigger */}
            <Button
              variant="ghost"
              onClick={() => setIsCommandPaletteOpen(true)}
              aria-label="Open command palette"
              className="hidden sm:flex lg:hidden items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-border/40 rounded-md transition-all duration-200"
            >
              <Search className="h-4 w-4" />
              <span className="text-left">Search</span>
            </Button>

            {/* Mobile Command Palette Trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCommandPaletteOpen(true)}
              aria-label="Open command palette"
              className="sm:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t space-y-4">
            {Object.entries(toolCategories).map(([categoryName, categoryTools]) => (
              <div key={categoryName} className="space-y-2">
                <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {categoryName}
                </div>
                {categoryTools.map((tool) => (
                  <a
                    key={`mobile-${categoryName}-${tool.name}`}
                    href={tool.href}
                    className="block px-4 py-2 text-muted-foreground hover:text-foreground transition"
                  >
                    {tool.name}
                  </a>
                ))}
              </div>
            ))}
            
            {isMainSite && (
              <div className="mt-4 pt-4 border-t">
                <a
                  href="/blog"
                  className="block px-4 py-2 text-muted-foreground hover:text-foreground transition"
                >
                  Blog
                </a>
              </div>
            )}
          </nav>
        )}
      </div>

      <CommandPalette 
        open={isCommandPaletteOpen} 
        onOpenChange={setIsCommandPaletteOpen} 
      />
    </header>
  );
};