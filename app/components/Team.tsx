"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { coverStyle, type ImageId } from "@/app/lib/images";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { Translation } from "@/app/i18n/config";

const TEAM: {
  imageId: ImageId;
  name: string;
  role: Translation;
  bio: Translation;
}[] = [
  {
    imageId: "youngPlumber",
    name: "Daan Visser",
    role: { en: "Founder & Master Plumber", nl: "Oprichter & meesterloodgieter" },
    bio: {
      en: "25 years on the tools. Leads every complex install and the emergency rota personally.",
      nl: "25 jaar ervaring in het vak. Leidt persoonlijk elke complexe installatie en het rooster voor spoedgevallen.",
    },
  },
  {
    imageId: "lieke",
    name: "Lieke de Boer",
    role: {
      en: "Heating & Boiler Specialist",
      nl: "Verwarmings- & cv-ketelspecialist",
    },
    bio: {
      en: "Gas-safe certified, with a knack for diagnosing the boiler faults others give up on.",
      nl: "Gas-safe gecertificeerd, met een neus voor het diagnosticeren van cv-storingen waar anderen vastlopen.",
    },
  },
  {
    imageId: "plumberSink",
    name: "Sem Janssen",
    role: { en: "Lead Service Engineer", nl: "Hoofd servicetechnicus" },
    bio: {
      en: "Your most likely first knock — fast, tidy and great at explaining what went wrong.",
      nl: "Waarschijnlijk degene die als eerste bij u aanklopt — snel, netjes en goed in het uitleggen wat er mis was.",
    },
  },
];

function TeamCard({ member }: { member: (typeof TEAM)[number] }) {
  const { t } = useLanguage();

  return (
    <div className="h-full rounded-3xl border border-line bg-card p-4">
      <div
        style={coverStyle(member.imageId, 520, 600)}
        className="h-[230px] rounded-[18px]"
      />
      <div className="p-[18px_8px_8px]">
        <h3 className="mb-[3px] text-[19px] font-extrabold">{member.name}</h3>
        <div className="text-[14.5px] font-semibold text-accent">
          {t(member.role)}
        </div>
        <p className="mt-2.5 text-[14.5px] leading-[1.55] text-muted">
          {t(member.bio)}
        </p>
      </div>
    </div>
  );
}

export default function Team() {
  const { t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section className="section-py">
      <div className="fix">
        <div className="mb-10 max-w-[620px]">
          <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
            {t({ en: "The team", nl: "Het team" })}
          </div>
          <h2 className="text-[clamp(28px,4.2vw,46px)] leading-[1.06] font-extrabold tracking-[-0.028em]">
            {t({
              en: "Real people, on first-name terms",
              nl: "Echte mensen, op voornaam",
            })}
          </h2>
        </div>

        <div className="mb-5 flex gap-2.5 md:hidden">
          <button
            aria-label={t({ en: "Previous", nl: "Vorige" })}
            onClick={() => emblaApi?.scrollPrev()}
            className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-line bg-card text-ink transition-colors duration-300 hover:border-transparent hover:text-white hover:[background-image:var(--grad-cta)]"
          >
            <ArrowLeft size={19} strokeWidth={2} />
          </button>
          <button
            aria-label={t({ en: "Next", nl: "Volgende" })}
            onClick={() => emblaApi?.scrollNext()}
            className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-line bg-card text-ink transition-colors duration-300 hover:border-transparent hover:text-white hover:[background-image:var(--grad-cta)]"
          >
            <ArrowRight size={19} strokeWidth={2} />
          </button>
        </div>

        <div data-embla-viewport ref={emblaRef} className="md:hidden">
          <div className="-ml-4 flex">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="min-w-0 flex-[0_0_86vw] pl-4"
              >
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden gap-5 md:grid md:grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))]">
          {TEAM.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
