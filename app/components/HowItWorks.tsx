"use client";

import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { Translation } from "@/app/i18n/config";

const STEPS: { n: string; title: Translation; desc: Translation }[] = [
  {
    n: "1",
    title: { en: "Request service", nl: "Vraag een dienst aan" },
    desc: {
      en: "Book online, call or WhatsApp — just tell us what's wrong.",
      nl: "Boek online, bel of app ons via WhatsApp — vertel ons gewoon wat er aan de hand is.",
    },
  },
  {
    n: "2",
    title: { en: "We confirm your slot", nl: "Wij bevestigen uw tijdslot" },
    desc: {
      en: "Get a clear time window and an upfront price guide.",
      nl: "Ontvang een duidelijk tijdvak en een prijsindicatie vooraf.",
    },
  },
  {
    n: "3",
    title: { en: "Your plumber arrives", nl: "Uw loodgieter komt langs" },
    desc: {
      en: "A certified engineer arrives on time, fully equipped.",
      nl: "Een gecertificeerde vakman komt op tijd en volledig uitgerust.",
    },
  },
  {
    n: "4",
    title: { en: "Diagnose & fix", nl: "Diagnose & reparatie" },
    desc: {
      en: "We explain the issue and fix it properly, on the spot where possible.",
      nl: "We leggen het probleem uit en lossen het meteen goed op, waar mogelijk ter plekke.",
    },
  },
  {
    n: "5",
    title: { en: "Test & clean up", nl: "Testen & opruimen" },
    desc: {
      en: "We test everything, tidy up and leave your home as we found it.",
      nl: "We testen alles, ruimen op en laten uw huis achter zoals we het aantroffen.",
    },
  },
];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="section-py relative">
      <div className="fix">
        <div className="grid gap-[clamp(34px,5vw,72px)] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <div>
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              {t({ en: "How it works", nl: "Hoe het werkt" })}
            </div>
            <h2 className="mb-4.5 text-[clamp(28px,4.2vw,46px)] leading-[1.06] font-extrabold tracking-[-0.028em]">
              {t({
                en: "From first call to fully fixed — without the friction",
                nl: "Van eerste telefoontje tot volledig gerepareerd — zonder gedoe",
              })}
            </h2>
            <p className="mb-7 text-[17px] leading-[1.64] text-muted">
              {t({
                en: "No waiting around for vague time windows. Here's exactly what happens when you book AquaFlow.",
                nl: "Geen wachten op vage tijdvakken. Dit is precies wat er gebeurt wanneer u AquaFlow boekt.",
              })}
            </p>
            <a
              href="#booking"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6.5 py-[15px] text-base font-bold text-white!"
            >
              {t({ en: "Book your visit", nl: "Boek uw afspraak" })}{" "}
              <span>→</span>
            </a>
          </div>

          <div className="relative">
            <div className="absolute top-[23px] bottom-[23px] left-[22.75px] w-0.5 bg-line" />
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`relative flex gap-5 ${
                  i !== STEPS.length - 1 ? "pb-7.5" : ""
                }`}
              >
                <div className="z-1 flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border-[1.5px] border-line bg-card text-[17px] font-extrabold text-accent">
                  {step.n}
                </div>
                <div className="pt-2">
                  <h3 className="mb-[5px] text-xl font-extrabold tracking-[-0.01em]">
                    {t(step.title)}
                  </h3>
                  <p className="text-[15.5px] leading-[1.55] text-muted">
                    {t(step.desc)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
