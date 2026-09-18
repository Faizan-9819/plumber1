"use client";

import { coverStyle } from "@/app/lib/images";
import { useFormModals } from "@/app/global/FormModalProvider";
import { useLanguage } from "@/app/i18n/LanguageProvider";

export default function CtaBanner() {
  const formModals = useFormModals();
  const { t } = useLanguage();

  return (
    <section className="section-py">
      <div className="fix">
        <div className="bg-grad relative overflow-hidden rounded-[34px] p-[clamp(34px,5vw,60px)] text-white shadow-[0_50px_90px_-50px_rgba(60,60,140,0.7)]">
          <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(110%_120%_at_0%_100%,rgba(255,255,255,0.18),transparent_55%)]" />

          <div className="relative grid items-center gap-9 grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            <div>
              <h2 className="mb-4 text-[clamp(30px,4.4vw,52px)] leading-[1.04] font-extrabold tracking-[-0.03em]">
                {t({
                  en: "Need a plumber today?",
                  nl: "Vandaag nog een loodgieter nodig?",
                })}
              </h2>
              <p className="mb-7 max-w-[440px] text-lg leading-[1.55] opacity-92">
                {t({
                  en: "Book a visit in minutes. Same-day slots available — and a real person on the emergency line right now.",
                  nl: "Boek in enkele minuten een afspraak. Dezelfde dag nog tijdsloten beschikbaar — en nu een echt persoon aan de spoedlijn.",
                })}
              </p>
              <div className="mb-6 flex flex-wrap gap-3.5">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[17px] font-extrabold text-black!"
                >
                  {t({ en: "Book Appointment", nl: "Afspraak maken" })}{" "}
                  <span>→</span>
                </a>
                <a
                  href="tel:+31201234567"
                  onClick={() => formModals?.openEnquiry()}
                  className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-white/50 bg-white/14 px-6.5 py-4 text-[17px] font-bold text-white"
                >
                  ✆ {t({ en: "Call now", nl: "Bel nu" })}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[14.5px] font-semibold opacity-95">
                <div className="flex">
                  <span
                    className="h-[30px] w-[30px] rounded-full border-2 border-white bg-cover bg-center"
                    style={{
                      backgroundImage: 'url("https://i.pravatar.cc/64?img=12")',
                    }}
                  />
                  <span
                    className="-ml-2.5 h-[30px] w-[30px] rounded-full border-2 border-white bg-cover bg-center"
                    style={{
                      backgroundImage: 'url("https://i.pravatar.cc/64?img=33")',
                    }}
                  />
                  <span
                    className="-ml-2.5 h-[30px] w-[30px] rounded-full border-2 border-white bg-cover bg-center"
                    style={{
                      backgroundImage: 'url("https://i.pravatar.cc/64?img=51")',
                    }}
                  />
                </div>
                {t({
                  en: "Trusted by 12,000+ jobs completed",
                  nl: "Vertrouwd voor 12.000+ voltooide klussen",
                })}
              </div>
            </div>
            <div
              style={coverStyle("toolbox", 800, 700)}
              className="min-h-[300px] rounded-3xl border border-white/22"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
