import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from './i18n/i18nContext.tsx';
import App from './App.tsx';
import './index.css';

const allAppTranslationModules = [
  'navbar',
  'auth',
  'footer',
  'hero',
  'terms',
  'dashboard',
  'charts',
];

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <I18nProvider
      initialLanguage="en"
      translationNamespaces={allAppTranslationModules}
    >
      <App />
    </I18nProvider>
  </BrowserRouter>
);
