import { type NextRequest, NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { JwtExpiredError } from 'aws-jwt-verify/error';

import { DEFAULT_LOCALE, i18nConfig } from "@/i18n";
import { routes } from "./utils/routes";
import { CookieKey } from "./utils/enums";
import { NotFoundToken } from "./utils/exceptions";
import { decodeToken, refreshToken } from "./actions/authentication";


export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = i18nRouter(request, i18nConfig);
  const locale =
    response.headers.get('x-next-i18n-router-locale') ?? DEFAULT_LOCALE;

  try {
    const refresh = request.cookies.get(CookieKey.RefreshToken)?.value;

    if (!refresh) {
      throw new NotFoundToken();
    }

    try {
      await decodeToken();
    } catch (error) {
      if (error instanceof JwtExpiredError) {
        const newToken = await refreshToken();
        response.cookies.set({
          name: CookieKey.AccessToken,
          value: newToken.accessToken
        });
      } else {
        throw error;
      }
    }
    return response;
  } catch {
    return NextResponse.redirect(
      new URL(`/${locale}${routes.auth.home}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    "/((?!ptBR/auth|enUS/auth|esES/auth|_next/static|_next/image|/images|image|favicon.ico).*)",
  ],
};
