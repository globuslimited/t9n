type Handler<Options> = (options: Options, language: string) => string;

export type Extension<Arguments, BasicOptions extends {}> = <CustomOptions extends {}>(
    translation: Arguments,
) => {
    __isExtension: true;
    supportedLanguages: string[];
    handler: Handler<BasicOptions & CustomOptions>;
};

export const createExtension = <Arguments, BasicOptions extends {} = {}>(
    translate: <Options>(translation: Arguments, options: Options, language: string) => string,
    supportedLanguages: string[]
): Extension<Arguments, BasicOptions> => {
    return <CustomOptions extends {} = {}>(translation: Arguments) => {
        return {
            __isExtension: true,
            supportedLanguages,
            handler: (options: BasicOptions & CustomOptions, language) => translate(translation, options, language),
        };
    };
};
