import { Extension } from "./extension.js";
export { sex } from "./others/sex.js";
export { template } from "./others/template.js";
export { createExtension } from "./extension.js";
export declare const russian: {
    plurals: Extension<{
        0: string;
        1: string;
        2: string;
    }, {
        count: number;
    }>;
};
export declare const english: {
    plurals: Extension<{
        singular: string;
        plurals: string;
    }, {
        count: number;
    }>;
};
