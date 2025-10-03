import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
  useCallback,
} from 'react';

type Language = 'en' | 'es';
type Translations = Record<string, any>;

interface I18nContextType {
  language: Language;
  t: (key: string, namespace?: string) => string;
  changeLanguage: (lang: Language) => void;
  isLoadingTranslations: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const loadModuleTranslations = async (
  lang: Language,
  modulePath: string // e.g., 'features/dashboard/i18n'
): Promise<Translations> => {
  try {
    const module = await import(
      /* @vite-ignore */ `../${modulePath}/${lang}.json`
    );
    return module.default;
  } catch (error) {
    console.warn(
      `Failed to load translations for module ${modulePath} in ${lang}:`,
      error
    );
    return {};
  }
};

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
  translationModules: string[];
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLanguage = 'en',
  translationModules,
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [allTranslations, setAllTranslations] = useState<
    Record<string, Translations>
  >({}); // Ahora cada entrada es un objeto de traducción anidado
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);

  useEffect(() => {
    const fetchAllTranslations = async () => {
      setIsLoadingTranslations(true);
      const newTranslations: Record<string, Translations> = {};
      for (const modulePath of translationModules) {
        const moduleName = modulePath.split('/').pop() || modulePath;
        const loaded = await loadModuleTranslations(language, modulePath);
        newTranslations[moduleName] = loaded;
      }
      setAllTranslations(newTranslations);
      setIsLoadingTranslations(false);
    };
    fetchAllTranslations();
  }, [language, translationModules]);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  // FUNCION 't' MEJORADA PARA CLAVES ANIDADAS
  const t = useCallback(
    (key: string, namespace?: string): string => {
      let translationsToSearch: Translations | undefined;

      if (namespace) {
        translationsToSearch = allTranslations[namespace];
      } else {
        // Si no se especifica namespace, asumimos que es 'common' o el primer cargado
        // Esto es una simplificación; para robustez, es mejor siempre especificar namespace
        translationsToSearch =
          allTranslations['common'] || Object.values(allTranslations)[0];
      }

      if (!translationsToSearch) {
        console.warn(
          `Namespace '${
            namespace || 'default'
          }' not found or translations not loaded.`
        );
        return key; // Devuelve la clave si el namespace no existe
      }

      // Función para navegar por un objeto anidado usando la notación de puntos
      const getNestedValue = (
        obj: Translations,
        path: string
      ): string | undefined => {
        const parts = path.split('.');
        let current: any = obj;
        for (let i = 0; i < parts.length; i++) {
          if (current === undefined || current === null) {
            return undefined;
          }
          current = current[parts[i]];
        }
        // Si el valor final es un objeto, eso es un error (significa que la clave
        // apuntaba a un objeto anidado, no a una cadena final)
        if (typeof current === 'object' && current !== null) {
          console.warn(
            `Translation key '${path}' refers to an object, not a string.`
          );
          return undefined;
        }
        return current;
      };

      // Intentar obtener la traducción anidada
      const translatedValue = getNestedValue(translationsToSearch, key);

      // Si no se encuentra, devolver la clave original o un mensaje de error
      if (translatedValue === undefined) {
        console.warn(
          `Translation key '${key}' not found in namespace '${
            namespace || 'default'
          }'.`
        );
        return key;
      }

      return translatedValue;
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
