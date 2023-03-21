import { TranslationProperties } from "./basic.js";
export type TranslationPlugin = (params: TranslationProperties) => string[];
export declare const plugin: (name: string, plugin: TranslationPlugin, supportedLanguages: string[]) => {
    plugin: TranslationPlugin;
    name: string;
    supportedLanguages: string[];
};
export type PackedPlugin = ReturnType<typeof plugin>;
