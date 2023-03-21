import { createExtension } from "../extension.js";
export const englishPlurals = createExtension((settings, options, language) => {
    const count = +options.count;
    if (Number.isInteger(count)) {
        if (Math.abs(count) === 1) {
            return settings.singular;
        }
        else {
            return settings.plurals;
        }
    }
    throw new Error("argument count was not provided");
}, ["en"]);
