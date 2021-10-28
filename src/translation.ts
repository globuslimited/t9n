import {TranslationMap} from "./context";
import {assoc, mergeDeepWith} from "ramda";

export type Translation = {
    __isTranslation: true;
    translationMap: TranslationMap;
    extend: (translation: Translation | TranslationMap) => Translation;
};

const mergeTranslationMaps = (...translateMaps: TranslationMap[]): TranslationMap => {
    const mergeDeep = mergeDeepWith((a, b) => {
        const aType = Object.prototype.toString.call(a);
        const bType = Object.prototype.toString.call(b);
        const stringType = "[object String]";
        const objectType = "[object Object]";
        const validTypes = [stringType, objectType];

        return (aType === stringType && bType === stringType) ||
            (!validTypes.includes(aType) && !validTypes.includes(bType))
            ? b
            : aType === objectType
            ? assoc("default", b, a)
            : b.default === undefined
            ? assoc("default", a, b)
            : b;
    });

    return translateMaps.reduce((acc, map) => {
        return Object.entries(map).reduce((acc, [language, translation]) => {
            return assoc(
                language,
                // @ts-ignore
                mergeDeep(acc[language], translation),
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

export const extend = (
    parent: Translation | TranslationMap | null,
    children: Translation | TranslationMap,
): Translation => {
    const translationMap =
        parent == null
            ? getTranslationMap(children)
            : mergeTranslationMaps(getTranslationMap(parent), getTranslationMap(children));

    return {
        __isTranslation: true,
        translationMap,
        extend: (translation: Translation | TranslationMap) => extend(translation, translationMap),
    };
};

export const translation = (translationMap: Translation | TranslationMap): Translation => extend(null, translationMap);
