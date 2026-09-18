"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LanguageToggle from "../i18n/LanguageToggle";
import { useLanguage } from "../i18n/LanguageProvider";

const NAV_LINKS = [
  { en: "Home", nl: "Home", href: "#home" },
  { en: "Services", nl: "Diensten", href: "#services" },
  { en: "About", nl: "Over", href: "#about" },
  { en: "Reviews", nl: "Recensies", href: "#reviews" },
  { en: "Areas", nl: "Regio's", href: "#areas" },
  { en: "FAQ", nl: "Vragen", href: "#faq" },
  { en: "Contact", nl: "Contact", href: "#enquiry" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-ink text-[13px] text-[#edededf2] hidden">
        <div className="fix flex flex-wrap items-center justify-between gap-4 py-[9px] md:block hidden">
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="tel:+31201234567"
              className="flex items-center gap-[7px] font-semibold"
            >
              <span className="text-accent-2 text-[15px]">✆</span> 020 123 4567
            </a>
            <span className="opacity-40">·</span>
            <span className="opacity-80">hello@aquaflow.nl</span>
          </div>
          <div className="flex items-center gap-2 opacity-90">
            <span className="h-[7px] w-[7px] rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]" />
            {t({
              en: "24/7 emergency line · open now, Mon–Sun",
              nl: "24/7 spoedlijn · nu geopend, ma–zo",
            })}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-90 px-3 pt-3 sm:px-4 sm:pt-3.5">
        <div className="relative mx-auto max-w-[1200px]">
          <div
            className={`relative z-10 flex items-center justify-between gap-3 rounded-full border border-line bg-card pr-2.5 pl-5 shadow-[0_4px_16px_-10px_rgba(20,22,30,0.2)] transition-[padding,box-shadow] duration-300 sm:gap-6 sm:pr-3.5 sm:pl-6.5 ${
              scrolled
                ? "py-2 shadow-[0_16px_40px_-18px_rgba(20,22,30,0.28)] sm:py-2.5"
                : "py-2.5 sm:py-3"
            }`}
          >
            <a
              href="#home"
              className="flex items-baseline gap-px text-[21px] font-extrabold tracking-tight sm:text-[25px]"
            >
              <span className="text-ink">Aqua</span>
              <span className="text-grad font-extrabold italic">Flow</span>
            </a>

            <nav className="hidden items-center gap-7.5 min-[920px]:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[15.5px] font-medium text-[#3a3b41]"
                >
                  {t(link)}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="tel:+31201234567"
                className="hidden items-center gap-[7px] text-[15px] font-bold text-ink min-[1080px]:inline-flex"
              >
                ✆ 020 123 4567
              </a>
              <LanguageToggle className="hidden sm:inline-flex" />
              <a
                href="#booking"
                className="bg-grad-cta hidden items-center gap-2 rounded-full px-5.5 py-3 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(71,107,222,0.55)] sm:inline-flex"
              >
                {t({ en: "Book Appointment", nl: "Afspraak maken" })}
              </a>
              <LanguageToggle className="inline-flex sm:hidden" />
              <button
                aria-label={t({ en: "Menu", nl: "Menu" })}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex flex-col items-end gap-[5px] border-0 bg-transparent p-2 min-[920px]:hidden"
              >
                <span className="block h-0.5 w-5 rounded-sm bg-ink" />
                <span className="block h-0.5 w-5 rounded-sm bg-ink" />
                <span className="block h-0.5 w-3.5 rounded-sm bg-ink" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <>
                <motion.div
                  key="mobile-nav-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                  className="fixed inset-0 z-0 bg-black/40 backdrop-blur-[2px] min-[920px]:hidden"
                />
                <motion.nav
                  key="mobile-nav"
                  initial={{ opacity: 0, y: -14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -14, scale: 0.98 }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                  className="absolute inset-x-0 top-full z-20 mt-2 flex flex-col gap-1 rounded-[26px] border border-line bg-card p-4 shadow-[0_16px_40px_-18px_rgba(20,22,30,0.28)] min-[920px]:hidden"
                >
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-[15.5px] font-medium text-[#3a3b41] hover:bg-soft"
                    >
                      {t(link)}
                    </a>
                  ))}
                  <div className="mt-2 flex flex-col gap-2.5 border-t border-line pt-3 sm:hidden">
                    <a
                      href="tel:+31201234567"
                      className="flex items-center gap-[7px] px-3 text-[15px] font-bold text-ink"
                    >
                      ✆ 020 123 4567
                    </a>
                    <a
                      href="#booking"
                      onClick={() => setMenuOpen(false)}
                      className="bg-grad-cta inline-flex items-center justify-center gap-2 rounded-full px-5.5 py-3 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(71,107,222,0.55)]"
                    >
                      {t({ en: "Book Appointment", nl: "Afspraak maken" })}
                    </a>
                  </div>
                </motion.nav>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
