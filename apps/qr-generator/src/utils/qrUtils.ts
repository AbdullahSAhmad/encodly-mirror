import QRCode from 'qrcode';

export interface QROptions {
  size: number;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  color: {
    dark: string;
    light: string;
  };
  showBranding: boolean;
  shapeStyle: 'square' | 'rounded' | 'circle' | 'diamond' | 'star' | 'heart' | 'hexagon' | 'plus' | 'triangle' | 'pentagon' | 'octagon';
  borderStyle: 'square' | 'circle' | 'rounded' | 'rounded-small' | 'rounded-inner' | 'leaf-tl' | 'leaf-tr' | 'leaf-bl' | 'leaf-br' | 'leaf-mixed' | 'extra-rounded' | 'thick';
  centerStyle: 'square' | 'rounded' | 'circle' | 'diamond';
}

export const defaultQROptions: QROptions = {
  size: 256,
  margin: 2,
  errorCorrectionLevel: 'M',
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  showBranding: true,
  shapeStyle: 'square',
  borderStyle: 'square',
  centerStyle: 'square'
};

export const generateQRCode = async (
  text: string, 
  options: Partial<QROptions> = {}
): Promise<string> => {
  const finalOptions = { ...defaultQROptions, ...options };
  
  try {
    let dataURL: string;
    
    // Always use custom rendering if any style is non-square
    const useCustomRendering = finalOptions.shapeStyle !== 'square' || 
                              finalOptions.borderStyle !== 'square' || 
                              finalOptions.centerStyle !== 'square';
    
    if (useCustomRendering) {
      // Generate custom styled QR code for any non-square styling
      dataURL = await generateCustomStyledQR(text, finalOptions);
    } else {
      // Use standard QR code generation only if ALL styles are default square
      dataURL = await QRCode.toDataURL(text, {
        width: finalOptions.size,
        margin: finalOptions.margin,
        errorCorrectionLevel: finalOptions.errorCorrectionLevel,
        color: finalOptions.color
      });
    }
    
    return finalOptions.showBranding ? addBrandingToImage(dataURL, finalOptions) : dataURL;
  } catch (error) {
    throw new Error('Failed to generate QR code: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

const generateCustomStyledQR = async (text: string, options: QROptions): Promise<string> => {
  // First get the QR code matrix data
  const qrMatrix = await QRCode.create(text, {
    errorCorrectionLevel: options.errorCorrectionLevel
  });
  
  const modules = qrMatrix.modules;
  const size = modules.size;
  const moduleSize = Math.floor(options.size / (size + 2 * options.margin));
  const actualSize = moduleSize * (size + 2 * options.margin);
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = actualSize;
    canvas.height = actualSize;
    
    // Fill background
    ctx.fillStyle = options.color.light;
    ctx.fillRect(0, 0, actualSize, actualSize);
    
    // Define finder pattern positions (7x7 each)
    const finderPatterns = [
      { x: 0, y: 0 }, // Top-left
      { x: size - 7, y: 0 }, // Top-right
      { x: 0, y: size - 7 } // Bottom-left
    ];
    
    // First draw all regular modules with shape style
    ctx.fillStyle = options.color.dark;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (modules.get(x, y)) {
          const moduleX = (x + options.margin) * moduleSize;
          const moduleY = (y + options.margin) * moduleSize;
          
          // Check if this module is part of a finder pattern
          const isInFinderPattern = finderPatterns.some(pattern => 
            x >= pattern.x && x < pattern.x + 7 && 
            y >= pattern.y && y < pattern.y + 7
          );
          
          if (!isInFinderPattern) {
            drawModule(ctx, moduleX, moduleY, moduleSize, options.shapeStyle);
          }
        }
      }
    }
    
    // Now draw finder patterns with custom border and center styles
    finderPatterns.forEach(pattern => {
      drawFinderPattern(ctx, pattern.x, pattern.y, moduleSize, options);
    });
    
    resolve(canvas.toDataURL());
  });
};

const drawFinderPattern = (ctx: CanvasRenderingContext2D, startX: number, startY: number, moduleSize: number, options: QROptions) => {
  const offsetX = (startX + options.margin) * moduleSize;
  const offsetY = (startY + options.margin) * moduleSize;
  const borderSize = 7 * moduleSize;
  const centerSize = 3 * moduleSize;
  const centerOffset = 2 * moduleSize;
  
  // Clear the entire finder pattern area first
  ctx.fillStyle = options.color.light;
  ctx.fillRect(offsetX, offsetY, borderSize, borderSize);
  
  // Draw border frame (outer border)
  ctx.fillStyle = options.color.dark;
  
  // Use globalCompositeOperation to properly handle borders with holes
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  
  // Draw the border pattern
  drawBorderShape(ctx, offsetX, offsetY, borderSize, options.borderStyle);
  
  ctx.restore();
  
  // Draw center shape with clean context to avoid interference
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = options.color.dark;
  drawCenterShape(ctx, offsetX + centerOffset, offsetY + centerOffset, centerSize, options.centerStyle);
  ctx.restore();
};

const drawBorderShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: string) => {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size / 2;
  const borderWidth = size / 7; // Standard QR finder pattern border width
  
  // Create a temporary canvas for the border shape
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCanvas.width = size;
  tempCanvas.height = size;
  
  // Draw the outer shape on temp canvas
  tempCtx.fillStyle = '#000000';
  tempCtx.beginPath();
  
  switch (style) {
    case 'circle':
      tempCtx.arc(size/2, size/2, radius, 0, 2 * Math.PI);
      break;
      
    case 'rounded':
      const outerRadius = size * 0.2;
      drawRoundedRect(tempCtx, 0, 0, size, size, outerRadius);
      break;
      
    case 'rounded-small':
      const outerRadiusSmall = size * 0.1;
      drawRoundedRect(tempCtx, 0, 0, size, size, outerRadiusSmall);
      break;
      
    case 'extra-rounded':
      const extraRadius = size * 0.4;
      drawRoundedRect(tempCtx, 0, 0, size, size, extraRadius);
      break;
      
    case 'thick':
      tempCtx.rect(0, 0, size, size);
      break;
      
    default: // square and all others
      tempCtx.rect(0, 0, size, size);
      break;
  }
  
  tempCtx.fill();
  
  // Cut out the inner area
  tempCtx.globalCompositeOperation = 'destination-out';
  tempCtx.fillStyle = '#000000';
  tempCtx.beginPath();
  
  const innerBorderWidth = style === 'thick' ? borderWidth * 1.5 : borderWidth;
  const innerX = innerBorderWidth;
  const innerY = innerBorderWidth;
  const innerSize = size - 2 * innerBorderWidth;
  
  if (style === 'circle') {
    tempCtx.arc(size/2, size/2, radius - innerBorderWidth, 0, 2 * Math.PI);
  } else if (style === 'rounded') {
    const innerRadius = innerSize * 0.2;
    drawRoundedRect(tempCtx, innerX, innerY, innerSize, innerSize, innerRadius);
  } else if (style === 'rounded-small') {
    const innerRadius = innerSize * 0.1;
    drawRoundedRect(tempCtx, innerX, innerY, innerSize, innerSize, innerRadius);
  } else if (style === 'extra-rounded') {
    const innerRadius = innerSize * 0.4;
    drawRoundedRect(tempCtx, innerX, innerY, innerSize, innerSize, innerRadius);
  } else {
    tempCtx.rect(innerX, innerY, innerSize, innerSize);
  }
  
  tempCtx.fill();
  
  // Draw the temp canvas to the main canvas
  ctx.drawImage(tempCanvas, x, y);
};

const drawCenterShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: string) => {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size / 2 * 0.9;
  
  ctx.beginPath();
  
  switch (style) {
    case 'circle':
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      break;
      
    case 'rounded':
      const cornerRadius = size * 0.3;
      drawRoundedRect(ctx, x, y, size, size, cornerRadius);
      break;
      
    case 'diamond':
      ctx.moveTo(centerX, y);
      ctx.lineTo(x + size, centerY);
      ctx.lineTo(centerX, y + size);
      ctx.lineTo(x, centerY);
      ctx.closePath();
      break;
      
    case 'star':
      const spikes = 5;
      const outerRadius = radius;
      const innerRadius = radius * 0.4;
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const px = centerX + Math.cos(angle - Math.PI / 2) * r;
        const py = centerY + Math.sin(angle - Math.PI / 2) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
      
    case 'heart':
      const heartSize = radius * 0.8;
      ctx.moveTo(centerX, centerY + heartSize * 0.3);
      ctx.bezierCurveTo(centerX - heartSize, centerY - heartSize * 0.5, 
                       centerX - heartSize * 0.5, centerY - heartSize, 
                       centerX, centerY - heartSize * 0.3);
      ctx.bezierCurveTo(centerX + heartSize * 0.5, centerY - heartSize,
                       centerX + heartSize, centerY - heartSize * 0.5,
                       centerX, centerY + heartSize * 0.3);
      ctx.closePath();
      break;
      
    case 'flower':
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const petalX = centerX + Math.cos(angle) * radius * 0.5;
        const petalY = centerY + Math.sin(angle) * radius * 0.5;
        ctx.arc(petalX, petalY, radius * 0.25, 0, 2 * Math.PI);
      }
      break;
      
    case 'spiral':
      const turns = 3;
      const steps = 50;
      let spiralRadius = 0;
      for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * turns * 2 * Math.PI;
        spiralRadius = (i / steps) * radius;
        const px = centerX + Math.cos(angle) * spiralRadius;
        const py = centerY + Math.sin(angle) * spiralRadius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      break;
      
    case 'ring':
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI, true);
      break;
      
    case 'burst':
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.moveTo(centerX, centerY);
        const px = centerX + Math.cos(angle) * radius;
        const py = centerY + Math.sin(angle) * radius;
        ctx.lineTo(px, py);
      }
      break;
      
    case 'leaf':
      ctx.moveTo(centerX, y);
      ctx.quadraticCurveTo(x + size, centerY, centerX, y + size);
      ctx.quadraticCurveTo(x, centerY, centerX, y);
      ctx.closePath();
      break;
      
    case 'gem':
      const sides = 8;
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        const r = i % 2 === 0 ? radius : radius * 0.7;
        const px = centerX + Math.cos(angle) * r;
        const py = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
      
    default: // square
      ctx.rect(x, y, size, size);
      break;
  }
  
  ctx.fill();
};

const drawModule = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: string) => {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size / 2 * 0.8;
  
  ctx.beginPath();
  
  switch (style) {
    case 'circle':
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      break;
      
    case 'rounded':
      const cornerRadius = size * 0.3;
      drawRoundedRect(ctx, x, y, size, size, cornerRadius);
      break;
      
    case 'diamond':
      ctx.moveTo(centerX, y);
      ctx.lineTo(x + size, centerY);
      ctx.lineTo(centerX, y + size);
      ctx.lineTo(x, centerY);
      ctx.closePath();
      break;
      
    case 'star':
      const spikes = 5;
      const outerRadius = radius;
      const innerRadius = radius * 0.4;
      
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const px = centerX + Math.cos(angle - Math.PI / 2) * r;
        const py = centerY + Math.sin(angle - Math.PI / 2) * r;
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
      
    case 'heart':
      const heartSize = radius * 0.8;
      ctx.moveTo(centerX, centerY + heartSize * 0.3);
      ctx.bezierCurveTo(centerX - heartSize, centerY - heartSize * 0.5, 
                       centerX - heartSize * 0.5, centerY - heartSize, 
                       centerX, centerY - heartSize * 0.3);
      ctx.bezierCurveTo(centerX + heartSize * 0.5, centerY - heartSize,
                       centerX + heartSize, centerY - heartSize * 0.5,
                       centerX, centerY + heartSize * 0.3);
      ctx.closePath();
      break;
      
    case 'hexagon':
      const hexRadius = radius;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = centerX + Math.cos(angle) * hexRadius;
        const py = centerY + Math.sin(angle) * hexRadius;
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
      
    case 'plus':
      const thickness = size * 0.3;
      const length = size * 0.8;
      // Horizontal bar
      ctx.rect(centerX - length/2, centerY - thickness/2, length, thickness);
      // Vertical bar
      ctx.rect(centerX - thickness/2, centerY - length/2, thickness, length);
      break;
      
    case 'triangle':
      ctx.moveTo(centerX, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x + size, y + size);
      ctx.closePath();
      break;
      
    case 'pentagon':
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const px = centerX + Math.cos(angle) * radius;
        const py = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
      
    case 'octagon':
      for (let i = 0; i < 8; i++) {
        const angle = (i * 2 * Math.PI) / 8;
        const px = centerX + Math.cos(angle) * radius;
        const py = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
      
    case 'cross':
      const armWidth = size * 0.25;
      const armLength = size * 0.8;
      // Horizontal arm
      ctx.rect(centerX - armLength/2, centerY - armWidth/2, armLength, armWidth);
      // Vertical arm
      ctx.rect(centerX - armWidth/2, centerY - armLength/2, armWidth, armLength);
      break;
      
    case 'dots':
      const dotSize = size * 0.15;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const dotX = centerX + Math.cos(angle) * size * 0.25;
        const dotY = centerY + Math.sin(angle) * size * 0.25;
        ctx.arc(dotX, dotY, dotSize, 0, 2 * Math.PI);
      }
      ctx.arc(centerX, centerY, dotSize, 0, 2 * Math.PI);
      break;
      
    case 'flower':
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const petalX = centerX + Math.cos(angle) * radius * 0.6;
        const petalY = centerY + Math.sin(angle) * radius * 0.6;
        ctx.arc(petalX, petalY, radius * 0.4, 0, 2 * Math.PI);
      }
      break;
      
    default: // square
      ctx.rect(x, y, size, size);
      break;
  }
  
  ctx.fill();
};

const addBrandingToImage = async (qrDataURL: string, options: QROptions): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate dimensions with branding space
      const brandingHeight = options.size <= 128 ? 30 : options.size <= 256 ? 40 : options.size <= 512 ? 50 : 60;
      const padding = 12;
      const cornerRadius = 8;
      
      canvas.width = options.size + (padding * 2);
      canvas.height = options.size + brandingHeight + (padding * 2);
      
      // Draw rounded rectangle background
      ctx.fillStyle = options.color.light;
      drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, cornerRadius);
      ctx.fill();
      
      // Draw QR code centered
      ctx.drawImage(img, padding, padding, options.size, options.size);
      
      // Add branding text
      ctx.fillStyle = options.color.dark;
      let fontSize;
      if (options.size <= 128) {
        fontSize = 14;
      } else if (options.size <= 256) {
        fontSize = 18;
      } else if (options.size <= 512) {
        fontSize = 24;
      } else {
        fontSize = 48;
      }
      ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      const textY = options.size + padding + (brandingHeight * 0.7);
      ctx.fillText('Generated by Encodly', canvas.width / 2, textY);
      
      resolve(canvas.toDataURL());
    };
    
    img.src = qrDataURL;
  });
};

const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export const generateQRCodeSVG = async (
  text: string,
  options: Partial<QROptions> = {}
): Promise<string> => {
  const finalOptions = { ...defaultQROptions, ...options };
  
  try {
    const svgString = await QRCode.toString(text, {
      type: 'svg',
      width: finalOptions.size,
      margin: finalOptions.margin,
      errorCorrectionLevel: finalOptions.errorCorrectionLevel,
      color: finalOptions.color
    });
    
    return finalOptions.showBranding ? addBrandingToSVG(svgString, finalOptions) : svgString;
  } catch (error) {
    throw new Error('Failed to generate QR code SVG: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

const addBrandingToSVG = (svgString: string, options: QROptions): string => {
  const brandingHeight = options.size <= 128 ? 30 : options.size <= 256 ? 40 : options.size <= 512 ? 50 : 60;
  const padding = 12;
  const cornerRadius = 8;
  const totalWidth = options.size + (padding * 2);
  const totalHeight = options.size + brandingHeight + (padding * 2);
  
  // Extract the QR code content from the original SVG
  const qrCodeMatch = svgString.match(/<svg[^>]*>(.*?)<\/svg>/s);
  const qrCodeContent = qrCodeMatch ? qrCodeMatch[1] : '';
  
  // Create new SVG with branding and rounded corners
  const brandedSVG = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="roundedCorners">
        <rect width="100%" height="100%" rx="${cornerRadius}" ry="${cornerRadius}"/>
      </clipPath>
    </defs>
    <rect width="100%" height="100%" rx="${cornerRadius}" ry="${cornerRadius}" fill="${options.color.light}"/>
    <g transform="translate(${padding}, ${padding})" clip-path="url(#roundedCorners)">
      ${qrCodeContent}
    </g>
    <text x="${totalWidth / 2}" y="${options.size + padding + (brandingHeight * 0.7)}" 
          text-anchor="middle" 
          font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="${options.size <= 128 ? 14 : options.size <= 256 ? 18 : options.size <= 512 ? 24 : 48}" 
          fill="${options.color.dark}">
      Generated by Encodly
    </text>
  </svg>`;
  
  return brandedSVG;
};

export const downloadQRCode = (dataURL: string, filename: string = 'qrcode.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  link.click();
};

export const downloadQRCodeSVG = (svgString: string, filename: string = 'qrcode.svg') => {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const isValidURL = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

export const getQRCodeType = (text: string): 'url' | 'text' => {
  return isValidURL(text) ? 'url' : 'text';
};

export const validateQRInput = (text: string): { isValid: boolean; error?: string } => {
  if (!text.trim()) {
    return { isValid: false, error: 'Please enter some text or URL' };
  }
  
  if (text.length > 2000) {
    return { isValid: false, error: 'Text is too long (max 2000 characters)' };
  }
  
  return { isValid: true };
};