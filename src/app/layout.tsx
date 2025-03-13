import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeroProvider } from "@/providers/heroui-provider";
import { TranslationProvider } from "@/providers/translation-provider";
import { RouteParams } from "@/utils/types";
import { getTranslation, NAMESPACES } from "@/i18n";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Login App",
  description: "Application create by Wendell Borges",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<RouteParams>;
}>) {
  const locale = (await params).locale;
  const { resources } = await getTranslation(locale, NAMESPACES);

  return (
    <html lang="en" className="light">
      <body className={`${inter.className}`}>
        <TranslationProvider
          locale={locale}
          namespaces={NAMESPACES}
          resources={resources}
        >
          <HeroProvider>{children}</HeroProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
