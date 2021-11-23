import {createContext} from "react";
import {englishPlurals} from "./plugins/english-plurals.js";
import {russianPlurals} from "./plugins/russian-plurals.js";
import {TranslationProperties} from "./useTranslation.js";

export enum Language {
    English = "en",
    Russian = "ru",
    Chinese = "zh",
}

export type TemplateFunction = (args: TranslationProperties) => string;

export type Translation = {
    [key: string]: Translation | string | number | TemplateFunction;
};

export type TranslationMap = {
    [language in Language]?: Translation;
};

export type TranslationPlugin = (key: string | number, params: TranslationProperties) => string;

export type TranslationSettings = {
    translations: TranslationMap;
    language: Language;
    fallbackLanguage: Language;
    plugins: Partial<Record<Language, TranslationPlugin>>;
};

export const defaultSettings: TranslationSettings = {
    fallbackLanguage: Language.English,
    language: Language.English,
    translations: {
        en: {},
    },
    plugins: {
        [Language.Russian]: russianPlurals,
        [Language.English]: englishPlurals,
    },
};

export const TranslationContext = createContext<Partial<TranslationSettings>>(defaultSettings);
