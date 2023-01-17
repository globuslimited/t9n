import { createExtension } from "../extension.js";

export const template = createExtension<string, {}>(
    (translation, options, language) => {
        let str = translation;
        Object.entries(options).forEach(([name, value]) => {
            str = str.replaceAll(`{{${name}}}`, value.toString())
        });
        return str;
    },
);