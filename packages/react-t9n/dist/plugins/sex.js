import { plugin } from "../shared/plugin.js";
const sexPlugin = (params) => {
    if (params.sex === "male") {
        return ["male"];
    }
    if (params.sex === "female") {
        return ["female"];
    }
    return [];
};
export default plugin("sex-plugin", sexPlugin, ["ru", "en", "zh"]);
