import React from 'react';
import { ThemeProvider } from '@encodly/shared-ui';
import { AnalyticsProvider } from '@encodly/shared-analytics';
import HashGeneratorPage from './pages/HashGeneratorPage';

function App() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

  return (
    <ThemeProvider>
      <AnalyticsProvider measurementId={measurementId}>
        <HashGeneratorPage />
      </AnalyticsProvider>
    </ThemeProvider>
  );
}

export default App;