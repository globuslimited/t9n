const variablesRegex = /{{(?<key>\w+)(\|(?<defaultValue>[^}]+))?}}/gm;
export const applyTemplate = (str, params) => {
    const result = str.matchAll(variablesRegex);
    let translationString = str;
    for (const tp of result) {
        const { groups } = tp;
        const { key, defaultValue } = groups;
        const value = params[key] ?? defaultValue;
        if (value != null) {
            const template = defaultValue == null ? `{{${key}}}` : `{{${key}|${defaultValue}}}`;
            translationString = translationString.replace(template, value.toString());
        }
    }
    return translationString;
};
