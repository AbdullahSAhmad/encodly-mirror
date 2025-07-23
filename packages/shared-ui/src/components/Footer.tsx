import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getToolUrls, getPageUrl } from '../utils/urls';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const toolUrls = getToolUrls();

  const tools = [
    { name: 'JSON Formatter', href: toolUrls.json },
    { name: 'Base64 Converter', href: toolUrls.base64 },
  ];

  const links = [
    { name: 'About', href: getPageUrl('/about') },
    { name: 'Privacy Policy', href: getPageUrl('/privacy') },
    { name: 'Terms of Service', href: getPageUrl('/terms') },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Encodly Tools</h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <a
                    href={tool.href}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://x.com/encodly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition flex items-center gap-2"
                >
                  <span>Follow us on X</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Free developer tools to make your work easier.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Encodly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};