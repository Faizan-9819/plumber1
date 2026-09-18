import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/app/i18n/config";

// The default locale (en) is served unprefixed at "/", so requests without a
// recognized locale prefix get rewritten internally to "/en/..." — the URL
// bar keeps showing the unprefixed path while Next.js resolves app/[locale].
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const defaultPrefix = `/${DEFAULT_LOCALE}`;

  // Canonicalize: an explicit "/en" URL redirects to its unprefixed form,
  // so the default locale never renders at two different addresses.
  if (pathname === defaultPrefix || pathname.startsWith(`${defaultPrefix}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultPrefix.length) || "/";
    return NextResponse.redirect(url);
  }

  const hasLocalePrefix = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return;

  const url = request.nextUrl.clone();
  url.pathname = `${defaultPrefix}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
