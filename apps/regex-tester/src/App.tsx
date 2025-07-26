import { ThemeProvider } from '@encodly/shared-ui';
import { AnalyticsProvider } from '@encodly/shared-analytics';
import RegexTesterPage from './pages/RegexTesterPage';

function App() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

  return (
    <ThemeProvider>
      <AnalyticsProvider measurementId={measurementId}>
        <RegexTesterPage />
      </AnalyticsProvider>
    </ThemeProvider>
  );
}

export default App;