/* ── D0RKER // app.js ── */

'use strict';

// ── Storage helpers (gracefully handles file:// protocol quirks) ──
const Store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  }
};

// ── State ──
let queryHistory = Store.get('dorker_history', []);
let queryCount   = Store.get('dorker_count',   0);
let currentEngine = 'google';

// ── Engine URL builders ──
const ENGINES = {
  google:     q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  bing:       q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
  duckduckgo: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  shodan:     q => `https://www.shodan.io/search?query=${encodeURIComponent(q)}`,
};

// ── Init ──
document.getElementById('queryCount').textContent = queryCount;
renderHistory();

// ── Engine select ──
function updateEngine() {
  currentEngine = document.getElementById('engineSelect').value;
  document.getElementById('engineLabel').textContent = currentEngine.toUpperCase();
}

// ── Build query from form fields ──
function buildQuery() {
  const target  = document.getElementById('targetInput').value.trim();
  const raw     = document.getElementById('rawInput').value.trim();
  const exclude = document.getElementById('excludeInput').value.trim();
  const phrase  = document.getElementById('phraseInput').value.trim();

  const parts = [];
  if (target)  parts.push(`site:${target}`);
  if (raw)     parts.push(raw);
  if (phrase)  parts.push(`"${phrase}"`);
  if (exclude) exclude.split(/\s+/).forEach(w => w && parts.push(`-${w}`));

  const q = parts.join(' ');
  const preview = document.getElementById('queryPreview');

  if (!q) {
    preview.className = 'query-preview query-empty';
    preview.innerHTML = 'build your dork above or select a template ←';
    return '';
  }

  // Syntax highlighting
  const hl = q
    .replace(/(site:|inurl:|intitle:|intext:|filetype:|ext:|allinurl:|allintitle:|allintext:|cache:|link:|inanchor:|related:|info:|define:)/g,
      '<span class="op-highlight">$1</span>')
    .replace(/"([^"]*)"/g, '<span class="quote-highlight">"$1"</span>');

  preview.className = 'query-preview';
  preview.innerHTML = hl;
  return q;
}

// Returns the plain-text query (strips HTML from preview) ──
function getQuery() {
  const preview = document.getElementById('queryPreview');
  return preview.innerText.replace(/^>\s*/, '').trim();
}

// ── Actions ──
function launchSearch() {
  const q = buildQuery();
  if (!q) { showToast('⚠ Build a query first'); return; }
  const url = ENGINES[currentEngine](q);
  window.open(url, '_blank', 'noopener,noreferrer');
  autoSave(q);
  queryCount++;
  Store.set('dorker_count', queryCount);
  document.getElementById('queryCount').textContent = queryCount;
}

function copyQuery() {
  const q = buildQuery();
  if (!q) { showToast('Nothing to copy'); return; }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(q)
      .then(() => showToast('⎘ Query copied to clipboard'))
      .catch(() => fallbackCopy(q));
  } else {
    fallbackCopy(q);
  }
}

// Fallback for browsers that block clipboard on file:// ──
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('⎘ Copied (fallback)');
  } catch {
    showToast('⚠ Copy failed — select manually');
  }
  document.body.removeChild(ta);
}

function saveToHistory() {
  const q = buildQuery();
  if (!q) { showToast('Nothing to save'); return; }
  autoSave(q);
  showToast('⊕ Saved to history');
}

function clearAll() {
  document.getElementById('targetInput').value  = '';
  document.getElementById('rawInput').value     = '';
  document.getElementById('excludeInput').value = '';
  document.getElementById('phraseInput').value  = '';
  buildQuery();
  showToast('Cleared');
}

// ── Operator helpers ──
function insertOp(op) {
  const raw = document.getElementById('rawInput');
  const pos = raw.selectionStart;
  const val = raw.value;
  raw.value = val.slice(0, pos) + op + val.slice(pos);
  raw.focus();
  raw.setSelectionRange(pos + op.length, pos + op.length);
  buildQuery();
}

function appendRaw(text) {
  const raw = document.getElementById('rawInput');
  raw.value = (raw.value ? raw.value + ' ' : '') + text;
  raw.focus();
  buildQuery();
  showToast('Appended operator');
}

function loadTemplate(tpl) {
  const target = document.getElementById('targetInput').value.trim() || 'example.com';
  const filled = tpl.replace(/{target}/g, target);
  document.getElementById('rawInput').value    = filled;
  document.getElementById('targetInput').value = '';
  buildQuery();
  showToast('Template loaded');
}

// ── History ──
function autoSave(q) {
  if (!q || queryHistory[0] === q) return;
  queryHistory.unshift(q);
  if (queryHistory.length > 40) queryHistory.pop();
  Store.set('dorker_history', queryHistory);
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (!queryHistory.length) {
    list.innerHTML = '<div class="history-empty">[ no queries saved yet ]</div>';
    return;
  }
  list.innerHTML = queryHistory.map((q, i) => `
    <div class="history-item" onclick="loadFromHistory(${i})">
      <span class="history-query">${escHtml(q)}</span>
      <span class="history-time">#${queryHistory.length - i}</span>
    </div>
  `).join('');
}

function loadFromHistory(i) {
  document.getElementById('rawInput').value    = queryHistory[i];
  document.getElementById('targetInput').value = '';
  buildQuery();
  showToast('Query loaded');
}

function clearHistory() {
  queryHistory = [];
  Store.remove('dorker_history');
  renderHistory();
  showToast('History cleared');
}

// ── UI helpers ──
function togglePanel(header) {
  const arrow = header.querySelector('.toggle-arrow');
  const body  = header.nextElementSibling;
  const open  = body.classList.toggle('open');
  arrow.classList.toggle('open', open);
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

function escHtml(s) {
  return s
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

// ── Keyboard shortcuts ──
document.addEventListener('keydown', e => {
  // Ctrl/Cmd + Enter → launch search
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    launchSearch();
  }
  // Escape → clear all
  if (e.key === 'Escape') {
    clearAll();
  }
});