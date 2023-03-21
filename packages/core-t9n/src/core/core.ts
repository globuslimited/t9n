type Primitive = string | number;

export interface Scheme {
    [key: PropertyKey]: Primitive | Scheme;
}

type Dictionary<Languages extends string, T extends Scheme> = {
    [key in Languages]: T;
};

interface DictionaryProperties<Language extends string = string> {
    language?: Language;
}

const dictionary = <Language extends string, T extends Scheme>(
    dictionary: Dictionary<Language, T>,
    {language}: DictionaryProperties<Language> = {},
) => {
    const selectedLanguage = language ?? (process.env.LANGUAGE as Language);
    const bind = (language: Language = selectedLanguage) => {
        return dictionary[language];
    };
    return {
        __scheme: dictionary,
        __bind: bind,
        typed: bind(),
    };
};

const {typed} = dictionary({
    ru: {
        hello: "world",
        deep: {
            deep: "property",
        },
    },
    en: {
        hello: "world english",
        deep: {
            deep: "property english",
        },
    },
});

typed.hello;
typed.deep.deep;
