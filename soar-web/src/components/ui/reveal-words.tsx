"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const word: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/** Word-by-word mask reveal (each word rises from behind a clip). */
export function RevealWords({
  text,
  className,
  accentWord,
}: {
  text: string;
  className?: string;
  accentWord?: string;
}) {
  return (
    <motion.h2
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
    >
      {text.split(" ").map((w, i) => {
        const isAccent =
          !!accentWord && w.replace(/[.,]/g, "").toLowerCase() === accentWord.toLowerCase();
        return (
          <span key={i} className="inline-flex overflow-hidden align-bottom">
            <motion.span
              variants={word}
              className={"inline-block " + (isAccent ? "font-serif font-normal italic" : "")}
            >
              {w}&nbsp;
            </motion.span>
          </span>
        );
      })}
    </motion.h2>
  );
}
