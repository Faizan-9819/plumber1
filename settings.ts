// ─────────────────────────────────────────────
//  SITE SETTINGS — edit the values below
// ─────────────────────────────────────────────

export type Language = "en" | "nl";

// Connect the forms to the backend?
// false = nothing is ever sent, forms just show their thank-you message.
export const BACKEND_ENABLED: boolean = false;

// The API link. Only used when BACKEND_ENABLED is true.
export const API_BASE_URL: string = "https://api.getgrowthrocket.com/api/v1/public";

// Turn each language on or off.
// Switching one off makes this a single-language site: that language's URL
// stops existing and anyone who opens it is sent to "/" instead.
// The switched-off language's text stays in the code, it is just unreachable.
export const EN_ENABLED: boolean = true;
export const NL_ENABLED: boolean = false;

// The main language: the one shown on "/", and used for <html lang>.
export const DEFAULT_LANGUAGE: Language = "en";

// Show the EN/NL switcher in the navbar?
// Ignored on a single-language site — there is nothing to switch to.
export const SHOW_LANGUAGE_TOGGLE: boolean = false;

// The URL of each language. Only used when both languages are on;
// a single-language site always lives on "/".
//
//   EN_URL "/"    NL_URL "/nl"   ->  English on "/",  Dutch on "/nl"
//   EN_URL "/en"  NL_URL "/"     ->  Dutch on "/",    English on "/en"
//   EN_URL "/en"  NL_URL "/nl"   ->  both prefixed,   "/" goes to the default one
export const EN_URL: string = "/";
export const NL_URL: string = "/nl";

// ── The four client setups ──────────────────────────────────────────────
//  1. English only     EN_ENABLED true   NL_ENABLED false   DEFAULT "en"
//                      -> English on "/", and /nl sends you to "/"   (this site)
//
//  2. Dutch only       EN_ENABLED false  NL_ENABLED true    DEFAULT "nl"
//                      -> Dutch on "/", and /en sends you to "/"
//
//  3. Dutch on "/"     both true   DEFAULT "nl"   EN_URL "/en"   NL_URL "/"
//                      -> Dutch on "/", English on "/en"
//
//  4. English on "/"   both true   DEFAULT "en"   EN_URL "/"     NL_URL "/nl"
//                      -> English on "/", Dutch on "/nl"
