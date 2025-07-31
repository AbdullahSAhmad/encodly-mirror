// Base64 WebWorker for non-blocking processing
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

// Base64 character sets
const BASE64_STANDARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

// MIME type detection patterns
const MIME_PATTERNS = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/gif': [0x47, 0x49, 0x46],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
  'image/bmp': [0x42, 0x4D],
  'image/tiff': [0x49, 0x49, 0x2A, 0x00],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'application/zip': [0x50, 0x4B, 0x03, 0x04],
  'text/plain': null, // Default fallback
};

function detectMimeType(uint8Array) {
  for (const [mimeType, pattern] of Object.entries(MIME_PATTERNS)) {
    if (!pattern) continue;
    
    if (uint8Array.length >= pattern.length) {
      const matches = pattern.every((byte, index) => uint8Array[index] === byte);
      if (matches) return mimeType;
    }
  }
  
  // Check if it's likely text
  const firstBytes = uint8Array.slice(0, 1024);
  const isText = firstBytes.every(byte => 
    (byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13
  );
  
  return isText ? 'text/plain' : 'application/octet-stream';
}

function customBase64Encode(uint8Array, alphabet = BASE64_STANDARD) {
  let result = '';
  const padding = alphabet === BASE64_URL ? '' : '=';
  
  for (let i = 0; i < uint8Array.length; i += 3) {
    const chunk = [uint8Array[i], uint8Array[i + 1] || 0, uint8Array[i + 2] || 0];
    const combined = (chunk[0] << 16) | (chunk[1] << 8) | chunk[2];
    
    result += alphabet[combined >> 18];
    result += alphabet[(combined >> 12) & 63];
    result += i + 1 < uint8Array.length ? alphabet[(combined >> 6) & 63] : (alphabet === BASE64_URL ? '' : padding);
    result += i + 2 < uint8Array.length ? alphabet[combined & 63] : (alphabet === BASE64_URL ? '' : padding);
  }
  
  return result;
}

function customBase64Decode(base64String, alphabet = BASE64_STANDARD) {
  // Remove padding and whitespace
  base64String = base64String.replace(/[^A-Za-z0-9+/\-_]/g, '');
  
  const result = [];
  const charMap = {};
  for (let i = 0; i < alphabet.length; i++) {
    charMap[alphabet[i]] = i;
  }
  
  for (let i = 0; i < base64String.length; i += 4) {
    const chunk = [
      charMap[base64String[i]] || 0,
      charMap[base64String[i + 1]] || 0,
      charMap[base64String[i + 2]] || 0,
      charMap[base64String[i + 3]] || 0
    ];
    
    const combined = (chunk[0] << 18) | (chunk[1] << 12) | (chunk[2] << 6) | chunk[3];
    
    result.push(combined >> 16);
    if (i + 2 < base64String.length) result.push((combined >> 8) & 255);
    if (i + 3 < base64String.length) result.push(combined & 255);
  }
  
  return new Uint8Array(result);
}

function processChunked(data, operation, options = {}) {
  const { alphabet = BASE64_STANDARD, onProgress } = options;
  const totalSize = data.length;
  let processed = 0;
  let result = '';
  
  return new Promise((resolve, reject) => {
    function processNextChunk() {
      try {
        const endIndex = Math.min(processed + CHUNK_SIZE, totalSize);
        const chunk = data.slice(processed, endIndex);
        
        if (operation === 'encode') {
          result += customBase64Encode(chunk, alphabet);
        } else {
          // For decode, we need to handle this differently as we can't split base64 arbitrarily
          result = customBase64Decode(data, alphabet);
          processed = totalSize;
        }
        
        processed = endIndex;
        
        if (onProgress) {
          onProgress(processed / totalSize);
        }
        
        if (processed < totalSize && operation === 'encode') {
          // Continue processing in next tick
          setTimeout(processNextChunk, 0);
        } else {
          resolve(operation === 'encode' ? result : result);
        }
      } catch (error) {
        reject(error);
      }
    }
    
    processNextChunk();
  });
}

// Main message handler
self.onmessage = async function(e) {
  const { id, type, data, options = {} } = e.data;
  
  try {
    let result;
    
    switch (type) {
      case 'encode':
        if (typeof data === 'string') {
          const encoder = new TextEncoder();
          const uint8Array = encoder.encode(data);
          const mimeType = 'text/plain';
          
          result = await processChunked(uint8Array, 'encode', {
            ...options,
            onProgress: (progress) => {
              self.postMessage({ id, type: 'progress', progress });
            }
          });
          
          self.postMessage({
            id,
            type: 'success',
            result: {
              base64: result,
              mimeType,
              size: uint8Array.length,
              formats: generateFormats(result, mimeType)
            }
          });
        } else if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
          const uint8Array = new Uint8Array(data);
          const mimeType = detectMimeType(uint8Array);
          
          result = await processChunked(uint8Array, 'encode', {
            ...options,
            onProgress: (progress) => {
              self.postMessage({ id, type: 'progress', progress });
            }
          });
          
          self.postMessage({
            id,
            type: 'success',
            result: {
              base64: result,
              mimeType,
              size: uint8Array.length,
              formats: generateFormats(result, mimeType),
              isImage: mimeType.startsWith('image/')
            }
          });
        }
        break;
        
      case 'decode':
        const decodedData = await processChunked(data, 'decode', {
          ...options,
          onProgress: (progress) => {
            self.postMessage({ id, type: 'progress', progress });
          }
        });
        
        const mimeType = detectMimeType(decodedData);
        
        self.postMessage({
          id,
          type: 'success',
          result: {
            data: decodedData,
            mimeType,
            size: decodedData.length,
            isImage: mimeType.startsWith('image/'),
            text: mimeType.startsWith('text/') ? new TextDecoder().decode(decodedData) : null
          }
        });
        break;
        
      case 'detect-mime':
        const detectedMime = detectMimeType(new Uint8Array(data));
        self.postMessage({
          id,
          type: 'success',
          result: { mimeType: detectedMime }
        });
        break;
        
      default:
        throw new Error(`Unknown operation: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      error: error.message
    });
  }
};

function generateFormats(base64, mimeType) {
  const formats = {
    raw: base64,
    dataUri: `data:${mimeType};base64,${base64}`,
  };
  
  if (mimeType.startsWith('image/')) {
    formats.htmlImg = `<img src="data:${mimeType};base64,${base64}" alt="Base64 Image" />`;
    formats.cssBackground = `background-image: url('data:${mimeType};base64,${base64}');`;
    formats.markdown = `![Base64 Image](data:${mimeType};base64,${base64})`;
  }
  
  if (mimeType.startsWith('text/')) {
    formats.htmlEmbed = `<embed src="data:${mimeType};base64,${base64}" type="${mimeType}" />`;
  }
  
  return formats;
}