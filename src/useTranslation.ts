import {useContext} from "react";
import {mergeDeepRight, path} from "ramda";
import {
    defaultSettings,
    Language,
    TemplateFunction,
    TranslationContext,
    TranslationMap,
    TranslationPlugin,
} from "./context.js";
import {Translation, extend} from "./translation.js";

const replaceAll =
    typeof String.prototype.replaceAll === "function"
        ? (string: string, token: string, newToken: string) => {
              return string.replaceAll(token, newToken);
          }
        : (string: string, token: string, newToken: string) => {
              if (token != newToken)
                  while (string.indexOf(token) > -1) {
                      string = string.replace(token, newToken);
                  }
              return string;
          };

export type TranslationProperties = {
    [key: string]: string | number;
};

const getTranslation = (
    translationMap: TranslationMap,
    lang: Language,
    key: string,
    params: TranslationProperties,
    plugin?: TranslationPlugin,
): string | number | TemplateFunction | null => {
    if (key == null) {
        return null;
    }
    if (typeof params.count === "number") {
        const suffix = getSuffix(key, params, plugin);
        const candidate = path(
            `${key}${suffix}`.split(".").map(path => (/^\d+$/.test(path) ? +path : path)),
            translationMap[lang],
        ) as string | null;
        if (candidate != null) {
            return candidate;
        }
    }
    return path(
        key.split(".").map(path => (/^\d+$/.test(path) ? +path : path)),
        translationMap[lang],
    ) as string | null;
};

const applyTemplate = (str: string, params: TranslationProperties) => {
    const variables = Object.keys(params);
    if (variables.length === 0) {
        return str;
    }
    return variables.reduce((ft: string, key: string) => {
        return replaceAll(ft, `{{${key}}}`, params[key].toString());
    }, str);
};

export const translate = (
    translationMap: TranslationMap,
    lang: Language,
    key: string,
    params: TranslationProperties = {},
    fallbackLanguage: Language,
    plugins: Partial<Record<Language, TranslationPlugin>>,
): string => {
    const translation =
        getTranslation(translationMap, lang, key, params, plugins[lang]) ??
        getTranslation(translationMap, fallbackLanguage, key, params, plugins[fallbackLanguage]);

    if (translation == null) {
        return key;
    }
    if (typeof translation === "object") {
        return translate(translationMap, lang, `${key}.default`, params, fallbackLanguage, plugins) ?? key;
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

const getSuffix = (key: string, params: TranslationProperties, plugin?: TranslationPlugin) => {
    if (typeof plugin !== "function") {
        return "";
    }
    return plugin(key, params);
};

export const generateTranslationFunction = (
    translations: TranslationMap,
    language: Language,
    fallbackLanguage: Language,
    plugins: Partial<Record<Language, TranslationPlugin>>,
) => {
    return (key: string, params?: TranslationProperties, enforceLanguage?: Language) => {
        const currentLanguage = enforceLanguage ?? language ?? fallbackLanguage;
        return translate(translations, currentLanguage, key, params, fallbackLanguage, plugins);
    };
};

export const generateDictFunction = (
    translationMap: TranslationMap,
    language: Language,
    fallbackLanguage: Language,
) => {
    const ramdaPath = path;
    return <T>(
        path: string | null,
        mapper: (key: string, path: string) => T = key => key as unknown as T,
        enforceLanguage?: Language,
    ): T[] => {
        const finalLanguage = enforceLanguage ?? language ?? fallbackLanguage;
        const finalPath = path == null ? [finalLanguage as string] : [finalLanguage as string].concat(path.split("."));

        const subMap = ramdaPath(finalPath, translationMap) as TranslationProperties;
        if (Object.prototype.toString.call(subMap) !== "[object Object]") return [];

        return Object.keys(subMap)
            .filter(key => key !== "default")
            .map(key => mapper(key, path == null ? key : `${path}.${key}`));
    };
};

// type UseTranslationOptions = {
//     prefix?: string;
// }

export const useTranslation = (translation?: Translation | TranslationMap) => {
    const settingsPatch = useContext(TranslationContext);
    const settings = mergeDeepRight(defaultSettings, settingsPatch);
    const {fallbackLanguage, translations, plugins} = settings;

    const translationMap = translation == null ? translations : extend(translations, translation).translationMap;

    return {
        t: generateTranslationFunction(translationMap, settings.language, fallbackLanguage, plugins),
        language: settings?.language ?? fallbackLanguage,
        fallbackLanguage,
    };
};

export type UseTranslationResponse = ReturnType<typeof useTranslation>;
