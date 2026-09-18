"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { coverStyle, type ImageId } from "@/app/lib/images";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { Translation } from "@/app/i18n/config";

const SERVICES: {
  imageId: ImageId;
  title: Translation;
  desc: Translation;
  featured?: boolean;
}[] = [
  {
    imageId: "plumberSink",
    title: { en: "Emergency Plumbing", nl: "Spoedloodgieter" },
    desc: {
      en: "Burst pipes, floods and urgent failures — a certified plumber at your door, day or night.",
      nl: "Gesprongen leidingen, overstromingen en spoedgevallen — een gecertificeerde loodgieter dag en nacht aan de deur.",
    },
    featured: true,
  },
  {
    imageId: "pipeFitting",
    title: { en: "Leak Detection & Repair", nl: "Lekdetectie & reparatie" },
    desc: {
      en: "Pinpoint hidden leaks fast with non-invasive tools, then fix them for good.",
      nl: "Snel verborgen lekkages opsporen met niet-invasieve apparatuur en definitief verhelpen.",
    },
  },
  {
    imageId: "pipeFusion",
    title: { en: "Drain Unblocking", nl: "Afvoer ontstoppen" },
    desc: {
      en: "Blocked sinks, toilets and drains cleared quickly, cleanly and without the mess.",
      nl: "Verstopte gootstenen, toiletten en afvoeren snel, schoon en zonder rommel ontstopt.",
    },
  },
  {
    imageId: "youngPlumber",
    title: {
      en: "Pipe Repair & Replacement",
      nl: "Leidingreparatie & -vervanging",
    },
    desc: {
      en: "Worn, corroded or damaged pipework repaired or fully replaced to last.",
      nl: "Versleten, gecorrodeerde of beschadigde leidingen duurzaam gerepareerd of volledig vervangen.",
    },
  },
  {
    imageId: "faucet",
    title: { en: "Bathroom & Kitchen", nl: "Badkamer & keuken" },
    desc: {
      en: "Taps, sinks, showers and full fit-outs installed with a flawless finish.",
      nl: "Kranen, wastafels, douches en complete verbouwingen vakkundig geïnstalleerd.",
    },
  },
  {
    imageId: "boiler",
    title: { en: "Boiler & Water Heater", nl: "Cv-ketel & boiler" },
    desc: {
      en: "Servicing, repair and installation of boilers, geysers and hot-water systems.",
      nl: "Onderhoud, reparatie en installatie van cv-ketels, boilers en warmwatersystemen.",
    },
  },
  {
    imageId: "fixtures",
    title: { en: "Installations & Fixtures", nl: "Installaties & inbouw" },
    desc: {
      en: "Dishwashers, washing machines, toilets and fixtures fitted right, first time.",
      nl: "Vaatwassers, wasmachines, toiletten en sanitair in één keer goed geïnstalleerd.",
    },
  },
  {
    imageId: "toolbox",
    title: { en: "Commercial Plumbing", nl: "Zakelijk loodgieterswerk" },
    desc: {
      en: "Reliable maintenance and rapid response for offices, retail and hospitality.",
      nl: "Betrouwbaar onderhoud en snelle service voor kantoren, winkels en horeca.",
    },
  },
];

function ServiceCard({ service }: { service: (typeof SERVICES)[number] }) {
  const { t } = useLanguage();

  return (
    <div
      className={`h-full rounded-3xl p-4.5 transition-[transform,box-shadow] duration-300 ease-out transform-gpu will-change-transform hover:-translate-y-1.5 ${
        service.featured
          ? "bg-grad text-white shadow-[0_30px_56px_-30px_rgba(60,60,140,0.7)]"
          : "border border-line bg-card"
      }`}
    >
      <div
        style={coverStyle(service.imageId, 520, 360)}
        className="mb-4.5 h-[130px] rounded-2xl"
      />
      <div className="flex items-center justify-between gap-2.5">
        <h3 className="text-[19px] font-extrabold tracking-[-0.01em]">
          {t(service.title)}
        </h3>
        <span
          className={`flex-none text-[17px] ${service.featured ? "text-white" : "text-accent"}`}
        >
          ↗
        </span>
      </div>
      <p
        className={`mt-2.5 text-[14.5px] leading-[1.55] ${
          service.featured ? "text-white/90" : "text-muted"
        }`}
      >
        {t(service.desc)}
      </p>
      {service.featured && (
        <span className="mt-3.5 inline-block rounded-full border border-white/40 bg-white/18 px-2.5 py-[5px] text-xs font-bold tracking-[0.06em] text-white uppercase">
          {t({ en: "Most requested", nl: "Meest gevraagd" })}
        </span>
      )}
    </div>
  );
}

function ServicesCta() {
  const { t } = useLanguage();

  return (
    <a
      href="#enquiry"
      className="bg-soft relative flex h-full min-h-[248px] flex-col justify-between overflow-hidden rounded-3xl border border-line p-5.5 [background-image:radial-gradient(125%_120%_at_100%_0%,rgba(79,126,242,.22),rgba(79,126,242,0)_55%)]"
    >
      <div>
        <div className="mb-4.5 flex h-12 w-12 items-center justify-center rounded-[14px] border border-line bg-card text-[23px] font-extrabold text-accent">
          ?
        </div>
        <h3 className="mb-2 text-[22px] leading-[1.15] font-extrabold tracking-[-0.015em]">
          {t({ en: "Other plumbing needs?", nl: "Andere loodgietersklus?" })}
        </h3>
        <p className="text-[14.5px] leading-[1.55] text-muted">
          {t({
            en: "Whatever the job, we can help. Tell us what's going on and we'll take it from there.",
            nl: "Wat de klus ook is, wij helpen graag. Vertel ons wat er speelt en wij pakken het verder op.",
          })}
        </p>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-base font-extrabold text-accent">
        {t({ en: "Contact us", nl: "Neem contact op" })}{" "}
        <span className="text-lg">→</span>
      </span>
    </a>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section id="services" className="section-py bg-card">
      <div className="fix">
        <div className="mb-[42px] flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              {t({ en: "What we do", nl: "Wat we doen" })}
            </div>
            <h2 className="text-[clamp(30px,4.4vw,50px)] leading-[1.05] font-extrabold tracking-[-0.028em]">
              {t({
                en: "Plumbing & heating, covered end to end",
                nl: "Loodgieterswerk & verwarming, van A tot Z geregeld",
              })}
            </h2>
          </div>
          <p className="max-w-[340px] text-[16.5px] leading-[1.6] text-muted">
            {t({
              en: "From a 2am burst pipe to a planned bathroom refit — one number, one reliable team for it all.",
              nl: "Van een gesprongen leiding om 2 uur 's nachts tot een geplande badkamerrenovatie — één nummer, één betrouwbaar team voor alles.",
            })}
          </p>
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
            {SERVICES.map((service) => (
              <div key={service.title.en} className="min-w-0 flex-[0_0_86vw] pl-4">
                <ServiceCard service={service} />
              </div>
            ))}
            <div className="min-w-0 flex-[0_0_86vw] pl-4">
              <ServicesCta />
            </div>
          </div>
        </div>

        <div className="hidden gap-4.5 md:grid md:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title.en} service={service} />
          ))}
          <ServicesCta />
        </div>
      </div>
    </section>
  );
}
