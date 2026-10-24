// Unit 3 widgets: Functional Programming (fundamentals) + Lab 3.
import { bench, $, $$, on, seg, setSeg, esc } from '../viz.js';
import { sorter } from './sorter.js';

const C = s => `<code>${s}</code>`;

// ------------------------------------------------------------------ pure or impure?
export function u3PureImpure(el) {
  sorter(el, {
    id: 'u3-pure', icon: 'flask', title: 'Pure or impure?', options: ['Pure', 'Impure'], cols: 250,
    hint: 'Decide for each function: same input always gives the same output, and nothing outside changes.',
    items: [
      { t: C('const square = x => x * x;'), a: 'Pure', why: 'Output depends only on x and nothing else is touched.' },
      { t: C('let total = 0;<br>function add(a, b) { total += a + b; return total; }'), a: 'Impure', why: 'Modifies the global total, so the output depends on previous calls.' },
      { t: C('function addAndLog(a, b) {<br>&nbsp; const s = a + b; console.log(s); return s; }'), a: 'Impure', why: 'Printing to the console is a side effect.' },
      { t: C('const addOne = n => n + 1;'), a: 'Pure', why: 'Takes a value, returns a new value. This is the pure fix of the counter example.' },
      { t: C('function addPoint(user) { user.points++; }'), a: 'Impure', why: 'Mutates the object that was passed in.' },
      { t: C('const addPoint = u => ({ ...u, points: u.points + 1 });'), a: 'Pure', why: 'Returns a new object and leaves the input unchanged.' },
      { t: C('const roll = () => Math.random();'), a: 'Impure', why: 'Not deterministic: the same (empty) input gives different outputs.' },
      { t: C('const doubled = nums => nums.map(n => n * 2);'), a: 'Pure', why: 'map returns a new array and does not mutate nums.' },
    ],
  });
}

// ------------------------------------------------------------------ same input, many calls
const SI = {
  addImpure: {
    label: 'addImpure(a, b)', arity: 2, global: 'total',
    src: 'let total = 0;\nfunction addImpure(a, b) {\n  total += a + b;   // modifies global\n  return total;\n}',
    run: (a, b, g) => { g.total += a + b; return g.total; },
  },
  increment: {
    label: 'increment()', arity: 0, global: 'counter',
    src: 'let counter = 0;\nfunction increment() {\n  counter = counter + 1;   // modifies global\n  return counter;\n}',
    run: (a, b, g) => { g.counter += 1; return g.counter; },
  },
  add: {
    label: 'add(a, b)  (pure)', arity: 2, global: null,
    src: 'function add(a, b) {\n  return a + b;   // no outside state\n}',
    run: (a, b) => a + b,
  },
};

export function u3SameInput(el) {
  let which = 'addImpure', a = 3, b = 4, log = [], g = { total: 0, counter: 0 };
  const reset = () => { log = []; g = { total: 0, counter: 0 }; };
  const render = () => {
    const f = SI[which];
    const call = f.arity ? `${which === 'add' ? 'add' : 'addImpure'}(${a}, ${b})` : 'increment()';
    const outs = new Set(log.map(l => l.out));
    el.innerHTML = `${bench('repeat', 'Same input, many calls', 'Call it again and again')}
    <div class="bench-body">
      <div class="controls">
        ${seg(Object.entries(SI).map(([k, v]) => [k, v.label]), which)}
      </div>
      <pre class="code" style="margin:12px 0">${esc(f.src)}</pre>
      <div class="controls" style="align-items:end">
        ${f.arity ? `<div class="field" style="max-width:90px"><label for="si-a">a</label><input id="si-a" type="number" value="${a}"></div>
        <div class="field" style="max-width:90px"><label for="si-b">b</label><input id="si-b" type="number" value="${b}"></div>` : '<span class="small muted">No inputs at all.</span>'}
        <button class="btn primary" data-call><i class="ph ph-play"></i>Call ${esc(call)}</button>
        <button class="btn sm" data-reset><i class="ph ph-arrow-counter-clockwise"></i>Reset</button>
      </div>
      <div class="two" style="margin-top:12px;align-items:start">
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>Call</th><th>Output</th></tr></thead><tbody>
          ${log.length ? log.map((l, i) => `<tr><td>${i + 1}</td><td><code>${esc(l.call)}</code></td><td style="font-weight:600;color:${l.out === log[0].out ? 'var(--good)' : 'var(--bad)'}">${l.out}</td></tr>`).join('') : '<tr><td colspan="3" class="muted">No calls yet.</td></tr>'}
        </tbody></table></div>
        <div>
          <div class="readout" style="margin-top:0">${f.global ? `global <b>${f.global}</b> is now <b class="num">${g[f.global]}</b>` : 'No global state exists.'}</div>
          <div class="explain">${log.length < 2 ? 'Press the call button at least twice with the same input.' :
            outs.size === 1 ? '<b>Deterministic.</b> The same input gave the same output every time, and nothing outside changed. This is the first characteristic of a pure function.' :
            `<b>Not deterministic.</b> The same input gave ${outs.size} different outputs because the function reads and changes a variable outside itself (<code>${f.global}</code>). Hidden state makes it impure and hard to test.`}</div>
        </div>
      </div>
    </div>`;
  };
  on(el, '[data-v]', 'click', (e, bt) => { which = bt.dataset.v; reset(); render(); });
  on(el, '[data-call]', 'click', () => {
    const ai = $(el, '#si-a'), bi = $(el, '#si-b');
    if (ai) { a = +ai.value || 0; b = +bi.value || 0; }
    const f = SI[which];
    const call = f.arity ? `${which === 'add' ? 'add' : 'addImpure'}(${a}, ${b})` : 'increment()';
    log.push({ call, out: f.run(a, b, g) });
    render();
  });
  on(el, '[data-reset]', 'click', () => { reset(); render(); });
  render();
}

// ------------------------------------------------------------------ mutation vs new copy
export function u3Mutation(el) {
  let kind = 'array', mode = 'mutate', ran = false;
  const SRC = {
    'array-mutate': ['const numbers = [1, 2, 3];', 'numbers.push(4);', 'console.log(numbers);   // [1, 2, 3, 4]'],
    'array-immutable': ['const numbers = [1, 2, 3];', 'const updated = [...numbers, 4];', 'console.log(numbers);   // [1, 2, 3]\nconsole.log(updated);   // [1, 2, 3, 4]'],
    'object-mutate': ['const user = { name: "Ali", points: 10 };', 'function addPoint() { user.points++; }\naddPoint();', 'console.log(user.points);   // 11'],
    'object-immutable': ['const user = { name: "Ali", points: 10 };', 'const updatedUser = { ...user, points: user.points + 1 };', 'console.log(user.points);   // 10\nconsole.log(updatedUser.points);   // 11'],
  };
  const model = () => {
    const arr = kind === 'array';
    const before = arr ? '[1, 2, 3]' : '{ name: "Ali", points: 10 }';
    if (mode === 'mutate') {
      const after = arr ? '[1, 2, 3, 4]' : '{ name: "Ali", points: 11 }';
      return { boxes: [{ vars: [arr ? 'numbers' : 'user'], text: ran ? after : before, changed: ran }], changedOriginal: ran };
    }
    const nv = arr ? 'updated' : 'updatedUser';
    const boxes = [{ vars: [arr ? 'numbers' : 'user'], text: before, changed: false }];
    if (ran) boxes.push({ vars: [nv], text: arr ? '[1, 2, 3, 4]' : '{ name: "Ali", points: 11 }', fresh: true });
    return { boxes, changedOriginal: false };
  };
  const render = () => {
    const key = `${kind}-${mode}`, src = SRC[key], m = model();
    const lines = ran ? src : [src[0]];
    el.innerHTML = `${bench('git-branch', 'Mutate or return a new copy?', 'Run the line, then look at memory')}
    <div class="bench-body">
      <div class="controls">
        ${seg([['array', 'Array'], ['object', 'Object']], kind, 'data-kind')}
        ${seg([['mutate', mode === 'mutate' ? 'Mutate (impure)' : 'Mutate (impure)'], ['immutable', 'New copy (pure)']], mode, 'data-mode')}
        <button class="btn primary" data-run ${ran ? 'disabled' : ''}><i class="ph ph-play"></i>Run the code</button>
        <button class="btn sm" data-reset><i class="ph ph-arrow-counter-clockwise"></i>Reset</button>
      </div>
      <div class="two" style="margin-top:12px;align-items:start">
        <div><div class="tiny muted" style="margin-bottom:4px">CODE</div><pre class="code" style="margin:0">${esc(lines.join('\n'))}</pre></div>
        <div><div class="tiny muted" style="margin-bottom:4px">MEMORY (variables point to objects)</div>
          ${m.boxes.map(b => `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:8px">
            ${b.vars.map(v => `<span class="chip" style="font-family:var(--mono)">${v}</span>`).join('')}
            <span class="muted">&rarr;</span>
            <span style="font-family:var(--mono);padding:6px 10px;border-radius:8px;border:1.5px solid ${b.changed ? 'var(--bad)' : b.fresh ? 'var(--good)' : 'var(--line)'};background:var(--sunken)">${esc(b.text)}</span>
            ${b.changed ? '<span class="small" style="color:var(--bad)">changed in place</span>' : ''}${b.fresh ? '<span class="small" style="color:var(--good)">new object</span>' : ''}
          </div>`).join('')}
        </div>
      </div>
      <div class="readout">${ran ? `Original changed? <b style="color:${m.changedOriginal ? 'var(--bad)' : 'var(--good)'}">${m.changedOriginal ? 'YES, so the code is impure' : 'NO, so the code is pure'}</b>` : 'Press Run to execute the code.'}</div>
      <div class="explain">${mode === 'mutate'
        ? 'The same object in memory is edited. Anyone else holding a reference to it sees the change, which is an unintended side effect.'
        : 'The spread operator <code>...</code> copies the old values into a brand new object. The original keeps its value. Memory trick: <b>"Don\'t mutate, return new."</b>'}</div>
    </div>`;
  };
  on(el, '[data-kind]', 'click', (e, b) => { kind = b.dataset.kind; ran = false; render(); });
  on(el, '[data-mode]', 'click', (e, b) => { mode = b.dataset.mode; ran = false; render(); });
  on(el, '[data-run]', 'click', () => { ran = true; render(); });
  on(el, '[data-reset]', 'click', () => { ran = false; render(); });
  render();
}

// ------------------------------------------------------------------ map / filter / reduce pipeline
const STG = {
  dbl: { k: 'map', label: 'map: double', code: '.map(x => x * 2)', f: a => a.map(x => x * 2) },
  inc: { k: 'map', label: 'map: add 1', code: '.map(x => x + 1)', f: a => a.map(x => x + 1) },
  sq: { k: 'map', label: 'map: square', code: '.map(x => x * x)', f: a => a.map(x => x * x) },
  even: { k: 'filter', label: 'filter: even', code: '.filter(x => x % 2 === 0)', f: a => a.filter(x => x % 2 === 0), keep: x => x % 2 === 0 },
  odd: { k: 'filter', label: 'filter: odd', code: '.filter(x => x % 2 !== 0)', f: a => a.filter(x => x % 2 !== 0), keep: x => x % 2 !== 0 },
  big: { k: 'filter', label: 'filter: > 5', code: '.filter(x => x > 5)', f: a => a.filter(x => x > 5), keep: x => x > 5 },
  sum: { k: 'reduce', label: 'reduce: sum', code: '.reduce((acc, x) => acc + x, 0)', f: a => a.reduce((s, x) => s + x, 0) },
  prod: { k: 'reduce', label: 'reduce: product', code: '.reduce((acc, x) => acc * x, 1)', f: a => a.reduce((s, x) => s * x, 1) },
  max: { k: 'reduce', label: 'reduce: max', code: '.reduce((acc, x) => Math.max(acc, x), -Infinity)', f: a => a.reduce((s, x) => Math.max(s, x), -Infinity) },
};
const PRESETS = [['filter even, map x10, sum', ['even', 'dbl', 'sum']], ['square then keep > 5', ['sq', 'big']], ['add 1, odd, product', ['inc', 'odd', 'prod']]];

export function u3Pipeline(el) {
  let input = [1, 2, 3, 4, 5, 6], stages = ['even', 'dbl', 'sum'], err = '';
  const kindColor = k => k === 'map' ? 'var(--accent)' : k === 'filter' ? 'var(--good)' : 'var(--bad)';
  const chipsOf = (arr, dropped = []) => `<span style="display:inline-flex;flex-wrap:wrap;gap:4px;align-items:center;font-family:var(--mono)">[ ${arr.map(v => `<span class="chip">${v}</span>`).join('')}${dropped.map(v => `<span class="chip" style="text-decoration:line-through;opacity:.45">${v}</span>`).join('')} ]</span>`;
  const render = () => {
    let cur = input.slice(), rows = [], ended = false;
    stages.forEach((id, i) => {
      const s = STG[id], inp = cur, out = s.f(cur);
      const dropped = s.k === 'filter' ? inp.filter(x => !s.keep(x)) : [];
      rows.push({ id, s, i, out, dropped, scalar: s.k === 'reduce' });
      if (s.k === 'reduce') ended = true;
      cur = Array.isArray(out) ? out : [out];
    });
    const code = `[${input.join(', ')}]` + (stages.length ? '\n  ' + stages.map(id => STG[id].code).join('\n  ') : '');
    el.innerHTML = `${bench('funnel', 'map / filter / reduce pipeline', 'Build a chain and watch each stage')}
    <div class="bench-body">
      <div class="controls" style="align-items:end">
        <div class="field" style="max-width:260px"><label for="pl-in">Input list (comma separated)</label><input id="pl-in" type="text" value="${input.join(', ')}"></div>
        <button class="btn sm" data-clear><i class="ph ph-trash"></i>Clear stages</button>
      </div>
      ${err ? `<p class="small" style="color:var(--bad)">${err}</p>` : ''}
      <div class="small muted" style="margin:10px 0 6px">Add a stage ${ended ? '(a reduce ends the pipeline: remove it to add more)' : ''}</div>
      <div class="chips" style="display:flex;flex-wrap:wrap;gap:6px">
        ${Object.entries(STG).map(([id, s]) => `<button type="button" class="btn sm" data-add="${id}" ${ended ? 'disabled' : ''} style="border-color:${kindColor(s.k)}">${s.label}</button>`).join('')}
      </div>
      <div class="small muted" style="margin:10px 0 6px">Or try a preset: ${PRESETS.map(([l, st], i) => `<button type="button" class="btn sm" data-pre="${i}">${l}</button>`).join(' ')}</div>
      <div style="margin-top:12px;display:grid;gap:8px">
        <div class="tiny muted">INPUT (never modified)</div>${chipsOf(input)}
        ${rows.map(r => `<div style="border-left:3px solid ${kindColor(r.s.k)};padding:4px 0 4px 10px">
          <div class="small"><b style="color:${kindColor(r.s.k)}">${r.s.k}</b> <code>${esc(r.s.code)}</code> <button type="button" class="icon-btn" data-rm="${r.i}" aria-label="Remove stage" style="padding:0 6px">&times;</button></div>
          ${r.scalar ? `<div class="readout" style="margin:4px 0 0">single value: <b class="num">${r.out}</b></div>` : chipsOf(r.out, r.dropped)}
        </div>`).join('')}
      </div>
      <div class="tiny muted" style="margin-top:12px">EQUIVALENT CODE</div>
      <pre class="code" style="margin:4px 0 0">${esc(code)}</pre>
      <div class="explain">map = transform every element (same size). filter = keep what passes the predicate (crossed-out chips were dropped). reduce = combine everything into <b>one</b> value using an accumulator and an initial value. The original list is untouched at every stage.</div>
    </div>`;
  };
  on(el, '[data-add]', 'click', (e, b) => { stages.push(b.dataset.add); render(); });
  on(el, '[data-rm]', 'click', (e, b) => { stages.splice(+b.dataset.rm, 1); render(); });
  on(el, '[data-clear]', 'click', () => { stages = []; render(); });
  on(el, '[data-pre]', 'click', (e, b) => { stages = PRESETS[+b.dataset.pre][1].slice(); render(); });
  el.addEventListener('change', e => {
    if (e.target.id !== 'pl-in') return;
    const v = e.target.value.split(/[,\s]+/).filter(Boolean).map(Number);
    if (v.length && v.length <= 12 && v.every(Number.isFinite)) { input = v; err = ''; } else err = 'Enter 1 to 12 numbers.';
    render();
  });
  render();
}

// ------------------------------------------------------------------ recursion call stack
export function u3Recursion(el) {
  let n = 4, s = 0, timer = null;
  const total = () => 2 * (n + 1);
  const ret = k => (k === 0 ? 1 : k * ret(k - 1));
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const render = () => {
    const pushed = Math.min(s, n + 1), popped = Math.max(0, s - (n + 1));
    // frames: index j=0 is factorial(n), j=n is factorial(0)
    const frames = [];
    for (let j = 0; j < pushed; j++) frames.push(n - j);
    const alive = frames.slice(0, frames.length - popped);
    const done = frames.slice(frames.length - popped).reverse();
    let note;
    if (s === 0) note = `Press Next to call <code>factorial(${n})</code>.`;
    else if (s < n + 1) note = `<code>factorial(${n - s + 1})</code> is called. It is not the base case, so it calls <code>factorial(${n - s})</code> and waits.`;
    else if (s === n + 1) note = `<b>Base case reached:</b> <code>factorial(0)</code> returns 1 immediately. The stack is as deep as it gets.`;
    else if (s < total()) note = `The stack unwinds: <code>factorial(${popped})</code> returns <code>${popped} * ${ret(popped - 1)} = ${ret(popped)}</code> to its caller.`;
    else note = `Done. The answer is <b>${ret(n)}</b>. Every call returned to the one below it.`;
    el.innerHTML = `${bench('stack', 'Recursion: the call stack', 'Step through factorial(n)')}
    <div class="bench-body">
      <div class="controls" style="align-items:end">
        <div class="field" style="max-width:240px"><label for="rc-n">n <span class="val">${n}</span></label><input id="rc-n" type="range" min="0" max="6" value="${n}"></div>
        <button class="btn sm" data-prev ${s === 0 ? 'disabled' : ''}><i class="ph ph-caret-left"></i>Back</button>
        <button class="btn primary" data-next ${s >= total() ? 'disabled' : ''}>Next<i class="ph ph-caret-right"></i></button>
        <button class="btn sm" data-play ${s >= total() ? 'disabled' : ''}><i class="ph ph-${timer ? 'pause' : 'play'}"></i>${timer ? 'Pause' : 'Play'}</button>
        <button class="btn sm" data-reset><i class="ph ph-arrow-counter-clockwise"></i></button>
      </div>
      <pre class="code" style="margin:12px 0">const factorial = n => {
  if (n === 0) {            // base case
    return 1;
  }
  return n * factorial(n - 1);   // recursive case
};</pre>
      <div class="two" style="align-items:start">
        <div><div class="tiny muted" style="margin-bottom:4px">CALL STACK (top = running)</div>
          <div style="display:flex;flex-direction:column;gap:6px;min-height:40px">
            ${alive.length ? alive.slice().reverse().map((k, idx) => {
              const top = idx === 0, base = k === 0 && s >= n + 1;
              return `<div style="padding:6px 10px;border-radius:8px;border:1.5px solid ${base ? 'var(--good)' : top ? 'var(--accent)' : 'var(--line)'};background:var(--sunken);font-family:var(--mono);font-size:.9em">
                factorial(${k}) ${k === 0 ? '<span class="muted">base case: return 1</span>' : `<span class="muted">waiting: ${k} * factorial(${k - 1})</span>`}</div>`;
            }).join('') : '<span class="small muted">empty</span>'}
          </div></div>
        <div><div class="tiny muted" style="margin-bottom:4px">RETURNED (in order)</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${done.length ? done.map(k => `<div style="padding:6px 10px;border-radius:8px;border:1.5px solid var(--good);font-family:var(--mono);font-size:.9em">factorial(${k}) &rarr; <b>${ret(k)}</b></div>`).join('') : '<span class="small muted">nothing yet</span>'}
          </div></div>
      </div>
      <div class="explain">${note}</div>
    </div>`;
  };
  const next = () => { if (s < total()) { s++; render(); } if (s >= total()) stop(), render(); };
  on(el, '[data-next]', 'click', () => { stop(); next(); });
  on(el, '[data-prev]', 'click', () => { stop(); if (s > 0) s--; render(); });
  on(el, '[data-reset]', 'click', () => { stop(); s = 0; render(); });
  on(el, '[data-play]', 'click', () => {
    if (timer) { stop(); render(); return; }
    if (s >= total()) s = 0;
    timer = setInterval(next, 750); render();
  });
  el.addEventListener('input', e => { if (e.target.id === 'rc-n') { stop(); n = +e.target.value; s = 0; render(); const r = $(el, '#rc-n'); r && r.focus(); } });
  render();
  return stop;
}

// ------------------------------------------------------------------ compose vs pipe
const CF = {
  addOne: { label: 'addOne', src: 'x => x + 1', f: x => x + 1 },
  double: { label: 'double', src: 'x => x * 2', f: x => x * 2 },
  square: { label: 'square', src: 'x => x * x', f: x => x * x },
  minus3: { label: 'minus3', src: 'x => x - 3', f: x => x - 3 },
};

export function u3Compose(el) {
  let f = 'addOne', g = 'double', x = 3;
  const opts = Object.entries(CF).map(([k, v]) => [k, v.label]);
  const render = () => {
    const F = CF[f], G = CF[g];
    // compose(f, g)(x) = f(g(x)): g first.  pipe(f, g)(x) = g(f(x)): f first.
    const cg = G.f(x), cr = F.f(cg);
    const pf = F.f(x), pr = G.f(pf);
    const col = (title, def, first, second, mid, res, note) => `<div style="border:1px solid var(--line);border-radius:10px;padding:10px 12px">
      <h4 style="margin:0 0 4px">${title}</h4><code class="small">${def}</code>
      <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:10px 0;font-family:var(--mono)">
        <span class="chip">${x}</span><span class="muted">&rarr;</span>
        <span class="chip" style="border-color:var(--accent)"><b>1st</b> ${first}</span><span class="muted">&rarr;</span><span class="chip">${mid}</span><span class="muted">&rarr;</span>
        <span class="chip" style="border-color:var(--good)"><b>2nd</b> ${second}</span><span class="muted">&rarr;</span><span class="chip"><b>${res}</b></span>
      </div><div class="small muted">${note}</div></div>`;
    el.innerHTML = `${bench('arrows-merge', 'compose(f, g) vs pipe(f, g)', 'Which function runs first?')}
    <div class="bench-body">
      <div class="controls" style="align-items:end">
        <div><div class="tiny muted">f</div>${seg(opts, f, 'data-f')}</div>
        <div><div class="tiny muted">g</div>${seg(opts, g, 'data-g')}</div>
        <div class="field" style="max-width:100px"><label for="cp-x">input x</label><input id="cp-x" type="number" value="${x}"></div>
      </div>
      <pre class="code" style="margin:12px 0">const f = ${F.src};
const g = ${G.src};
const compose = (f, g) => x => f(g(x));
const pipe    = (f, g) => x => g(f(x));</pre>
      <div class="two" style="align-items:start;gap:12px">
        ${col('compose(f, g)', 'x => f(g(x))', `g = ${G.label}`, `f = ${F.label}`, cg, cr, `Runs <b>right to left</b>: the inner function g goes first. compose(${F.label}, ${G.label})(${x}) = ${F.label}(${G.label}(${x})) = ${cr}.`)}
        ${col('pipe(f, g)', 'x => g(f(x))', `f = ${F.label}`, `g = ${G.label}`, pf, pr, `Runs <b>left to right</b>, like a pipeline: output of f is input of g. pipe(${F.label}, ${G.label})(${x}) = ${G.label}(${F.label}(${x})) = ${pr}.`)}
      </div>
      <div class="readout">${cr === pr ? 'Same result here: these two functions happen to give the same answer in either order.' : `Different results (<b>${cr}</b> vs <b>${pr}</b>): the order matters, so read compose from the inside out.`}</div>
      <div class="explain">Lab example: <code>compose(addOne, double)(3)</code> is <code>addOne(double(3))</code> = <code>addOne(6)</code> = <b>7</b>. Set f = addOne, g = double, x = 3 to see it.</div>
    </div>`;
  };
  on(el, '[data-f]', 'click', (e, b) => { f = b.dataset.f; render(); });
  on(el, '[data-g]', 'click', (e, b) => { g = b.dataset.g; render(); });
  el.addEventListener('change', e => { if (e.target.id === 'cp-x') { x = Math.round(+e.target.value) || 0; render(); } });
  render();
}

// ------------------------------------------------------------------ function that returns a function
export function u3Multiplier(el) {
  let factor = 3, x = 5;
  const render = () => {
    const list = [1, 2, 3, 4];
    el.innerHTML = `${bench('function', 'A function that returns a function', 'Higher-order function demo')}
    <div class="bench-body">
      <pre class="code" style="margin:0 0 12px">function multiplier(factor) {
  return function (x) {
    return x * factor;
  };
}</pre>
      <div class="controls" style="align-items:end">
        <div class="field" style="max-width:220px"><label for="mu-f">factor <span class="val">${factor}</span></label><input id="mu-f" type="range" min="1" max="10" value="${factor}"></div>
        <div class="field" style="max-width:220px"><label for="mu-x">x <span class="val">${x}</span></label><input id="mu-x" type="range" min="0" max="12" value="${x}"></div>
      </div>
      <pre class="code" style="margin:12px 0">const times${factor} = multiplier(${factor});   // returns a NEW function that remembers factor = ${factor}
times${factor}(${x});                  // ${x * factor}
[1, 2, 3, 4].map(times${factor});     // [${list.map(v => v * factor).join(', ')}]   (a function passed as an argument)</pre>
      <div class="readout">multiplier(${factor}) returned <code>x => x * ${factor}</code>. Calling it with ${x} gives <b class="num">${x * factor}</b>.</div>
      <div class="explain">Two higher-order ideas in one demo: <b>multiplier</b> returns a function (specialized behavior), and <b>map</b> takes a function as an argument (a callback).</div>
    </div>`;
  };
  el.addEventListener('input', e => {
    const id = e.target.id;
    if (id === 'mu-f' || id === 'mu-x') { if (id === 'mu-f') factor = +e.target.value; else x = +e.target.value; render(); const r = $(el, '#' + id); r && r.focus(); }
  });
  render();
}
