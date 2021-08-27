import {TranslationMap} from "./context";
import {assoc, mergeDeepRight} from "ramda";

export type Translation = {
    __isTranslation: true;
    translationMap: TranslationMap;
    extend: (translation: Translation | TranslationMap) => Translation;
};

const mergeTranslationMaps = (...translateMaps: TranslationMap[]): TranslationMap => {
    return translateMaps.reduce((acc, map) => {
        return Object.entries(map).reduce((acc, [language, translation]) => {
            return assoc(
                language,
                // @ts-ignore
                mergeDeepRight(acc[language], translation),
                acc,
            );
        }, acc);
    }, {} as TranslationMap);
};

const getTranslationMap = (translation: Translation | TranslationMap): TranslationMap => {
    return translation.hasOwnProperty("__isTranslation") && (translation as Translation).__isTranslation === true
        ? (translation as Translation).translationMap
        : (translation as TranslationMap);
};

export const extend = (parent: Translation | TranslationMap | null, children: Translation | TranslationMap): Translation => {
    const translationMap = parent == null
        ? getTranslationMap(children)
        : mergeTranslationMaps(getTranslationMap(parent), getTranslationMap(children));

    return {
        __isTranslation: true,
        translationMap,
        extend: (translation: Translation | TranslationMap) => extend(translation, translationMap),
    };
};

export const translation = (translationMap: Translation | TranslationMap): Translation => extend(null, translationMap);
