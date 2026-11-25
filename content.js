(() => {
  if (window.__aiRoundtableAgent) return;
  window.__aiRoundtableAgent = true;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const visible = (el) => !!el && el.isConnected && el.getClientRects().length > 0;
  const q = (sel) => {
    if (!sel) return [];
    try {
      return [...document.querySelectorAll(sel)];
    } catch (e) {
      return [];
    }
  };
  const cls = (el) => typeof el.className === "string" ? el.className : el.className && el.className.baseVal || "";
  const label = (el) => [el.getAttribute("aria-label"), el.getAttribute("data-testid"), el.getAttribute("title"), el.id, cls(el)].join(" ");
  async function waitFor(fn, timeout, step = 300) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      const v = fn();
      if (v) return v;
      await sleep(step);
    }
    return null;
  }
  function findInput(cfg) {
    let els = q(cfg.input).filter(visible);
    if (!els.length) {
      els = q('textarea, [contenteditable="true"], [contenteditable="plaintext-only"]').filter(visible).filter((e) => !e.closest('[aria-hidden="true"]') && !e.readOnly);
    }
    els.sort((a, b) => a.getBoundingClientRect().bottom - b.getBoundingClientRect().bottom);
    return els[els.length - 1] || null;
  }
  function findSend(cfg) {
    const own = q(cfg.send).filter(visible);
    if (own.length) return own[own.length - 1];
    const cands = q('button, [role="button"]').filter(visible).filter((b) => /send|发送|submit|提交|送信/i.test(label(b)));
    return cands[cands.length - 1] || null;
  }
  const isDisabled = (b) => b.disabled || b.getAttribute("aria-disabled") === "true" || /(^|[\s_-])disabled/i.test(cls(b));
  function isGenerating(cfg) {
    if (q(cfg.stop).some(visible)) return true;
    if (q(cfg.streaming).length) return true;
    return q('button, [role="button"]').some((b) => visible(b) && /stop|停止|中断|中止|ストップ/i.test(
      [b.getAttribute("aria-label"), b.getAttribute("data-testid"), b.getAttribute("title")].join(" ")
    ));
  }
  const GENERIC_RESPONSE = '.markdown, .markdown-body, .prose, [class*="markdown"], [class*="Markdown"]';
  function responses(cfg, sel) {
    const all = q(sel || cfg.response || GENERIC_RESPONSE);
    return all.filter((e) => !all.some((o) => o !== e && o.contains(e)));
  }
  const textOf = (el) => {
    if (!el) return "";
    const t = (el.innerText || el.textContent || "").trim();
    const seen = /* @__PURE__ */ new Set();
    const refs = [];
    for (const a of el.querySelectorAll('a[href^="http"]')) {
      if (seen.has(a.href)) continue;
      seen.add(a.href);
      refs.push(`- ${(a.innerText || "").trim().slice(0, 60) || "\u94FE\u63A5"}: ${a.href}`);
    }
    return refs.length ? `${t}

\u6765\u6E90\u94FE\u63A5\uFF1A
${refs.join("\n")}` : t;
  };
  function inputText(el) {
    return el.tagName === "TEXTAREA" || el.tagName === "INPUT" ? el.value : el.innerText;
  }
  async function setText(el, text) {
    el.focus();
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(el, text);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
    document.execCommand("selectAll", false);
    document.execCommand("delete", false);
    document.execCommand("insertText", false, text);
    await sleep(100);
    const probe = text.slice(0, 30).replace(/\s+/g, "");
    if (!inputText(el).replace(/\s+/g, "").includes(probe)) {
      const dt = new DataTransfer();
      dt.setData("text/plain", text);
      el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
      await sleep(200);
    }
    if (!inputText(el).replace(/\s+/g, "").includes(probe)) {
      el.textContent = text;
      el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
    }
  }
  function pressEnter(el) {
    for (const type of ["keydown", "keypress", "keyup"]) {
      el.dispatchEvent(new KeyboardEvent(type, { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true }));
    }
  }
  let stopRequested = false;
  let status = () => {
  };
  async function ask(text, cfg, onProgress) {
    stopRequested = false;
    status("\u6B63\u5728\u627E\u8F93\u5165\u6846\u2026");
    const input = await waitFor(() => findInput(cfg), 3e4);
    if (!input) throw new Error("\u627E\u4E0D\u5230\u8F93\u5165\u6846\u3002\u8BF7\u786E\u8BA4\u8FD9\u4E2A\u7F51\u7AD9\u5DF2\u7ECF\u767B\u5F55\uFF0C\u4E14\u9875\u9762\u80FD\u6B63\u5E38\u804A\u5929\u3002");
    const sels = [...new Set([cfg.response, GENERIC_RESPONSE].filter(Boolean))];
    const base = sels.map((sel) => {
      const r = responses(cfg, sel);
      return { sel, n: r.length, last: textOf(r[r.length - 1]) };
    });
    status("\u6B63\u5728\u8F93\u5165\u95EE\u9898\u2026");
    await setText(input, text);
    await sleep(400);
    status("\u6B63\u5728\u70B9\u53D1\u9001\u2026");
    const send = await waitFor(() => {
      const b = findSend(cfg);
      return b && !isDisabled(b) ? b : null;
    }, 5e3);
    if (send) send.click();
    else pressEnter(input);
    status(send ? "\u5DF2\u70B9\u51FB\u53D1\u9001\uFF0C\u7B49\u5F85\u56DE\u7B54\u51FA\u73B0\u2026" : "\u6CA1\u627E\u5230\u53D1\u9001\u6309\u94AE\uFF0C\u5DF2\u6309\u56DE\u8F66\uFF0C\u7B49\u5F85\u56DE\u7B54\u51FA\u73B0\u2026");
    const t0 = Date.now();
    const detect = () => {
      for (const b of base) {
        const r = responses(cfg, b.sel);
        if (r.length > b.n) return b.sel;
        if (r.length && r.length === b.n && b.n > 0 && textOf(r[r.length - 1]) !== b.last && b.sel === cfg.response) return b.sel;
      }
      return null;
    };
    let useSel = await waitFor(detect, 2e4, 400);
    if (!useSel) {
      const cur = findInput(cfg) || input;
      if (inputText(cur).trim().length > 0) {
        pressEnter(cur);
        useSel = await waitFor(detect, 15e3, 400);
        if (!useSel) throw new Error("\u6D88\u606F\u597D\u50CF\u6CA1\u6709\u53D1\u51FA\u53BB\uFF08\u6CA1\u627E\u5230\u53EF\u7528\u7684\u53D1\u9001\u6309\u94AE\uFF09\u3002");
      } else {
        useSel = await waitFor(detect, 6e4, 500);
        if (!useSel) throw new Error("\u6D88\u606F\u5DF2\u53D1\u51FA\uFF0C\u4F46\u6CA1\u8BFB\u53D6\u5230\u56DE\u7B54\u3002\u53EF\u80FD\u7F51\u7AD9\u6539\u7248\u4E86\uFF0C\u9700\u8981\u5728\u201C\u7F51\u7AD9\u8BBE\u7F6E \u2192 \u9AD8\u7EA7\u201D\u91CC\u6539\u201C\u56DE\u7B54\u201D\u9009\u62E9\u5668\u3002");
      }
    }
    let last = "";
    let stableSince = Date.now();
    for (; ; ) {
      await sleep(600);
      const r = responses(cfg, useSel);
      const txt = textOf(r[r.length - 1]);
      if (txt !== last) {
        last = txt;
        stableSince = Date.now();
        onProgress(txt);
      }
      const gen = isGenerating(cfg);
      if (stopRequested) break;
      if (!gen && last && Date.now() - stableSince > 2500) break;
      if (gen && Date.now() - stableSince > 18e4) break;
      if (Date.now() - t0 > 15 * 6e4) break;
    }
    if (!last) throw new Error("\u56DE\u7B54\u662F\u7A7A\u7684\u3002");
    return last;
  }
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== "ai-roundtable") return;
    port.onMessage.addListener(async (m) => {
      if (m.type === "ping") return port.postMessage({ type: "pong", hasInput: !!findInput(m.cfg || {}) });
      if (m.type === "stop") {
        stopRequested = true;
        const b = q(m.cfg && m.cfg.stop).find(visible);
        if (b) b.click();
        return;
      }
      if (m.type === "ask") {
        status = (t) => {
          try {
            port.postMessage({ type: "status", text: t });
          } catch (e) {
          }
        };
        try {
          const text = await ask(m.text, m.cfg, (t) => {
            try {
              port.postMessage({ type: "progress", text: t });
            } catch (e) {
            }
          });
          port.postMessage({ type: "done", text });
        } catch (e) {
          try {
            port.postMessage({ type: "error", error: e.message || String(e) });
          } catch (e2) {
          }
        }
      }
    });
  });
})();
