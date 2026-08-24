// quick test harness — simulates the browser globals
global.window = {};

const fs = require("fs");
const code = ["dict_part1.js", "dict_part2.js", "engine.js"]
  .map(f => fs.readFileSync(f, "utf8")).join("\n;\n");
eval(code);

const TR = global.window.TRANSLATOR;
function t(src, tgt, txt) {
  console.log(`[${src}->${tgt}] "${txt}"  =>  "${TR.translate(txt, src, tgt)}"`);
}

// direct
t("en", "es", "hello");
t("en", "es", "good morning");
t("en", "es", "i love you");
t("en", "es", "how are you");
t("en", "zh", "i love you");
t("en", "fr", "what is your name");
t("en", "ru", "i am hungry");
t("en", "ar", "thank you");
t("en", "hi", "see you later");
// pivot
t("es", "ru", "hola");
t("es", "fr", "te amo");
t("es", "zh", "buenos días");
t("fr", "es", "merci");
t("ru", "es", "привет");
t("zh", "en", "你好");
t("zh", "es", "你好");
// uncensored
t("en", "es", "fuck you");
t("en", "ru", "shit");
t("en", "fr", "shut up");
t("en", "zh", "bullshit");
// passthrough
t("en", "es", "the quick brown fox jumps over the lazy dog");
t("en", "es", "supercalifragilistic");
