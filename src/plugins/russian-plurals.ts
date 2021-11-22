import {TranslationPlugin} from "..";

const lastDigit = (n: number) => parseInt(n.toString().slice(-1));

const toLowestTheSame = (n: number) => {
    if (n >= 2 && n <= 4) {
        return 2;
    } else if (n > 4) {
        return 0;
    }
    return n;
};
const toRussianCasesRules = (n: number) => {
    if (n > 20) {
        return lastDigit(n);
    } else if (n < 10) {
        return n;
    }
    return 0;
};

export const russianPlurals: TranslationPlugin = (_key, count) => {
    return `_${toLowestTheSame(toRussianCasesRules(+count))}`;
};
