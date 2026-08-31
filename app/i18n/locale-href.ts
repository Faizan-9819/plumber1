import type { Locale } from "./config";

const NL_PREFIX = "/nl";

// Pages whose slug changes between EN and NL
const NL_SLUG_MAP: Record<string, string> = {
  "/website-for-electricians": "/website-voor-elektriciens",
  "/partner-network": "/partnernetwerk",
};

const EN_SLUG_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(NL_SLUG_MAP).map(([en, nl]) => [nl, en])
);

export function stripLocalePrefix(pathname: string): string {
  if (!pathname) return "/";
  if (pathname === NL_PREFIX) return "/";
  if (pathname.startsWith(`${NL_PREFIX}/`)) {
    return pathname.slice(NL_PREFIX.length) || "/";
  }
  return pathname;
}

export function localizedHref(href: string, locale: Locale): string {
  if (!href) return href;
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return href;
  }

  if (locale !== "nl") {
    // Going to EN — strip /nl prefix and map NL slugs back to EN slugs
    const stripped = stripLocalePrefix(href);
    return EN_SLUG_MAP[stripped] ?? stripped;
  }

  if (!href.startsWith("/")) return href;
  if (href === "/") return NL_PREFIX;
  if (href.startsWith(`${NL_PREFIX}/`) || href === NL_PREFIX) return href;

  // Map EN slugs to their NL equivalents before prefixing
  const nlSlug = NL_SLUG_MAP[href] ?? href;
  return `${NL_PREFIX}${nlSlug}`;
}
