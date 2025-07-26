import { Dialog, DialogContent, DialogTitle } from '@encodly/shared-ui';
import { Code, Shield, Zap, Globe, BookOpen, Terminal } from 'lucide-react';

interface InfoModalProps {
  onClose: () => void;
}

const InfoModal = ({ onClose }: InfoModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogTitle>About Regex Tester</DialogTitle>
      <div className="space-y-6">
        {/* Overview */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-500" />
            What is Regex Tester?
          </h3>
          <p className="text-zinc-600 dark:text-zinc-300">
            Our Regular Expression Tester is a powerful tool for testing, debugging, and validating regex patterns in real-time. 
            Perfect for developers who need to quickly test patterns, debug complex expressions, or learn regex syntax.
          </p>
        </section>

        {/* Features */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Key Features
          </h3>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Real-time pattern matching with instant visual feedback</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Support for all JavaScript regex flags (g, i, m, s, u, y)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Match highlighting and position tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Capture group extraction and display</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Common pattern templates for quick testing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Export results as JSON for documentation</span>
            </li>
          </ul>
        </section>

        {/* Use Cases */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-500" />
            Common Use Cases
          </h3>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Validate email addresses, URLs, and phone numbers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Extract data from structured text or logs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Test password strength patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Debug complex regex patterns step by step</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Learn regex syntax with instant feedback</span>
            </li>
          </ul>
        </section>

        {/* Examples */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-500" />
            Quick Examples
          </h3>
          <div className="space-y-3">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Extract all URLs:</p>
              <code className="text-xs font-mono text-blue-500">
                {`https?://[^\\s]+`}
              </code>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Find all email addresses:</p>
              <code className="text-xs font-mono text-blue-500">
                {`[\\w._%+-]+@[\\w.-]+\\.[A-Za-z]{2,}`}
              </code>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Match dates (DD/MM/YYYY):</p>
              <code className="text-xs font-mono text-blue-500">
                {`\\d{1,2}/\\d{1,2}/\\d{4}`}
              </code>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Pro Tips
          </h3>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">💡</span>
              <span>Use the 'g' flag to find all matches, not just the first one</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">💡</span>
              <span>Escape special characters with backslash (\) when matching literally</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">💡</span>
              <span>Use capture groups () to extract specific parts of matches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">💡</span>
              <span>Test with edge cases to ensure your pattern is robust</span>
            </li>
          </ul>
        </section>

        {/* Privacy */}
        <section className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Privacy & Security
          </h3>
          <p className="text-zinc-600 dark:text-zinc-300">
            All regex testing happens locally in your browser. No data is sent to our servers, 
            ensuring your patterns and test strings remain completely private and secure.
          </p>
        </section>
      </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;