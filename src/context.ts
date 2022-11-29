"use client";
import {createContext} from "react";
import {defaultSettings, TranslationSettings} from "./settings.js";

export const TranslationContext = createContext<
    Partial<TranslationSettings> & {
        language: TranslationSettings["language"];
    }
>(defaultSettings);
export const TranslationProvider = TranslationContext.Provider;
