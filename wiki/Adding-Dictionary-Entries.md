# Adding Dictionary Entries

This page is the detailed companion to the "Dictionary entries" section of
[CONTRIBUTING.md](https://github.com/uncensored-translator/uncensored-translator/blob/main/CONTRIBUTING.md).
If you want to improve translation coverage, this is where you start.

## The entry format

Every entry is a plain object with an `en` key and one other-language key
(two-letter code):

```js
{ en: "hello", es: "hola" }
```

That single line automatically produces **both** directions:

- `fwd.es["hello"] = "hola"` (English → Spanish)
- `rev.es["hola"] = "hello"` (Spanish → English)

You never write the reverse entry yourself.

## Where entries live

- `dict_part1.js` — `DICT_EN_ZH`, `DICT_EN_HI`, `DICT_EN_ES`, `DICT_EN_FR`
- `dict_part2.js` — `DICT_EN_AR`, `DICT_EN_BN`, `DICT_EN_PT`, `DICT_EN_RU`,
  `DICT_EN_UR`

Each is a top-level `const DICT_EN_XX = [ ... ];` array. Add entries inside the
array, ideally grouped by category with a comment, matching the existing
style:

```js
 // food
 { en: "bread", es: "pan" },
 { en: "water", es: "agua" },
 { en: "coffee", es: "café" },
```

## Conventions

### Lowercase keys

The engine lowercases input before lookup. **Store keys in lowercase.** Do not
store `"Hello"` — store `"hello"`. Capitalization in the user's input is
ignored, and output case is not currently transformed.

### Preserve diacritics — do not fold them

Match the natural spelling: `cómo`, `café`, `naïve`, `sobremesa`. The
tokenizer preserves combining marks, so diacritics are part of the token. Do
not strip them to "simplify" matching — that would break correctness for
languages where diacritics are phonemically distinct.

### Prefer phrases over single words when a phrase exists

The engine matches **longest-first**. So `{ en: "good morning", es: "buenos días" }`
as one entry wins over the two separate entries `{ en: "good" }` +
`{ en: "morning" }` matched individually. Add the phrase as a single entry.

But **also keep the component words** as individual entries, so that when only
part of a phrase is present (`"good evening"` when only `"good morning"` is
defined), the words still translate.

### Aim for consistent cross-language coverage

A word added to one dictionary will only translate to/from that one language.
For good **pivot** behavior (`X → English → Y`), the same English word should
ideally exist in all 9 dictionaries. Inconsistent coverage does not crash —
the word just passes through unchanged in the missing direction — but
consistency makes pivots much more useful.

If you only know a subset of languages, contribute what you know. Partial
coverage is welcome; reviewers may fill in the rest.

### Profanity is in scope

Uncensored by design. Profanity, vulgarity, and slang belong in the
dictionaries. Do not self-censor, and do not "clean up" existing entries. See
[SECURITY.md](https://github.com/uncensored-translator/uncensored-translator/blob/main/SECURITY.md):
profanity is explicitly out of scope for reports.

## A worked example: adding "coffee" across all 9 dictionaries

`dict_part1.js`:

```js
 // drinks
 { en: "coffee", zh: "咖啡" },
 { en: "coffee", hi: "कॉफी" },
 { en: "coffee", es: "café" },
 { en: "coffee", fr: "café" },
```

`dict_part2.js`:

```js
 // drinks
 { en: "coffee", ar: "قهوة" },
 { en: "coffee", bn: "কফি" },
 { en: "coffee", pt: "café" },
 { en: "coffee", ru: "кофе" },
 { en: "coffee", ur: "کافی" },
```

Now `coffee` translates in all 90 directions that pass through it, e.g.
`es → ru` ("café" → English "coffee" → "кофе").

## After adding entries

1. **Rebuild:**
   ```bash
   node build.js
   ```
2. **Add a test case** to `test_engine.js`:
   ```js
   t("en", "es", "coffee");
   t("es", "ru", "café");   // pivot
   ```
3. **Run tests:**
   ```bash
   node test_engine.js
   ```
   Confirm the expected output prints.
4. **Commit** the source files **and** the rebuilt `index.html` together.

## Things to avoid

- **Do not** store capitalized keys (`"Hello"`).
- **Do not** fold diacritics (`"cafe"` instead of `"café"`).
- **Do not** duplicate the reverse direction — one entry covers both.
- **Do not** filter or soften profanity.
- **Do not** hand-edit `index.html` — edit the source and rebuild.
- **Do not** add entries that require network lookups. The dictionaries are
  static data.
