// Hash generation utilities using Web Crypto API

export interface HashResult {
  algorithm: string;
  hash: string;
  inputType: 'text' | 'file';
  timestamp: number;
}

export interface HashComparison {
  hash1: string;
  hash2: string;
  algorithm: string;
  matches: boolean;
}

// Supported hash algorithms
export const HASH_ALGORITHMS = [
  { value: 'SHA-1', label: 'SHA-1', description: '160-bit hash (legacy)' },
  { value: 'SHA-256', label: 'SHA-256', description: '256-bit hash (recommended)' },
  { value: 'SHA-384', label: 'SHA-384', description: '384-bit hash' },
  { value: 'SHA-512', label: 'SHA-512', description: '512-bit hash (most secure)' },
] as const;

export type HashAlgorithm = typeof HASH_ALGORITHMS[number]['value'];

/**
 * Generate hash for text input using Web Crypto API
 */
export async function generateTextHash(text: string, algorithm: HashAlgorithm): Promise<string> {
  if (!text) return '';

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const hash = await crypto.subtle.digest(algorithm, data);
    
    // Convert ArrayBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Hash generation error:', error);
    return '';
  }
}

/**
 * Generate hash for file input
 */
export async function generateFileHash(file: File, algorithm: HashAlgorithm): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        
        const hash = await crypto.subtle.digest(algorithm, arrayBuffer);
        
        // Convert ArrayBuffer to hex string
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generate multiple hashes for text
 */
export async function generateAllHashes(text: string): Promise<Record<HashAlgorithm, string>> {
  const results: Record<string, string> = {};
  
  for (const { value } of HASH_ALGORITHMS) {
    results[value] = await generateTextHash(text, value);
  }
  
  return results as Record<HashAlgorithm, string>;
}

/**
 * Compare two hashes
 */
export function compareHashes(hash1: string, hash2: string, algorithm?: HashAlgorithm): HashComparison {
  return {
    hash1: hash1.toLowerCase().trim(),
    hash2: hash2.toLowerCase().trim(),
    algorithm: algorithm || 'Unknown',
    matches: hash1.toLowerCase().trim() === hash2.toLowerCase().trim()
  };
}

/**
 * Validate hash format based on algorithm
 */
export function validateHashFormat(hash: string, algorithm: HashAlgorithm): boolean {
  if (!hash) return false;
  
  const cleanHash = hash.toLowerCase().trim();
  const hexPattern = /^[a-f0-9]+$/;
  
  if (!hexPattern.test(cleanHash)) return false;
  
  const expectedLengths: Record<HashAlgorithm, number> = {
    'SHA-1': 40,
    'SHA-256': 64,
    'SHA-384': 96,
    'SHA-512': 128,
  };
  
  return cleanHash.length === expectedLengths[algorithm];
}

/**
 * Get hash strength percentage
 */
export function getHashStrength(algorithm: HashAlgorithm): number {
  const strengths: Record<HashAlgorithm, number> = {
    'SHA-1': 60,
    'SHA-256': 95,
    'SHA-384': 90,
    'SHA-512': 98,
  };
  
  return strengths[algorithm] || 0;
}

/**
 * Get security recommendation for algorithm
 */
export function getSecurityRecommendation(algorithm: HashAlgorithm): string {
  const recommendations: Record<HashAlgorithm, string> = {
    'SHA-1': 'Deprecated for cryptographic use. Use SHA-256 or higher.',
    'SHA-256': 'Excellent choice for most applications. Widely adopted and secure.',
    'SHA-384': 'Very secure, good for high-security applications.',
    'SHA-512': 'Maximum security, ideal for critical applications.',
  };
  
  return recommendations[algorithm] || 'Unknown algorithm';
}

/**
 * Format hash for display
 */
export function formatHashDisplay(hash: string, format: 'default' | 'spaced' | 'chunked' = 'default'): string {
  if (!hash) return '';
  
  switch (format) {
    case 'spaced':
      return hash.match(/.{1,8}/g)?.join(' ') || hash;
    case 'chunked':
      return hash.match(/.{1,16}/g)?.join('\n') || hash;
    default:
      return hash;
  }
}

/**
 * Export hash results to file
 */
export function exportHashResults(results: Record<HashAlgorithm, string>, input: string): string {
  const timestamp = new Date().toISOString();
  const inputPreview = input.length > 50 ? input.substring(0, 50) + '...' : input;
  
  let output = `Hash Generation Results\n`;
  output += `Generated: ${timestamp}\n`;
  output += `Input: ${inputPreview}\n`;
  output += `Input Length: ${input.length} characters\n\n`;
  
  for (const [algorithm, hash] of Object.entries(results)) {
    if (hash) {
      output += `${algorithm}:\n${hash}\n\n`;
    }
  }
  
  return output;
}

/**
 * Generate test data for demo purposes
 */
export function generateTestData(): string[] {
  return [
    'Hello World',
    'The quick brown fox jumps over the lazy dog',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '{"name": "test", "value": 12345}',
    'password123',
    'https://example.com/api/endpoint',
    'user@example.com',
    '2024-01-15T10:30:00Z'
  ];
}