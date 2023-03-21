"use client";
import { useContext } from "react";
import { TranslationContext } from "./context.js";
import { defaultSettings, mergeSettings } from "./shared/settings.js";
import { extend } from "./shared/translation.js";
import { generateTranslationFunction } from "./shared/translationFunction.js";
export const useTranslation = (translation, options) => {
    const settingsPatch = useContext(TranslationContext);
    const settings = mergeSettings(defaultSettings, settingsPatch);
    const { fallbackLanguages, translations, plugins, language } = settings;
    const translationMap = translation == null ? translations : extend(translations, translation).translationMap;
    return {
        t: generateTranslationFunction(translationMap, language, fallbackLanguages ?? [], (plugins ?? []), options ?? {}),
        language,
        fallbackLanguages,
    };
};
