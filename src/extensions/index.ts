import {englishPlurals} from "./english/plurals.js";
import {Extension} from "./extension.js";
import {russianPlurals} from "./russian/plurals.js";
export {sex} from "./others/sex.js";
export {template} from "./others/template.js";
export {createExtension} from "./extension.js"

export const russian = {
    plurals: russianPlurals,
} satisfies Record<string, Extension<any, any>>;

export const english = {
    plurals: englishPlurals,
} satisfies Record<string, Extension<any, any>>;

russian.plurals<{additionalArgument: number}>({
    0: "1",
    1: "2",
    2: "3",
});

english.plurals<{additionalArgument: number}>({
    singular: "hello",
    plurals: "hello everyone",
});
