"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccessPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-black px-6">
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="font-display text-4xl tracking-tight text-white">
            SOAR
          </span>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/30">
            Pre-launch access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-1">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
              className="w-full border-b border-white/20 bg-transparent py-3 text-center text-sm text-white outline-none placeholder:text-white/25 focus:border-white/60 transition-colors"
            />
            {error && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-red-400/80">
                Incorrect password
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-2 w-full rounded-full border border-white/20 px-8 py-3 text-xs uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-black disabled:opacity-30"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-white/30">
            Not on the list yet?
          </p>
          <Link
            href="/#access"
            className="text-[10px] uppercase tracking-[0.3em] text-white/50 underline underline-offset-4 hover:text-white transition-colors"
          >
            Request early access →
          </Link>
        </div>
      </div>

      <p className="absolute bottom-8 text-[10px] uppercase tracking-[0.25em] text-white/20">
        © {new Date().getFullYear()} SOAR. Pre-launch.
      </p>
    </main>
  );
}
