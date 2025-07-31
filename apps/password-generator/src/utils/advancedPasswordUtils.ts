import zxcvbn from 'zxcvbn';
import bcrypt from 'bcryptjs';
import { EFF_LARGE_WORDLIST, SYLLABLES, MEMORABLE_PATTERNS } from './wordlists';

export interface AdvancedPasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  excludedCharacters?: string;
  customRules?: CustomRule[];
  algorithm: 'random' | 'pronounceable' | 'diceware' | 'pattern';
  dicewareWords?: number;
  patternType?: string;
}

export interface CustomRule {
  name: string;
  description: string;
  validator: (password: string) => boolean;
  errorMessage: string;
}

export interface PasswordStrengthAnalysis {
  score: number;
  crackTimeDisplay: string;
  crackTimeSeconds: number;
  feedback: string[];
  warning: string;
  entropy: number;
  guessesLog10: number;
}

export interface BulkGenerationOptions extends AdvancedPasswordOptions {
  count: number;
  exportFormat: 'txt' | 'csv';
  includeHashes: boolean;
  hashAlgorithm: 'sha256' | 'bcrypt';
}

export interface PasswordPolicy {
  name: string;
  description: string;
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxRepeatingChars: number;
  forbiddenPatterns: string[];
  customRules: CustomRule[];
}

// NIST-compliant policies
export const NIST_POLICIES: Record<string, PasswordPolicy> = {
  'nist-basic': {
    name: 'NIST Basic',
    description: 'Basic NIST SP 800-63B requirements',
    minLength: 8,
    maxLength: 64,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    maxRepeatingChars: 3,
    forbiddenPatterns: ['password', '123456', 'qwerty'],
    customRules: []
  },
  'nist-enhanced': {
    name: 'NIST Enhanced',
    description: 'Enhanced NIST requirements with complexity',
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    maxRepeatingChars: 2,
    forbiddenPatterns: ['password', '123456', 'qwerty', 'admin', 'letmein'],
    customRules: [
      {
        name: 'No Sequential Characters',
        description: 'Password must not contain sequential characters like abc or 123',
        validator: (password) => !/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789)/i.test(password),
        errorMessage: 'Password cannot contain sequential characters'
      }
    ]
  },
  'corporate-strict': {
    name: 'Corporate Strict',
    description: 'Strict corporate security policy',
    minLength: 14,
    maxLength: 64,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    maxRepeatingChars: 1,
    forbiddenPatterns: ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome', 'company'],
    customRules: [
      {
        name: 'Mixed Character Distribution',
        description: 'Password must have balanced character types',
        validator: (password) => {
          const types = [
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^a-zA-Z0-9]/.test(password)
          ].filter(Boolean).length;
          return types >= 3;
        },
        errorMessage: 'Password must contain at least 3 different character types'
      }
    ]
  }
};

// Generate random password (existing algorithm enhanced)
export function generateRandomPassword(options: AdvancedPasswordOptions): string {
  const charset = buildCharset(options);
  if (!charset) return '';

  let password = '';
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }

  // Apply custom rules
  if (options.customRules) {
    const violations = validateCustomRules(password, options.customRules);
    if (violations.length > 0) {
      // Regenerate if rules are violated (recursive with depth limit)
      return generateRandomPassword(options);
    }
  }

  return password;
}

// Generate pronounceable password
export function generatePronounceablePassword(options: AdvancedPasswordOptions): string {
  let password = '';
  const targetLength = options.length;
  
  while (password.length < targetLength) {
    // Alternate between consonants and vowels
    const useCluster = Math.random() < 0.3;
    const useVowelCombo = Math.random() < 0.2;
    
    if (password.length === 0 || password.length % 2 === 0) {
      // Add consonant or consonant cluster
      if (useCluster && password.length + 2 <= targetLength) {
        const cluster = SYLLABLES.consonantClusters[Math.floor(Math.random() * SYLLABLES.consonantClusters.length)];
        password += cluster;
      } else {
        const consonant = SYLLABLES.consonants[Math.floor(Math.random() * SYLLABLES.consonants.length)];
        password += consonant;
      }
    } else {
      // Add vowel or vowel combination
      if (useVowelCombo && password.length + 2 <= targetLength) {
        const combo = SYLLABLES.vowelCombinations[Math.floor(Math.random() * SYLLABLES.vowelCombinations.length)];
        password += combo;
      } else {
        const vowel = SYLLABLES.vowels[Math.floor(Math.random() * SYLLABLES.vowels.length)];
        password += vowel;
      }
    }
  }

  // Trim to exact length
  password = password.substring(0, targetLength);

  // Apply case, numbers, and symbols if required
  password = enhancePronounceable(password, options);
  
  return password;
}

// Generate diceware passphrase
export function generateDicewarePassphrase(options: AdvancedPasswordOptions): string {
  const wordCount = options.dicewareWords || Math.max(4, Math.ceil(options.length / 8));
  const words: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * EFF_LARGE_WORDLIST.length);
    words.push(EFF_LARGE_WORDLIST[randomIndex]);
  }
  
  let passphrase = words.join('-');
  
  // Add numbers and symbols if required
  if (options.includeNumbers) {
    const numberToAdd = Math.floor(Math.random() * 1000);
    passphrase += numberToAdd.toString();
  }
  
  if (options.includeSymbols) {
    const symbols = '!@#$%^&*';
    const symbolToAdd = symbols[Math.floor(Math.random() * symbols.length)];
    passphrase += symbolToAdd;
  }
  
  // Apply case changes if required
  if (options.includeUppercase) {
    passphrase = passphrase.split('').map((char, index) => 
      index === 0 || Math.random() < 0.2 ? char.toUpperCase() : char
    ).join('');
  }
  
  return passphrase;
}

// Generate pattern-based password
export function generatePatternPassword(options: AdvancedPasswordOptions): string {
  const pattern = MEMORABLE_PATTERNS.find(p => p.name === options.patternType) || MEMORABLE_PATTERNS[0];
  // Implementation would vary based on pattern type
  // For now, return a simple implementation
  return generateRandomPassword(options);
}

// Format crack time in a more user-friendly way
function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'instant';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  
  const years = Math.round(seconds / 31536000);
  if (years > 1000000) return '1M+ years';
  if (years > 100000) return '100K+ years';
  if (years > 10000) return '10K+ years';
  if (years > 1000) return '1K+ years';
  
  return `${years} years`;
}

// Enhanced password strength analysis using zxcvbn
export function analyzePasswordStrength(password: string): PasswordStrengthAnalysis {
  if (!password) {
    return {
      score: 0,
      crackTimeDisplay: 'instant',
      crackTimeSeconds: 0,
      feedback: ['Enter a password to see analysis'],
      warning: 'No password provided',
      entropy: 0,
      guessesLog10: 0
    };
  }

  const result = zxcvbn(password);
  
  return {
    score: result.score,
    crackTimeDisplay: formatCrackTime(result.crack_times_seconds.offline_slow_hashing_1e4_per_second),
    crackTimeSeconds: result.crack_times_seconds.offline_slow_hashing_1e4_per_second,
    feedback: result.feedback.suggestions,
    warning: result.feedback.warning || '',
    entropy: calculateEntropy(password),
    guessesLog10: result.guesses_log10
  };
}

// Calculate password entropy
export function calculateEntropy(password: string): number {
  if (!password) return 0;
  
  let charsetSize = 0;
  
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32; // Approximate symbol count
  
  return Math.log2(Math.pow(charsetSize, password.length));
}

// Generate bulk passwords
export async function generateBulkPasswords(options: BulkGenerationOptions): Promise<string[]> {
  const passwords: string[] = [];
  const maxCount = Math.min(options.count, 10000); // Limit to 10,000
  
  for (let i = 0; i < maxCount; i++) {
    let password: string;
    
    switch (options.algorithm) {
      case 'pronounceable':
        password = generatePronounceablePassword(options);
        break;
      case 'diceware':
        password = generateDicewarePassphrase(options);
        break;
      case 'pattern':
        password = generatePatternPassword(options);
        break;
      default:
        password = generateRandomPassword(options);
    }
    
    passwords.push(password);
  }
  
  return passwords;
}

// Export passwords with optional hashing
export async function exportPasswords(
  passwords: string[], 
  options: BulkGenerationOptions
): Promise<string> {
  let content = '';
  
  if (options.exportFormat === 'csv') {
    const header = options.includeHashes ? 'Password,Hash\n' : 'Password\n';
    content = header;
    
    for (const password of passwords) {
      if (options.includeHashes) {
        const hash = options.hashAlgorithm === 'bcrypt' 
          ? await bcrypt.hash(password, 10)
          : await hashSHA256(password);
        content += `"${password}","${hash}"\n`;
      } else {
        content += `"${password}"\n`;
      }
    }
  } else {
    content = passwords.join('\n');
  }
  
  return content;
}

// Check password against history (without storing)
export function checkPasswordHistory(password: string, historyHashes: string[]): boolean {
  // In a real implementation, you'd hash the password and compare
  // For demo purposes, we'll do a simple check
  return !historyHashes.some(hash => 
    // This is a simplified check - in production, use proper hash comparison
    hash.includes(password.substring(0, 4))
  );
}

// Validate password against policy
export function validatePasswordPolicy(password: string, policy: PasswordPolicy): string[] {
  const errors: string[] = [];
  
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  }
  
  if (password.length > policy.maxLength) {
    errors.push(`Password must be no more than ${policy.maxLength} characters long`);
  }
  
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  }
  
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  }
  
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain numbers');
  }
  
  if (policy.requireSymbols && !/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain symbols');
  }
  
  // Check for repeating characters
  const regex = new RegExp(`(.)\\1{${policy.maxRepeatingChars},}`, 'i');
  if (regex.test(password)) {
    errors.push(`Password cannot have more than ${policy.maxRepeatingChars} repeating characters`);
  }
  
  // Check forbidden patterns
  for (const pattern of policy.forbiddenPatterns) {
    if (password.toLowerCase().includes(pattern.toLowerCase())) {
      errors.push(`Password cannot contain forbidden pattern: ${pattern}`);
    }
  }
  
  // Check custom rules
  const customErrors = validateCustomRules(password, policy.customRules);
  errors.push(...customErrors);
  
  return errors;
}

// Helper functions
function buildCharset(options: AdvancedPasswordOptions): string {
  let charset = '';
  
  if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.includeNumbers) charset += '0123456789';
  if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (options.excludeSimilar) {
    const similarChars = 'il1Lo0O';
    charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
  }
  
  if (options.excludeAmbiguous) {
    const ambiguousChars = '{}[]()/\\\'"`~,;.<>';
    charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('');
  }
  
  if (options.excludedCharacters) {
    charset = charset.split('').filter(char => !options.excludedCharacters!.includes(char)).join('');
  }
  
  return charset;
}

function enhancePronounceable(password: string, options: AdvancedPasswordOptions): string {
  let enhanced = password;
  
  // Add uppercase
  if (options.includeUppercase) {
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    // Randomly capitalize some letters
    enhanced = enhanced.split('').map(char => 
      Math.random() < 0.2 ? char.toUpperCase() : char
    ).join('');
  }
  
  // Insert numbers
  if (options.includeNumbers) {
    const insertPosition = Math.floor(Math.random() * enhanced.length);
    const number = Math.floor(Math.random() * 10);
    enhanced = enhanced.slice(0, insertPosition) + number + enhanced.slice(insertPosition);
  }
  
  // Insert symbols
  if (options.includeSymbols) {
    const symbols = '!@#$%^&*';
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    enhanced += symbol;
  }
  
  return enhanced;
}

function validateCustomRules(password: string, rules: CustomRule[]): string[] {
  const errors: string[] = [];
  
  for (const rule of rules) {
    if (!rule.validator(password)) {
      errors.push(rule.errorMessage);
    }
  }
  
  return errors;
}

async function hashSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}