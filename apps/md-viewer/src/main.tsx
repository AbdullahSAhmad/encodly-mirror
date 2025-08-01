import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@encodly/shared-ui/styles';
import 'katex/dist/katex.min.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);