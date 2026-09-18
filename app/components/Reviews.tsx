"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { Translation } from "@/app/i18n/config";

const REVIEWS: {
  quote: Translation;
  name: string;
  meta: Translation;
  source: string;
  avatar: string;
}[] = [
  {
    quote: {
      en: "They arrived within 40 minutes on a Sunday and fixed a burst pipe before it ruined the floor. Calm, clean and fairly priced.",
      nl: "Ze waren binnen 40 minuten ter plaatse op een zondag en repareerden een gesprongen leiding voordat de vloer werd beschadigd. Rustig, netjes en eerlijk geprijsd.",
    },
    name: "Marieke H.",
    meta: {
      en: "Amsterdam-Zuid · Emergency repair",
      nl: "Amsterdam-Zuid · Spoedreparatie",
    },
    source: "Google",
    avatar: "https://i.pravatar.cc/84?img=47",
  },
  {
    quote: {
      en: "Booked a full bathroom refit. The finish is immaculate and they stuck to the quote to the cent. The most professional trades I have used.",
      nl: "Een complete badkamerrenovatie geboekt. De afwerking is onberispelijk en ze hielden zich exact aan de offerte. De meest professionele vakmensen die ik ooit heb ingeschakeld.",
    },
    name: "Thomas R.",
    meta: {
      en: "Haarlem · Bathroom install",
      nl: "Haarlem · Badkamerinstallatie",
    },
    source: "Google",
    avatar: "https://i.pravatar.cc/84?img=53",
  },
  {
    quote: {
      en: "Our café kitchen flooded an hour before service. AquaFlow had us running again the same morning. Now on a maintenance plan with them.",
      nl: "Onze café-keuken liep een uur voor openingstijd onder water. AquaFlow had ons dezelfde ochtend weer draaiende. Nu hebben we een onderhoudscontract bij hen.",
    },
    name: "Priya N.",
    meta: {
      en: "Amsterdam-Centrum · Commercial",
      nl: "Amsterdam-Centrum · Zakelijk",
    },
    source: "Trustpilot",
    avatar: "https://i.pravatar.cc/84?img=29",
  },
];

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  const { t } = useLanguage();

  return (
    <div className="h-full rounded-3xl border border-line bg-bg p-7">
      <div className="mb-3.5 text-base tracking-[2px] text-[#f5b23a]">
        ★★★★★
      </div>
      <p className="mb-5.5 text-[16.5px] leading-[1.6] text-[#26272c]">
        &ldquo;{t(review.quote)}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <span
          className="h-[42px] w-[42px] flex-none rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url("${review.avatar}")` }}
        />
        <div className="flex-1">
          <div className="text-[15px] font-extrabold">{review.name}</div>
          <div className="text-[13px] text-muted">{t(review.meta)}</div>
        </div>
        <span className="rounded-full border border-line bg-card px-2.5 py-[5px] text-[11px] font-bold text-accent uppercase">
          {review.source}
        </span>
      </div>
    </div>
  );
}

export default function Reviews() {
  const { t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section id="reviews" className="section-py bg-card">
      <div className="fix">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[560px]">
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              {t({ en: "Reviews", nl: "Recensies" })}
            </div>
            <h2 className="text-[clamp(30px,4.4vw,50px)] leading-[1.05] font-extrabold tracking-[-0.028em]">
              {t({
                en: "Trusted by homeowners & businesses",
                nl: "Vertrouwd door huiseigenaren & bedrijven",
              })}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <div className="text-grad text-[32px] font-extrabold">
                {t({ en: "4.9/5", nl: "4,9/5" })}
              </div>
              <div className="text-[13.5px] text-muted">
                {t({ en: "average rating", nl: "gemiddelde beoordeling" })}
              </div>
            </div>
            <div className="w-px self-stretch bg-line" />
            <div>
              <div className="text-grad text-[32px] font-extrabold">250+</div>
              <div className="text-[13.5px] text-muted">
                {t({ en: "verified reviews", nl: "geverifieerde beoordelingen" })}
              </div>
            </div>
          </div>
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
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="min-w-0 flex-[0_0_86vw] pl-4"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden gap-4.5 md:grid md:grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))]">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
