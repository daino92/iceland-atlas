import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { I18N_CONFIG, isLanguage } from "@/i18n";
import type { Language } from "@/types";

export const useLanguage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlLanguage = new URLSearchParams(location.search).get(
    I18N_CONFIG.queryParameter,
  );
  const [savedLanguage, setSavedLanguage] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(I18N_CONFIG.storageKey);
      return isLanguage(stored) ? stored : I18N_CONFIG.defaultLanguage;
    } catch {
      return I18N_CONFIG.defaultLanguage;
    }
  });
  const language = isLanguage(urlLanguage) ? urlLanguage : savedLanguage;

  useEffect(() => {
    document.documentElement.lang = language;
    setSavedLanguage(language);
    try {
      localStorage.setItem(I18N_CONFIG.storageKey, language);
    } catch {
      /* Storage may be disabled. */
    }
  }, [language]);

  const setLanguage = useCallback(
    (next: Language) => {
      setSavedLanguage(next);
      const params = new URLSearchParams(location.search);
      params.set(I18N_CONFIG.queryParameter, next);
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
          hash: location.hash,
        },
        { replace: true },
      );
    },
    [location.pathname, location.search, location.hash, navigate],
  );

  return { language, setLanguage };
};
