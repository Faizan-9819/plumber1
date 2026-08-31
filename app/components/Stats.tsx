const STATS = [
  { num: "15+", label: "Years of experience", sub: "Serving Amsterdam since 2010" },
  { num: "12,000+", label: "Jobs completed", sub: "Homes & businesses" },
  { num: "4.9/5", label: "Average rating", sub: "From 250+ reviews" },
  { num: "~60 min", label: "Average response", sub: "For genuine emergencies" },
];

export default function Stats() {
  return (
    <section className="pb-[clamp(40px,6vw,72px)]">
      <div className="fix">
        <div className="grid gap-4.5 grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))]">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[22px] border border-line bg-card p-[30px_26px]"
            >
              <div className="text-grad text-[clamp(34px,3.6vw,46px)] leading-none font-extrabold tracking-[-0.03em]">
                {stat.num}
              </div>
              <div className="mt-3 text-base font-bold">{stat.label}</div>
              <div className="mt-[3px] text-[13.5px] text-muted">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
