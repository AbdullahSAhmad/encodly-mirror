import { BlogPost } from '../types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'mastering-json-formatting-best-practices-2025',
    title: 'Mastering JSON Formatting: Best Practices for Developers in 2025',
    description: 'Learn essential JSON formatting techniques, validation strategies, and performance optimization tips to improve your development workflow and data interchange.',
    author: 'Encodly Team',
    publishDate: '2025-01-15',
    lastModified: '2025-01-15',
    readTime: 8,
    tags: ['JSON', 'Web Development', 'Best Practices', 'Data Formats', 'API Development'],
    keywords: ['JSON formatting', 'JSON validator', 'JSON best practices', 'data interchange format', 'JSON performance', 'JSON schema validation', 'JSON tools', 'pretty print JSON'],
    content: `
# Mastering JSON Formatting: Best Practices for Developers in 2025

JSON (JavaScript Object Notation) has become the de facto standard for data interchange in modern web development. Whether you're building APIs, configuring applications, or storing structured data, understanding JSON formatting best practices is crucial for creating maintainable and efficient applications.

## Why JSON Formatting Matters

Proper JSON formatting isn't just about aesthetics—it directly impacts:

- **Readability**: Well-formatted JSON is easier to debug and understand
- **Performance**: Optimized JSON structures reduce parsing time and bandwidth usage
- **Maintainability**: Consistent formatting makes code reviews and collaboration smoother
- **Error Prevention**: Proper formatting helps catch syntax errors early

## Essential JSON Formatting Rules

### 1. Use Consistent Indentation

Always use consistent indentation (2 or 4 spaces) for nested structures:

\`\`\`json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  }
}
\`\`\`

### 2. Quote All Property Names

Unlike JavaScript objects, JSON requires all property names to be quoted:

\`\`\`json
// ✅ Correct
{
  "firstName": "Jane",
  "lastName": "Smith"
}

// ❌ Incorrect
{
  firstName: "Jane",
  lastName: "Smith"
}
\`\`\`

### 3. Use Double Quotes Only

JSON strictly requires double quotes for strings:

\`\`\`json
// ✅ Correct
{
  "message": "Hello, World!"
}

// ❌ Incorrect
{
  'message': 'Hello, World!'
}
\`\`\`

## Advanced Best Practices

### 1. Optimize for Size When Necessary

For production APIs, consider minifying JSON to reduce bandwidth:

\`\`\`json
// Development (formatted)
{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 999.99
    }
  ]
}

// Production (minified)
{"products":[{"id":1,"name":"Laptop","price":999.99}]}
\`\`\`

### 2. Use Meaningful Property Names

Choose descriptive, camelCase property names:

\`\`\`json
// ✅ Good
{
  "userId": 12345,
  "createdAt": "2025-01-15T10:30:00Z",
  "isActive": true
}

// ❌ Avoid
{
  "uid": 12345,
  "dt": "2025-01-15T10:30:00Z",
  "act": true
}
\`\`\`

### 3. Structure Data Logically

Group related properties together:

\`\`\`json
{
  "user": {
    "personalInfo": {
      "firstName": "Alice",
      "lastName": "Johnson",
      "dateOfBirth": "1990-05-15"
    },
    "contactInfo": {
      "email": "alice@example.com",
      "phone": "+1-555-0123"
    },
    "accountSettings": {
      "language": "en",
      "timezone": "UTC-5"
    }
  }
}
\`\`\`

## Common JSON Formatting Mistakes to Avoid

### 1. Trailing Commas

JSON doesn't allow trailing commas:

\`\`\`json
// ❌ Incorrect
{
  "name": "Product",
  "price": 29.99,
}

// ✅ Correct
{
  "name": "Product",
  "price": 29.99
}
\`\`\`

### 2. Comments in JSON

Standard JSON doesn't support comments:

\`\`\`json
// ❌ Incorrect
{
  "apiKey": "abc123", // Production key
  "debug": false
}

// ✅ Use a separate property for documentation
{
  "apiKey": "abc123",
  "apiKeyDescription": "Production API key",
  "debug": false
}
\`\`\`

### 3. Undefined Values

JSON doesn't have an undefined type:

\`\`\`json
// ❌ Incorrect
{
  "name": undefined
}

// ✅ Use null or omit the property
{
  "name": null
}
\`\`\`

## JSON Schema Validation

Implement JSON Schema to ensure data consistency:

\`\`\`json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    }
  },
  "required": ["email"]
}
\`\`\`

## Performance Optimization Tips

### 1. Minimize Nesting Depth

Deep nesting increases parsing complexity:

\`\`\`json
// ❌ Too nested
{
  "data": {
    "user": {
      "profile": {
        "details": {
          "personal": {
            "name": "John"
          }
        }
      }
    }
  }
}

// ✅ Flatter structure
{
  "userData": {
    "name": "John",
    "profileType": "personal"
  }
}
\`\`\`

### 2. Use Arrays for Homogeneous Data

\`\`\`json
// ✅ Efficient for similar items
{
  "products": [
    {"id": 1, "name": "Laptop", "price": 999},
    {"id": 2, "name": "Mouse", "price": 29},
    {"id": 3, "name": "Keyboard", "price": 79}
  ]
}
\`\`\`

### 3. Consider Data Types

Use appropriate data types to minimize size:

\`\`\`json
{
  "isActive": true,        // Boolean (not "true")
  "count": 42,            // Number (not "42")
  "tags": ["api", "json"], // Array for multiple values
  "metadata": null        // Null for absence of value
}
\`\`\`

## Tools for JSON Formatting

### Online Formatters
- **Encodly JSON Formatter**: Fast, privacy-focused formatting with no data storage
- Built-in browser developer tools
- VS Code and other IDE extensions

### Command-Line Tools
\`\`\`bash
# Using jq for formatting
echo '{"name":"test"}' | jq .

# Python one-liner
python -m json.tool < input.json > formatted.json
\`\`\`

### Programmatic Formatting

JavaScript example:
\`\`\`javascript
// Pretty printing
const formatted = JSON.stringify(data, null, 2);

// Minifying
const minified = JSON.stringify(data);

// Custom replacer function
const cleaned = JSON.stringify(data, (key, value) => {
  if (value === null) return undefined;
  return value;
}, 2);
\`\`\`

## Security Considerations

### 1. Validate All Input

Never trust external JSON data:

\`\`\`javascript
try {
  const data = JSON.parse(userInput);
  // Validate structure and content
  if (!isValidSchema(data)) {
    throw new Error('Invalid data structure');
  }
} catch (error) {
  console.error('Invalid JSON:', error);
}
\`\`\`

### 2. Sanitize Before Output

Prevent XSS attacks when displaying JSON:

\`\`\`javascript
// Escape HTML entities
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
\`\`\`

### 3. Limit Parse Depth

Prevent stack overflow attacks:

\`\`\`javascript
// Set maximum depth for nested objects
const MAX_DEPTH = 10;

function parseWithDepthLimit(json, maxDepth = MAX_DEPTH) {
  // Implementation with depth checking
}
\`\`\`

## Conclusion

Mastering JSON formatting is essential for modern web development. By following these best practices, you'll create more maintainable, performant, and secure applications. Remember that good JSON formatting is not just about making data look pretty—it's about creating a solid foundation for data interchange that scales with your application's needs.

Whether you're building APIs, configuring applications, or working with data storage, these JSON formatting principles will help you write better code and avoid common pitfalls. Keep these guidelines handy, and don't forget to use tools like JSON validators and formatters to maintain consistency across your projects.
`
  },
  {
    id: '2',
    slug: 'comprehensive-guide-base64-encoding-web-development',
    title: 'The Complete Guide to Base64 Encoding in Web Development',
    description: 'Discover everything about Base64 encoding: how it works, when to use it, security considerations, and practical implementation examples for modern web applications.',
    author: 'Encodly Team',
    publishDate: '2025-01-16',
    lastModified: '2025-01-16',
    readTime: 10,
    tags: ['Base64', 'Encoding', 'Web Security', 'Data Transmission', 'JavaScript'],
    keywords: ['Base64 encoding', 'Base64 decoder', 'data URI', 'Base64 JavaScript', 'encoding schemes', 'binary to text', 'Base64 security', 'Base64 performance'],
    content: `
# The Complete Guide to Base64 Encoding in Web Development

Base64 encoding is a fundamental technique in web development that converts binary data into ASCII text format. Despite its ubiquity, many developers don't fully understand its mechanics, use cases, and limitations. This comprehensive guide will demystify Base64 encoding and show you how to use it effectively in your projects.

## What is Base64 Encoding?

Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters. It's designed to safely transmit data across systems that may not handle binary data correctly, such as email systems or URLs.

### The Base64 Alphabet

Base64 uses 64 characters:
- Uppercase letters: A-Z (26 characters)
- Lowercase letters: a-z (26 characters)
- Digits: 0-9 (10 characters)
- Special characters: + and / (2 characters)
- Padding character: = (when needed)

## How Base64 Encoding Works

### Step-by-Step Process

1. **Binary Conversion**: Convert input data to binary
2. **Grouping**: Group binary digits into 6-bit chunks
3. **Mapping**: Map each 6-bit value to a Base64 character
4. **Padding**: Add padding if necessary

Example encoding "Hi!":
\`\`\`
Text:     H    i    !
ASCII:    72   105  33
Binary:   01001000 01101001 00100001
6-bit:    010010 000110 100100 100001
Decimal:  18     6      36     33
Base64:   S      G      k      h
Result:   SGkh
\`\`\`

## Common Use Cases in Web Development

### 1. Data URIs for Inline Images

Embed images directly in HTML or CSS:

\`\`\`html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...">
\`\`\`

\`\`\`css
.icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...);
}
\`\`\`

### 2. API Authentication

Many APIs use Base64 for basic authentication:

\`\`\`javascript
const credentials = 'username:password';
const encodedCredentials = btoa(credentials);

fetch('https://api.example.com/data', {
  headers: {
    'Authorization': \`Basic \${encodedCredentials}\`
  }
});
\`\`\`

### 3. Storing Binary Data in JSON

JSON doesn't support binary data, so Base64 is often used:

\`\`\`json
{
  "filename": "document.pdf",
  "contentType": "application/pdf",
  "data": "JVBERi0xLjQKJeLjz9MKMSAwIG9iago..."
}
\`\`\`

### 4. Email Attachments

MIME encoding for email attachments:

\`\`\`
Content-Type: application/pdf
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="report.pdf"

JVBERi0xLjQKJeLjz9MKMSAwIG9iago...
\`\`\`

## Implementation in JavaScript

### Browser APIs

Modern browsers provide built-in Base64 functions:

\`\`\`javascript
// Encoding
const text = 'Hello, World!';
const encoded = btoa(text);
console.log(encoded); // "SGVsbG8sIFdvcmxkIQ=="

// Decoding
const decoded = atob(encoded);
console.log(decoded); // "Hello, World!"
\`\`\`

### Handling Unicode

The native \`btoa()\` function only works with ASCII. For Unicode:

\`\`\`javascript
// Encode Unicode string
function encodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode('0x' + p1)));
}

// Decode Unicode string
function decodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
}

// Example
const emoji = '😊 Hello!';
const encoded = encodeUnicode(emoji);
const decoded = decodeUnicode(encoded);
\`\`\`

### Working with Binary Data

For files and binary data:

\`\`\`javascript
// File to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Base64 to Blob
function base64ToBlob(base64, contentType = '') {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
}
\`\`\`

## Node.js Implementation

Node.js uses Buffer for Base64 operations:

\`\`\`javascript
// Encoding
const text = 'Hello, Node.js!';
const encoded = Buffer.from(text).toString('base64');
console.log(encoded); // "SGVsbG8sIE5vZGUuanMh"

// Decoding
const decoded = Buffer.from(encoded, 'base64').toString('utf8');
console.log(decoded); // "Hello, Node.js!"

// Working with files
const fs = require('fs');

// File to Base64
function encodeFileToBase64(filePath) {
  const bitmap = fs.readFileSync(filePath);
  return Buffer.from(bitmap).toString('base64');
}

// Base64 to file
function decodeBase64ToFile(base64Data, outputPath) {
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(outputPath, buffer);
}
\`\`\`

## Performance Considerations

### Size Overhead

Base64 encoding increases data size by approximately 33%:

\`\`\`javascript
const original = 'Hello World!';
const encoded = btoa(original);

console.log('Original size:', original.length); // 12
console.log('Encoded size:', encoded.length);   // 16
console.log('Overhead:', ((encoded.length / original.length) - 1) * 100 + '%'); // 33.33%
\`\`\`

### Performance Optimization

For large data sets:

\`\`\`javascript
// Chunked encoding for large data
function encodeChunked(data, chunkSize = 1024 * 1024) {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    chunks.push(btoa(chunk));
  }
  return chunks;
}

// Stream-based encoding in Node.js
const { Transform } = require('stream');

class Base64Encoder extends Transform {
  constructor(options) {
    super(options);
    this.extra = '';
  }
  
  _transform(chunk, encoding, callback) {
    const data = this.extra + chunk.toString();
    const remaining = data.length % 3;
    
    if (remaining) {
      this.extra = data.slice(-remaining);
      this.push(Buffer.from(data.slice(0, -remaining)).toString('base64'));
    } else {
      this.extra = '';
      this.push(Buffer.from(data).toString('base64'));
    }
    
    callback();
  }
  
  _flush(callback) {
    if (this.extra) {
      this.push(Buffer.from(this.extra).toString('base64'));
    }
    callback();
  }
}
\`\`\`

## Security Considerations

### Base64 is NOT Encryption

**Important**: Base64 is encoding, not encryption. It provides no security:

\`\`\`javascript
// ❌ WRONG: Don't use for security
const secret = btoa('my-password');

// ✅ RIGHT: Use proper encryption
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  return encrypted;
}
\`\`\`

### Data Validation

Always validate Base64 data:

\`\`\`javascript
function isValidBase64(str) {
  try {
    return btoa(atob(str)) === str;
  } catch(err) {
    return false;
  }
}

// More thorough validation
function validateBase64(str) {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  
  if (!base64Regex.test(str)) {
    return false;
  }
  
  // Check if length is valid
  if (str.length % 4 !== 0) {
    return false;
  }
  
  try {
    atob(str);
    return true;
  } catch(e) {
    return false;
  }
}
\`\`\`

### XSS Prevention

When displaying Base64-decoded content:

\`\`\`javascript
// Sanitize HTML content
function sanitizeHtml(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

// Safe image display
function displayBase64Image(base64Data) {
  const img = document.createElement('img');
  
  // Validate it's an image
  if (!base64Data.startsWith('data:image/')) {
    throw new Error('Invalid image data');
  }
  
  img.src = base64Data;
  img.onerror = () => {
    console.error('Invalid image data');
    img.remove();
  };
  
  return img;
}
\`\`\`

## Best Practices

### 1. Choose the Right Use Case

Use Base64 when:
- Embedding small images in CSS/HTML
- Transmitting binary data through text-only channels
- Storing binary data in text formats (JSON, XML)

Avoid Base64 when:
- Working with large files (use proper file uploads)
- Need actual security (use encryption)
- Performance is critical (use binary formats)

### 2. Implement Proper Error Handling

\`\`\`javascript
class Base64Handler {
  static encode(data) {
    try {
      if (typeof data === 'string') {
        return btoa(data);
      } else if (data instanceof Uint8Array) {
        return btoa(String.fromCharCode.apply(null, data));
      } else {
        throw new TypeError('Invalid data type');
      }
    } catch (error) {
      console.error('Encoding error:', error);
      return null;
    }
  }
  
  static decode(base64) {
    try {
      if (!this.isValid(base64)) {
        throw new Error('Invalid Base64 string');
      }
      return atob(base64);
    } catch (error) {
      console.error('Decoding error:', error);
      return null;
    }
  }
  
  static isValid(str) {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }
}
\`\`\`

### 3. Optimize for Your Use Case

For images:
\`\`\`javascript
// Only use data URIs for small images
const MAX_DATA_URI_SIZE = 10 * 1024; // 10KB

async function optimizeImage(file) {
  if (file.size > MAX_DATA_URI_SIZE) {
    // Use regular URL
    return URL.createObjectURL(file);
  } else {
    // Use data URI
    return await fileToBase64(file);
  }
}
\`\`\`

## Conclusion

Base64 encoding is a powerful tool in the web developer's toolkit, but it's important to understand its proper use cases and limitations. It's perfect for embedding small resources, transmitting binary data through text channels, and working with APIs that require Base64 encoding. However, remember that it increases data size, provides no security, and can impact performance with large files.

By following the best practices and examples in this guide, you'll be able to effectively implement Base64 encoding in your web applications while avoiding common pitfalls. Whether you're working with images, API authentication, or data transmission, understanding Base64 will help you make informed decisions about when and how to use this encoding scheme.

Always remember: Base64 is for encoding, not encryption. Use it wisely, and your applications will benefit from its convenience while maintaining security and performance.
`
  },
  {
    id: '3',
    slug: 'jwt-security-best-practices-modern-web-apps',
    title: 'JWT Security Best Practices: A Complete Guide for Modern Web Applications',
    description: 'Master JWT implementation with this comprehensive security guide. Learn token structure, authentication patterns, common vulnerabilities, and how to build secure token-based authentication systems.',
    author: 'Encodly Team',
    publishDate: '2025-01-17',
    lastModified: '2025-01-17',
    readTime: 12,
    tags: ['JWT', 'Security', 'Authentication', 'Web Security', 'API Security'],
    keywords: ['JWT security', 'JSON Web Tokens', 'JWT best practices', 'token authentication', 'JWT vulnerabilities', 'secure authentication', 'JWT implementation', 'OAuth JWT'],
    content: `
# JWT Security Best Practices: A Complete Guide for Modern Web Applications

JSON Web Tokens (JWT) have become the standard for stateless authentication in modern web applications. While JWTs offer flexibility and scalability, they also come with security considerations that developers must understand. This comprehensive guide covers everything you need to know about implementing JWT securely in your applications.

## Understanding JWT Structure

A JWT consists of three parts separated by dots:

\`\`\`
header.payload.signature
\`\`\`

### 1. Header

Contains metadata about the token:

\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

### 2. Payload

Contains claims (user data and metadata):

\`\`\`json
{
  "sub": "1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "iat": 1516239022,
  "exp": 1516242622
}
\`\`\`

### 3. Signature

Ensures token integrity:

\`\`\`
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
\`\`\`

## JWT Implementation Guide

### Generating Secure JWTs

Node.js implementation using jsonwebtoken:

\`\`\`javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class JWTManager {
  constructor() {
    // Generate a strong secret key
    this.secret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
    this.issuer = 'your-app-name';
    this.audience = 'your-app-users';
  }

  generateToken(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      // Custom claims
      permissions: user.permissions
    };

    const options = {
      expiresIn: '15m', // Short-lived access token
      issuer: this.issuer,
      audience: this.audience,
      algorithm: 'HS256'
    };

    return jwt.sign(payload, this.secret, options);
  }

  generateRefreshToken(user) {
    const payload = {
      sub: user.id,
      tokenType: 'refresh'
    };

    const options = {
      expiresIn: '7d', // Longer-lived refresh token
      issuer: this.issuer,
      audience: this.audience
    };

    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret, {
        issuer: this.issuer,
        audience: this.audience,
        algorithms: ['HS256']
      });
    } catch (error) {
      throw new Error('Invalid token: ' + error.message);
    }
  }
}
\`\`\`

### Frontend Implementation

Secure token handling in the browser:

\`\`\`javascript
class TokenManager {
  constructor() {
    this.tokenKey = 'access_token';
    this.refreshKey = 'refresh_token';
  }

  // Store tokens securely
  setTokens(accessToken, refreshToken) {
    // Store in memory for maximum security
    this.accessToken = accessToken;
    
    // Store refresh token in httpOnly cookie (set by server)
    // or in localStorage with caution
    if (refreshToken) {
      localStorage.setItem(this.refreshKey, refreshToken);
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshKey);
  }

  clearTokens() {
    this.accessToken = null;
    localStorage.removeItem(this.refreshKey);
  }

  // Decode token without verification (client-side only)
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }
}
\`\`\`

### API Request Interceptor

Automatically attach tokens to requests:

\`\`\`javascript
class APIClient {
  constructor(baseURL, tokenManager) {
    this.baseURL = baseURL;
    this.tokenManager = tokenManager;
  }

  async request(endpoint, options = {}) {
    const token = this.tokenManager.getAccessToken();
    
    // Check token expiration
    if (token && this.tokenManager.isTokenExpired(token)) {
      await this.refreshAccessToken();
    }

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    // Add authorization header
    if (token) {
      config.headers['Authorization'] = \`Bearer \${token}\`;
    }

    try {
      const response = await fetch(\`\${this.baseURL}\${endpoint}\`, config);
      
      if (response.status === 401) {
        // Token might be invalid, try refreshing
        await this.refreshAccessToken();
        // Retry request with new token
        config.headers['Authorization'] = \`Bearer \${this.tokenManager.getAccessToken()}\`;
        return fetch(\`\${this.baseURL}\${endpoint}\`, config);
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async refreshAccessToken() {
    const refreshToken = this.tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(\`\${this.baseURL}/auth/refresh\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      this.tokenManager.clearTokens();
      throw new Error('Failed to refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await response.json();
    this.tokenManager.setTokens(accessToken, newRefreshToken);
  }
}
\`\`\`

## Security Best Practices

### 1. Use Strong Secret Keys

\`\`\`javascript
// ❌ Weak secret
const secret = 'my-secret';

// ✅ Strong secret
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

// For RS256 (recommended for production)
const { generateKeyPairSync } = require('crypto');
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});
\`\`\`

### 2. Implement Proper Token Expiration

\`\`\`javascript
const tokenConfig = {
  access: {
    expiresIn: '15m', // Short-lived
    algorithm: 'RS256'
  },
  refresh: {
    expiresIn: '7d', // Longer-lived
    algorithm: 'RS256'
  },
  passwordReset: {
    expiresIn: '1h', // Very short-lived
    algorithm: 'RS256'
  }
};

// Include issued at (iat) and not before (nbf) claims
function generateSecureToken(payload, type = 'access') {
  const now = Math.floor(Date.now() / 1000);
  
  return jwt.sign({
    ...payload,
    iat: now,
    nbf: now,
    jti: crypto.randomUUID() // Unique token ID
  }, privateKey, tokenConfig[type]);
}
\`\`\`

### 3. Validate All Claims

\`\`\`javascript
function validateToken(token) {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'your-app',
      audience: 'your-app-users',
      clockTolerance: 30 // 30 seconds clock skew tolerance
    });

    // Additional custom validations
    if (!decoded.sub || !decoded.email) {
      throw new Error('Missing required claims');
    }

    // Check token type
    if (decoded.tokenType && decoded.tokenType !== 'access') {
      throw new Error('Invalid token type');
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(decoded.jti)) {
      throw new Error('Token has been revoked');
    }

    return decoded;
  } catch (error) {
    throw new Error('Token validation failed: ' + error.message);
  }
}
\`\`\`

### 4. Secure Token Storage

\`\`\`javascript
// Server-side: Set secure cookies
function setSecureCookie(res, name, value) {
  res.cookie(name, value, {
    httpOnly: true, // Prevent XSS
    secure: true, // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

// Client-side: Secure storage strategy
class SecureTokenStorage {
  constructor() {
    // Store access token in memory only
    this.accessToken = null;
    
    // Use sessionStorage for temporary storage
    this.useSessionStorage = true;
  }

  storeTokens(access, refresh) {
    // Access token in memory only
    this.accessToken = access;
    
    // Refresh token in httpOnly cookie (set by server)
    // Never store sensitive tokens in localStorage
  }

  getAccessToken() {
    // Return from memory
    return this.accessToken;
  }

  clearAll() {
    this.accessToken = null;
    // Request server to clear httpOnly cookies
  }
}
\`\`\`

### 5. Implement Token Rotation

\`\`\`javascript
class TokenRotation {
  async rotateTokens(oldRefreshToken) {
    // Verify old refresh token
    const decoded = await this.verifyRefreshToken(oldRefreshToken);
    
    // Check if token has been used before (replay attack)
    if (await this.isTokenUsed(decoded.jti)) {
      // Potential security breach - invalidate all tokens for user
      await this.invalidateUserTokens(decoded.sub);
      throw new Error('Token replay detected');
    }

    // Mark token as used
    await this.markTokenUsed(decoded.jti);
    
    // Generate new token pair
    const newAccess = this.generateAccessToken(decoded.sub);
    const newRefresh = this.generateRefreshToken(decoded.sub);
    
    return { accessToken: newAccess, refreshToken: newRefresh };
  }
}
\`\`\`

## Common JWT Vulnerabilities and Mitigations

### 1. Algorithm Confusion Attack

\`\`\`javascript
// ❌ Vulnerable
jwt.verify(token, secret); // Accepts any algorithm

// ✅ Secure
jwt.verify(token, secret, { algorithms: ['HS256'] }); // Whitelist algorithms
\`\`\`

### 2. Weak Secret Keys

\`\`\`javascript
// ❌ Vulnerable
const secret = 'secret123';

// ✅ Secure
const secret = process.env.JWT_SECRET; // Min 256 bits
if (!secret || secret.length < 32) {
  throw new Error('JWT secret must be at least 256 bits');
}
\`\`\`

### 3. Token Sidejacking

\`\`\`javascript
// Implement token binding
function generateBoundToken(user, fingerprint) {
  const hash = crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex');

  return jwt.sign({
    sub: user.id,
    tokenBinding: hash
  }, secret);
}

// Verify binding on each request
function verifyBoundToken(token, fingerprint) {
  const decoded = jwt.verify(token, secret);
  const hash = crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex');

  if (decoded.tokenBinding !== hash) {
    throw new Error('Token binding mismatch');
  }

  return decoded;
}
\`\`\`

### 4. Information Disclosure

\`\`\`javascript
// ❌ Don't include sensitive data
const token = jwt.sign({
  userId: user.id,
  password: user.password, // Never!
  ssn: user.ssn, // Never!
  creditCard: user.creditCard // Never!
}, secret);

// ✅ Include only necessary claims
const token = jwt.sign({
  sub: user.id,
  email: user.email,
  role: user.role
}, secret);
\`\`\`

## Advanced Security Patterns

### 1. Token Revocation with Redis

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

class TokenRevocation {
  async revokeToken(token) {
    const decoded = jwt.decode(token);
    const expiry = decoded.exp - Math.floor(Date.now() / 1000);
    
    // Add to blacklist with TTL
    await client.setex(\`blacklist:\${decoded.jti}\`, expiry, 'revoked');
  }

  async isRevoked(tokenId) {
    const result = await client.get(\`blacklist:\${tokenId}\`);
    return result === 'revoked';
  }

  async revokeAllUserTokens(userId) {
    // Increment user's token version
    await client.incr(\`token_version:\${userId}\`);
  }

  async validateTokenVersion(token) {
    const decoded = jwt.decode(token);
    const currentVersion = await client.get(\`token_version:\${decoded.sub}\`) || 0;
    
    if (decoded.version < currentVersion) {
      throw new Error('Token version outdated');
    }
  }
}
\`\`\`

### 2. Rate Limiting Token Generation

\`\`\`javascript
class TokenRateLimit {
  constructor(maxTokensPerHour = 10) {
    this.maxTokensPerHour = maxTokensPerHour;
  }

  async checkRateLimit(userId) {
    const key = \`token_rate:\${userId}\`;
    const current = await client.incr(key);
    
    if (current === 1) {
      await client.expire(key, 3600); // 1 hour
    }
    
    if (current > this.maxTokensPerHour) {
      throw new Error('Token generation rate limit exceeded');
    }
  }

  async generateWithRateLimit(user) {
    await this.checkRateLimit(user.id);
    return this.generateToken(user);
  }
}
\`\`\`

### 3. Secure Token Exchange

\`\`\`javascript
// Implement PKCE for token exchange
class PKCETokenExchange {
  generateCodeVerifier() {
    return crypto.randomBytes(32).toString('base64url');
  }

  generateCodeChallenge(verifier) {
    return crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');
  }

  async exchangeCodeForToken(code, verifier) {
    // Verify code challenge
    const storedChallenge = await this.getStoredChallenge(code);
    const calculatedChallenge = this.generateCodeChallenge(verifier);
    
    if (storedChallenge !== calculatedChallenge) {
      throw new Error('Invalid code verifier');
    }

    // Generate tokens
    return this.generateTokenPair(code);
  }
}
\`\`\`

## Monitoring and Auditing

### Token Usage Analytics

\`\`\`javascript
class TokenAuditor {
  async logTokenUsage(token, request) {
    const decoded = jwt.decode(token);
    
    await this.log({
      tokenId: decoded.jti,
      userId: decoded.sub,
      action: request.method + ' ' + request.path,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      timestamp: new Date()
    });
  }

  async detectAnomalies(userId) {
    const logs = await this.getUserLogs(userId);
    
    // Detect suspicious patterns
    const anomalies = [];
    
    // Multiple IPs in short time
    const ips = [...new Set(logs.map(l => l.ip))];
    if (ips.length > 5) {
      anomalies.push('Multiple IP addresses detected');
    }

    // Impossible travel
    const locations = await this.getLocationsFromIPs(ips);
    if (this.detectImpossibleTravel(locations, logs)) {
      anomalies.push('Impossible travel detected');
    }

    return anomalies;
  }
}
\`\`\`

## Testing JWT Implementation

\`\`\`javascript
// Unit tests for JWT handling
describe('JWT Security Tests', () => {
  test('should reject expired tokens', () => {
    const token = jwt.sign({ sub: '123' }, secret, { expiresIn: '-1h' });
    expect(() => validateToken(token)).toThrow('jwt expired');
  });

  test('should reject tokens with invalid signature', () => {
    const token = jwt.sign({ sub: '123' }, 'wrong-secret');
    expect(() => validateToken(token)).toThrow('invalid signature');
  });

  test('should reject tokens with none algorithm', () => {
    const token = jwt.sign({ sub: '123' }, '', { algorithm: 'none' });
    expect(() => validateToken(token)).toThrow('Invalid algorithm');
  });

  test('should handle token rotation correctly', async () => {
    const refresh = generateRefreshToken(user);
    const { accessToken, refreshToken } = await rotateTokens(refresh);
    
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(refreshToken).not.toBe(refresh);
  });
});
\`\`\`

## Conclusion

JWT security is not just about generating and verifying tokens—it's about implementing a comprehensive security strategy that covers token generation, storage, transmission, validation, and revocation. By following these best practices, you can build secure, scalable authentication systems that protect your users and your application.

Remember these key principles:
- Never store sensitive data in JWTs
- Always use strong secrets and proper algorithms
- Implement short expiration times with refresh token rotation
- Validate all claims and implement proper revocation
- Monitor token usage for anomalies
- Keep tokens out of client-side storage when possible

Security is an ongoing process. Stay updated with the latest vulnerabilities and best practices, regularly audit your implementation, and always prioritize your users' security over convenience.
`
  }
];