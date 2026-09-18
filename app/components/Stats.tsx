"use client";

import { useLanguage } from "@/app/i18n/LanguageProvider";

const STATS = [
  {
    num: { en: "15+", nl: "15+" },
    label: { en: "Years of experience", nl: "Jaar ervaring" },
    sub: {
      en: "Serving Amsterdam since 2010",
      nl: "Actief in Amsterdam sinds 2010",
    },
  },
  {
    num: { en: "12,000+", nl: "12.000+" },
    label: { en: "Jobs completed", nl: "Voltooide klussen" },
    sub: { en: "Homes & businesses", nl: "Woningen & bedrijven" },
  },
  {
    num: { en: "4.9/5", nl: "4,9/5" },
    label: { en: "Average rating", nl: "Gemiddelde beoordeling" },
    sub: { en: "From 250+ reviews", nl: "Op basis van 250+ beoordelingen" },
  },
  {
    num: { en: "~60 min", nl: "~60 min" },
    label: { en: "Average response", nl: "Gemiddelde reactietijd" },
    sub: {
      en: "For genuine emergencies",
      nl: "Bij echte noodgevallen",
    },
  },
];

export default function Stats() {
  const { t } = useLanguage();

  return (
    <section className="pb-[clamp(40px,6vw,72px)]">
      <div className="fix">
        <div className="grid gap-4.5 grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))]">
          {STATS.map((stat) => (
            <div
              key={stat.label.en}
              className="rounded-[22px] border border-line bg-card p-[30px_26px]"
            >
              <div className="text-grad text-[clamp(34px,3.6vw,46px)] leading-none font-extrabold tracking-[-0.03em]">
                {t(stat.num)}
              </div>
              <div className="mt-3 text-base font-bold">{t(stat.label)}</div>
              <div className="mt-[3px] text-[13.5px] text-muted">
                {t(stat.sub)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
