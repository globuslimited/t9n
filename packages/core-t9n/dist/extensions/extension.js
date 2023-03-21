import { applyTemplate } from "../core/applyTemplate.js";
export const createExtension = (
// actually second argument is not BasicOptions but if i use generics it doesn't inherit basic type so let plugins think it's just basic options
translate, supportedLanguages) => {
    return (settings) => {
        return {
            __isExtension: true,
            supportedLanguages,
            handler: (options, language) => applyTemplate(translate(settings, options, language), options),
        };
    };
};
