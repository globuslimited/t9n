import {useContext} from "react";
import {path} from "ramda";
import {Language, TranslationContext, TranslationMap} from "./context";
import {Translation, translation as translationFunc} from "./translation";

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
): string | null => {
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

export const translate = (
    translationMap: TranslationMap,
    lang: Language,
    key: string,
    params: TranslationProperties = {},
    fallbackLanguage: Language,
): string => {
    const variables = Object.keys(params);
    const translation =
        getTranslation(translationMap, lang, key, params) ??
        getTranslation(translationMap, fallbackLanguage, key, params);
    if (translation == null) {
        return key;
    }
    if (typeof translation === "object") {
        return translate(translationMap, lang, `${key}.default`, params, fallbackLanguage) ?? key;
    }
    if (variables.length === 0) {
        return translation;
    }
    return variables.reduce((ft: string, key: string) => {
        return replaceAll(ft, `{{${key}}}`, params[key].toString());
    }, translation);
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
        path: string,
        mapper: (key: string, path: string) => T = key => key as unknown as T,
        enforceLanguage?: Language
    ): T[] => {
        const finalLanguage = enforceLanguage ?? language ?? fallbackLanguage;
        const finalPath = [finalLanguage as string].concat(path.split("."));

        const subMap = ramdaPath(finalPath, translationMap) as TranslationProperties;
        if (Object.prototype.toString.call(subMap) !== "[object Object]") return [];

        return Object.keys(subMap)
            .filter(key => key !== "default")
            .map(key => mapper(key, `${path}.${key}`));
    };
};

export const useTranslation = (translation?: Translation | TranslationMap) => {
    const settings = useContext(TranslationContext);
    const {fallbackLanguage, translations} = settings;

    const translationMap = translation == null
        ? translations
        : translationFunc(translation).extend(translations).translationMap;

    return {
        t: generateTranslationFunction(translationMap, settings.language, fallbackLanguage),
        language: settings?.language ?? fallbackLanguage,
        dict: generateDictFunction(translationMap, settings.language, fallbackLanguage),
    };
};

export type UseTranslationResponse = ReturnType<typeof useTranslation>;

