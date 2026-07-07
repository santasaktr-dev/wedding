import type { Language, LocalizedText } from "./types";

export function assertValidLanguage(language: unknown): Language {
  return language === "th" ? "th" : "en";
}

export function getLocalizedText(text: LocalizedText, language: Language): string {
  const localizedValue = text[language].trim();

  return localizedValue || text.en;
}
