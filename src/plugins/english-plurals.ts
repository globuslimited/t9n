import {TranslationPlugin} from "..";

export const englishPlurals: TranslationPlugin = (_key, params) => {
    return Math.abs(+params.count) === 1 ? "" : "_plural";
};
