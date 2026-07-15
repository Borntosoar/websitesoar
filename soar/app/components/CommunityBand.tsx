import Image from "next/image";

const ROAD_IMG =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3FXgELxsRYjIzXOtRqy3Oa9oQQ7/hf_20260713_173904_843842c4-884d-4073-8956-11d81c64fc79.png";

export default function CommunityBand() {
  return (
    <section className="relative w-full overflow-hidden border-y border-white/10 bg-[#050505] px-6 py-20 md:px-10">
      <Image
        src={ROAD_IMG}
        alt=""
        fill
        className="object-cover opacity-30"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
      <div className="relative z-10 mx-auto grid max-w-[1600px] gap-10 md:grid-cols-2 md:items-end md:gap-0">
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
            The list keeps growing. The door doesn&apos;t — and most who join
            it never get through.
          </p>
          <div className="flex flex-col gap-1 md:items-end">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/20">
              Members get in first.
            </p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/20">
              Then it&apos;s gone.
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
