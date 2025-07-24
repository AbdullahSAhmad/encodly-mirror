import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Button } from '@encodly/shared-ui';
import { Info } from 'lucide-react';

interface InfoModalProps {
  trigger?: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" title="About JWT Encoding">
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About JWT Encoding</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold mb-3">Supported Algorithms</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm">HS256</div>
                    <div className="text-xs text-muted-foreground">HMAC using SHA-256</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm">HS384</div>
                    <div className="text-xs text-muted-foreground">HMAC using SHA-384</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm">HS512</div>
                    <div className="text-xs text-muted-foreground">HMAC using SHA-512</div>
                  </div>
                </div>

                <h4 className="text-base font-semibold mb-3 mt-4">Key Features</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Real-time token generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Custom header & payload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Random payload generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Color-coded output</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    <span>Secure secret handling</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-semibold mb-3">Common Claims</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">iss</span>
                    <span className="text-muted-foreground">Token issuer</span>
                  </div>
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">sub</span>
                    <span className="text-muted-foreground">Subject (user ID)</span>
                  </div>
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">aud</span>
                    <span className="text-muted-foreground">Intended audience</span>
                  </div>
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">exp</span>
                    <span className="text-muted-foreground">Expiration time</span>
                  </div>
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">iat</span>
                    <span className="text-muted-foreground">Issued at time</span>
                  </div>
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">jti</span>
                    <span className="text-muted-foreground">JWT unique ID</span>
                  </div>
                </div>

                <h4 className="text-base font-semibold mb-3 mt-4">Use Cases</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>API authentication tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Session management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Single sign-on (SSO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Microservices authorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Testing and development</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Token Generation Process</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded text-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">1</div>
                  <p className="text-sm font-medium">Create Header</p>
                  <p className="text-xs text-muted-foreground">Algorithm & type</p>
                </div>
                <div className="p-3 bg-muted/50 rounded text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">2</div>
                  <p className="text-sm font-medium">Add Payload</p>
                  <p className="text-xs text-muted-foreground">Claims & data</p>
                </div>
                <div className="p-3 bg-muted/50 rounded text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">3</div>
                  <p className="text-sm font-medium">Sign Token</p>
                  <p className="text-xs text-muted-foreground">Generate signature</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Example Output</h4>
              <div className="p-3 bg-muted/50 rounded">
                <p className="text-sm font-medium mb-2">Generated JWT Token</p>
                <div className="font-mono text-xs break-all">
                  <span className="text-red-500">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-blue-500">eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-green-500">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Header
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Payload
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Signature
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong className="text-foreground">Security Best Practice:</strong> Always use strong, random secrets 
                for production tokens. Keep your secret keys secure and rotate them regularly. Never expose 
                secrets in client-side code or version control.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};