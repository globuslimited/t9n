"use client";
import {createContext} from "react";
import {defaultSettings, TranslationSettings} from "./shared/settings.js";

export const TranslationContext = createContext<Partial<TranslationSettings>>(defaultSettings);
export const TranslationProvider = TranslationContext.Provider;
