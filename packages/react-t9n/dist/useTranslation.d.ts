import { Translation } from "./shared/translation.js";
import { TranslationMap } from "./shared/basic.js";
import { UseTranslationOptions } from "./shared/translationFunction.js";
export declare const useTranslation: (translation?: Translation | TranslationMap, options?: UseTranslationOptions) => {
    t: (key: string, params?: import("./shared/basic.js").TranslationProperties | undefined, enforceLanguage?: string | undefined) => string;
    language: string;
    fallbackLanguages: string[];
};
export type UseTranslationResponse = ReturnType<typeof useTranslation>;
