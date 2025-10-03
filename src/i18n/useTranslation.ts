import { useI18n } from './i18nContext';

export const useTranslation = () => {
  const { t, language, changeLanguage } = useI18n();
  return { t, language, changeLanguage };
};
