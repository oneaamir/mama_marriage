import { useEffect, useState, useCallback } from "react";

const LANG_KEY = "wedding_lang";

export function useLanguage(defaultLang = "en") {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return defaultLang;
    return window.localStorage.getItem(LANG_KEY) || defaultLang;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANG_KEY, lang);
      document.documentElement.lang = lang === "hi" ? "hi" : "en";
    }
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === "en" ? "hi" : "en")), []);
  return { lang, setLang, toggle };
}

export function t(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.en ?? "";
}

export function langClass(lang) {
  return lang === "hi" ? "font-hindi" : "font-display";
}
