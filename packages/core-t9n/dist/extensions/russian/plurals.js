import { createExtension } from "../extension.js";
const lastDigit = (n) => parseInt(n.toString().slice(-1));
const toLowestTheSame = (n) => {
    if (n >= 2 && n <= 4) {
        return 2;
    }
    else if (n > 4) {
        return 0;
    }
    return 1;
};
const toRussianCasesRules = (n) => {
    if (n > 20) {
        return lastDigit(n);
    }
    else if (n < 10) {
        return n;
    }
    return 0;
};
export const russianPlurals = createExtension((settings, options, language) => {
    return settings[toLowestTheSame(toRussianCasesRules(options.count))];
}, ["ru"]);
