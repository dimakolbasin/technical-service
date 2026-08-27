import en from "../../content/locales/en.json";
import ka from "../../content/locales/ka.json";
import ru from "../../content/locales/ru.json";
import { LocaleCode } from "../analytics/enums";

export const localeCodes = [
  LocaleCode.Ru,
  LocaleCode.En,
  LocaleCode.Ka,
] as const;

export const LANGUAGE_ORDER = [
  LocaleCode.Ru,
  LocaleCode.Ka,
  LocaleCode.En,
] as const;

export const uiLanguages = [ru, en, ka] as const;
