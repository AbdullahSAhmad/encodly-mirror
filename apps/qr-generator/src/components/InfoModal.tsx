import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@encodly/shared-ui';
import { QrCode, Shield, Zap, Download, Smartphone, Link2 } from 'lucide-react';

interface InfoModalProps {
  trigger: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Generator Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* What is QR Code */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">What is a QR Code?</h3>
            <p className="text-muted-foreground">
              QR (Quick Response) codes are two-dimensional barcodes that can store various types of information 
              like URLs, text, contact details, and more. They can be quickly scanned by smartphones and other devices.
            </p>
          </section>

          {/* Features */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Instant Generation</h4>
                  <p className="text-sm text-muted-foreground">Real-time QR code generation as you type</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Multiple Formats</h4>
                  <p className="text-sm text-muted-foreground">Download as PNG or SVG with custom sizes</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Privacy Focused</h4>
                  <p className="text-sm text-muted-foreground">All processing happens in your browser</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Smartphone className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Mobile Friendly</h4>
                  <p className="text-sm text-muted-foreground">Optimized for all devices and screen sizes</p>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Common Use Cases</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Link2 className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Share website URLs and links</span>
              </div>
              <div className="flex items-center gap-3">
                <QrCode className="h-4 w-4 text-green-500" />
                <span className="text-sm">Contact information and business cards</span>
              </div>
              <div className="flex items-center gap-3">
                <QrCode className="h-4 w-4 text-purple-500" />
                <span className="text-sm">WiFi network credentials</span>
              </div>
              <div className="flex items-center gap-3">
                <QrCode className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Event details and calendar entries</span>
              </div>
              <div className="flex items-center gap-3">
                <QrCode className="h-4 w-4 text-red-500" />
                <span className="text-sm">Product information and inventory</span>
              </div>
              <div className="flex items-center gap-3">
                <QrCode className="h-4 w-4 text-teal-500" />
                <span className="text-sm">Social media profiles and handles</span>
              </div>
            </div>
          </section>

          {/* Customization Options */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Customization Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Size Options</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 128x128 pixels (Small)</li>
                  <li>• 256x256 pixels (Medium)</li>
                  <li>• 512x512 pixels (Large)</li>
                  <li>• 1024x1024 pixels (Extra Large)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Error Correction</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Low (7%) - Faster scanning</li>
                  <li>• Medium (15%) - Balanced</li>
                  <li>• Quartile (25%) - More resilient</li>
                  <li>• High (30%) - Maximum resilience</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Tips for Best Results</h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>Keep it short:</strong> Shorter text generates simpler QR codes that scan faster.
              </p>
              <p className="text-sm">
                <strong>Test before sharing:</strong> Always test your QR code with different devices and apps.
              </p>
              <p className="text-sm">
                <strong>Choose appropriate size:</strong> Larger QR codes are easier to scan from a distance.
              </p>
              <p className="text-sm">
                <strong>High contrast:</strong> Use dark foreground on light background for best scanning results.
              </p>
            </div>
          </section>

          {/* Security Note */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </h3>
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                Your data never leaves your browser. All QR code generation happens locally on your device, 
                ensuring complete privacy and security of your information.
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};