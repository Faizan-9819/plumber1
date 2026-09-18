"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { coverStyle, type ImageId } from "@/app/lib/images";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { Translation } from "@/app/i18n/config";

const POSTS: {
  imageId: ImageId;
  cat: Translation;
  read: Translation;
  title: Translation;
}[] = [
  {
    imageId: "plumberSink",
    cat: { en: "Maintenance", nl: "Onderhoud" },
    read: { en: "5 min read", nl: "5 min. leestijd" },
    title: {
      en: "6 warning signs you have a hidden water leak",
      nl: "6 waarschuwingssignalen van een verborgen waterlek",
    },
  },
  {
    imageId: "pipeFusion",
    cat: { en: "Emergency", nl: "Spoedgeval" },
    read: { en: "3 min read", nl: "3 min. leestijd" },
    title: {
      en: "What to do in the first 5 minutes of a burst pipe",
      nl: "Wat te doen in de eerste 5 minuten bij een gesprongen leiding",
    },
  },
  {
    imageId: "pipeFitting",
    cat: { en: "Tips", nl: "Tips" },
    read: { en: "4 min read", nl: "4 min. leestijd" },
    title: {
      en: "Keep your drains clear and avoid a call-out",
      nl: "Houd uw afvoeren vrij en voorkom een voorrijbeurt",
    },
  },
];

function PostCard({ post }: { post: (typeof POSTS)[number] }) {
  const { t } = useLanguage();

  return (
    <a
      href="#"
      className="block h-full overflow-hidden rounded-3xl border border-line bg-card"
    >
      <div style={coverStyle(post.imageId, 520, 360)} className="h-[180px]" />
      <div className="p-5.5">
        <div className="mb-3 flex items-center gap-2.5 text-[12.5px] font-bold tracking-[0.06em] text-accent uppercase">
          <span>{t(post.cat)}</span>
          <span className="text-line">·</span>
          <span className="font-semibold text-muted normal-case tracking-normal">
            {t(post.read)}
          </span>
        </div>
        <h3 className="mb-4.5 text-xl leading-[1.22] font-extrabold tracking-[-0.01em]">
          {t(post.title)}
        </h3>
        <span className="inline-flex items-center gap-[7px] text-[15px] font-bold text-ink">
          {t({ en: "Read more", nl: "Lees meer" })}{" "}
          <span className="text-accent">→</span>
        </span>
      </div>
    </a>
  );
}

export default function Blog() {
  const { t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section className="section-py">
      <div className="fix">
        <div className="mb-9.5 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              {t({ en: "Advice & tips", nl: "Advies & tips" })}
            </div>
            <h2 className="text-[clamp(28px,4.2vw,46px)] leading-[1.05] font-extrabold tracking-[-0.028em]">
              {t({
                en: "Avoid the next emergency",
                nl: "Voorkom het volgende spoedgeval",
              })}
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 font-bold text-accent">
            {t({ en: "View all articles", nl: "Bekijk alle artikelen" })}{" "}
            <span>→</span>
          </a>
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
            {POSTS.map((post) => (
              <div key={post.title.en} className="min-w-0 flex-[0_0_86vw] pl-4">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden gap-4.5 md:grid md:grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          {POSTS.map((post) => (
            <PostCard key={post.title.en} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
