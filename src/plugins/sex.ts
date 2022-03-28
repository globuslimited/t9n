import {Language, TranslationProperties} from "../basic.js";
import {plugin, TranslationPlugin} from "../plugin.js";

const sexPlugin: TranslationPlugin = (params: TranslationProperties) => {
    if (params.sex === "male") {
        return ["male"];
    }
    if (params.sex === "female") {
        return ["female"];
    }
    return [];
};

export default plugin("sex-plugin", sexPlugin, [Language.Russian, Language.English, Language.Chinese]);
