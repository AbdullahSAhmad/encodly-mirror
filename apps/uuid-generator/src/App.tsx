import { ThemeProvider } from '@encodly/shared-ui';
import { AnalyticsProvider } from '@encodly/shared-analytics';
import UUIDGeneratorPage from './pages/UUIDGeneratorPage';

function App() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

  return (
    <ThemeProvider>
      <AnalyticsProvider measurementId={measurementId}>
        <UUIDGeneratorPage />
      </AnalyticsProvider>
    </ThemeProvider>
  );
}

export default App;