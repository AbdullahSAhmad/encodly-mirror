import React from 'react';
import { Card, Switch } from '@encodly/shared-ui';
import { Sparkles } from 'lucide-react';

interface URLToolbarProps {
  detectedOperation: 'encode' | 'decode' | null;
  autoConvert: boolean;
  onAutoConvertChange: (enabled: boolean) => void;
}

export const URLToolbar: React.FC<URLToolbarProps> = ({ 
  detectedOperation,
  autoConvert, 
  onAutoConvertChange
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Auto-detect</span>
            <Switch
              id="auto-convert"
              checked={autoConvert}
              onCheckedChange={onAutoConvertChange}
            />
          </div>
          
          {autoConvert && detectedOperation && (
            <div className="text-sm text-muted-foreground">
              • Detected: <span className="font-medium">{detectedOperation === 'encode' ? 'URL to encode' : 'Encoded URL to decode'}</span>
            </div>
          )}
          
          {!autoConvert && (
            <div className="text-sm text-muted-foreground">
              Click encode or decode button to convert
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};