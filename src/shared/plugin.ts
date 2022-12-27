import {TranslationProperties} from "./basic.js";

export type TranslationPlugin = (params: TranslationProperties) => string[];

export const plugin = (name: string, plugin: TranslationPlugin, supportedLanguages: string[]) => {
    return {
        plugin,
        name,
        supportedLanguages,
    };
};

export type PackedPlugin = ReturnType<typeof plugin>;
