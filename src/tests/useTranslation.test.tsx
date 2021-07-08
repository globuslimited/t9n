import {renderHook} from "@testing-library/react-hooks";
import {ReactElement, FC} from "react";
import {TranslationProvider} from "../index";
import {useTranslation} from "../useTranslation";

const ContextMockWrapper1 = ({children}) => (
    <TranslationProvider value={{translations: {}, language: "en", fallbackLanguage: "en"}}>
        {children}
    </TranslationProvider>
);

test("should use custom step when incrementing", () => {
    const {t, language} = renderHook(() => useTranslation(), {wrapper});
    
    expect(t()).toBe(2);
});
