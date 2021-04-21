import { useContext } from "react";
import { curry, path } from "ramda";
import { Language, TranslationContext, TranslationMap } from "./context";

const replaceAll = (string: string, token: string, newToken: string) => {
    if (token != newToken)
        while (string.indexOf(token) > -1) {
            string = string.replace(token, newToken);
        }
    return string;
};

export type TranslationProperties = {
    [key: string]: string;
};

const getTranslation = (
    translationMap: TranslationMap,
    lang: Language,
    key: string,
    params: TranslationProperties
): string | null => {
    if (typeof params.count === "number") {
        const suffix = getSuffix(lang, key, params);
        const candidate = path(
            `${key}${suffix}`.split(".").map(path => (/^\d+$/.test(path) ? +path : path)),
            translationMap[lang]
        ) as string | null;
        if (candidate != null) {
            return candidate;
        }
    }
    return path(
        key.split(".").map(path => (/^\d+$/.test(path) ? +path : path)),
        translationMap[lang]
    ) as string | null;
};

export const translate = (
    translationMap: TranslationMap,
    lang: Language,
    key: string,
    params: TranslationProperties = {}
): string | null => {
    if (key == null) return null;
    const variables = Object.keys(params);
    const translation = getTranslation(translationMap, lang, key, params);
    if (translation == null) {
        return key;
    }
    if (typeof translation === "object") {
        return translate(translationMap, lang, `${key}.default`, params) ?? key;
    }
    if (variables.length === 0) {
        return translation;
    }
    return variables.reduce((ft: string, key: string) => {
        return replaceAll(ft, `{{${key}}}`, params[key]);
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
const getSuffix = (language: Language, key: string, params: TranslationProperties) => {
    if (typeof params.count === "number") {
        if (language === "en") {
            return params.count === 1 ? "" : "_plural";
        } else if (language === "ru") {
            return `_${toLowestTheSame(toRussianCasesRules(params.count))}`;
        }
    }
    return "";
};

const t = curry(translate);

export type TFunction = (key: string, params: TranslationProperties) => string | null;

export type UseTranslationResponse = {
    t: TFunction;
    language: Language;
};

export const useTranslation = (): UseTranslationResponse => {
    const settings = useContext(TranslationContext);
    const { fallbackLanguage, translations } = settings;
    return {
        t: t(translations, settings?.language ?? fallbackLanguage),
        language: settings?.language ?? fallbackLanguage,
    };
};
