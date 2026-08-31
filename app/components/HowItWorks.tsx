const STEPS = [
  {
    n: "1",
    title: "Request service",
    desc: "Book online, call or WhatsApp — just tell us what's wrong.",
  },
  {
    n: "2",
    title: "We confirm your slot",
    desc: "Get a clear time window and an upfront price guide.",
  },
  {
    n: "3",
    title: "Your plumber arrives",
    desc: "A certified engineer arrives on time, fully equipped.",
  },
  {
    n: "4",
    title: "Diagnose & fix",
    desc: "We explain the issue and fix it properly, on the spot where possible.",
  },
  {
    n: "5",
    title: "Test & clean up",
    desc: "We test everything, tidy up and leave your home as we found it.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-py relative">
      <div className="fix">
        <div className="grid gap-[clamp(34px,5vw,72px)] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <div>
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              How it works
            </div>
            <h2 className="mb-4.5 text-[clamp(28px,4.2vw,46px)] leading-[1.06] font-extrabold tracking-[-0.028em]">
              From first call to fully fixed — without the friction
            </h2>
            <p className="mb-7 text-[17px] leading-[1.64] text-muted">
              No waiting around for vague time windows. Here&apos;s exactly what
              happens when you book AquaFlow.
            </p>
            <a
              href="#booking"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6.5 py-[15px] text-base font-bold text-white!"
            >
              Book your visit <span>→</span>
            </a>
          </div>

          <div className="relative">
            <div className="absolute top-[23px] bottom-[23px] left-[22.75px] w-0.5 bg-line" />
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`relative flex gap-5 ${
                  i !== STEPS.length - 1 ? "pb-7.5" : ""
                }`}
              >
                <div className="z-1 flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border-[1.5px] border-line bg-card text-[17px] font-extrabold text-accent">
                  {step.n}
                </div>
                <div className="pt-2">
                  <h3 className="mb-[5px] text-xl font-extrabold tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-[15.5px] leading-[1.55] text-muted">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
