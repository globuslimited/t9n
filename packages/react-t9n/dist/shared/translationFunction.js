import { path, reverse } from "ramda";
import { applyTemplate } from "./helper.js";
const getModifiers = (key) => {
    const [, ...modifiers] = key.split("_");
    return modifiers;
};
const applyPlugins = (keys, params, packedPlugins) => {
    let remainingKeys = keys.map(key => {
        const modifiers = getModifiers(key);
        return {
            key,
            modifiers,
            remainingModifiers: modifiers,
        };
    });
    if (remainingKeys.length === 1) {
        return remainingKeys[0]["key"];
    }
    for (const { plugin, name } of packedPlugins) {
        const modifiers = plugin(params);
        for (const modifier of modifiers) {
            const keysWithModifiers = remainingKeys.filter(({ remainingModifiers }) => remainingModifiers.includes(modifier));
            if (keysWithModifiers.length === 0) {
                console.warn(`[${name}]`, "modifier", modifier, "ignored");
                continue;
            }
            else if (keysWithModifiers.length === 1) {
                return keysWithModifiers[0]["key"];
            }
            else {
                remainingKeys = keysWithModifiers.map(key => ({
                    ...key,
                    remainingModifiers: key.remainingModifiers.filter(m => m !== modifier),
                }));
            }
        }
    }
    let minKey = remainingKeys[0];
    for (const key of remainingKeys) {
        const currentKeyLength = key.remainingModifiers.length;
        if (currentKeyLength === 0) {
            console.warn("fallback for key with no modifiers", key.key);
            return key.key;
        }
        if (currentKeyLength < minKey.remainingModifiers.length) {
            minKey = key;
        }
    }
    console.warn("not exact match for", minKey.key);
    return minKey.key;
};
const getTranslation = (translationMap, lang, key, params, plugins) => {
    if (key == null) {
        return null;
    }
    const [translationKey, ...parent] = reverse(key.split("."));
    const parentTranslation = path(reverse(parent), translationMap[lang]);
    if (typeof parentTranslation != "object" || parentTranslation == null) {
        return null;
    }
    const keys = Object.keys(parentTranslation);
    if (keys.length === 0) {
        return null;
    }
    const suitableKeys = keys.filter(k => k === translationKey || k.startsWith(translationKey + "_"));
    if (suitableKeys.length == 0) {
        return null;
    }
    // suitable keys are more than 1, then applyPlugins
    if (Array.isArray(plugins) && plugins.length === 0) {
        return parentTranslation[translationKey];
    }
    const finalKey = applyPlugins(suitableKeys, params, plugins);
    return parentTranslation[finalKey];
};
export const translate = (translationMap, lang, key, params = {}, fallbackLanguages, plugins) => {
    const translation = getTranslation(translationMap, lang, key, params, plugins.filter(plugin => plugin.supportedLanguages.includes(lang))) ??
        fallbackLanguages.reduce((fallback, fallbackLanguage) => {
            if (fallback != null)
                return fallback;
            return getTranslation(translationMap, fallbackLanguage, key, params, plugins.filter(plugin => plugin.supportedLanguages.includes(fallbackLanguage)));
        }, null);
    if (translation == null) {
        return key;
    }
    if (typeof translation === "object") {
        return translate(translationMap, lang, `${key}.default`, params, fallbackLanguages, plugins) ?? key;
    }
    if (typeof translation === "function") {
        return translation(params);
    }
    if (typeof translation === "number") {
        return translation.toString();
    }
    if (typeof translation === "string") {
        return applyTemplate(translation, params);
    }
    return key;
};
export const generateTranslationFunction = (translations, language, fallbackLanguages, plugins, options) => {
    return (key, params, enforceLanguage) => {
        const currentLanguage = enforceLanguage ?? language ?? fallbackLanguages[0];
        if (currentLanguage == null) {
            throw new Error("Please set the current language!");
        }
        const preparedKey = typeof options.prefix === "string" ? `${options.prefix}.${key}` : key;
        return translate(translations, currentLanguage, preparedKey, params, fallbackLanguages, plugins);
    };
};
const isPlainObject = (o) => {
    return Object.prototype.toString.call(o) === "[object Object]";
};
export const generateDictFunction = (translationMap, language, fallbackLanguage) => {
    const ramdaPath = path;
    return (path, mapper = key => key, enforceLanguage) => {
        const finalLanguage = enforceLanguage ?? language ?? fallbackLanguage;
        const finalPath = path == null ? [finalLanguage] : [finalLanguage].concat(path.split("."));
        const subMap = ramdaPath(finalPath, translationMap);
        if (!isPlainObject(subMap))
            return [];
        return Object.keys(subMap)
            .filter(key => key !== "default")
            .map(key => {
            const children = isPlainObject(subMap[key])
                ? Object.keys(subMap[key]).filter(key => key !== "default")
                : [];
            return mapper(key, path == null ? key : `${path}.${key}`, children);
        });
    };
};
