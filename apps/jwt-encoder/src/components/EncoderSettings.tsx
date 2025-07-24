import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@encodly/shared-ui';
import { Key, Hash } from 'lucide-react';
import { SUPPORTED_ALGORITHMS } from '../utils/jwtUtils';

interface EncoderSettingsProps {
  algorithm: string;
  onAlgorithmChange: (algorithm: string) => void;
  secret: string;
  onSecretChange: (secret: string) => void;
  onToast?: (message: string) => void;
}

export const EncoderSettings: React.FC<EncoderSettingsProps> = ({
  algorithm,
  onAlgorithmChange,
  secret,
  onSecretChange,
  onToast,
}) => {
  const generateRandomSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onSecretChange(result);
    onToast?.('Generated random secret');
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Key className="h-5 w-5" />
          Secret
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Algorithm Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            Signing Algorithm
          </label>
          <select 
            value={algorithm} 
            onChange={(e) => onAlgorithmChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {SUPPORTED_ALGORITHMS.map((alg) => (
              <option key={alg.value} value={alg.value}>
                {alg.label}
              </option>
            ))}
          </select>
        </div>

        {/* Secret Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            Secret Key
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={secret}
              onChange={(e) => onSecretChange(e.target.value)}
              placeholder="Enter your secret key..."
              className="flex-1"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateRandomSecret}
                  >
                    <Hash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate random secret</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-muted/50 rounded-md">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Security Notes:</div>
            <ul className="space-y-1">
              <li>• Keep your secret key private and secure</li>
              <li>• Use strong, random secrets in production</li>
              <li>• HMAC algorithms are supported for client-side signing</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};