# Contributing to Uncensored Translator

Thanks for your interest in improving this project. Uncensored Translator is a
small, deliberately focused codebase — a single self-contained HTML file built
from a handful of source files — so contributing is straightforward. This guide
covers the development setup, the coding standards we keep, and the pull request
process.

## Project Layout

The shipped product is one file — `index.html` — but it is **assembled** from
smaller source files. Never edit `index.html` directly; edit the sources and
rebuild.

```
uncensored-translator/
├── index.html         # ASSEMBLED output — do not hand-edit (run build.js)
├── build.js           # Assembly script: ui.html + styles.css + dicts + engine + ui -> index.html
├── ui.html            # HTML template (contains two injection markers)
├── styles.css         # All CSS ("raw signal / wire transmission" terminal aesthetic)
├── dict_part1.js      # Dictionaries: EN-ZH, EN-HI, EN-ES, EN-FR  (~1250 entries)
├── dict_part2.js      # Dictionaries: EN-AR, EN-BN, EN-PT, EN-RU, EN-UR  (~1250 entries)
├── engine.js          # The translation engine (tokenizer + phrase matcher + pivot logic)
├── ui.js              # UI logic (dropdowns, auto-translate, swap, transmit)
├── test_engine.js     # Node test harness for the engine + dictionaries
├── README.md
├── LICENSE            # MIT
├── CONTRIBUTING.md    # this file
├── CODE_OF_CONDUCT.md # Contributor Covenant v2.1
└── SECURITY.md
```

**Total dictionary entries:** ~2,500 across 9 bilingual dictionaries
(English ↔ each of the other 9 languages), covering all 90 language pairs via
pivot-through-English.

## Development Setup

### Prerequisites

- **Node.js 18+** (only needed for the build script and the test harness — the
  app itself runs in any modern browser).
- A modern browser (Chromium, Firefox, or Safari) for manual testing.
- No npm install step. There are **no dependencies** — the project has a
  `package.json`-free, zero-dependency policy by design.

### Running locally

You need a static file server because some browsers restrict features on
`file://` URLs. Any static server works:

```bash
# Option A — Python (usually preinstalled)
python3 -m http.server 8000

# Option B — Node
npx --yes serve -l 8000
```

Then open <http://localhost:8000/index.html> in your browser.

### Building

After changing any source file, rebuild the assembled file:

```bash
node build.js
```

This reads `ui.html`, injects `styles.css` into the CSS marker and the
concatenated `dict_part1.js + dict_part2.js + engine.js + ui.js` into the JS
marker, and writes `index.html`. The build is deterministic — running it on
unchanged sources reproduces a byte-identical `index.html`.

### Running the tests

```bash
node test_engine.js
```

The harness simulates the browser globals, evaluates the dictionaries and
engine, and prints translations for direct pairs (English ↔ X), pivot pairs
(X → Y via English), profanity, and passthrough cases. There is no test
framework dependency — it is plain Node with `console.log` assertions you read
by eye. Add your new test cases to the bottom of the file.

## Coding Standards

### General principles

1. **Zero dependencies.** Do not add npm packages, CDNs, remote fonts, or any
   network call. The shipped `index.html` must work fully offline.
2. **One file ships.** Everything the user needs is inlined into
   `index.html`. Keep the sources split for maintainability, but the build must
   remain a single self-contained file.
3. **Honest tradeoffs.** The README and the in-app footer are explicit that
   this is phrase substitution, not a neural model. Do not add claims that
   overstate the engine's grammatical capabilities.
4. **Uncensored by design.** Profanity, vulgarity, and slang are intentionally
   included in every dictionary. Do not "clean up" or filter dictionary
   entries — that defeats the project's entire purpose. (See `SECURITY.md`:
   profanity is explicitly out of scope for reports.)

### Dictionary entries

- **Format:** each entry is a plain object `{ en: "...", xx: "..." }` where
  `xx` is the two-letter language code (`zh`, `hi`, `es`, `fr`, `ar`, `bn`,
  `pt`, `ru`, `ur`).
- **Add entries in both directions implicitly.** The build of `fwd` and `rev`
  maps is automatic — one entry creates both the English→X and X→English
  lookups. You do not need to duplicate.
- **Prefer phrases over single words when a phrase exists.** The engine matches
  longest-first, so `"good morning"` as a single entry wins over the two
  separate words `"good"` + `"morning"`. If you add a phrase, make sure its
  component words also exist individually (for partial-match fallback).
- **Keep entries lowercase.** The engine lowercases input before lookup. Do not
  store capitalized keys.
- **No diacritic folding.** Match the natural spelling — `cómo`, `café`,
  `naïve` — because the tokenizer preserves combining marks (`\p{M}`). This is
  what makes Devanagari and Bengali input work.
- **Pair coverage.** If you add a word to `dict_part1.js` (say a new English
  noun), consider whether it should also appear in the other 8 dictionaries for
  consistent cross-language pivoting. Inconsistent coverage just means a word
  won't translate in some directions — not a crash — but consistency improves
  the pivot experience.

### The engine (`engine.js`)

- The tokenizer regex is
  `/[\p{L}\p{N}\p{M}]+(?:[''\-\][\p{L}\p{N}\p{M}]+)*/gu`. **Do not remove
  `\p{M}`** — combining marks (virama, vowel signs in Devanagari/Bengali,
  Arabic diacritics) are essential. Removing it re-breaks Indic input.
- `translateDirect(text, table)` does single-step longest-phrase-first matching
  (scans up to 6 word tokens ahead, skipping non-word gaps). Keep the 6-token
  lookahead reasonable — larger values slow worst-case matching.
- `translate(text, src, tgt)` routes: same language returns text; English
  source uses `fwd[tgt]`; English target uses `rev[src]`; otherwise it pivots
  `src → en → tgt` calling `translateDirect` twice so **both legs** get full
  phrase matching. Do not collapse the pivot into a single pass.
- Preserve the `window.TRANSLATOR = { translate, LANGS }` export — the UI and
  the test harness depend on it.

### The UI (`ui.js`)

- Render translation output as **text**, never as `innerHTML`. Translated
  strings can contain `<`, `>`, `&`, or markup-like characters; injecting them
  as HTML is an XSS vector. Keep using text nodes.
- The 2000-character input cap (`MAX = 2000`) and the 80%/100% warning states
  are intentional UX guards — keep them.
- Auto-translate is debounced (420ms). Do not make it fire on every keystroke.
- The swap button flips languages **and** moves the output into the source box
  for round-trip translation. Preserve that behavior.

### CSS (`styles.css`)

- The "raw signal / wire transmission" aesthetic is the visual identity. The
  CSS variables (`--signal`, `--bg`, the monospace stack), the scanline overlay
  (`body::before`), the grid (`body::after`), and the wire-seam pulse animation
  are core to the look. Change them deliberately, not accidentally.
- Keep the 720px responsive breakpoint in sync with any panel-layout changes.

### Style

- 2-space indentation, semicolons, single quotes for JS strings.
- Keep files under reasonable size; if a dictionary part grows beyond ~50KB,
  split it (the project already splits into `dict_part1.js` /
  `dict_part2.js`).

## Pull Request Process

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b feat/add-medical-terms
   ```
   Use a descriptive prefix: `feat/`, `fix/`, `dict/` (dictionary additions),
   `docs/`, `style/`, `refactor/`.

2. **Make your changes in the source files**, not in `index.html`.

3. **Rebuild and test:**
   ```bash
   node build.js
   node test_engine.js
   ```
   Both must pass. If you added dictionary entries, add corresponding test
   cases to `test_engine.js` and confirm the expected output prints.

4. **Commit `index.html` too.** The assembled file is committed (not built in
   CI) so the repo is usable without Node. Your PR must include the rebuilt
   `index.html` that matches your source changes.

5. **Open a pull request** against the `main` branch. In the PR description:
   - Summarize **what** changed and **why**.
   - List which languages are affected.
   - Paste the relevant `test_engine.js` output showing before/after.
   - Note any new profanity/vulgarity explicitly so reviewers can confirm it is
     in-scope (it is) rather than an accidental addition.

6. **Review.** A maintainer will review for: build correctness, test passage,
   the zero-dependency rule, no `innerHTML` of translated text, and
   consistency with the uncensored-by-design principle.

7. **Squash-merge** on approval. PR titles become the commit message — write
   them in the imperative ("Add 40 food terms to EN-PT dictionary").

## Good First Issues

If you're looking for somewhere to start:

- **Add dictionary entries.** More coverage = better pivots. Pick a domain
  (food, travel, technology, emotions) and add consistent entries across all 9
  dictionaries.
- **Fix a translation gap.** If `test_engine.js` shows a word passing through
  unchanged when it shouldn't, add the missing entry.
- **Improve the README** — better examples, clearer tradeoff explanation, more
  screenshots.
- **Add test cases** to `test_engine.js` for language pairs not yet covered.

## Questions

Open a GitHub issue with the `question` label. For security matters, follow
`SECURITY.md` (report privately, not via a public issue).

By participating, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).
