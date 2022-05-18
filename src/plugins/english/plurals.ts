import {Language, TranslationProperties} from "../../basic.js";
import {plugin, TranslationPlugin} from "../../plugin.js";

const englishPlurals: TranslationPlugin = (params: TranslationProperties) => {
    const count = +params.count;
    if (Number.isInteger(count)) {
        if (Math.abs(count) === 1) {
            return ["singular"];
        } else {
            return ["plural"];
        }
    }
    return [];
};

export default plugin("english-plurals", englishPlurals, [Language.English, Language.Chinese]);
