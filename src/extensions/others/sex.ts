import {createExtension} from "../extension.js";

type Settings = {
    male: string;
    female: string;
};

type BasicOptions = {
    sex: "male" | "female";
};

export const sex = createExtension<Settings, BasicOptions>((settings, options, language) => {
    return settings[options.sex];
});
