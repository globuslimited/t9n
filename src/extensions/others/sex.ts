import {createExtension} from "../extension.js";

type Arguments = {
    male: string,
    female: string
}

type BasicOptions = {
    sex: "male" | "female"
}

export const sex = createExtension<Arguments, BasicOptions>((translation, options, language) => {
    return translation[options.sex]
}, ["ru", "en", "zh"]);
