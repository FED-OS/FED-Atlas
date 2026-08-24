# Language Support

## The 10 languages

Uncensored Translator supports the top 10 languages by **total speakers**
(native + second-language speakers), per widely-cited rankings:

| Code | Language    | Script       | Family              |
|------|-------------|--------------|---------------------|
| `en` | English     | Latin        | Indo-European (Germanic) |
| `zh` | Mandarin    | Han (Simplified) | Sino-Tibetan   |
| `hi` | Hindi       | Devanagari   | Indo-European (Indic)    |
| `es` | Spanish     | Latin        | Indo-European (Romance)  |
| `fr` | French      | Latin        | Indo-European (Romance)  |
| `ar` | Arabic      | Arabic       | Afro-Asiatic (Semitic)   |
| `bn` | Bengali     | Bengali      | Indo-European (Indic)    |
| `pt` | Portuguese  | Latin        | Indo-European (Romance)  |
| `ru` | Russian     | Cyrillic     | Indo-European (Slavic)   |
| `ur` | Urdu        | Arabic (Nastaliq) | Indo-European (Indic) |

## Why these 10?

They are the languages with the largest total speaker populations. Choosing
the top 10 by total speakers (rather than native speakers alone) keeps the
tool useful for the broadest set of real-world conversations, since many of
these are major second languages.

The 10-language scope is a **deliberate design constraint**, not an oversight.
Adding an 11th language changes the project's framing. Feature requests for
additional languages are considered, but the boundary is intentional. See
[SUPPORT.md](https://github.com/uncensored-translator/uncensored-translator/blob/main/SUPPORT.md)
→ "I want an 11th language."

## Why English is the pivot

English is the pivot language for two reasons:

1. **Coverage efficiency.** 9 bilingual dictionaries (English ↔ each other
   language) yield all 90 directed pairs. Building 45 direct pairwise
   dictionaries would require ~12,500 entries for the same coverage — 5× the
   work.
2. **English is a common second language** among the speaker populations of
   the other 9, so an English intermediate is often a meaningful bridge.

The tradeoff: a two-step `X → English → Y` pivot can lose nuance that a direct
`X → Y` dictionary would preserve, because the English word is the bottleneck.
This is documented in the README's "Honest Tradeoff" section.

## Script and tokenization notes

The tokenizer is `/[\p{L}\p{N}\p{M}]+(?:[''\-\][\p{L}\p{N}\p{M}]+)*/gu`. The
`\p{M}` (combining marks) class is essential for several of these languages:

### Hindi (Devanagari) — `hi`

Devanagari uses a virama (U+094D) to suppress inherent vowels and vowel signs
(U+093E–U+094C) that combine with consonants. These are `\p{M}` marks, **not**
`\p{L}` letters. Without `\p{M}` in the tokenizer, a word like `नमस्ते`
("namaste") gets split into `नमस` + `्` + `त` + `े` and never matches the
dictionary. Including `\p{M}` keeps the whole cluster as one token.

### Bengali — `bn`

Same situation as Hindi: Bengali vowel signs and the virama (U+09CD) are
combining marks. `ধন্যবাদ` ("thank you") is one token only with `\p{M}`
included.

### Arabic — `ar`

Arabic diacritics (harakat) are combining marks. Even without full
vocalization, including `\p{M}` future-proofs matching for vocalized text.
The dictionary stores unvocalized forms (e.g. `شكرا`); input with or without
diacritics is handled by the tokenizer's grapheme clustering.

### Urdu — `ur`

Urdu is written in a Nastaliq style of the Arabic script, with extensive
combining marks and ligatures. The same `\p{M}` handling applies. Note that
Nastaliq rendering can be visually complex, but the underlying Unicode
codepoints tokenize cleanly.

### Mandarin — `zh`

Simplified Han characters. No combining marks needed; `\p{L}` covers Han.
Entries store simplified forms (e.g. `你好`, `早上好`). The dictionary does not
currently distinguish Traditional vs Simplified — it is Simplified by default.

### Russian — `ru`

Cyrillic. Covered by `\p{L}`. No special handling needed. Case is lowercased
before lookup (Russian has capitalization rules, but the engine lowercases
all input uniformly).

### Spanish, French, Portuguese — `es`, `fr`, `pt`

Latin script with diacritics. The diacritics in these languages are sometimes
precomposed (single codepoint, e.g. `é` = U+00E9) and sometimes decomposed
(base + combining mark). `\p{M}` ensures both forms tokenize consistently.
**Diacritics are preserved in dictionary keys** — do not fold them.

## Coverage status

Each of the 9 bilingual dictionaries has ~250–300 entries spanning greetings,
pronouns, question words, common verbs (with tense variants), nouns,
adjectives, adverbs, connectors, numbers, common phrases, and an
intentionally-included profanity/vulgarity set. Total: ~2,500 entries.

Coverage is finite and uneven across domains. Unknown words pass through
unchanged. The fastest way to improve a specific translation is to add the
missing entry — see
[[Adding-Dictionary-Entries]].

## Pair matrix

With 10 languages and English as pivot, all 90 directed pairs are covered:

```
       en  zh  hi  es  fr  ar  bn  pt  ru  ur
  en    -   ✓   ✓   ✓   ✓   ✓   ✓   ✓   ✓   ✓
  zh    ✓   -   ✓   ✓   ✓   ✓   ✓   ✓   ✓   ✓
  hi    ✓   ✓   -   ✓   ✓   ✓   ✓   ✓   ✓   ✓
  es    ✓   ✓   ✓   -   ✓   ✓   ✓   ✓   ✓   ✓
  fr    ✓   ✓   ✓   ✓   -   ✓   ✓   ✓   ✓   ✓
  ar    ✓   ✓   ✓   ✓   ✓   -   ✓   ✓   ✓   ✓
  bn    ✓   ✓   ✓   ✓   ✓   ✓   -   ✓   ✓   ✓
  pt    ✓   ✓   ✓   ✓   ✓   ✓   ✓   -   ✓   ✓
  ru    ✓   ✓   ✓   ✓   ✓   ✓   ✓   ✓   -   ✓
  ur    ✓   ✓   ✓   ✓   ✓   ✓   ✓   ✓   ✓   -
```

A `✓` means the pair translates via either a direct dictionary lookup (when
English is source or target) or a two-step pivot (otherwise).
