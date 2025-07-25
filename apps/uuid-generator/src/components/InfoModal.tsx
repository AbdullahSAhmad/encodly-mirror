import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@encodly/shared-ui';
import { Key, Hash, Clock, Database, Shield, Zap, CheckCircle, Users } from 'lucide-react';

interface InfoModalProps {
  trigger: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Key className="h-6 w-6" />
            UUID Generator Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Hash className="h-5 w-5" />
              What are UUIDs?
            </h3>
            <p className="text-muted-foreground mb-4">
              UUID (Universally Unique Identifier) or GUID (Globally Unique Identifier) is a 128-bit number 
              used to uniquely identify information in computer systems. UUIDs are standardized by RFC 4122 
              and are designed to be unique across time and space without requiring a central authority.
            </p>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-mono">
                Example: 550e8400-e29b-41d4-a716-446655440000
              </p>
            </div>
          </section>

          {/* UUID Versions */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Database className="h-5 w-5" />
              UUID Versions
            </h3>
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  UUID v1 (Timestamp-based)
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Generated using current timestamp and MAC address. Provides temporal ordering but may 
                  reveal the generating machine's MAC address.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Use Case:</strong> When you need time-based ordering and don't mind MAC address exposure
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  UUID v4 (Random)
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Generated using cryptographically secure random numbers. Most commonly used version 
                  due to its simplicity and strong uniqueness guarantees.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Use Case:</strong> General purpose, database primary keys, session IDs
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  Nil & Max UUIDs
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Special UUIDs: Nil (all zeros) represents null/empty, Max (all ones) represents maximum value.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Use Case:</strong> Default values, boundary testing, special markers
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Tool Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Generation Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Single UUID generation</li>
                  <li>• Bulk generation (up to 1,000 UUIDs)</li>
                  <li>• Multiple UUID versions support</li>
                  <li>• Copy individual or all UUIDs</li>
                  <li>• Download as text file</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Validation Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• UUID format validation</li>
                  <li>• Version detection</li>
                  <li>• Detailed UUID information parsing</li>
                  <li>• Multiple format support</li>
                  <li>• Compact format support (no hyphens)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common Use Cases */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Common Use Cases
            </h3>
            <div className="grid gap-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Database Primary Keys</h4>
                <p className="text-sm text-muted-foreground">
                  Use UUID v4 for distributed databases where auto-increment IDs aren't suitable.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium">API Request IDs</h4>
                <p className="text-sm text-muted-foreground">
                  Track API requests and responses across distributed systems.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium">Session Management</h4>
                <p className="text-sm text-muted-foreground">
                  Generate unique session identifiers that can't be guessed.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium">File Naming</h4>
                <p className="text-sm text-muted-foreground">
                  Create unique filenames to avoid collisions in distributed storage.
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Choose v4 for general use:</strong> Most applications should use UUID v4 for security and simplicity</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Store as binary:</strong> In databases, store UUIDs as binary (16 bytes) for better performance</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Use lowercase format:</strong> Stick to lowercase with hyphens for consistency</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Validate input:</strong> Always validate UUIDs from external sources</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Consider indexing:</strong> UUIDs can impact database performance; consider indexing strategies</span>
              </div>
            </div>
          </section>

          {/* Pro Tips */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">💡 Pro Tips</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Bulk Generation:</strong> Generate multiple UUIDs at once for testing or seeding data</p>
              <p><strong>Format Conversion:</strong> Use the validator to convert between different UUID formats</p>
              <p><strong>Version Detection:</strong> Validate UUIDs to understand their type and extract metadata</p>
              <p><strong>Copy Shortcuts:</strong> Click the copy button next to any UUID for quick clipboard access</p>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with ❤️ by</span>
                <a href="https://encodly.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  Encodly
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};