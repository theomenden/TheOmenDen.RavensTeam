# Raven's Team
- Introducing **Raven's Team** – the perfect Twitch extension to showcase your stream team!

## Features:
- A **scrollable list** for easy viewing of all your stream team members.
- A **customizable title with a banner** at the top, similar to the official Stream Team page.
- **Clickable title** that links directly to your full team page.
- **Live channels** display so viewers can instantly see which team members are online.
- **Schedulable events** so viewers can stay updated on upcoming streams or team events.
- Hyperlinked sections to your **team's websites or Discord**, making it easy for viewers to connect beyond Twitch.

With **Raven's Team**, your viewers can easily engage with your entire team, stay up to date on who’s live, and explore upcoming events – all in one place!

---

## Development

Stack: **Vite + React 19 + TypeScript 6 + Fluent UI v9**, tested with **Vitest**. The panel
is frontend-only — it calls the Twitch Helix API directly with the extension `helixToken`
from `onAuthorized` (no backend required for the MVP roster + live-status flow).

### Prerequisites
- Node 20+ and **pnpm** (`corepack enable pnpm`; version pinned in `package.json`).

### Commands
```sh
pnpm install
pnpm dev        # HTTPS dev server on https://localhost:8080 (self-signed via basic-ssl)
pnpm test       # Vitest unit + component tests
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint
pnpm build      # -> dist/ (relative asset paths, CSP-safe)
```

### Testing on Twitch (Local Test)
Auth (`helixToken`) only exists inside a Twitch iframe, so real data requires Local Test.

**A locally-trusted cert is mandatory.** Twitch loads the panel in a cross-origin iframe, and
browsers won't let you click through a self-signed cert warning *inside* an iframe — the frame
just blanks and you get `Extension Helper Library Not Loaded`. Use [mkcert](https://github.com/FiloSottile/mkcert)
(one-time; `vite.config.ts` auto-detects `certs/` and falls back to basic-ssl when absent):
```sh
choco install mkcert          # or: scoop install mkcert
mkcert -install               # adds a local CA to the OS trust store — then restart Chrome
mkdir certs                   # mkcert won't create the output dir
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
```
Then:
1. `pnpm dev` (now serves over the trusted cert).
2. In the [Extensions Console](https://dev.twitch.tv/console/extensions) → **Asset Hosting**,
   set the testing **Base URI** to `https://localhost:8080/`, the Panel Viewer Path to
   `panel.html`, and the Configuration Path to `config.html`.
3. Add `https://static-cdn.jtvnw.net/` to the **Image Domains** allowlist (member avatars / team banners).
4. View the extension in **Local Test** on your own channel.

> **Heads-up — Private Network Access can block Local Test.** Chrome/Edge block a *public*
> page (Twitch's `supervisor.ext-twitch.tv`) from loading a *private* `localhost` iframe. The
> dev server already answers the PNA preflight (`Access-Control-Allow-Private-Network`, see
> `vite.config.ts`), but current browsers do **not** honor that opt-in for iframe *navigations* —
> the frame just stalls and you get `Extension Helper Library Not Loaded`. Two ways around it:
>
> - **Recommended — Hosted Test (no PNA, no cert):** `pnpm build`, zip the *contents* of `dist/`
>   (files at the zip root), upload on the **Files** tab, then **Move to Hosted Test**. Twitch
>   serves it from its own CDN (public→public), which sidesteps PNA entirely and mirrors prod.
> - **Fast local loop — disable PNA enforcement:** set `chrome://flags/#block-insecure-private-network-requests`
>   and `chrome://flags/#private-network-access-respect-preflight-results` to **Disabled**
>   (`edge://flags` for Edge), restart the browser, then Local Test loads from `localhost`.

Extension **Client ID**: `lalrvvljueuwdj1l778y6jcsuktevq` (public; also read at runtime via `onAuthorized`).

### Packaging
`pnpm build`, then zip the **contents** of `dist/` (files at the zip root, not the `dist/` folder)
and upload on the **Asset Hosting** tab.

> **Known verification item:** `Get Streams`/`Get Users` are documented as frontend-callable
> with `helixToken`; `Get Channel Teams`/`Get Teams` meet the same criteria (user-token,
> no scopes) but aren't named explicitly in Twitch's docs — confirm in Local Test. If either
> is blocked, add a small read-only backend (EBS) for just the team lookups.
