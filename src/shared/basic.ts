export type TranslationProperties = {
    [key: string]: string | number;
};

export type TemplateFunction = (args: TranslationProperties) => string;

export type BasicTranslationUnit = string | number | TemplateFunction;

export type Translation = {
    [key: string]: Translation | BasicTranslationUnit;
};

export type TranslationMap<T extends string = string> = {
    [language in T]?: Translation;
};
