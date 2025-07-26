import { ThemeProvider } from '@encodly/shared-ui';
import { QRGeneratorPage } from './pages/QRGeneratorPage';

function App() {
  return (
    <ThemeProvider>
      <QRGeneratorPage />
    </ThemeProvider>
  );
}

export default App;