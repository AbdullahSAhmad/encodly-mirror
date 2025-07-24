import { v1 as uuidv1, v4 as uuidv4, validate, version } from 'uuid';

export type UUIDVersion = 'v1' | 'v4';

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
  }
];

export const NIL_UUID = '00000000-0000-0000-0000-000000000000';
export const MAX_UUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

export function generateUUID(version: UUIDVersion): string {
  switch (version) {
    case 'v1':
      return uuidv1();
    case 'v4':
      return uuidv4();
    default:
      return uuidv4();
  }
}

export function generateBulkUUIDs(version: UUIDVersion, count: number): string[] {
  const uuids: string[] = [];
  
  for (let i = 0; i < count; i++) {
    uuids.push(generateUUID(version));
  }
  
  return uuids;
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
  
  const trimmedUuid = uuid.trim();
  
  // Check if it's a valid UUID format
  const isValid = validate(trimmedUuid);
  
  if (!isValid) {
    // Check if it might be a compact format (without hyphens)
    if (/^[0-9a-fA-F]{32}$/.test(trimmedUuid)) {
      const formatted = trimmedUuid.replace(
        /^([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})$/,
        '$1-$2-$3-$4-$5'
      );
      
      if (validate(formatted)) {
        return {
          isValid: true,
          version: version(formatted),
          format: 'compact',
          errors: []
        };
      }
    }
    
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
    version: version(trimmedUuid),
    format: 'standard',
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

export function generateTestUUIDs(): string[] {
  return [
    generateUUID('v4'),
    generateUUID('v1'),
    NIL_UUID,
    MAX_UUID,
    '550e8400-e29b-41d4-a716-446655440000', // Example v4
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // Example v1
  ];
}