# Usage

A practical guide to using Uncensored Translator. For installation, see
[README.md → Quick Start](README.md#quick-start). For how the engine works
internally, see [README.md → How It Works](README.md#how-it-works) and the
[wiki](https://github.com/uncensored-translator/uncensored-translator/wiki).

## Opening the tool

You need the single file `index.html` and a modern browser. Three ways to open
it:

### 1. Open the file directly

Double-click `index.html`, or:

```bash
# macOS
open index.html

# Linux (xdg)
xdg-open index.html
```

This works because the project makes no network requests, so `file://` is fine.

### 2. Serve it locally (recommended for development)

Some browsers restrict `file://` in edge cases. A static server avoids that:

```bash
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

or

```bash
npx --yes serve -l 8000
```

### 3. Host it anywhere

Drop `index.html` on GitHub Pages, Netlify, Vercel, S3, or any static host.
It is fully self-contained — no build step needed to deploy, no environment
variables, no backend.

## The interface

When you open `index.html` you see the terminal-styled UI:

```
┌─────────────────────────────────────────────────────────────┐
│  UNCENSORED TRANSLATOR      SIGNAL LIVE  ENGINE LOCAL  NET OFF │
├───────────────────────┬───────────────────────────────────────┤
│   SOURCE  [ ENGLISH ▾]│  TARGET  [ SPANISH ▾]                  │
│                       │                                        │
│  type here...         │   translation appears here...          │
│                       │                                        │
│  0 / 2000 CHARS       │                          [ CLEAR ] [ TRANSMIT ] │
└───────────────────────┴───────────────────────────────────────┘
                       [ ⇄ swap ]
```

- **Left panel** — the source language and input box. Defaults to English.
- **Right panel** — the target language and output box. Defaults to Spanish.
- **Swap button** (⇄) — flips source/target languages **and** moves the output
  into the input box so you can translate it back (a round-trip).
- **CLEAR** — empties the input.
- **TRANSMIT** — manually triggers a translation (you can also press
  `Ctrl`/`Cmd`+`Enter`).
- **Header status** — `SIGNAL LIVE`, `ENGINE LOCAL`, `NET OFF`, and signal
  bars confirm the engine is running entirely on your machine.

## Selecting languages

Each panel has a dropdown with the 10 supported languages:

| Code | Language    |
|------|-------------|
| `en` | English     |
| `zh` | Mandarin    |
| `hi` | Hindi       |
| `es` | Spanish     |
| `fr` | French      |
| `ar` | Arabic      |
| `bn` | Bengali     |
| `pt` | Portuguese  |
| `ru` | Russian     |
| `ur` | Urdu        |

You can set source and target to any combination, including the same language
(which returns the text unchanged).

## Typing and translating

1. Click the left input box and start typing.
2. As you type, the character counter updates: `N / 2000 CHARS`. The counter
   turns amber near the limit and red at 2,000.
3. After you stop typing for a brief moment (~420 ms debounce), the
   translation appears automatically in the right panel.
4. To force an immediate translation, press `Ctrl`+`Enter` (or `Cmd`+`Enter`
   on macOS), or click **TRANSMIT**.

### Character limit

The input is capped at **2,000 characters**. This is a UX guard to keep the
phrase matcher responsive. For longer text, translate in chunks.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl`/`Cmd` + `Enter` | Transmit (translate immediately) |

More shortcuts may be added; check the [CHANGELOG](CHANGELOG.md) for updates.

## Swapping and round-tripping

Click the **swap** button (⇄) between the panels. It does two things at once:

1. Swaps the source and target languages.
2. Moves the current output into the input box.

This lets you immediately translate the result back into the original language
— a round-trip — which is useful for sanity-checking a translation or for
chaining through a third language.

**Example round-trip:**

```
1. en -> es :  "i love you"        =>  "te amo"
2. click swap (now es -> en, input = "te amo")
3. es -> en :  "te amo"            =>  "i love you"
```

## Working with non-Latin scripts

The tokenizer handles Unicode combining marks (`\p{M}`), so scripts with
vowel signs and viramas work correctly:

- **Hindi (Devanagari):** `नमस्ते` is treated as one token, not split at the
  virama.
- **Bengali:** `ধন্যবাদ` is treated as one token.
- **Arabic:** `شكرا` is treated as one token.
- **Mandarin / Russian:** treated as expected (no combining-mark issues).

You can paste text in any of these scripts directly into the input box.

## What translates and what doesn't

- **In the dictionary** → translated, including multi-word phrases (matched
  longest-first). e.g. `good morning` → `buenos días` (one phrase), not
  `bueno` + `mañana`.
- **Not in the dictionary** → passed through unchanged. e.g.
  `supercalifragilistic` → `supercalifragilistic`.
- **Pivot pairs** (`X → Y` where neither is English) → translated in two steps
  via English. Both steps use phrase matching, but the English intermediate can
  lose nuance.

## Uncensored output

The dictionaries include profanity, vulgarity, and slang in every language on
purpose. If you type a swear word that is in the dictionary, it will be
translated — not refused, not softened. This is the core feature. If that is
not what you want, this is the wrong tool.

See [README.md → Why](README.md#why) and
[README.md → The Honest Tradeoff](README.md#the-honest-tradeoff).

## Using the engine programmatically

The engine is reusable outside the UI. It is exposed as
`window.TRANSLATOR`.

### In the browser

```js
const { translate, LANGS } = window.TRANSLATOR;

translate("i love you", "en", "es");   // "te amo"
translate("te amo",     "es", "fr");   // "je t'aime"  (pivot via English)
translate("你好",       "zh", "en");   // "hello"
translate("good morning","en","zh");   // "早上好"
translate("fuck you",   "en", "ru");   // "пошёл на хуй"

LANGS; // ["en","zh","hi","es","fr","ar","bn","pt","ru","ur"]
```

### In Node

```js
global.window = {};
const fs = require("fs");
const code = ["dict_part1.js", "dict_part2.js", "engine.js"]
  .map(f => fs.readFileSync(f, "utf8")).join("\n;\n");
eval(code);

const { translate, LANGS } = global.window.TRANSLATOR;
translate("i am hungry", "en", "ru");  // "я голоден"
```

### API reference

```ts
interface Translator {
  translate(text: string, src: LangCode, tgt: LangCode): string;
  LANGS: LangCode[]; // ["en","zh","hi","es","fr","ar","bn","pt","ru","ur"]
}

type LangCode = "en" | "zh" | "hi" | "es" | "fr" | "ar" | "bn" | "pt" | "ru" | "ur";
```

- `translate` never throws on unknown input — unknown words pass through.
- `translate(text, x, x)` returns `text` unchanged.
- Source/target can be any of the 10 codes in any combination (90 directed
  pairs).

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| A word came through unchanged | Not in the dictionary — add it (see [CONTRIBUTING.md](CONTRIBUTING.md)) |
| Word order looks wrong in output | Expected — no grammar reshuffling (see [README.md → Honest Tradeoff](README.md#the-honest-tradeoff)) |
| Page is blank / nothing happens | Try a static server instead of `file://`; check browser console |
| Character counter is red | You hit the 2,000-char cap — shorten the input |
| Translation didn't update | Wait for the debounce, or press `Ctrl`/`Cmd`+`Enter` |

For anything else, see [SUPPORT.md](SUPPORT.md).
