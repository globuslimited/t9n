"use client";
import { createContext } from "react";
import { defaultSettings } from "./shared/settings.js";
export const TranslationContext = createContext(defaultSettings);
export const TranslationProvider = TranslationContext.Provider;
