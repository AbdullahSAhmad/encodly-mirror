import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const tools = [
    { name: 'JSON Formatter', href: 'https://json.encodly.com' },
    { name: 'Base64 Converter', href: 'https://base64.encodly.com' },
  ];

  const links = [
    { name: 'About', href: 'https://encodly.com/about' },
    { name: 'Privacy Policy', href: 'https://encodly.com/privacy' },
    { name: 'Terms of Service', href: 'https://encodly.com/terms' },
    { name: 'Contact', href: 'https://encodly.com/contact' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <div className="flex space-x-4">
              <a
                href="https://github.com/encodly"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/encodly"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@encodly.com"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Free developer tools to make your work easier. Built with performance and usability in mind.
            </p>
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