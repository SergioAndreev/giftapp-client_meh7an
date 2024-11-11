import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import WebApp from "@twa-dev/sdk";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

const LANGUAGE_KEY = "user_language";

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

// Verify Telegram environment
if (!WebApp.initData) {
  throw new Error("This app can only be opened in Telegram!");
}

const getUserLanguage = () => {
  const lang = WebApp.initDataUnsafe.user?.language_code || "en";
  return lang.startsWith("ru") ? "ru" : "en";
};

const defaultLanguage = getUserLanguage();

export const changeLanguage = (language: string) => {
  WebApp.CloudStorage.setItem(LANGUAGE_KEY, language, (error, success) => {
    if (!error && success) {
      i18n.changeLanguage(language);
    }
  });
};

const initializeI18n = () => {
  return new Promise((resolve) => {
    WebApp.CloudStorage.getItem(LANGUAGE_KEY, (error, storedLanguage) => {
      const language = error
        ? defaultLanguage
        : storedLanguage || defaultLanguage;

      i18n
        .use(initReactI18next)
        .init({
          resources,
          lng: language,
          fallbackLng: "en",
          interpolation: { escapeValue: false },
          react: { useSuspense: false },
        })
        .then(() => resolve(i18n));
    });
  });
};

export const i18nPromise = initializeI18n();
export default i18n;
