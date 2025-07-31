import React, { useCallback, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle, Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@encodly/shared-ui';
import { useTheme } from '@encodly/shared-ui';
import { useDropzone } from 'react-dropzone';
import { 
  Copy, 
  Download, 
  FileText, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Upload,
  Settings,
  Eye,
  Grid3X3,
  Image
} from 'lucide-react';
import { ImagePreview } from './ImagePreview';
import { OutputFormats } from './OutputFormats';
import { AlphabetSelector, AlphabetConfig } from './AlphabetSelector';
import { BatchProcessor } from './BatchProcessor';
import { Base64Processor } from '../utils/base64-enhanced';

interface EnhancedBase64EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  readOnly?: boolean;
  label: string;
  onFileUpload?: (file: File) => Promise<void>;
  onCopy?: () => void;
  onDownload?: () => void;
  onClear?: () => void;
  isValid?: boolean | null;
  onToast?: (message: string) => void;
  mode?: 'encode' | 'decode';
  currentResult?: any;
  selectedAlphabet?: AlphabetConfig;
  onAlphabetChange?: (alphabet: AlphabetConfig) => void;
  processorInstance?: Base64Processor;
}

export const EnhancedBase64Editor: React.FC<EnhancedBase64EditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  label,
  onFileUpload,
  onCopy,
  onDownload,
  onClear,
  isValid,
  onToast,
  mode,
  currentResult,
  selectedAlphabet,
  onAlphabetChange,
  processorInstance
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showOutputFormats, setShowOutputFormats] = useState(false);
  const [showAlphabetSettings, setShowAlphabetSettings] = useState(false);
  const [showBatchProcessor, setShowBatchProcessor] = useState(false);

  // Enhanced file drop handling
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && onFileUpload) {
      try {
        await onFileUpload(file);
        onToast?.(`Successfully processed ${file.name}`);
      } catch (error) {
        onToast?.(`Failed to process ${file.name}`);
      }
    }
  }, [onFileUpload, onToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'],
      'text/*': ['.txt', '.json', '.xml', '.csv', '.html'],
      'application/*': ['.pdf', '.zip', '.doc', '.docx']
    }
  });

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCopy = useCallback(async () => {
    if (onCopy) {
      await onCopy();
      if (onToast) onToast('Copied to clipboard!');
    }
  }, [onCopy, onToast]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      try {
        await onFileUpload(file);
      } catch (error) {
        onToast?.(`Failed to process file: ${error}`);
      }
    }
  }, [onFileUpload, onToast]);

  // Quick actions for different content types
  const getQuickActions = () => {
    const actions = [];

    if (!readOnly) {
      // Input area actions
      actions.push(
        <Button
          key="upload"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('file-input')?.click()}
          title="Upload file"
        >
          <Upload className="h-4 w-4" />
        </Button>
      );

      if (mode === 'encode') {
        actions.push(
          <Dialog key="batch" open={showBatchProcessor} onOpenChange={setShowBatchProcessor}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" title="Batch processing">
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Batch File Processing</DialogTitle>
              </DialogHeader>
              <BatchProcessor onToast={onToast} />
            </DialogContent>
          </Dialog>
        );
      }

      actions.push(
        <Dialog key="settings" open={showAlphabetSettings} onOpenChange={setShowAlphabetSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" title="Alphabet settings">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Alphabet Configuration</DialogTitle>
            </DialogHeader>
            {selectedAlphabet && onAlphabetChange && (
              <AlphabetSelector
                selectedAlphabet={selectedAlphabet}
                onAlphabetChange={onAlphabetChange}
                onToast={onToast}
              />
            )}
          </DialogContent>
        </Dialog>
      );
    } else {
      // Output area actions
      if (currentResult?.isImage && mode === 'encode') {
        actions.push(
          <Dialog key="preview" open={showImagePreview} onOpenChange={setShowImagePreview}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" title="Preview image">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Image Preview</DialogTitle>
              </DialogHeader>
              <ImagePreview
                base64={currentResult.base64}
                mimeType={currentResult.mimeType}
                onToast={onToast}
              />
            </DialogContent>
          </Dialog>
        );
      }

      if (currentResult?.base64 && mode === 'encode') {
        actions.push(
          <Dialog key="formats" open={showOutputFormats} onOpenChange={setShowOutputFormats}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" title="Export formats">
                <Download className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Export Formats</DialogTitle>
              </DialogHeader>
              <OutputFormats
                base64={currentResult.base64}
                mimeType={currentResult.mimeType}
                onToast={onToast}
                onClose={() => setShowOutputFormats(false)}
              />
            </DialogContent>
          </Dialog>
        );
      }
    }

    return actions;
  };

  return (
    <>
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,text/*,application/*"
      />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>{label}</CardTitle>
              {/* Validation Status */}
              {!readOnly && value.trim() && isValid !== null && (
                <div className="flex items-center cursor-help" title={
                  isValid === true ? 'Valid - The conversion was successful' : 'Invalid - Check your input format'
                }>
                  {isValid === true ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
              {/* Content type indicator */}
              {currentResult && (
                <div className="flex items-center gap-1">
                  {currentResult.isImage && <Image className="h-3 w-3 text-blue-500" />}
                  <span className="text-xs text-muted-foreground">
                    {currentResult.mimeType}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {/* Quick Actions */}
              {getQuickActions()}
              
              {/* Basic Actions */}
              {!readOnly && onClear && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClear}
                  disabled={!value}
                  title="Clear content"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              {readOnly && onCopy && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!value}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              
            </div>
          </div>
          
          {/* Enhanced Info Bar */}
          {currentResult && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Size: {(currentResult.size / 1024).toFixed(1)}KB</span>
              {currentResult.base64 && (
                <span>Encoded: {(currentResult.base64.length / 1024).toFixed(1)}KB</span>
              )}
              {selectedAlphabet && (
                <span>Alphabet: {selectedAlphabet.name}</span>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          <div {...getRootProps()} className="relative">
            <input {...getInputProps()} />
            
            {/* Enhanced Drag Overlay */}
            {isDragActive && !readOnly && (
              <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
                <div className="text-center p-8">
                  <div className="relative mb-4">
                    <Upload className="h-12 w-12 mx-auto text-primary animate-bounce" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-25" />
                  </div>
                  <p className="text-lg font-medium text-primary">Drop your file here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports up to 50MB • Images, documents, text files
                  </p>
                </div>
              </div>
            )}
            
            {/* File Preview or Editor */}
            {!readOnly && currentResult && currentResult.isImage && !value ? (
              // Show image preview for uploaded images
              <div className="h-[400px] flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <img
                    src={`data:${currentResult.mimeType};base64,${currentResult.base64}`}
                    alt="Uploaded file preview"
                    className="max-w-full max-h-[300px] object-contain rounded border"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentResult.mimeType} • {(currentResult.size / 1024).toFixed(1)}KB
                  </p>
                </div>
              </div>
            ) : !readOnly && currentResult && currentResult.mimeType?.startsWith('text/') && !value ? (
              // Show text preview for uploaded text files
              <div className="h-[400px] overflow-auto">
                <Editor
                  height="400px"
                  language={
                    currentResult.mimeType === 'application/json' ? 'json' :
                    currentResult.mimeType === 'text/html' ? 'html' :
                    currentResult.mimeType === 'text/css' ? 'css' :
                    currentResult.mimeType === 'text/javascript' ? 'javascript' :
                    'plaintext'
                  }
                  theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                  value={currentResult.text || ''}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    padding: { top: 16, bottom: 16 },
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'visible',
                    },
                  }}
                />
              </div>
            ) : !readOnly && currentResult && !currentResult.isImage && !currentResult.mimeType?.startsWith('text/') && !value ? (
              // Show binary file info for other file types
              <div className="h-[400px] flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Binary File Uploaded</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Type: {currentResult.mimeType}</p>
                    <p>Size: {(currentResult.size / 1024).toFixed(1)}KB</p>
                    <p>Base64 Size: {(currentResult.base64?.length / 1024).toFixed(1)}KB</p>
                  </div>
                </div>
              </div>
            ) : (
              // Regular editor
              <Editor
                height="400px"
                language="plaintext"
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                value={value}
                onChange={(value) => onChange(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  readOnly,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 16, bottom: 16 },
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                  },
                }}
              />
            )}
          </div>
          
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm border-t">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Quick Stats */}
          {value && (
            <div className="px-3 py-2 bg-muted/30 border-t text-xs text-muted-foreground flex items-center justify-between">
              <span>Characters: {value.length.toLocaleString()}</span>
              <span>Lines: {value.split('\n').length}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};