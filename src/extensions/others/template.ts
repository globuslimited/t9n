import { createExtension } from "../extension.js";

export const template = createExtension<string, {}>(
    (settings, options, language) => {
        return settings;
    },
);