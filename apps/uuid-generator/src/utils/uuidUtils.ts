import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5, validate, version } from 'uuid';

export type UUIDVersion = 'v1' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7';

export interface UUIDVersionInfo {
  value: UUIDVersion;
  label: string;
  description: string;
  useCase: string;
}

export const UUID_VERSIONS: UUIDVersionInfo[] = [
  {
    value: 'v4',
    label: 'UUID v4 (Random)',
    description: 'Random UUID using cryptographically secure random numbers',
    useCase: 'Most common, suitable for general purpose use'
  },
  {
    value: 'v1',
    label: 'UUID v1 (Timestamp)',
    description: 'Timestamp-based UUID with MAC address',
    useCase: 'When you need time-based ordering'
  },
  {
    value: 'v3',
    label: 'UUID v3 (MD5 Namespace)',
    description: 'Name-based UUID using MD5 hashing',
    useCase: 'Deterministic UUIDs from namespace and name'
  },
  {
    value: 'v5',
    label: 'UUID v5 (SHA-1 Namespace)',
    description: 'Name-based UUID using SHA-1 hashing',
    useCase: 'Preferred over v3, deterministic UUIDs'
  },
  {
    value: 'v6',
    label: 'UUID v6 (Reordered Time)',
    description: 'Reordered timestamp for better database performance',
    useCase: 'Time-ordered with better database indexing'
  },
  {
    value: 'v7',
    label: 'UUID v7 (Unix Timestamp)',
    description: 'Unix timestamp with random data',
    useCase: 'Modern time-based UUIDs with millisecond precision'
  }
];

export const NIL_UUID = '00000000-0000-0000-0000-000000000000';
export const MAX_UUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

// Predefined namespaces for v3/v5 UUIDs
export const PREDEFINED_NAMESPACES = {
  DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', 
  OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8'
};

export interface UUIDGenerationOptions {
  version: UUIDVersion;
  namespace?: string;
  name?: string;
  nodeId?: string;
  clockSequence?: number;
}

// UUID v6 implementation (reordered timestamp)
function generateUUIDv6(): string {
  const uuid = uuidv1();
  const hex = uuid.replace(/-/g, '');
  
  // Extract v1 components
  const timeLow = hex.substring(0, 8);       // 32 bits
  const timeMid = hex.substring(8, 12);      // 16 bits  
  const timeHiAndVersion = hex.substring(12, 16); // 16 bits (12 bits time + 4 bits version)
  const clockSeqAndReserved = hex.substring(16, 20); // 16 bits
  const node = hex.substring(20, 32);        // 48 bits
  
  // Extract the 12-bit time_hi from v1 (remove version bits)
  const timeHi = timeHiAndVersion.substring(1, 4); // Remove version '1', keep 12 bits
  
  // Reorder for v6: time_hi + time_mid + time_low + version + clock_seq + node
  // Total: 12 + 16 + 32 + 4 + 16 + 48 = 128 bits
  const reorderedHex = timeHi + timeMid + timeLow + '6' + clockSeqAndReserved.substring(1) + node;
  
  return [
    reorderedHex.substring(0, 8),    // 8 chars
    reorderedHex.substring(8, 12),   // 4 chars  
    reorderedHex.substring(12, 16),  // 4 chars
    reorderedHex.substring(16, 20),  // 4 chars
    reorderedHex.substring(20, 32)   // 12 chars
  ].join('-');
}

// UUID v7 implementation (Unix timestamp + random)
function generateUUIDv7(): string {
  const timestamp = Date.now();
  const timestampHex = timestamp.toString(16).padStart(12, '0');
  
  // Generate 10 random bytes (80 bits) for the remaining parts
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  
  // UUID v7 structure (128 bits total, 32 hex characters):
  // 48 bits: timestamp (12 hex chars)
  // 4 bits: version (1 hex char) 
  // 12 bits: random A (3 hex chars)
  // 2 bits: variant (part of 1 hex char)
  // 62 bits: random B (15.5 hex chars, so 16 hex chars total)
  
  const version = '7';
  const randomA = randomHex.substring(0, 3); // 12 bits (3 hex chars)
  
  // Set variant bits in the first nibble of random B
  const variantByte = parseInt(randomHex[3], 16) & 0x3 | 0x8; // Set variant to 10xx
  const randomB1 = variantByte.toString(16) + randomHex.substring(4, 7); // 4 hex chars total
  const randomB2 = randomHex.substring(7, 19); // 12 hex chars
  
  const uuid = [
    timestampHex.substring(0, 8),     // 8 hex chars
    timestampHex.substring(8, 12),    // 4 hex chars  
    version + randomA,                // 4 hex chars (1 + 3)
    randomB1,                         // 4 hex chars
    randomB2                          // 12 hex chars
  ].join('-');
  
  return uuid;
}

export function generateUUID(version: UUIDVersion, options?: UUIDGenerationOptions): string {
  switch (version) {
    case 'v1':
      return uuidv1(options?.nodeId ? { node: Buffer.from(options.nodeId.replace(/:/g, ''), 'hex') } : undefined, options?.clockSequence);
    case 'v3':
      if (!options?.namespace || !options?.name) {
        throw new Error('v3 UUIDs require namespace and name');
      }
      return uuidv3(options.name, options.namespace);
    case 'v4':
      return uuidv4();
    case 'v5':
      if (!options?.namespace || !options?.name) {
        throw new Error('v5 UUIDs require namespace and name');
      }
      return uuidv5(options.name, options.namespace);
    case 'v6':
      return generateUUIDv6();
    case 'v7':
      return generateUUIDv7();
    default:
      return uuidv4();
  }
}

export function generateBulkUUIDs(version: UUIDVersion, count: number, options?: UUIDGenerationOptions): string[] {
  if (count > 10000) {
    throw new Error('Maximum bulk generation limit is 10,000 UUIDs');
  }
  
  const uuids: string[] = [];
  
  for (let i = 0; i < count; i++) {
    uuids.push(generateUUID(version, options));
  }
  
  return uuids;
}

export type ExportFormat = 'txt' | 'csv' | 'json' | 'sql';

export interface ExportOptions {
  format: ExportFormat;
  tableName?: string;
  columnName?: string;
  includeHeaders?: boolean;
}

export function exportUUIDs(uuids: string[], options: ExportOptions): string {
  switch (options.format) {
    case 'txt':
      return uuids.join('\n');
      
    case 'csv':
      const header = options.includeHeaders !== false ? 'uuid\n' : '';
      return header + uuids.map(uuid => `"${uuid}"`).join('\n');
      
    case 'json':
      return JSON.stringify({ uuids }, null, 2);
      
    case 'sql':
      const tableName = options.tableName || 'uuids';
      const columnName = options.columnName || 'uuid';
      const values = uuids.map(uuid => `('${uuid}')`).join(',\n  ');
      return `INSERT INTO ${tableName} (${columnName}) VALUES\n  ${values};`;
      
    default:
      return uuids.join('\n');
  }
}

// Custom UUID validation that handles v6 and v7
function validateUUIDCustom(uuid: string): { isValid: boolean; version: number | null } {
  // Standard UUID regex pattern
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(uuid)) {
    return { isValid: false, version: null };
  }
  
  // Extract version from the UUID
  const versionChar = uuid.charAt(14);
  const versionNum = parseInt(versionChar, 16);
  
  // Check if version is valid (1-7)
  if (versionNum >= 1 && versionNum <= 7) {
    // Check variant bits (should be 10xx for RFC 4122)
    const variantChar = uuid.charAt(19);
    const variantBits = parseInt(variantChar, 16);
    
    if ((variantBits & 0x8) === 0x8 && (variantBits & 0x4) === 0x0) {
      return { isValid: true, version: versionNum };
    }
  }
  
  return { isValid: false, version: null };
}

export function validateUUID(uuid: string): {
  isValid: boolean;
  version: number | null;
  format: 'standard' | 'compact' | 'invalid';
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!uuid || typeof uuid !== 'string') {
    return {
      isValid: false,
      version: null,
      format: 'invalid',
      errors: ['UUID is required and must be a string']
    };
  }
  
  const trimmedUuid = uuid.trim().toLowerCase();
  
  // First try standard library validation for v1-v5
  let isValid = validate(trimmedUuid);
  let detectedVersion: number | null = null;
  let format: 'standard' | 'compact' | 'invalid' = 'standard';
  
  if (isValid) {
    detectedVersion = version(trimmedUuid);
  } else {
    // Try our custom validation for v6/v7 and other cases
    const customValidation = validateUUIDCustom(trimmedUuid);
    if (customValidation.isValid) {
      isValid = true;
      detectedVersion = customValidation.version;
    } else {
      // Check if it might be a compact format (without hyphens)
      if (/^[0-9a-fA-F]{32}$/.test(trimmedUuid)) {
        const formatted = trimmedUuid.replace(
          /^([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})$/,
          '$1-$2-$3-$4-$5'
        );
        
        // Try standard validation first
        if (validate(formatted)) {
          return {
            isValid: true,
            version: version(formatted),
            format: 'compact',
            errors: []
          };
        }
        
        // Try custom validation for compact format
        const compactCustomValidation = validateUUIDCustom(formatted);
        if (compactCustomValidation.isValid) {
          return {
            isValid: true,
            version: compactCustomValidation.version,
            format: 'compact',
            errors: []
          };
        }
      }
    }
  }
  
  if (!isValid) {
    errors.push('Invalid UUID format');
    return {
      isValid: false,
      version: null,
      format: 'invalid',
      errors
    };
  }
  
  return {
    isValid: true,
    version: detectedVersion,
    format,
    errors: []
  };
}

export function formatUUID(uuid: string, format: 'standard' | 'compact' | 'uppercase' | 'lowercase'): string {
  const validation = validateUUID(uuid);
  
  if (!validation.isValid) {
    return uuid; // Return as-is if invalid
  }
  
  let formattedUuid = uuid.trim();
  
  // If it's compact, convert to standard first
  if (validation.format === 'compact') {
    formattedUuid = formattedUuid.replace(
      /^([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})$/,
      '$1-$2-$3-$4-$5'
    );
  }
  
  switch (format) {
    case 'standard':
      return formattedUuid.toLowerCase();
    case 'compact':
      return formattedUuid.replace(/-/g, '').toLowerCase();
    case 'uppercase':
      return formattedUuid.toUpperCase();
    case 'lowercase':
      return formattedUuid.toLowerCase();
    default:
      return formattedUuid.toLowerCase();
  }
}

export function parseUUID(uuid: string): {
  version: number | null;
  variant: string;
  timestamp?: string;
  clockSequence?: string;
  node?: string;
  isNil: boolean;
  isMax: boolean;
} {
  const validation = validateUUID(uuid);
  
  if (!validation.isValid) {
    return {
      version: null,
      variant: 'invalid',
      isNil: false,
      isMax: false
    };
  }
  
  const standardUuid = formatUUID(uuid, 'standard');
  const isNil = standardUuid === NIL_UUID;
  const isMax = standardUuid === MAX_UUID;
  
  if (isNil || isMax) {
    return {
      version: validation.version,
      variant: isNil ? 'nil' : 'max',
      isNil,
      isMax
    };
  }
  
  // Parse UUID components
  const hex = standardUuid.replace(/-/g, '');
  const versionNibble = parseInt(hex[12], 16);
  const variantBits = parseInt(hex[16], 16);
  
  let variant = 'unknown';
  if ((variantBits & 0x8) === 0) {
    variant = 'NCS backward compatibility';
  } else if ((variantBits & 0xC) === 0x8) {
    variant = 'RFC 4122';
  } else if ((variantBits & 0xE) === 0xC) {
    variant = 'Microsoft GUID';
  } else {
    variant = 'Reserved for future definition';
  }
  
  const result: any = {
    version: versionNibble,
    variant,
    isNil,
    isMax
  };
  
  // For v1 UUIDs, parse timestamp and node information
  if (versionNibble === 1) {
    const timeLow = hex.substring(0, 8);
    const timeMid = hex.substring(8, 12);
    const timeHigh = hex.substring(12, 16);
    const clockSeq = hex.substring(16, 20);
    const node = hex.substring(20, 32);
    
    result.timestamp = `${timeHigh.substring(1)}${timeMid}${timeLow}`;
    result.clockSequence = clockSeq;
    result.node = node;
  }
  
  return result;
}

export function extractTimestamp(uuid: string): Date | null {
  const validation = validateUUID(uuid);
  
  if (!validation.isValid || !validation.version) {
    return null;
  }
  
  const hex = uuid.replace(/-/g, '');
  
  switch (validation.version) {
    case 1:
    case 6: {
      // v1/v6: 60-bit timestamp since 1582-10-15 00:00:00.00 UTC
      const timeLow = hex.substring(0, 8);
      const timeMid = hex.substring(8, 12);
      const timeHi = hex.substring(12, 16);
      const timestamp = parseInt(timeHi.substring(1) + timeMid + timeLow, 16);
      
      // UUID epoch is 1582-10-15, Unix epoch is 1970-01-01
      const uuidEpoch = new Date('1582-10-15T00:00:00.000Z').getTime();
      const unixEpoch = new Date('1970-01-01T00:00:00.000Z').getTime();
      const epochDiff = unixEpoch - uuidEpoch;
      
      // Convert 100-nanosecond intervals to milliseconds
      const milliseconds = Math.floor(timestamp / 10000) - epochDiff;
      return new Date(milliseconds);
    }
    
    case 7: {
      // v7: Unix timestamp in milliseconds
      const timestampHex = hex.substring(0, 12);
      const timestamp = parseInt(timestampHex, 16);
      return new Date(timestamp);
    }
    
    default:
      return null;
  }
}

export function calculateCollisionProbability(count: number, version: UUIDVersion): {
  probability: number;
  description: string;
  recommendation: string;
} {
  let bits: number;
  let description: string;
  
  switch (version) {
    case 'v1':
    case 'v6':
      bits = 74; // 74 bits of randomness (48-bit MAC + 14-bit clock sequence + 12-bit time fraction)
      description = 'Time-based UUIDs with MAC address and clock sequence';
      break;
    case 'v3':
    case 'v5':
      bits = 122; // Deterministic but based on namespace+name hash
      description = 'Name-based UUIDs (deterministic from input)';
      break;
    case 'v4':
      bits = 122; // 122 bits of randomness
      description = 'Random UUIDs with cryptographically secure randomness';
      break;
    case 'v7':
      bits = 74; // 74 bits of randomness (timestamp + random data)
      description = 'Time-based UUIDs with millisecond precision and random data';
      break;
    default:
      bits = 122;
      description = 'Standard random UUIDs';
  }
  
  // Birthday paradox approximation: P ≈ 1 - e^(-n²/2N)
  // where n = number of UUIDs, N = total possible values (2^bits)
  const totalValues = Math.pow(2, bits);
  const probability = 1 - Math.exp(-(count * count) / (2 * totalValues));
  
  let recommendation: string;
  if (probability < 1e-15) {
    recommendation = 'Collision risk is negligible for practical purposes';
  } else if (probability < 1e-9) {
    recommendation = 'Collision risk is extremely low';
  } else if (probability < 1e-6) {
    recommendation = 'Collision risk is very low but consider monitoring';
  } else if (probability < 0.001) {
    recommendation = 'Collision risk is low but worth considering alternative approaches';
  } else {
    recommendation = 'Collision risk is significant - consider using different UUID versions or reducing count';
  }
  
  return { probability, description, recommendation };
}

export function formatUUIDCustom(uuid: string, options: {
  case?: 'upper' | 'lower';
  separator?: string;
  prefix?: string;
  suffix?: string;
  removeSeparators?: boolean;
}): string {
  const validation = validateUUID(uuid);
  
  if (!validation.isValid) {
    return uuid;
  }
  
  let formatted = uuid.trim();
  
  // Handle compact format
  if (validation.format === 'compact') {
    formatted = formatted.replace(
      /^([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})$/,
      '$1-$2-$3-$4-$5'
    );
  }
  
  // Remove separators if requested
  if (options.removeSeparators) {
    formatted = formatted.replace(/-/g, '');
  }
  
  // Change case
  if (options.case === 'upper') {
    formatted = formatted.toUpperCase();
  } else if (options.case === 'lower') {
    formatted = formatted.toLowerCase();
  }
  
  // Change separator
  if (options.separator && !options.removeSeparators) {
    formatted = formatted.replace(/-/g, options.separator);
  }
  
  // Add prefix/suffix
  if (options.prefix) {
    formatted = options.prefix + formatted;
  }
  if (options.suffix) {
    formatted = formatted + options.suffix;
  }
  
  return formatted;
}

export function generateAPIEndpoint(baseUrl: string, version: UUIDVersion, options?: {
  count?: number;
  format?: ExportFormat;
  namespace?: string;
  name?: string;
}): string {
  const url = new URL(`${baseUrl}/api/uuid/${version}`);
  
  if (options?.count && options.count > 1) {
    url.searchParams.set('count', options.count.toString());
  }
  
  if (options?.format && options.format !== 'txt') {
    url.searchParams.set('format', options.format);
  }
  
  if (options?.namespace) {
    url.searchParams.set('namespace', options.namespace);
  }
  
  if (options?.name) {
    url.searchParams.set('name', options.name);
  }
  
  return url.toString();
}

export function generateTestUUIDs(): string[] {
  return [
    generateUUID('v4'),
    generateUUID('v1'),
    generateUUID('v6'),
    generateUUID('v7'),
    NIL_UUID,
    MAX_UUID,
    '550e8400-e29b-41d4-a716-446655440000', // Example v4
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // Example v1
  ];
}