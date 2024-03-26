"use client";
import {useContext} from "react";
import {TranslationContext} from "./context.js";
import {defaultSettings, mergeSettings} from "./shared/settings.js";
import {Translation} from "./shared/translation.js";
import type {PackedPlugin} from "./shared/plugin.js";
import {TranslationMap} from "./shared/basic.js";
import {generateTranslationFunction, UseTranslationOptions} from "./shared/translationFunction.js";

export const useTranslation = (translation: Translation | TranslationMap, options?: UseTranslationOptions) => {
    const settingsPatch = useContext(TranslationContext);
    const settings = mergeSettings(defaultSettings, settingsPatch);
    const {fallbackLanguages, plugins, language} = settings;
    const translationMap = translation.__isTranslation ? (translation as Translation).translationMap : translation as TranslationMap;
    return {
        t: generateTranslationFunction(
            translationMap,
            language,
            fallbackLanguages ?? [],
            (plugins ?? []) as PackedPlugin[],
            options ?? {},
        ),
        language,
        fallbackLanguages,
    };
};

export type UseTranslationResponse = ReturnType<typeof useTranslation>;
