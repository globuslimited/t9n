import {englishPlurals} from "./english/plurals.js";
import {Extension} from "./extension.js";
import {russianPlurals} from "./russian/plurals.js";
export {sex} from "./others/sex.js";
export {template} from "./others/template.js";
export {createExtension} from "./extension.js";

export const russian = {
    plurals: russianPlurals,
} satisfies Record<string, Extension<any, any>>;

export const english = {
    plurals: englishPlurals,
} satisfies Record<string, Extension<any, any>>;

const translation = {
    en: {
        hello: english.plurals<{additionalArgument: number}>({
            singular: "hello",
            plurals: "hello everyone",
        }),
        text: "hello",
    },
    ru: {
        hello: russian.plurals<{additionalArgument: number}>({
            0: "1",
            1: "2",
            2: "3",
        }),
        text: "привет",
    },
};

type Test1 = typeof translation[keyof typeof translation];
type Hello = Test1["hello"];

type Handler1 = Hello["handler"];
type HandlerProperties = Parameters<Handler1>[0];

type Text = Test1["text"];
type IsExtension<T> = T extends {__isExtension: true} ? true : false;

type IsTextExtension = IsExtension<Text>;
type IsHelloExtension = IsExtension<Hello>;
type TranslationHandler<T> = T extends ReturnType<Extension<any, any>>
    ? (params: Parameters<T["handler"]>[0]) => string
    : T;
type TextTranslationHandler = TranslationHandler<Text>;
type HelloTranslationHandler = TranslationHandler<Hello>;

const testF = (params => "hello") satisfies HelloTranslationHandler;
const testProperties = {
    count: 3,
    additionalArgument: 3,
} satisfies HandlerProperties;
