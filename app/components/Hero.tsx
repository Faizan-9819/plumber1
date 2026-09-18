"use client";

import { coverStyle } from "@/app/lib/images";
import { useFormModals } from "@/app/global/FormModalProvider";
import { useLanguage } from "@/app/i18n/LanguageProvider";

export default function Hero() {
  const formModals = useFormModals();
  const { t } = useLanguage();

  return (
    <section id="home" className="relative section-py overflow-clip">
      <svg
        viewBox="0 0 600 600"
        fill="none"
        className="pointer-events-none absolute top-10 right-[-60px] z-0 h-auto w-[min(46vw,560px)] opacity-50 md:block hidden"
      >
        <defs>
          <linearGradient id="curveA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5D62F3" />
            <stop offset="1" stopColor="#38B6D8" />
          </linearGradient>
        </defs>
        <path
          d="M40 540 C 360 560 540 380 470 220 C 430 120 250 120 270 230 C 285 320 470 300 540 180 C 590 90 540 30 470 30"
          stroke="url(#curveA)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>

      <div className="fix relative z-10">
        <div className="grid items-center gap-[clamp(34px,5vw,68px)] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-card py-2 pr-4 pl-2.5 text-[13px] font-semibold tracking-[0.02em] shadow-[0_6px_18px_-12px_rgba(20,22,30,0.3)]">
              <span className="bg-grad inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold tracking-[0.08em] text-white uppercase">
                24/7
              </span>
              {t({
                en: "Emergency plumbing across Amsterdam",
                nl: "Spoedloodgieter in heel Amsterdam",
              })}
            </div>

            <h1 className="mb-[22px] text-[clamp(40px,6vw,72px)] leading-[1.03] font-extrabold tracking-[-0.032em]">
              {t({
                en: "Fast, reliable plumbing —",
                nl: "Snel, betrouwbaar loodgieterswerk —",
              })}
              <br />
              <span className="text-grad font-extrabold italic">
                {t({ en: "done right", nl: "in één keer goed" })}
              </span>
              {t({ en: ", first time.", nl: " gedaan." })}
            </h1>

            <p className="mb-[30px] max-w-[540px] text-[clamp(17px,1.5vw,19px)] leading-[1.62] text-muted">
              {t({
                en: "Certified local plumbers for repairs, installations and emergencies. Same-day appointments across Amsterdam and the surrounding region — with clear, fixed pricing before we start.",
                nl: "Gecertificeerde lokale loodgieters voor reparaties, installaties en noodgevallen. Dezelfde dag nog een afspraak in Amsterdam en omgeving — met duidelijke, vaste prijzen vooraf.",
              })}
            </p>

            <div className="mb-[30px] flex flex-wrap gap-3.5">
              <a
                href="#booking"
                className="bg-grad-cta inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-[17px] font-bold text-white shadow-[0_16px_32px_-12px_rgba(71,107,222,0.55)]"
              >
                {t({ en: "Book Appointment", nl: "Afspraak maken" })}{" "}
                <span className="text-[18px]">→</span>
              </a>
              <a
                href="tel:+31201234567"
                onClick={() => formModals?.openEnquiry()}
                className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-line bg-card px-6.5 py-4 text-[17px] font-bold text-ink"
              >
                <span className="text-accent">✆</span>{" "}
                {t({
                  en: "Call the emergency line",
                  nl: "Bel de noodlijn",
                })}
              </a>
            </div>

            <div className="flex flex-wrap gap-x-2.5 gap-y-2">
              {[
                { en: "Certified & insured", nl: "Gecertificeerd & verzekerd" },
                { en: "Same-day service", nl: "Dezelfde dag service" },
                { en: "Fixed pricing", nl: "Vaste prijzen" },
              ].map((item) => (
                <span
                  key={item.en}
                  className="inline-flex items-center gap-[7px] rounded-full border border-line bg-card px-3.5 py-2 text-sm font-semibold text-[#46474d]"
                >
                  <span className="text-accent-2">✓</span> {t(item)}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              style={coverStyle("youngPlumber", 900, 1000)}
              className="relative min-h-[clamp(380px,46vw,520px)] overflow-hidden rounded-[30px] shadow-[0_40px_80px_-40px_rgba(40,40,80,0.4)]"
            />
            <div className="animate-float-y absolute top-5 left-[-14px] flex items-center gap-3 rounded-[18px] bg-card p-3.5 shadow-[0_22px_44px_-20px_rgba(20,22,30,0.4)]">
              <span className="bg-grad flex h-[42px] w-[42px] items-center justify-center rounded-xl text-[19px] font-extrabold text-white">
                24/7
              </span>
              <div>
                <div className="text-[15px] leading-[1.1] font-extrabold">
                  {t({ en: "Available now", nl: "Nu beschikbaar" })}
                </div>
                <div className="text-[12.5px] text-muted">
                  {t({ en: "Emergency call-outs", nl: "Spoeduitrukken" })}
                </div>
              </div>
            </div>
            <div className="animate-float-y2 absolute right-[-14px] bottom-6 rounded-[18px] bg-card p-[14px_17px] shadow-[0_22px_44px_-20px_rgba(20,22,30,0.4)]">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] tracking-[1px] text-[#f5b23a]">
                  ★★★★★
                </span>
              </div>
              <div className="mt-[3px] text-[15px] font-extrabold">
                {t({ en: "4.9 · 250+ reviews", nl: "4,9 · 250+ beoordelingen" })}
              </div>
              <div className="text-xs text-muted">
                {t({
                  en: "Verified homeowners & businesses",
                  nl: "Geverifieerde huiseigenaren & bedrijven",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
