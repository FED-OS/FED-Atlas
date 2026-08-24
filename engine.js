// =============================================================
//  UNCENSORED TRANSLATOR — ENGINE
//  Pivot-through-English word/phrase substitution.
//  No network. No model. Pure JS dictionary pass-through.
// =============================================================

const LANGS = ["en", "zh", "hi", "es", "fr", "ar", "bn", "pt", "ru", "ur"];

// Raw dictionary arrays (from dict_part1.js + dict_part2.js)
const ALL_DICTS = [].concat(
  DICT_EN_ZH, DICT_EN_HI, DICT_EN_ES, DICT_EN_FR,
  DICT_EN_AR, DICT_EN_BN, DICT_EN_PT, DICT_EN_RU, DICT_EN_UR
);

// Build two-way lookup.
// fwd[xx][enWord] = xxWord   (English -> other language)
// rev[xx][xxWord] = enWord   (other language -> English)
const fwd = {};
const rev = {};
LANGS.forEach(l => { if (l !== "en") { fwd[l] = {}; rev[l] = {}; } });

ALL_DICTS.forEach(entry => {
  const otherLang = LANGS.find(l => l !== "en" && entry[l] !== undefined);
  if (!otherLang) return;
  const en = entry.en.toLowerCase();
  const xx = entry[otherLang];
  if (!fwd[otherLang][en]) fwd[otherLang][en] = xx;
  if (!rev[otherLang][xx]) rev[otherLang][xx] = en;
});

// en->en identity for when source or target is en
// (handled by returning text unchanged in translate())

// Sort keys by word-count desc then length desc so longest phrases match first.
function sortedKeys(obj) {
  return Object.keys(obj).sort((a, b) => {
    const ac = a.split(/\s+/).length, bc = b.split(/\s+/).length;
    if (bc !== ac) return bc - ac;
    return b.length - a.length;
  });
}

// Tokenize: keep words and the whitespace/punctuation between them.
// Returns array of { text, isWord }
function tokenize(text) {
  const tokens = [];
  // regex: word chars include unicode letters, numbers, AND combining marks
  // (\p{M}) so that scripts like Devanagari / Bengali keep their virama +
  // vowel-sign clusters glued to the base letter instead of splitting.
  const wordRe = /[\p{L}\p{N}\p{M}]+(?:[''\-][\p{L}\p{N}\p{M}]+)*/gu;
  let last = 0;
  let match;
  while ((match = wordRe.exec(text)) !== null) {
    if (match.index > last) {
      tokens.push({ text: text.slice(last, match.index), isWord: false });
    }
    tokens.push({ text: match[0], isWord: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    tokens.push({ text: text.slice(last), isWord: false });
  }
  return tokens;
}

// Translate a word-or-phrase using a lookup table (src->tgt single step)
function lookupWord(table, wordLower) {
  if (!table) return null;
  if (Object.prototype.hasOwnProperty.call(table, wordLower)) {
    return table[wordLower];
  }
  return null;
}

// Direct single-step translation using one table (src->tgt where at least one is en).
// tokens are already split; returns output string.
function translateDirect(text, table) {
  if (!table) return text; // identity (en->en)
  const srcKeys = sortedKeys(table);
  const tokens = tokenize(text);
  const out = [];
  let i = 0;
  while (i < tokens.length) {
    const tk = tokens[i];
    if (!tk.isWord) { out.push(tk.text); i++; continue; }
    // longest-phrase match
    let matched = null, matchedLen = 0;
    const phraseWords = [];
    let j = i;
    while (j < tokens.length && phraseWords.length < 6) {
      if (!tokens[j].isWord) { j++; continue; }
      phraseWords.push(tokens[j].text);
      j++;
      const candidate = phraseWords.join(" ").toLowerCase();
      const res = lookupWord(table, candidate);
      if (res !== null) { matched = res; matchedLen = phraseWords.length; }
    }
    if (matched !== null && matchedLen > 0) {
      // consume matchedLen word tokens + any non-word tokens between them
      let consumed = 0, idx = i;
      while (consumed < matchedLen) {
        if (tokens[idx].isWord) consumed++;
        idx++;
      }
      out.push(matched);
      i = idx;
    } else {
      const w = tk.text;
      const res = lookupWord(table, w.toLowerCase());
      out.push(res !== null ? res : w);
      i++;
    }
  }
  return out.join("");
}

// Translate the full text from src to tgt.
function translate(text, src, tgt) {
  if (!text) return "";
  if (src === tgt) return text;

  // Single step when either side is English.
  if (src === "en") return translateDirect(text, fwd[tgt]);
  if (tgt === "en") return translateDirect(text, rev[src]);

  // Two-step pivot: src -> en -> tgt. Both legs use full phrase matching.
  const enIntermediate = translateDirect(text, rev[src]);
  return translateDirect(enIntermediate, fwd[tgt]);
}

// expose
window.TRANSLATOR = { translate, LANGS };
