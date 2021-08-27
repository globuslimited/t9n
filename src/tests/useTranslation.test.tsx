import "react";
import {renderHook} from "@testing-library/react-hooks/native";
import {FC} from "react";
import React = require("react");
import {Language, TranslationSettings} from "../context";
import {TranslationProvider} from "../index";
import {useTranslation} from "../useTranslation";
import {translation} from "../translation";

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
            categories: {
                "default": "Categories",
                "category1": "Category 1",
                "category2": "Category 2",
                "category3": "Category 3",
                "category4": "Category 4"
            }
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
            categories: {
                "default": "分类",
                "category1": "分类 1",
                "category2": "分类 2",
                "category3": "分类 3",
                "category4": "分类 4"
            }
        },
        [Language.Russian]: {
            cool: "Крутой",
            people_0: "Людей",
            people_1: "Человек",
            people_2: "Людей",
            people_3: "Людей",
            categories: {
                "default": "Категория",
                "category1": "Категория 1",
                "category2": "Категория 2",
                "category3": "Категория 3",
                "category4": "Категория 4"
            }
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


describe("dict", () => {
    test("默认 mapper 下，dict 通过路径，拿到这个路径下的所有 key，不包括 default", () => {
        const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
        const {t, language, dict} = result.current;
        expect(dict("categories")).toEqual(["category1", "category2", "category3", "category4"]);
    });
    
    describe("mapper", () => {
        test("path 是完整路径", () => {
            const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
            const {t, language, dict} = result.current;
            dict("categories", (key, path) => {
                expect(path).toEqual("categories." + key);
                return key;
            });
        });
    
        test("映射出来的 path，全都正确", () => {
            const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
            const {t, language, dict} = result.current;
            expect(dict("categories", (_key, path) => path)).toEqual(["categories.category1", "categories.category2", "categories.category3", "categories.category4"])
        });

        test("映射出来的 path，全都正确", () => {
            const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
            const {t, language, dict} = result.current;
            expect(dict("categories", (_key, path) => path)).toEqual(["categories.category1", "categories.category2", "categories.category3", "categories.category4"])
        });

        test("映射出 key val", () => {
            const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
            const {t, language, dict} = result.current;
            expect(dict("categories", (_key, path) => t(path))).toEqual(["分类 1", "分类 2", "分类 3", "分类 4"])
        });

        test("切换成英文", () => {
            const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
            const {t, language, dict} = result.current;
            expect(dict("categories", (_key, path) => t(path, undefined, Language.English))).toEqual(["Category 1", "Category 2", "Category 3", "Category 4"])
        });
    });    
});

const extendTranslation = translation({
    [Language.Chinese]: {
        categories: {
            "default": "种类",
            "category3": "分类 3",
            "category4": "分类 4",
            "category7": "分类 7",
        }
    },

    [Language.English]: {
        categories: {
            "default": "Category",
            "category3": "Category 3",
            "category4": "Category 4",
            "category7": "Category 7",
        }
    }
})
.extend(
    translation({
        [Language.Chinese]: {
            categories: {
                "default": "分类",
                "category1": "分类 1",
                "category2": "分类 2",
                "category6": "分类 6"
            }
        },

        [Language.English]: {
            categories: {
                "default": "Category",
                "category1": "Category 1",
                "category2": "Category 2",
                "category6": "Category 6"
            }
        }
    })
)
.extend({
    [Language.Chinese]: {
        categories: {
            "default": "分类!",
            "category1": "分类 1!",
            "category2": "分类 2!",
            "category3": "分类 3!",
            "category4": "分类 4!",
            "category5": "分类 5!",
        }
    },

    [Language.English]: {
        categories: {
            "default": "Category!",
            "category1": "Category 1!",
            "category2": "Category 2!",
            "category3": "Category 3!",
            "category4": "Category 4!",
            "category5": "Category 5!",
        }
    },

    [Language.Russian]: {
        categories: {
            "default": "Категория!",
            "category1": "Категория 1!",
            "category2": "Категория 2!",
            "category3": "Категория 3!",
            "category4": "Категория 4!",
            "category5": "Категория 5!",
        }
    }
})

test("combinTranslation 的正确性", () => {
    expect(extendTranslation.translationMap)
    .toEqual({
        [Language.Chinese]: {
            categories: {
                "default": "种类",
                "category1": "分类 1",
                "category2": "分类 2",
                "category3": "分类 3",
                "category4": "分类 4",
                "category5": "分类 5!",
                "category6": "分类 6",
                "category7": "分类 7",
            }
        },

        [Language.English]: {
            categories: {
                "default": "Category",
                "category1": "Category 1",
                "category2": "Category 2",
                "category3": "Category 3",
                "category4": "Category 4",
                "category5": "Category 5!",
                "category6": "Category 6",
                "category7": "Category 7",
            }
        },

        [Language.Russian]: {
            categories: {
                "default": "Категория!",
                "category1": "Категория 1!",
                "category2": "Категория 2!",
                "category3": "Категория 3!",
                "category4": "Категория 4!",
                "category5": "Категория 5!",
            }
        }
    })
});

test("useTranslation 的 extend 特性", () => {
    const {result} = renderHook(() => useTranslation(extendTranslation), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;

    expect(t("cool")).toBe("厉害");
    expect(t("categories.category1", undefined, Language.Russian)).toBe("Категория 1!");
    expect(t("categories.category7")).toBe("分类 7");
});