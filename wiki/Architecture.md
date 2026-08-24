# Architecture

This page describes how the pieces of Uncensored Translator fit together.

## High-level

```
            ┌─────────────── SOURCE FILES ───────────────┐
            │                                            │
            │  ui.html   (template, 2 injection markers) │
            │  styles.css                                │
            │  dict_part1.js  (EN-ZH, EN-HI, EN-ES, EN-FR)│
            │  dict_part2.js  (EN-AR, EN-BN, EN-PT, EN-RU, EN-UR)│
            │  engine.js                                 │
            │  ui.js                                     │
            └───────────────────┬────────────────────────┘
                                │  node build.js
                                ▼
            ┌─────────── ASSEMBLED OUTPUT ───────────────┐
            │           index.html  (~110 KB)            │
            │   <style>  ← styles.css inlined            │
            │   <script> ← dicts + engine + ui inlined   │
            └───────────────────┬────────────────────────┘
                                │  open in browser
                                ▼
                     runs fully offline
```

The shipped artifact is a single `index.html`. It is **assembled** from source
files by `build.js` so the sources stay maintainable, but the output is
committed to the repo so it is usable without Node.

## Files

| File | Role |
|---|---|
| `index.html` | Assembled, self-contained, shippable file. Do not hand-edit. |
| `build.js` | Assembly script. Deterministic — reproduces byte-identical output. |
| `ui.html` | HTML template containing two markers: `/* CSS injected here... */` and `/* JS injected here... */`. |
| `styles.css` | All CSS. The "raw signal / wire transmission" terminal aesthetic. |
| `dict_part1.js` | Dictionaries `DICT_EN_ZH`, `DICT_EN_HI`, `DICT_EN_ES`, `DICT_EN_FR` (~1,250 entries). |
| `dict_part2.js` | Dictionaries `DICT_EN_AR`, `DICT_EN_BN`, `DICT_EN_PT`, `DICT_EN_RU`, `DICT_EN_UR` (~1,250 entries). |
| `engine.js` | Tokenizer + `translateDirect` + `translate` (pivot router). Exposes `window.TRANSLATOR`. |
| `ui.js` | UI logic: dropdowns, auto-translate, swap, transmit, char counter. |
| `test_engine.js` | Node harness; evals dicts+engine and prints test cases. |

## The engine (`engine.js`)

### Data structures

At load time, each bilingual dictionary `DICT_EN_XX` is compiled into two maps:

```js
fwd[xx][englishWord] = xxWord;   // English -> other language
rev[xx][xxWord]      = englishWord; // other language -> English
```

So one dictionary entry `{ en: "hello", es: "hola" }` produces both
`fwd.es["hello"] = "hola"` and `rev.es["hola"] = "hello"`.

### Tokenizer

```js
const wordRe = /[\p{L}\p{N}\p{M}]+(?:[''\-\][\p{L}\p{N}\p{M}]+)*/gu;
```

- `\p{L}` — letters
- `\p{N}` — numbers
- `\p{M}` — **combining marks** (virama, vowel signs, diacritics). This is the
  critical class. Without it, Devanagari `नमस्ते` gets split into
  `नमस` + `्` + `त` + `े` and never matches. Including `\p{M}` keeps each
  script's combined grapheme cluster as one token.
- The optional tail `(?:[''\-\][\p{L}\p{N}\p{M}]+)*` keeps apostrophe/hyphen-
  joined words together (`don't`, `well-being`).

Non-word characters (spaces, punctuation) are preserved as "gap" tokens so the
output retains the input's punctuation and spacing.

### `translateDirect(text, table)`

Single-step translation against one lookup table:

1. Tokenize the input.
2. Walk the token list. At each position, try to match the **longest** phrase
   (up to 6 word tokens ahead, skipping non-word gaps) against the table.
3. On a hit, emit the translation and advance past the matched phrase.
4. On a miss, emit the original token unchanged and advance by one.

Longest-first means `good morning` (a 2-word entry) wins over `good` + `morning`
(two 1-word entries matched separately).

### `translate(text, src, tgt)`

```js
function translate(text, src, tgt) {
  if (src === tgt) return text;
  if (src === "en") return translateDirect(text, fwd[tgt]);
  if (tgt === "en") return translateDirect(text, rev[src]);
  // Two-step pivot: src -> en -> tgt. Both legs use full phrase matching.
  const enIntermediate = translateDirect(text, rev[src]);
  return translateDirect(enIntermediate, fwd[tgt]);
}
```

The pivot is the key to covering 90 pairs from 9 dictionaries: any `X → Y`
translation goes `X → English → Y`, and **both legs** call `translateDirect`,
so both legs get full longest-phrase-first matching. (An earlier version did
the second leg word-by-word; fixing it to use `translateDirect` on both legs
was a significant correctness improvement.)

### Export

```js
window.TRANSLATOR = { translate, LANGS };
```

`LANGS = ["en","zh","hi","es","fr","ar","bn","pt","ru","ur"]`.

## The UI (`ui.js`)

- `LANG_META` — array of `{ code, name, tag }` for the 10 languages; populates
  both dropdowns.
- Default: source `en`, target `es`.
- `MAX = 2000` — input cap; counter turns amber at 80%, red at 100%.
- Auto-translate: debounced (~420 ms) on input.
- Manual transmit: `Ctrl`/`Cmd`+`Enter` or the TRANSMIT button → triggers the
  wire-pulse animation + signal-bar flash.
- Swap button: flips `src`/`tgt` **and** moves the output text into the source
  box (round-trip).
- **Output is rendered as text nodes, never `innerHTML`** — translated strings
  may contain `<`, `>`, `&`, so injecting as HTML would be an XSS vector.

## The build (`build.js`)

1. Read `ui.html`.
2. Read `styles.css` → inject into the CSS marker.
3. Read `dict_part1.js + dict_part2.js + engine.js + ui.js`, join with `\n;\n`
   → inject into the JS marker.
4. Write `index.html`.

Deterministic: identical inputs → byte-identical output. Verified by
diffing a rebuilt file against the committed one.

## The test harness (`test_engine.js`)

```js
global.window = {};
const code = ["dict_part1.js", "dict_part2.js", "engine.js"]
  .map(f => fs.readFileSync(f, "utf8")).join("\n;\n");
eval(code);
const TR = global.window.TRANSLATOR;
```

Then prints translations for direct pairs, pivot pairs, profanity, and
passthrough. No test framework — read the output by eye. Add cases as you add
entries.

## Why this architecture

- **Single file** because the goal is "download and run, anywhere, offline."
- **Pivot through English** because 9 bilingual dictionaries (2504 entries) are
  far cheaper to build and maintain than 45 direct pairwise dictionaries
  (~12,500 entries) for the same 90-pair coverage.
- **Longest-phrase-first** because naive word-by-word matching produces
  `"bueno mañana"` instead of `"buenos días"` for `good morning`.
- **`\p{M}` in the tokenizer** because Indic and Arabic scripts are
  combining-mark-heavy; omitting it silently breaks those languages.
