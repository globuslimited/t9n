import {useContext} from "react";
import {path} from "ramda";
import {
    Language,
    TemplateFunction,
    TranslationContext,
    TranslationMap,
    Translation as TranslationOfTranslationMap,
} from "./context.js";
import {Translation, extend} from "./translation.js";

const replaceAll = (string: string, token: string, newToken: string) => {
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
): string | number | TemplateFunction | null => {
    if (key == null) {
        return null;
    }
    if (typeof params.count === "number") {
        const suffix = getSuffix(lang, key, params);
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
): string => {
    const translation =
        getTranslation(translationMap, lang, key, params) ??
        getTranslation(translationMap, fallbackLanguage, key, params);

    if (translation == null) {
        return key;
    }
    if (typeof translation === "object") {
        return translate(translationMap, lang, `${key}.default`, params, fallbackLanguage) ?? key;
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

const lastDigit = (n: number) => parseInt(n.toString().slice(-1));
const toLowestTheSame = (n: number) => {
    if (n >= 2 && n <= 4) {
        return 2;
    } else if (n > 4) {
        return 0;
    }
    return n;
};
const toRussianCasesRules = (n: number) => {
    if (n > 20) {
        return lastDigit(n);
    } else if (n < 10) {
        return n;
    }
    return 0;
};
const getSuffix = (language: Language, _key: string, params: TranslationProperties) => {
    if (typeof params.count === "number") {
        if (language === "en") {
            return params.count === 1 ? "" : "_plural";
        } else if (language === "ru") {
            return `_${toLowestTheSame(toRussianCasesRules(params.count))}`;
        }
    }
    return "";
};

export const generateTranslationFunction = (
    translations: TranslationMap,
    language: Language,
    fallbackLanguage: Language,
) => {
    return (key: string, params?: TranslationProperties, enforceLanguage?: Language) => {
        return translate(translations, enforceLanguage ?? language ?? fallbackLanguage, key, params, fallbackLanguage);
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
        mapper: (key: string, path: string, children: TranslationOfTranslationMap["key"]) => T = key => key as unknown as T,
        enforceLanguage?: Language,
    ): T[] => {
        const finalLanguage = enforceLanguage ?? language ?? fallbackLanguage;
        const finalPath = path == null ? [finalLanguage as string] : [finalLanguage as string].concat(path.split("."));

        const subMap = ramdaPath(finalPath, translationMap);
        if (Object.prototype.toString.call(subMap) !== "[object Object]") return [];

        const finalSubMap = subMap as TranslationOfTranslationMap;
        return Object.keys(finalSubMap)
            .filter(key => key !== "default")
            .map(key => mapper(key, path == null ? key : `${path}.${key}`, finalSubMap[key]));
    };
};

export const useTranslation = (translation?: Translation | TranslationMap) => {
    const settings = useContext(TranslationContext);
    const {fallbackLanguage, translations} = settings;

    const translationMap = translation == null ? translations : extend(translations, translation).translationMap;

    return {
        t: generateTranslationFunction(translationMap, settings.language, fallbackLanguage),
        language: settings?.language ?? fallbackLanguage,
    };
};

export type UseTranslationResponse = ReturnType<typeof useTranslation>;
