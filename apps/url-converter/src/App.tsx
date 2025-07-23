import React from 'react';
import { ThemeProvider } from '@encodly/shared-ui';
import { AnalyticsProvider } from '@encodly/shared-analytics';
import URLConverterPage from './pages/URLConverterPage';

function App() {
  return (
    <ThemeProvider>
      <AnalyticsProvider>
        <URLConverterPage />
      </AnalyticsProvider>
    </ThemeProvider>
  );
}

export default App;