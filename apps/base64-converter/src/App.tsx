import React from 'react';
import { ThemeProvider } from '@encodly/shared-ui';
import { AnalyticsProvider, AdSenseProvider } from '@encodly/shared-analytics';
import { Base64ConverterPage } from './pages/Base64ConverterPage';

function App() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
  const adSenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';

  return (
    <ThemeProvider>
      <AnalyticsProvider measurementId={measurementId}>
        <AdSenseProvider clientId={adSenseClientId}>
          <Base64ConverterPage />
        </AdSenseProvider>
      </AnalyticsProvider>
    </ThemeProvider>
  );
}

export default App;