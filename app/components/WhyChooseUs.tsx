"use client";

import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { Translation } from "@/app/i18n/config";

const WHY_ITEMS: { icon: string; title: Translation; desc: Translation }[] = [
  {
    icon: "⚡",
    title: { en: "Fast response times", nl: "Snelle reactietijden" },
    desc: {
      en: "On-site within the hour for genuine emergencies, seven days a week.",
      nl: "Binnen het uur ter plaatse bij echte noodgevallen, zeven dagen per week.",
    },
  },
  {
    icon: "✓",
    title: { en: "Certified & insured", nl: "Gecertificeerd & verzekerd" },
    desc: {
      en: "Fully qualified, vetted engineers with complete liability cover.",
      nl: "Volledig gekwalificeerde, gescreende vakmensen met volledige aansprakelijkheidsdekking.",
    },
  },
  {
    icon: "€",
    title: {
      en: "Transparent fixed pricing",
      nl: "Transparante vaste prijzen",
    },
    desc: {
      en: "Clear quotes before we start. No surprises, no call-out tricks.",
      nl: "Duidelijke offertes voordat we beginnen. Geen verrassingen, geen voorrijtrucjes.",
    },
  },
  {
    icon: "◇",
    title: { en: "Clean, respectful work", nl: "Schoon en zorgvuldig werk" },
    desc: {
      en: "Shoe covers, dust sheets and a spotless finish, every visit.",
      nl: "Schoenhoesjes, stofdoeken en een onberispelijke afwerking, bij elk bezoek.",
    },
  },
  {
    icon: "★",
    title: { en: "Guaranteed repairs", nl: "Gegarandeerde reparaties" },
    desc: {
      en: "Workmanship backed by a written guarantee for total peace of mind.",
      nl: "Vakmanschap met een schriftelijke garantie voor volledige gemoedsrust.",
    },
  },
  {
    icon: "◉",
    title: { en: "Local, 7-day service", nl: "Lokale service, 7 dagen per week" },
    desc: {
      en: "Amsterdam-based teams who know your area and your buildings.",
      nl: "Teams uit Amsterdam die uw buurt en uw gebouwen kennen.",
    },
  },
];

export default function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section className="section-py">
      <div className="fix">
        <div className="bg-grad relative overflow-hidden rounded-[34px] p-[clamp(36px,5vw,68px)] text-white shadow-[0_50px_90px_-50px_rgba(60,60,140,0.7)]">
          <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(120%_100%_at_100%_0%,rgba(255,255,255,0.18),transparent_55%)]" />

          <div className="relative mb-11 max-w-[640px]">
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] opacity-82 uppercase">
              {t({
                en: "Why choose AquaFlow",
                nl: "Waarom kiezen voor AquaFlow",
              })}
            </div>
            <h2 className="mb-3.5 text-[clamp(28px,4.2vw,46px)] leading-[1.07] font-extrabold tracking-[-0.028em]">
              {t({
                en: "A safer, cleaner, more honest way to fix your plumbing",
                nl: "Een veiligere, schonere en eerlijkere manier om uw loodgietersklus op te lossen",
              })}
            </h2>
            <p className="text-[17px] leading-[1.6] opacity-90">
              {t({
                en: "Six reasons thousands of homeowners and businesses keep our number saved.",
                nl: "Zes redenen waarom duizenden huiseigenaren en bedrijven ons nummer bewaren.",
              })}
            </p>
          </div>

          <div className="relative grid gap-x-9 gap-y-7.5 grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {WHY_ITEMS.map((item) => (
              <div key={item.title.en}>
                <div className="mb-3.5 flex h-[42px] w-[42px] items-center justify-center rounded-[13px] border border-white/28 bg-white/16 text-[19px]">
                  {item.icon}
                </div>
                <h3 className="mb-1.5 text-[19px] font-extrabold">
                  {t(item.title)}
                </h3>
                <p className="text-[15px] leading-[1.55] opacity-88">
                  {t(item.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
