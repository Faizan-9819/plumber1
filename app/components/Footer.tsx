"use client";

import { openCookiePreferences } from "@/app/global/CookieConsent";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { Translation } from "@/app/i18n/config";

const COMPANY_LINKS: { label: Translation; href: string }[] = [
  { label: { en: "About us", nl: "Over ons" }, href: "#about" },
  { label: { en: "Reviews", nl: "Recensies" }, href: "#reviews" },
  { label: { en: "FAQ", nl: "Vragen" }, href: "#faq" },
  { label: { en: "Contact", nl: "Contact" }, href: "#enquiry" },
];

const SERVICE_LINKS: { label: Translation; href: string }[] = [
  { label: { en: "Emergency plumbing", nl: "Spoedloodgieter" }, href: "#services" },
  { label: { en: "Leak repair", nl: "Lekreparatie" }, href: "#services" },
  { label: { en: "Drain unblocking", nl: "Afvoer ontstoppen" }, href: "#services" },
  { label: { en: "Boiler & heating", nl: "Cv-ketel & verwarming" }, href: "#services" },
];

const AREA_LINKS = [
  { label: "Amsterdam", href: "#areas" },
  { label: "Haarlem", href: "#areas" },
  { label: "Utrecht", href: "#areas" },
  { label: "Amstelveen", href: "#areas" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-5 rounded-t-[36px] bg-ink text-[#d9dae0]">
      <div className="fix pt-[clamp(48px,6vw,76px)] pb-[30px]">
        <div className="border-b border-white/12 pb-[46px]">
          <div className="mb-9 max-w-[340px]">
            <div className="mb-4 flex items-baseline gap-px text-[26px] font-extrabold tracking-tight">
              <span className="text-white">Aqua</span>
              <span className="text-grad font-extrabold italic">Flow</span>
            </div>
            <p className="mb-4.5 text-[14.5px] leading-[1.6] text-[#9fa1ab]">
              {t({
                en: "Certified plumbing & heating for Amsterdam homes and businesses. Fast, clean, guaranteed — 24/7.",
                nl: "Gecertificeerd loodgieters- & verwarmingsbedrijf voor woningen en bedrijven in Amsterdam. Snel, schoon, gegarandeerd — 24/7.",
              })}
            </p>
            <div className="flex gap-2.5">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9.5 w-9.5 items-center justify-center rounded-[11px] bg-white/8 text-[#d9dae0]"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9.5 w-9.5 items-center justify-center rounded-[11px] bg-white/8 text-[#d9dae0]"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45C23.2 24 24 23.22 24 22.27V1.73C24 .78 23.2 0 22.22 0z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9.5 w-9.5 items-center justify-center rounded-[11px] bg-white/8 text-[#d9dae0]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5.2" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid gap-9 grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))]">
            <div>
              <div className="mb-4 text-sm font-bold text-white">
                {t({ en: "Company", nl: "Bedrijf" })}
              </div>
              <div className="flex flex-col gap-2.5 text-[14.5px] text-[#9fa1ab]">
                {COMPANY_LINKS.map((link) => (
                  <a key={link.label.en} href={link.href}>
                    {t(link.label)}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 text-sm font-bold text-white">
                {t({ en: "Services", nl: "Diensten" })}
              </div>
              <div className="flex flex-col gap-2.5 text-[14.5px] text-[#9fa1ab]">
                {SERVICE_LINKS.map((link) => (
                  <a key={link.label.en} href={link.href}>
                    {t(link.label)}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 text-sm font-bold text-white">
                {t({ en: "Areas", nl: "Regio's" })}
              </div>
              <div className="flex flex-col gap-2.5 text-[14.5px] text-[#9fa1ab]">
                {AREA_LINKS.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 text-sm font-bold text-white">
                {t({ en: "Contact", nl: "Contact" })}
              </div>
              <div className="flex flex-col gap-2.5 text-[14.5px] text-[#9fa1ab]">
                <a href="tel:+31201234567">020 123 4567</a>
                <span>hello@aquaflow.nl</span>
                <span>
                  Keizersgracht 123
                  <br />
                  1015 CW Amsterdam
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-[13px] text-[#80828c]">
          <span>
            {t({
              en: "© 2026 AquaFlow Plumbing & Heating · KVK 87654321 · BTW NL004567891B01",
              nl: "© 2026 AquaFlow Loodgieters- & verwarmingsbedrijf · KVK 87654321 · BTW NL004567891B01",
            })}
          </span>
          <div className="flex gap-5">
            <a href="#">{t({ en: "Privacy", nl: "Privacybeleid" })}</a>
            <a href="#">{t({ en: "Terms", nl: "Voorwaarden" })}</a>
            <a href="#">{t({ en: "Licenses", nl: "Licenties" })}</a>
            <button
              type="button"
              onClick={openCookiePreferences}
              className="cursor-pointer"
            >
              {t({ en: "Manage Cookies", nl: "Cookies beheren" })}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
