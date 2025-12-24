/* 幸福 CEO｜m1.1（CodePen 一檔版）— 完整修正版 JS v3.2.2

✅ 手機穩版修正：

- 不用 replaceAll / ?. / padStart

- 補 matches()/closest() polyfill（避免部分手機 WebView 爆）

- href 一律改單引號 + escapeAttr（避免手機編輯器把 " 切斷）

- 24 小時制：永遠顯示/儲存 HH:MM（自動補 0）

*/

(function () {

"use strict";

// ======= polyfill：matches / closest (for older WebView) =======

(function () {

if (!Element.prototype.matches) {

Element.prototype.matches =

Element.prototype.msMatchesSelector ||

Element.prototype.webkitMatchesSelector ||

function (s) {

var matches = (this.document || this.ownerDocument).querySelectorAll(s);

var i = matches.length;

while (--i >= 0 && matches.item(i) !== this) {}

return i > -1;

};

}

if (!Element.prototype.closest) {

Element.prototype.closest = function (s) {

var el = this;

while (el && el.nodeType === 1) {

if (el.matches && el.matches(s)) return el;

el = el.parentElement || el.parentNode;

}

return null;

};

}

})();

// ========= 基本工具 =========

function $(sel) {

return document.querySelector(sel);

}

var LS = {

state: "hceo_m1_state_v32",

inv: "hceo_m1_inv_v32",

tpl: "hceo_m1_tpl_v32",

wt: "hceo_m1_webtools_v32",

};

function safeTrim(v) {

return String(v == null ? "" : v).trim();

}

function replaceAllSafe(str, find, rep) {

return String(str).split(find).join(rep);

}

function escapeHtml(s) {

var x = String(s == null ? "" : s);

x = replaceAllSafe(x, "&", "&amp;");

x = replaceAllSafe(x, "<", "&lt;");

x = replaceAllSafe(x, ">", "&gt;");

x = replaceAllSafe(x, '"', "&quot;");

x = replaceAllSafe(x, "'", "&#39;");

return x;

}

function escapeAttr(s) {

var x = escapeHtml(s);

x = replaceAllSafe(x, "\r\n", "\n");

x = replaceAllSafe(x, "\n", "&#10;");

return x;

}

function isValidUrl(u) {

try {

var url = new URL(u);

return url.protocol === "http:" || url.protocol === "https:";

} catch (e) {

return false;

}

}

function pad2(n) {

n = String(n);

return n.length === 1 ? "0" + n : n;

}

function todayISO(d) {

d = d || new Date();

return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());

}

// ✅ 永遠顯示/儲存 24 小時制 HH:MM（自動補 0）

function formatTime24(t) {

var v = safeTrim(t);

if (!v) return "";

if (/^\d{2}:\d{2}$/.test(v)) return v;

var m = v.match(/^(\d{1,2}):(\d{2})$/); // 7:05 → 07:05

if (m) return pad2(m[1]) + ":" + m[2];

var n = replaceAllSafe(v, ":", "");

if (/^\d{3,4}$/.test(n)) {

var hh = n.length === 3 ? n.slice(0, 1) : n.slice(0, 2);

var mm = n.slice(-2);

if (Number(mm) <= 59) return pad2(hh) + ":" + pad2(mm);

}

return v;

}

function uid() {

return "id_" + Date.now() + "_" + Math.random().toString(16).slice(2);

}

function load(key, fallback) {

try {

var raw = localStorage.getItem(key);

if (!raw) return fallback;

return JSON.parse(raw);

} catch (e) {

return fallback;

}

}

function save(key, value) {

localStorage.setItem(key, JSON.stringify(value));

}

// ========= 複製 =========

var copyModal = $("#copyModal");

var copyBox = $("#copyBox");

var btnCloseCopy = $("#btnCloseCopy");

function openCopyModal(text) {

if (!copyModal || !copyBox) return;

copyBox.value = String(text == null ? "" : text);

copyModal.style.display = "flex";

}

function copyText(text) {

var s = String(text == null ? "" : text);

if (navigator.clipboard && navigator.clipboard.writeText) {

return navigator.clipboard

.writeText(s)

.then(function () { return true; })

.catch(function () {

openCopyModal(s);

return false;

});

} else {

openCopyModal(s);

return Promise.resolve(false);

}

}

if (btnCloseCopy) {

btnCloseCopy.addEventListener("click", function () {

if (copyModal) copyModal.style.display = "none";

});

}

// ========= DOM =========

var todayText = $("#todayText");

var actionsText = $("#actionsText");

var btnAddAction = $("#btnAddAction");

var btnResetToday = $("#btnResetToday");

// inventory inputs

var invTypeEl = $("#invType");

var invPlatformEl = $("#invPlatform");

var invTitleEl = $("#invTitle");

var invLinkEl = $("#invLink");

var invTimeEl = $("#invTime");

var invSeriesEl = $("#invSeries");

var invDateEl = $("#invDate");

var invIntroEl = $("#invIntro");

var btnInvAdd = $("#btnInvAdd");

// inventory filters

var invViewEl = $("#invView");

var invStatusEl = $("#invStatus");

var invKindEl = $("#invKind");

var invSeriesFilterEl = $("#invSeriesFilter");

var rangeBox = $("#rangeBox");

var invFromEl = $("#invFrom");

var invToEl = $("#invTo");

var btnOnlyTodo = $("#btnOnlyTodo");

var btnShowAll = $("#btnShowAll");

var invListEl = $("#invList");

// tools chips

var toolNameEl = $("#toolName");

var toolUrlEl = $("#toolUrl");

var btnToolAdd = $("#btnToolAdd");

var toolChipsEl = $("#toolChips");

// templates

var tplQuickSelect = $("#tplQuickSelect");

var btnTplManage = $("#btnTplManage");

var tplPanel = $("#tplPanel");

var btnTplClose = $("#btnTplClose");

var tplNameEl = $("#tplName");

var tplBodyEl = $("#tplBody");

var btnTplClear = $("#btnTplClear");

var btnTplSave = $("#btnTplSave");

var tplListEl = $("#tplList");

var btnTplApply = $("#btnTplApply");

// daily

var promptBox = $("#promptBox");

var todayActions = $("#todayActions");

var dontBox = $("#dontBox");

// web tools library (wt*)

var wtKindEl = $("#wtKind");

var wtTitleEl = $("#wtTitle");

var wtUrlEl = $("#wtUrl");

var wtTagsEl = $("#wtTags");

var wtNoteEl = $("#wtNote");

var btnWtAdd = $("#btnWtAdd");

var wtListEl = $("#wtList");

// ========= 狀態 =========

var now = new Date();

var tdy = todayISO(now);

var state = load(LS.state, { lastDate: tdy, actions: 0 });

if (state.lastDate !== tdy) {

state.lastDate = tdy;

state.actions = 0;

save(LS.state, state);

}

// inventory

var inv = load(LS.inv, []);

if (!Array.isArray(inv)) inv = [];

for (var i0 = 0; i0 < inv.length; i0++) inv[i0].time = formatTime24(inv[i0].time || "");

save(LS.inv, inv);

// pending tools

var pendingTools = [];

// templates

var tpls = load(LS.tpl, []);

if (!Array.isArray(tpls)) tpls = [];

if (!tpls.length) {

tpls = [

{

id: uid(),

name: "YT-標準版｜含工具",

body:

"【{{title}}】\n" +

"📅 {{date}} {{time}}\n" +

"系列：{{series}}\n" +

"連結：{{link}}\n\n" +

"【介紹】\n" +

"{{intro}}\n\n" +

"【附贈工具】\n" +

"{{tools}}",

createdAt: Date.now(),

},

{

id: uid(),

name: "社團貼文｜溫暖版",

body:

"今天想分享：{{title}}\n" +

"📅 {{date}} {{time}}\n" +

"（{{series}}）\n\n" +

"{{intro}}\n\n" +

"🔧 這裡有附贈工具（可收藏起來慢慢用）\n" +

"{{tools}}",

createdAt: Date.now(),

},

];

save(LS.tpl, tpls);

}

// web tools

var wt = load(LS.wt, []);

if (!Array.isArray(wt)) wt = [];

// ========= 今日顯示 =========

function renderTop() {

if (todayText) todayText.textContent = tdy;

if (actionsText) actionsText.textContent = String(state.actions || 0);

}

// ========= 今日內容 =========

var PROMPTS = [

"先讓自己站穩，關係就會慢慢回到軟的位置。",

"你不用完美，只要今天比昨天更能呼吸。",

"散播歡樂散播愛，從一個小小穩定開始。",

"知足常樂不是停下來，而是少一點拉扯、多一點安住。",

"自得其樂，是你願意把心放回自己手上。",

];

function hash(s) {

var h = 0;

for (var i = 0; i < s.length; i++) {

h = (h << 5) - h + s.charCodeAt(i);

h |= 0;

}

return h;

}

function renderDailyCare() {

var idx = Math.abs(hash(tdy)) % PROMPTS.length;

if (promptBox) promptBox.textContent = PROMPTS[idx];

var list = [

"把今天要做的一件事縮小：做到『可完成』就好",

"庫存至少新增 1 筆（或把一筆補上日期/時間）",

"存一個你會用到的資源到『網路工具存放庫』",

];

if (todayActions) {

var li = "";

for (var j = 0; j < list.length; j++) li += "<li>" + escapeHtml(list[j]) + "</li>";

todayActions.innerHTML = li;

}

if (dontBox) dontBox.textContent = "今天不用逼自己衝刺：不用一次解決全部、不用把每件事都做到 100 分。";

}

// ========= 今日行動 =========

if (btnAddAction) {

btnAddAction.addEventListener("click", function () {

var text = prompt("記一個行動（例：排程、補上介紹、存工具連結）");

if (text == null) return;

state.actions = (state.actions || 0) + 1;

save(LS.state, state);

renderTop();

});

}

if (btnResetToday) {

btnResetToday.addEventListener("click", function () {

if (!confirm("確定要重設今日行動數？")) return;

state.actions = 0;

state.lastDate = tdy;

save(LS.state, state);

renderTop();

});

}

// ========= 工具 chips =========

function renderToolChips() {

if (!toolChipsEl) return;

if (!pendingTools.length) {

toolChipsEl.innerHTML = '<div class="soft">(尚未加入工具)</div>';

return;

}

var html = "";

for (var i = 0; i < pendingTools.length; i++) {

var n = escapeHtml(pendingTools[i].name || "工具");

html +=

'<span class="toolChip">🔧 ' +

n +

' <button type="button" data-act="rmTool" data-idx="' +

i +

'">×</button></span>';

}

toolChipsEl.innerHTML = html;

}

if (toolChipsEl) {

toolChipsEl.addEventListener("click", function (e) {

var btn = e.target.closest("button[data-act='rmTool']");

if (!btn) return;

var idx = Number(btn.getAttribute("data-idx"));

if (!isFinite(idx)) return;

pendingTools.splice(idx, 1);

renderToolChips();

});

}

if (btnToolAdd) {

btnToolAdd.addEventListener("click", function () {

var n = safeTrim(toolNameEl ? toolNameEl.value : "");

var u = safeTrim(toolUrlEl ? toolUrlEl.value : "");

if (!n && !u) return;

pendingTools.push({ name: n || "工具", url: u });

if (toolNameEl) toolNameEl.value = "";

if (toolUrlEl) toolUrlEl.value = "";

renderToolChips();

});

}

// ========= invTime 正規 =========

function normalizeInvTime() {

if (!invTimeEl) return;

invTimeEl.value = formatTime24(invTimeEl.value);

}

if (invTimeEl) {

invTimeEl.addEventListener("input", function () {

var v = replaceAllSafe(invTimeEl.value, " ", "");

if (/^\d{3,4}$/.test(v)) {

invTimeEl.value = formatTime24(v);

return;

}

if (v.length >= 4 && v.indexOf(":") >= 0) invTimeEl.value = formatTime24(v);

});

invTimeEl.addEventListener("blur", normalizeInvTime);

invTimeEl.addEventListener("change", normalizeInvTime);

}

// ========= 庫存新增 =========

if (btnInvAdd) {

btnInvAdd.addEventListener("click", function () {

var title = safeTrim(invTitleEl ? invTitleEl.value : "");

if (!title) return alert("請先填：預計發布內容名稱");

var it = {

id: uid(),

kind: invTypeEl ? invTypeEl.value : "video",

platform: invPlatformEl ? invPlatformEl.value : "YouTube",

title: title,

link: safeTrim(invLinkEl ? invLinkEl.value : ""),

time: formatTime24(invTimeEl ? invTimeEl.value : "16:00") || "16:00",

series: invSeriesEl ? invSeriesEl.value : "其他",

date: safeTrim(invDateEl ? invDateEl.value : ""),

intro: safeTrim(invIntroEl ? invIntroEl.value : ""),

tools: pendingTools.slice(),

status: "todo",

createdAt: Date.now(),

};

inv.unshift(it);

save(LS.inv, inv);

if (invTitleEl) invTitleEl.value = "";

if (invLinkEl) invLinkEl.value = "";

if (invIntroEl) invIntroEl.value = "";

pendingTools = [];

renderToolChips();

renderInv();

});

}

// ========= 篩選 =========

function withinRange(d, from, to) {

if (!d) return false;

if (from && d < from) return false;

if (to && d > to) return false;

return true;

}

function invTs(it) {

var d = safeTrim(it.date);

if (!d) return 9999999999999;

var t = formatTime24(it.time || "00:00") || "00:00";

var dt = new Date(d + "T" + t + ":00");

var ts = dt.getTime();

return isFinite(ts) ? ts : 9999999999999;

}

function getFilteredInv() {

var list = inv.slice();

var view = invViewEl ? invViewEl.value : "all";

if (view === "today") {

list = list.filter(function (x) { return safeTrim(x.date) === tdy; });

} else if (view === "week" || view === "next7") {

var from = tdy;

var toDate = new Date();

toDate.setDate(toDate.getDate() + 6);

var to = todayISO(toDate);

list = list.filter(function (x) {

return withinRange(safeTrim(x.date), from, to);

});

} else if (view === "range") {

var rf = safeTrim(invFromEl ? invFromEl.value : "");

var rt = safeTrim(invToEl ? invToEl.value : "");

list = list.filter(function (x) {

return withinRange(safeTrim(x.date), rf, rt);

});

}

var st = invStatusEl ? invStatusEl.value : "all";

if (st !== "all") list = list.filter(function (x) { return x.status === st; });

var kd = invKindEl ? invKindEl.value : "all";

if (kd !== "all") list = list.filter(function (x) { return x.kind === kd; });

var sf = invSeriesFilterEl ? invSeriesFilterEl.value : "all";

if (sf !== "all") list = list.filter(function (x) { return x.series === sf; });

list.sort(function (a, b) {

var ta = invTs(a);

var tb = invTs(b);

if (ta !== tb) return ta - tb;

return (b.createdAt || 0) - (a.createdAt || 0);

});

return list;

}

function statusLabel(s) {

if (s === "todo") return "待發";

if (s === "done") return "已發";

return "延後";

}

function kindLabel(k) {

return k === "video" ? "影片" : "貼文";

}

// ========= 模板：套用與複製 =========

function toolsText(it) {

if (!it.tools || !it.tools.length) return "（無）";

var out = [];

for (var i = 0; i < it.tools.length; i++) {

var name = safeTrim(it.tools[i].name) || "工具";

var url = safeTrim(it.tools[i].url);

out.push(url ? "- " + name + "：" + url : "- " + name);

}

return out.join("\n");

}

function applyTemplate(tplBody, it) {

var map = {

title: it.title || "",

date: it.date || "",

time: formatTime24(it.time || ""),

series: it.series || "",

platform: it.platform || "",

kind: kindLabel(it.kind),

link: it.link || "",

intro: it.intro || "",

tools: toolsText(it),

};

return String(tplBody || "").replace(/\{\{(\w+)\}\}/g, function (_, k) {

return map[k] == null ? "" : map[k];

});

}

function getSelectedTpl() {

var selId = tplQuickSelect ? tplQuickSelect.value : "";

for (var i = 0; i < tpls.length; i++) if (tpls[i].id === selId) return tpls[i];

return null;

}

if (btnTplApply) {

btnTplApply.addEventListener("click", function () {

var tpl = getSelectedTpl();

if (!tpl) return alert("請先選一個模板");

var it = {

kind: invTypeEl ? invTypeEl.value : "video",

platform: invPlatformEl ? invPlatformEl.value : "YouTube",

title: safeTrim(invTitleEl ? invTitleEl.value : ""),

link: safeTrim(invLinkEl ? invLinkEl.value : ""),

time: formatTime24(invTimeEl ? invTimeEl.value : "16:00") || "16:00",

series: invSeriesEl ? invSeriesEl.value : "其他",

date: safeTrim(invDateEl ? invDateEl.value : ""),

intro: safeTrim(invIntroEl ? invIntroEl.value : ""),

tools: pendingTools.slice(),

};

if (!it.title) return alert("請先填：預計發布內容名稱（才能套用模板）");

var text = applyTemplate(tpl.body, it);

copyText(text);

});

}

// ========= 庫存渲染 =========

function renderInv() {

if (!invListEl) return;

var list = getFilteredInv();

var view = invViewEl ? invViewEl.value : "all";

if (rangeBox) rangeBox.style.display = view === "range" ? "flex" : "none";

if (!list.length) {

invListEl.innerHTML = '<div class="soft">（目前沒有符合條件的庫存項目）</div>';

return;

}

var html = "";

for (var i = 0; i < list.length; i++) {

var it = list[i];

var dt = it.date

? escapeHtml(it.date) + " " + escapeHtml(formatTime24(it.time || ""))

: '<span class="soft">(未填日期)</span>';

// ✅ href 改單引號

var linkLine =

it.link && isValidUrl(it.link)

? "<a class='invLink' href='" + escapeAttr(it.link) + "' target='_blank' rel='noopener'>開啟主連結</a>"

: '<span class="soft">(無主連結)</span>';

var introLine = it.intro

? '<div class="invIntro">' + escapeHtml(it.intro) + "</div>"

: '<div class="soft">(無介紹)</div>';

var toolsHtml = "";

if (it.tools && it.tools.length) {

toolsHtml += '<div class="invTools">';

for (var j = 0; j < it.tools.length; j++) {

var t = it.tools[j];

var n = escapeHtml(t.name || "工具");

var u = safeTrim(t.url);

// ✅ href 改單引號

var a =

u && isValidUrl(u)

? "<a class='invLink' href='" + escapeAttr(u) + "' target='_blank' rel='noopener'>開啟</a>"

: '<span class="soft">(無連結)</span>';

toolsHtml += '<div class="toolItem">🔧 ' + n + " " + a + "</div>";

}

toolsHtml += "</div>";

} else {

toolsHtml = '<div class="soft">(尚未加入工具)</div>';

}

html +=

"<div class='invCard' data-id='" +

escapeAttr(it.id) +

"'>" +

"<div class='invTop'><div class='invMeta'>" +

"<span class='badge'>" +

escapeHtml(kindLabel(it.kind)) +

"</span>" +

"<span class='badge'>" +

escapeHtml(it.platform || "") +

"</span>" +

"<span class='badge'>" +

escapeHtml(it.series || "") +

"</span>" +

"<span class='badge'>" +

escapeHtml(statusLabel(it.status)) +

"</span>" +

"<div class='invTitle'>" +

escapeHtml(it.title) +

"</div>" +

"<div class='invRow'>⏰ " +

dt +

"</div>" +

"<div class='invRow'>🔗 " +

linkLine +

"</div>" +

"</div></div>" +

introLine +

toolsHtml +

"<div class='invLinks'>" +

"<button type='button' class='invBtn' data-act='status' data-to='todo'>待發</button>" +

"<button type='button' class='invBtn' data-act='status' data-to='done'>已發</button>" +

"<button type='button' class='invBtn' data-act='status' data-to='delay'>延後</button>" +

"<button type='button' class='invBtn primary' data-act='copy'>套用模板→複製</button>" +

"<button type='button' class='invBtn' data-act='del'>刪除</button>" +

"</div>" +

"</div>";

}

invListEl.innerHTML = html;

}

if (invListEl) {

invListEl.addEventListener("click", function (e) {

var card = e.target.closest(".invCard");

if (!card) return;

var id = card.getAttribute("data-id");

var it = null;

for (var i = 0; i < inv.length; i++) {

if (inv[i].id === id) { it = inv[i]; break; }

}

if (!it) return;

var actBtn = e.target.closest("[data-act]");

if (!actBtn) return;

var act = actBtn.getAttribute("data-act");

if (act === "status") {

it.status = actBtn.getAttribute("data-to");

save(LS.inv, inv);

renderInv();

return;

}

if (act === "del") {

if (!confirm("確定要刪除這筆庫存？")) return;

inv = inv.filter(function (x) { return x.id !== id; });

save(LS.inv, inv);

renderInv();

return;

}

if (act === "copy") {

var tpl = getSelectedTpl();

if (!tpl) return alert("請先在『模板』下拉選一個模板");

it.time = formatTime24(it.time || "");

save(LS.inv, inv);

var text = applyTemplate(tpl.body, it);

copyText(text);

return;

}

});

}

function bindChange(el, fn) {

if (!el) return;

el.addEventListener("change", fn);

}

bindChange(invViewEl, renderInv);

bindChange(invStatusEl, renderInv);

bindChange(invKindEl, renderInv);

bindChange(invSeriesFilterEl, renderInv);

if (invFromEl) {

invFromEl.addEventListener("change", renderInv);

invFromEl.addEventListener("input", renderInv);

}

if (invToEl) {

invToEl.addEventListener("change", renderInv);

invToEl.addEventListener("input", renderInv);

}

if (btnOnlyTodo) {

btnOnlyTodo.addEventListener("click", function () {

if (invStatusEl) invStatusEl.value = "todo";

renderInv();

});

}

if (btnShowAll) {

btnShowAll.addEventListener("click", function () {

if (invViewEl) invViewEl.value = "all";

if (invStatusEl) invStatusEl.value = "all";

if (invKindEl) invKindEl.value = "all";

if (invSeriesFilterEl) invSeriesFilterEl.value = "all";

if (rangeBox) rangeBox.style.display = "none";

renderInv();

});

}

// ========= 模板管理（簡化） =========

function renderTplQuick() {

if (!tplQuickSelect) return;

var sorted = tpls.slice().sort(function (a, b) {

return (b.createdAt || 0) - (a.createdAt || 0);

});

var opt = "";

for (var i = 0; i < sorted.length; i++) {

opt += "<option value='" + escapeAttr(sorted[i].id) + "'>" + escapeHtml(sorted[i].name) + "</option>";

}

tplQuickSelect.innerHTML = opt;

if (!tplQuickSelect.value && sorted.length) tplQuickSelect.value = sorted[0].id;

}

function renderTplList() {

if (!tplListEl) return;

if (!tpls.length) {

tplListEl.innerHTML = '<div class="soft">（尚無模板）</div>';

return;

}

var sorted = tpls.slice().sort(function (a, b) {

return (b.createdAt || 0) - (a.createdAt || 0);

});

var html = "";

for (var i = 0; i < sorted.length; i++) {

var t = sorted[i];

html +=

"<div class='tplItem' data-id='" +

escapeAttr(t.id) +

"'>" +

"<div style='display:flex;justify-content:space-between;gap:8px;align-items:center;'>" +

"<div><div style='font-weight:bold;'>" +

escapeHtml(t.name) +

"</div></div>" +

"<div style='display:flex;gap:6px;'>" +

"<button type='button' class='chipBtn' data-act='useTpl'>設為快選</button>" +

"<button type='button' class='chipBtn ghost' data-act='delTpl'>刪除</button>" +

"</div>" +

"</div>" +

"<pre>" +

escapeHtml(t.body || "") +

"</pre>" +

"</div>";

}

tplListEl.innerHTML = html;

}

if (btnTplManage) {

btnTplManage.addEventListener("click", function () {

if (!tplPanel) return;

tplPanel.style.display = tplPanel.style.display === "none" ? "block" : "none";

renderTplList();

});

}

if (btnTplClose) {

btnTplClose.addEventListener("click", function () {

if (tplPanel) tplPanel.style.display = "none";

});

}

if (btnTplClear) {

btnTplClear.addEventListener("click", function () {

if (tplNameEl) tplNameEl.value = "";

if (tplBodyEl) tplBodyEl.value = "";

});

}

if (btnTplSave) {

btnTplSave.addEventListener("click", function () {

var name = safeTrim(tplNameEl ? tplNameEl.value : "");

var body = safeTrim(tplBodyEl ? tplBodyEl.value : "");

if (!name || !body) return alert("請填寫模板名稱與內容");

tpls.unshift({ id: uid(), name: name, body: body, createdAt: Date.now() });

save(LS.tpl, tpls);

renderTplQuick();

renderTplList();

if (tplNameEl) tplNameEl.value = "";

if (tplBodyEl) tplBodyEl.value = "";

});

}

if (tplListEl) {

tplListEl.addEventListener("click", function (e) {

var box = e.target.closest(".tplItem");

if (!box) return;

var id = box.getAttribute("data-id");

var t = null;

for (var i = 0; i < tpls.length; i++) {

if (tpls[i].id === id) { t = tpls[i]; break; }

}

if (!t) return;

var btn = e.target.closest("[data-act]");

if (!btn) return;

var act = btn.getAttribute("data-act");

if (act === "delTpl") {

if (!confirm("確定要刪除這個模板？")) return;

tpls = tpls.filter(function (x) { return x.id !== id; });

save(LS.tpl, tpls);

renderTplQuick();

renderTplList();

return;

}

if (act === "useTpl") {

if (tplQuickSelect) tplQuickSelect.value = id;

}

});

}

// ========= 網路工具存放庫（手機穩版） =========

function renderWt() {

if (!wtListEl) return;

if (!wt.length) {

wtListEl.innerHTML = '<div class="soft">尚未加入任何工具</div>';

return;

}

var html = "";

for (var i = 0; i < wt.length; i++) {

var x = wt[i] || {};

var kind = escapeHtml(x.kind || "");

var title = escapeHtml(x.title || "");

var url = String(x.url || "");

var urlShow = escapeHtml(url);

var tags = escapeHtml(x.tags || "");

var note = escapeHtml(x.note || "");

var urlOk = url && isValidUrl(url);

// ✅ href 改單引號

var openHtml = urlOk

? "<a class='invLink' href='" + escapeAttr(url) + "' target='_blank' rel='noopener'>開啟</a>"

: '<span class="soft">(無有效連結)</span>';

html +=

"<div class='webToolItem' data-idx='" +

i +

"'>" +

"<div class='webToolTitle'>" +

title +

" <span class='badge' style='margin-left:6px;'>" +

kind +

"</span>" +

"</div>" +

(tags ? "<div class='soft' style='margin-top:4px;'>🏷 " + tags + "</div>" : "") +

(note ? "<div class='webToolNote' style='margin-top:4px;'>" + note + "</div>" : "") +

"<div class='soft' style='margin-top:6px;word-break:break-word;'>" +

urlShow +

"</div>" +

"<div class='webToolActions'>" +

openHtml +

"<button type='button' class='invBtn' data-act='copyWt'>複製</button>" +

"<button type='button' class='invBtn' data-act='delWt'>刪除</button>" +

"</div>" +

"</div>";

}

wtListEl.innerHTML = html;

}

if (btnWtAdd) {

btnWtAdd.addEventListener("click", function () {

var kind = safeTrim(wtKindEl ? wtKindEl.value : "") || "其他";

var title = safeTrim(wtTitleEl ? wtTitleEl.value : "");

var url = safeTrim(wtUrlEl ? wtUrlEl.value : "");

var tags = safeTrim(wtTagsEl ? wtTagsEl.value : "");

var note = safeTrim(wtNoteEl ? wtNoteEl.value : "");

if (!title || !url) return alert("請填：名稱與 URL");

wt.unshift({ kind: kind, title: title, url: url, tags: tags, note: note, createdAt: Date.now() });

save(LS.wt, wt);

if (wtTitleEl) wtTitleEl.value = "";

if (wtUrlEl) wtUrlEl.value = "";

if (wtTagsEl) wtTagsEl.value = "";

if (wtNoteEl) wtNoteEl.value = "";

renderWt();

});

}

if (wtListEl) {

wtListEl.addEventListener("click", function (e) {

var item = e.target.closest(".webToolItem");

if (!item) return;

var idx = Number(item.getAttribute("data-idx"));

if (!isFinite(idx)) return;

var x = wt[idx];

if (!x) return;

var btn = e.target.closest("[data-act]");

if (!btn) return;

var act = btn.getAttribute("data-act");

if (act === "copyWt") {

copyText(x.url || "");

return;

}

if (act === "delWt") {

if (!confirm("確定要刪除這筆資源？")) return;

wt.splice(idx, 1);

save(LS.wt, wt);

renderWt();

}

});

}

// ========= 初始 =========

function initDefaults() {

if (invDateEl) invDateEl.value = tdy;

if (invTimeEl && !safeTrim(invTimeEl.value)) invTimeEl.value = "16:00";

normalizeInvTime();

if (invFromEl) invFromEl.value = tdy;

var to = new Date();

to.setDate(to.getDate() + 6);

if (invToEl) invToEl.value = todayISO(to);

renderToolChips();

if (rangeBox && invViewEl) rangeBox.style.display = invViewEl.value === "range" ? "flex" : "none";

}

function boot() {

save(LS.state, state);

renderTop();

renderDailyCare();

renderTplQuick();

renderTplList();

renderInv();

renderWt();

initDefaults();

}

boot();

})();

