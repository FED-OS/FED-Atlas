# Uncensored Translator — Self-Contained JS Dictionary Engine

## Goal
Single-file HTML app. No API, no network, no model. Pure JS word/phrase-substitution dictionary I write myself. Translates ANY input (uncensored) across the top 10 languages, pivoting through English internally (X→en→Y covers all 90 pairs).

## Languages (top 10 by total speakers)
en, zh (Mandarin), hi, es, fr, ar, bn, pt, ru, ur

## Tasks
- [x] Build bilingual dictionaries: en<->zh, en<->hi, en<->es, en<->fr, en<->ar, en<->bn, en<->pt, en<->ru, en<->ur (core vocab + common phrases + uncensored/profanity set so "any words" works)
- [x] Build the JS translation engine: tokenize, phrase-match (longest first), word-match, fallback passthrough, pivot via en
- [x] Build the UI: raw-signal/wire-transmission aesthetic, two-pane source/target, language selectors, swap, transmit, char count, auto-translate on pause
- [x] Write CSS (terminal/transmission vibe — monospace, scanline, green-on-black or similar)
- [x] Assemble single self-contained index.html
- [x] Verify it loads and translates in browser
- [ ] Deliver to user
