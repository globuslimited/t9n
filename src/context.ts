"use client";
import {createContext} from "react";
import { defaultSettings, TranslationSettings } from "./settings.js";

const TranslationContext2 = createContext<Partial<TranslationSettings>>(defaultSettings);
export const TranslationContext = TranslationContext2;
export const TranslationProvider = TranslationContext.Provider;