// 注入到 AI 网页里：负责输入问题、点击发送、等待并读取回答。
(() => {
  if (window.__aiRoundtableAgent) return;
  window.__aiRoundtableAgent = true;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const visible = (el) => !!el && el.isConnected && el.getClientRects().length > 0;
  const q = (sel) => { if (!sel) return []; try { return [...document.querySelectorAll(sel)]; } catch { return []; } };
  const cls = (el) => (typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '');
  const label = (el) => [el.getAttribute('aria-label'), el.getAttribute('data-testid'), el.getAttribute('title'), el.id, cls(el)].join(' ');

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
      els = q('textarea, [contenteditable="true"], [contenteditable="plaintext-only"]')
        .filter(visible).filter((e) => !e.closest('[aria-hidden="true"]') && !e.readOnly);
    }
    return els[els.length - 1] || null;
  }

  function findSend(cfg) {
    const own = q(cfg.send).filter(visible);
    if (own.length) return own[own.length - 1];
    const cands = q('button, [role="button"]').filter(visible).filter((b) => /send|发送|submit|提交/i.test(label(b)));
    return cands[cands.length - 1] || null;
  }

  const isDisabled = (b) => b.disabled || b.getAttribute('aria-disabled') === 'true' || /(^|[\s_-])disabled/i.test(cls(b));

  function isGenerating(cfg) {
    if (q(cfg.stop).some(visible)) return true;
    if (q(cfg.streaming).length) return true;
    return q('button, [role="button"]').some((b) => visible(b) && /stop|停止|中断/i.test(
      [b.getAttribute('aria-label'), b.getAttribute('data-testid'), b.getAttribute('title')].join(' ')));
  }

  const GENERIC_RESPONSE = '.markdown, .markdown-body, .prose, [class*="markdown"], [class*="Markdown"]';
  function responses(cfg, sel) {
    const all = q(sel || cfg.response || GENERIC_RESPONSE);
    return all.filter((e) => !all.some((o) => o !== e && o.contains(e)));
  }
  // 读取回答文字；链接保留成“文字 (网址)”，方便事实核查附来源
  const textOf = (el) => {
    if (!el) return '';
    const t = (el.innerText || el.textContent || '').trim();
    const seen = new Set(); const refs = [];
    for (const a of el.querySelectorAll('a[href^="http"]')) {
      if (seen.has(a.href)) continue; seen.add(a.href);
      refs.push(`- ${(a.innerText || '').trim().slice(0, 60) || '链接'}: ${a.href}`);
    }
    return refs.length ? `${t}\n\n来源链接：\n${refs.join('\n')}` : t;
  };

  function inputText(el) { return el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' ? el.value : el.innerText; }

  async function setText(el, text) {
    el.focus();
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, text);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    // 富文本输入框：先清空，再模拟输入
    document.execCommand('selectAll', false);
    document.execCommand('delete', false);
    document.execCommand('insertText', false, text);
    await sleep(100);
    const probe = text.slice(0, 30).replace(/\s+/g, '');
    if (!inputText(el).replace(/\s+/g, '').includes(probe)) {
      // 不支持 insertText 的编辑器：退回到模拟粘贴
      const dt = new DataTransfer();
      dt.setData('text/plain', text);
      el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
      await sleep(200);
    }
    if (!inputText(el).replace(/\s+/g, '').includes(probe)) {
      el.textContent = text;
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    }
  }

  function pressEnter(el) {
    for (const type of ['keydown', 'keypress', 'keyup']) {
      el.dispatchEvent(new KeyboardEvent(type, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
    }
  }

  let stopRequested = false;

  let status = () => {};
  async function ask(text, cfg, onProgress) {
    stopRequested = false;
    status('正在找输入框…');
    const input = await waitFor(() => findInput(cfg), 30000);
    if (!input) throw new Error('找不到输入框。请确认这个网站已经登录，且页面能正常聊天。');

    // 同时盯住“配置的回答选择器”和“通用规则”，哪个先出现新回答就用哪个
    const sels = [...new Set([cfg.response, GENERIC_RESPONSE].filter(Boolean))];
    const base = sels.map((sel) => { const r = responses(cfg, sel); return { sel, n: r.length, last: textOf(r[r.length - 1]) }; });

    status('正在输入问题…');
    await setText(input, text);
    await sleep(400);
    status('正在点发送…');
    const send = await waitFor(() => { const b = findSend(cfg); return b && !isDisabled(b) ? b : null; }, 5000);
    if (send) send.click(); else pressEnter(input);
    status(send ? '已点击发送，等待回答出现…' : '没找到发送按钮，已按回车，等待回答出现…');

    const t0 = Date.now();
    const detect = () => {
      for (const b of base) {
        const r = responses(cfg, b.sel);
        if (r.length > b.n) return b.sel;
        if (r.length && r.length === b.n && b.n > 0 && textOf(r[r.length - 1]) !== b.last && b.sel === cfg.response) return b.sel;
      }
      return null;
    };
    let useSel = await waitFor(detect, 20000, 400);
    if (!useSel) {
      const cur = findInput(cfg) || input;
      if (inputText(cur).trim().length > 0) {
        pressEnter(cur); // 再试一次回车
        useSel = await waitFor(detect, 15000, 400);
        if (!useSel) throw new Error('消息好像没有发出去（没找到可用的发送按钮）。');
      } else {
        useSel = await waitFor(detect, 60000, 500);
        if (!useSel) throw new Error('消息已发出，但没读取到回答。可能网站改版了，需要在“网站设置 → 高级”里改“回答”选择器。');
      }
    }

    // 读取流式输出，直到停止变化
    let last = '';
    let stableSince = Date.now();
    for (;;) {
      await sleep(600);
      const r = responses(cfg, useSel);
      const txt = textOf(r[r.length - 1]);
      if (txt !== last) { last = txt; stableSince = Date.now(); onProgress(txt); }
      const gen = isGenerating(cfg);
      if (stopRequested) break;
      if (!gen && last && Date.now() - stableSince > 2500) break;
      if (gen && Date.now() - stableSince > 180000) break; // 3 分钟没动静
      if (Date.now() - t0 > 15 * 60000) break;
    }
    if (!last) throw new Error('回答是空的。');
    return last;
  }

  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== 'ai-roundtable') return;
    port.onMessage.addListener(async (m) => {
      if (m.type === 'ping') return port.postMessage({ type: 'pong', hasInput: !!findInput(m.cfg || {}) });
      if (m.type === 'stop') {
        stopRequested = true;
        const b = q(m.cfg && m.cfg.stop).find(visible); if (b) b.click();
        return;
      }
      if (m.type === 'ask') {
        status = (t) => { try { port.postMessage({ type: 'status', text: t }); } catch {} };
        try {
          const text = await ask(m.text, m.cfg, (t) => { try { port.postMessage({ type: 'progress', text: t }); } catch {} });
          port.postMessage({ type: 'done', text });
        } catch (e) {
          try { port.postMessage({ type: 'error', error: e.message || String(e) }); } catch {}
        }
      }
    });
  });
})();
