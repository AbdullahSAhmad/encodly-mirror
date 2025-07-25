export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  feedback: string[];
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';
const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;.<>';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  
  if (options.includeUppercase) charset += UPPERCASE;
  if (options.includeLowercase) charset += LOWERCASE;
  if (options.includeNumbers) charset += NUMBERS;
  if (options.includeSymbols) charset += SYMBOLS;
  
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }
  
  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !AMBIGUOUS_CHARS.includes(char)).join('');
  }
  
  if (!charset) return '';
  
  let password = '';
  
  // Ensure at least one character from each selected set
  const requiredChars: string[] = [];
  if (options.includeUppercase) {
    let chars = UPPERCASE;
    if (options.excludeSimilar) chars = chars.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
    if (options.excludeAmbiguous) chars = chars.split('').filter(c => !AMBIGUOUS_CHARS.includes(c)).join('');
    if (chars) requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  if (options.includeLowercase) {
    let chars = LOWERCASE;
    if (options.excludeSimilar) chars = chars.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
    if (options.excludeAmbiguous) chars = chars.split('').filter(c => !AMBIGUOUS_CHARS.includes(c)).join('');
    if (chars) requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  if (options.includeNumbers) {
    let chars = NUMBERS;
    if (options.excludeSimilar) chars = chars.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
    if (options.excludeAmbiguous) chars = chars.split('').filter(c => !AMBIGUOUS_CHARS.includes(c)).join('');
    if (chars) requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  if (options.includeSymbols) {
    let chars = SYMBOLS;
    if (options.excludeSimilar) chars = chars.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
    if (options.excludeAmbiguous) chars = chars.split('').filter(c => !AMBIGUOUS_CHARS.includes(c)).join('');
    if (chars) requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  
  // Add required characters first
  for (const char of requiredChars) {
    password += char;
  }
  
  // Fill remaining length with random characters
  for (let i = password.length; i < options.length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password to randomize required character positions
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export function generateMultiplePasswords(options: PasswordOptions, count: number): string[] {
  const passwords: string[] = [];
  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options));
  }
  return passwords;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'No Password',
      color: 'bg-gray-200',
      feedback: ['Enter a password to see strength analysis']
    };
  }
  
  let score = 0;
  const feedback: string[] = [];
  
  // Length scoring
  if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
    feedback.push('Consider using at least 12 characters for better security');
  } else {
    score += 5;
    feedback.push('Password is too short. Use at least 8 characters');
  }
  
  // Character variety scoring
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  
  const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;
  score += varietyCount * 15;
  
  if (varietyCount < 3) {
    feedback.push('Include uppercase, lowercase, numbers, and symbols');
  }
  
  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push('Avoid repeating characters');
  }
  
  if (/123|abc|qwe|password|admin/i.test(password)) {
    score -= 20;
    feedback.push('Avoid common patterns and dictionary words');
  }
  
  // Bonus for length
  if (password.length >= 16) {
    score += 10;
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));
  
  // Determine strength label and color
  let label: string;
  let color: string;
  
  if (score >= 80) {
    label = 'Very Strong';
    color = 'bg-green-500';
    if (feedback.length === 0) {
      feedback.push('Excellent! Your password is very strong');
    }
  } else if (score >= 60) {
    label = 'Strong';
    color = 'bg-green-400';
  } else if (score >= 40) {
    label = 'Fair';
    color = 'bg-yellow-500';
  } else if (score >= 20) {
    label = 'Weak';
    color = 'bg-orange-500';
  } else {
    label = 'Very Weak';
    color = 'bg-red-500';
  }
  
  return { score, label, color, feedback };
}

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
};