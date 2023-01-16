type Handler<Options> = (options: Options, language: string) => string;

export type Extension<Arguments extends {}, BasicOptions extends {} = {}> = <CustomOptions extends {} = {}>(
    translation: Arguments,
) => {
    __isExtension: true;
    supportedLanguages: string[];
    handler: Handler<BasicOptions & CustomOptions>;
};

const createExtension = <Arguments extends {}, BasicOptions extends {} = {}>(
    translate: <Options>(translation: Arguments, options: Options, language: string) => string,
): Extension<Arguments, BasicOptions> => {
    return <CustomOptions extends {} = {}>(translation: Arguments) => {
        return {
            __isExtension: true,
            supportedLanguages: ["ru"],
            handler: (options, language) => translate<BasicOptions & CustomOptions>(translation, options, language),
        };
    };
};

const russian = createExtension<
    {
        0: string;
        1: string;
        2: string;
        3: string;
    },
    {
        count: number;
    }
>((translation, options, _language: string) => {
    return translation[options.count];
});

russian<{hello: 1}>({
    0: "hello 0",
    1: "hello 1",
    2: "hello 2",
    3: "hello 3",
});

type Check = ReturnType<typeof russian> extends {__isExtension: true} ? true : false;
