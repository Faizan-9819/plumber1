# Template Globalization Guide — AquaFlow plumber template

`settings.ts` at the project root holds every switch that differs between clones of this template:
whether the forms talk to a backend, which languages the site ships, which one is the main language,
whether the language switcher is shown, and what each language's URL is.

Cloning a site should mean editing **one file**. This guide covers that file and how it is wired in
*this* template. The same system exists in the logistics template, but this one routes languages
differently (one `app/[locale]` route plus `proxy.ts`), see §5.

`settings.ts`, `lib/api.ts` and `lib/i18n.ts` are byte-identical to the logistics template's copies.
They are the shared surface across clones, so keep the variable and helper names as they are.

---

## 1. The settings

The settings in `settings.ts`, at this client's current values (the file itself also carries
explanatory comments):

```ts
export type Language = "en" | "nl";

export const BACKEND_ENABLED: boolean = false;
export const API_BASE_URL: string = "https://api.getgrowthrocket.com/api/v1/public";

export const EN_ENABLED: boolean = true;
export const NL_ENABLED: boolean = false;

export const DEFAULT_LANGUAGE: Language = "en";
export const SHOW_LANGUAGE_TOGGLE: boolean = false;

export const EN_URL: string = "/";
export const NL_URL: string = "/nl";
```

| Setting | Values | What it does |
| --- | --- | --- |
| `BACKEND_ENABLED` | `true` / `false` | Master switch for every API call. `false` = fully static site; the forms never contact the API. |
| `API_BASE_URL` | URL string | The API link. Required when `BACKEND_ENABLED` is `true`, ignored completely when `false`. |
| `EN_ENABLED` | `true` / `false` | Turns English on or off. When off, `/en` redirects to `/`. |
| `NL_ENABLED` | `true` / `false` | Turns Dutch on or off. When off, `/nl` redirects to `/`. |
| `DEFAULT_LANGUAGE` | `"en"` / `"nl"` | The main language: the one served from `/` on a single-language site, and where `/` redirects when neither language owns it. |
| `SHOW_LANGUAGE_TOGGLE` | `true` / `false` | Shows/hides the EN/NL switcher in the header. Ignored on a single-language site. |
| `EN_URL` | `"/"` or `"/en"` | The URL English is served from. Only used when both languages are on. |
| `NL_URL` | `"/"` or `"/nl"` | The URL Dutch is served from. Only used when both languages are on. |

**This clone right now:** setup 1, English only. Dutch is switched off, the switcher is hidden and
the backend is disconnected. The Dutch copy is still in every component. It can't be reached right
now, but it hasn't been deleted, and it comes back as soon as `NL_ENABLED` is set to `true`.

### The four client setups

| # | Client wants | `EN_ENABLED` | `NL_ENABLED` | `DEFAULT_LANGUAGE` | `EN_URL` | `NL_URL` | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | English only | `true` | `false` | `"en"` | — | — | `/` English; `/en` and `/nl` send you to `/` |
| 2 | Dutch only | `false` | `true` | `"nl"` | — | — | `/` Dutch; `/en` and `/nl` send you to `/` |
| 3 | Both, Dutch on the domain | `true` | `true` | `"nl"` | `"/en"` | `"/"` | `/` Dutch, `/en` English, `/nl` → `/` |
| 4 | Both, English on the domain | `true` | `true` | `"en"` | `"/"` | `"/nl"` | `/` English, `/nl` Dutch, `/en` → `/` |

All four were checked in Chrome against the running dev server, with the switcher setting both on
and off. On a single-language site the `*_URL` settings are ignored: the remaining language is
always served from `/`, the switched-off language's URL redirects there, and the switcher never
renders, even with `SHOW_LANGUAGE_TOGGLE = true`. No translations are deleted, so moving a client
between any two setups is only a settings edit.

---

## 2. Backend on / off

### `BACKEND_ENABLED = false`: fully static

No form contacts the API:

| Behaviour | What happens instead |
| --- | --- |
| Enquiry form's service dropdown (the Contact section and the enquiry modal both render `LeadEnquiryForm`) | Filled from `STATIC_SERVICES` in `app/global/LeadEnquiryForm.tsx`. The consultation is filtered out, so the only option is "Plumber1". |
| Enquiry form submit | Validates locally (required fields, phone and email patterns), then shows "Message Sent!" / "Bericht verzonden!". Nothing is sent. |
| Booking modal's service list | Filled from `STATIC_SERVICES` in `app/global/BookingForm.tsx` (Plumber1 and Consultation), plus `STATIC_SETTINGS` for slot interval, minimum notice and booking window. |
| Booking modal's date/time slots | Built in the browser by `generateSlotsByDate()`: a 09:00–17:00 grid in the visitor's own time zone, every `slotIntervalMinutes` (30), skipping anything inside `minNoticeMinutes` (60). `STATIC_SETTINGS.timezone` is not used for this. |
| Booking modal submit | Jumps straight to the "Thanks, <name>!" step. Nothing is sent. |

All three forms were completed with the backend off, once in English (setup 1) and once in Dutch
(setup 2). Each reached its thank-you message, with **0 requests to `api.getgrowthrocket.com`** out
of 144 requests per run. The only other external hosts were image hosts (`images.unsplash.com`,
`plus.unsplash.com`, `i.pravatar.cc`), not the API.

The forms keep their loading and error UI. With the backend off it never triggers, because there is
nothing to wait for and nothing that can fail.

### `BACKEND_ENABLED = true`: live

Set `API_BASE_URL` to the API root (no trailing slash needed; `apiUrl()` tolerates one). The same
forms then fetch their service lists and POST their submissions. No other file changes.

Endpoints used, all built with `apiUrl(...)`:

| Call | Endpoint | Used by |
| --- | --- | --- |
| Service list | `GET {API_BASE_URL}/bookings/settings` | both forms |
| Available slots | `GET {API_BASE_URL}/bookings/slots?serviceId=…&from=…&to=…` | booking modal |
| Booking | `POST {API_BASE_URL}/bookings` | booking modal |
| Enquiry | `POST {API_BASE_URL}/enquiries` | enquiry form |

`isBackendEnabled()` returns true only when the switch is on **and** `API_BASE_URL` is non-empty, so
half-filled settings can never fire requests at a bad URL.

> **The API picks the tenant from the request's host.** The bare
> `GET {API_BASE_URL}/bookings/settings` returns
> `404 "Active published site not found for this host"`, both from a terminal and from the site
> running on `localhost:3000`. With `BACKEND_ENABLED = true` on localhost, every settings request
> returned 404, and the booking modal showed "Couldn't load booking options (HTTP 404)." Live mode
> only works once the site is served from the host the backend has registered for it. A full live
> round-trip has **not** been tested from this repo; nothing was submitted with the backend on.

### Capturing the static service list

When turning a live site static, snapshot the real services once and paste them into the
`STATIC_SERVICES` constant in each form, and the `settings` block into `STATIC_SETTINGS` in
`BookingForm.tsx`. Because of the host-based tenant lookup above, use the tenant-scoped route
(`| jq '.services'` is optional, if you have jq):

```bash
curl -s "https://api.getgrowthrocket.com/api/v1/public/tenants/plumber1/sites/plumber1/bookings/settings"
```

The current constants come from that call (tenant `plumber1`, site `plumber1`, taken 2026-10-08):

| id | name | slug | duration | price | `isConsultation` |
| --- | --- | --- | --- | --- | --- |
| 101 | Plumber1 | `plumber1` | 30 min | none | `false` |
| 102 | Consultation | `consultation` | 15 min | 0 | `true` |

Settings: `Europe/Amsterdam`, 30-minute slots, 60-minute minimum notice, 30-day window, no buffers.
"Plumber1" is the name the backend currently holds for this site's service. Rename it there and
re-snapshot, rather than editing only the constants.

---

## 3. Language settings in detail

### `EN_ENABLED` / `NL_ENABLED`

Turn each language on or off. Switching one off makes the site single-language: the remaining
language is served from `/`, and the switched-off language's URL **redirects to `/` rather than
404ing**, so old links and stray bookmarks still land somewhere sensible. A sub-path is carried
across: `/nl/anything` → `/anything`.

The switched-off language's copy stays in the components. It can't be reached, but it isn't deleted.

If both are set to `false`, `DEFAULT_LANGUAGE` is used on its own (checked: both off with
`DEFAULT_LANGUAGE = "nl"` serves Dutch on `/`), so a slip in the settings can't leave the site with
no language at all.

### `DEFAULT_LANGUAGE`

The main language. On a single-language site it is the one served from `/`, and when neither
language owns `/` it is where `/` redirects. If it points at a switched-off language, the enabled
one wins instead (checked: English only with `DEFAULT_LANGUAGE = "nl"` still serves English on `/`).

`<html lang>` is **not** taken from this setting. `app/[locale]/layout.tsx` sets it from the language
of the page actually being served, so on a bilingual site `/nl` gets `lang="nl"` and the English URL
gets `lang="en"`.

### `SHOW_LANGUAGE_TOGGLE`

`false` hides the EN/NL switcher in both places it appears, both in `app/components/Header.tsx`: the
header bar from the `sm` breakpoint up, and the mobile header bar below `sm`. The mobile menu drawer
has no switcher. The site simply stays in whichever language the URL resolves to.

It is ignored entirely on a single-language site, since there would be nothing to switch to.

Hiding the switcher does **not** remove translations. On a bilingual site the other language is
still served at its own URL; visitors just have no button for it.

### `EN_URL` / `NL_URL`: the language URLs

On a bilingual site, set each language's URL directly. One of them normally takes `"/"`, the other
its own prefix.

| `EN_URL` | `NL_URL` | `/` | `/en` | `/nl` |
| --- | --- | --- | --- | --- |
| `"/"` | `"/nl"` | English | → redirects to `/` | Dutch |
| `"/en"` | `"/"` | Dutch | English | → redirects to `/` |
| `"/en"` | `"/nl"` | → redirects to `DEFAULT_LANGUAGE`'s URL | English | Dutch |

Allowed values are `"/"` or `"/en"` for English and `"/"` or `"/nl"` for Dutch, the only prefixes
the `[locale]` route accepts. Whichever language sits at `/` gives up its prefixed URL, so every
language keeps exactly one address and search engines never see the same page twice.

All redirects are **307 (temporary)** on purpose: a cached permanent redirect would keep sending
browsers to the old URL after a setting is flipped.

---

## 4. How it is wired

Settings live in one file; the small amount of logic that reads them lives in `lib/`. Every routing
decision is made in `proxy.ts`; no component makes one on its own.

| File | Reads | Purpose |
| --- | --- | --- |
| `settings.ts` | — | The switches. Values only, no logic. |
| `lib/api.ts` | `BACKEND_ENABLED`, `API_BASE_URL` | `isBackendEnabled()`, `apiUrl()`. |
| `lib/i18n.ts` | `EN_ENABLED`, `NL_ENABLED`, `DEFAULT_LANGUAGE`, `EN_URL`, `NL_URL` | All language/URL resolution. |
| `proxy.ts` | `lib/i18n` | All language routing: rewrites unprefixed URLs to the language that owns `/`, and redirects switched-off and non-canonical language URLs. |
| `app/i18n/config.ts` | `Language` type | `SUPPORTED_LOCALES` (the languages with copy, i.e. the values `[locale]` accepts), `Locale`, `isLocale()`, `Translation`. |
| `app/[locale]/layout.tsx` | `lib/i18n` | Root layout. Prerenders only `enabledLanguages()`, sets `<html lang>` from the route's language, and passes it to the provider. |
| `app/[locale]/page.tsx` | — | The page body, shared by every language. |
| `app/i18n/LanguageProvider.tsx` | `lib/i18n` | `useLanguage()` → `{ locale, setLocale, t }`. `locale` is the route param; `setLocale` navigates to `pathForLanguage(next)`. |
| `app/i18n/LanguageToggle.tsx` | — | The EN/NL buttons; calls `setLocale`. |
| `app/components/Header.tsx` | `SHOW_LANGUAGE_TOGGLE`, `lib/i18n` | Renders both switcher instances only when `SHOW_LANGUAGE_TOGGLE && isMultiLanguage()`. |
| `app/global/LeadEnquiryForm.tsx` | `lib/api` | Static vs live services; thank-you vs POST. Used by `app/components/Contact.tsx` and `app/global/EnquiryModal.tsx`. |
| `app/global/BookingForm.tsx` | `lib/api` | Static vs live services, slots and booking submission. |

```ts
// lib/api.ts
isBackendEnabled(): boolean            // switch is on AND a URL is set
apiUrl(path): string                   // joins a path onto API_BASE_URL

// lib/i18n.ts
enabledLanguages(): Language[]         // the languages switched on
isLanguageEnabled(lang): boolean       // is that language shipped at all
isMultiLanguage(): boolean             // are both of them on
defaultLanguage(): Language            // DEFAULT_LANGUAGE, corrected if it is switched off
pathForLanguage(lang): string          // that language's URL ("/" on a single-language site)
rootLanguage(): Language | null        // which language owns "/", if any
languageFromPathname(path): Language   // exported for parity with other clones; unused here (see §5)
```

---

## 5. How this template differs from the logistics template

| Logistics | This template | Why |
| --- | --- | --- |
| `app/page.tsx`, `app/en/page.tsx`, `app/nl/page.tsx`, each calling `redirect()` | One `app/[locale]` route; `proxy.ts` makes every redirect/rewrite decision | This template already had a `[locale]` route and a proxy. They were rewired to read the settings rather than adding a second system. |
| `components/HomePage.tsx` shared by three routes | `app/[locale]/page.tsx` | The dynamic route already serves both languages from one page. |
| Language derived with `languageFromPathname(usePathname())` | Language is the `[locale]` route param | Per the Next.js docs, behind a proxy rewrite `usePathname()` reads the rewritten path on the client, which can cause a hydration mismatch. The param is what the proxy resolved. |
| `<html lang>` = `defaultLanguage()` | `<html lang>` = the served page's language | The root layout is per-language here, so it can be exact. |
| Switcher in three places | Switcher in two places (both in the header bar) | The mobile drawer here has no switcher. |
| Logo links to `pathForLanguage(lang)` | Logo links to `#home` | Single-page site: the anchor is correct on every language URL. |
| Copy in per-component `COPY` maps | Copy inline at each call site as `t({ en, nl })` | How this template was written; typed by `Translation`. |
| Static export (`output: "export"`) | Needs a Node server (`next start`, Vercel, …) | Proxy, rewrites and redirects are not supported by static export. Do not add `output: "export"` here without moving routing to the page-file approach. |

There is no cookie, `Accept-Language` or geo detection: the URL alone decides the language.

---

## 6. Verifying a clone

```bash
npx tsc --noEmit -p .   # types
npx next build          # expect "/[locale]" listing only the enabled languages, plus "ƒ Proxy (Middleware)"
npx eslint app proxy.ts lib settings.ts
```

`eslint` currently reports one error in `app/components/LenisProvider.tsx` (`react-hooks/immutability`).
It predates this system and is unrelated to it.

Then load the running site and check, against the setup table in §1:

- `/`, `/en` and `/nl` each land on the language that table predicts, with the redirects working.
- A switched-off language's URL redirects to `/` instead of erroring.
- The EN/NL switcher appears only when `SHOW_LANGUAGE_TOGGLE` is `true` **and** both languages are
  on, at desktop and mobile widths, and clicking it moves between the two language URLs.
- With `BACKEND_ENABLED = false`, completing the Contact-section form, the enquiry modal and the
  booking modal produces **zero** requests to the API in the devtools Network tab, and each still
  reaches its thank-you.

Flipping the settings temporarily is the fastest way to confirm all four setups behave. Restore the
client's values afterwards.

**Last full check (2026-10-08, Chrome, `next dev`):** all four setups plus the both-prefixed variant,
each with the switcher setting off and on. HTTP status, final URL, `<html lang>`, header language
and switcher presence matched §1 and §3 in every case. The switcher clicked through in setups 3, 4
and both-prefixed. All three forms reached their thank-you with 0 API requests in English and Dutch.
`next build` passed with the client values (only `/en` prerendered).

---

## 7. Notes and gotchas

- **Keep the type annotations** (`: boolean`, `: string`, `: Language`) on every setting. Without
  them TypeScript pins each value to a literal and then reports the opposite branch as an impossible
  comparison the moment you flip a switch.
- **Nothing is deleted when a language is switched off.** Both languages' copy stays in every
  `t({ en, nl })` call, which is what makes moving between the four setups a settings-only change.
- **Static service lists live in the forms, not in settings**, because their shape is form-specific.
  They are only read when the backend is off.
- **The redirects are redirects, not 404s**: a disabled or non-canonical language URL sends the
  visitor to `/` rather than an error page.
- **Policy pages are missing.** The cookie banner links to `/cookie-policy` and `/privacy-policy`
  (`/nl/...` in Dutch), and those routes return 404. Add them under `app/[locale]/` when needed;
  the proxy will route them per language automatically.
- `app/plumber-temp.com.html` is a saved copy of the original template page for reference. Nothing
  imports it and it is not a route.
- **Adding a language** means extending the `Language` union in `settings.ts` and adding its
  `*_ENABLED` and `*_URL` constants; extending `enabledLanguages()` and `pathForLanguage()` in
  `lib/i18n.ts`; extending `SUPPORTED_LOCALES`, `isLocale()` and `Translation` in
  `app/i18n/config.ts` (TypeScript will then flag every `t()` call missing the new key); and adding
  a button to `LanguageToggle.tsx`, which has EN and NL hardcoded. `proxy.ts` needs no change; it
  iterates `SUPPORTED_LOCALES`.
