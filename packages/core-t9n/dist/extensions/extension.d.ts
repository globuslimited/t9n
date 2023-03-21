type Handler<Options> = (options: Options, language: string) => string;
export type Extension<Settings, BasicOptions extends {}> = <TemplateOptions extends {}>(settings: Settings) => {
    __isExtension: true;
    supportedLanguages?: string[];
    handler: Handler<BasicOptions & TemplateOptions>;
};
export declare const createExtension: <Settings, BasicOptions extends {} = {}>(translate: (settings: Settings, options: BasicOptions, language: string) => string, supportedLanguages?: string[]) => Extension<Settings, BasicOptions>;
export {};
