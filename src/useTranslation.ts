'use client'
import {useContext} from "react";
import {mergeDeepRight} from "ramda";
import {TranslationContext} from "./context.js";
import {defaultSettings} from "./settings.js"
import {extend, Translation} from "./translation.js";
import type {PackedPlugin} from "./plugin.js";
import {
    Language,
    TranslationMap,
} from "./basic.js";
import { generateTranslationFunction, UseTranslationOptions } from "./translationFunction.js";

export const useTranslation = (translation?: Translation | TranslationMap, options?: UseTranslationOptions) => {
    const settingsPatch = useContext(TranslationContext);
    const settings = mergeDeepRight(defaultSettings, settingsPatch);
    const {fallbackLanguages, translations, plugins} = settings;
    const translationMap = translation == null ? translations : extend(translations, translation).translationMap;

    return {
        t: generateTranslationFunction(
            translationMap,
            settings.language,
            fallbackLanguages as Language[],
            plugins as PackedPlugin[],
            options ?? {},
        ),
        language: settings?.language ?? fallbackLanguages[0],
        fallbackLanguages,
    };
};

export type UseTranslationResponse = ReturnType<typeof useTranslation>;
