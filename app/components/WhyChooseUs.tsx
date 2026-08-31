const WHY_ITEMS = [
  {
    icon: "⚡",
    title: "Fast response times",
    desc: "On-site within the hour for genuine emergencies, seven days a week.",
  },
  {
    icon: "✓",
    title: "Certified & insured",
    desc: "Fully qualified, vetted engineers with complete liability cover.",
  },
  {
    icon: "€",
    title: "Transparent fixed pricing",
    desc: "Clear quotes before we start. No surprises, no call-out tricks.",
  },
  {
    icon: "◇",
    title: "Clean, respectful work",
    desc: "Shoe covers, dust sheets and a spotless finish, every visit.",
  },
  {
    icon: "★",
    title: "Guaranteed repairs",
    desc: "Workmanship backed by a written guarantee for total peace of mind.",
  },
  {
    icon: "◉",
    title: "Local, 7-day service",
    desc: "Amsterdam-based teams who know your area and your buildings.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-py">
      <div className="fix">
        <div className="bg-grad relative overflow-hidden rounded-[34px] p-[clamp(36px,5vw,68px)] text-white shadow-[0_50px_90px_-50px_rgba(60,60,140,0.7)]">
          <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(120%_100%_at_100%_0%,rgba(255,255,255,0.18),transparent_55%)]" />

          <div className="relative mb-11 max-w-[640px]">
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] opacity-82 uppercase">
              Why choose AquaFlow
            </div>
            <h2 className="mb-3.5 text-[clamp(28px,4.2vw,46px)] leading-[1.07] font-extrabold tracking-[-0.028em]">
              A safer, cleaner, more honest way to fix your plumbing
            </h2>
            <p className="text-[17px] leading-[1.6] opacity-90">
              Six reasons thousands of homeowners and businesses keep our number
              saved.
            </p>
          </div>

          <div className="relative grid gap-x-9 gap-y-7.5 grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {WHY_ITEMS.map((item) => (
              <div key={item.title}>
                <div className="mb-3.5 flex h-[42px] w-[42px] items-center justify-center rounded-[13px] border border-white/28 bg-white/16 text-[19px]">
                  {item.icon}
                </div>
                <h3 className="mb-1.5 text-[19px] font-extrabold">{item.title}</h3>
                <p className="text-[15px] leading-[1.55] opacity-88">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
