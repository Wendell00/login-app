import type { Config } from "next-i18n-router/dist/types";

import type { Language, Translation } from "./types";

export const DEFAULT_LOCALE: Language = "ptBR";

export const NAMESPACES: Translation[] = ["global"];

export const AVALIABLES_LOCALES: Language[] = ["ptBR", "enUS", "esES"];

export const i18nConfig: Config = {
  defaultLocale: DEFAULT_LOCALE,
  locales: AVALIABLES_LOCALES,
};
