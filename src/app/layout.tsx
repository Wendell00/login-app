import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "@/providers/translation-provider";
import { RouteParams } from "@/utils/types";
import { getTranslation, NAMESPACES } from "@/i18n";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { ThemeMuiProvider } from "@/providers/theme-mui-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
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
      <body className={`${inter.className} ${poppins.className}`}>
        <ReactQueryProvider>
          <TranslationProvider
            locale={locale}
            namespaces={NAMESPACES}
            resources={resources}
          >
            <ThemeMuiProvider>
              <main className="w-full h-screen">{children}</main>
            </ThemeMuiProvider>
          </TranslationProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
