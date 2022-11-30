"use client";
import {useContext} from "react";
import {TranslationContext} from "./context.js";
import {defaultSettings, mergeSettings} from "./shared/settings.js";
import {extend, Translation} from "./shared/translation.js";
import type {PackedPlugin} from "./shared/plugin.js";
import {Language, TranslationMap} from "./shared/basic.js";
import {generateTranslationFunction, UseTranslationOptions} from "./shared/translationFunction.js";

export const useTranslation = (translation?: Translation | TranslationMap, options?: UseTranslationOptions) => {
    const settingsPatch = useContext(TranslationContext);
    const settings = mergeSettings(defaultSettings, settingsPatch);
    const {fallbackLanguages, translations, plugins, language} = settings;

    const translationMap =
        translation == null ? translations : extend(translations, translation).translationMap;

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
