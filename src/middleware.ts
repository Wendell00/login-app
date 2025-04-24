import { type NextRequest, NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";

import { DEFAULT_LOCALE, i18nConfig } from "@/i18n";
import { routes } from "./utils/routes";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const response = i18nRouter(request, i18nConfig);
  const locale =
    response.headers.get("x-next-i18n-router-locale") ?? DEFAULT_LOCALE;

  if (pathname.includes("/auth")) {
    return response;
  }

  return NextResponse.redirect(
    new URL(`/${locale}${routes.auth.home}`, request.url)
  );
}

export const config = {
  matcher: [
    "/((?!ptBR/auth|enUS/auth|esES/auth|_next/static|_next/image|/images|image|favicon.ico).*)",
  ],
};
