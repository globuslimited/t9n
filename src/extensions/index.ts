import {Extension} from "./extension.js";
import {russianPlurals} from "./russian/plurals.js";

export const russian = {
    plurals: russianPlurals,
} satisfies Record<string, Extension<any, any>>;

russian.plurals<{additionalArgument: number}>({
    0: "1",
    1: "2",
    2: "3"
})

