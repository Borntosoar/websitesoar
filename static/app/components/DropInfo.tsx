export default function DropInfo() {
  return (
    <section className="border-y border-white/10 bg-black px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
            Drop 002 — Field Jacket 001
          </p>
          <p className="font-display mt-2 text-2xl tracking-tight text-white sm:text-3xl">
            64% claimed
          </p>
        </div>
        <button className="w-full rounded-full border border-white/20 px-8 py-3 text-xs uppercase tracking-[0.3em] text-white transition-colors hover:bg-white hover:text-black sm:w-auto">
          Add to Bag
        </button>
      </div>
    </section>
  );
}
