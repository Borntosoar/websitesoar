export default function DropStatement() {
  return (
    <section className="w-full bg-black px-6 py-20 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
            Now available — Drop 002
          </p>
          <h2 className="font-display max-w-3xl text-5xl leading-[0.9] tracking-tight text-white sm:text-6xl md:text-7xl">
            THE ASCENT
            <br />
            COLLECTION
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-12">
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              Seven pieces. Each one built to outlast the moment it was made
              for. No excess. No compromise. Only what earns its place.
            </p>
            <a
              href="#drop"
              className="self-start rounded-full bg-white px-8 py-3 text-xs uppercase tracking-[0.3em] text-black transition-opacity hover:opacity-80 sm:self-auto"
            >
              Shop the Drop
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-px bg-white/[0.06] pt-px sm:grid-cols-4">
          {[
            { value: "7", label: "Pieces in the drop" },
            { value: "64%", label: "Already claimed" },
            { value: "Ltd.", label: "No restocks. Ever." },
            { value: "002", label: "Current drop number" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1 bg-black p-6">
              <span className="font-display text-3xl tracking-tight text-white">
                {s.value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
