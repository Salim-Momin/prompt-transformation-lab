"use client";

import { motion } from "motion/react";

export function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="promptforge-grid absolute inset-0" />
      <div className="promptforge-noise absolute inset-0" />

      <motion.div
        className="absolute left-1/2 top-[-20rem] size-[46rem] -translate-x-1/2 rounded-full bg-violet-700/15 blur-[150px]"
        animate={{
          x: [-40, 40, -40],
          y: [0, 35, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 16,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute right-[-18rem] top-[18rem] size-[34rem] rounded-full bg-cyan-500/[0.07] blur-[140px]"
        animate={{
          x: [0, -45, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 19,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[-20rem] left-[-14rem] size-[38rem] rounded-full bg-fuchsia-600/[0.07] blur-[150px]"
        animate={{
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}