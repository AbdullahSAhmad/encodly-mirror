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
          <Button variant="outline" size="sm" title="About Percentage Calculations">
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About Percentage Calculations</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold mb-3">Calculation Types</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm">Percentage of a Number</div>
                    <div className="text-xs text-muted-foreground">20% of 150 = 30</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm">Number as Percentage</div>
                    <div className="text-xs text-muted-foreground">30 out of 150 = 20%</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm">Percentage Change</div>
                    <div className="text-xs text-muted-foreground">From 100 to 120 = +20%</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-medium text-sm">Reverse Percentage</div>
                    <div className="text-xs text-muted-foreground">30 is 20% of 150</div>
                  </div>
                </div>

                <h4 className="text-base font-semibold mb-3 mt-4">Key Features</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Multiple calculation modes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Real-time results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Step-by-step explanations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Calculation history</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-semibold mb-3">Common Use Cases</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Tax calculations and deductions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Discounts and sale prices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Interest rates and financial planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Growth rates and business metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Academic grades and scores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Survey results and statistics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Market share analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Tip calculations</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3">Formula Examples</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Percentage of Number</p>
                    <div className="p-3 bg-muted/50 rounded font-mono text-sm">
                      (Percentage ÷ 100) × Number
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Percentage Change</p>
                    <div className="p-3 bg-muted/50 rounded font-mono text-sm">
                      ((New - Old) ÷ Old) × 100
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Number as Percentage</p>
                    <div className="p-3 bg-muted/50 rounded font-mono text-sm">
                      (Part ÷ Whole) × 100
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Reverse Calculation</p>
                    <div className="p-3 bg-muted/50 rounded font-mono text-sm">
                      Number ÷ (Percentage ÷ 100)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong className="text-foreground">Pro tip:</strong> Use the calculation history to compare 
                different scenarios and keep track of your work. The step-by-step explanations help you 
                understand the math behind each calculation.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};