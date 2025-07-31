export interface Base64Options {
  alphabet?: 'standard' | 'url' | string;
  chunked?: boolean;
  chunkSize?: number;
}

export interface ProcessingResult {
  id: string;
  base64?: string;
  data?: Uint8Array;
  text?: string;
  mimeType: string;
  size: number;
  isImage: boolean;
  formats?: Record<string, string>;
  progress?: number;
  error?: string;
}

export interface QueueItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: ProcessingResult;
  error?: string;
}

export class Base64Processor {
  private worker: Worker | null = null;
  private pendingOperations = new Map<string, {
    resolve: (value: ProcessingResult) => void;
    reject: (error: Error) => void;
    onProgress?: (progress: number) => void;
  }>();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      this.worker = new Worker('/base64-worker.js');
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
    } catch (error) {
      console.warn('WebWorker not available, falling back to main thread');
    }
  }

  private handleWorkerMessage(e: MessageEvent) {
    const { id, type, result, progress, error } = e.data;
    const operation = this.pendingOperations.get(id);
    
    if (!operation) return;

    switch (type) {
      case 'progress':
        if (operation.onProgress) {
          operation.onProgress(progress);
        }
        break;
        
      case 'success':
        this.pendingOperations.delete(id);
        operation.resolve(result);
        break;
        
      case 'error':
        this.pendingOperations.delete(id);
        operation.reject(new Error(error));
        break;
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
    // Clean up pending operations
    this.pendingOperations.forEach(({ reject }) => {
      reject(new Error('Worker error'));
    });
    this.pendingOperations.clear();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  async encodeText(
    text: string, 
    options: Base64Options = {},
    onProgress?: (progress: number) => void
  ): Promise<ProcessingResult> {
    const id = this.generateId();
    
    if (!this.worker) {
      // Fallback to main thread
      return this.encodeTextMainThread(text, options);
    }

    return new Promise((resolve, reject) => {
      this.pendingOperations.set(id, { resolve, reject, onProgress });
      
      this.worker!.postMessage({
        id,
        type: 'encode',
        data: text,
        options
      });
    });
  }

  async encodeFile(
    file: File,
    options: Base64Options = {},
    onProgress?: (progress: number) => void
  ): Promise<ProcessingResult> {
    const id = this.generateId();
    
    if (!this.worker) {
      // Fallback to main thread
      return this.encodeFileMainThread(file, options);
    }

    const arrayBuffer = await file.arrayBuffer();
    
    return new Promise((resolve, reject) => {
      this.pendingOperations.set(id, { resolve, reject, onProgress });
      
      this.worker!.postMessage({
        id,
        type: 'encode',
        data: arrayBuffer,
        options
      });
    });
  }

  async decode(
    base64: string,
    options: Base64Options = {},
    onProgress?: (progress: number) => void
  ): Promise<ProcessingResult> {
    const id = this.generateId();
    
    if (!this.worker) {
      // Fallback to main thread
      return this.decodeMainThread(base64, options);
    }

    return new Promise((resolve, reject) => {
      this.pendingOperations.set(id, { resolve, reject, onProgress });
      
      this.worker!.postMessage({
        id,
        type: 'decode',
        data: base64,
        options
      });
    });
  }

  async detectMimeType(data: ArrayBuffer): Promise<string> {
    const id = this.generateId();
    
    if (!this.worker) {
      return this.detectMimeTypeMainThread(data);
    }

    return new Promise((resolve, reject) => {
      this.pendingOperations.set(id, { 
        resolve: (result: any) => resolve(result.mimeType), 
        reject 
      });
      
      this.worker!.postMessage({
        id,
        type: 'detect-mime',
        data
      });
    });
  }

  // Main thread fallbacks
  private async encodeTextMainThread(text: string, options: Base64Options): Promise<ProcessingResult> {
    try {
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(text);
      const base64 = btoa(String.fromCharCode(...uint8Array));
      
      return {
        id: this.generateId(),
        base64,
        mimeType: 'text/plain',
        size: uint8Array.length,
        isImage: false,
        formats: this.generateFormats(base64, 'text/plain')
      };
    } catch (error) {
      throw new Error(`Encoding failed: ${error}`);
    }
  }

  private async encodeFileMainThread(file: File, options: Base64Options): Promise<ProcessingResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const mimeType = file.type || 'application/octet-stream';
          
          resolve({
            id: this.generateId(),
            base64,
            mimeType,
            size: file.size,
            isImage: mimeType.startsWith('image/'),
            formats: this.generateFormats(base64, mimeType)
          });
        } catch (error) {
          reject(new Error(`File encoding failed: ${error}`));
        }
      };
      
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
    });
  }

  private async decodeMainThread(base64: string, options: Base64Options): Promise<ProcessingResult> {
    try {
      const binaryString = atob(base64);
      const uint8Array = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      
      const mimeType = this.detectMimeTypeMainThread(uint8Array.buffer);
      const isText = mimeType.startsWith('text/');
      
      return {
        id: this.generateId(),
        data: uint8Array,
        mimeType,
        size: uint8Array.length,
        isImage: mimeType.startsWith('image/'),
        text: isText ? new TextDecoder().decode(uint8Array) : undefined
      };
    } catch (error) {
      throw new Error(`Decoding failed: ${error}`);
    }
  }

  private detectMimeTypeMainThread(data: ArrayBuffer): string {
    const uint8Array = new Uint8Array(data);
    
    // Basic MIME type detection
    if (uint8Array.length >= 4) {
      // PNG
      if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && 
          uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
        return 'image/png';
      }
      
      // JPEG
      if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
        return 'image/jpeg';
      }
      
      // GIF
      if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49 && uint8Array[2] === 0x46) {
        return 'image/gif';
      }
      
      // PDF
      if (uint8Array[0] === 0x25 && uint8Array[1] === 0x50 && 
          uint8Array[2] === 0x44 && uint8Array[3] === 0x46) {
        return 'application/pdf';
      }
    }
    
    // Check if it's text
    const firstBytes = uint8Array.slice(0, 1024);
    const isText = firstBytes.every(byte => 
      (byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13
    );
    
    return isText ? 'text/plain' : 'application/octet-stream';
  }

  private generateFormats(base64: string, mimeType: string): Record<string, string> {
    const formats: Record<string, string> = {
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

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingOperations.clear();
  }
}

export class BatchProcessor {
  private processor: Base64Processor;
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private maxConcurrent = 3;

  constructor() {
    this.processor = new Base64Processor();
  }

  addFiles(files: File[]): string[] {
    const ids: string[] = [];
    
    files.forEach(file => {
      if (file.size > 50 * 1024 * 1024) {
        console.warn(`File ${file.name} exceeds 50MB limit`);
        return;
      }
      
      const id = Math.random().toString(36).substr(2, 9);
      this.queue.push({
        id,
        file,
        status: 'pending',
        progress: 0
      });
      ids.push(id);
    });
    
    this.processQueue();
    return ids;
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const processing = this.queue
      .filter(item => item.status === 'pending')
      .slice(0, this.maxConcurrent);

    if (processing.length === 0) {
      this.isProcessing = false;
      return;
    }

    await Promise.all(processing.map(item => this.processItem(item)));
    
    // Continue processing if there are more items
    if (this.queue.some(item => item.status === 'pending')) {
      this.isProcessing = false;
      this.processQueue();
    } else {
      this.isProcessing = false;
    }
  }

  private async processItem(item: QueueItem) {
    item.status = 'processing';
    
    try {
      const result = await this.processor.encodeFile(
        item.file,
        { chunked: true },
        (progress) => {
          item.progress = progress;
        }
      );
      
      item.status = 'completed';
      item.result = result;
      item.progress = 1;
    } catch (error) {
      item.status = 'error';
      item.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  getQueueStatus(): QueueItem[] {
    return [...this.queue];
  }

  removeItem(id: string) {
    const index = this.queue.findIndex(item => item.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  clearCompleted() {
    this.queue = this.queue.filter(item => 
      item.status !== 'completed' && item.status !== 'error'
    );
  }

  clearAll() {
    this.queue = [];
  }

  destroy() {
    this.processor.destroy();
  }
}

// Export template generators
export const EXPORT_TEMPLATES = {
  json: (items: ProcessingResult[]) => {
    return JSON.stringify(items.map(item => ({
      mimeType: item.mimeType,
      size: item.size,
      base64: item.base64,
      isImage: item.isImage
    })), null, 2);
  },
  
  html: (items: ProcessingResult[]) => {
    const images = items.filter(item => item.isImage);
    const content = images.map(item => 
      `<div class="base64-item">
        <h3>Image (${item.mimeType})</h3>
        <img src="data:${item.mimeType};base64,${item.base64}" alt="Base64 Image" style="max-width: 300px;" />
        <details>
          <summary>Base64 Data</summary>
          <pre>${item.base64}</pre>
        </details>
      </div>`
    ).join('\n');
    
    return `<!DOCTYPE html>
<html>
<head>
  <title>Base64 Export</title>
  <style>
    .base64-item { margin: 20px 0; padding: 20px; border: 1px solid #ccc; }
    pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Base64 Export Results</h1>
  ${content}
</body>
</html>`;
  },
  
  css: (items: ProcessingResult[]) => {
    return items
      .filter(item => item.isImage)
      .map((item, index) => 
        `.base64-image-${index + 1} {
  background-image: url('data:${item.mimeType};base64,${item.base64}');
  background-size: cover;
  background-repeat: no-repeat;
}`
      ).join('\n\n');
  }
};