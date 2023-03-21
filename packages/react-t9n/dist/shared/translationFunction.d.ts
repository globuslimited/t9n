import { TranslationMap, TranslationProperties } from "shared/basic.js";
import { PackedPlugin } from "shared/plugin.js";
export declare const translate: (translationMap: TranslationMap, lang: string, key: string, params: TranslationProperties | undefined, fallbackLanguages: string[], plugins: PackedPlugin[]) => string;
export declare const generateTranslationFunction: (translations: TranslationMap, language: string | undefined, fallbackLanguages: string[], plugins: PackedPlugin[], options: UseTranslationOptions) => (key: string, params?: TranslationProperties, enforceLanguage?: string) => string;
type DictMapper<T> = (key: string, path: string, children: string[]) => T;
export declare const generateDictFunction: (translationMap: TranslationMap, language: string, fallbackLanguage: string) => <T = string>(path: string | null, mapper?: DictMapper<T>, enforceLanguage?: string) => T[];
export type DictFunction = ReturnType<typeof generateDictFunction>;
export type TranslationFunction = ReturnType<typeof generateTranslationFunction>;
export type UseTranslationOptions = {
    prefix?: string;
};
export {};
