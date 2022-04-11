export type {PackedPlugin} from "./plugin.js";
export type {UseTranslationResponse, DictFunction} from "./useTranslation.js";
export type {TranslationSettings} from "./context.js";
export type {TranslationMap, Translation, TemplateFunction, TranslationProperties} from "./basic.js";

export {TranslationContext} from "./context.js";
export {useTranslation} from "./useTranslation.js";
export {Language} from "./basic.js";
export {plugin} from "./plugin.js";
export {translation} from "./translation.js";

import {TranslationContext} from "./context.js";
export const TranslationProvider = TranslationContext.Provider;
