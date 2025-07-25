import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Button } from '@encodly/shared-ui';
import { Shield } from 'lucide-react';

interface InfoModalProps {
  trigger?: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" title="About Password Generator">
            <Shield className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About Password Generator</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold mb-3">Key Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">Customizable password length</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm">Multiple character sets</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-sm">Real-time strength analysis</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-sm">Advanced filtering options</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">Copy to clipboard</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    <span className="text-sm">Password validation checker</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-semibold mb-3">Security Best Practices</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use at least 12 characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Include multiple character types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Avoid dictionary words</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use unique passwords per account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Enable two-factor authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use a password manager</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Password Strength</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-red-600">Weak</p>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded font-mono text-xs">
                    password123
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-yellow-600">Fair</p>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded font-mono text-xs">
                    MyP@ssw0rd2024
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-green-600">Strong</p>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded font-mono text-xs">
                    Xm9$kL2#nR8&vQ5!
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong className="text-foreground">Privacy Notice:</strong> All password generation 
                happens locally in your browser. No passwords are sent to our servers or stored anywhere. 
                Your data remains completely private and secure.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};