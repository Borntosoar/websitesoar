# Deploy SOAR — get a live, shareable URL (no design loss)

The Next.js app lives in the **`soar-web/`** subfolder of this repo (the root also
holds the Shopify theme and Claude skills). Vercel runs the real Next build, so the
deployed site is identical to local — nothing in the design is lost.

> ⚠️ The 404 you saw before = a host pointed at the repo **root**. The fix is one
> setting: **Root Directory = `soar-web`**.

---

## Option A — Vercel (recommended: shareable URL + automatic PR previews)

1. Go to **https://vercel.com/new** and sign in with GitHub.
2. **Import** the repository **`Borntosoar/websitesoar`**.
3. On the configure screen, set:
   - **Root Directory** → click *Edit* → choose **`soar-web`**  ← the important one
   - **Framework Preset** → **Next.js** (auto-detected)
   - Build/Install commands → leave default (handled by `soar-web/vercel.json`)
4. Click **Deploy**. In ~1–2 min you get a live `https://<project>.vercel.app` URL.
5. At the gate, type the password **`soar`** → the box opens into the homepage.

Once connected, **every push to the PR auto-deploys a Preview** and Vercel posts the
preview link as a comment on **PR #1** — so you can watch the design evolve on your phone.

---

## Option B — Run it locally (surest, ~30 seconds)

```bash
cd soar-web
npm install
npm run dev
```

Open **http://localhost:3000**, enter password **`soar`**.

---

## Notes

- **Password gate:** `soar` (case-insensitive). Stored per browser session.
- **Fully static:** the homepage prerenders as static content, so it's fast and
  CDN-friendly. The 3D entrance and the looping "THE BOX" film run client-side
  (WebGL) and need a normal browser — they will not appear in a raw `curl`.
- **Custom domain:** in Vercel → Project → *Settings → Domains*, add your domain.
