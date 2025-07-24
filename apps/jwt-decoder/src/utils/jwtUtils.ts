export interface JWTDecoded {
  header: any;
  payload: any;
  signature: string;
  isValid: boolean;
  error?: string;
}

export interface JWTValidation {
  isValidStructure: boolean;
  isExpired: boolean | null;
  expirationTime: Date | null;
  timeUntilExpiry: number | null; // milliseconds
  algorithm: string | null;
  isSignatureVerified?: boolean | null; // null = not checked, true = verified, false = invalid
  error?: string;
}

// Common JWT claims with descriptions
export const COMMON_CLAIMS = {
  iss: { name: 'Issuer', description: 'The issuer of the token' },
  sub: { name: 'Subject', description: 'The subject of the token (usually user ID)' },
  aud: { name: 'Audience', description: 'The intended audience for the token' },
  exp: { name: 'Expiration Time', description: 'When the token expires (Unix timestamp)' },
  nbf: { name: 'Not Before', description: 'Token is not valid before this time' },
  iat: { name: 'Issued At', description: 'When the token was issued (Unix timestamp)' },
  jti: { name: 'JWT ID', description: 'Unique identifier for the token' },
  typ: { name: 'Type', description: 'Type of token (usually "JWT")' },
  alg: { name: 'Algorithm', description: 'Signing algorithm used' },
  kid: { name: 'Key ID', description: 'Key identifier for signature verification' }
};

/**
 * Decode a JWT token
 */
export function decodeJWT(token: string): JWTDecoded {
  try {
    // Remove "Bearer " prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    
    // Split the token into parts
    const parts = cleanToken.split('.');
    
    if (parts.length !== 3) {
      return {
        header: null,
        payload: null,
        signature: '',
        isValid: false,
        error: 'Invalid JWT format. JWT must have exactly 3 parts separated by dots.'
      };
    }
    
    try {
      // Decode header
      const header = JSON.parse(base64UrlDecode(parts[0]));
      
      // Decode payload
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      
      // Keep signature as-is (we can't verify without the secret)
      const signature = parts[2];
      
      return {
        header,
        payload,
        signature,
        isValid: true
      };
    } catch (decodeError) {
      return {
        header: null,
        payload: null,
        signature: parts[2] || '',
        isValid: false,
        error: 'Failed to decode JWT parts. Invalid base64 encoding.'
      };
    }
  } catch (error) {
    return {
      header: null,
      payload: null,
      signature: '',
      isValid: false,
      error: 'Invalid JWT token format.'
    };
  }
}

/**
 * Validate JWT token and extract important information
 */
export function validateJWT(decoded: JWTDecoded): JWTValidation {
  if (!decoded.isValid) {
    return {
      isValidStructure: false,
      isExpired: null,
      expirationTime: null,
      timeUntilExpiry: null,
      algorithm: null,
      error: decoded.error
    };
  }
  
  const now = Math.floor(Date.now() / 1000);
  const exp = decoded.payload?.exp;
  const alg = decoded.header?.alg;
  
  let isExpired: boolean | null = null;
  let expirationTime: Date | null = null;
  let timeUntilExpiry: number | null = null;
  
  if (exp && typeof exp === 'number') {
    expirationTime = new Date(exp * 1000);
    isExpired = now > exp;
    timeUntilExpiry = isExpired ? 0 : (exp - now) * 1000; // Convert to milliseconds
  }
  
  return {
    isValidStructure: true,
    isExpired,
    expirationTime,
    timeUntilExpiry,
    algorithm: alg || null,
    isSignatureVerified: null // Will be set when verification is attempted
  };
}

/**
 * Base64 URL decode (JWT uses base64url encoding)
 */
function base64UrlDecode(str: string): string {
  // Add padding if needed
  const padded = str + '='.repeat((4 - str.length % 4) % 4);
  
  // Replace URL-safe characters
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  
  // Decode base64
  const decoded = atob(base64);
  
  // Convert to UTF-8
  return decodeURIComponent(escape(decoded));
}

/**
 * Format time duration for display
 */
export function formatTimeUntilExpiry(milliseconds: number): string {
  if (milliseconds <= 0) return 'Expired';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Get the color class for expiration status
 */
export function getExpirationColor(isExpired: boolean | null): string {
  if (isExpired === null) return 'text-muted-foreground';
  return isExpired ? 'text-red-500' : 'text-green-500';
}

/**
 * Verify JWT signature using HMAC algorithms
 */
export async function verifyJWTSignature(token: string, secret: string): Promise<boolean> {
  if (!secret.trim()) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const algorithm = header.alg;
    
    // Only support HMAC algorithms for client-side verification
    if (!algorithm || !algorithm.startsWith('HS')) {
      return false;
    }
    
    // Create the signature base (header.payload)
    const signatureBase = `${parts[0]}.${parts[1]}`;
    
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
        return false;
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
    
    // Compare with the token's signature
    return signatureBase64 === parts[2];
  } catch (error) {
    console.error('Error verifying JWT signature:', error);
    return false;
  }
}

/**
 * Extract JWT token from various input formats
 */
export function extractJWTToken(input: string): string {
  const trimmed = input.trim();
  
  // Check if it's a Bearer token
  const bearerMatch = trimmed.match(/^Bearer\s+(.+)$/i);
  if (bearerMatch) {
    return bearerMatch[1];
  }
  
  // Check if it's in an Authorization header format
  const authMatch = trimmed.match(/^Authorization:\s*Bearer\s+(.+)$/i);
  if (authMatch) {
    return authMatch[1];
  }
  
  // Return as-is if it looks like a JWT (3 parts separated by dots)
  if (trimmed.split('.').length === 3) {
    return trimmed;
  }
  
  // Try to find JWT pattern in the text
  const jwtMatch = trimmed.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
  if (jwtMatch) {
    return jwtMatch[0];
  }
  
  return trimmed;
}