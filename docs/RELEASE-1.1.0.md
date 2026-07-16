# Raven's Team 1.1.0

## What the extension does

Raven's Team is a panel extension. It reads the stream teams a channel belongs to and lists
the members of whichever team the viewer picks, showing who is live right now and offering a
follow button for each channel.

The panel opens on the channel's first team. A dropdown in the header switches between teams
when a channel belongs to more than one. Each team's banner links out to its Twitch team page,
and a count under the dropdown says how many members that team has.

The roster is virtualized. Only the rows in view are rendered, and avatars and live status are
fetched for that visible window rather than for the whole team, so a 400-member team costs
roughly one small Helix request per scroll rather than hundreds up front. Scrolling waits 150ms
to settle before it fetches, so dragging the scrollbar doesn't fire a request per row.

Following goes through `Twitch.ext.actions.followChannel`, which hands the viewer Twitch's own
follow prompt. That is the only sanctioned way for an extension to start a follow, and it needs
no extra scopes. The panel can only see follows the viewer makes during that session, so a
channel the viewer already followed still shows a Follow button until they use it.

Three surfaces exist. Viewers get a settings drawer behind the gear in the panel's top-right
corner. Broadcasters get a config page during install and a live config page on the dashboard;
both write the same defaults, and only the framing copy differs. Viewers can override a
broadcaster's defaults for themselves, and reset back to them.

Settings cover theme (match Twitch, light, dark, high contrast), font, text size, density, and
reduced motion. Broadcaster defaults live in the Twitch Configuration Service. Viewer overrides
live in that viewer's `localStorage` and never leave the browser.

There is no backend. The panel calls Helix directly with the `helixToken` from `onAuthorized`.

## What changed since 1.0.0

### Icons

Five icons in the panel were hand-drawn SVG paths, kept inline to avoid depending on
`@fluentui/react-icons`. That reasoning did not survive checking. The package is already a
dependency of `react-avatar`, `react-badge` and `react-button`, all of which this panel uses, so
it was being bundled either way. It also tree-shakes: all five icons cost 0.7 kB gzipped.

The hearts, gear, dismiss and external-link glyphs are now Fluent icons, and every settings
control has one — theme, font, text size, density, reduced motion, reset, save. The icons are
unsized, so they scale with the viewer's text-size setting instead of being pinned to a fixed
pixel height. They carry no accessible name of their own, which is what you want: the label text
next to them is what a screen reader announces, so nothing gets read out twice.

### Accessibility

The settings drawer said `role="dialog"` but behaved like a plain div. Focus never moved into
it, could tab straight out into the roster behind it, and landed on `<body>` when the drawer
closed. It now moves focus to the close button on open, keeps focus inside while open, and
returns it to the gear on close. Escape closes it.

The gear was drawn in white on the team's brand bar. In the light theme that bar is a pale pink,
which put the gear at 1.44:1 against it — effectively invisible, on the only control that opens
settings. It now scores 10.74 in light, 17.96 in dark and 21.0 in high contrast.

Two announcements were being made to screen readers that probably never arrived. Both the member
count and the config page's save confirmation were created at the same moment as their text, and
a live region has to already exist for new content to register as a change. Both regions are now
always present, with only their contents changing.

The save confirmation also read "Saved ✓" with a literal check character in the string, which
screen readers announce as "check mark". The tick is now an icon and the announced text is just
"Saved".

The roster used `<div role="list">` and `<div role="listitem">`. Those are now real `<ul>` and
`<li>` elements. The brand bar is a `<header>` and the roster body is `<main>`. The config pages
had no landmark at all and now have one, plus their first test coverage.

Every control on all three surfaces now measures at least 24x24 CSS pixels. The policy links
were 20px tall and only passed on a technicality about the gap between them, which would have
broken the moment a third link joined the row.

### Links

Privacy Policy and Terms of Service links sit at the foot of all three settings surfaces. Both
open in a new tab, which is a requirement rather than a preference: Twitch sandboxes the
extension iframes and blocks top-level navigation, so a link that tried to navigate in place
would do nothing at all. Each names its destination and the new tab in a tooltip, and carries
the usual box-and-arrow marker.

### Other

The member count chip is now a Fluent Badge instead of a hand-rolled pill with a hardcoded
`rgba(0, 0, 0, 0.35)` scrim, so it holds its contrast on the brand bar in every theme.

The panel's padding and the header's full-bleed negative margins were both the literal value
8px, sitting in two different files and relying on each other. They are now the same spacing
tokens, so compact density moves them together instead of pulling the header out of alignment.

Dependencies moved to their current versions: pnpm 11.9.0 to 11.13.0, eslint 10.6.0 to 10.7.0,
typescript-eslint 8.62.1 to 8.64.0, vitest 4.1.9 to 4.1.10, vite 8.1.3 to 8.1.4, and
@tanstack/react-virtual 3.14.5 to 3.14.6. TypeScript stays on 6.0.3 by choice; 7.0.2 is out and
is a separate piece of work. vite 8.1.5 and pnpm 11.13.1 were both published within 24 hours of
the update and were left for the next pass, since pnpm holds back releases that new by default
as a supply-chain measure.

Test count went from 29 to 52.

## Notes for review

Both policy URLs need declaring on the version submission before this ships, under the rule that
every URL the front end reaches must be listed:

- `https://www.theomenden.com/policies/privacy-policy`
- `https://www.theomenden.com/policies/terms-of-service`

The JavaScript in the zip is minified, so expect the usual request for readable source. The
repository is the source of record.

`https://static-cdn.jtvnw.net/` still needs to be on the Image Domains allowlist. Member avatars
and team banners come from there.

The full set of hosts the panel touches, for anyone checking:

- `api.twitch.tv` is the only host it calls on its own. Everything the panel shows comes from
  Helix, using the `helixToken` from `onAuthorized`.
- `static-cdn.jtvnw.net` serves the avatar and banner images, at URLs Helix hands back.
- `extension-files.twitch.tv` serves the Twitch extension helper, which is the only script the
  page loads that isn't part of the bundle.
- `twitch.tv` and `www.theomenden.com` are link targets, not requests. Nothing is fetched from
  either. They open in a new tab when a viewer clicks a member, a team banner, or a policy link.

Grepping the bundle turns up one more URL, `react.dev`, which is worth explaining before it
raises a question. React builds that address into the text of an error it throws, so a developer
can look up what a minified error code meant. It is a string in a message. Nothing requests it.

There is no other network activity, no inline script in any of the three HTML files, and no
analytics or telemetry of any kind.

## The zip

`ravens-team-v1.1.0.zip`, built by `pnpm build` and zipped from the contents of `dist/` so the
HTML sits at the archive root, which is what the Asset Hosting paths expect.

```
config.html
live_config.html
panel.html
assets/main-DGgGvWue.js
assets/panel-BN94KHtw.js
assets/SettingsControls-CWQB-d1-.js
```

Roughly 150 kB, HTML and JavaScript only. A viewer opening the panel downloads about 145 kB
gzipped.
