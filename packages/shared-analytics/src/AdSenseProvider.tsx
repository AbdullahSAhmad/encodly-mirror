import React, { createContext, useContext, useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdSenseContextType {
  clientId: string;
  isLoaded: boolean;
}

const AdSenseContext = createContext<AdSenseContextType | null>(null);

interface AdSenseProviderProps {
  children: React.ReactNode;
  clientId: string;
}

export const AdSenseProvider: React.FC<AdSenseProviderProps> = ({ children, clientId }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    if (!clientId || isLoaded) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.crossOrigin = 'anonymous';
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [clientId, isLoaded]);

  return (
    <AdSenseContext.Provider value={{ clientId, isLoaded }}>
      {children}
    </AdSenseContext.Provider>
  );
};

export const useAdSense = () => {
  const context = useContext(AdSenseContext);
  if (!context) {
    throw new Error('useAdSense must be used within an AdSenseProvider');
  }
  return context;
};

interface AdSenseAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  responsive?: boolean;
  className?: string;
}

export const AdSenseAd: React.FC<AdSenseAdProps> = ({
  slot,
  format = 'auto',
  style,
  responsive = true,
  className = '',
}) => {
  const { clientId, isLoaded } = useAdSense();
  const adRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || !adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <div className={`ad-placeholder ${className}`} style={style} />;
  }

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};