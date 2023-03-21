import {test, describe, expect} from "vitest";
import {renderHook} from "@testing-library/react-hooks";
import React, {ReactNode, FC} from "react";
import {useTranslation} from "../useTranslation.js";
import {translation} from "../shared/translation.js";
import {plugin} from "../shared/plugin.js";
import {TranslationProperties} from "../shared/basic.js";
import {TranslationProvider} from "../index.js";
import {defaultSettings} from "../shared/settings.js";

const settings = {
    translations: {
        en: {
            people: "Human",
            people_plural: "People",
            cool: "Cool",
            bad: "bad",
            only: {
                english: "Hello",
            },
            categories: {
                default: "Categories",
                category1: "Category 1",
                category2: "Category 2",
                category3: "Category 3",
                category4: "Category 4",
            },
            multiple: {
                test_plural_female: "women",

                test_male_plural: "men",
                test_male_singular: "a man",
                test_female_singular: "a woman",
            },
        },
        zh: {
            people: "{{people}}个人",
            default: {
                default: "默认",
            },
            cool: "厉害",
            nested: {
                property: "I am nested",
            },
            categories: {
                default: "分类",
                category1: "分类 1",
                category2: "分类 2",
                category3: "分类 3",
                category4: "分类 4",
                plugins_5: "Plugin works!",
            },
        },
        ru: {
            cool: "Крутой",
            people_0: "Людей",
            people_1: "Человек",
            people_2: "Людей",
            people_3: "Людей",
            categories: {
                default: "Категория",
                category1: "Категория 1",
                category2: "Категория 2",
                category3: "Категория 3",
                category4: "Категория 4",
            },
        },
    },
    language: "zh",
    fallbackLanguages: ["en", "ru", "zh"],
    plugins: defaultSettings.plugins.concat(
        plugin(
            "test-plugin",
            (params: TranslationProperties) => {
                const count = +params.count;
                if (Number.isInteger(count)) {
                    return [params.count.toString()];
                }
                return [];
            },
            ["zh"],
        ),
    ),
};
type FCWC<P = {}> = FC<P & {children?: ReactNode | undefined}>;
const ContextMockWrapper: FCWC = ({children}) => <TranslationProvider value={settings}>{children}</TranslationProvider>;

test("should return key if translation not found", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("unknown.property")).toBe("unknown.property");
});

test("language should be currently set language", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(language).toBe("zh");
});

test("should use fallback language property when target property is not available", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("only.english")).toBe("Hello");
});

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
    expect(t("cool", {}, "ru")).toBe("Крутой");
});

test("should support templates", () => {
    const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
    const {t, language} = result.current;
    expect(t("people", {people: 2})).toBe("2个人");
});

test("should support prefixes", () => {
    const {result} = renderHook(
        () =>
            useTranslation(
                {},
                {
                    prefix: "only",
                },
            ),
        {wrapper: ContextMockWrapper},
    );
    const {t} = result.current;
    expect(t("english")).toBe("Hello");
});

describe("plugins", () => {
    test("plugins should add suffix", () => {
        const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
        const {t} = result.current;
        expect(t("categories.plugins", {count: 5}, "zh")).toBe("Plugin works!");
    });
    test("should support multiple plugins at the same time", () => {
        const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
        const {t} = result.current;
        expect(t("multiple.test", {count: 1, sex: "male"})).toBe("a man");
        expect(t("multiple.test", {count: 2, sex: "male"})).toBe("men");
        expect(t("multiple.test", {count: 1, sex: "female"})).toBe("a woman");
        expect(t("multiple.test", {count: 2, sex: "female"})).toBe("women");
    });
    test("should support _plural for english", () => {
        const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
        const {t, language} = result.current;
        expect(t("people", {count: 2}, "en")).toBe("People");
    });
    test("should support russian casing for numbers using count()", () => {
        const {result} = renderHook(() => useTranslation(), {wrapper: ContextMockWrapper});
        const {t, language} = result.current;
        expect(t("people", {count: 1}, "ru")).toBe("Человек");
    });
});

const extendTranslation = translation({
    zh: {
        categories: {
            default: "种类",
            category3: "分类 3",
            category4: "分类 4",
            category7: "分类 7",
        },
    },

    en: {
        categories: {
            default: "Category",
            category3: "Category 3",
            category4: "Category 4",
            category7: "Category 7",
        },
    },
})
    .extend(
        translation({
            ["zh"]: {
                categories: {
                    default: "分类",
                    category1: "分类 1",
                    category2: "分类 2",
                    category6: "分类 6",
                },
            },

            ["en"]: {
                categories: {
                    default: "Category",
                    category1: "Category 1",
                    category2: "Category 2",
                    category6: "Category 6",
                },
            },
        }),
    )
    .extend({
        ["zh"]: {
            categories: {
                default: "分类!",
                category1: "分类 1!",
                category2: "分类 2!",
                category3: "分类 3!",
                category4: "分类 4!",
                category5: "分类 5!",
            },
        },

        ["en"]: {
            categories: {
                default: "Category!",
                category1: "Category 1!",
                category2: "Category 2!",
                category3: "Category 3!",
                category4: "Category 4!",
                category5: "Category 5!",
            },
        },

        ["ru"]: {
            categories: {
                default: "Категория!",
                category1: "Категория 1!",
                category2: "Категория 2!",
                category3: "Категория 3!",
                category4: "Категория 4!",
                category5: "Категория 5!",
            },
        },
    });

describe("extend", () => {
    test("extendTranslation 的正确性", () => {
        expect(extendTranslation.translationMap).toEqual({
            ["zh"]: {
                categories: {
                    default: "种类",
                    category1: "分类 1",
                    category2: "分类 2",
                    category3: "分类 3",
                    category4: "分类 4",
                    category5: "分类 5!",
                    category6: "分类 6",
                    category7: "分类 7",
                },
            },

            ["en"]: {
                categories: {
                    default: "Category",
                    category1: "Category 1",
                    category2: "Category 2",
                    category3: "Category 3",
                    category4: "Category 4",
                    category5: "Category 5!",
                    category6: "Category 6",
                    category7: "Category 7",
                },
            },

            ["ru"]: {
                categories: {
                    default: "Категория!",
                    category1: "Категория 1!",
                    category2: "Категория 2!",
                    category3: "Категория 3!",
                    category4: "Категория 4!",
                    category5: "Категория 5!",
                },
            },
        });
    });

    test("useTranslation 的 extend 特性", () => {
        const {result} = renderHook(() => useTranslation(extendTranslation), {wrapper: ContextMockWrapper});
        const {t, language} = result.current;

        expect(t("cool")).toBe("厉害");
        expect(t("categories.category1", undefined, "ru")).toBe("Категория 1!");
        expect(t("categories.category7")).toBe("分类 7");
    });

    test("关于 default 与 extend", () => {
        const translation1 = translation({
            ["zh"]: {
                category: "分类",
            },

            ["en"]: {
                category: "Category",
            },

            ["ru"]: {
                category: "Категория",
            },
        });

        const translation2 = translation({
            ["zh"]: {
                category: {
                    category1: "分类 1",
                    category2: "分类 2",
                    category3: "分类 3",
                },
            },

            ["en"]: {
                category: {
                    default: "default Category",
                    category1: "Category 1",
                    category2: "Category 2",
                    category3: "Category 3",
                },
            },

            ["ru"]: {
                category: {
                    category1: "Категория 1",
                    category2: "Категория 2",
                    category3: "Категория 3",
                },
            },
        });

        expect(translation1.extend(translation2).translationMap).toEqual({
            ["zh"]: {
                category: {
                    default: "分类",
                    category1: "分类 1",
                    category2: "分类 2",
                    category3: "分类 3",
                },
            },

            ["en"]: {
                category: {
                    default: "Category",
                    category1: "Category 1",
                    category2: "Category 2",
                    category3: "Category 3",
                },
            },

            ["ru"]: {
                category: {
                    default: "Категория",
                    category1: "Категория 1",
                    category2: "Категория 2",
                    category3: "Категория 3",
                },
            },
        });
        expect(translation2.extend(translation1).translationMap).toEqual({
            ["zh"]: {
                category: {
                    default: "分类",
                    category1: "分类 1",
                    category2: "分类 2",
                    category3: "分类 3",
                },
            },

            ["en"]: {
                category: {
                    default: "default Category",
                    category1: "Category 1",
                    category2: "Category 2",
                    category3: "Category 3",
                },
            },

            ["ru"]: {
                category: {
                    default: "Категория",
                    category1: "Категория 1",
                    category2: "Категория 2",
                    category3: "Категория 3",
                },
            },
        });

        expect(
            translation({
                zh: {
                    category: {
                        default: "default 分类",
                    },
                },
            }).extend({
                zh: {
                    category: "分类",
                },
            }).translationMap,
        ).toEqual({
            zh: {
                category: {
                    default: "default 分类",
                },
            },
        });

        expect(
            translation({
                zh: {
                    category: {
                        category1: "分类1",
                    },
                },
            }).extend({
                zh: {
                    category: "分类",
                },
            }).translationMap,
        ).toEqual({
            zh: {
                category: {
                    default: "分类",
                    category1: "分类1",
                },
            },
        });

        expect(
            translation({
                zh: {
                    category: "分类",
                },
            }).extend({
                zh: {
                    category: {
                        category1: "分类1",
                    },
                },
            }).translationMap,
        ).toEqual({
            zh: {
                category: {
                    default: "分类",
                    category1: "分类1",
                },
            },
        });

        expect(
            translation({
                zh: {
                    category: "分类",
                },
            }).extend({
                zh: {
                    category: {
                        default: "default 分类",
                    },
                },
            }).translationMap,
        ).toEqual({
            zh: {
                category: {
                    default: "分类",
                },
            },
        });
    });

    test("use template function for translation", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    en: {
                        foo: ({count}) => `${count} foo`,
                    },
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t, language} = result.current;

        expect(t("foo", {count: 2})).toBe("2 foo");
    });
});

describe("测试 fallbackLanguages 功能", () => {
    test("没有中文或俄文的时候，显示英文", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    zh: {},
                    ru: {},
                    en: {
                        name: "name",
                    },
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t} = result.current;

        expect(t("name", {}, "zh")).toBe("name");
        expect(t("name", {}, "ru")).toBe("name");
        expect(t("name", {}, "en")).toBe("name");
    });

    test("没有中文或英文的时候，显示俄文", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    zh: {},
                    en: {},
                    ru: {
                        name: "название",
                    },
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t} = result.current;

        expect(t("name", {}, "zh")).toBe("название");
        expect(t("name", {}, "ru")).toBe("название");
        expect(t("name", {}, "en")).toBe("название");
    });

    test("没有俄文或英文的时候，显示中文", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    zh: {
                        name: "名字",
                    },
                    en: {},
                    ru: {},
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t} = result.current;

        expect(t("name", {}, "zh")).toBe("名字");
        expect(t("name", {}, "ru")).toBe("名字");
        expect(t("name", {}, "en")).toBe("名字");
    });

    test("没有中文的时候，优先显示英文", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    zh: {},
                    en: {
                        name: "name",
                    },
                    ru: {
                        name: "название",
                    },
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t} = result.current;

        expect(t("name", {}, "zh")).toBe("name");
        expect(t("name", {}, "ru")).toBe("название");
        expect(t("name", {}, "en")).toBe("name");
    });

    test("没有俄文的时候，优先显示英文", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    zh: {
                        name: "名字",
                    },
                    en: {
                        name: "name",
                    },
                    ru: {},
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t} = result.current;

        expect(t("name", {}, "zh")).toBe("名字");
        expect(t("name", {}, "ru")).toBe("name");
        expect(t("name", {}, "en")).toBe("name");
    });

    test("没有英文的时候，优先显示俄文", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    zh: {
                        name: "名字",
                    },
                    en: {},
                    ru: {
                        name: "название",
                    },
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t} = result.current;

        expect(t("name", {}, "zh")).toBe("名字");
        expect(t("name", {}, "ru")).toBe("название");
        expect(t("name", {}, "en")).toBe("название");
    });
});

describe("useTranslation hook should be context independent", () => {
    test("Should work fine without context", () => {
        const {result} = renderHook(() =>
            useTranslation({
                zh: {
                    name: "名字",
                },
                en: {},
                ru: {
                    name: "название",
                },
            }),
        );
        expect(result.current.t("name", {}, "ru")).toBe("название");
    });
    test("Plugins should work without context", () => {
        const {result} = renderHook(() =>
            useTranslation({
                zh: {
                    name: "名字",
                },
                en: {
                    name_singular: "Name",
                    name_plural: "Names",
                },
                ru: {
                    name: "название",
                },
            }),
        );
        expect(result.current.t("name", {count: 0}, "en")).toBe("Names");
    });
});

describe("using function in template settings", () => {
    test("using simple template syntax with components", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    zh: {},
                    ru: {},
                    en: {
                        name: "My name is {{name|Chuck}}", // Provide instant value
                    },
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t} = result.current;

        expect(t("name", {name: "Jimmy"}, "zh")).toBe("My name is Jimmy"); // Completely replace if new value is provided
    });
    test("Should use default value if no template is used", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    zh: {},
                    ru: {},
                    en: {
                        name: "My name is {{name|Chuck}}",
                    },
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t} = result.current;

        expect(t("name", {}, "zh")).toBe("My name is Chuck");
    });

    test("Should not break when template is repeated many times with different values", () => {
        const {result} = renderHook(
            () =>
                useTranslation({
                    zh: {},
                    ru: {},
                    en: {
                        name: "{{name}}, {{name}} and {{name|Chuck}} and {{name|Jimmy}}",
                    },
                }),
            {wrapper: ContextMockWrapper},
        );
        const {t} = result.current;

        expect(t("name", {}, "zh")).toBe("{{name}}, {{name}} and Chuck and Jimmy");
        expect(
            t(
                "name",
                {
                    name: "Jack",
                },
                "zh",
            ),
        ).toBe("Jack, Jack and Jack and Jack");
    });
    // test("Make new value based on the old one", () => {
    //     const {result} = renderHook(
    //         () =>
    //             useTranslation({
    //                 zh: {},
    //                 ru: {},
    //                 en: {
    //                     name: "{{names|Jimmy}}",
    //                 },
    //             }),
    //         {wrapper: ContextMockWrapper},
    //     );
    //     const {t} = result.current;

    //     expect(
    //         t(
    //             "name",
    //             {
    //                 names: initialValue => {
    //                     return `${initialValue} and Chuck`;
    //                 },
    //             },
    //             "zh",
    //         ),
    //     ).toBe("Jimmy and Chuck");
    // });
    // test("Support injecting jsx", () => {
    //     const {result} = renderHook(
    //         () =>
    //             useTranslation({
    //                 zh: {},
    //                 ru: {},
    //                 en: {
    //                     name: "{{names|Jimmy}}",
    //                 },
    //             }),
    //         {wrapper: ContextMockWrapper},
    //     );
    //     const {t} = result.current;

    //     expect(
    //         t(
    //             "name",
    //             {
    //                 names: initialValue => {
    //                     return (
    //                         <span>
    //                             <span style={{color: "blue"}}>{initialValue}</span> and Chuck
    //                         </span>
    //                     );
    //                 },
    //             },
    //             "zh",
    //         ),
    //     ).toBe("Jimmy and Chuck");
    // });
});
