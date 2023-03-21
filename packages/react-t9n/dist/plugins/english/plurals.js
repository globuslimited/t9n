import { plugin } from "../../shared/plugin.js";
const englishPlurals = (params) => {
    const count = +params.count;
    if (Number.isInteger(count)) {
        if (Math.abs(count) === 1) {
            return ["singular"];
        }
        else {
            return ["plural"];
        }
    }
    return [];
};
export default plugin("english-plurals", englishPlurals, ["en", "zh"]);
