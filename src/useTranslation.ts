"use client";
import {useContext} from "react";
import {TranslationContext} from "./context.js";
import {defaultSettings, mergeSettings} from "./settings.js";
import {extend, Translation} from "./translation.js";
import type {PackedPlugin} from "./plugin.js";
import {Language, TranslationMap} from "./basic.js";
import {generateTranslationFunction, UseTranslationOptions} from "./translationFunction.js";

export const useTranslation = (translation?: Translation | TranslationMap, options?: UseTranslationOptions) => {
    const settingsPatch = useContext(TranslationContext);
    const settings = mergeSettings(defaultSettings, settingsPatch);
    const {fallbackLanguages, translations, plugins, language} = settings;

    if (language == null) {
        throw new Error("Please set the current language!");
    }

    const translationMap = translation == null ? translations : extend(translations, translation).translationMap;

    return {
        t: generateTranslationFunction(
            translationMap,
            language,
            (fallbackLanguages ?? []) as Language[],
            (plugins ?? []) as PackedPlugin[],
            options ?? {},
        ),
        language,
        fallbackLanguages,
    };
};

export type UseTranslationResponse = ReturnType<typeof useTranslation>;
