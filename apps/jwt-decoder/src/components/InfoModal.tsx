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
          <Button variant="outline" size="sm" title="About JWT Decoding">
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About JWT Decoding</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold mb-3">JWT Structure</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="font-medium text-sm">Header</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Algorithm and token type</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="font-medium text-sm">Payload</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Claims and user data</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="font-medium text-sm">Signature</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Verification hash</div>
                  </div>
                </div>

                <h4 className="text-base font-semibold mb-3 mt-4">Common Claims</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">iss</span>
                    <span className="text-muted-foreground">Issuer</span>
                  </div>
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">sub</span>
                    <span className="text-muted-foreground">Subject</span>
                  </div>
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">aud</span>
                    <span className="text-muted-foreground">Audience</span>
                  </div>
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">exp</span>
                    <span className="text-muted-foreground">Expiration</span>
                  </div>
                  <div className="flex justify-between items-center p-1">
                    <span className="font-mono">iat</span>
                    <span className="text-muted-foreground">Issued At</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-semibold mb-3">Key Features</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Instant token parsing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Color-coded sections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Expiration warnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Claims explanation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    <span>JSON formatting</span>
                  </div>
                </div>

                <h4 className="text-base font-semibold mb-3 mt-4">Use Cases</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Debug authentication issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Inspect API tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Verify token expiration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Understand token structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Security auditing</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Example Token Structure</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-2">Encoded JWT</p>
                  <div className="font-mono text-xs break-all">
                    <span className="text-red-500">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
                    <span className="text-muted-foreground">.</span>
                    <span className="text-blue-500">eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9</span>
                    <span className="text-muted-foreground">.</span>
                    <span className="text-green-500">TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2 text-red-500">Header (Decoded)</p>
                    <div className="p-2 bg-muted/50 rounded font-mono text-xs">
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2 text-blue-500">Payload (Decoded)</p>
                    <div className="p-2 bg-muted/50 rounded font-mono text-xs">
{`{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong className="text-foreground">Security Note:</strong> JWTs are base64-encoded, not encrypted. 
                Never include sensitive information in the payload as it can be easily decoded. Always validate 
                the signature and check expiration times.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};