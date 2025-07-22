import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { History, Trash2, Copy } from 'lucide-react';
import { copyToClipboard } from '@encodly/shared-utils';
import { Calculation } from '../pages/PercentageCalculatorPage';

interface CalculationHistoryProps {
  history: Calculation[];
  onClear: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({ history, onClear }) => {
  const handleCopy = async (calculation: Calculation) => {
    const text = `${calculation.formula}\nResult: ${calculation.result.toFixed(2)}`;
    await copyToClipboard(text);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Calculation History
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((calc) => (
            <div
              key={calc.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex-1">
                <div className="text-sm font-medium">{calc.formula}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(calc.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold">
                  {calc.result.toFixed(2)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(calc)}
                  aria-label="Copy calculation"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};