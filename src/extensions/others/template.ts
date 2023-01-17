import { createExtension } from "../extension.js";

export const template = createExtension<string, {}>(
    (translation, options, language) => {
        return translation;
    },
);