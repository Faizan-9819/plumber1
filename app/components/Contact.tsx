"use client";

import { useState } from "react";
import LeadEnquiryForm from "@/app/global/LeadEnquiryForm";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="section-py">
      <div className="fix">
        <div className="grid items-start gap-[clamp(28px,4vw,40px)] grid-cols-[repeat(auto-fit,minmax(min(100%,330px),1fr))]">
          <div>
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              Get in touch
            </div>
            <h2 className="mb-4.5 text-[clamp(28px,4.2vw,46px)] leading-[1.06] font-extrabold tracking-[-0.028em]">
              Request a visit or quote
            </h2>
            <p className="mb-6 text-[17px] leading-[1.62] text-muted">
              Not ready to call? Send a few details and we&apos;ll come back to
              you fast — usually within the hour during working times.
            </p>
            <div className="mb-4.5 flex min-h-[220px] items-end rounded-[22px] p-4 [background-image:repeating-linear-gradient(135deg,rgba(110,92,240,.06)_0_16px,rgba(34,195,201,.05)_16px_32px),var(--grad-soft)]">
              <span className="rounded-full bg-white/72 px-3 py-[7px] font-mono text-xs text-[#7d72b0]">
                map · Keizersgracht 123, Amsterdam
              </span>
            </div>
            <div className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
              <div className="rounded-2xl border border-line bg-card p-4">
                <div className="mb-1 text-[12.5px] font-semibold text-muted">Call us</div>
                <a href="tel:+31201234567" className="text-base font-extrabold">
                  020 123 4567
                </a>
              </div>
              <div className="rounded-2xl border border-line bg-card p-4">
                <div className="mb-1 text-[12.5px] font-semibold text-muted">Email</div>
                <div className="text-base font-extrabold">hello@aquaflow.nl</div>
              </div>
              <div className="rounded-2xl border border-line bg-card p-4">
                <div className="mb-1 text-[12.5px] font-semibold text-muted">Address</div>
                <div className="text-[14.5px] font-bold">Keizersgracht 123, Amsterdam</div>
              </div>
              <div className="rounded-2xl border border-line bg-card p-4">
                <div className="mb-1 text-[12.5px] font-semibold text-muted">Hours</div>
                <div className="text-[14.5px] font-bold">Mon–Sun · 24/7 emergency</div>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-line bg-card p-[clamp(22px,3vw,34px)] shadow-[0_30px_60px_-38px_rgba(20,22,30,0.3)]">
            <LeadEnquiryForm idPrefix="contact" onSuccessComplete={() => setSent(true)} />
            {!sent && (
              <p className="mt-3.5 text-center text-[12.5px] text-muted">
                No obligation · Fixed quote before any work · Reply within the
                hour
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
