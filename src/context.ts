import { createContext } from "react";

export enum Language {
    English = "en",
    Russian = "ru",
}

export type Translation = {
    [key: string]: Translation | string;
};

export type TranslationMap = {
    ru: Translation;
    en: Translation;
};

type TranslationSettings = {
    translations: TranslationMap;
    language: Language;
    fallbackLanguage: Language;
} | null;

export const TranslationContext = createContext<TranslationSettings>(null);
