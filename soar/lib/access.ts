// Shared password-gate helpers. Used by BOTH the middleware (Edge runtime) and
// the /access server action (Node runtime), so this relies only on Web Crypto +
// TextEncoder — globals that exist in both runtimes.

export const ACCESS_COOKIE = "soar_access";

/** Deterministic, non-reversible token derived from the shared password. The
 *  cookie stores this token (never the raw password); the middleware recomputes
 *  it from SOAR_ACCESS_PASSWORD to validate each request. */
export async function accessToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`soar:access:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
