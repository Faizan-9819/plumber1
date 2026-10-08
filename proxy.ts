import { NextResponse, type NextRequest } from "next/server";
import { SUPPORTED_LOCALES } from "@/app/i18n/config";
import {
  defaultLanguage,
  isLanguageEnabled,
  pathForLanguage,
  rootLanguage,
} from "@/lib/i18n";

// All language routing for app/[locale], driven by settings.ts:
//  - "/en/..." and "/nl/..." are served as-is only when that is the
//    language's own URL. A switched-off language, or one that lives on "/",
//    redirects instead, so every page has exactly one address.
//  - Unprefixed URLs are rewritten internally to whichever language owns "/"
//    (the URL bar keeps the unprefixed path). If none does, they redirect to
//    the main language's URL.
// Redirects stay temporary (307) so flipping a setting is never undone by a
// browser-cached permanent redirect.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefixed = SUPPORTED_LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (prefixed) {
    const ownUrl = `/${prefixed}`;
    const target = isLanguageEnabled(prefixed)
      ? pathForLanguage(prefixed)
      : pathForLanguage(defaultLanguage());
    if (target === ownUrl) return;

    const rest = pathname.slice(ownUrl.length) || "/";
    return redirectTo(request, target, rest);
  }

  const root = rootLanguage();
  if (!root) return redirectTo(request, pathForLanguage(defaultLanguage()), pathname);

  const url = request.nextUrl.clone();
  url.pathname = `/${root}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

function redirectTo(request: NextRequest, base: string, rest: string) {
  const url = request.nextUrl.clone();
  url.pathname = base === "/" ? rest : `${base}${rest === "/" ? "" : rest}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
