import React from 'react';
import { ThemeProvider } from '@encodly/shared-ui';
import { AnalyticsProvider, AdSenseProvider } from '@encodly/shared-analytics';
import HashGeneratorPage from './pages/HashGeneratorPage';

function App() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
  const adSenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';

  return (
    <ThemeProvider>
      <AnalyticsProvider measurementId={measurementId}>
        <AdSenseProvider clientId={adSenseClientId}>
          <HashGeneratorPage />
        </AdSenseProvider>
      </AnalyticsProvider>
    </ThemeProvider>
  );
}

export default App;