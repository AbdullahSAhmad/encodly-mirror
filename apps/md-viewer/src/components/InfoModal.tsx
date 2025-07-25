import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Button } from '@encodly/shared-ui';
import { Info, Sparkles, Keyboard, FileText, Github } from 'lucide-react';

interface InfoModalProps {
  trigger?: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" title="About Markdown Viewer">
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Markdown Viewer Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-8">
          {/* About the App */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">About This Tool</h3>
            </div>
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Markdown Viewer</strong> is a powerful, real-time markdown editor 
                with live preview capabilities. Write markdown on the left, see the rendered output on the right. 
                Perfect for documentation, README files, blog posts, and technical writing. Built by the team at{' '}
                <a href="https://encodly.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Encodly
                </a>{' '}
                to make markdown editing effortless and beautiful.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section>
            <h3 className="text-lg font-semibold mb-4">✨ Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Live preview as you type</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">GitHub Flavored Markdown</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Math equations (KaTeX)</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Syntax highlighting</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm font-medium">Auto-save & persistence</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Export & download</span>
                </div>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Bold text</span>
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">Ctrl+B</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Italic text</span>
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">Ctrl+I</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Insert link</span>
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">Ctrl+K</kbd>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Inline code</span>
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">Ctrl+E</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Line break</span>
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">Shift+Enter</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Tab indent</span>
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">Tab</kbd>
                </div>
              </div>
            </div>
          </section>

          {/* Markdown Syntax Guide */}
          <section>
            <h3 className="text-lg font-semibold mb-4">📝 Markdown Syntax Guide</h3>
            <div className="space-y-6">
              
              {/* Basic Formatting */}
              <div>
                <h4 className="font-medium mb-3 text-primary">Basic Formatting</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">Syntax</p>
                    <div className="p-3 bg-muted/50 rounded font-mono text-xs space-y-1">
                      <div># Heading 1</div>
                      <div>## Heading 2</div>
                      <div>**bold text**</div>
                      <div>*italic text*</div>
                      <div>~~strikethrough~~</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">Result</p>
                    <div className="p-3 bg-muted/50 rounded text-xs space-y-1">
                      <div className="text-lg font-bold">Heading 1</div>
                      <div className="text-base font-semibold">Heading 2</div>
                      <div><strong>bold text</strong></div>
                      <div><em>italic text</em></div>
                      <div className="line-through">strikethrough</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lists and Links */}
              <div>
                <h4 className="font-medium mb-3 text-primary">Lists & Links</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="p-3 bg-muted/50 rounded font-mono text-xs space-y-1">
                      <div>- Item 1</div>
                      <div>- Item 2</div>
                      <div>1. Numbered item</div>
                      <div>- [x] Task completed</div>
                      <div>- [ ] Task pending</div>
                      <div>[Link text](https://example.com)</div>
                    </div>
                  </div>
                  <div>
                    <div className="p-3 bg-muted/50 rounded text-xs space-y-1">
                      <div>• Item 1</div>
                      <div>• Item 2</div>
                      <div>1. Numbered item</div>
                      <div>☑ Task completed</div>
                      <div>☐ Task pending</div>
                      <div><a href="#" className="text-primary underline">Link text</a></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code and Math */}
              <div>
                <h4 className="font-medium mb-3 text-primary">Code & Math</h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium mb-2 text-muted-foreground">Inline Code</p>
                      <div className="p-3 bg-muted/50 rounded font-mono text-xs">
                        `const x = 42;`
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-2 text-muted-foreground">Math Equation</p>
                      <div className="p-3 bg-muted/50 rounded font-mono text-xs">
                        $E = mc^2$
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2 text-muted-foreground">Code Block</p>
                    <div className="p-3 bg-muted/50 rounded font-mono text-xs">
                      ```javascript<br/>
                      function hello() {'{'}
                      &nbsp;&nbsp;console.log("Hello World!");
                      <br/>
                      {'}'}
                      <br/>
                      ```
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with ❤️ by</span>
                <a href="https://encodly.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  Encodly
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/markdown-it/markdown-it" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <span>Markdown Spec</span>
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};