import { englishPlurals } from "./english/plurals.js";
import { russianPlurals } from "./russian/plurals.js";
export { sex } from "./others/sex.js";
export { template } from "./others/template.js";
export { createExtension } from "./extension.js";
export const russian = {
    plurals: russianPlurals,
};
export const english = {
    plurals: englishPlurals,
};
const translation = {
    en: {
        hello: english.plurals({
            singular: "hello",
            plurals: "hello everyone",
        }),
        text: "hello",
    },
    ru: {
        hello: russian.plurals({
            0: "1",
            1: "2",
            2: "3",
        }),
        text: "привет",
    },
};
const testF = (params => "hello");
const testProperties = {
    count: 3,
    additionalArgument: 3,
};
