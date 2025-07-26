// Get the base URL for the current environment
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.VITE_BASE_URL || 'https://encodly.com';
};

// Get tool URLs based on environment
export const getToolUrls = () => {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    return {
      json: 'http://localhost:5001',
      base64: 'http://localhost:5003',
      url: 'http://localhost:5004',
      jwt: 'http://localhost:5005',
      jwtEncoder: 'http://localhost:5006',
      hash: 'http://localhost:5007',
      uuid: 'http://localhost:5008',
      calc: 'http://localhost:5002',
      password: 'http://localhost:5009',
      markdown: 'http://localhost:5010',
      qr: 'http://localhost:5011',
      regex: 'http://localhost:5012',
      main: 'http://localhost:5000'
    };
  }
  
  return {
    json: 'https://json.encodly.com',
    base64: 'https://base64.encodly.com',
    url: 'https://url.encodly.com',
    jwt: 'https://jwt-decoder.encodly.com',
    jwtEncoder: 'https://jwt-encoder.encodly.com',
    hash: 'https://hash.encodly.com',
    uuid: 'https://uuid.encodly.com',
    calc: 'https://calc.encodly.com',
    password: 'https://password.encodly.com',
    markdown: 'https://markdown.encodly.com',
    qr: 'https://qr.encodly.com',
    regex: 'https://regex.encodly.com',
    main: 'https://encodly.com'
  };
};

// Get page URLs for internal navigation
export const getPageUrl = (path: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
};

// Get domain for email addresses
export const getDomain = () => {
  const mainUrl = getToolUrls().main;
  return new URL(mainUrl).hostname;
};