import React from 'react';
import { Card, CardContent, Button } from '@encodly/shared-ui';
import { Lock, Unlock } from 'lucide-react';

interface Base64ToolbarProps {
  mode: 'encode' | 'decode';
  onModeChange: (mode: 'encode' | 'decode') => void;
}

export const Base64Toolbar: React.FC<Base64ToolbarProps> = ({ mode, onModeChange }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={mode === 'encode' ? 'default' : 'outline'}
            onClick={() => onModeChange('encode')}
            className="flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            <span>Encode</span>
          </Button>
          
          <span className="text-muted-foreground">or</span>
          
          <Button
            variant={mode === 'decode' ? 'default' : 'outline'}
            onClick={() => onModeChange('decode')}
            className="flex items-center gap-2"
          >
            <Unlock className="h-4 w-4" />
            <span>Decode</span>
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'encode' ? (
            <p>Convert plain text to Base64 encoded format</p>
          ) : (
            <p>Convert Base64 encoded text back to plain text</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};