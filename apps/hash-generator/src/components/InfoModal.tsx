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
          <Button variant="outline" size="sm" title="About Hash Generation">
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About Hash Generation</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold mb-3">Supported Algorithms</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm flex items-center justify-between">
                      <span>SHA-256</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900 dark:text-green-200">Recommended</span>
                    </div>
                    <div className="text-xs text-muted-foreground">256-bit, cryptographically secure</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm flex items-center justify-between">
                      <span>SHA-512</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900 dark:text-green-200">Excellent</span>
                    </div>
                    <div className="text-xs text-muted-foreground">512-bit, maximum security</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm flex items-center justify-between">
                      <span>SHA-384</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">Good</span>
                    </div>
                    <div className="text-xs text-muted-foreground">384-bit, high security</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm flex items-center justify-between">
                      <span>SHA-1</span>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded dark:bg-orange-900 dark:text-orange-200">Legacy</span>
                    </div>
                    <div className="text-xs text-muted-foreground">160-bit, deprecated for security</div>
                  </div>
                </div>
                
                <h4 className="text-base font-semibold mb-3 mt-4">Key Features</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Multiple hash algorithms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>File and text hashing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Hash comparison tool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Security recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    <span>Format options</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-semibold mb-3">Common Use Cases</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>File integrity verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Password hashing and storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Digital signatures and certificates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Blockchain and cryptocurrency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Data deduplication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Checksum generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Database indexing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Software distribution verification</span>
                  </li>
                </ul>

                <h4 className="text-base font-semibold mb-3 mt-4">Security Levels</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Excellent (90-100%)</span>
                    <span className="text-muted-foreground">SHA-256, SHA-512</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Good (70-89%)</span>
                    <span className="text-muted-foreground">SHA-384</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Legacy (40-69%)</span>
                    <span className="text-muted-foreground">SHA-1</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Hash Examples</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Input: "Hello World"</p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="font-medium mb-1">SHA-1:</div>
                      <div className="font-mono bg-muted/50 p-2 rounded break-all">
                        0a4d55a8d778e5022fab701977c5d840bbc486d0
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">SHA-256:</div>
                      <div className="font-mono bg-muted/50 p-2 rounded break-all">
                        a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Properties</p>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>Deterministic:</strong> Same input = same hash</li>
                    <li>• <strong>Fixed size:</strong> Output length is constant</li>
                    <li>• <strong>One-way:</strong> Cannot reverse to get input</li>
                    <li>• <strong>Avalanche:</strong> Small change = big difference</li>
                    <li>• <strong>Collision resistant:</strong> Hard to find duplicates</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Tool Features</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Generator</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Generate hashes for text input</li>
                    <li>• Upload and hash files</li>
                    <li>• Multiple algorithms simultaneously</li>
                    <li>• Copy and download results</li>
                    <li>• Test data generation</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Comparison</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Compare two hash values</li>
                    <li>• Validate hash formats</li>
                    <li>• Algorithm-specific comparison</li>
                    <li>• Paste from clipboard</li>
                    <li>• Verification results</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong className="text-foreground">Security Recommendation:</strong> Use SHA-256 or SHA-512 
                for security-critical applications. Avoid SHA-1 for cryptographic purposes. 
                This tool processes data locally in your browser for maximum privacy.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};