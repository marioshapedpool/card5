// src/i18n/i18nContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
  useCallback,
} from 'react';

type Language = 'en' | 'es';
type Translations = Record<string, any>; // Puede ser más específico si sabes la estructura

interface I18nContextType {
  language: Language;
  t: (key: string, namespace?: string) => string;
  changeLanguage: (lang: Language) => void;
  isLoadingTranslations: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Función para cargar traducciones desde la carpeta 'public/' usando fetch
const loadTranslationsFromPublic = async (
  lang: Language,
  namespace: string // e.g., 'navbar', 'auth', 'dashboard'
): Promise<Translations> => {
  try {
    // La URL es relativa a la raíz del sitio web desplegado.
    // Vite sirve los archivos de 'public/' en la raíz.
    const url = `/locales/${lang}/${namespace}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Translations = await response.json();
    return data;
  } catch (error) {
    console.warn(
      `Failed to load translations for namespace '${namespace}' in ${lang} from public folder:`,
      error
    );
    return {};
  }
};

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
  translationNamespaces: string[]; // Cambiado de translationModules a translationNamespaces
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLanguage = 'en',
  translationNamespaces, // Renombrado de translationModules
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [allTranslations, setAllTranslations] = useState<
    Record<string, Translations>
  >({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);

  useEffect(() => {
    const fetchAllTranslations = async () => {
      setIsLoadingTranslations(true);
      const newTranslations: Record<string, Translations> = {};

      if (!translationNamespaces || translationNamespaces.length === 0) {
        setAllTranslations({});
        setIsLoadingTranslations(false);
        return;
      }

      for (const namespace of translationNamespaces) {
        const loaded = await loadTranslationsFromPublic(language, namespace);
        newTranslations[namespace] = loaded; // Usamos el namespace como clave
      }

      setAllTranslations(newTranslations);
      setIsLoadingTranslations(false);
    };

    fetchAllTranslations();
    // Asegúrate de que los cambios en translationNamespaces también recarguen las traducciones
  }, [language, translationNamespaces]);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  // La función 't' probablemente sigue siendo la misma, ya que maneja namespaces
  const t = useCallback(
    (key: string, namespace?: string): string => {
      let translationsToSearch: Translations | undefined;

      if (namespace) {
        translationsToSearch = allTranslations[namespace];
      } else {
        // Si no se especifica namespace, busca en el primer módulo cargado
        // Considera usar un namespace por defecto 'common' si es posible
        const firstNamespace = Object.keys(allTranslations)[0];
        translationsToSearch = allTranslations[firstNamespace];
      }

      if (!translationsToSearch) {
        console.warn(
          `Namespace '${
            namespace || 'default/first'
          }' not found or translations not loaded.`
        );
        return key;
      }

      const getNestedValue = (
        obj: Translations,
        path: string
      ): string | undefined => {
        const parts = path.split('.');
        let current: any = obj;

        for (const part of parts) {
          if (current === undefined || current === null) {
            return undefined;
          }
          current = current[part];
        }

        if (typeof current === 'object' && current !== null) {
          console.warn(
            `Translation key '${path}' refers to an object, not a string.`
          );
          return undefined;
        }

        return current;
      };

      const translatedValue = getNestedValue(translationsToSearch, key);

      if (translatedValue === undefined) {
        console.warn(
          `Translation key '${key}' not found in namespace '${
            namespace || 'default/first'
          }'.`
        );
        return key;
      }

      // Devuelve el valor traducido, o la clave si no es una cadena (esto podría ocurrir si la clave apunta a un objeto)
      return typeof translatedValue === 'string' ? translatedValue : key;
    },
    [allTranslations]
  );

  return (
    <I18nContext.Provider
      value={{ language, t, changeLanguage, isLoadingTranslations }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
