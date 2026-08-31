"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const REVIEWS = [
  {
    quote:
      "They arrived within 40 minutes on a Sunday and fixed a burst pipe before it ruined the floor. Calm, clean and fairly priced.",
    name: "Marieke H.",
    meta: "Amsterdam-Zuid · Emergency repair",
    source: "Google",
    avatar: "https://i.pravatar.cc/84?img=47",
  },
  {
    quote:
      "Booked a full bathroom refit. The finish is immaculate and they stuck to the quote to the cent. The most professional trades I have used.",
    name: "Thomas R.",
    meta: "Haarlem · Bathroom install",
    source: "Google",
    avatar: "https://i.pravatar.cc/84?img=53",
  },
  {
    quote:
      "Our café kitchen flooded an hour before service. AquaFlow had us running again the same morning. Now on a maintenance plan with them.",
    name: "Priya N.",
    meta: "Amsterdam-Centrum · Commercial",
    source: "Trustpilot",
    avatar: "https://i.pravatar.cc/84?img=29",
  },
];

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  return (
    <div className="h-full rounded-3xl border border-line bg-bg p-7">
      <div className="mb-3.5 text-base tracking-[2px] text-[#f5b23a]">
        ★★★★★
      </div>
      <p className="mb-5.5 text-[16.5px] leading-[1.6] text-[#26272c]">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <span
          className="h-[42px] w-[42px] flex-none rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url("${review.avatar}")` }}
        />
        <div className="flex-1">
          <div className="text-[15px] font-extrabold">{review.name}</div>
          <div className="text-[13px] text-muted">{review.meta}</div>
        </div>
        <span className="rounded-full border border-line bg-card px-2.5 py-[5px] text-[11px] font-bold text-accent uppercase">
          {review.source}
        </span>
      </div>
    </div>
  );
}

export default function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section id="reviews" className="section-py bg-card">
      <div className="fix">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[560px]">
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              Reviews
            </div>
            <h2 className="text-[clamp(30px,4.4vw,50px)] leading-[1.05] font-extrabold tracking-[-0.028em]">
              Trusted by homeowners &amp; businesses
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <div className="text-grad text-[32px] font-extrabold">4.9/5</div>
              <div className="text-[13.5px] text-muted">average rating</div>
            </div>
            <div className="w-px self-stretch bg-line" />
            <div>
              <div className="text-grad text-[32px] font-extrabold">250+</div>
              <div className="text-[13.5px] text-muted">verified reviews</div>
            </div>
          </div>
        </div>

        <div className="mb-5 flex gap-2.5 md:hidden">
          <button
            aria-label="Previous"
            onClick={() => emblaApi?.scrollPrev()}
            className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-line bg-card text-ink transition-colors duration-300 hover:border-transparent hover:text-white hover:[background-image:var(--grad-cta)]"
          >
            <ArrowLeft size={19} strokeWidth={2} />
          </button>
          <button
            aria-label="Next"
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
