export type TranslationProperties = {
    [key: string]: string | number;
};

export type TemplateFunction = (args: TranslationProperties) => string;

export type Translation = {
    [key: string]: Translation | string | number | TemplateFunction;
};

export type TranslationMap<T extends Translation = Translation, L extends string = string> = {
    [language in L]?: T;
};
