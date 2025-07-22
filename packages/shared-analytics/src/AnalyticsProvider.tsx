import React, { createContext, useContext, useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface AnalyticsContextType {
  trackEvent: (action: string, category: string, label?: string, value?: number) => void;
  trackPageView: (path: string, title?: string) => void;
  trackToolUsage: (toolName: string, action: string, details?: Record<string, any>) => void;
  trackError: (error: string, toolName?: string, fatal?: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  measurementId: string;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  measurementId,
}) => {
  useEffect(() => {
    if (!measurementId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer?.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
  }, [measurementId]);

  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (!window.gtag) return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  };

  const trackPageView = (path: string, title?: string) => {
    if (!window.gtag) return;

    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  };

  const trackToolUsage = (toolName: string, action: string, details?: Record<string, any>) => {
    trackEvent(action, `Tool_${toolName}`, JSON.stringify(details));
  };

  const trackError = (error: string, toolName?: string, fatal: boolean = false) => {
    if (!window.gtag) return;

    window.gtag('event', 'exception', {
      description: error,
      fatal: fatal,
      tool_name: toolName,
    });
  };

  return (
    <AnalyticsContext.Provider
      value={{
        trackEvent,
        trackPageView,
        trackToolUsage,
        trackError,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};