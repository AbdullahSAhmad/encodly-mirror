// Get the base URL for the current environment
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return import.meta.env.VITE_BASE_URL || 'https://encodly.com';
};

// Get tool URLs based on environment
export const getToolUrls = () => {
  const isDev = import.meta.env.DEV;
  
  if (isDev) {
    return {
      json: 'http://localhost:3001',
      base64: 'http://localhost:3003',
      main: 'http://localhost:3000'
    };
  }
  
  return {
    json: 'https://json.encodly.com',
    base64: 'https://base64.encodly.com',
    main: 'https://encodly.com'
  };
};

// Get page URLs for internal navigation
export const getPageUrl = (path: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
};