import {createExtension} from "../extension.js";

const lastDigit = (n: number) => parseInt(n.toString().slice(-1));

type Settings = {
    0: string;
    1: string;
    2: string;
};

const toLowestTheSame = (n: number): keyof Settings => {
    if (n >= 2 && n <= 4) {
        return 2;
    } else if (n > 4) {
        return 0;
    }
    return 1;
};

const toRussianCasesRules = (n: number) => {
    if (n > 20) {
        return lastDigit(n);
    } else if (n < 10) {
        return n;
    }
    return 0;
};

export const russianPlurals = createExtension<
    Settings,
    {
        count: number;
    }
>(
    (settings, options, language) => {
        return settings[toLowestTheSame(toRussianCasesRules(options.count))];
    },
    ["ru"],
);
