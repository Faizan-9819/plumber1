"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { coverStyle, type ImageId } from "@/app/lib/images";

const TEAM: { imageId: ImageId; name: string; role: string; bio: string }[] = [
  {
    imageId: "youngPlumber",
    name: "Daan Visser",
    role: "Founder & Master Plumber",
    bio: "25 years on the tools. Leads every complex install and the emergency rota personally.",
  },
  {
    imageId: "lieke",
    name: "Lieke de Boer",
    role: "Heating & Boiler Specialist",
    bio: "Gas-safe certified, with a knack for diagnosing the boiler faults others give up on.",
  },
  {
    imageId: "plumberSink",
    name: "Sem Janssen",
    role: "Lead Service Engineer",
    bio: "Your most likely first knock — fast, tidy and great at explaining what went wrong.",
  },
];

function TeamCard({ member }: { member: (typeof TEAM)[number] }) {
  return (
    <div className="h-full rounded-3xl border border-line bg-card p-4">
      <div
        style={coverStyle(member.imageId, 520, 600)}
        className="h-[230px] rounded-[18px]"
      />
      <div className="p-[18px_8px_8px]">
        <h3 className="mb-[3px] text-[19px] font-extrabold">{member.name}</h3>
        <div className="text-[14.5px] font-semibold text-accent">
          {member.role}
        </div>
        <p className="mt-2.5 text-[14.5px] leading-[1.55] text-muted">
          {member.bio}
        </p>
      </div>
    </div>
  );
}

export default function Team() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section className="section-py">
      <div className="fix">
        <div className="mb-10 max-w-[620px]">
          <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
            The team
          </div>
          <h2 className="text-[clamp(28px,4.2vw,46px)] leading-[1.06] font-extrabold tracking-[-0.028em]">
            Real people, on first-name terms
          </h2>
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
