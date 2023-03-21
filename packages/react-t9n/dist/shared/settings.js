import { mergeRight } from "ramda";
import englishPlurals from "../plugins/english/plurals.js";
import russianPlurals from "../plugins/russian/plurals.js";
import sexPlugin from "../plugins/sex.js";
export const defaultSettings = {
    fallbackLanguages: ["en"],
    language: process.env.NEXT_PUBLIC_LANGUAGE ?? process.env.LANGUAGE ?? "en",
    translations: {
        en: {},
    },
    plugins: [russianPlurals, englishPlurals, sexPlugin],
};
export const mergeSettings = (parent, children) => mergeRight(parent, children);
