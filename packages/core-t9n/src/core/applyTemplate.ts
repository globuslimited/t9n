const variablesRegex = /{{(?<key>\w+)(\|(?<defaultValue>[^}]+))?}}/gm;
export const applyTemplate = (str: string, params: Record<string, string>) => {
    const result = str.matchAll(variablesRegex);
    let translationString = str;
    for (const tp of result) {
        const {groups} = tp;
        const {key, defaultValue} = groups as {
            key: string;
            defaultValue: string | undefined;
        };
        const value = params[key] ?? defaultValue;
        if (value != null) {
            const template = defaultValue == null ? `{{${key}}}` : `{{${key}|${defaultValue}}}`;
            translationString = translationString.replace(template, value.toString());
        }
    }
    return translationString;
};
