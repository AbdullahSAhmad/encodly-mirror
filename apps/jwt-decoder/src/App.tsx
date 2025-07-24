import React from 'react';
import { ThemeProvider } from '@encodly/shared-ui';
import JWTDecoderPage from './pages/JWTDecoderPage';

function App() {
  return (
    <ThemeProvider>
      <JWTDecoderPage />
    </ThemeProvider>
  );
}

export default App;