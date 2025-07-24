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
      main: 'http://localhost:5000'
    };
  }
  
  return {
    json: 'https://json.encodly.com',
    base64: 'https://base64.encodly.com',
    url: 'https://url.encodly.com',
    jwt: 'https://jwt-decoder.encodly.com',
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