# Support

## Getting help

Thank you for using Uncensored Translator. This guide points you to the right
place depending on what you need.

### Choose the right channel

| If you... | Then use |
|---|---|
| Found something **broken** (crash, wrong output that is not an expected tradeoff) | [Bug report issue template](.github/ISSUE_TEMPLATE/bug_report.md) |
| Have an **idea** for new entries, a language, or an improvement | [Feature request issue template](.github/ISSUE_TEMPLATE/feature_request.md) |
| Have a **question**, want translation help, or want to discuss ideas | [GitHub Discussions](https://github.com/uncensored-translator/uncensored-translator/discussions) |
| Found a **security vulnerability** | Report **privately** — see [SECURITY.md](SECURITY.md). Do not open a public issue. |
| Want to **contribute code or entries** | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Want to understand **how it works** internally | The [wiki](https://github.com/uncensored-translator/uncensored-translator/wiki) and [README.md](README.md#how-it-works) |

### Before you ask

Please skim these first — they answer most questions:

1. **[README.md — "The Honest Tradeoff"](README.md#the-honest-tradeoff)** —
   explains why grammar/word order is not reshuffled and why unknown words pass
   through unchanged. Most "it doesn't translate correctly" reports are
   actually this documented tradeoff, not a bug.
2. **[README.md — "How It Works"](README.md#how-it-works)** — the tokenizer,
   longest-phrase-first matching, and pivot-through-English architecture.
3. **[usage.md](usage.md)** — step-by-step usage including the swap/round-trip
   and keyboard shortcuts.

## Common questions

### "It left a word unchanged — is that a bug?"

No. If a word is not in the dictionary, it passes through verbatim. This is by
design (the engine never throws on unknown input). You can either add the word
to the relevant dictionary (see [CONTRIBUTING.md](CONTRIBUTING.md)) or file a
feature request asking for it.

### "The translation is grammatically wrong / word order is off."

That is expected. This is a word-and-phrase substitution engine, not a neural
model. It does not reshape grammar or word order to match the target language.
Output is phrasebook-grade. See [README.md → The Honest Tradeoff](README.md#the-honest-tradeoff).

### "It translated my swear word!"

Yes — that is the entire point. The dictionaries are uncensored by design.
Profanity, vulgarity, and slang are included in every language on purpose so
the tool translates whatever you actually type. This is **not** a bug and is
explicitly out of scope for security reports (see [SECURITY.md](SECURITY.md)).

### "It doesn't work offline."

It should. The shipped `index.html` makes zero network calls. If something
requires a connection, you may be opening a modified version, or your browser
is blocking a `file://` feature — try serving it via a static server
(`python3 -m http.server 8000`) and report the exact browser + error if it
persists.

### "I want an 11th language."

The project is intentionally scoped to the top 10 languages by total speakers
(see [README.md → The 10 Languages](README.md#the-10-languages)). Adding an
11th changes the project's scope. Open a feature request explaining the use
case — it will be considered, but the 10-language boundary is a deliberate
design constraint, not an oversight.

### "Can I use this in my own project?"

Yes — it's MIT licensed. See [LICENSE](LICENSE). Keep the copyright and
permission notice. The engine is reusable via `window.TRANSLATOR.translate(text,
src, tgt)` (see [usage.md](usage.md)).

## Translation help

If you want help translating a specific phrase **using this tool**, start a
Discussion and include:

- The source and target language codes (e.g. `en` → `ru`).
- The exact text.
- What the tool output, and what you expected.

If a word is missing, that's a coverage gap — a feature request with the entry
to add is the fastest fix.

## Reporting effectively

Whatever channel you use, the most helpful reports include:

- The **exact input text**.
- The **source and target language** (by code: `en`, `zh`, `hi`, `es`, `fr`,
  `ar`, `bn`, `pt`, `ru`, `ur`).
- The **exact output** you got.
- What you **expected** instead.
- Your **browser and OS**.
- Whether it reproduces with `node test_engine.js` (paste the line).

## Project maintenance

Uncensored Translator is a small, focused project maintained by contributors.
Response times vary. Bug reports and security disclosures get priority;
feature requests and discussions are handled as capacity allows. Be kind —
see the [Code of Conduct](CODE_OF_CONDUCT.md).
