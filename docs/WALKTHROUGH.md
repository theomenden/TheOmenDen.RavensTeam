# Raven's Team: Feature Walkthrough

This guide explains what Raven's Team does and how to use every feature in version 1.0.0. It is written for two audiences: broadcasters who install and configure the extension, and viewers who interact with the panel on a channel.

Raven's Team is a Twitch panel extension. It shows the stream teams a channel belongs to, lists each team's members, marks who is live right now, and lets viewers follow members and personalize how the panel looks.

## Contents

1. For viewers: using the panel
2. For broadcasters: configuring the panel
3. How broadcaster defaults and viewer choices work together
4. Accessibility
5. Quick settings reference

## 1. For viewers: using the panel

The panel appears under a channel's video, in the panel area below the stream.

### Choosing a team

If the channel belongs to more than one stream team, use the dropdown inside the purple header bar to pick a team. The first team is selected automatically when the panel loads, so there is always something to see. Selecting a different team swaps the roster below.

### The header

The header bar stays pinned at the top while the roster scrolls beneath it. It contains three things:

1. The team name, or the team's banner image if the team has one. Clicking it opens that team's page on Twitch in a new tab.
2. The team picker dropdown described above.
3. A member count, shown as a small tag in the lower right, directly below the dropdown. It reflects the team you are currently viewing.

When you switch teams, the headline fades in smoothly so the change feels intentional rather than abrupt.

### Reading the roster

Each row in the roster represents one team member and shows:

1. Their profile picture, with a small status dot. A filled green dot means the member is live right now. A muted dot means they are offline.
2. Their display name, which links to their channel on Twitch and opens in a new tab.
3. A Follow button on the right.

The list is built to stay fast even for large teams. Only the rows on screen are loaded, and live status is checked only for the members you can currently see. Rows alternate between two subtle background shades (zebra striping) so each channel is easy to tell apart at a glance.

### Following a channel

Click the Follow button on any row to follow that channel. This opens Twitch's own follow confirmation, which is the standard and safe way for an extension to start a follow. Hovering the button lifts it slightly and deepens its shadow, and pressing it gives a gentle push-in response, so you always get clear feedback. Resting your pointer on the button shows a short tooltip that explains what it does.

Once you follow a channel during your visit, the button changes to a filled heart labeled Following. Note that the panel can only reflect follows you make through the panel in the current session. It does not read your existing follow history, so a member you already followed elsewhere will still show a Follow button until you follow again here.

### Personalizing the panel

Open your personal settings with the gear button in the top right corner of the panel. A settings drawer slides in from the right with these controls:

1. Theme. Choose Match Twitch (follows your Twitch light or dark setting), Light, Dark, or High contrast.
2. Font. Choose Default, Serif, Monospace, or Rounded. All choices use fonts already on your device, so nothing extra is downloaded.
3. Text size. Choose Small, Normal, or Large to scale the text throughout the panel.
4. Density. Choose Comfortable or Compact. Compact tightens spacing so more rows fit at once.
5. Reduce motion. Turn this on to remove animations and transitions if you prefer a calmer, still interface.

Your choices apply immediately as you make them. They are saved on your own device, so they persist the next time you open this panel. They are private to you and do not affect other viewers.

The Reset to channel defaults button clears all of your personal choices and returns the panel to whatever the broadcaster set as the default.

## 2. For broadcasters: configuring the panel

Broadcasters set the panel's default appearance from the Twitch Extensions dashboard. There are two places to do this, and they share the same set of controls.

### The Config page

The Config page is the setup screen for the extension. Open it from the extension's configuration view in the Twitch dashboard. Here you choose the default Theme, Font, Text size, Density, and Reduce motion setting for your panel. These defaults apply to every viewer who opens the panel, unless a viewer has set their own personal choice.

As you change the controls, the page previews the result live, so you can see the theme, font, and sizing before you commit. Click Save to store the defaults.

### The Live Config page

The Live Config page appears in the Live module of your dashboard while you are streaming. It offers the same controls as the Config page, framed for live use. This lets you adjust the panel's look during a broadcast. When you click Apply, the change is delivered to viewers who already have the panel open, so the update reaches your audience without them needing to refresh.

### The available settings

Both broadcaster pages expose the same options that viewers can personalize:

1. Theme: Match Twitch, Light, Dark, or High contrast.
2. Font: Default, Serif, Monospace, or Rounded.
3. Text size: Small, Normal, or Large.
4. Density: Comfortable or Compact.
5. Reduce motion: on or off.

### How saving works

Saving on either page stores your choices in Twitch's Configuration Service under your channel. New panels pick up the saved defaults when they load, and open panels are updated as soon as you save. No separate server or account is required.

## 3. How broadcaster defaults and viewer choices work together

The panel decides what to show for each setting using a simple order of priority:

1. If a viewer has set a personal choice for a setting, that choice is used.
2. Otherwise, the broadcaster's saved default for that setting is used.
3. Otherwise, a sensible built in default is used.

This applies to each setting on its own. For example, a viewer can override only the theme while still following the broadcaster's default font and density. A viewer's Reset to channel defaults button removes all of their personal choices at once, so every setting falls back to the broadcaster's default.

## 4. Accessibility

Raven's Team is built with accessibility in mind:

1. High contrast theme. A dedicated high contrast option maximizes legibility for viewers who need it.
2. Text size control. Viewers and broadcasters can scale text up for easier reading.
3. Reduce motion. Both a viewer toggle and the operating system's reduced motion preference remove animations and transitions.
4. Screen reader support. Live status is announced, each roster row reports its position and the total member count, follow buttons have descriptive labels, and status messages are announced when they appear.
5. Keyboard and browser native controls. The team picker, the setting menus, and the settings drawer use standard controls that work with assistive technology and do not obscure the panel.

## 5. Quick settings reference

Theme
- Options: Match Twitch, Light, Dark, High contrast.
- Effect: Changes the color scheme of the whole panel. Match Twitch follows the viewer's Twitch light or dark setting.

Font
- Options: Default, Serif, Monospace, Rounded.
- Effect: Changes the typeface used throughout the panel. Uses fonts already installed on the device.

Text size
- Options: Small, Normal, Large.
- Effect: Scales all text in the panel up or down.

Density
- Options: Comfortable, Compact.
- Effect: Compact tightens spacing so more of the roster is visible at once.

Reduce motion
- Options: On, Off.
- Effect: Removes animations and transitions for a calmer, still interface.

Every setting is available to broadcasters as a channel default and to viewers as a personal override, with the viewer's choice taking priority for that viewer only.
