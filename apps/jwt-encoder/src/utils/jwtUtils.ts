export interface JWTEncoded {
  token: string;
  header: any;
  payload: any;
  signature: string;
  isValid: boolean;
  error?: string;
}

export interface JWTInput {
  header: any;
  payload: any;
  secret: string;
}

// Default JWT header
export const DEFAULT_HEADER = {
  alg: 'HS256',
  typ: 'JWT'
};

// Default JWT payload with common claims
export const DEFAULT_PAYLOAD = {
  sub: '1234567890',
  name: 'John Doe',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour from now
};

// Common JWT algorithms
export const SUPPORTED_ALGORITHMS = [
  { value: 'HS256', label: 'HS256 (HMAC SHA-256)' },
  { value: 'HS384', label: 'HS384 (HMAC SHA-384)' },
  { value: 'HS512', label: 'HS512 (HMAC SHA-512)' }
];

// Common JWT claims with descriptions
export const COMMON_CLAIMS = {
  iss: { name: 'Issuer', description: 'The issuer of the token' },
  sub: { name: 'Subject', description: 'The subject of the token (usually user ID)' },
  aud: { name: 'Audience', description: 'The intended audience for the token' },
  exp: { name: 'Expiration Time', description: 'When the token expires (Unix timestamp)' },
  nbf: { name: 'Not Before', description: 'Token is not valid before this time' },
  iat: { name: 'Issued At', description: 'When the token was issued (Unix timestamp)' },
  jti: { name: 'JWT ID', description: 'Unique identifier for the token' }
};

// Common header claims
export const COMMON_HEADER_CLAIMS = {
  alg: { name: 'Algorithm', description: 'Signing algorithm used' },
  typ: { name: 'Type', description: 'Type of token (usually "JWT")' },
  kid: { name: 'Key ID', description: 'Key identifier for signature verification' }
};

/**
 * Encode a JWT token
 */
export async function encodeJWT(
  header: any,
  payload: any,
  secret: string,
  algorithm: 'HS256' | 'HS384' | 'HS512' = 'HS256'
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // Validate inputs
    if (!header || typeof header !== 'object') {
      return {
        success: false,
        error: 'Header must be a valid JSON object'
      };
    }
    
    if (!payload || typeof payload !== 'object') {
      return {
        success: false,
        error: 'Payload must be a valid JSON object'
      };
    }
    
    if (!secret || typeof secret !== 'string' || secret.trim() === '') {
      return {
        success: false,
        error: 'Secret key is required for signing'
      };
    }
    
    // Ensure algorithm is set in header (always use the provided algorithm)
    const finalHeader = { ...header };
    finalHeader.alg = algorithm;
    
    // Ensure typ is set in header
    if (!finalHeader.typ) {
      finalHeader.typ = 'JWT';
    }
    
    // Encode header and payload
    const encodedHeader = base64UrlEncode(JSON.stringify(finalHeader));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    
    // Create signature base
    const signatureBase = `${encodedHeader}.${encodedPayload}`;
    
    // Generate signature
    const signature = await generateSignature(signatureBase, secret, finalHeader.alg);
    
    if (!signature) {
      return {
        success: false,
        error: `Unsupported algorithm: ${finalHeader.alg}`
      };
    }
    
    // Combine to create final token
    const token = `${signatureBase}.${signature}`;
    
    return {
      success: true,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to encode JWT token'
    };
  }
}

/**
 * Generate signature for JWT token
 */
async function generateSignature(signatureBase: string, secret: string, algorithm: string): Promise<string | null> {
  try {
    // Only support HMAC algorithms for client-side signing
    if (!algorithm || !algorithm.startsWith('HS')) {
      return null;
    }
    
    // Get the hash algorithm
    let hashAlgorithm: string;
    switch (algorithm) {
      case 'HS256':
        hashAlgorithm = 'SHA-256';
        break;
      case 'HS384':
        hashAlgorithm = 'SHA-384';
        break;
      case 'HS512':
        hashAlgorithm = 'SHA-512';
        break;
      default:
        return null;
    }
    
    // Import the secret as a key
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: hashAlgorithm },
      false,
      ['sign']
    );
    
    // Sign the signature base
    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      encoder.encode(signatureBase)
    );
    
    // Convert signature to base64url
    const signatureArray = new Uint8Array(signature);
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return signatureBase64;
  } catch (error) {
    console.error('Error generating JWT signature:', error);
    return null;
  }
}

/**
 * Base64 URL encode (JWT uses base64url encoding)
 */
function base64UrlEncode(str: string): string {
  // Convert to UTF-8 bytes
  const utf8 = unescape(encodeURIComponent(str));
  
  // Encode to base64
  const base64 = btoa(utf8);
  
  // Convert to base64url
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Validate JSON string and return parsed object
 */
export function validateAndParseJSON(jsonString: string): { isValid: boolean; data?: any; error?: string } {
  try {
    if (!jsonString.trim()) {
      return { isValid: false, error: 'JSON cannot be empty' };
    }
    
    const data = JSON.parse(jsonString);
    return { isValid: true, data };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON format' 
    };
  }
}

/**
 * Format JSON with proper indentation
 */
export function formatJSON(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return '';
  }
}

/**
 * Generate current Unix timestamp
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Generate timestamp for future time (in seconds from now)
 */
export function getFutureTimestamp(secondsFromNow: number): number {
  return getCurrentTimestamp() + secondsFromNow;
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
  try {
    return new Date(timestamp * 1000).toLocaleString();
  } catch (error) {
    return 'Invalid timestamp';
  }
}

/**
 * Generate a random UUID for jti claim
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Preset payload templates
 */
export const PAYLOAD_TEMPLATES = {
  basic: {
    name: 'Basic User Token',
    payload: {
      sub: '1234567890',
      name: 'John Doe',
      iat: getCurrentTimestamp(),
      exp: getFutureTimestamp(3600) // 1 hour
    }
  },
  admin: {
    name: 'Admin Token',
    payload: {
      sub: 'admin-001',
      name: 'Admin User',
      role: 'admin',
      permissions: ['read', 'write', 'delete'],
      iat: getCurrentTimestamp(),
      exp: getFutureTimestamp(7200) // 2 hours
    }
  },
  api: {
    name: 'API Access Token',
    payload: {
      sub: 'api-client-123',
      aud: 'api.example.com',
      scope: 'read write',
      client_id: 'web-app',
      iat: getCurrentTimestamp(),
      exp: getFutureTimestamp(1800) // 30 minutes
    }
  },
  refresh: {
    name: 'Refresh Token',
    payload: {
      sub: '1234567890',
      jti: generateUUID(),
      type: 'refresh',
      iat: getCurrentTimestamp(),
      exp: getFutureTimestamp(2592000) // 30 days
    }
  }
};