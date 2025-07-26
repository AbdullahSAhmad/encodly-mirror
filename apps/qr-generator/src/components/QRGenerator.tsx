import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@encodly/shared-ui';
import { Download, QrCode, Palette, Settings2, Link2, Type, Copy, Trash2, Clipboard, Shapes, Image, Frame } from 'lucide-react';
import { generateQRCode, generateQRCodeSVG, downloadQRCode, downloadQRCodeSVG, validateQRInput, getQRCodeType, QROptions, defaultQROptions } from '../utils/qrUtils';

interface QRGeneratorProps {
  onToast: (message: string) => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ onToast }) => {
  const [input, setInput] = useState('');
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [qrSVG, setQrSVG] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<QROptions>(defaultQROptions);
  const [activeTab, setActiveTab] = useState<'shape' | 'logo' | 'frame'>('shape');

  const generateQR = useCallback(async () => {
    const validation = validateQRInput(input);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const [dataURL, svgString] = await Promise.all([
        generateQRCode(input, options),
        generateQRCodeSVG(input, options)
      ]);
      
      setQrDataURL(dataURL);
      setQrSVG(svgString);
      onToast('QR code generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate QR code';
      setError(errorMessage);
      onToast(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [input, options, onToast]);

  // Auto-generate when input changes (with debounce)
  useEffect(() => {
    if (!input.trim()) {
      setQrDataURL(null);
      setQrSVG(null);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      generateQR();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [generateQR]);

  const handleDownloadPNG = () => {
    if (qrDataURL) {
      const type = getQRCodeType(input);
      const filename = `qrcode-${type}-${Date.now()}.png`;
      downloadQRCode(qrDataURL, filename);
      onToast('QR code downloaded as PNG');
    }
  };

  const handleDownloadSVG = () => {
    if (qrSVG) {
      const type = getQRCodeType(input);
      const filename = `qrcode-${type}-${Date.now()}.svg`;
      downloadQRCodeSVG(qrSVG, filename);
      onToast('QR code downloaded as SVG');
    }
  };

  const handleCopyImage = async () => {
    if (!qrDataURL) return;

    try {
      const response = await fetch(qrDataURL);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      onToast('QR code copied to clipboard');
    } catch (err) {
      onToast('Failed to copy image to clipboard');
    }
  };

  const handleClear = () => {
    setInput('');
    setQrDataURL(null);
    setQrSVG(null);
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      onToast('Text pasted from clipboard');
    } catch (err) {
      onToast('Failed to paste from clipboard');
    }
  };

  const inputType = getQRCodeType(input);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Input Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Text or URL</label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePaste}
                  className="h-8 w-8 p-0"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 w-8 p-0"
                  disabled={!input}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text or URL to generate QR code..."
              className="w-full h-32 p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground"
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{input.length}/2000 characters</span>
              {input && (
                <div className="flex items-center gap-2">
                  {inputType === 'url' ? (
                    <>
                      <Link2 className="h-3 w-3" />
                      URL detected
                    </>
                  ) : (
                    <>
                      <Type className="h-3 w-3" />
                      Text
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Customization Tabs */}
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              {[
                { id: 'shape', label: 'Shape', icon: Shapes },
                { id: 'logo', label: 'Logo', icon: Image },
                { id: 'frame', label: 'Frame', icon: Frame }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'shape' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  {/* Basic Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Size</label>
                      <select
                        value={options.size}
                        onChange={(e) => setOptions(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                        className="w-full p-2 border border-border rounded-md text-sm bg-background text-foreground"
                      >
                        <option value={128}>128x128</option>
                        <option value={256}>256x256</option>
                        <option value={512}>512x512</option>
                        <option value={1024}>1024x1024</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Error Correction</label>
                      <select
                        value={options.errorCorrectionLevel}
                        onChange={(e) => setOptions(prev => ({ ...prev, errorCorrectionLevel: e.target.value as QROptions['errorCorrectionLevel'] }))}
                        className="w-full p-2 border border-border rounded-md text-sm bg-background text-foreground"
                      >
                        <option value="L">Low (7%)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                      </select>
                    </div>
                  </div>

                  {/* Shape Style */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Data Module Shape</label>
                    <div className="relative">
                      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-custom">
                        {[
                          { value: 'square', preview: '■', name: 'Square' },
                          { value: 'rounded', preview: '▢', name: 'Rounded' },
                          { value: 'circle', preview: '●', name: 'Circle' },
                          { value: 'diamond', preview: '◆', name: 'Diamond' },
                          { value: 'star', preview: '★', name: 'Star' },
                          { value: 'heart', preview: '♥', name: 'Heart' },
                          { value: 'hexagon', preview: '⬣', name: 'Hexagon' },
                          { value: 'plus', preview: '✚', name: 'Plus' },
                          { value: 'triangle', preview: '▲', name: 'Triangle' },
                          { value: 'pentagon', preview: '⬟', name: 'Pentagon' },
                          { value: 'octagon', preview: '⬢', name: 'Octagon' }
                        ].map((style) => (
                          <button
                            key={style.value}
                            onClick={() => setOptions(prev => ({ ...prev, shapeStyle: style.value as any }))}
                            title={style.name}
                            className={`flex-shrink-0 w-16 h-16 border rounded-xl flex items-center justify-center text-2xl transition-all hover:bg-muted/50 ${
                              options.shapeStyle === style.value 
                                ? 'bg-primary/10 border-primary' 
                                : 'border-border bg-background'
                            }`}
                          >
                            {style.preview}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Border Style */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Corner Frame Style</label>
                    <div className="relative">
                      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-custom">
                        {[
                          { value: 'square', preview: '□', name: 'Square' },
                          { value: 'circle', preview: '◯', name: 'Circle' },
                          { value: 'rounded', preview: '▢', name: 'Rounded' },
                          { value: 'rounded-small', preview: '▪', name: 'Rounded Small' },
                          { value: 'rounded-inner', preview: '◐', name: 'Rounded Inner' },
                          { value: 'leaf-tl', preview: '◜', name: 'Leaf Top Left' },
                          { value: 'leaf-tr', preview: '◝', name: 'Leaf Top Right' },
                          { value: 'leaf-bl', preview: '◟', name: 'Leaf Bottom Left' },
                          { value: 'leaf-br', preview: '◞', name: 'Leaf Bottom Right' },
                          { value: 'leaf-mixed', preview: '◒', name: 'Leaf Mixed' },
                          { value: 'extra-rounded', preview: '◯', name: 'Extra Rounded' },
                          { value: 'thick', preview: '▣', name: 'Thick Border' }
                        ].map((style) => (
                          <button
                            key={style.value}
                            onClick={() => setOptions(prev => ({ ...prev, borderStyle: style.value as any }))}
                            title={style.name}
                            className={`flex-shrink-0 w-16 h-16 border rounded-xl flex items-center justify-center text-2xl transition-all hover:bg-muted/50 ${
                              options.borderStyle === style.value 
                                ? 'bg-primary/10 border-primary' 
                                : 'border-border bg-background'
                            }`}
                          >
                            {style.preview}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Center Style */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Corner Center Style</label>
                    <div className="relative">
                      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-custom">
                        {[
                          { value: 'square', preview: '■', name: 'Square' },
                          { value: 'rounded', preview: '▢', name: 'Rounded' },
                          { value: 'circle', preview: '●', name: 'Circle' },
                          { value: 'diamond', preview: '◆', name: 'Diamond' }
                        ].map((style) => (
                          <button
                            key={style.value}
                            onClick={() => setOptions(prev => ({ ...prev, centerStyle: style.value as any }))}
                            title={style.name}
                            className={`flex-shrink-0 w-16 h-16 border rounded-xl flex items-center justify-center text-2xl transition-all hover:bg-muted/50 ${
                              options.centerStyle === style.value 
                                ? 'bg-primary/10 border-primary' 
                                : 'border-border bg-background'
                            }`}
                          >
                            {style.preview}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Foreground Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={options.color.dark}
                          onChange={(e) => setOptions(prev => ({ 
                            ...prev, 
                            color: { ...prev.color, dark: e.target.value }
                          }))}
                          className="w-12 h-8 border border-border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={options.color.dark}
                          onChange={(e) => setOptions(prev => ({ 
                            ...prev, 
                            color: { ...prev.color, dark: e.target.value }
                          }))}
                          className="flex-1 p-2 border border-border rounded-md text-sm font-mono bg-background text-foreground"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Background Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={options.color.light}
                          onChange={(e) => setOptions(prev => ({ 
                            ...prev, 
                            color: { ...prev.color, light: e.target.value }
                          }))}
                          className="w-12 h-8 border border-border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={options.color.light}
                          onChange={(e) => setOptions(prev => ({ 
                            ...prev, 
                            color: { ...prev.color, light: e.target.value }
                          }))}
                          className="flex-1 p-2 border border-border rounded-md text-sm font-mono bg-background text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Branding Toggle */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Generated by Encodly</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.showBranding}
                        onChange={(e) => setOptions(prev => ({ ...prev, showBranding: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-muted-foreground/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    onClick={() => setOptions(defaultQROptions)}
                    className="w-full"
                    size="sm"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              )}

              {activeTab === 'logo' && (
                <div className="flex flex-col items-center justify-center h-64 text-center animate-in slide-in-from-right-4 duration-300">
                  <Image className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Logo Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">Add custom logos to your QR codes</p>
                </div>
              )}

              {activeTab === 'frame' && (
                <div className="flex flex-col items-center justify-center h-64 text-center animate-in slide-in-from-right-4 duration-300">
                  <Frame className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Frame Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">Add decorative frames around your QR codes</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Output Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Generated QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-lg">
            {isGenerating ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Generating QR code...</p>
              </div>
            ) : qrDataURL ? (
              <div className="text-center space-y-4">
                <img 
                  src={qrDataURL} 
                  alt="Generated QR Code" 
                  className="mx-auto max-w-full h-auto"
                  style={{ maxHeight: '256px' }}
                />
                <div className="text-xs text-muted-foreground">
                  {options.size}x{options.size} pixels • {inputType.toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Enter text or URL to generate QR code</p>
              </div>
            )}
          </div>

          {qrDataURL && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleDownloadPNG} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button onClick={handleDownloadSVG} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download SVG
                </Button>
              </div>
              
              <Button 
                onClick={handleCopyImage} 
                variant="outline" 
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};