import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Sun, Moon, Code2, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../hooks/useTheme';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const tools = [
    { name: 'JSON Formatter', href: 'https://json.encodly.com', description: 'Format, validate & fix JSON' },
    { name: 'Base64 Converter', href: 'https://base64.encodly.com', description: 'Encode & decode Base64' },
  ];

  // Get current tool from domain
  const currentTool = tools.find(tool => 
    window.location.hostname.includes(tool.href.split('//')[1].split('.')[0])
  );

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

  return (
    <header className="border-b">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <a href="https://encodly.com" className="flex items-center space-x-2">
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
                  <div className="absolute top-full left-0 mt-2 w-64 bg-background border rounded-md shadow-lg overflow-hidden z-50">
                    {tools.map((tool) => (
                      <a
                        key={tool.name}
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
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
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
          <nav className="md:hidden py-4 border-t">
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.href}
                className="block py-2 text-muted-foreground hover:text-foreground transition"
              >
                {tool.name}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};