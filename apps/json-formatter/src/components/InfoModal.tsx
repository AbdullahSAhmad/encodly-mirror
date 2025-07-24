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
          <Button variant="outline" size="sm" title="About JSON Formatting">
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About JSON Formatting</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold mb-3">Key Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">Auto-format and beautify JSON</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm">Minify and compress JSON</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-sm">Tree view for complex structures</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-sm">Search and highlight text</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">Real-time validation</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    <span className="text-sm">Download formatted results</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-semibold mb-3">Common Use Cases</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>API response debugging and inspection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Configuration file formatting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Database query result formatting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Log file analysis and prettification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>JSON schema validation and testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Data transformation and migration</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Example Transformation</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Before (Minified)</p>
                  <div className="p-3 bg-muted/50 rounded font-mono text-xs">
                    {"{"}"name":"John","age":30,"city":"NYC"{"}"} 
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">After (Formatted)</p>
                  <div className="p-3 bg-muted/50 rounded font-mono text-xs">
                    {`{
  "name": "John",
  "age": 30,
  "city": "NYC"
}`}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong className="text-foreground">Pro tip:</strong> Use the tree view for large JSON files 
                to navigate complex nested structures easily. The search feature helps you quickly find 
                specific keys or values in large datasets.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};