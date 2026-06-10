import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";

export function Strip() {
  return (
    <section id="lookbook" className="bg-espresso text-bone">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-5 py-24 md:px-12 md:py-32">
        <Reveal>
          <p className="max-w-xl text-2xl font-normal leading-tight tracking-tight md:text-4xl">
            Every garment is a reminder that you were{" "}
            <em className="font-serif italic">made to rise.</em>
          </p>
        </Reveal>
        <a href="#shop" className={buttonVariants({ variant: "paper" })}>
          See the lookbook
        </a>
      </div>
    </section>
  );
}
