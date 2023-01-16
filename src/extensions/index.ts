import {Extension} from "./extension.js";
import {russianPlurals} from "./russian/plurals.js";

export const russian = {
    plurals: russianPlurals,
} satisfies Record<string, Extension<any, any>>;
