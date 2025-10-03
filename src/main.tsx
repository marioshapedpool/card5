import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from './i18n/i18nContext.tsx';
import App from './App.tsx';
import './index.css';

const allAppTranslationModules = [
  'i18n/translations/navbar',
  'i18n/translations/auth',
  'i18n/translations/footer',
  'i18n/translations/hero',
  'i18n/translations/terms',
  'i18n/translations/dashboard',
  'i18n/translations/charts',
];

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <I18nProvider
        initialLanguage="en"
        translationModules={allAppTranslationModules}
      >
        <App />
      </I18nProvider>
    </BrowserRouter>
);
