# Social Preview

The repository social preview image is **`assets/social-preview.png`**.

To set it on GitHub: **Repo → Settings → Organization and profile → Social
preview → Edit → Upload an image…** → choose `assets/social-preview.png`.
This is the image shown in link unfurls (Twitter/X, Slack, Discord, LinkedIn)
and in the repository sidebar.

## Recommended dimensions

- **1280 × 640 px** (GitHub's social preview spec).
- PNG or JPG, under 1 MB. The committed file is ~1.5 MB PNG — if you need it
  smaller, re-export as optimized PNG or JPG.

## Generation prompts

The preview was generated with the prompt below. If you want to regenerate or
create variants, here are the prompts to use.

### Main prompt (used for `social-preview.png`)

```
A GitHub social preview banner, 1280x640 pixels, dark terminal aesthetic. Deep
near-black background (#05080a) with a subtle cyan-green grid overlay and faint
horizontal scanlines. At the top-left, a small live status row in monospace:
"SIGNAL LIVE ●  ENGINE LOCAL  NET OFF" with tiny signal-strength bars in
glowing green (#00ffaa). Centered, the main title "UNCENSORED TRANSLATOR" in a
large bold monospace font, bright glowing green (#00ffaa) with a slight glow,
and below it the subtitle "// RAW SIGNAL — OFFLINE — ZERO DEPENDENCIES" in
dimmer gray-green monospace. Below that, a row of 10 language labels in small
monospace spaced evenly: "EN · ZH · HI · ES · FR · AR · BN · PT · RU · UR" in
light gray. Along the bottom, a thin glowing horizontal "wire seam" line in
green with a bright pulse traveling along it. In the bottom-left corner, small
monospace text "v1.0 // 90 LANGUAGE PAIRS" and bottom-right "MIT LICENSE".
Overall cyberpunk terminal / wire-transmission vibe, monospace font throughout,
no photographic elements, crisp and clean. No real human faces.
```

### Variant prompt — lighter / more legible

If the dark theme reads poorly on a white-background unfurl, try:

```
A GitHub social preview banner, 1280x640 pixels, terminal aesthetic on a very
dark navy panel (#0a0f12) with a 1px cyan-green (#00ffaa) border. Monospace
throughout. Title "UNCENSORED TRANSLATOR" large and bright cyan-green, centered.
Subtitle "// OFFLINE · NO API · 10 LANGUAGES · 90 PAIRS" below in light gray.
A row of language codes "EN ZH HI ES FR AR BN PT RU UR" below that. A thin
glowing horizontal wire line near the bottom with a pulse dot. Small footer
"v1.0 · MIT" bottom-left. Clean, high-contrast, legible at small sizes.
```

### Variant prompt — "demo screenshot" style

For a preview that looks like the actual app:

```
A GitHub social preview banner, 1280x640, styled like a terminal translation
app screenshot. Dark background (#05080a), monospace, scanlines. Two panels:
left labeled SOURCE with "good morning, i love you" in English; right labeled
TARGET with "buenos días, te amo" in Spanish, glowing green. A swap arrow
between them. Header: "UNCENSORED TRANSLATOR · SIGNAL LIVE · NET OFF".
Footer: "OFFLINE · ZERO DEPENDENCIES · MIT". Glowing green (#00ffaa) accents.
```

## Re-generating

Re-run your image generator with one of the prompts above and save the result
to `assets/social-preview.png` (overwrite). Keep the 1280×640 aspect ratio.
