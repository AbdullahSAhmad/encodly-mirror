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
          <Button variant="outline" size="sm" title="About Base64 Encoding">
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About Base64 Encoding</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold mb-3">Character Set</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="font-mono text-sm">A-Z (26 chars)</span>
                    <span className="text-xs text-muted-foreground ml-2">Uppercase letters</span>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="font-mono text-sm">a-z (26 chars)</span>
                    <span className="text-xs text-muted-foreground ml-2">Lowercase letters</span>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="font-mono text-sm">0-9 (10 chars)</span>
                    <span className="text-xs text-muted-foreground ml-2">Digits</span>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="font-mono text-sm">+ / = (3 chars)</span>
                    <span className="text-xs text-muted-foreground ml-2">Special characters</span>
                  </div>
                </div>
                
                <h4 className="text-base font-semibold mb-3 mt-4">File Support</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Images (PNG, JPG, GIF, SVG)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Documents (PDF, TXT, CSV)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Archives (ZIP, TAR)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Any binary file</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-semibold mb-3">Common Use Cases</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Email attachments (MIME encoding)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Data URIs for embedding images in CSS/HTML</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>API authentication tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Binary data transmission over text protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Configuration files and certificates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Database storage of binary content</span>
                  </li>
                </ul>

                <h4 className="text-base font-semibold mb-3 mt-4">Key Features</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    <span>Drag & drop file upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Real-time encoding/decoding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>File download support</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Example Encoding</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Original Text</p>
                  <div className="p-3 bg-muted/50 rounded font-mono text-sm">
                    Hello World!
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Base64 Encoded</p>
                  <div className="p-3 bg-muted/50 rounded font-mono text-sm break-all">
                    SGVsbG8gV29ybGQh
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong className="text-foreground">Pro tip:</strong> Base64 encoding increases data size by approximately 33%. 
                It's perfect for embedding small files directly in web pages or transmitting binary data through 
                text-based protocols like JSON or XML.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};