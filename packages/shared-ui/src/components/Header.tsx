import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../hooks/useTheme';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const tools = [
    { name: 'JSON Formatter', href: 'https://json.encodly.com' },
    { name: 'Percentage Calculator', href: 'https://calc.encodly.com' },
    { name: 'Base64 Converter', href: 'https://base64.encodly.com' },
  ];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="https://encodly.com" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">Encodly</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.href}
                className="text-muted-foreground hover:text-foreground transition"
              >
                {tool.name}
              </a>
            ))}
          </nav>

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