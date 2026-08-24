# Changelog

All notable changes to Uncensored Translator are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub issue templates: `bug_report.md`, `feature_request.md`, and
  `config.yml` (issue chooser with links to Discussions and private security
  reporting).
- GitHub discussion template (`.github/DISCUSSION_TEMPLATE/general.yml`).
- Community docs: `SUPPORT.md`, `usage.md`, `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1), `SECURITY.md`.
- Assembly script `build.js` (deterministic build of `index.html` from sources).
- `screenshots/` directory with `clean-translation.png` and
  `uncensored-proof.png` for the README.
- `wiki/` content: Home, Architecture, Adding-Dictionary-Entries,
  Language-Support, and a `_Sidebar.md`.
- Social preview image (`assets/social-preview.png`).
- `.gitignore`.

### Changed
- README expanded with full How-It-Works section, verified examples,
  screenshots, and cross-links to all community files.

### Notes
- No behavioral change to the engine or dictionaries in this batch — it is
  documentation, templates, and project plumbing only. `node build.js` still
  produces a byte-identical `index.html`; `node test_engine.js` still passes
  all cases.

---

## [1.0.0] — 2026-08-24

### Added
- Initial release of Uncensored Translator.
- **Single self-contained `index.html`** (~110 KB) with all CSS, dictionaries,
  engine, and UI inlined.
- **Pure-JS dictionary engine** — no servers, no APIs, no network calls, no
  runtime dependencies.
- **10 languages** (top by total speakers): English, Mandarin, Hindi, Spanish,
  French, Arabic, Bengali, Portuguese, Russian, Urdu.
- **9 bilingual dictionaries** (English ↔ each other language), ~2,500 entries
  total, covering all 90 directed language pairs via pivot-through-English.
- **Longest-phrase-first matching** (up to 6 tokens lookahead, skipping
  non-word gaps) so multi-word entries like `good morning` match as a unit.
- **Unicode-aware tokenizer** using `[\p{L}\p{N}\p{M}]+`, including `\p{M}`
  combining marks — critical for correct Devanagari, Bengali, and Arabic input.
- **Two-step pivot** (`source → English → target`) with full phrase matching on
  **both** legs.
- **Uncensored dictionaries by design** — profanity, vulgarity, and slang
  included in every language; the engine translates whatever you type rather
  than refusing or softening it.
- **Terminal "raw signal / wire transmission" UI**: monospace, scanline
  overlay, grid background, glowing wire seam, signal-strength bars.
- **Auto-translate** with ~420 ms debounce; **manual transmit** via
  `Ctrl`/`Cmd`+`Enter` or the TRANSMIT button.
- **Swap & round-trip** button that flips languages and moves output into the
  source box.
- **2,000-character input cap** with amber/red warning states.
- `test_engine.js` — Node test harness covering direct pairs, pivot pairs,
  profanity, and passthrough cases (no test-framework dependency).
- MIT `LICENSE`.

### Engine details
- Tokenizer regex: `/[\p{L}\p{N}\p{M}]+(?:[''\-\][\p{L}\p{N}\p{M}]+)*/gu`
- Exposed API: `window.TRANSLATOR = { translate, LANGS }`
- Routing: same-language passthrough; English source → `fwd[tgt]`; English
  target → `rev[src]`; otherwise two-step pivot.
- Unknown tokens pass through unchanged (engine never throws on unknown input).

### Known limitations (documented, not bugs)
- No grammar or word-order reshuffling (phrase substitution, not a neural
  model).
- No context / disambiguation — one sense per word.
- Finite coverage (~2,500 entries); unknown words pass through.
- Pivot pairs can be rougher than direct pairs due to the English intermediate.

### Security properties (by design)
- No `innerHTML` of untrusted translation output (rendered as text nodes).
- No `eval` of user input.
- No network calls at runtime.
- No external dependencies.
