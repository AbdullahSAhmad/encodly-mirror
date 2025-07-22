import React from 'react';
import { Button, Card } from '@encodly/shared-ui';
import { FileJson, Minimize2, CheckCircle, TreePine, Code } from 'lucide-react';
import { copyToClipboard } from '@encodly/shared-utils';

interface JSONToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  viewMode: 'editor' | 'tree';
  onViewModeChange: (mode: 'editor' | 'tree') => void;
}

export const JSONToolbar: React.FC<JSONToolbarProps> = ({
  onFormat,
  onMinify,
  onValidate,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button onClick={onFormat} size="sm">
            <FileJson className="h-4 w-4 mr-2" />
            Format
          </Button>
          
          <Button onClick={onMinify} variant="secondary" size="sm">
            <Minimize2 className="h-4 w-4 mr-2" />
            Minify
          </Button>
          
          <Button onClick={onValidate} variant="secondary" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Validate
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'editor' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('editor')}
          >
            <Code className="h-4 w-4 mr-2" />
            Editor
          </Button>
          
          <Button
            variant={viewMode === 'tree' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('tree')}
          >
            <TreePine className="h-4 w-4 mr-2" />
            Tree View
          </Button>
        </div>
      </div>
    </Card>
  );
};