"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { coverStyle, type ImageId } from "@/app/lib/images";

const POSTS: { imageId: ImageId; cat: string; read: string; title: string }[] = [
  {
    imageId: "plumberSink",
    cat: "Maintenance",
    read: "5 min read",
    title: "6 warning signs you have a hidden water leak",
  },
  {
    imageId: "pipeFusion",
    cat: "Emergency",
    read: "3 min read",
    title: "What to do in the first 5 minutes of a burst pipe",
  },
  {
    imageId: "pipeFitting",
    cat: "Tips",
    read: "4 min read",
    title: "Keep your drains clear and avoid a call-out",
  },
];

function PostCard({ post }: { post: (typeof POSTS)[number] }) {
  return (
    <a
      href="#"
      className="block h-full overflow-hidden rounded-3xl border border-line bg-card"
    >
      <div style={coverStyle(post.imageId, 520, 360)} className="h-[180px]" />
      <div className="p-5.5">
        <div className="mb-3 flex items-center gap-2.5 text-[12.5px] font-bold tracking-[0.06em] text-accent uppercase">
          <span>{post.cat}</span>
          <span className="text-line">·</span>
          <span className="font-semibold text-muted normal-case tracking-normal">
            {post.read}
          </span>
        </div>
        <h3 className="mb-4.5 text-xl leading-[1.22] font-extrabold tracking-[-0.01em]">
          {post.title}
        </h3>
        <span className="inline-flex items-center gap-[7px] text-[15px] font-bold text-ink">
          Read more <span className="text-accent">→</span>
        </span>
      </div>
    </a>
  );
}

export default function Blog() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section className="section-py">
      <div className="fix">
        <div className="mb-9.5 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              Advice &amp; tips
            </div>
            <h2 className="text-[clamp(28px,4.2vw,46px)] leading-[1.05] font-extrabold tracking-[-0.028em]">
              Avoid the next emergency
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 font-bold text-accent">
            View all articles <span>→</span>
          </a>
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
            {POSTS.map((post) => (
              <div key={post.title} className="min-w-0 flex-[0_0_86vw] pl-4">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden gap-4.5 md:grid md:grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          {POSTS.map((post) => (
            <PostCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
