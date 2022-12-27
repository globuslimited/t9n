import {TranslationProperties} from "../shared/basic.js";
import {plugin, TranslationPlugin} from "../shared/plugin.js";

const sexPlugin: TranslationPlugin = (params: TranslationProperties) => {
    if (params.sex === "male") {
        return ["male"];
    }
    if (params.sex === "female") {
        return ["female"];
    }
    return [];
};

export default plugin("sex-plugin", sexPlugin, ["ru", "en", "zh"]);
