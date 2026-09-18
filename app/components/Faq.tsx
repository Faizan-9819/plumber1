"use client";

import { useState } from "react";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { Translation } from "@/app/i18n/config";

const FAQS: { q: Translation; a: Translation }[] = [
  {
    q: {
      en: "Do you offer emergency plumbing?",
      nl: "Bieden jullie spoedloodgieterswerk aan?",
    },
    a: {
      en: "Yes — we're available 24/7, 365 days a year for genuine emergencies, with an engineer typically on-site within the hour across Amsterdam.",
      nl: "Ja — we zijn 24/7, 365 dagen per jaar beschikbaar voor echte noodgevallen, met een vakman die doorgaans binnen het uur ter plaatse is in heel Amsterdam.",
    },
  },
  {
    q: { en: "Do you serve my area?", nl: "Werken jullie ook in mijn regio?" },
    a: {
      en: "We cover Amsterdam and the surrounding region including Haarlem, Utrecht, Amstelveen, Almere and more. Not sure? Send your postcode and we'll confirm in minutes.",
      nl: "We zijn actief in Amsterdam en omstreken, waaronder Haarlem, Utrecht, Amstelveen, Almere en meer. Niet zeker? Stuur uw postcode en we bevestigen het binnen enkele minuten.",
    },
  },
  {
    q: {
      en: "How quickly can you arrive?",
      nl: "Hoe snel kunnen jullie ter plaatse zijn?",
    },
    a: {
      en: "For emergencies we aim to be with you within 60 minutes. Standard appointments are usually available same-day or next-day.",
      nl: "Bij spoedgevallen streven we ernaar binnen 60 minuten bij u te zijn. Reguliere afspraken zijn meestal dezelfde dag of de volgende dag mogelijk.",
    },
  },
  {
    q: { en: "Do you provide fixed quotes?", nl: "Geven jullie vaste offertes?" },
    a: {
      en: "Yes. You'll get a clear, upfront price before any work begins — no hidden call-out fees or surprise charges.",
      nl: "Ja. U ontvangt vooraf een duidelijke, vaste prijs voordat we beginnen — geen verborgen voorrijkosten of verrassingen achteraf.",
    },
  },
  {
    q: {
      en: "Are you certified and insured?",
      nl: "Zijn jullie gecertificeerd en verzekerd?",
    },
    a: {
      en: "Every engineer is fully qualified, background-checked and covered by comprehensive liability insurance.",
      nl: "Elke vakman is volledig gekwalificeerd, gescreend en gedekt door een uitgebreide aansprakelijkheidsverzekering.",
    },
  },
  {
    q: {
      en: "Do you handle both residential and commercial work?",
      nl: "Doen jullie zowel particulier als zakelijk werk?",
    },
    a: {
      en: "We do. From a single tap to full commercial maintenance contracts, we work with homeowners, landlords and businesses.",
      nl: "Zeker. Van een enkele kraan tot volledige zakelijke onderhoudscontracten, we werken voor huiseigenaren, verhuurders en bedrijven.",
    },
  },
  {
    q: {
      en: "What should I do before the plumber arrives?",
      nl: "Wat moet ik doen voordat de loodgieter arriveert?",
    },
    a: {
      en: "For leaks or bursts, turn off your main water supply if you can and clear access to the affected area. We'll guide you on the phone if needed.",
      nl: "Draai bij lekkages of een gesprongen leiding indien mogelijk de hoofdwatertoevoer dicht en zorg voor vrije toegang tot de getroffen plek. Indien nodig begeleiden we u telefonisch.",
    },
  },
  {
    q: {
      en: "Do you offer weekend service?",
      nl: "Zijn jullie ook in het weekend beschikbaar?",
    },
    a: {
      en: "Yes — we operate 7 days a week, including weekends and public holidays, at no premium for planned visits.",
      nl: "Ja — we zijn 7 dagen per week actief, ook in het weekend en op feestdagen, zonder toeslag voor geplande afspraken.",
    },
  },
];

export default function Faq() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-py bg-card">
      <div className="fix">
        <div className="grid items-start gap-[clamp(30px,4vw,60px)] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          <div>
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              {t({ en: "FAQ", nl: "Vragen" })}
            </div>
            <h2 className="mb-4.5 text-[clamp(28px,4.2vw,46px)] leading-[1.06] font-extrabold tracking-[-0.028em]">
              {t({
                en: "Questions, answered before you call",
                nl: "Vragen, beantwoord voordat u belt",
              })}
            </h2>
            <p className="mb-6.5 text-[17px] leading-[1.64] text-muted">
              {t({
                en: "Can't find what you're after? Our team is one quick message away.",
                nl: "Vindt u niet wat u zoekt? Ons team staat één bericht bij u vandaan.",
              })}
            </p>
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6.5 py-[15px] text-base font-bold text-white!"
            >
              {t({ en: "Ask a question", nl: "Stel een vraag" })}{" "}
              <span>→</span>
            </a>
          </div>

          <div>
            {FAQS.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div key={faq.q.en} className="border-b border-line">
                  <button
                    onClick={() => setOpenIndex(i)}
                    className="flex w-full items-center justify-between gap-4 p-[22px_4px] text-left"
                  >
                    <span className="text-lg font-bold tracking-[-0.01em] text-ink">
                      {t(faq.q)}
                    </span>
                    <span
                      className={`flex-none text-[26px] leading-none text-accent transition-transform duration-300 ${
                        open ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows,opacity] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      gridTemplateRows: open ? "1fr" : "0fr",
                      opacity: open ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="p-[0_4px_24px] text-base leading-[1.6] text-muted">
                        {t(faq.a)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
