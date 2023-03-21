import { createExtension } from "../extension.js";
export const sex = createExtension((settings, options, language) => {
    return settings[options.sex];
});
