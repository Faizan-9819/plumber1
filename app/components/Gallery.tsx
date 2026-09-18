"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { coverStyle, type ImageId } from "@/app/lib/images";
import { useLanguage } from "@/app/i18n/LanguageProvider";

const GALLERY_IMAGES: ImageId[] = [
  "faucet",
  "showerHead",
  "pipeFitting",
  "fixtures",
  "boiler",
  "pipeFusion",
  "plumberSink",
];

export default function Gallery() {
  const { t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  return (
    <section className="section-py">
      <div className="fix">
        <div className="mb-9.5 flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              {t({ en: "Our work", nl: "Ons werk" })}
            </div>
            <h2 className="text-[clamp(28px,4.2vw,46px)] leading-[1.05] font-extrabold tracking-[-0.028em]">
              {t({
                en: "A finish you'd be happy to show off",
                nl: "Een afwerking waar u trots op kunt zijn",
              })}
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4.5">
            <p className="max-w-[320px] text-base text-muted">
              {t({
                en: "Recent installs, repairs and refits across Amsterdam homes and businesses.",
                nl: "Recente installaties, reparaties en renovaties bij woningen en bedrijven in Amsterdam.",
              })}
            </p>
            <div className="flex gap-2.5">
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
          </div>
        </div>

        <div data-embla-viewport ref={emblaRef}>
          <div className="-ml-4 flex">
            {GALLERY_IMAGES.map((id, i) => (
              <div
                key={`${id}-${i}`}
                className="min-w-0 flex-[0_0_86%] pl-4 sm:flex-[0_0_60%] md:flex-[0_0_44%] lg:flex-[0_0_33.3333%]"
              >
                <div
                  style={coverStyle(id, 640, 480)}
                  className="h-[300px] rounded-[22px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
