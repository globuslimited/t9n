import {TranslationMap} from "./basic.js";
import type {PackedPlugin} from "./plugin.js";
import englishPlurals from "../plugins/english/plurals.js";
import russianPlurals from "../plugins/russian/plurals.js";
import sexPlugin from "../plugins/sex.js";

type Language = string;

export type TranslationSettings = {
    /**
     * @deprecated Don't use global translations, they will be remove in the next major release.
     */
    translations: TranslationMap;
    language: Language;
    fallbackLanguages: Language[];
    plugins: PackedPlugin[];
};

// @ts-ignore
const defaultLanguage = process?.env?.NEXT_PUBLIC_LANGUAGE ?? process?.env?.LANGUAGE ?? "en"
export const defaultSettings = {
    fallbackLanguages: ["en"],
    language: defaultLanguage ,
    translations: {
        en: {},
    },
    plugins: [russianPlurals, englishPlurals, sexPlugin],
} satisfies Partial<TranslationSettings>;

export const mergeSettings = <
    TParent extends Partial<TranslationSettings>,
    TChildren extends Partial<TranslationSettings>,
>(
    parent: TParent,
    children: TChildren,
) =>({...parent, ...children});
