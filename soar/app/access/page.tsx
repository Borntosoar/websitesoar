import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, accessToken } from "@/lib/access";
import { NotifyAccess } from "../components/NotifyAccess";

// Server action: validate the shared password server-side and, on success, set
// the gate cookie. The password never reaches the client.
async function unlock(formData: FormData) {
  "use server";
  const password = process.env.SOAR_ACCESS_PASSWORD;
  if (!password) redirect("/"); // gate disabled — nothing to unlock

  const entered = String(formData.get("password") ?? "");
  if (entered !== password) redirect("/access?error=1");

  const jar = await cookies();
  jar.set(ACCESS_COOKIE, await accessToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Only allow same-origin relative destinations (guard against open redirect).
  const dest = String(formData.get("from") ?? "/");
  redirect(dest.startsWith("/") && !dest.startsWith("//") ? dest : "/");
}

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="flex min-h-screen flex-col items-center justify-center gap-7 px-6 text-center">
        <span className="display text-2xl">SOAR</span>
        <span className="mono text-white/45">Members only · pre-launch</span>
        <h1 className="display text-[clamp(2.1rem,7vw,4.4rem)] leading-[0.95]">
          The road ahead
          <br />
          isn&rsquo;t for everyone.
        </h1>

        <form action={unlock} className="flex w-full max-w-sm flex-col gap-3">
          <input type="hidden" name="from" value={from ?? "/"} />
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Access password"
            aria-label="Access password"
            className="border-b border-white/30 bg-transparent py-3 text-center tracking-[0.3em] text-white outline-none placeholder:tracking-normal placeholder:text-white/40 focus:border-white"
          />
          {error && <p className="mono text-red-400/80">Incorrect password.</p>}
          <button
            type="submit"
            className="mono mt-2 bg-white py-3.5 text-black transition-opacity hover:opacity-80"
          >
            Enter
          </button>
        </form>

        <p className="mono max-w-sm text-white/35">
          Not on the list yet? Join the waitlist below — members get the password
          when the next drop opens.
        </p>
        <a href="#waitlist" className="mono text-white/55 underline-offset-4 hover:underline">
          Join the waitlist ↓
        </a>
      </section>

      <div id="waitlist">
        <NotifyAccess />
      </div>
    </main>
  );
}
