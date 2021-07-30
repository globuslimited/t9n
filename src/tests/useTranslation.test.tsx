import {renderHook} from "@testing-library/react-hooks/native";
import {FC} from "react";
import React = require("react");
import {Language, TranslationSettings} from "../context";
import {TranslationProvider} from "../index";
import {useTranslation} from "../useTranslation";

const settings: TranslationSettings = {
    translations: {
        [Language.English]: {
            people: "Human",
            people_plural: "People",
            cool: "Cool",
            bad: "bad",
            only: {
                english: "Hello",
            },
        },
        [Language.Chinese]: {
            people: "{{people}}个人",
            default: {
                default: "默认",
            },
            cool: "厉害",
            nested: {
                property: "I am nested",
            },
        },
        [Language.Russian]: {
            cool: "Крутой",
            people_0: "Людей",
            people_1: "Человек",
            people_2: "Людей",
            people_3: "Людей",
        },
    },
    language: Language.Chinese,
    fallbackLanguage: Language.English,
};

const ContextMockWrapper: FC = ({children}) => <TranslationProvider value={settings}>{children}</TranslationProvider>;

test("should return key if translation not found", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("unknown.property")).toBe("unknown.property");
});

test("language should be currently set language", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(language).toBe(Language.Chinese);
});

test("should use fallback language property when target property is not available", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t('only.english')).toBe("Hello");
})

test("should return translation when key is correct", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("cool")).toBe("厉害");
});

test("should return correct translation when property is nested", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("nested.property")).toBe("I am nested");
});

test("should fallback to default property when target property is an object", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("default")).toBe("默认");
});

test("should support enforcing specific language", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("cool", {}, Language.Russian)).toBe("Крутой");
});

test("should support russian casing for numbers using count()", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("people", {count: 1}, Language.Russian)).toBe("Человек");
});

test("should support _plural for english", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("people", {count: 2}, Language.English)).toBe("People");
});

test("should support templates", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("people", {people: 2})).toBe("2个人");
});
