const LS = {
  get(k, d) {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v != null ? v : d;
    } catch (e) {
      return d;
    }
  },
  set(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  }
};
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s != null ? s : "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const md = (t) => window.marked && window.DOMPurify ? DOMPurify.sanitize(marked.parse(t || "")) : esc(t).replace(/\n/g, "<br>");
const ROLES = [
  { name: "\u63D0\u6848\u8005", prompt: "\u63D0\u51FA\u4F60\u8BA4\u4E3A\u6700\u597D\u7684\u65B9\u6848\uFF0C\u5E76\u7528\u5177\u4F53\u7406\u7531\u4E3A\u5B83\u8FA9\u62A4\u3002" },
  { name: "\u8D28\u7591\u8005", prompt: "\u626E\u6F14\u9B54\u9B3C\u4EE3\u8A00\u4EBA\uFF1A\u4E13\u95E8\u5BFB\u627E\u5176\u4ED6\u65B9\u6848\u7684\u6F0F\u6D1E\u3001\u9690\u542B\u5047\u8BBE\u3001\u98CE\u9669\u548C\u53CD\u4F8B\u3002\u5373\u4F7F\u4F60\u5927\u4F53\u540C\u610F\uFF0C\u4E5F\u8981\u6307\u51FA\u6700\u8584\u5F31\u7684\u73AF\u8282\u3002" },
  { name: "\u52A1\u5B9E\u6D3E", prompt: "\u5173\u6CE8\u53EF\u6267\u884C\u6027\uFF1A\u6210\u672C\u3001\u65F6\u95F4\u3001\u8D44\u6E90\u3001\u843D\u5730\u6B65\u9AA4\uFF0C\u4EE5\u53CA\u6700\u53EF\u80FD\u51FA\u95EE\u9898\u7684\u5730\u65B9\u3002" },
  { name: "\u521B\u65B0\u6D3E", prompt: "\u8DF3\u51FA\u5E38\u89C4\uFF0C\u63D0\u51FA\u522B\u4EBA\u6CA1\u60F3\u5230\u7684\u66FF\u4EE3\u65B9\u6848\u6216\u7B2C\u4E09\u6761\u8DEF\u3002" },
  { name: "\u6570\u636E\u5206\u6790\u5E08", prompt: "\u5C3D\u91CF\u91CF\u5316\uFF1A\u7ED9\u51FA\u4F30\u7B97\u3001\u6982\u7387\u548C\u5BF9\u6BD4\u4F9D\u636E\uFF0C\u6307\u51FA\u54EA\u4E9B\u7ED3\u8BBA\u7F3A\u4E4F\u8BC1\u636E\u3002" },
  { name: "\u7528\u6237\u4EE3\u8A00\u4EBA", prompt: "\u7AD9\u5728\u63D0\u95EE\u8005\u7684\u957F\u671F\u5229\u76CA\u548C\u771F\u5B9E\u5904\u5883\u4E0A\u601D\u8003\uFF0C\u63D0\u9192\u5927\u5BB6\u4E0D\u8981\u5FFD\u7565\u63D0\u95EE\u8005\u7684\u7EA6\u675F\u548C\u611F\u53D7\u3002" },
  { name: "\u98CE\u9669\u5B98", prompt: "\u4E13\u95E8\u8BC4\u4F30\u98CE\u9669\uFF1A\u5217\u51FA\u6BCF\u4E2A\u9009\u9879\u6700\u574F\u4F1A\u53D1\u751F\u4EC0\u4E48\u3001\u5927\u6982\u6709\u591A\u5927\u53EF\u80FD\u3001\u635F\u5931\u591A\u5927\u3001\u80FD\u4E0D\u80FD\u633D\u56DE\uFF0C\u4EE5\u53CA\u600E\u4E48\u63D0\u524D\u9632\u8303\u3002" },
  { name: "\u7B97\u8D26\u7684", prompt: "\u628A\u94B1\u7B97\u6E05\u695A\uFF1A\u5404\u9009\u9879\u7684\u6210\u672C\u3001\u6536\u5165\u3001\u73B0\u91D1\u6D41\u3001\u65F6\u95F4\u6295\u5165\u548C\u673A\u4F1A\u6210\u672C\uFF0C\u5C3D\u91CF\u7ED9\u51FA\u5177\u4F53\u6570\u5B57\u6216\u533A\u95F4\uFF0C\u5E76\u8BF4\u660E\u4F30\u7B97\u4F9D\u636E\u3002" },
  { name: "\u6CD5\u89C4\u987E\u95EE", prompt: "\u5173\u6CE8\u7B7E\u8BC1\u3001\u5728\u7559\u8D44\u683C\u3001\u7A0E\u52A1\u3001\u52B3\u52A8\u3001\u516C\u53F8\u767B\u8BB0\u7B49\u89C4\u5B9A\u548C\u5408\u89C4\u98CE\u9669\u3002\u8BF4\u660E\u4F9D\u636E\u662F\u54EA\u6761\u89C4\u5B9A\uFF1B\u4E0D\u786E\u5B9A\u6216\u53EF\u80FD\u5DF2\u66F4\u65B0\u7684\u89C4\u5B9A\u8981\u660E\u786E\u6807\u51FA\u6765\uFF0C\u63D0\u9192\u53BB\u54EA\u91CC\u6838\u5B9E\u3002" },
  { name: "\u81EA\u7531\u53D1\u8A00", prompt: "\u4E0D\u8BBE\u56FA\u5B9A\u7ACB\u573A\uFF0C\u72EC\u7ACB\u601D\u8003\uFF0C\u5B9E\u4E8B\u6C42\u662F\u3002" }
];
const TEMPLATES = [
  {
    name: "\u7B7E\u8BC1 / \u6C38\u9A7B / \u5728\u7559",
    roles: ["\u63D0\u6848\u8005", "\u6CD5\u89C4\u987E\u95EE", "\u98CE\u9669\u5B98"],
    fact: true,
    q: "\u3010\u6211\u7684\u60C5\u51B5\u3011\uFF08\u56FD\u7C4D\u3001\u73B0\u5728\u7684\u7B7E\u8BC1/\u5728\u7559\u8D44\u683C\u3001\u5728\u5F53\u5730\u4F4F\u4E86\u591A\u4E45\u3001\u5DE5\u4F5C\u548C\u6536\u5165\u3001\u5BB6\u5EAD\uFF09\n\n\u3010\u6211\u5728\u8003\u8651\u3011\uFF08\u6BD4\u5982\uFF1A\u8981\u4E0D\u8981\u7533\u8BF7\u6C38\u9A7B / \u6362\u7B7E\u8BC1\u7C7B\u578B / \u4EC0\u4E48\u65F6\u5019\u7533\u8BF7\uFF09\n\n\u3010\u65F6\u95F4\u548C\u9650\u5236\u3011\n\n\u3010\u6211\u6700\u62C5\u5FC3\u7684\u3011"
  },
  {
    name: "\u521B\u4E1A / \u5F00\u516C\u53F8 / \u526F\u4E1A",
    roles: ["\u63D0\u6848\u8005", "\u8D28\u7591\u8005", "\u7B97\u8D26\u7684", "\u6CD5\u89C4\u987E\u95EE"],
    fact: true,
    q: "\u3010\u6211\u7684\u60C5\u51B5\u3011\uFF08\u73B0\u5728\u7684\u5DE5\u4F5C\u3001\u5B58\u6B3E\u3001\u7B7E\u8BC1\u8EAB\u4EFD\u3001\u53EF\u6295\u5165\u7684\u65F6\u95F4\uFF09\n\n\u3010\u60F3\u505A\u7684\u4E8B\u3011\uFF08\u505A\u4EC0\u4E48\u3001\u8DDF\u8C01\u5408\u4F5C\u3001\u5DF2\u7ECF\u6709\u4EC0\u4E48\u8D44\u6E90\uFF0C\u6BD4\u5982\u73B0\u6210\u7684\u7F51\u5E97\u3001\u5BA2\u6237\uFF09\n\n\u3010\u8981\u51B3\u5B9A\u7684\u95EE\u9898\u3011\n\n\u3010\u6211\u6700\u62C5\u5FC3\u7684\u3011"
  },
  {
    name: "\u4E70\u623F / \u79DF\u623F / \u642C\u5BB6",
    roles: ["\u63D0\u6848\u8005", "\u7B97\u8D26\u7684", "\u98CE\u9669\u5B98"],
    fact: false,
    q: "\u3010\u6211\u7684\u60C5\u51B5\u3011\uFF08\u5BB6\u5EAD\u3001\u6536\u5165\u3001\u5B58\u6B3E\u3001\u5DE5\u4F5C\u7A33\u5B9A\u6027\u3001\u6253\u7B97\u5728\u8FD9\u91CC\u4F4F\u591A\u4E45\uFF09\n\n\u3010\u5728\u6BD4\u8F83\u7684\u9009\u9879\u3011\uFF08\u5730\u6BB5\u3001\u4EF7\u683C\u3001\u8D37\u6B3E/\u623F\u79DF\uFF09\n\n\u3010\u6211\u6700\u770B\u91CD\u7684\u3011\n\n\u3010\u6211\u6700\u62C5\u5FC3\u7684\u3011"
  },
  {
    name: "\u6362\u5DE5\u4F5C / \u8F9E\u804C",
    roles: ["\u63D0\u6848\u8005", "\u8D28\u7591\u8005", "\u7B97\u8D26\u7684", "\u7528\u6237\u4EE3\u8A00\u4EBA"],
    fact: false,
    q: "\u3010\u73B0\u5728\u7684\u5DE5\u4F5C\u3011\uFF08\u6536\u5165\u3001\u4F18\u7F3A\u70B9\u3001\u7B7E\u8BC1\u662F\u5426\u548C\u5DE5\u4F5C\u7ED1\u5B9A\uFF09\n\n\u3010\u5728\u8003\u8651\u7684\u9009\u62E9\u3011\n\n\u3010\u6211\u60F3\u8981\u7684\u3011\uFF08\u94B1\u3001\u6210\u957F\u3001\u65F6\u95F4\u3001\u7A33\u5B9A\u2026\u2026\uFF09\n\n\u3010\u6211\u6700\u62C5\u5FC3\u7684\u3011"
  },
  {
    name: "\u5927\u989D\u8D2D\u4E70 / \u6295\u5165",
    roles: ["\u63D0\u6848\u8005", "\u8D28\u7591\u8005", "\u7B97\u8D26\u7684"],
    fact: false,
    q: "\u3010\u8981\u4E70/\u6295\u5165\u7684\u662F\u3011\n\n\u3010\u9884\u7B97\u548C\u8D44\u91D1\u6765\u6E90\u3011\n\n\u3010\u5728\u6BD4\u8F83\u7684\u9009\u9879\u3011\n\n\u3010\u7528\u9014\u548C\u671F\u5F85\u3011"
  }
];
const COLORS = ["#c2602f", "#3b6fb6", "#7a4fb0", "#2f8a6f", "#b8862b", "#b0456b", "#4a8a2f", "#5a6470"];
let siteOverrides = LS.get("siteOverrides", {});
let customSites = LS.get("customSites", {});
function allSites() {
  const out = {};
  for (const [k, v] of Object.entries(DEFAULT_SITES)) out[k] = { ...v, ...siteOverrides[k] || {} };
  for (const [k, v] of Object.entries(customSites)) out[k] = { ...v, custom: true };
  return out;
}
const getSite = (key) => allSites()[key];
const sourceLabel = (src) => {
  var _a;
  return src === "manual" ? "\u624B\u52A8\u590D\u5236\u7C98\u8D34" : (((_a = getSite(src)) == null ? void 0 : _a.name) || src) + " \u7F51\u9875\u7248";
};
function sourceOptions(sel, withNone) {
  const sites = allSites();
  return (withNone ? `<option value="none" ${sel === "none" ? "selected" : ""}>\u4E0D\u8981\u88C1\u5224</option>` : "") + Object.entries(sites).map(([k, v]) => `<option value="${k}" ${k === sel ? "selected" : ""}>${esc(v.name)} \u7F51\u9875\u7248</option>`).join("") + `<option value="manual" ${sel === "manual" ? "selected" : ""}>\u624B\u52A8\u590D\u5236\u7C98\u8D34\uFF08\u4EFB\u4F55 AI \u90FD\u884C\uFF09</option>`;
}
let sessions = LS.get("sessions", []);
for (const s of sessions) for (const m of s.messages) {
  if (m.streaming || m.manual) {
    m.streaming = false;
    m.manual = null;
    m.error = true;
    m.content = (m.content || "") + "\n\uFF08\u4E2D\u65AD\uFF1A\u9875\u9762\u88AB\u5173\u95ED\uFF09";
  }
}
let currentId = null;
let running = null;
const saveSessions = () => {
  try {
    LS.set("sessions", sessions);
  } catch (e) {
    alert("\u6D4F\u89C8\u5668\u5B58\u50A8\u7A7A\u95F4\u6EE1\u4E86\uFF0C\u8BF7\u5220\u9664\u4E00\u4E9B\u5386\u53F2\u8BB0\u5F55\u3002");
  }
  scheduleDiskSave();
};
const current = () => sessions.find((s) => s.id === currentId);
function renderHistory() {
  const list = [...sessions].sort((a, b) => b.createdAt - a.createdAt);
  $("#history").innerHTML = list.length ? list.map((s) => `<div class="item ${s.id === currentId ? "active" : ""}" data-id="${s.id}">
        <span>\u{1FA91}</span><span class="t">${esc(s.title)}</span><button class="x" data-del="${s.id}" title="\u5220\u9664">\u2715</button></div>`).join("") : '<div class="muted" style="padding:8px 10px">\u8FD8\u6CA1\u6709\u8BB0\u5F55</div>';
}
$("#history").addEventListener("click", (e) => {
  const del = e.target.closest("[data-del]");
  if (del) {
    e.stopPropagation();
    if (running && running.sessionId === del.dataset.del) return alert("\u8FD9\u4E2A\u8BA8\u8BBA\u8FD8\u5728\u8FDB\u884C\uFF0C\u5148\u505C\u6B62\u5B83\u3002");
    if (!confirm("\u5220\u9664\u8FD9\u6761\u8BB0\u5F55\uFF1F")) return;
    sessions = sessions.filter((s) => s.id !== del.dataset.del);
    saveSessions();
    if (currentId === del.dataset.del) {
      currentId = null;
      renderNewDebate();
    }
    return renderHistory();
  }
  const item = e.target.closest("[data-id]");
  if (item) {
    currentId = item.dataset.id;
    renderHistory();
    renderSession();
  }
});
$("#btnNewDebate").onclick = () => {
  currentId = null;
  renderHistory();
  renderNewDebate();
};
$("#btnSettings").onclick = () => {
  currentId = null;
  renderHistory();
  renderSettings();
};
function renderSettings() {
  const sites = allSites();
  setTimeout(() => {
    const el = $("#profile");
    if (el) el.oninput = () => {
      LS.set("profile", el.value);
      $("#profileOut").textContent = "\u5DF2\u4FDD\u5B58 \u2713";
      scheduleDiskSave();
    };
  });
  $("#view").innerHTML = `
    <h2>\u7F51\u7AD9\u8BBE\u7F6E</h2>
    <div class="card" id="updCard">${updateCardHtml()}</div>
    <div class="card" id="diskCard">${diskCardHtml()}</div>
    <div class="card">
      <b>\u{1F4CB} \u6211\u7684\u80CC\u666F\u6863\u6848</b> <span class="muted">\uFF08\u5199\u4E00\u6B21\uFF0C\u6BCF\u6B21\u8BA8\u8BBA\u81EA\u52A8\u544A\u8BC9\u6240\u6709 AI\uFF0C\u4E0D\u7528\u53CD\u590D\u89E3\u91CA\uFF09</span>
      <textarea id="profile" rows="6" style="margin-top:8px" placeholder="\u4F8B\u5982\uFF1A\u4F4F\u5728\u65E5\u672C\uFF0C\u4ECA\u5E742\u6708\u5DF2\u7533\u8BF7\u6C38\u9A7B\uFF08\u5BA1\u67E5\u4E2D\uFF09\uFF1B\u73B0\u5728\u7684\u5DE5\u4F5C\u662F\u2026\u2026\uFF1B\u5BB6\u5EAD\u60C5\u51B5\u2026\u2026\uFF1B\u670B\u53CB\u5F00\u516C\u53F8\uFF0C\u5DF2\u7ECF\u6709\u7F51\u5E97\u53EF\u4EE5\u4EA4\u7ED9\u6211\u7BA1\u7406\u2026\u2026">${esc(LS.get("profile", ""))}</textarea>
      <div class="muted" id="profileOut">\u81EA\u52A8\u4FDD\u5B58</div>
    </div>
    <div class="card">
      <p style="margin-top:0"><b>\u7B2C\u4E00\u6B65\uFF1A</b>\u5728\u8FD9\u4E2A\u6D4F\u89C8\u5668\u91CC\u767B\u5F55\u4F60\u60F3\u7528\u7684 AI \u7F51\u7AD9\uFF08\u70B9\u4E0B\u9762\u7684\u201C\u6253\u5F00\u201D\u53BB\u767B\u5F55\uFF0C\u767B\u5F55\u4E00\u6B21\u5C31\u884C\uFF09\u3002\u8BA8\u8BBA\u65F6\u63D2\u4EF6\u4F1A\u5728\u65C1\u8FB9\u7684\u7A97\u53E3\u91CC\u81EA\u52A8\u6253\u5F00\u5B83\u4EEC\u3001\u8F93\u5165\u3001\u8BFB\u53D6\u56DE\u7B54\u3002</p>
      <p class="muted" style="margin-bottom:0">\u63D0\u793A\uFF1A\u8BA8\u8BBA\u8FDB\u884C\u65F6\uFF0C\u8BF7\u8BA9 AI \u7A97\u53E3\u4FDD\u6301\u6253\u5F00\u3001\u4E0D\u8981\u6700\u5C0F\u5316\u3002
      \u7F51\u7AD9\u6539\u7248\u53EF\u80FD\u5BFC\u81F4\u81EA\u52A8\u64CD\u4F5C\u5931\u7075\uFF0C\u8FD9\u65F6\u90A3\u4E00\u6B65\u4F1A\u81EA\u52A8\u5207\u6362\u6210\u201C\u590D\u5236\u7C98\u8D34\u201D\uFF0C\u8BA8\u8BBA\u4E0D\u4F1A\u4E2D\u65AD\u3002
      \u81EA\u52A8\u64CD\u4F5C\u7F51\u9875\u53EF\u80FD\u4E0D\u7B26\u5408\u90E8\u5206\u7F51\u7AD9\u7684\u4F7F\u7528\u6761\u6B3E\uFF0C\u8BF7\u9002\u5EA6\u4F7F\u7528\uFF0C\u4F8B\u5982\u4E0D\u8981\u77ED\u65F6\u95F4\u5185\u8DD1\u5927\u91CF\u8BA8\u8BBA\u3002</p>
    </div>
    <div class="sites">${Object.entries(sites).map(([k, v]) => `
      <div class="site" data-site="${k}">
        <div class="row"><b>${esc(v.name)}</b><div class="fit"><button class="small" data-open="${k}">\u6253\u5F00</button>
          ${v.custom ? `<button class="small danger" data-delsite="${k}">\u5220\u9664</button>` : ""}</div></div>
        <div class="muted" style="overflow-wrap:anywhere">${esc(v.url)}</div>
        <details style="margin-top:6px"><summary class="muted">\u9AD8\u7EA7\uFF1A\u9875\u9762\u5143\u7D20\u9009\u62E9\u5668</summary>
          <textarea rows="8" data-sel="${k}">${esc(JSON.stringify({ url: v.url, input: v.input, send: v.send, response: v.response, stop: v.stop, streaming: v.streaming || "" }, null, 1))}</textarea>
          <div class="row" style="margin-top:6px"><button class="small fit" data-savesel="${k}">\u4FDD\u5B58</button>
          ${!v.custom && siteOverrides[k] ? `<button class="small fit" data-resetsel="${k}">\u6062\u590D\u9ED8\u8BA4</button>` : ""}<span class="muted" data-selout="${k}"></span></div>
        </details>
      </div>`).join("")}
    </div>
    <div class="card" style="margin-top:14px">
      <b>\u6DFB\u52A0\u5176\u4ED6 AI \u7F51\u7AD9</b>
      <div class="row">
        <div><label>\u540D\u79F0</label><input id="csName" placeholder="\u4F8B\u5982\uFF1A\u667A\u8C31\u6E05\u8A00"></div>
        <div style="flex:2"><label>\u65B0\u5BF9\u8BDD\u7684\u7F51\u5740</label><input id="csUrl" placeholder="https://..."></div>
        <button class="fit" id="csAdd">\u6DFB\u52A0</button>
      </div>
      <div class="muted" style="margin-top:6px">\u6DFB\u52A0\u540E\u63D2\u4EF6\u4F1A\u7528\u901A\u7528\u89C4\u5219\u53BB\u627E\u8F93\u5165\u6846\u548C\u53D1\u9001\u6309\u94AE\u3002\u8BFB\u53D6\u56DE\u7B54\u901A\u5E38\u9700\u8981\u5728\u201C\u9AD8\u7EA7\u201D\u91CC\u586B\u4E0A\u201C\u56DE\u7B54\u201D\u7684 CSS \u9009\u62E9\u5668\uFF1B\u4E0D\u4F1A\u586B\u4E5F\u6CA1\u5173\u7CFB\uFF0C\u5931\u7075\u65F6\u4F1A\u81EA\u52A8\u5207\u6362\u6210\u590D\u5236\u7C98\u8D34\u3002</div>
    </div>`;
}
document.addEventListener("click", async (e) => {
  const t = e.target.closest("[data-open],[data-delsite],[data-savesel],[data-resetsel],#csAdd,[data-goto-settings]");
  if (!t) return;
  if (t.matches("[data-goto-settings]")) {
    currentId = null;
    renderHistory();
    return renderSettings();
  }
  if (t.dataset.open) return chrome.tabs.create({ url: getSite(t.dataset.open).url });
  if (t.dataset.delsite) {
    if (!confirm("\u5220\u9664\u8FD9\u4E2A\u7F51\u7AD9\uFF1F")) return;
    delete customSites[t.dataset.delsite];
    LS.set("customSites", customSites);
    return renderSettings();
  }
  if (t.dataset.resetsel) {
    delete siteOverrides[t.dataset.resetsel];
    LS.set("siteOverrides", siteOverrides);
    return renderSettings();
  }
  if (t.dataset.savesel) {
    const k = t.dataset.savesel;
    const out = document.querySelector(`[data-selout="${k}"]`);
    let v;
    try {
      v = JSON.parse(document.querySelector(`[data-sel="${k}"]`).value);
    } catch (e2) {
      out.textContent = "\u683C\u5F0F\u4E0D\u5BF9\uFF08\u9700\u8981\u662F JSON\uFF09";
      return;
    }
    if (customSites[k]) {
      customSites[k] = { ...customSites[k], ...v };
      LS.set("customSites", customSites);
    } else {
      siteOverrides[k] = v;
      LS.set("siteOverrides", siteOverrides);
    }
    out.textContent = "\u5DF2\u4FDD\u5B58";
    return;
  }
  if (t.id === "csAdd") {
    const name = $("#csName").value.trim();
    const url = $("#csUrl").value.trim();
    let origin;
    try {
      origin = new URL(url).origin;
    } catch (e2) {
      return alert("\u7F51\u5740\u4E0D\u5BF9");
    }
    if (!name) return alert("\u586B\u4E00\u4E2A\u540D\u79F0");
    const ok = await chrome.permissions.request({ origins: [origin + "/*"] });
    if (!ok) return alert("\u9700\u8981\u5141\u8BB8\u63D2\u4EF6\u8BBF\u95EE\u8FD9\u4E2A\u7F51\u7AD9\u624D\u80FD\u81EA\u52A8\u64CD\u4F5C\u5B83\u3002");
    customSites["c_" + uid()] = { name, url, input: "", send: "", response: "", stop: "" };
    LS.set("customSites", customSites);
    renderSettings();
  }
});
const webTabs = {};
let aiWindowId = null;
async function tabAlive(id) {
  try {
    await chrome.tabs.get(id);
    return true;
  } catch (e) {
    return false;
  }
}
async function waitComplete(tabId, timeout = 45e3) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    try {
      const t = await chrome.tabs.get(tabId);
      if (t.status === "complete") return;
    } catch (e) {
      throw new Error("\u7F51\u9875\u88AB\u5173\u95ED\u4E86");
    }
    await sleep(400);
  }
}
var chatUrls = LS.get("chatUrls", {});
async function ensureTab(key, site, fresh) {
  const resumeUrl = !fresh && chatUrls[key];
  let st = webTabs[key];
  if (st && !await tabAlive(st.tabId)) {
    delete webTabs[key];
    st = null;
  }
  if (st && fresh) {
    await chrome.tabs.update(st.tabId, { url: site.url });
    st.isNew = true;
    st.hasContext = false;
  }
  if (!st) {
    let winOk = false;
    if (aiWindowId != null) {
      try {
        await chrome.windows.get(aiWindowId);
        winOk = true;
      } catch (e) {
      }
    }
    let tab;
    if (winOk) {
      tab = await chrome.tabs.create({ windowId: aiWindowId, url: resumeUrl || site.url, active: true });
    } else {
      const W = screen.availWidth, H = screen.availHeight, L = screen.availLeft || 0, T = screen.availTop || 0;
      const half = Math.floor(W / 2);
      let win;
      try {
        win = await chrome.windows.create({ url: resumeUrl || site.url, left: L + half, top: T, width: W - half, height: H, focused: false });
      } catch (e) {
        win = await chrome.windows.create({ url: resumeUrl || site.url, focused: false });
      }
      aiWindowId = win.id;
      tab = win.tabs[0];
      try {
        const me = await chrome.windows.getCurrent();
        await chrome.windows.update(me.id, { state: "normal", left: L, top: T, width: half, height: H });
      } catch (e) {
      }
    }
    st = webTabs[key] = { tabId: tab.id, isNew: true, tryResume: !!resumeUrl };
  } else if (!fresh) st.hasContext = true;
  await sleep(300);
  await waitComplete(st.tabId);
  if (st.tryResume) {
    st.tryResume = false;
    await sleep(1500);
    try {
      const t = await chrome.tabs.get(st.tabId);
      st.hasContext = !!t.url && sameChat(t.url, resumeUrl);
    } catch (e) {
      st.hasContext = false;
    }
  }
  return st;
}
function sameChat(a, b) {
  try {
    const x = new URL(a), y = new URL(b);
    return x.host === y.host && x.pathname.replace(/\/$/, "") === y.pathname.replace(/\/$/, "");
  } catch (e) {
    return false;
  }
}
async function rememberChat(key, tabId, site) {
  try {
    const t = await chrome.tabs.get(tabId);
    if (t.url && !sameChat(t.url, site.url)) {
      chatUrls[key] = t.url;
      LS.set("chatUrls", chatUrls);
    }
  } catch (e) {
  }
}
async function askWeb(siteKey, key, text, onProgress, fresh, onStatus = () => {
}) {
  const site = getSite(siteKey);
  if (!site) throw new Error("\u627E\u4E0D\u5230\u8FD9\u4E2A\u7F51\u7AD9\u7684\u914D\u7F6E");
  onStatus(`\u6B63\u5728\u6253\u5F00 ${site.name} \u7F51\u9875\uFF0C\u7B49\u5B83\u52A0\u8F7D\u5B8C\u2026`);
  const st = await ensureTab(key, site, fresh);
  if (typeof text === "function") text = text(!!st.hasContext);
  onStatus(st.hasContext ? "\u56DE\u5230\u539F\u6765\u7684\u5BF9\u8BDD\uFF0C\u6B63\u5728\u8FDE\u63A5\u2026" : "\u7F51\u9875\u5DF2\u52A0\u8F7D\uFF0C\u6B63\u5728\u8FDE\u63A5\u2026");
  try {
    await chrome.tabs.update(st.tabId, { active: true });
  } catch (e) {
  }
  try {
    await chrome.scripting.executeScript({ target: { tabId: st.tabId }, files: ["content.js"] });
  } catch (e) {
    throw new Error("\u65E0\u6CD5\u63A7\u5236\u8FD9\u4E2A\u7F51\u9875\uFF1A" + e.message + "\uFF08\u5982\u679C\u662F\u81EA\u5B9A\u4E49\u7F51\u7AD9\uFF0C\u8BF7\u786E\u8BA4\u5DF2\u5141\u8BB8\u8BBF\u95EE\u6743\u9650\uFF09");
  }
  const port = chrome.tabs.connect(st.tabId, { name: "ai-roundtable" });
  let partial = "";
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, v) => {
      if (settled) return;
      settled = true;
      running == null ? void 0 : running.stoppers.delete(stopper);
      try {
        port.disconnect();
      } catch (e) {
      }
      fn(v);
    };
    const stopper = () => {
      try {
        port.postMessage({ type: "stop", cfg: site });
      } catch (e) {
      }
      finish(resolve, partial + "\n\n\uFF08\u5DF2\u505C\u6B62\uFF09");
    };
    running == null ? void 0 : running.stoppers.add(stopper);
    port.onMessage.addListener((m) => {
      if (m.type === "progress") {
        partial = m.text;
        onProgress(m.text);
      } else if (m.type === "status") onStatus(m.text);
      else if (m.type === "done") {
        rememberChat(key, st.tabId, site);
        finish(resolve, m.text);
      } else if (m.type === "error") finish(reject, new Error(m.error));
    });
    port.onDisconnect.addListener(() => finish(reject, new Error("\u7F51\u9875\u88AB\u5173\u95ED\u3001\u5237\u65B0\u6216\u8DF3\u8F6C\u4E86")));
    port.postMessage({ type: "ask", text, cfg: site });
  });
}
const manualWaiters = {};
function askManual(s, idx, prompt, fullPrompt, note) {
  const msg = s.messages[idx];
  msg.manual = { prompt, full: fullPrompt !== prompt ? fullPrompt : "", note: note || "" };
  updateMsgDom(s.id, idx);
  return new Promise((resolve) => {
    const key = s.id + ":" + idx;
    manualWaiters[key] = (v) => {
      delete manualWaiters[key];
      running == null ? void 0 : running.stoppers.delete(stopper);
      resolve(v);
    };
    const stopper = () => manualWaiters[key] && manualWaiters[key](null);
    running == null ? void 0 : running.stoppers.add(stopper);
  });
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-copy],[data-submit],[data-skip]");
  if (!b) return;
  const s = current();
  if (!s) return;
  const idx = Number(b.dataset.idx);
  const msg = s.messages[idx];
  if (!msg || !msg.manual) return;
  if (b.dataset.copy) {
    await navigator.clipboard.writeText(b.dataset.copy === "full" ? msg.manual.full : msg.manual.prompt);
    const old = b.textContent;
    b.textContent = "\u5DF2\u590D\u5236 \u2713";
    setTimeout(() => b.textContent = old, 1500);
    return;
  }
  const fn = manualWaiters[s.id + ":" + idx];
  if (b.dataset.submit) {
    const v = document.getElementById("paste-" + idx).value.trim();
    if (!v) return alert("\u5148\u628A AI \u7684\u56DE\u7B54\u7C98\u8D34\u8FDB\u6765");
    fn && fn(v);
  } else fn && fn(null);
});
function scheduleUpdate(sid, idx) {
  var _a;
  const key = sid + ":" + idx;
  (_a = scheduleUpdate.p) != null ? _a : scheduleUpdate.p = /* @__PURE__ */ new Set();
  if (scheduleUpdate.p.has(key)) return;
  scheduleUpdate.p.add(key);
  setTimeout(() => {
    scheduleUpdate.p.delete(key);
    updateMsgDom(sid, idx);
  }, 150);
}
function msgHtml(m, i) {
  if (m.kind === "round") return `<div class="round" id="m-${i}">\u2014\u2014 ${esc(m.content)} \u2014\u2014</div>`;
  const cls = m.kind === "user" ? "user" : m.kind === "judge" ? "judge" : m.kind === "factcheck" ? "fact" : "";
  const who = m.kind === "user" ? "\u{1F64B} \u4F60" : m.kind === "judge" ? "\u2696\uFE0F \u88C1\u5224\u603B\u7ED3" : m.kind === "factcheck" ? "\u{1F50E} \u4E8B\u5B9E\u6838\u67E5" : esc(m.name);
  const meta = [m.roleName, m.modelLabel].filter(Boolean).map(esc).join(" \xB7 ");
  let body;
  if (m.manual) {
    body = `<div class="manual">
      ${m.manual.note ? `<div class="warn">${esc(m.manual.note)}</div>` : ""}
      <div class="muted">\u8BF7\u590D\u5236\u4E0B\u9762\u7684\u5185\u5BB9\uFF0C\u53D1\u7ED9\u4F60\u9009\u7684 AI\uFF0C\u518D\u628A\u5B83\u7684\u56DE\u7B54\u7C98\u8D34\u56DE\u6765\uFF1A</div>
      <pre>${esc(m.manual.prompt)}</pre>
      <div class="row"><div class="fit"><button class="primary small" data-copy="prompt" data-idx="${i}">\u590D\u5236</button>
        ${m.manual.full ? `<button class="small" data-copy="full" data-idx="${i}" title="\u5982\u679C\u4F60\u5728 AI \u7F51\u7AD9\u65B0\u5F00\u4E86\u5BF9\u8BDD\uFF0C\u7528\u8FD9\u4E2A\u5B8C\u6574\u7248">\u590D\u5236\u5B8C\u6574\u7248\uFF08\u65B0\u5F00\u5BF9\u8BDD\u7528\uFF09</button>` : ""}</div></div>
      <textarea id="paste-${i}" rows="5" placeholder="\u628A AI \u7684\u56DE\u7B54\u7C98\u8D34\u5230\u8FD9\u91CC"></textarea>
      <div class="row"><div class="fit"><button class="primary small" data-submit="1" data-idx="${i}">\u63D0\u4EA4\u56DE\u7B54</button>
        <button class="small" data-skip="1" data-idx="${i}">\u8DF3\u8FC7\u8FD9\u4E00\u4F4D</button></div></div></div>`;
  } else {
    body = `<div class="body ${m.streaming ? "cursor" : ""}">${m.kind === "user" ? esc(m.content).replace(/\n/g, "<br>") : md(m.content || (m.streaming ? m.status || "\u51C6\u5907\u4E2D\u2026" : ""))}</div>`;
  }
  return `<div class="msg ${cls} ${m.error ? "error" : ""}" id="m-${i}" style="${m.color ? "--c:" + m.color : ""}">
    <div class="who">${who}<span class="meta">${meta}</span></div>${body}${questionsHtml(m, i)}</div>`;
}
function questionsHtml(m, i) {
  if (!m.questions || !m.questions.length) return "";
  return m.questions.map((q, qi) => `<div class="qcard">
    <div>\u2753 <b>${esc(m.name)} \u95EE\u4F60\uFF1A</b>${esc(q.q)}</div>
    ${q.answer != null ? `<div class="muted">\u4F60\u7684\u56DE\u7B54\uFF1A${esc(q.answer)}</div>` : `
    <div class="row" style="margin-top:6px">
      <div class="fit"><button class="small primary" data-qa="yes" data-idx="${i}" data-qi="${qi}">\u662F</button>
      <button class="small primary" data-qa="no" data-idx="${i}" data-qi="${qi}">\u5426</button>
      <button class="small" data-qa="skip" data-idx="${i}" data-qi="${qi}">\u4E0D\u56DE\u7B54</button></div>
      <input id="qa-${i}-${qi}" placeholder="\u6216\u8005\u5199\u6587\u5B57\u8BF4\u660E\uFF0C\u56DE\u8F66\u63D0\u4EA4" data-qtext="1" data-idx="${i}" data-qi="${qi}">
    </div>`}</div>`).join("");
}
function answerQuestion(s, i, qi, answer) {
  const m = s.messages[i];
  const q = m && m.questions && m.questions[qi];
  if (!q || q.answer != null) return;
  q.answer = answer;
  updateMsgDom(s.id, i);
  if (answer !== "\uFF08\u4E0D\u56DE\u7B54\uFF09") pushMsg(s, { kind: "user", uid: uid(), content: `\u56DE\u7B54 ${m.name} \u7684\u63D0\u95EE\u300C${q.q}\u300D\uFF1A${answer}` });
  saveSessions();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-qa]");
  if (!b) return;
  const s = current();
  if (!s) return;
  const i = Number(b.dataset.idx), qi = Number(b.dataset.qi);
  const txt = (document.getElementById(`qa-${i}-${qi}`) || {}).value;
  const base = { yes: "\u662F", no: "\u5426", skip: "\uFF08\u4E0D\u56DE\u7B54\uFF09" }[b.dataset.qa];
  answerQuestion(s, i, qi, txt && txt.trim() && b.dataset.qa !== "skip" ? `${base}\u3002${txt.trim()}` : base);
});
document.addEventListener("keydown", (e) => {
  const el = e.target.closest && e.target.closest("[data-qtext]");
  if (!el || e.key !== "Enter" || e.isComposing || !el.value.trim()) return;
  const s = current();
  if (s) answerQuestion(s, Number(el.dataset.idx), Number(el.dataset.qi), el.value.trim());
});
function extractQuestions(text) {
  const out = [];
  const re = /【问提问者】[:：\s]*([^\n]+)/g;
  let m;
  while ((m = re.exec(text || "")) && out.length < 3) out.push({ q: m[1].trim(), answer: null });
  return out;
}
function appendMsgDom(s, idx) {
  if (currentId !== s.id) return;
  const box = $("#msgs");
  if (!box) return;
  box.insertAdjacentHTML("beforeend", msgHtml(s.messages[idx], idx));
  autoScroll(true);
}
function updateMsgDom(sid, idx) {
  if (currentId !== sid) return;
  const el = document.getElementById("m-" + idx);
  const s = current();
  if (!el || !s) return;
  const pasting = document.getElementById("paste-" + idx);
  const keep = pasting ? pasting.value : null;
  el.outerHTML = msgHtml(s.messages[idx], idx);
  if (keep && document.getElementById("paste-" + idx)) document.getElementById("paste-" + idx).value = keep;
  autoScroll();
}
function autoScroll(force) {
  const main = $(".main");
  if (force || main.scrollHeight - main.scrollTop - main.clientHeight < 300) main.scrollTop = main.scrollHeight;
}
function pushMsg(s, m) {
  s.messages.push(m);
  const idx = s.messages.length - 1;
  appendMsgDom(s, idx);
  saveSessions();
  return idx;
}
let lastAutoSave = 0;
function autoSave() {
  if (Date.now() - lastAutoSave > 3e3) {
    lastAutoSave = Date.now();
    saveSessions();
  }
}
function buildMd(s) {
  let out = `# ${s.title}

**\u95EE\u9898\uFF1A**

${s.config.question}

**\u53C2\u4E0E\u8005\uFF1A** ${s.config.participants.map((p) => `${p.name}\uFF08${p.roleName}\uFF0C${sourceLabel(p.source)}\uFF09`).join("\u3001")}

`;
  for (const m of s.messages) {
    if (m.kind === "round") out += `
---

## ${m.content}

`;
    else if (m.kind === "user") out += `### \u{1F64B} \u6211

${m.content}

`;
    else if (m.kind === "judge") out += `## \u2696\uFE0F \u88C1\u5224\u603B\u7ED3\uFF08${m.modelLabel}\uFF09

${m.content}

`;
    else if (m.kind === "factcheck") out += `## \u{1F50E} \u4E8B\u5B9E\u6838\u67E5\uFF08${m.modelLabel}\uFF09

${m.content}

`;
    else out += `### ${m.name}\uFF08${m.roleName}\uFF09\xB7 ${m.modelLabel}

${m.content}

`;
  }
  return out;
}
function exportMd(s) {
  const out = buildMd(s);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([out], { type: "text/markdown" }));
  a.download = s.title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40) + ".md";
  a.click();
}
function stopRunning() {
  if (!running) return;
  running.stop = true;
  [...running.stoppers].forEach((f) => f());
}
function renderNewDebate() {
  const sites = allSites();
  const keys = Object.keys(sites);
  const last = LS.get("lastDebate", null);
  const validSrc = (x) => x === "manual" || !!sites[x];
  let parts = ((last == null ? void 0 : last.participants) || []).filter((p) => validSrc(p.source));
  if (!parts.length) {
    parts = ["dola", "chatgpt", "deepseek"].map((k, i) => ({ source: k, name: sites[k].name, roleName: ROLES[i].name, rolePrompt: ROLES[i].prompt }));
  }
  const judge = (last == null ? void 0 : last.judgeSource) && (last.judgeSource === "none" || validSrc(last.judgeSource)) ? last.judgeSource : "claude";
  const roleOpts = (sel) => ROLES.map((r) => `<option ${r.name === sel ? "selected" : ""}>${r.name}</option>`).join("") + `<option ${ROLES.some((r) => r.name === sel) ? "" : "selected"}>\u81EA\u5B9A\u4E49</option>`;
  const partRow = (p) => `<div class="part">
      <select data-p="source">${sourceOptions(p.source)}</select>
      <input data-p="name" value="${esc(p.name)}" placeholder="\u53D1\u8A00\u4EBA\u540D\u5B57">
      <div><select data-p="roleName">${roleOpts(p.roleName)}</select>
      <textarea data-p="rolePrompt" placeholder="\u89D2\u8272\u8BF4\u660E" style="margin-top:6px">${esc(p.rolePrompt)}</textarea></div>
      <button class="small danger" data-rm>\u2715</button></div>`;
  $("#view").innerHTML = `
    <h2>\u65B0\u7684\u5706\u684C\u8BA8\u8BBA</h2>
    <div class="card muted">\u7B2C\u4E00\u6B21\u7528\uFF1F\u5148\u53BB <a href="#" data-goto-settings>\u7F51\u7AD9\u8BBE\u7F6E</a> \u5728\u8FD9\u4E2A\u6D4F\u89C8\u5668\u91CC\u767B\u5F55\u8981\u7528\u7684 AI \u7F51\u7AD9\u3002</div>
    <div class="card">
      <div class="row"><div><label>\u4ECE\u6A21\u677F\u5F00\u59CB\uFF08\u53EF\u9009\uFF09</label><select id="tpl"><option value="">\u2014 \u4E0D\u7528\u6A21\u677F \u2014</option>${TEMPLATES.map((t, i) => `<option value="${i}">${esc(t.name)}</option>`).join("")}</select></div></div>
      <label>\u4F60\u8981\u51B3\u7B56\u7684\u95EE\u9898\uFF08\u80CC\u666F\u4FE1\u606F\u3001\u7EA6\u675F\u6761\u4EF6\u5199\u5F97\u8D8A\u5177\u4F53\uFF0C\u8BA8\u8BBA\u8D8A\u6709\u7528\uFF09</label>
      <textarea id="q" rows="5" placeholder="\u4F8B\u5982\uFF1A\u6211\u5728\u8003\u8651\u8F9E\u804C\u521B\u4E1A\u505A\u72EC\u7ACB\u5F00\u53D1\uFF0C\u76EE\u524D\u5B58\u6B3E\u591F\u751F\u6D3B 18 \u4E2A\u6708\u2026\u2026\u8BE5\u4E0D\u8BE5\u73B0\u5728\u8F9E\u804C\uFF1F">${esc((last == null ? void 0 : last.questionDraft) || "")}</textarea>
    </div>
    <div class="card">
      <div class="row"><div><b>\u53C2\u4E0E\u8BA8\u8BBA\u7684 AI</b> <span class="muted">\uFF08\u6309\u987A\u5E8F\u8F6E\u6D41\u53D1\u8A00\uFF1B\u540C\u4E00\u4E2A\u7F51\u7AD9\u4E5F\u53EF\u4EE5\u51FA\u73B0\u591A\u6B21\uFF0C\u5404\u5F00\u4E00\u4E2A\u5BF9\u8BDD\uFF09</span></div><button class="small fit" id="addPart">\uFF0B \u52A0\u4E00\u4F4D</button></div>
      <div class="part muted" style="margin:10px 0 2px"><span>\u6765\u6E90</span><span>\u540D\u5B57</span><span>\u89D2\u8272</span><span></span></div>
      <div id="parts">${parts.map(partRow).join("")}</div>
    </div>
    <div class="card row">
      <div><label>\u8BA8\u8BBA\u8F6E\u6570</label><input id="rounds" type="number" min="1" max="10" value="${(last == null ? void 0 : last.rounds) || 3}"></div>
      <div><label>\u6BCF\u6B21\u53D1\u8A00\u5B57\u6570\u4E0A\u9650</label><input id="maxLen" type="number" min="50" step="50" value="${(last == null ? void 0 : last.maxLen) || 400}"></div>
      <div style="flex:2"><label>\u88C1\u5224\uFF08\u6700\u540E\u7EFC\u5408\u51FA\u51B3\u7B56\uFF09</label><select id="judge">${sourceOptions(judge, true)}</select></div>
    </div>
    <div class="card" style="display:grid;gap:10px">
      <label style="margin:0;color:var(--text)"><input type="checkbox" id="indep" style="width:auto" ${(last == null ? void 0 : last.independentFirst) === false ? "" : "checked"}>
      \u7B2C\u4E00\u8F6E\u5404\u81EA\u72EC\u7ACB\u4F5C\u7B54\uFF08\u4E92\u76F8\u770B\u4E0D\u5230\uFF0C\u907F\u514D\u88AB\u7B2C\u4E00\u4E2A\u53D1\u8A00\u7684\u5E26\u504F\uFF09</label>
      <label style="margin:0;color:var(--text)"><input type="checkbox" id="useProfile" style="width:auto" ${(last == null ? void 0 : last.useProfile) === false ? "" : "checked"}>
      \u5E26\u4E0A\u6211\u7684\u80CC\u666F\u6863\u6848 <span class="muted">${LS.get("profile", "") ? "\uFF08" + esc(LS.get("profile", "").slice(0, 40)) + "\u2026\uFF09" : '\uFF08\u8FD8\u6CA1\u586B\uFF0C<a href="#" data-goto-settings>\u53BB\u586B\u5199</a>\uFF09'}</span></label>
      <div class="row"><div><label style="margin:0;color:var(--text)">\u{1F50E} \u4E8B\u5B9E\u6838\u67E5\uFF1A\u88C1\u5224\u603B\u7ED3\u524D\uFF0C\u8BA9\u4E00\u4E2A\u80FD\u8054\u7F51\u3001\u5E26\u6765\u6E90\u7684 AI \u6838\u67E5\u8BA8\u8BBA\u91CC\u7684\u4E8B\u5B9E\u548C\u89C4\u5B9A\uFF0C\u5E76\u9644\u94FE\u63A5</label></div>
        <select class="fit" id="fact" style="width:220px"><option value="none">\u4E0D\u6838\u67E5</option>${sourceOptions((last == null ? void 0 : last.factSource) && last.factSource !== "none" ? last.factSource : "")}</select></div>
    </div>
    <button class="primary" id="start" style="padding:10px 24px">\u5F00\u59CB\u8BA8\u8BBA</button>`;
  const box = $("#parts");
  $("#addPart").onclick = () => {
    const n = box.children.length;
    const k = keys[n % keys.length];
    const r = ROLES[n % ROLES.length];
    box.insertAdjacentHTML("beforeend", partRow({ source: k, name: sites[k].name + " " + (n + 1), roleName: r.name, rolePrompt: r.prompt }));
  };
  box.addEventListener("click", (e) => {
    if (e.target.closest("[data-rm]") && box.children.length > 1) e.target.closest(".part").remove();
  });
  box.addEventListener("change", (e) => {
    const row = e.target.closest(".part");
    if (e.target.dataset.p === "roleName") {
      const r = ROLES.find((x) => x.name === e.target.value);
      row.querySelector("[data-p=rolePrompt]").value = r ? r.prompt : "";
    }
    if (e.target.dataset.p === "source") row.querySelector("[data-p=name]").value = e.target.value === "manual" ? "\u624B\u52A8" : sites[e.target.value].name;
  });
  if (last == null ? void 0 : last.factSource) $("#fact").value = last.factSource;
  $("#tpl").onchange = () => {
    const t = TEMPLATES[$("#tpl").value];
    if (!t) return;
    if ($("#q").value.trim() && !confirm("\u7528\u6A21\u677F\u66FF\u6362\u73B0\u5728\u5199\u7684\u95EE\u9898\uFF1F")) {
      $("#tpl").value = "";
      return;
    }
    $("#q").value = t.q;
    const rows = [...box.children];
    t.roles.forEach((rn, i) => {
      let row = rows[i];
      if (!row) {
        $("#addPart").click();
        row = box.children[box.children.length - 1];
      }
      const r = ROLES.find((x) => x.name === rn);
      row.querySelector("[data-p=roleName]").value = r.name;
      row.querySelector("[data-p=rolePrompt]").value = r.prompt;
    });
    if (t.fact && $("#fact").value === "none") $("#fact").value = "perplexity";
  };
  $("#q").addEventListener("input", () => LS.set("lastDebate", { ...LS.get("lastDebate", {}) || {}, questionDraft: $("#q").value }));
  $("#start").onclick = () => {
    if (running) return alert("\u5DF2\u6709\u4E00\u4E2A\u8BA8\u8BBA\u6B63\u5728\u8FDB\u884C\uFF0C\u8BF7\u5148\u7B49\u5B83\u7ED3\u675F\u6216\u505C\u6B62\u3002");
    const question = $("#q").value.trim();
    if (!question) return alert("\u5148\u5199\u4E0B\u4F60\u8981\u8BA8\u8BBA\u7684\u95EE\u9898\u3002");
    const participants = [...box.children].map((row, i) => {
      const g = (f) => row.querySelector(`[data-p=${f}]`).value.trim();
      return { source: g("source"), name: g("name") || `AI ${i + 1}`, roleName: g("roleName"), rolePrompt: g("rolePrompt"), color: COLORS[i % COLORS.length] };
    });
    const names = participants.map((p) => p.name);
    if (new Set(names).size !== names.length) return alert("\u53D1\u8A00\u4EBA\u540D\u5B57\u4E0D\u80FD\u91CD\u590D\uFF0C\u4E0D\u7136 AI \u5206\u4E0D\u6E05\u8C01\u8BF4\u4E86\u4EC0\u4E48\u3002");
    const config = {
      question,
      participants,
      rounds: Math.max(1, Math.min(10, Number($("#rounds").value) || 3)),
      maxLen: Number($("#maxLen").value) || 400,
      judgeSource: $("#judge").value,
      independentFirst: $("#indep").checked,
      useProfile: $("#useProfile").checked,
      profile: $("#useProfile").checked ? LS.get("profile", "").trim() : "",
      factSource: $("#fact").value
    };
    LS.set("lastDebate", { ...config, profile: void 0, questionDraft: "" });
    const s = { id: uid(), title: question.replace(/\s+/g, " ").slice(0, 30), createdAt: Date.now(), config, messages: [], roundsDone: 0, seen: {} };
    sessions.push(s);
    saveSessions();
    currentId = s.id;
    renderHistory();
    for (const [k, v] of Object.entries(webTabs)) if (!k.startsWith(s.id + "|")) {
      chrome.tabs.remove(v.tabId).catch(() => {
      });
      delete webTabs[k];
    }
    runDebate(s, config.rounds);
  };
}
function transcript(msgs, excludeName) {
  return msgs.filter((m) => !m.error && m.content && !(excludeName && m.kind === "ai" && m.name === excludeName)).map((m) => {
    if (m.kind === "round") return `\u2014\u2014 ${m.content} \u2014\u2014`;
    if (m.kind === "user") return `\u3010\u63D0\u95EE\u8005\u8865\u5145\u8BF4\u660E\uFF08\u4EE5\u6B64\u4E3A\u51C6\uFF1B\u5982\u679C\u548C\u4E4B\u524D\u7684\u5047\u8BBE\u51B2\u7A81\uFF0C\u8BF7\u6309\u8FD9\u4E2A\u4FEE\u6B63\u4F60\u7684\u5206\u6790\uFF09\u3011
${m.content}`;
    if (m.kind === "judge") return `\u3010\u88C1\u5224\u9636\u6BB5\u6027\u603B\u7ED3\u3011
${m.content}`;
    if (m.kind === "factcheck") return `\u3010\u4E8B\u5B9E\u6838\u67E5\u7ED3\u679C\uFF08\u8054\u7F51\u67E5\u8BC1\uFF09\u3011
${m.content}`;
    return `\u3010${m.name}\uFF08${m.roleName}\uFF09\u3011
${m.content}`;
  }).join("\n\n");
}
function profileBlock(s) {
  return s.config.profile ? `\u3010\u63D0\u95EE\u8005\u7684\u80CC\u666F\u6863\u6848\u3011
${s.config.profile}

` : "";
}
function rules(s, p) {
  const others = s.config.participants.filter((x) => x.name !== p.name).map((x) => `${x.name}\uFF08${x.roleName}\uFF09`).join("\u3001");
  return `\u4F60\u6B63\u5728\u53C2\u52A0\u4E00\u573A\u7531\u591A\u4E2A\u4E0D\u540C AI \u53C2\u4E0E\u7684\u5706\u684C\u8BA8\u8BBA\uFF0C\u76EE\u7684\u662F\u5E2E\u52A9\u63D0\u95EE\u8005\u505A\u51FA\u5C3D\u53EF\u80FD\u597D\u7684\u51B3\u7B56\u3002\u8BA8\u8BBA\u5185\u5BB9\u7531\u4E00\u4E2A\u5DE5\u5177\u5728\u5404\u4E2A AI \u4E4B\u95F4\u8F6C\u8FBE\u3002
\u4F60\u7684\u540D\u5B57\u662F\u300C${p.name}\u300D\uFF0C\u4F60\u7684\u89D2\u8272\u662F\u300C${p.roleName}\u300D\uFF1A${p.rolePrompt}
\u5176\u4ED6\u53C2\u4E0E\u8005\uFF1A${others || "\u65E0"}\u3002

\u8BA8\u8BBA\u89C4\u5219\uFF1A
- \u9488\u5BF9\u5176\u4ED6\u53C2\u4E0E\u8005\u7684\u5177\u4F53\u89C2\u70B9\u56DE\u5E94\uFF08\u70B9\u540D\uFF09\uFF0C\u8BF4\u6E05\u695A\u540C\u610F\u4EC0\u4E48\u3001\u53CD\u5BF9\u4EC0\u4E48\u3001\u4E3A\u4EC0\u4E48\u3002
- \u88AB\u66F4\u597D\u7684\u8BBA\u8BC1\u8BF4\u670D\u65F6\uFF0C\u8981\u660E\u786E\u4FEE\u6B63\u81EA\u5DF1\u7684\u7ACB\u573A\uFF1B\u4E0D\u8981\u4E3A\u4E86\u53CD\u5BF9\u800C\u53CD\u5BF9\uFF0C\u4E5F\u4E0D\u8981\u65E0\u539F\u5219\u5730\u9644\u548C\u3002
- \u8BB2\u4E8B\u5B9E\u548C\u63A8\u7406\uFF1B\u4E0D\u786E\u5B9A\u7684\u5730\u65B9\u8BF4\u660E\u4E0D\u786E\u5B9A\uFF0C\u5E76\u8BF4\u660E\u9700\u8981\u4EC0\u4E48\u4FE1\u606F\u624D\u80FD\u786E\u5B9A\u3002
- \u4E0D\u8981\u91CD\u590D\u522B\u4EBA\u6216\u81EA\u5DF1\u5DF2\u7ECF\u8BF4\u8FC7\u7684\u5185\u5BB9\uFF0C\u6BCF\u6B21\u53D1\u8A00\u90FD\u8981\u5E26\u6765\u65B0\u4FE1\u606F\u3002
- \u6BCF\u6B21\u53D1\u8A00\u4E0D\u8D85\u8FC7 ${s.config.maxLen} \u5B57\uFF0C\u4F7F\u7528\u4E0E\u95EE\u9898\u76F8\u540C\u7684\u8BED\u8A00\u3002
- \u53EA\u4EE5\u4F60\u81EA\u5DF1\u7684\u8EAB\u4EFD\u53D1\u8A00\uFF0C\u4E0D\u8981\u66FF\u522B\u4EBA\u8BF4\u8BDD\uFF0C\u4E0D\u8981\u5728\u5F00\u5934\u5199\u81EA\u5DF1\u7684\u540D\u5B57\u3002
- \u5982\u679C\u7F3A\u5C11\u67D0\u4E2A\u5173\u952E\u4FE1\u606F\u3001\u4F1A\u660E\u663E\u5F71\u54CD\u7ED3\u8BBA\uFF0C\u53EF\u4EE5\u76F4\u63A5\u95EE\u63D0\u95EE\u8005\uFF1A\u5728\u53D1\u8A00\u6700\u540E\u5355\u72EC\u4E00\u884C\u5199\u300C\u3010\u95EE\u63D0\u95EE\u8005\u3011\u95EE\u9898\u300D\uFF0C\u6BCF\u6B21\u6700\u591A 2 \u4E2A\uFF0C\u5C3D\u91CF\u95EE\u80FD\u7528\u201C\u662F/\u5426\u201D\u56DE\u7B54\u7684\u95EE\u9898\u3002\u63D0\u95EE\u8005\u7684\u56DE\u7B54\u4F1A\u8F6C\u7ED9\u6240\u6709\u4EBA\u3002`;
}
function turnInstr(round, isLast, independent) {
  if (round === 1 && independent) return "\u8FD9\u662F\u7B2C\u4E00\u8F6E\uFF0C\u4F60\u770B\u4E0D\u5230\u5176\u4ED6\u4EBA\u8FD9\u4E00\u8F6E\u7684\u53D1\u8A00\u3002\u8BF7\u72EC\u7ACB\u7ED9\u51FA\u4F60\u7684\u5206\u6790\u548C\u521D\u6B65\u5EFA\u8BAE\u3002";
  if (round === 1) return "\u8FD9\u662F\u7B2C\u4E00\u8F6E\u3002\u8BF7\u7ED9\u51FA\u4F60\u7684\u5206\u6790\u548C\u521D\u6B65\u5EFA\u8BAE\uFF1B\u5982\u679C\u524D\u9762\u5DF2\u6709\u4EBA\u53D1\u8A00\uFF0C\u53EF\u4EE5\u76F4\u63A5\u56DE\u5E94\u3002";
  if (isLast) return "\u8FD9\u662F\u6700\u540E\u4E00\u8F6E\u3002\u8BF7\u56DE\u5E94\u4ECD\u7136\u5B58\u5728\u7684\u5206\u6B67\uFF0C\u7136\u540E\u660E\u786E\u7ED9\u51FA\u4F60\u7684\u6700\u7EC8\u7ACB\u573A\u548C\u5EFA\u8BAE\uFF08\u53EF\u4EE5\u4FEE\u6B63\u4E4B\u524D\u7684\u89C2\u70B9\uFF09\u3002";
  return "\u8BF7\u9488\u5BF9\u5176\u4ED6\u53C2\u4E0E\u8005\u7684\u5177\u4F53\u89C2\u70B9\u505A\u51FA\u56DE\u5E94\uFF0C\u5E76\u66F4\u65B0\u4F60\u7684\u7ACB\u573A\u3002";
}
async function speak(s, p, round, isLast, snapshot) {
  var _a;
  const idx = pushMsg(s, { kind: "ai", name: p.name, roleName: p.roleName, modelLabel: sourceLabel(p.source), color: p.color, content: "" });
  const visibleMsgs = snapshot ? snapshot.concat(s.messages.slice(snapshot.length, idx).filter((m) => m.kind === "user")) : s.messages.slice(0, idx);
  (_a = s.sentUser) != null ? _a : s.sentUser = {};
  const sent = new Set(s.sentUser[p.name] || []);
  const instr = turnInstr(round, isLast, !!snapshot);
  const full = `${rules(s, p)}

${profileBlock(s)}\u3010\u8981\u51B3\u7B56\u7684\u95EE\u9898\u3011
${s.config.question}

\u3010\u76EE\u524D\u7684\u8BA8\u8BBA\u8BB0\u5F55\u3011
${transcript(visibleMsgs) || "\uFF08\u8FD8\u6CA1\u6709\u4EBA\u53D1\u8A00\uFF09"}

\u73B0\u5728\u8F6E\u5230\u4F60\uFF08${p.name}\uFF09\u53D1\u8A00\uFF0C\u7B2C ${round} \u8F6E\u3002${instr}`;
  const seen = s.seen[p.name];
  const deltaText = seen != null ? transcript(visibleMsgs.slice(seen).filter((m) => !(m.kind === "user" && sent.has(m.uid))), p.name) : "";
  const delta = `\u3010\u4F60\u4E0A\u6B21\u53D1\u8A00\u4E4B\u540E\u7684\u65B0\u5185\u5BB9\u3011
${deltaText || "\uFF08\u6CA1\u6709\u65B0\u5185\u5BB9\uFF09"}

\u73B0\u5728\u8F6E\u5230\u4F60\uFF08${p.name}\uFF0C${p.roleName}\uFF09\u53D1\u8A00\uFF0C\u7B2C ${round} \u8F6E\u3002${instr}\uFF08\u4E0D\u8D85\u8FC7 ${s.config.maxLen} \u5B57\uFF09`;
  const tabKey = s.id + "|" + p.name;
  await getAnswer(s, idx, p.source, tabKey, (ctx) => seen != null && ctx ? delta : full, seen != null ? delta : full, full, false);
  const qs = s.messages[idx].error ? [] : extractQuestions(s.messages[idx].content);
  if (qs.length) {
    s.messages[idx].questions = qs;
    updateMsgDom(s.id, idx);
    saveSessions();
  }
  if (!s.messages[idx].error) {
    s.seen[p.name] = snapshot ? snapshot.length : idx + 1;
    s.sentUser[p.name] = [...sent, ...visibleMsgs.filter((m) => m.kind === "user").map((m) => m.uid)];
  }
}
async function getAnswer(s, idx, source, tabKey, webPromptFn, manualPrompt, fullPrompt, fresh) {
  const msg = s.messages[idx];
  let note = "";
  if (source !== "manual") {
    msg.streaming = true;
    updateMsgDom(s.id, idx);
    let prompt = "";
    try {
      msg.content = await askWeb(
        source,
        tabKey,
        (ctx) => prompt = webPromptFn(ctx),
        (t) => {
          msg.status = "";
          msg.content = t;
          scheduleUpdate(s.id, idx);
          autoSave();
        },
        fresh,
        (st) => {
          msg.status = st;
          scheduleUpdate(s.id, idx);
        }
      );
      msg.status = "";
      msg.streaming = false;
      updateMsgDom(s.id, idx);
      saveSessions();
      return;
    } catch (e) {
      msg.streaming = false;
      msg.status = "";
      if (running == null ? void 0 : running.stop) {
        msg.error = true;
        msg.content = "\uFF08\u5DF2\u505C\u6B62\uFF09";
        updateMsgDom(s.id, idx);
        return;
      }
      note = `${sourceLabel(source)} \u81EA\u52A8\u64CD\u4F5C\u5931\u8D25\uFF1A${e.message} \u5DF2\u5207\u6362\u6210\u590D\u5236\u7C98\u8D34\uFF0C\u4F60\u53EF\u4EE5\u624B\u52A8\u53D1\u7ED9\u5B83\uFF08\u6216\u522B\u7684 AI\uFF09\u3002`;
      manualPrompt = prompt || manualPrompt;
      msg.content = "";
    }
  }
  const v = await askManual(s, idx, manualPrompt, fullPrompt, note);
  msg.manual = null;
  if (v == null) {
    msg.error = true;
    msg.content = (running == null ? void 0 : running.stop) ? "\uFF08\u5DF2\u505C\u6B62\uFF09" : "\uFF08\u8DF3\u8FC7\uFF09";
  } else msg.content = v;
  updateMsgDom(s.id, idx);
  saveSessions();
}
async function runJudge(s) {
  const src = s.config.judgeSource;
  const idx = pushMsg(s, { kind: "judge", modelLabel: sourceLabel(src), content: "" });
  const prompt = `\u4F60\u662F\u4E00\u573A\u591A AI \u5706\u684C\u8BA8\u8BBA\u7684\u88C1\u5224\u548C\u603B\u7ED3\u8005\uFF0C\u76EE\u6807\u662F\u5E2E\u52A9\u63D0\u95EE\u8005\u505A\u51FA\u6700\u597D\u7684\u51B3\u7B56\u3002
\u4F60\u8981\u72EC\u7ACB\u8BC4\u4F30\u5404\u65B9\u8BBA\u70B9\u7684\u8D28\u91CF\uFF0C\u800C\u4E0D\u662F\u7B80\u5355\u6298\u4E2D\u6216\u6570\u7968\u6570\uFF1B\u5982\u679C\u8BA8\u8BBA\u4E2D\u6709\u4E8B\u5B9E\u9519\u8BEF\u6216\u903B\u8F91\u6F0F\u6D1E\uFF0C\u8981\u76F4\u63A5\u6307\u51FA\u3002\u4F7F\u7528\u4E0E\u95EE\u9898\u76F8\u540C\u7684\u8BED\u8A00\u3002

${profileBlock(s)}\u3010\u8981\u51B3\u7B56\u7684\u95EE\u9898\u3011
${s.config.question}

\u3010\u5B8C\u6574\u8BA8\u8BBA\u8BB0\u5F55\u3011
${transcript(s.messages.slice(0, idx))}

\u8BF7\u8F93\u51FA\u6700\u7EC8\u51B3\u7B56\u62A5\u544A\uFF0C\u5305\u542B\u4EE5\u4E0B\u90E8\u5206\uFF1A
## \u6700\u7EC8\u5EFA\u8BAE
\uFF08\u5148\u7528\u4E00\u53E5\u8BDD\u7ED9\u51FA\u660E\u786E\u7ED3\u8BBA\uFF0C\u518D\u7B80\u8981\u8BF4\u660E\uFF09
## \u6838\u5FC3\u7406\u7531
## \u5171\u8BC6\u4E0E\u5206\u6B67\u4E00\u89C8
\uFF08\u7528\u4E24\u4E2A\u5217\u8868\uFF1A\u2705 \u5927\u5BB6\u90FD\u540C\u610F\u7684\u70B9\uFF1B\u2694\uFE0F \u4ECD\u6709\u4E89\u8BAE\u7684\u70B9\u2014\u2014\u5199\u6E05\u5404\u65B9\u7ACB\u573A\u548C\u4F60\u7684\u88C1\u51B3\uFF09
## \u5404\u9009\u9879\u628A\u63E1\u5EA6
\uFF08\u7528\u8868\u683C\uFF1A\u9009\u9879 | \u63A8\u8350\u7A0B\u5EA6\uFF08\u26051-5\uFF09 | \u628A\u63E1\uFF08%\uFF09 | \u6210\u7ACB\u7684\u5173\u952E\u524D\u63D0\uFF09
## \u98CE\u9669\u4E0E\u5E94\u5BF9
## \u8FD8\u9700\u8981\u63D0\u95EE\u8005\u786E\u8BA4\u7684\u4FE1\u606F
## \u6574\u4F53\u5171\u8BC6\u7A0B\u5EA6
\uFF081-10 \u5206\uFF0C\u5E76\u8BF4\u660E\u5404\u65B9\u6700\u7EC8\u662F\u5426\u8D8B\u4E8E\u4E00\u81F4\uFF09
\u5982\u679C\u6709\u4E8B\u5B9E\u6838\u67E5\u7ED3\u679C\uFF0C\u4EE5\u6838\u67E5\u7ED3\u679C\u4E3A\u51C6\uFF1B\u88AB\u6838\u67E5\u4E3A\u9519\u8BEF\u7684\u8BF4\u6CD5\u4E0D\u80FD\u4F5C\u4E3A\u4F9D\u636E\u3002`;
  await getAnswer(s, idx, src, s.id + "|__judge", () => prompt, prompt, prompt, true);
}
async function runFactCheck(s) {
  const src = s.config.factSource;
  const idx = pushMsg(s, { kind: "factcheck", modelLabel: sourceLabel(src), content: "" });
  const prompt = `\u4F60\u662F\u4E8B\u5B9E\u6838\u67E5\u5458\u3002\u4E0B\u9762\u662F\u4E00\u573A\u591A AI \u8BA8\u8BBA\u7684\u8BB0\u5F55\u3002\u8BF7\u8054\u7F51\u641C\u7D22\uFF0C\u6838\u67E5\u5176\u4E2D\u7684\u4E8B\u5B9E\u6027\u8BF4\u6CD5\uFF0C\u5C24\u5176\u662F\u6CD5\u5F8B\u6CD5\u89C4\u3001\u7B7E\u8BC1/\u5728\u7559\u3001\u7A0E\u52A1\u3001\u8D39\u7528\u3001\u65F6\u95F4\u8981\u6C42\u3001\u7EDF\u8BA1\u6570\u636E\u3002
\u8981\u6C42\uFF1A
- \u9010\u6761\u5217\u51FA\u503C\u5F97\u6838\u67E5\u7684\u8BF4\u6CD5\uFF08\u6700\u591A 10 \u6761\uFF0C\u4F18\u5148\u5F71\u54CD\u51B3\u7B56\u7684\uFF09\uFF0C\u6BCF\u6761\u6807\u6CE8 \u2705 \u6B63\u786E / \u26A0\uFE0F \u5B58\u7591\u6216\u5DF2\u8FC7\u65F6 / \u274C \u9519\u8BEF\uFF0C\u5E76\u7528\u4E00\u4E24\u53E5\u8BDD\u8BF4\u660E\u3002
- \u6BCF\u6761\u90FD\u9644\u4E0A\u6765\u6E90\u94FE\u63A5\uFF08\u4F18\u5148\u5B98\u65B9\u7F51\u7AD9\uFF09\uFF0C\u5199\u51FA\u5B8C\u6574\u7F51\u5740\u3002
- \u6700\u540E\u7528\u4E00\u6BB5\u8BDD\u6307\u51FA\u8BA8\u8BBA\u4E2D\u6700\u9700\u8981\u4FEE\u6B63\u7684\u5730\u65B9\u3002\u4F7F\u7528\u4E0E\u95EE\u9898\u76F8\u540C\u7684\u8BED\u8A00\u3002

${profileBlock(s)}\u3010\u8981\u51B3\u7B56\u7684\u95EE\u9898\u3011
${s.config.question}

\u3010\u8BA8\u8BBA\u8BB0\u5F55\u3011
${transcript(s.messages.slice(0, idx))}`;
  await getAnswer(s, idx, src, s.id + "|__fact", () => prompt, prompt, prompt, true);
}
async function runDebate(s, nRounds, judgeOnly = false) {
  var _a;
  running = { sessionId: s.id, stop: false, stoppers: /* @__PURE__ */ new Set() };
  s.interrupted = true;
  s.notice = "";
  (_a = s.seen) != null ? _a : s.seen = {};
  renderSession();
  try {
    for (let k = 0; k < nRounds && !judgeOnly; k++) {
      if (running.stop) break;
      const round = s.roundsDone + 1;
      const isLast = k === nRounds - 1;
      pushMsg(s, { kind: "round", content: `\u7B2C ${round} \u8F6E` });
      const snapshot = round === 1 && s.config.independentFirst ? s.messages.slice() : null;
      for (const p of s.config.participants) {
        if (running.stop) break;
        await speak(s, p, round, isLast, snapshot);
      }
      if (!running.stop) s.roundsDone = round;
      saveSessions();
    }
    if (!running.stop && s.config.factSource && s.config.factSource !== "none" && !judgeOnly) await runFactCheck(s);
    if (!running.stop && s.config.judgeSource !== "none") await runJudge(s);
  } catch (e) {
    alert("\u51FA\u9519\u4E86\uFF1A" + e.message);
  } finally {
    running = null;
    s.interrupted = false;
    saveSessions();
    if (currentId === s.id) renderSession();
  }
}
function renderSession() {
  const s = current();
  if (!s) return renderNewDebate();
  const isRunning = running && running.sessionId === s.id;
  $("#view").innerHTML = `<div class="card">
      <div class="row"><h2 style="margin:0">${esc(s.title)}</h2>
        <div class="fit">${isRunning ? '<button class="danger" id="stop">\u25A0 \u505C\u6B62</button>' : ""} <button id="export">\u5BFC\u51FA Markdown</button></div></div>
      <div style="white-space:pre-wrap;margin-top:8px">${esc(s.config.question)}</div>
      <div style="margin-top:8px">${s.config.participants.map((p) => `<span class="tag" style="color:${p.color};background:transparent;border:1px solid ${p.color}">${esc(p.name)} \xB7 ${esc(p.roleName)}</span>`).join(" ")}</div>
    </div>${s.notice ? `<div class="card warn">${esc(s.notice)}</div>` : ""}<div id="msgs">${s.messages.map(msgHtml).join("")}</div><div class="composer" id="composer"></div>`;
  $("#export").onclick = () => exportMd(s);
  if ($("#stop")) $("#stop").onclick = stopRunning;
  const el = $("#composer");
  if (isRunning) {
    el.innerHTML = `<div class="box" style="flex-direction:column">
      <textarea id="note" placeholder="\u968F\u65F6\u8865\u5145\u8BF4\u660E\uFF1A\u6BD4\u5982\u7EA0\u6B63 AI \u7684\u8BEF\u89E3\u3001\u8865\u5145\u80CC\u666F\u3002\u70B9\u300C\u63D2\u5165\u300D\u540E\uFF0C\u63A5\u4E0B\u6765\u53D1\u8A00\u7684\u6BCF\u4E2A AI \u90FD\u4F1A\u6536\u5230\u3002"></textarea>
      <div class="row" style="justify-content:flex-end"><span class="muted">\u8BA8\u8BBA\u8FDB\u884C\u4E2D\u2026\uFF08AI \u7F51\u9875\u5728\u53E6\u4E00\u4E2A\u7A97\u53E3\u91CC\uFF0C\u522B\u6700\u5C0F\u5316\u5B83\uFF09</span>
        <button class="primary fit" id="addNote">\u63D2\u5165\u8865\u5145\u8BF4\u660E</button><button class="small danger fit" id="stop2">\u505C\u6B62</button></div></div>`;
    $("#stop2").onclick = stopRunning;
    $("#addNote").onclick = () => {
      const t = $("#note").value.trim();
      if (!t) return;
      pushMsg(s, { kind: "user", content: t, uid: uid() });
      $("#note").value = "";
      saveSessions();
    };
  } else {
    el.innerHTML = `<div class="box" style="flex-direction:column">
      <textarea id="input" placeholder="\uFF08\u53EF\u9009\uFF09\u8865\u5145\u8BF4\u660E\uFF1A\u7EA0\u6B63 AI \u7684\u8BEF\u89E3\u3001\u8865\u5145\u80CC\u666F\u3001\u8FFD\u95EE\uFF0C\u6216\u8BA9\u5927\u5BB6\u91CD\u70B9\u8BA8\u8BBA\u67D0\u4E00\u70B9\u3002\u5199\u5B8C\u70B9\u300C\u7EE7\u7EED\u8BA8\u8BBA\u300D\uFF0C\u6240\u6709 AI \u90FD\u4F1A\u6536\u5230\u3002"></textarea>
      <div class="row" style="justify-content:flex-end">
        <div class="fit muted">\u7EE7\u7EED\u8BA8\u8BBA</div>
        <input class="fit" id="more" type="number" min="1" max="10" value="1" style="width:64px"> <span class="fit muted">\u8F6E</span>
        <button class="primary fit" id="cont">\u7EE7\u7EED\u8BA8\u8BBA</button>
        ${s.config.judgeSource !== "none" ? '<button class="fit" id="rejudge">\u53EA\u8BA9\u88C1\u5224\u91CD\u65B0\u603B\u7ED3</button>' : ""}
      </div></div>`;
    const addUser = () => {
      const t = $("#input").value.trim();
      if (t) pushMsg(s, { kind: "user", content: t, uid: uid() });
    };
    $("#cont").onclick = () => {
      if (running) return alert("\u5DF2\u6709\u8BA8\u8BBA\u5728\u8FDB\u884C");
      addUser();
      runDebate(s, Math.max(1, Number($("#more").value) || 1));
    };
    if ($("#rejudge")) $("#rejudge").onclick = () => {
      if (running) return alert("\u5DF2\u6709\u8BA8\u8BBA\u5728\u8FDB\u884C");
      addUser();
      runDebate(s, 0, true);
    };
  }
  $(".main").scrollTop = $(".main").scrollHeight;
}
const KV = {
  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open("ai-roundtable", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("kv");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  },
  async get(k) {
    const db = await this.open();
    return new Promise((res) => {
      const r = db.transaction("kv").objectStore("kv").get(k);
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(void 0);
    });
  },
  async set(k, v) {
    const db = await this.open();
    return new Promise((res) => {
      const t = db.transaction("kv", "readwrite");
      t.objectStore("kv").put(v, k);
      t.oncomplete = res;
      t.onerror = res;
    });
  }
};
var dirHandle = null;
var diskState = "none";
var diskError = "";
var lastDiskSave = null;
var diskTimer = null;
var written = {};
const pad = (n) => String(n).padStart(2, "0");
function mdFileName(s) {
  const d = new Date(s.createdAt);
  const t = s.title.replace(/[\\/:*?"<>|\r\n]/g, "_").trim().slice(0, 40) || "\u8BA8\u8BBA";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}_${t}.md`;
}
function backupData() {
  return { app: "AI \u5706\u684C", version: 1, savedAt: (/* @__PURE__ */ new Date()).toISOString(), profile: LS.get("profile", ""), sessions, siteOverrides, customSites, lastDebate: LS.get("lastDebate", null) };
}
async function initDisk() {
  if (!window.showDirectoryPicker) {
    diskState = "unsupported";
    return renderDiskUi();
  }
  try {
    dirHandle = await KV.get("dir");
  } catch (e) {
  }
  if (dirHandle) {
    const p = await dirHandle.queryPermission({ mode: "readwrite" });
    diskState = p === "granted" ? "ok" : "needPermission";
    if (diskState === "ok") scheduleDiskSave(true);
  }
  renderDiskUi();
}
function scheduleDiskSave(now) {
  if (diskState !== "ok") return;
  clearTimeout(diskTimer);
  diskTimer = setTimeout(saveToDisk, now ? 0 : 1500);
}
async function writeFile(dir, key, name, text) {
  if (written[key] === text) return;
  const fh = await dir.getFileHandle(name, { create: true });
  const w = await fh.createWritable();
  await w.write(text);
  await w.close();
  written[key] = text;
}
async function saveToDisk() {
  if (!dirHandle || diskState !== "ok") return;
  try {
    const rec = await dirHandle.getDirectoryHandle("\u8BA8\u8BBA\u8BB0\u5F55", { create: true });
    for (const s of sessions) {
      const n = mdFileName(s);
      await writeFile(rec, "rec/" + n, n, buildMd(s));
    }
    await writeFile(dirHandle, "profile", "\u6211\u7684\u80CC\u666F\u6863\u6848.md", "# \u6211\u7684\u80CC\u666F\u6863\u6848\n\n" + LS.get("profile", "") + "\n");
    await writeFile(dirHandle, "backup", "AI\u5706\u684C-\u5907\u4EFD.json", JSON.stringify(backupData(), null, 1));
    lastDiskSave = /* @__PURE__ */ new Date();
  } catch (e) {
    if (e.name === "NotAllowedError" || e.name === "SecurityError") diskState = "needPermission";
    else {
      diskState = "error";
      diskError = e.message;
    }
  }
  renderDiskUi();
}
function diskStatusText() {
  if (diskState === "unsupported") return "\u8FD9\u4E2A\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u4FDD\u5B58\u5230\u6587\u4EF6\u5939\uFF0C\u8BF7\u7528\u6700\u65B0\u7248 Chrome \u6216 Edge\u3002";
  if (diskState === "none") return "\u8FD8\u6CA1\u9009\u62E9\u4FDD\u5B58\u4F4D\u7F6E\u3002";
  if (diskState === "needPermission") return `\u9700\u8981\u4F60\u70B9\u4E00\u4E0B\u300C\u6062\u590D\u81EA\u52A8\u4FDD\u5B58\u300D\u91CD\u65B0\u5141\u8BB8\u5199\u5165\u6587\u4EF6\u5939\u300C${dirHandle.name}\u300D\u3002`;
  if (diskState === "error") return "\u4FDD\u5B58\u51FA\u9519\uFF1A" + diskError;
  return `\u2705 \u6B63\u5728\u81EA\u52A8\u4FDD\u5B58\u5230\u6587\u4EF6\u5939\u300C${dirHandle.name}\u300D` + (lastDiskSave ? `\uFF0C\u6700\u540E\u4FDD\u5B58 ${pad(lastDiskSave.getHours())}:${pad(lastDiskSave.getMinutes())}:${pad(lastDiskSave.getSeconds())}` : "");
}
function diskCardHtml() {
  return `<b>\u{1F4BE} \u81EA\u52A8\u4FDD\u5B58\u5230\u7535\u8111</b> <span class="muted">\uFF08\u6362\u7535\u8111\u65F6\uFF0C\u628A\u8FD9\u4E2A\u6587\u4EF6\u5939\u62F7\u8FC7\u53BB\uFF0C\u518D\u70B9\u300C\u4ECE\u5907\u4EFD\u5BFC\u5165\u300D\u5C31\u80FD\u6062\u590D\uFF09</span>
    <div class="muted" style="margin:8px 0" id="diskStatus">${esc(diskStatusText())}</div>
    <div class="row" style="justify-content:flex-start">
      <button class="fit ${diskState === "none" ? "primary" : ""}" data-disk="pick">${dirHandle ? "\u6362\u4E00\u4E2A\u6587\u4EF6\u5939" : "\u9009\u62E9\u4FDD\u5B58\u6587\u4EF6\u5939"}</button>
      ${diskState === "needPermission" || diskState === "error" ? '<button class="fit primary" data-disk="regrant">\u6062\u590D\u81EA\u52A8\u4FDD\u5B58</button>' : ""}
      ${diskState === "ok" ? '<button class="fit" data-disk="now">\u7ACB\u5373\u4FDD\u5B58</button>' : ""}
      <button class="fit" data-disk="import">\u4ECE\u5907\u4EFD\u5BFC\u5165</button>
      <input type="file" id="importFile" accept=".json,application/json" style="display:none">
    </div>
    <div class="muted" style="margin-top:8px">\u6587\u4EF6\u5939\u91CC\u4F1A\u6709\uFF1A\u300C\u8BA8\u8BBA\u8BB0\u5F55\u300D\u6587\u4EF6\u5939\uFF08\u6BCF\u6B21\u8BA8\u8BBA\u4E00\u4E2A .md \u6587\u6863\uFF0C\u8FB9\u8BA8\u8BBA\u8FB9\u66F4\u65B0\uFF09\u3001\u300C\u6211\u7684\u80CC\u666F\u6863\u6848.md\u300D\u3001\u300CAI\u5706\u684C-\u5907\u4EFD.json\u300D\uFF08\u7528\u6765\u5BFC\u5165\uFF09\u3002
    \u5EFA\u8BAE\u9009 OneDrive \u91CC\u7684\u6587\u4EF6\u5939\uFF0C\u6362\u7535\u8111\u81EA\u52A8\u5C31\u6709\u3002\u6D4F\u89C8\u5668\u91CD\u542F\u540E\uFF0CChrome \u53EF\u80FD\u4F1A\u8BF7\u4F60\u518D\u70B9\u4E00\u6B21\u300C\u6062\u590D\u81EA\u52A8\u4FDD\u5B58\u300D\uFF1B\u6388\u6743\u65F6\u9009\u300C\u6BCF\u6B21\u8BBF\u95EE\u65F6\u90FD\u5141\u8BB8\u300D\u5C31\u4E0D\u7528\u6BCF\u6B21\u70B9\u4E86\u3002</div>`;
}
function renderDiskUi() {
  const card = document.getElementById("diskCard");
  if (card) card.innerHTML = diskCardHtml();
  let bar = document.getElementById("diskBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "diskBar";
    bar.style.cssText = "padding:0 14px 10px;font-size:12px";
    const bottom = document.querySelector(".side .bottom");
    bottom.parentNode.insertBefore(bar, bottom);
  }
  if (diskState === "ok") bar.innerHTML = `<span class="muted">\u{1F4BE} \u81EA\u52A8\u4FDD\u5B58\u5230\u300C${esc(dirHandle.name)}\u300D${lastDiskSave ? " \u2713" : ""}</span>`;
  else if (diskState === "needPermission" || diskState === "error") bar.innerHTML = '<button class="primary small" style="width:100%" data-disk="regrant">\u{1F4BE} \u70B9\u8FD9\u91CC\u6062\u590D\u81EA\u52A8\u4FDD\u5B58\u5230\u7535\u8111</button>';
  else if (diskState === "none") bar.innerHTML = '<button class="small" style="width:100%" data-disk="gosettings">\u{1F4BE} \u8BBE\u7F6E\u81EA\u52A8\u4FDD\u5B58\u5230\u7535\u8111</button>';
  else bar.innerHTML = "";
}
async function importBackup(file) {
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch (e) {
    return alert("\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F AI \u5706\u684C\u7684\u5907\u4EFD\u3002");
  }
  if (!data || !Array.isArray(data.sessions)) return alert("\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F AI \u5706\u684C\u7684\u5907\u4EFD\u3002");
  const have = new Set(sessions.map((s) => s.id));
  const add = data.sessions.filter((s) => s && s.id && !have.has(s.id));
  sessions.push(...add);
  const cur = LS.get("profile", "");
  if (data.profile && data.profile !== cur && (!cur || confirm("\u7528\u5907\u4EFD\u91CC\u7684\u80CC\u666F\u6863\u6848\u66FF\u6362\u73B0\u5728\u7684\u5417\uFF1F\n\n\u5907\u4EFD\u91CC\u7684\uFF1A\n" + data.profile.slice(0, 200)))) LS.set("profile", data.profile);
  if (data.customSites) {
    customSites = { ...data.customSites, ...customSites };
    LS.set("customSites", customSites);
  }
  if (data.siteOverrides) {
    siteOverrides = { ...data.siteOverrides, ...siteOverrides };
    LS.set("siteOverrides", siteOverrides);
  }
  if (data.lastDebate && !LS.get("lastDebate", null)) LS.set("lastDebate", data.lastDebate);
  saveSessions();
  renderHistory();
  alert(`\u5BFC\u5165\u5B8C\u6210\uFF1A\u65B0\u589E ${add.length} \u6761\u8BA8\u8BBA\u8BB0\u5F55${data.sessions.length - add.length ? `\uFF08\u53E6\u6709 ${data.sessions.length - add.length} \u6761\u5DF2\u7ECF\u5B58\u5728\uFF0C\u8DF3\u8FC7\uFF09` : ""}\u3002`);
  if (!current()) renderSettings();
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-disk]");
  if (!b) return;
  const act = b.dataset.disk;
  if (act === "gosettings") {
    currentId = null;
    renderHistory();
    return renderSettings();
  }
  if (act === "pick") {
    try {
      dirHandle = await window.showDirectoryPicker({ id: "ai-roundtable", mode: "readwrite" });
      await KV.set("dir", dirHandle);
      Object.keys(written).forEach((k) => delete written[k]);
      diskState = "ok";
      await saveToDisk();
    } catch (err) {
      if (err.name !== "AbortError") alert("\u9009\u62E9\u6587\u4EF6\u5939\u5931\u8D25\uFF1A" + err.message);
    }
    return renderDiskUi();
  }
  if (act === "regrant" && dirHandle) {
    try {
      const p = await dirHandle.requestPermission({ mode: "readwrite" });
      if (p === "granted") {
        diskState = "ok";
        await saveToDisk();
      }
    } catch (err) {
      alert(err.message);
    }
    return renderDiskUi();
  }
  if (act === "now") {
    Object.keys(written).forEach((k) => delete written[k]);
    return saveToDisk();
  }
  if (act === "import") document.getElementById("importFile").click();
});
document.addEventListener("change", (e) => {
  if (e.target.id === "importFile" && e.target.files[0]) {
    importBackup(e.target.files[0]);
    e.target.value = "";
  }
});
var UPDATE_BASE = "https://raw.githubusercontent.com/xmyqy1/ai-roundtable/main/";
const CUR_VERSION = window.chrome && chrome.runtime && chrome.runtime.getManifest ? chrome.runtime.getManifest().version : "0";
var updateInfo = null;
var updateMsg = "";
var updating = false;
function newerThan(a, b) {
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  }
  return false;
}
async function checkUpdate(manual) {
  if (manual) {
    updateMsg = "\u6B63\u5728\u68C0\u67E5\u2026";
    renderUpdateUi();
  }
  try {
    const r = await fetch(UPDATE_BASE + "version.json?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) throw new Error("\u8BFB\u53D6\u65B0\u7248\u672C\u4FE1\u606F\u5931\u8D25\uFF08" + r.status + "\uFF09");
    const info = await r.json();
    if (newerThan(info.version, CUR_VERSION)) {
      updateInfo = info;
      updateMsg = "";
    } else {
      updateInfo = null;
      updateMsg = manual ? `\u5DF2\u7ECF\u662F\u6700\u65B0\u7248\uFF08${CUR_VERSION}\uFF09` : "";
    }
  } catch (e) {
    if (manual) updateMsg = "\u68C0\u67E5\u5931\u8D25\uFF1A" + e.message;
  }
  renderUpdateUi();
}
async function getInstallDir() {
  let dir = await KV.get("installDir");
  if (dir) {
    let p = await dir.queryPermission({ mode: "readwrite" });
    if (p !== "granted") p = await dir.requestPermission({ mode: "readwrite" });
    if (p === "granted") return dir;
  }
  alert("\u7B2C\u4E00\u6B21\u66F4\u65B0\u9700\u8981\u4F60\u9009\u4E00\u4E0B\u63D2\u4EF6\u6240\u5728\u7684\u6587\u4EF6\u5939\uFF08\u5C31\u662F\u5F53\u521D\u300C\u52A0\u8F7D\u5DF2\u89E3\u538B\u7684\u6269\u5C55\u7A0B\u5E8F\u300D\u65F6\u9009\u7684\u90A3\u4E2A\uFF0C\u91CC\u9762\u6709 manifest.json\uFF09\uFF0C\u5E76\u5141\u8BB8\u4FEE\u6539\u3002\u4E4B\u540E\u5C31\u4E0D\u7528\u518D\u9009\u4E86\u3002");
  dir = await window.showDirectoryPicker({ id: "ai-roundtable-install", mode: "readwrite" });
  const isExt = async (d) => {
    try {
      const t = await (await (await d.getFileHandle("manifest.json")).getFile()).text();
      return t.includes("AI \u5706\u684C");
    } catch (e) {
      return false;
    }
  };
  if (!await isExt(dir)) {
    let found = null;
    for await (const [, h] of dir.entries()) if (h.kind === "directory" && await isExt(h)) {
      found = h;
      break;
    }
    if (!found) throw new Error("\u8FD9\u4E2A\u6587\u4EF6\u5939\u91CC\u6CA1\u627E\u5230 AI \u5706\u684C\u63D2\u4EF6\uFF08manifest.json\uFF09\u3002\u8BF7\u9009\u63D2\u4EF6\u6240\u5728\u7684\u6587\u4EF6\u5939\u3002");
    dir = found;
  }
  await KV.set("installDir", dir);
  return dir;
}
async function doUpdate() {
  if (!updateInfo || updating) return;
  if (running) return alert("\u6709\u8BA8\u8BBA\u6B63\u5728\u8FDB\u884C\uFF0C\u7B49\u5B83\u7ED3\u675F\u540E\u518D\u66F4\u65B0\u3002");
  updating = true;
  updateMsg = "\u6B63\u5728\u4E0B\u8F7D\u65B0\u7248\u2026";
  renderUpdateUi();
  try {
    const dir = await getInstallDir();
    const files = {};
    for (const f of updateInfo.files) {
      const r = await fetch(UPDATE_BASE + f + "?v=" + updateInfo.version, { cache: "no-store" });
      if (!r.ok) throw new Error(`\u4E0B\u8F7D ${f} \u5931\u8D25\uFF08${r.status}\uFF09`);
      files[f] = await r.text();
    }
    files["version.json"] = JSON.stringify(updateInfo, null, 1);
    updateMsg = "\u6B63\u5728\u66FF\u6362\u6587\u4EF6\u2026";
    renderUpdateUi();
    const order = Object.keys(files).sort((x, y) => (x === "manifest.json") - (y === "manifest.json"));
    for (const f of order) {
      const parts = f.split("/");
      let d = dir;
      for (const p of parts.slice(0, -1)) d = await d.getDirectoryHandle(p, { create: true });
      const fh = await d.getFileHandle(parts[parts.length - 1], { create: true });
      const w = await fh.createWritable();
      await w.write(files[f]);
      await w.close();
    }
    updateMsg = `\u5DF2\u66F4\u65B0\u5230 ${updateInfo.version}\uFF0C\u6B63\u5728\u91CD\u542F\u63D2\u4EF6\u2026`;
    renderUpdateUi();
    await sleep(800);
    chrome.runtime.reload();
  } catch (e) {
    updating = false;
    updateMsg = e.name === "AbortError" ? "" : "\u66F4\u65B0\u5931\u8D25\uFF1A" + e.message;
    renderUpdateUi();
  }
}
function updateCardHtml() {
  return `<b>\u{1F504} \u63D2\u4EF6\u66F4\u65B0</b> <span class="muted">\u5F53\u524D\u7248\u672C ${esc(CUR_VERSION)}</span>
    ${updateInfo ? `<div style="margin:8px 0">\u6709\u65B0\u7248\u672C <b>${esc(updateInfo.version)}</b>\uFF1A${esc(updateInfo.notes || "")}</div>` : ""}
    <div class="muted" style="margin:6px 0">${esc(updateMsg)}</div>
    <div class="row" style="justify-content:flex-start">
      ${updateInfo ? `<button class="primary fit" data-upd="go" ${updating ? "disabled" : ""}>\u4E00\u952E\u66F4\u65B0</button>` : ""}
      <button class="fit" data-upd="check">\u68C0\u67E5\u66F4\u65B0</button></div>
    <div class="muted" style="margin-top:8px">\u7B2C\u4E00\u6B21\u66F4\u65B0\u65F6\u8981\u9009\u4E00\u4E0B\u63D2\u4EF6\u6240\u5728\u7684\u6587\u4EF6\u5939\u5E76\u5141\u8BB8\u4FEE\u6539\uFF1B\u66F4\u65B0\u4F1A\u81EA\u52A8\u4E0B\u8F7D\u3001\u66FF\u6362\u6587\u4EF6\u5E76\u91CD\u542F\u63D2\u4EF6\uFF0C\u8BA8\u8BBA\u8BB0\u5F55\u4E0D\u53D7\u5F71\u54CD\u3002</div>`;
}
function renderUpdateUi() {
  const card = document.getElementById("updCard");
  if (card) card.innerHTML = updateCardHtml();
  let bar = document.getElementById("updBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "updBar";
    bar.style.cssText = "padding:0 14px 10px";
    const bottom = document.querySelector(".side .bottom");
    bottom.parentNode.insertBefore(bar, bottom);
  }
  bar.innerHTML = updateInfo ? `<button class="primary small" style="width:100%" data-upd="go">\u{1F504} \u6709\u65B0\u7248 ${esc(updateInfo.version)}\uFF0C\u70B9\u8FD9\u91CC\u66F4\u65B0</button>${updateMsg ? `<div class="muted" style="font-size:12px;margin-top:4px">${esc(updateMsg)}</div>` : ""}` : "";
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-upd]");
  if (!b) return;
  if (b.dataset.upd === "check") checkUpdate(true);
  else doUpdate();
});
const broken = [...sessions].sort((a, b) => b.createdAt - a.createdAt).find((s) => s.interrupted);
for (const s of sessions) if (s.interrupted) {
  s.interrupted = false;
  s.notice = "\u8FD9\u6B21\u8BA8\u8BBA\u5728\u8FDB\u884C\u4E2D\u88AB\u4E2D\u65AD\u4E86\uFF08\u9875\u9762\u5237\u65B0\u6216\u63D2\u4EF6\u66F4\u65B0\uFF09\uFF0C\u524D\u9762\u7684\u5185\u5BB9\u90FD\u4FDD\u5B58\u7740\u3002\u5728\u5E95\u90E8\u5199\u8865\u5145\u8BF4\u660E\uFF08\u53EF\u9009\uFF09\uFF0C\u70B9\u300C\u7EE7\u7EED\u8BA8\u8BBA\u300D\u5C31\u80FD\u63A5\u7740\u8BA8\u8BBA\uFF1B\u5404\u4E2A AI \u4F1A\u5728\u65B0\u5BF9\u8BDD\u91CC\u6536\u5230\u5B8C\u6574\u8BB0\u5F55\u3002";
}
saveSessions();
if (broken) currentId = broken.id;
renderHistory();
initDisk();
if (broken) renderSession();
else if (!LS.get("seenIntro", false)) {
  LS.set("seenIntro", true);
  renderSettings();
} else renderNewDebate();
setTimeout(() => checkUpdate(false), 1500);
