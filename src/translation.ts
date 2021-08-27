import {TranslationMap} from "./context";
import {assoc, mergeDeepRight} from "ramda";

export type Translation = {
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
    // @ts-ignore
    return typeof translation.extend === "function"
        // @ts-ignore
        ? translation.translationMap
        : translation;
}

const extend = (parent: Translation | TranslationMap, children: Translation | TranslationMap): Translation => {
    const translationMap = mergeTranslationMaps(
        getTranslationMap(parent),
        getTranslationMap(children)
    );
    return {
        translationMap,
        extend: (translation: Translation | TranslationMap) => extend(translation, translationMap)
    };
};

export const translation = (translationMap: Translation | TranslationMap): Translation => {
    return {
        translationMap: getTranslationMap(translationMap),
        extend: (translation: Translation | TranslationMap) => extend(translation, translationMap),
    };
};
