import { coverStyle } from "@/app/lib/images";

export default function About() {
  return (
    <section id="about" className="section-py">
      <div className="fix">
        <div className="grid items-center gap-[clamp(34px,5vw,72px)] grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))]">
          <div>
            <div className="mb-[18px] text-[13px] font-bold tracking-[0.16em] text-accent uppercase">
              Your local plumber
            </div>
            <h2 className="mb-[22px] text-[clamp(28px,4vw,46px)] leading-[1.07] font-extrabold tracking-[-0.028em]">
              A modern plumbing service Amsterdam{" "}
              <span className="text-grad font-extrabold italic">actually trusts</span>.
            </h2>
            <p className="mb-[18px] text-[17.5px] leading-[1.66] text-muted">
              For over 15 years, AquaFlow has handled everything from a dripping tap to
              full commercial maintenance — for homeowners, landlords and businesses
              across the city. Same team, same standards, every visit.
            </p>
            <p className="mb-[30px] text-[17.5px] leading-[1.66] text-muted">
              No call-out tricks, no mess left behind. Just qualified engineers who turn
              up on time, explain the problem clearly and fix it properly — backed by a
              written guarantee.
            </p>
            <div className="flex flex-wrap gap-6.5">
              <div>
                <div className="text-lg font-extrabold">Residential &amp; commercial</div>
                <div className="text-sm text-muted">One trusted team for both</div>
              </div>
              <div className="w-px bg-line" />
              <div>
                <div className="text-lg font-extrabold">Written guarantee</div>
                <div className="text-sm text-muted">On every repair we make</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              style={coverStyle("plumberSink", 900, 760)}
              className="min-h-[clamp(320px,38vw,440px)] rounded-[28px]"
            />
            <div className="absolute bottom-4.5 left-4.5 flex items-center gap-3 rounded-2xl bg-card p-[13px_16px] shadow-[0_22px_44px_-22px_rgba(20,22,30,0.35)]">
              <div className="flex">
                <span
                  className="h-8.5 w-8.5 rounded-full border-2 border-white bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://i.pravatar.cc/64?img=12")' }}
                />
                <span
                  className="-ml-3 h-8.5 w-8.5 rounded-full border-2 border-white bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://i.pravatar.cc/64?img=33")' }}
                />
                <span
                  className="-ml-3 h-8.5 w-8.5 rounded-full border-2 border-white bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://i.pravatar.cc/64?img=51")' }}
                />
              </div>
              <div>
                <div className="text-sm font-extrabold">Certified engineers</div>
                <div className="text-[12.5px] text-muted">Vetted &amp; fully insured</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
