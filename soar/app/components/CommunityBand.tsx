export default function CommunityBand() {
  return (
    <section className="w-full border-y border-white/10 bg-[#050505] px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-2 md:items-end md:gap-0">
        {/* Left — stat */}
        <div className="flex flex-col gap-3">
          <p className="font-display text-5xl tracking-tight text-white sm:text-6xl">
            12,406
          </p>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/30">
            On the waitlist
          </p>
        </div>

        {/* Right — brand manifesto */}
        <div className="flex flex-col gap-6 md:items-end md:text-right">
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Most people stay where they are. They accept where they land.
            SOAR is built for the ones who don&apos;t.
          </p>
          <div className="flex flex-col gap-1 md:items-end">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/20">
              True success comes from having the courage
            </p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/20">
              to rise above limitations.
            </p>
          </div>
          <a
            href="#access"
            className="inline-block rounded-full border border-white/20 px-6 py-2.5 text-[10px] uppercase tracking-[0.3em] text-white/60 transition-all hover:border-white hover:text-white"
          >
            Join the waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
