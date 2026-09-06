import { EN, EL } from "@/locales";
import type { Language } from "@/types";

export const I18N_CONFIG = {
  supportedLanguages: ["en", "el"],
  defaultLanguage: "el",
  fallbackLanguage: "en",
  storageKey: "iceland-atlas-language",
  queryParameter: "lang",
} as const;

export const RESOURCES: Record<Language, typeof EN> = { en: EN, el: EL };
export const UI = { en: EN.ui, el: EL.ui };

export const isLanguage = (value: unknown): value is Language => {
  return I18N_CONFIG.supportedLanguages.some((language) => language === value);
};

export const categoryLabel = (category: string, language: Language) => {
  const labels: Record<string, string> = RESOURCES[language].categories;
  const fallback: Record<string, string> =
    RESOURCES[I18N_CONFIG.fallbackLanguage].categories;
  return labels[category] ?? fallback[category] ?? category;
};
