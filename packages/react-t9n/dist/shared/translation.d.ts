import { TranslationSettings } from "./settings.js";
import { TranslationMap } from "./basic.js";
import { TranslationFunction } from "./translationFunction.js";
export type TranslationConfiguration = Partial<Omit<TranslationSettings, "translations">>;
export type Translation = {
    __isTranslation: true;
    translationMap: TranslationMap;
    extend: (translation: Translation | TranslationMap, settings?: TranslationConfiguration) => Translation;
    t: TranslationFunction;
};
export declare const extend: (parent: Translation | TranslationMap | null, children: Translation | TranslationMap, settings?: TranslationConfiguration) => Translation;
export declare const translation: (translationMap: Translation | TranslationMap, settings?: TranslationConfiguration) => Translation;
