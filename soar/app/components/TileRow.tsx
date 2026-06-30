import { Reveal } from "./Reveal";
import { PhotoTile } from "./PhotoTile";

type Fit = "longsleeve" | "tee" | "shorts";
type Item = {
  fit?: Fit;
  flip?: boolean;
  tone?: "light" | "dark";
  seed?: number;
  eyebrow?: string;
  title?: string;
  cta?: string;
  href?: string;
};

// A full-bleed row of campaign tiles (Represent move) — hairline gaps, edge to
// edge, with overlaid labels. Used for the lookbook / category rows.
export function TileRow({
  id,
  heading,
  sub,
  items,
  cols = "md:grid-cols-3",
  aspect = "aspect-[3/4]",
}: {
  id?: string;
  heading?: string;
  sub?: string;
  items: Item[];
  cols?: string;
  aspect?: string;
}) {
  return (
    <section id={id} className="w-full">
      {heading && (
        <Reveal>
          <div className="wrap flex items-end justify-between border-t border-line py-8 md:py-10">
            <h2 className="mono text-ash">{heading}</h2>
            {sub && <span className="mono text-ash">{sub}</span>}
          </div>
        </Reveal>
      )}
      <div className={`grid grid-cols-1 gap-px sm:grid-cols-2 ${cols}`}>
        {items.map((it, i) => (
          <PhotoTile key={i} aspect={aspect} {...it} />
        ))}
      </div>
    </section>
  );
}
