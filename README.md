# react-t9n

[![npm module](https://badge.fury.io/js/react-t9n.svg)](https://www.npmjs.org/package/react-t9n) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-t9n)

React-style library for handling translation with focus on flexibility and easy refactoring.

## Why react-t9n?

There many libraries for handling translation in React. We tried to use many of them but most of them are not easy to use and refactor. We found it really hard to find unused translations in huge localization files in our projects.
This library solves this problem by providing a way to define translations for different parts of your application, so they will naturally be easy to handle during refactoring.
We also support parameters in translations, so you can easily pass data to your translations. If your language requires to handle more complex cases, you can write your own plugin.

## Installation

With npm:

```bash
$ npm install --save react-t9n
```

Or with yarn:

```bash
$ yarn add react-t9n
```

## Usage

First of all wrap your app or the part of app that needs translation with TranslationProvider

```tsx
import {TranslationProvider} from "react-t9n";

// Global translations
const ru = {
    hello: "Привет",
    world: "Мир",
};
const en = {
    hello: "Hello",
    world: "World",
};

// Configure fallback and translations for necessary languages
const translationSettings = {
    translations: {
        ru,
        en,
    },
    fallbackLanguage: ["en"],
};

const language = "ru";

<TranslationProvider value={{...translationSettings, language}}>
    <App />
</TranslationProvider>;
```

## Handle translations with useTranslation hook

```tsx
import {useTranslation} from "react-t9n";

const MyComponent: VFC<{
    name: string;
}> = ({name}) => {
    const {t} = useTranslation();
    return (
        <div>
            {t("hello")} {name}
        </div>
    );
};
```

## Define local translations for different blocks of your app or components

```tsx
import {translation, useTranslation} from "react-t9n";

const localTranslation = translation({
    ru: {
        openProfile: "Открыть профиль",
    },
    en: {
        openProfile: "Open profile",
    },
});

const MyComponent: VFC<{
    name: string;
}> = ({name}) => {
    const {t} = useTranslation(localTranslation);
    return (
        <div>
            {t("hello")} {name}
            <button>{t("openProfile")}</button>
        </div>
    );
};
```

Local translations with the same names override global ones.

## Nested translations

To make it more structural, you can define nested translation blocks. 
```tsx
import {translation, useTranslation} from "react-t9n";

const localTranslation = translation({
    en: {
        you: {
            can: {
                go: {
                    as: {
                        deep: {
                            as: {
                                you: {
                                    want: "I'm here!"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})


const MyComponent: VFC<{
    name: string;
}> = ({name}) => {
    const {t} = useTranslation(localTranslation);
    return (
        <div>
            {t("hello")} {name}
            <div>{t("you.can.go.as.deep.as.you.want")}</div>
        </div>
    );
};

```
## Extending local translations

## Get more flexible with parameters

Your can define parameters with `{{}}` syntax in your in translation strings.
Then your can inject them as the second parameter of the `t()` function.
```tsx
import {translation, useTranslation} from "react-t9n";

const localTranslation = translation({
    ru: {
        lastOnlineTip: "Последний раз был в сети {{hours}} часов назад.",
    },
    en: {
        lastOnlineTip: "Last online {{hours}} hours ago.",
    },
});

const MyComponent: VFC<{
    hours: number;
}> = ({hours}) => {
    const {t} = useTranslation(localTranslation);
    return (
        <div>
            {t("lastOnlineTip", {
                hours: hours,
            })}
        </div>
    );
};
```

## Handling numbers in different languages

There are plugins for two languages out of box.

### English

For english, if property with `_plural` suffix is available and `count` parameter is specified, then for 0 and count > 1 plural form will be used.

```tsx
import {translation, useTranslation} from "react-t9n";

const localTranslation = translation({
    en: {
        onlineTooltip_singular: "There is {{count}} person online";
        onlineTooltip_plural: "There are {{count}} people online";
    }
})

const MyComponent: VFC<{
    hours: number;
}> = ({hours}) => {
    const {t} = useTranslation(localTranslation);
    const peopleAmount = useCountPeople();
    return (
        <div>
            {t('onlineTooltip', {
                count: peopleAmount
            })}
        </div>
    );
};
```

### Russian



### Other languages

If you need to handle special case in other languages, follow the writing plugins section below.

## Writing own plugins

## Authors
This library is written by @faradaytrs and @devchn. You are welcome to propose your ideas and pull requests.