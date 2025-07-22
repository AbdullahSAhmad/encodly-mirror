import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  position: 'header' | 'sidebar' | 'footer' | 'content';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  const adSizes = {
    header: 'h-[90px] md:h-[90px]',
    sidebar: 'h-[250px]',
    footer: 'h-[90px]',
    content: 'h-[280px] md:h-[90px]',
  };

  const adFormats = {
    header: 'auto',
    sidebar: 'auto',
    footer: 'auto',
    content: 'fluid',
  };

  return (
    <div className={`ad-container ${adSizes[position]} flex items-center justify-center bg-gray-100 dark:bg-gray-800 my-4`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={process.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXX'}
        data-ad-slot={`ad-slot-${position}`}
        data-ad-format={adFormats[position]}
        data-full-width-responsive="true"
      />
    </div>
  );
};