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
Auth (`helixToken`) only exists inside a Twitch iframe, so real data requires Local Test:
1. `pnpm dev` and trust the self-signed cert (or use `mkcert` for a trusted localhost cert).
2. In the [Extensions Console](https://dev.twitch.tv/console/extensions) → **Asset Hosting**,
   set the testing **Base URI** to `https://localhost:8080/` and the Panel Viewer Path to `index.html`.
3. Add `https://static-cdn.jtvnw.net/` to the **Image Domains** allowlist (member avatars / team banners).
4. View the extension in **Local Test** on your own channel.

Extension **Client ID**: `lalrvvljueuwdj1l778y6jcsuktevq` (public; also read at runtime via `onAuthorized`).

### Packaging
`pnpm build`, then zip the **contents** of `dist/` (files at the zip root, not the `dist/` folder)
and upload on the **Asset Hosting** tab.

> **Known verification item:** `Get Streams`/`Get Users` are documented as frontend-callable
> with `helixToken`; `Get Channel Teams`/`Get Teams` meet the same criteria (user-token,
> no scopes) but aren't named explicitly in Twitch's docs — confirm in Local Test. If either
> is blocked, add a small read-only backend (EBS) for just the team lookups.
