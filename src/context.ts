import {createContext} from "react";
import { Language, TranslationMap } from "./basic.js";
import type {PackedPlugin} from "./plugin.js";
import englishPlurals from "./plugins/english/plurals.js";
import russianPlurals from "./plugins/russian/plurals.js";
import sexPlugin from "./plugins/sex.js";

export type TranslationSettings = {
    translations: TranslationMap;
    language: Language;
    fallbackLanguage: Language;
    plugins: PackedPlugin[];
};

export const defaultSettings: TranslationSettings = {
    fallbackLanguage: Language.English,
    language: Language.English,
    translations: {
        en: {},
    },
    plugins: [russianPlurals, englishPlurals, sexPlugin],
};

export const TranslationContext = createContext<Partial<TranslationSettings>>(defaultSettings);
