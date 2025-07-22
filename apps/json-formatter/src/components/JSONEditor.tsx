import React from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@encodly/shared-ui';
import { useTheme } from '@encodly/shared-ui';

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  readOnly?: boolean;
  label: string;
}

export const JSONEditor: React.FC<JSONEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  label,
}) => {
  const { theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Editor
            height="400px"
            defaultLanguage="json"
            value={value}
            onChange={(val) => onChange(val || '')}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              readOnly,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
        {error && (
          <div className="mt-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};