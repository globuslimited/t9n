/// <reference types=".pnpm/ts-toolbelt@6.15.5/node_modules/ts-toolbelt" />
import { TranslationMap } from "./basic.js";
import type { PackedPlugin } from "./plugin.js";
type Language = string;
export type TranslationSettings = {
    /**
     * @deprecated Don't use global translations, they will be remove in the next major release.
     */
    translations: TranslationMap;
    language: Language;
    fallbackLanguages: Language[];
    plugins: PackedPlugin[];
};
export declare const defaultSettings: {
    fallbackLanguages: string[];
    language: string;
    translations: {
        en: {};
    };
    plugins: {
        plugin: import("./plugin.js").TranslationPlugin;
        name: string;
        supportedLanguages: string[];
    }[];
};
export declare const mergeSettings: <TParent extends Partial<TranslationSettings>, TChildren extends Partial<TranslationSettings>>(parent: TParent, children: TChildren) => import("Object/Merge").MergeFlat<import("List/ObjectOf").ObjectOf<TChildren>, import("List/ObjectOf").ObjectOf<TParent>, 1, import("Misc/BuiltInObject").BuiltInObject>;
export {};
