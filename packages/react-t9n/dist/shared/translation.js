import { assoc, mergeDeepWith } from "ramda";
import { defaultSettings, mergeSettings } from "./settings.js";
import { generateTranslationFunction } from "./translationFunction.js";
const mergeTranslationMaps = (...translateMaps) => {
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
            return assoc(language, 
            // @ts-ignore
            mergeDeep(acc[language], translation), acc);
        }, acc);
    }, {});
};
const getTranslationMap = (translation) => {
    return translation.hasOwnProperty("__isTranslation") && translation.__isTranslation === true
        ? translation.translationMap
        : translation;
};
export const extend = (parent, children, settings = {}) => {
    const parentSettings = mergeSettings(defaultSettings, settings);
    const translationMap = parent == null
        ? getTranslationMap(children)
        : mergeTranslationMaps(getTranslationMap(parent), getTranslationMap(children));
    return {
        __isTranslation: true,
        translationMap,
        extend: (translation, settings = {}) => extend(translation, translationMap, mergeSettings(parentSettings, settings)),
        t: generateTranslationFunction(translationMap, parentSettings.language, parentSettings.fallbackLanguages ?? [], parentSettings.plugins ?? [], {}),
    };
};
export const translation = (translationMap, settings = {}) => extend(null, translationMap, mergeSettings(defaultSettings, settings));
