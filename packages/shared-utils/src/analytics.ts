declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export class Analytics {
  private static isInitialized = false;

  static initialize(measurementId: string): void {
    if (this.isInitialized || !measurementId) return;

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

    this.isInitialized = true;
  }

  static trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
  ): void {
    if (!window.gtag) return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  static trackPageView(page_path: string, page_title?: string): void {
    if (!window.gtag) return;

    window.gtag('event', 'page_view', {
      page_path,
      page_title,
    });
  }

  static trackToolUsage(
    toolName: string,
    action: string,
    details?: Record<string, any>
  ): void {
    this.trackEvent(action, `Tool_${toolName}`, JSON.stringify(details));
  }

  static trackError(
    error: string,
    toolName?: string,
    fatal: boolean = false
  ): void {
    if (!window.gtag) return;

    window.gtag('event', 'exception', {
      description: error,
      fatal: fatal,
      tool_name: toolName,
    });
  }
}