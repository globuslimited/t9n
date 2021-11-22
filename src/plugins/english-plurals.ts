export const englishPlurals = (count: number | string) => {
    return +count === 1 ? "" : "_plural";
};
