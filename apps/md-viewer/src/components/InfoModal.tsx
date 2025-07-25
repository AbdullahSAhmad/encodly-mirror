import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Button } from '@encodly/shared-ui';
import { FileText } from 'lucide-react';

interface InfoModalProps {
  trigger?: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" title="About Markdown Viewer">
            <FileText className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About Markdown Viewer</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold mb-3">Key Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">Live preview as you type</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm">GitHub Flavored Markdown support</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-sm">Math equations with KaTeX</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-sm">Syntax highlighting for code</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">Tables and task lists</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    <span className="text-sm">Export to HTML and download</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-semibold mb-3">Supported Markdown</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Headers (# ## ###)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Bold, italic, strikethrough</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Links and images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Code blocks with highlighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Lists and task lists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Tables and blockquotes</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Math Equations</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Inline Math</p>
                  <div className="p-3 bg-muted/50 rounded font-mono text-xs">
                    $E = mc^2$
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Block Math</p>
                  <div className="p-3 bg-muted/50 rounded font-mono text-xs">
                    $$\int_{'{-\\infty}'}^{'{\\infty}'} e^{'{-x^2}'} dx = \sqrt{'{\\pi}'}$$
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong className="text-foreground">Pro tip:</strong> Use the split view to see 
                your markdown and preview side by side. Math equations render using KaTeX for 
                beautiful mathematical notation.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};