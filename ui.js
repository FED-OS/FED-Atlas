// UI logic for the Uncensored Translator

(function () {
  const LANG_META = [
    { code: "en", name: "English",   tag: "english"   },
    { code: "zh", name: "Mandarin",  tag: "mandarin"   },
    { code: "hi", name: "Hindi",     tag: "hindi"      },
    { code: "es", name: "Spanish",   tag: "spanish"    },
    { code: "fr", name: "French",    tag: "french"     },
    { code: "ar", name: "Arabic",    tag: "arabic"     },
    { code: "bn", name: "Bengali",   tag: "bengali"    },
    { code: "pt", name: "Portuguese",tag: "portuguese" },
    { code: "ru", name: "Russian",   tag: "russian"    },
    { code: "ur", name: "Urdu",      tag: "urdu"       },
  ];
  const byCode = {};
  LANG_META.forEach(m => byCode[m.code] = m);

  const $ = id => document.getElementById(id);
  const srcSel = $("srcLang"), tgtSel = $("tgtLang");
  const srcText = $("srcText"), outText = $("outText");
  const swapBtn = $("swapBtn"), txBtn = $("txBtn"), clearBtn = $("clearBtn");
  const autoToggle = $("autoToggle");
  const countEl = $("count"), wire = $("wire"), bars = $("bars");
  const srcTag = $("srcTag"), tgtTag = $("tgtTag");

  const MAX = 2000;

  // populate selectors
  LANG_META.forEach(m => {
    const o1 = new Option(m.name, m.code);
    const o2 = new Option(m.name, m.code);
    srcSel.add(o1); tgtSel.add(o2);
  });
  srcSel.value = "en";
  tgtSel.value = "es";

  function updateTags() {
    srcTag.textContent = byCode[srcSel.value].tag;
    tgtTag.textContent = byCode[tgtSel.value].tag;
  }

  function updateCount() {
    const n = srcText.value.length;
    const b = countEl.querySelector("b");
    b.textContent = n;
    countEl.classList.toggle("warn", n > MAX * 0.8 && n <= MAX);
    countEl.classList.toggle("danger", n >= MAX);
  }

  function flashBars() {
    bars.classList.add("tx");
    setTimeout(() => bars.classList.remove("tx"), 600);
  }

  function transmit() {
    const txt = srcText.value;
    const src = srcSel.value, tgt = tgtSel.value;
    wire.classList.remove("transmitting");
    void wire.offsetWidth; // restart anim
    wire.classList.add("transmitting");
    flashBars();
    const result = window.TRANSLATOR.translate(txt, src, tgt);
    if (result && result.trim()) {
      outText.classList.remove("empty");
      outText.innerHTML = escapeHtml(result) + '<span class="cursor"></span>';
    } else {
      outText.classList.add("empty");
      outText.innerHTML = '<span class="cursor"></span>';
    }
  }

  function escapeHtml(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // debounced auto-translate
  let timer = null;
  function scheduleAuto() {
    if (!autoToggle.checked) return;
    clearTimeout(timer);
    timer = setTimeout(transmit, 420);
  }

  // events
  srcText.addEventListener("input", () => { updateCount(); scheduleAuto(); });
  srcSel.addEventListener("change", () => { updateTags(); scheduleAuto(); });
  tgtSel.addEventListener("change", () => { updateTags(); scheduleAuto(); });
  autoToggle.addEventListener("change", scheduleAuto);
  txBtn.addEventListener("click", transmit);
  clearBtn.addEventListener("click", () => {
    srcText.value = "";
    outText.classList.add("empty");
    outText.innerHTML = '<span class="cursor"></span>';
    updateCount();
    srcText.focus();
  });
  swapBtn.addEventListener("click", () => {
    const a = srcSel.value;
    srcSel.value = tgtSel.value;
    tgtSel.value = a;
    // also move current output into the source box if present
    const cur = outText.classList.contains("empty") ? "" : outText.textContent.replace(/\u200b/g,"").trim();
    if (cur) { srcText.value = cur; }
    updateTags();
    updateCount();
    transmit();
  });

  // ctrl/cmd+enter = transmit
  srcText.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); transmit(); }
  });

  // init
  updateTags();
  updateCount();
  srcText.focus();
})();
