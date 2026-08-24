# Uncensored Translator — Wiki Home

Welcome to the Uncensored Translator wiki. This is the deeper documentation
behind the [README](https://github.com/uncensored-translator/uncensored-translator#readme).

Uncensored Translator is a self-contained, offline, **uncensored** translator
for the top 10 languages by total speakers. The entire engine — dictionaries
and all — runs in your browser with no servers, no APIs, and no network calls.

## Pages

- **[[Architecture]]** — how the engine, dictionaries, build, and UI fit
  together.
- **[[Adding-Dictionary-Entries]]** — the entry format, conventions, and how to
  add words/phrases across all 9 dictionaries.
- **[[Language-Support]]** — the 10 languages, why they were chosen, and
  script/tokenization notes (especially the `\p{M}` combining-mark handling for
  Devanagari, Bengali, and Arabic).

## Start here

- New to the project? Read the
  [README](https://github.com/uncensored-translator/uncensored-translator#readme)
  first, especially the **How It Works** and **The Honest Tradeoff** sections.
- Want to use it? See [usage.md](https://github.com/uncensored-translator/uncensored-translator/blob/main/usage.md).
- Want to contribute? See [CONTRIBUTING.md](https://github.com/uncensored-translator/uncensored-translator/blob/main/CONTRIBUTING.md).
- Need help? See [SUPPORT.md](https://github.com/uncensored-translator/uncensored-translator/blob/main/SUPPORT.md).

## The one-sentence summary

A phrasebook-grade, fully-offline, zero-dependency, deliberately-uncensored
word-and-phrase translator for the world's top 10 languages, shipped as a
single HTML file.

## Design principles (in priority order)

1. **Uncensored.** Profanity, vulgarity, and slang are in every dictionary by
   design. The tool translates what you type, not a softened version.
2. **Offline.** Zero network calls at runtime. Works with the network cable
   unplugged.
3. **Zero dependencies.** No npm packages, no CDNs, no remote fonts, no
   framework. One file.
4. **Honest.** The docs and in-app footer are explicit that this is phrase
   substitution, not a neural model — grammar and word order are not
   reshuffled.

Anything that conflicts with these four is, by definition, out of scope.
