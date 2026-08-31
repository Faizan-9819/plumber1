const AREAS = [
  "Haarlem",
  "Utrecht",
  "Amstelveen",
  "Zaandam",
  "Almere",
  "Hilversum",
  "Diemen",
  "Weesp",
  "Hoofddorp",
  "Purmerend",
  "Bussum",
  "Uithoorn",
];

export default function Areas() {
  return (
    <section id="areas" className="section-py bg-card">
      <div className="fix">
        <div className="grid items-center gap-[clamp(30px,4vw,56px)] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          <div>
            <div className="mb-4 text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              Service areas
            </div>
            <h2 className="mb-4.5 text-[clamp(28px,4.2vw,46px)] leading-[1.06] font-extrabold tracking-[-0.028em]">
              Proudly serving Amsterdam &amp; the surrounding region
            </h2>
            <p className="mb-6 text-[17px] leading-[1.64] text-muted">
              Local teams who know the canals&apos; old pipework as well as
              new-build apartments. Fast response times because we&apos;re never
              far away. Don&apos;t see your town? Send your postcode — chances are
              we cover it.
            </p>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-line bg-bg p-[16px_20px]">
              <span className="bg-grad flex h-[46px] w-[46px] items-center justify-center rounded-[13px] text-xl font-extrabold text-white">
                A
              </span>
              <div>
                <div className="text-[17px] font-extrabold">
                  Amsterdam &amp; all districts
                </div>
                <div className="text-[13.5px] text-muted">
                  Centrum · Zuid · West · Oost · Noord
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4.5 flex min-h-[240px] items-end rounded-3xl p-4 [background-image:repeating-linear-gradient(135deg,rgba(110,92,240,.06)_0_16px,rgba(34,195,201,.05)_16px_32px),var(--grad-soft)]">
              <span className="rounded-full bg-white/72 px-3 py-[7px] font-mono text-xs text-[#7d72b0]">
                map · coverage-area
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {AREAS.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-line bg-bg px-[15px] py-2.5 text-[14.5px] font-semibold text-[#41424a]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
