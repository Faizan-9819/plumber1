"use client";

import { coverStyle } from "@/app/lib/images";
import { useLanguage } from "@/app/i18n/LanguageProvider";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="section-py">
      <div className="fix">
        <div className="grid items-center gap-[clamp(34px,5vw,72px)] grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))]">
          <div>
            <div className="mb-[18px] text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              {t({ en: "Your local plumber", nl: "Uw lokale loodgieter" })}
            </div>
            <h2 className="mb-[22px] text-[clamp(28px,4vw,46px)] leading-[1.07] font-extrabold tracking-[-0.028em]">
              {t({
                en: "A modern plumbing service Amsterdam ",
                nl: "Een modern loodgietersbedrijf dat Amsterdam ",
              })}
              <span className="text-grad font-extrabold italic">
                {t({ en: "actually trusts", nl: "écht vertrouwt" })}
              </span>
              .
            </h2>
            <p className="mb-[18px] text-[17.5px] leading-[1.66] text-muted">
              {t({
                en: "For over 15 years, AquaFlow has handled everything from a dripping tap to full commercial maintenance — for homeowners, landlords and businesses across the city. Same team, same standards, every visit.",
                nl: "Al meer dan 15 jaar regelt AquaFlow alles van een lekkende kraan tot volledig commercieel onderhoud — voor huiseigenaren, verhuurders en bedrijven in de hele stad. Hetzelfde team, dezelfde standaarden, bij elk bezoek.",
              })}
            </p>
            <p className="mb-[30px] text-[17.5px] leading-[1.66] text-muted">
              {t({
                en: "No call-out tricks, no mess left behind. Just qualified engineers who turn up on time, explain the problem clearly and fix it properly — backed by a written guarantee.",
                nl: "Geen voorrijtrucjes, geen rommel achtergelaten. Alleen gekwalificeerde vakmensen die op tijd komen, het probleem duidelijk uitleggen en het goed oplossen — met een schriftelijke garantie.",
              })}
            </p>
            <div className="flex flex-wrap gap-6.5">
              <div>
                <div className="text-lg font-extrabold">
                  {t({
                    en: "Residential & commercial",
                    nl: "Particulier & zakelijk",
                  })}
                </div>
                <div className="text-sm text-muted">
                  {t({
                    en: "One trusted team for both",
                    nl: "Eén vertrouwd team voor beide",
                  })}
                </div>
              </div>
              <div className="w-px bg-line" />
              <div>
                <div className="text-lg font-extrabold">
                  {t({ en: "Written guarantee", nl: "Schriftelijke garantie" })}
                </div>
                <div className="text-sm text-muted">
                  {t({
                    en: "On every repair we make",
                    nl: "Op elke reparatie die we uitvoeren",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              style={coverStyle("plumberSink", 900, 760)}
              className="min-h-[clamp(320px,38vw,440px)] rounded-[28px]"
            />
            <div className="absolute bottom-4.5 left-4.5 flex items-center gap-3 rounded-2xl bg-card p-[13px_16px] shadow-[0_22px_44px_-22px_rgba(20,22,30,0.35)]">
              <div className="flex">
                <span
                  className="h-8.5 w-8.5 rounded-full border-2 border-white bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://i.pravatar.cc/64?img=12")' }}
                />
                <span
                  className="-ml-3 h-8.5 w-8.5 rounded-full border-2 border-white bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://i.pravatar.cc/64?img=33")' }}
                />
                <span
                  className="-ml-3 h-8.5 w-8.5 rounded-full border-2 border-white bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://i.pravatar.cc/64?img=51")' }}
                />
              </div>
              <div>
                <div className="text-sm font-extrabold">
                  {t({
                    en: "Certified engineers",
                    nl: "Gecertificeerde vakmensen",
                  })}
                </div>
                <div className="text-[12.5px] text-muted">
                  {t({
                    en: "Vetted & fully insured",
                    nl: "Gescreend & volledig verzekerd",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
