export const plugin = (name, plugin, supportedLanguages) => {
    return {
        plugin,
        name,
        supportedLanguages,
    };
};
