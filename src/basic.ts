export type TranslationProperties = {
    [key: string]: string | number;
};

export enum Language {
    English = "en",
    Russian = "ru",
    Chinese = "zh",
}

export type TemplateFunction = (args: TranslationProperties) => string;

export type Translation = {
    [key: string]: Translation | string | number | TemplateFunction;
};

export type TranslationMap = {
    [language in Language]?: Translation;
};
