import type { Language } from "@/i18n";

export interface RouteParams {
  locale: Language;
}

export type LayoutProps = {
  children: React.ReactNode;
  params: Promise<RouteParams>;
};
