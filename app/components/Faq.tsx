"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Do you offer emergency plumbing?",
    a: "Yes — we're available 24/7, 365 days a year for genuine emergencies, with an engineer typically on-site within the hour across Amsterdam.",
  },
  {
    q: "Do you serve my area?",
    a: "We cover Amsterdam and the surrounding region including Haarlem, Utrecht, Amstelveen, Almere and more. Not sure? Send your postcode and we'll confirm in minutes.",
  },
  {
    q: "How quickly can you arrive?",
    a: "For emergencies we aim to be with you within 60 minutes. Standard appointments are usually available same-day or next-day.",
  },
  {
    q: "Do you provide fixed quotes?",
    a: "Yes. You'll get a clear, upfront price before any work begins — no hidden call-out fees or surprise charges.",
  },
  {
    q: "Are you certified and insured?",
    a: "Every engineer is fully qualified, background-checked and covered by comprehensive liability insurance.",
  },
  {
    q: "Do you handle both residential and commercial work?",
    a: "We do. From a single tap to full commercial maintenance contracts, we work with homeowners, landlords and businesses.",
  },
  {
    q: "What should I do before the plumber arrives?",
    a: "For leaks or bursts, turn off your main water supply if you can and clear access to the affected area. We'll guide you on the phone if needed.",
  },
  {
    q: "Do you offer weekend service?",
    a: "Yes — we operate 7 days a week, including weekends and public holidays, at no premium for planned visits.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-py bg-card">
      <div className="fix">
        <div className="grid items-start gap-[clamp(30px,4vw,60px)] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          <div>
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              FAQ
            </div>
            <h2 className="mb-4.5 text-[clamp(28px,4.2vw,46px)] leading-[1.06] font-extrabold tracking-[-0.028em]">
              Questions, answered before you call
            </h2>
            <p className="mb-6.5 text-[17px] leading-[1.64] text-muted">
              Can&apos;t find what you&apos;re after? Our team is one quick
              message away.
            </p>
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6.5 py-[15px] text-base font-bold text-white!"
            >
              Ask a question <span>→</span>
            </a>
          </div>

          <div>
            {FAQS.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div key={faq.q} className="border-b border-line">
                  <button
                    onClick={() => setOpenIndex(i)}
                    className="flex w-full items-center justify-between gap-4 p-[22px_4px] text-left"
                  >
                    <span className="text-lg font-bold tracking-[-0.01em] text-ink">
                      {faq.q}
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
                        {faq.a}
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
