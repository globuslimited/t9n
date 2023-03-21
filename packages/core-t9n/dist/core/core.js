const dictionary = (dictionary, { language } = {}) => {
    const selectedLanguage = language ?? process.env.LANGUAGE;
    const bind = (language = selectedLanguage) => {
        return dictionary[language];
    };
    return {
        __scheme: dictionary,
        __bind: bind,
        typed: bind(),
    };
};
const { typed } = dictionary({
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
export {};
