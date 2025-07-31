import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input } from '@encodly/shared-ui';
import { Globe, Download, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';

interface URLLoaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (data: string, filename?: string) => void;
}

export const URLLoaderModal: React.FC<URLLoaderModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commonUrls = [
    {
      name: 'GitHub API - User Profile',
      url: 'https://api.github.com/users/octocat',
      description: 'Sample GitHub user profile data'
    },
    {
      name: 'JSONPlaceholder - Posts',
      url: 'https://jsonplaceholder.typicode.com/posts',
      description: 'Sample blog posts data (100 items)'
    },
    {
      name: 'JSONPlaceholder - Single User',
      url: 'https://jsonplaceholder.typicode.com/users/1',
      description: 'Sample user data with nested objects'
    },
    {
      name: 'REST Countries - Germany',
      url: 'https://restcountries.com/v3.1/name/germany',
      description: 'Country information with complex structure'
    },
    {
      name: 'Cat Facts API',
      url: 'https://catfact.ninja/fact',
      description: 'Random cat fact (simple JSON)'
    },
    {
      name: 'Sample Product Data',
      url: 'https://dummyjson.com/products/1',
      description: 'E-commerce product with images and ratings'
    }
  ];

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const extractFilename = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || '';
      
      if (filename && filename.includes('.')) {
        return filename.replace(/\.[^.]+$/, ''); // Remove extension
      }
      
      // Use hostname + path as filename
      const parts = [urlObj.hostname.replace('www.', ''), ...pathname.split('/').filter(Boolean)];
      return parts.join('_') || 'remote_data';
    } catch {
      return 'remote_data';
    }
  };

  const loadFromUrl = async (targetUrl?: string) => {
    const urlToLoad = targetUrl || url;
    
    if (!urlToLoad.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(urlToLoad)) {
      setError('Please enter a valid HTTP/HTTPS URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use a CORS proxy for development/demo purposes
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlToLoad)}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let data: string;

      if (contentType?.includes('application/json')) {
        const jsonData = await response.json();
        data = JSON.stringify(jsonData, null, 2);
      } else {
        data = await response.text();
        
        // Try to parse as JSON if it looks like JSON
        if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
          try {
            const parsed = JSON.parse(data);
            data = JSON.stringify(parsed, null, 2);
          } catch {
            // Keep as text if JSON parsing fails
          }
        }
      }

      const filename = extractFilename(urlToLoad);
      onDataLoaded(data, filename);
      
      // Close modal after successful load
      handleClose();

    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError('Failed to load URL. This might be due to CORS restrictions or network issues.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred while loading the URL');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  const loadExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Load JSON from URL
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* URL Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Enter URL:</label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/data.json"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    loadFromUrl();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                onClick={() => loadFromUrl()}
                disabled={isLoading || !url.trim()}
                className="flex-shrink-0 px-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Load
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium mb-1">Loading failed:</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {/* Example URLs */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Or try these examples:</label>
            <div className="grid gap-3">
              {commonUrls.map((example, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded-lg border transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="font-medium text-sm">{example.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{example.description}</div>
                    <div className="text-xs text-muted-foreground/80 truncate mt-0.5 font-mono">
                      {example.url}
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => loadFromUrl(example.url)}
                    disabled={isLoading}
                    className="flex-shrink-0"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* CORS Notice */}
          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">ℹ️</div>
              <div>
                <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  CORS Information:
                </div>
                <div className="text-blue-700 dark:text-blue-300">
                  Some URLs might not load due to CORS (Cross-Origin Resource Sharing) restrictions. 
                  This tool uses a CORS proxy service for demonstration purposes. The examples above 
                  are known to work well.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};