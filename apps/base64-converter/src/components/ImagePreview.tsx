import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Maximize2, 
  X,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface ImagePreviewProps {
  base64: string;
  mimeType: string;
  originalFileName?: string;
  onToast?: (message: string) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  base64,
  mimeType,
  originalFileName,
  onToast
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageInfo, setImageInfo] = useState<{
    width: number;
    height: number;
    size: number;
  } | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const dataUri = `data:${mimeType};base64,${base64}`;

  // Load image to get dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageInfo({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: Math.round(base64.length * 0.75) // Approximate original size
      });
    };
    img.src = dataUri;
  }, [dataUri, base64]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = originalFileName ? 
      `${originalFileName.replace(/\.[^/.]+$/, '')}_base64.${mimeType.split('/')[1]}` : 
      `image_base64.${mimeType.split('/')[1]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast?.('Image downloaded successfully');
  }, [dataUri, originalFileName, mimeType, onToast]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isVisible) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Image Preview</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(true)}
            >
              <Eye className="h-4 w-4" />
              Show
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Preview hidden - click Show to view image
          </p>
        </CardContent>
      </Card>
    );
  }

  const PreviewContent = () => (
    <div className="relative">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[300px] flex items-center justify-center">
        <img
          src={dataUri}
          alt="Base64 Preview"
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center'
          }}
        />
        
        {/* Overlay Controls */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRotate}
            title="Rotate"
          >
            <RotateCw className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Zoom Level Indicator */}
        {zoom !== 1 && (
          <div className="absolute bottom-2 left-2 bg-black/75 text-white px-2 py-1 rounded text-xs">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>

      {/* Info Panel */}
      {showInfo && imageInfo && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Image Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Dimensions:</span>
              <span className="ml-2">{imageInfo.width} × {imageInfo.height}px</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-2">{mimeType}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Original Size:</span>
              <span className="ml-2">~{formatFileSize(imageInfo.size)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Base64 Size:</span>
              <span className="ml-2">{formatFileSize(base64.length)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Fullscreen Modal
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="relative w-full h-full p-4">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              title="Reset View"
            >
              Reset
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              title="Exit Fullscreen"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={dataUri}
              alt="Base64 Preview"
              className="max-w-full max-h-full object-contain"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Image Preview</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              title="Toggle Info"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              title="Download Image"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              title="Reset View"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
              title="Hide Preview"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PreviewContent />
      </CardContent>
    </Card>
  );
};