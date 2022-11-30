import {Language} from "../../shared/basic.js";
import {plugin, TranslationPlugin} from "../../shared/plugin.js";

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

const russianPlurals: TranslationPlugin = params => {
    const count = +params.count;
    if (Number.isInteger(count)) {
        return [toLowestTheSame(toRussianCasesRules(count)).toString()];
    }
    return [];
};

export default plugin("russian-plurals", russianPlurals, [Language.Russian]);
