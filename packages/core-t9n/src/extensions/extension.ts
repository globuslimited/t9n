import { applyTemplate } from "../core/applyTemplate.js";

type Handler<Options> = (options: Options, language: string) => string;

export type Extension<Settings, BasicOptions extends {}> = <TemplateOptions extends {}>(
    settings: Settings,
) => {
    __isExtension: true;
    supportedLanguages?: string[];
    handler: Handler<BasicOptions & TemplateOptions>;
};

export const createExtension = <Settings, BasicOptions extends {} = {}>(
    // actually second argument is not BasicOptions but if i use generics it doesn't inherit basic type so let plugins think it's just basic options
    translate: (settings: Settings, options: BasicOptions, language: string) => string,
    supportedLanguages?: string[],
): Extension<Settings, BasicOptions> => {
    return <TemplateOptions extends {} = {}>(settings: Settings) => {
        return {
            __isExtension: true,
            supportedLanguages,
            handler: (options: BasicOptions & TemplateOptions, language) =>
                applyTemplate(translate(settings, options, language), options),
        };
    };
};
