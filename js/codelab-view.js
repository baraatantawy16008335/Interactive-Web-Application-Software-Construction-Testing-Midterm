// Code lab: find-and-fix the bug, predict the output, and write-it-yourself exercises.
// The midterm email lists "coding questions" and "identifying and correcting code errors";
// this page drills both. Data lives in js/content/codelab.js.
import { CODE } from './content/codelab.js';
import { byId } from './modules.js';
import { getState, recordScore } from './store.js';
import { esc } from './viz.js';

const KINDS = {
  fix: ['bug', 'Find & fix'],
  trace: ['eye', 'Predict the output'],
  write: ['pencil-simple-line', 'Write the code'],
};

const lines = src => src.replace(/^\n/, '').replace(/\s+$/, '').split('\n');

function codeLines(src, cls = {}) {
  return `<pre class="code cl-code">${lines(src).map((l, i) => `<span class="cl-line ${cls[i + 1] || ''}" data-ln="${i + 1}"><span class="cl-n">${i + 1}</span>${esc(l) || ' '}</span>`).join('')}</pre>`;
}

function itemHTML(it, n) {
  const [icon, label] = KINDS[it.kind];
  const done = getState().scores['code-' + it.id];
  const mod = byId[it.m];
  return `<article class="bench cl-item" id="cl-${it.id}" data-id="${it.id}">
    <div class="bench-head"><i class="ph ph-${icon}"></i><h3>${n}. ${it.title}</h3>
      <span class="hint">${done ? `<span class="${done.right ? 'hl' : ''}">${done.right ? 'Solved' : 'Reviewed'}</span> · ` : ''}${label} · ${it.lang}${mod ? ` · <a href="#/m/${mod.id}">${mod.num}</a>` : ''}</span></div>
    <div class="bench-body">
      <div class="prose"><p>${it.prompt}</p></div>
      ${it.code ? `<div data-code>${codeLines(it.code)}</div>` : ''}
      ${it.kind === 'fix' ? `<p class="small muted" data-hint style="margin-top:8px">Tap the line${it.bugLines.length > 1 ? 's' : ''} you think ${it.bugLines.length > 1 ? 'are' : 'is'} wrong (${it.bugLines.length} to find), then check.</p>` : ''}
      ${it.kind === 'trace' ? `<div class="field" style="max-width:520px;margin-top:10px"><label for="in-${it.id}">Your predicted output</label><textarea id="in-${it.id}" rows="3" style="font-family:var(--mono)" placeholder="Write it down before you reveal"></textarea></div>` : ''}
      ${it.kind === 'write' ? `<div class="field" style="margin-top:10px"><label for="in-${it.id}">Your answer (scratch space, any language)</label><textarea id="in-${it.id}" rows="8" style="font-family:var(--mono)" placeholder="Write it as you would on paper"></textarea></div>` : ''}
      <div class="cl-actions" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
        <button class="btn primary sm" data-act="reveal"><i class="ph ph-${it.kind === 'fix' ? 'check' : 'eye'}"></i>${it.kind === 'fix' ? 'Check my lines' : 'Reveal the answer'}</button>
      </div>
      <div data-out></div>
    </div>
  </article>`;
}

function reveal(card, it) {
  const out = card.querySelector('[data-out]');
  const picked = [...card.querySelectorAll('.cl-line.pick')].map(l => +l.dataset.ln);
  let verdict = '';
  if (it.kind === 'fix') {
    const cls = {};
    it.bugLines.forEach(n => cls[n] = 'bug');
    picked.forEach(n => cls[n] = it.bugLines.includes(n) ? 'hit' : 'miss');
    card.querySelector('[data-code]').innerHTML = codeLines(it.code, cls);
    const hits = picked.filter(n => it.bugLines.includes(n)).length, extra = picked.length - hits;
    const ok = hits === it.bugLines.length && extra === 0;
    verdict = `<p class="small" style="margin-top:10px"><strong class="${ok ? 'hl' : ''}">${ok ? 'You found every bug.' : `You found ${hits} of ${it.bugLines.length}${extra ? `, plus ${extra} line${extra > 1 ? 's' : ''} that ${extra > 1 ? 'were' : 'was'} fine` : ''}.`}</strong> Red = the bug${it.bugLines.length > 1 ? 's' : ''}.</p>`;
    recordScore('code-' + it.id, ok ? 1 : 0, 1);
    card.querySelector('[data-hint]')?.remove();
  }
  out.innerHTML = `${verdict}
    <div class="callout key" style="margin-top:12px"><i class="ph ph-lightbulb"></i><div>${it.why}</div></div>
    ${it.answer ? `<div class="tiny muted" style="margin:12px 0 -6px;font-family:var(--mono)">${it.kind === 'fix' ? 'Corrected code' : it.kind === 'trace' ? 'Output' : 'Model answer'}</div><pre class="code">${esc(it.answer.replace(/^\n/, '').replace(/\s+$/, ''))}</pre>` : ''}
    ${it.checklist ? `<div class="prose"><p class="small"><strong>A grader looks for:</strong></p><ul class="small">${it.checklist.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
    ${it.kind !== 'fix' ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><span class="small muted" style="align-self:center">Mark yourself:</span><button class="btn sm" data-act="got"><i class="ph ph-check"></i>I got it</button><button class="btn sm" data-act="miss"><i class="ph ph-x"></i>I missed it</button></div>` : ''}`;
  card.querySelector('[data-act="reveal"]').remove();
}

export function renderCodeLab(view, params) {
  let kind = params.get('k') || 'all', mod = params.get('m') || 'all';
  const mods = [...new Set(CODE.map(c => c.m))].filter(m => byId[m]);
  const render = () => {
    const list = CODE.filter(c => (kind === 'all' || c.kind === kind) && (mod === 'all' || c.m === mod));
    const solved = CODE.filter(c => getState().scores['code-' + c.id]?.right).length;
    view.innerHTML = `<h1>Code lab</h1>
      <p class="lede" style="margin-top:10px">The email promises <strong>coding questions</strong> and <strong>identifying and correcting code errors</strong>, in any language. Do these on paper first, then reveal. ${solved}/${CODE.length} solved so far.</p>
      <div class="controls" style="margin-top:18px">
        <div class="seg" role="group" aria-label="Exercise type">${[['all', 'All'], ...Object.entries(KINDS).map(([k, [, l]]) => [k, l])].map(([k, l]) => `<button data-k="${k}" class="${kind === k ? 'on' : ''}" aria-pressed="${kind === k}">${l} <span class="num">${k === 'all' ? CODE.length : CODE.filter(c => c.kind === k).length}</span></button>`).join('')}</div>
        <div class="field" style="max-width:260px"><label for="clm">Module</label><select id="clm"><option value="all">All modules</option>${mods.map(m => `<option value="${m}" ${mod === m ? 'selected' : ''}>${byId[m].num}: ${byId[m].title}</option>`).join('')}</select></div>
      </div>
      <div style="display:grid;gap:18px;margin-top:22px">${list.map((it, i) => itemHTML(it, i + 1)).join('') || `<div class="empty"><i class="ph ph-funnel"></i>No exercises match.</div>`}</div>`;
  };
  view.onclick = e => {
    const k = e.target.closest('[data-k]');
    if (k) { kind = k.dataset.k; render(); return; }
    const card = e.target.closest('.cl-item'); if (!card) return;
    const it = CODE.find(c => c.id === card.dataset.id);
    const line = e.target.closest('.cl-line');
    if (line && it.kind === 'fix' && card.querySelector('[data-act="reveal"]')) { line.classList.toggle('pick'); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'reveal') reveal(card, it);
    if (act === 'got' || act === 'miss') {
      recordScore('code-' + it.id, act === 'got' ? 1 : 0, 1);
      e.target.closest('div').innerHTML = `<span class="small ${act === 'got' ? 'hl' : 'muted'}">${act === 'got' ? 'Marked as solved.' : 'Marked for review. Try it again tomorrow morning.'}</span>`;
    }
  };
  view.onchange = e => { if (e.target.id === 'clm') { mod = e.target.value; render(); } };
  render();
}
