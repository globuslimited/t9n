import { applyTemplate } from "shared/helper.js";

type Handler<Options> = (options: Options, language: string) => string;

export type Extension<Arguments, BasicOptions extends {}> = <TemplateOptions extends {}>(
    translation: Arguments,
) => {
    __isExtension: true;
    supportedLanguages?: string[];
    handler: Handler<BasicOptions & TemplateOptions>;
};

export const createExtension = <Arguments, BasicOptions extends {} = {}>(
    // actually second argument is not BasicOptions but if i use generics it doesn't inherit basic type so let plugins think it's just basic options
    translate: (translation: Arguments, options: BasicOptions, language: string) => string,
    supportedLanguages?: string[],
): Extension<Arguments, BasicOptions> => {
    return <TemplateOptions extends {} = {}>(translation: Arguments) => {
        return {
            __isExtension: true,
            supportedLanguages,
            handler: (options: BasicOptions & TemplateOptions, language) =>
                applyTemplate(translate(translation, options, language), options),
        };
    };
};
