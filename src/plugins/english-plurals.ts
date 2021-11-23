import {TranslationPlugin} from "..";

export const englishPlurals: TranslationPlugin = (_key, params) => {
    return +params.count === 1 ? "" : "_plural";
};
