import {createExtension} from "../extension.js";

type Arguments = {
    singular: string;
    plurals: string;
};

export const englishPlurals = createExtension<
    Arguments,
    {
        count: number;
    }
>(
    (translation, options, language) => {
        const count = +options.count;
        if (Number.isInteger(count)) {
            if (Math.abs(count) === 1) {
                return translation.singular;
            } else {
                return translation.plurals;
            }
        }
        throw new Error("argument count was not provided");
    },
    ["en"],
);
