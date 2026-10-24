// Unit 4 widgets: Functional Programming II (currying, laziness, concurrency) and Lab 4 (specs, design, naming, bind, pattern matching).
import { bench, $, $$, on, seg, setSeg, esc, tween, reduced } from '../viz.js';
import { sorter } from './sorter.js';
import { recordScore } from '../store.js';

const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
const ci = (s) => `<code>${esc(s)}</code>`;

// ---------------------------------------------------------------- currying vs partial application
export function u4Curry(el) {
  const NAMES = ['length', 'width', 'height'];
  let mode = 'curry', step = 0, v = [2, 3, 4];
  const maxStep = () => (mode === 'curry' ? 3 : 2);
  const rows = () => {
    const out = [];
    const [a, b, c] = v;
    if (mode === 'curry') {
      out.push({ code: 'volume', note: `A function that waits for <b>length</b>.`, fn: true });
      if (step >= 1) out.push({ code: `volume(${a})`, note: `Returns a <b>new function</b> waiting for <b>width</b>. It remembers <code>length = ${a}</code> (closure).`, fn: true });
      if (step >= 2) out.push({ code: `volume(${a})(${b})`, note: `Returns another function waiting for <b>height</b>. It remembers <code>length = ${a}</code>, <code>width = ${b}</code>.`, fn: true });
      if (step >= 3) out.push({ code: `volume(${a})(${b})(${c})`, note: `All three arguments consumed, so the real result comes back: ${a} * ${b} * ${c}.`, val: a * b * c });
    } else {
      out.push({ code: 'volume', note: `Normal function: needs all 3 arguments at once.`, fn: true });
      if (step >= 1) out.push({ code: `const p = volume.bind(null, ${a}, ${b})`, note: `<b>Two arguments pre-filled in one go.</b> p is a new function waiting for <b>height</b> only.`, fn: true });
      if (step >= 2) out.push({ code: `p(${c})`, note: `The remaining argument arrives: ${a} * ${b} * ${c}.`, val: a * b * c });
    }
    return out;
  };
  const labels = () => {
    if (mode === 'curry') return step < 3 ? `Feed ${NAMES[step]} = ${v[step]}` : null;
    return step === 0 ? `Pre-fill length = ${v[0]} and width = ${v[1]}` : step === 1 ? `Call p(${v[2]})` : null;
  };
  const shell = () => {
    el.innerHTML = `${bench('function', 'Currying vs partial application', 'Feed arguments and watch what comes back')}
    <div class="bench-body">
      ${seg([['curry', 'Currying: one at a time'], ['partial', 'Partial application: pre-fill several']], mode)}
      <div class="controls" style="margin-top:14px">
        ${NAMES.map((n, i) => `<div class="field"><label for="u4c${i}">${n}</label><input id="u4c${i}" class="num" type="number" value="${v[i]}" data-i="${i}" style="width:100%"></div>`).join('')}
      </div>
      <pre class="code" style="margin-bottom:10px">${mode === 'curry'
        ? 'const volume = l => w => h => l * w * h;   // curried'
        : 'function volume(l, w, h) { return l * w * h; }\n// partial application uses bind (or an arrow wrapper)'}</pre>
      <div data-out></div>
      <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
        <button class="btn" data-next></button>
        <button class="btn sm" data-reset><i class="ph ph-arrow-counter-clockwise"></i>Reset</button>
      </div>
    </div>`;
    draw();
  };
  const draw = () => {
    const out = $(el, '[data-out]');
    out.innerHTML = rows().map((r, i) => `<div style="display:flex;flex-direction:column;gap:4px;padding:10px 12px;margin-bottom:8px;border:1px solid ${i === step ? 'var(--accent)' : 'var(--line)'};border-radius:10px;background:${r.val !== undefined ? 'var(--good-soft)' : 'var(--surface)'}">
      <code style="overflow-wrap:anywhere">${esc(r.code)}</code>
      <span class="small muted">${r.note}</span>
      <span class="small">${r.val !== undefined ? `<strong class="hl">Result: ${r.val}</strong>` : '<i class="ph ph-arrow-bend-down-right"></i> returns a <b>function</b>, not a number'}</span>
    </div>`).join('');
    const nxt = $(el, '[data-next]'), l = labels();
    nxt.disabled = !l; nxt.innerHTML = l ? `<i class="ph ph-play"></i>${esc(l)}` : 'Done, press Reset';
    nxt.style.opacity = l ? 1 : .5;
  };
  on(el, '.seg button', 'click', (e, b) => { mode = b.dataset.v; step = 0; shell(); });
  on(el, '[data-next]', 'click', () => { if (step < maxStep()) { step++; draw(); } });
  on(el, '[data-reset]', 'click', () => { step = 0; draw(); });
  on(el, 'input[data-i]', 'change', (e, inp) => { v[+inp.dataset.i] = num(inp.value); draw(); });
  shell();
}

// ---------------------------------------------------------------- lazy vs eager
export function u4Lazy(el) {
  let n = 5, task = 'naturals', ran = null, cancel = null;
  const CAP = 1000000;
  const pulls = () => (task === 'naturals' ? n : 2 * n - 1);
  const shell = () => {
    el.innerHTML = `${bench('hourglass', 'Eager vs lazy: infinite naturals', 'Compare how many values are actually computed')}
    <div class="bench-body">
      ${seg([['naturals', 'First n naturals'], ['evens', 'First n even numbers']], task)}
      <div class="controls" style="margin-top:14px">
        <div class="field"><label for="u4ln">n (how many you need): <span class="val" data-nv>${n}</span></label><input id="u4ln" type="range" min="1" max="10" value="${n}"></div>
      </div>
      <pre class="code">function* naturals() { let n = 0; while (true) yield n++; }   // infinite, but lazy
// lazy:  take(${n}, ${task === 'evens' ? 'filter(isEven, naturals())' : 'naturals()'})      pulls values one at a time
// eager: [...naturals()]                                  tries to build the WHOLE list first</pre>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px">
        <button class="btn" data-run="eager"><i class="ph ph-lightning"></i>Run eager</button>
        <button class="btn" data-run="lazy"><i class="ph ph-hourglass-medium"></i>Run lazy</button>
        <button class="btn sm" data-clear><i class="ph ph-arrow-counter-clockwise"></i>Clear</button>
      </div>
      <div class="two" data-out></div>
    </div>`;
    draw();
  };
  const chips = (cnt, extra) => {
    let s = '';
    for (let i = 0; i < cnt; i++) {
      const ok = task === 'naturals' || i % 2 === 0;
      s += `<span class="chip ${ok ? 'accent' : ''}" style="${ok ? '' : 'opacity:.55'}">${i}</span> `;
    }
    return s + (extra || '');
  };
  const draw = () => {
    const out = $(el, '[data-out]');
    if (!ran) { out.innerHTML = `<p class="small muted">Choose n, then press a button. Watch the counter of values computed.</p>`; return; }
    const p = pulls();
    out.innerHTML = `
      <div style="border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0"><h4 style="margin:0 0 6px">Eager</h4>
        ${ran.eager ? `<div class="readout"><div><div class="k">values computed</div><div class="v" data-eagercount style="color:var(--bad)">${ran.eagerDone ? CAP.toLocaleString() + '+' : '0'}</div></div></div>
        <p class="small" style="margin-top:8px;color:var(--bad)" data-eagermsg>${ran.eagerDone ? `Gave up at ${CAP.toLocaleString()}. The list never ends, so the line <code>[...naturals()]</code> never finishes and you never get your ${n} values.` : 'Building the whole list...'}</p>` : `<p class="small muted">Not run yet.</p>`}
      </div>
      <div style="border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0"><h4 style="margin:0 0 6px">Lazy</h4>
        ${ran.lazy ? `<div class="readout"><div><div class="k">values computed</div><div class="v accent">${p}</div></div><div><div class="k">values returned</div><div class="v">${n}</div></div></div>
        <div style="margin-top:10px">${chips(p, '<span class="chip">...never computed</span>')}</div>
        <p class="small muted" style="margin-top:8px">${task === 'naturals' ? `Only the ${n} values you asked for were ever computed.` : `To get ${n} even number${n > 1 ? 's' : ''} the generator had to pull ${p} values, the faded odd ones were computed then rejected by the filter. Still tiny, and nothing past that was touched.`}</p>` : `<p class="small muted">Not run yet.</p>`}
      </div>`;
  };
  const runEager = () => {
    ran = ran || {}; ran.eager = true; ran.eagerDone = false; draw();
    const count = $(el, '[data-eagercount]');
    if (cancel) cancel();
    cancel = tween(0, CAP, 1400, x => { if (count) count.textContent = Math.round(x).toLocaleString(); }, () => { ran.eagerDone = true; draw(); });
  };
  on(el, '[data-run]', 'click', (e, b) => {
    if (b.dataset.run === 'eager') runEager(); else { ran = ran || {}; ran.lazy = true; draw(); }
  });
  on(el, '[data-clear]', 'click', () => { if (cancel) cancel(); ran = null; draw(); });
  on(el, '.seg button', 'click', (e, b) => { task = b.dataset.v; if (cancel) cancel(); ran = null; shell(); });
  on(el, 'input[type=range]', 'input', (e, r) => { n = +r.value; $(el, '[data-nv]').textContent = n; if (cancel) cancel(); ran = null; $(el, 'pre.code').innerHTML = esc(`function* naturals() { let n = 0; while (true) yield n++; }   // infinite, but lazy\n// lazy:  take(${n}, ${task === 'evens' ? 'filter(isEven, naturals())' : 'naturals()'})      pulls values one at a time\n// eager: [...naturals()]                                  tries to build the WHOLE list first`); draw(); });
  shell();
  return () => cancel && cancel();
}

// ---------------------------------------------------------------- concurrency vs parallelism
export function u4Concurrency(el) {
  let cores = 1, t = 12, timer = null;
  const TASKS = [['A', 4], ['B', 4], ['C', 4]];
  const COLORS = ['var(--accent-viz)', 'var(--good)', 'var(--bad)'];
  const schedule = (nc) => {
    const rem = TASKS.map(x => x[1]), queue = [0, 1, 2], lanes = Array.from({ length: nc }, () => []), fin = [null, null, null];
    for (let tick = 0; queue.length; tick++) {
      const run = queue.splice(0, nc);
      run.forEach((ti, c) => { lanes[c][tick] = ti; rem[ti]--; });
      run.forEach(ti => { if (rem[ti] > 0) queue.push(ti); else fin[ti] = tick + 1; });
    }
    const total = Math.max(...fin);
    return { lanes, fin, total };
  };
  const draw = () => {
    const s = schedule(cores), total = s.total, shown = Math.min(t, total);
    const cell = (ti, x) => ti === undefined ? `<div style="height:34px;border-radius:6px;border:1px dashed var(--line)"></div>` :
      `<div style="height:34px;border-radius:6px;background:${COLORS[ti]};opacity:${x < shown ? 1 : .18};display:grid;place-items:center;color:#fff;font:600 13px var(--mono)">${TASKS[ti][0]}</div>`;
    const tickCount = Math.max(12, total);
    const body = s.lanes.map((lane, c) => `<div style="display:grid;grid-template-columns:62px repeat(${tickCount},minmax(0,1fr));gap:3px;align-items:center;margin-bottom:5px"><span class="small muted">Core ${c + 1}</span>${Array.from({ length: tickCount }, (_, x) => cell(lane[x], x)).join('')}</div>`).join('');
    const axis = `<div style="display:grid;grid-template-columns:62px repeat(${tickCount},minmax(0,1fr));gap:3px"><span class="tiny muted">time</span>${Array.from({ length: tickCount }, (_, x) => `<span class="tiny muted" style="text-align:center;${x === shown - 1 ? 'color:var(--accent);font-weight:700' : ''}">${x + 1}</span>`).join('')}</div>`;
    $(el, '[data-chart]').innerHTML = body + axis;
    $(el, '[data-read]').innerHTML = `<div><div class="k">cores</div><div class="v">${cores}</div></div>
      <div><div class="k">total time</div><div class="v accent">${total}</div></div>
      <div><div class="k">A, B, C finish at</div><div class="v">${s.fin.join(', ')}</div></div>
      <div><div class="k">at same instant</div><div class="v">${Math.min(cores, 3) === 1 ? '1 task' : Math.min(cores, 3) + ' tasks'}</div></div>`;
    $(el, '[data-note]').innerHTML = cores === 1
      ? `<b>Concurrency.</b> Three tasks all make progress, but they take turns on one core, so only one runs at any instant. Good for responsiveness: nobody waits for the whole of A before B starts. Total time is not shorter.`
      : cores === 2
        ? `<b>Both.</b> Two tasks truly run at the same instant (parallelism) while three tasks share the cores (concurrency). Total time drops.`
        : `<b>Parallelism.</b> Three cores, three tasks, all running <b>simultaneously</b>. The same work finishes in a third of the time.`;
    $(el, 'input[type=range]').value = shown; $(el, '[data-tv]').textContent = shown;
  };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } const b = $(el, '[data-play]'); if (b) b.innerHTML = '<i class="ph ph-play"></i>Play'; };
  el.innerHTML = `${bench('git-fork', 'Concurrency vs parallelism', 'Three tasks (4 units of work each): change the number of cores')}
    <div class="bench-body">
      <div class="controls">
        <div class="field"><span class="lbl">Cores</span>${seg([[1, '1 core'], [2, '2 cores'], [3, '3 cores']], 1)}</div>
        <div class="field"><label for="u4ct">Time shown: <span class="val" data-tv>12</span></label><input id="u4ct" type="range" min="0" max="12" value="12"></div>
        <button class="btn sm" data-play><i class="ph ph-play"></i>Play</button>
      </div>
      <div data-chart style="overflow-x:auto"></div>
      <div class="readout" data-read></div>
      <p class="small" data-note style="margin-top:10px"></p>
    </div>`;
  on(el, '.seg button', 'click', (e, b) => { cores = +b.dataset.v; setSeg($(el, '.seg'), cores); stop(); t = 12; draw(); });
  on(el, 'input[type=range]', 'input', (e, r) => { stop(); t = +r.value; draw(); });
  on(el, '[data-play]', 'click', () => {
    if (timer) return stop();
    if (reduced()) { t = 12; return draw(); }
    t = 0; draw();
    $(el, '[data-play]').innerHTML = '<i class="ph ph-pause"></i>Pause';
    timer = setInterval(() => { t++; draw(); if (t >= schedule(cores).total) stop(); }, 450);
  });
  draw();
  return stop;
}

// ---------------------------------------------------------------- concept sorter (lecture)
export function u4Concepts(el) {
  sorter(el, {
    id: 'u4-concepts', icon: 'tag', title: 'Which concept is this?', cols: 280,
    options: ['Currying', 'Partial application', 'Laziness', 'Pattern matching', 'Concurrency', 'Parallelism'],
    items: [
      { t: '<code>add(2)(3)</code> where <code>add = a =&gt; b =&gt; a + b</code>', a: 'Currying', why: 'Each function takes exactly one argument and returns the next function.' },
      { t: '<code>const times2 = multiply.bind(null, 2)</code>', a: 'Partial application', why: 'One argument is pre-filled and a function for the rest comes back.' },
      { t: 'A list of all natural numbers where only the elements you read are ever computed', a: 'Laziness', why: 'Deferring work until a value is needed is what allows infinite data structures.' },
      { t: 'A <code>switch</code> returns "Weekend" for "Saturday" or "Sunday" instead of a long if-else', a: 'Pattern matching', why: 'The value is compared against predefined patterns and the matching case acts.' },
      { t: 'A chat app stays responsive while it downloads a file and refreshes messages, even on a single core', a: 'Concurrency', why: 'Tasks overlap in time and make independent progress, not necessarily simultaneously.' },
      { t: 'A big image is cut into 4 tiles and each tile is processed at the same time on 4 cores', a: 'Parallelism', why: 'One larger task divided into independent subtasks executed simultaneously, for performance.' },
      { t: 'The expression <code>1 + expensive()</code> is never evaluated because its value is never needed', a: 'Laziness', why: 'On-demand evaluation avoids unnecessary computation.' },
      { t: 'Turn <code>f(a, b, c)</code> into <code>f(a)(b)(c)</code>', a: 'Currying', why: 'Multi-argument function becomes a chain of single-argument functions.' },
    ],
  });
}

// ---------------------------------------------------------------- spec clause sorter
export function u4Spec(el) {
  sorter(el, {
    id: 'u4-spec', icon: 'file-text', title: 'Spec clause sorter', cols: 280,
    hint: 'Specification for <code>withdraw(balance, amount)</code> and <code>find(a, val)</code>. Which clause does each statement belong to?',
    options: ['requires', 'effects', 'modifies'],
    items: [
      { t: '<code>amount &gt; 0 and amount &lt;= balance</code>', a: 'requires', why: 'Must be true before the call. Responsibility of the caller.' },
      { t: '<code>returns balance - amount</code>', a: 'effects', why: 'Guaranteed after execution. Responsibility of the implementer.' },
      { t: '<code>nothing</code> (the function changes no state)', a: 'modifies', why: 'Frame condition: which variables may change. Can be omitted when nothing is modified.' },
      { t: '<code>val occurs exactly once in a</code>', a: 'requires', why: 'An assumption about the input that the caller must guarantee.' },
      { t: '<code>returns the index i such that a[i] == val</code>', a: 'effects', why: 'The outcome the method guarantees if the precondition held.' },
      { t: '<code>the array a is sorted in place</code> (for a sort function)', a: 'modifies', why: 'It names the state the method is allowed to change (frame condition, related to the postcondition).' },
      { t: '<code>throws an exception if the list is empty</code> (for a function that handles empty lists)', a: 'effects', why: 'Thrown exceptions are part of the guaranteed outcome, so they belong to the postcondition.' },
      { t: '<code>the input list is not empty</code>', a: 'requires', why: 'A condition on the input before the call. If violated, behaviour is not guaranteed.' },
    ],
  });
}

// ---------------------------------------------------------------- who is at fault
export function u4Blame(el) {
  sorter(el, {
    id: 'u4-blame', icon: 'scales', title: 'Who is responsible?', cols: 280,
    hint: 'Specification of <code>withdraw</code>: requires <code>amount &gt; 0 and amount &lt;= balance</code>, effects returns <code>balance - amount</code>.',
    options: ['Caller', 'Implementer'],
    items: [
      { t: '<code>withdraw(100, 250)</code> returns -150', a: 'Caller', why: 'amount &gt; balance violates the precondition, so the behaviour is not guaranteed.' },
      { t: '<code>withdraw(100, 30)</code> returns 130', a: 'Implementer', why: 'The precondition holds, so the postcondition (70) must hold. The code is wrong.' },
      { t: '<code>withdraw(100, -20)</code> returns 120', a: 'Caller', why: 'amount &gt; 0 was required. Garbage in, unspecified out.' },
      { t: '<code>withdraw(50, 50)</code> returns 0', a: 'Implementer', why: 'Allowed input (amount &lt;= balance) and a correct result: nothing wrong. The implementer fulfilled the contract.' },
      { t: '<code>withdraw(80, 20)</code> also prints "done" and changes a global counter', a: 'Implementer', why: 'The spec says modifies: nothing. Extra side effects break the frame condition.' },
    ],
  });
}

// ---------------------------------------------------------------- design smell spotter
export function u4Smells(el) {
  sorter(el, {
    id: 'u4-smells', icon: 'bug', title: 'Spot the design problem', cols: 280,
    hint: 'Lab examples <code>sumFind</code> and <code>countLongWords</code>. What is wrong with each snippet?',
    options: ['Global variable', 'Prints, not returns', 'Multiple responsibilities', 'Magic number', 'Fine'],
    items: [
      { t: '<code>public static String longestWord;</code>', a: 'Global variable', why: 'Java globals are <code>public static</code>: reachable from anywhere, one shared instance.' },
      { t: '<code>System.out.println(count);</code> at the end of a counting method', a: 'Prints, not returns', why: 'Methods should return results so other code can reuse and test them.' },
      { t: '<code>sumFind(a, b, val)</code>: returns the sum of all indices of val in two arrays', a: 'Multiple responsibilities', why: 'It searches two arrays and sums the indices. Split into a find function and a sum function.' },
      { t: '<code>area = 3.14 * r * r;</code>', a: 'Magic number', why: 'A hard-coded literal with no name. Use a constant such as <code>PI</code>.' },
      { t: '<code>function getTotal(items) { return items.reduce((s, i) =&gt; s + i.price, 0); }</code>', a: 'Fine', why: 'One responsibility, a clear name, returns its result, no global state.' },
      { t: 'A method that counts the long words <b>and</b> finds the longest word', a: 'Multiple responsibilities', why: 'Two jobs in one function make it hard to specify. One responsibility, easier specification, easier testing, easier reuse.' },
      { t: '<code>if (word.length &gt; 5)</code> repeated in 4 places with the literal 5', a: 'Magic number', why: 'Unexplained literal (and repeated, which also breaks DRY). Name it <code>LONG_WORD_LENGTH</code>.' },
    ],
  });
}

// ---------------------------------------------------------------- naming fixer
export function u4Names(el) {
  const ITEMS = [
    { role: 'A constant: the maximum number of login attempts', bad: 'maxAttempts', opts: ['MAX_ATTEMPTS', 'maxAttempts', 'MaxAttempts', 'max_attempts'], a: 0, why: 'Constants use UPPER_SNAKE_CASE (like LONG_WORD_LENGTH).' },
    { role: 'A variable holding the total price of a cart', bad: 'Total_Price', opts: ['totalPrice', 'TotalPrice', 'TOTAL_PRICE', 'total_Price'], a: 0, why: 'Variables use camelCase.' },
    { role: 'A class for a bank account', bad: 'bankAccount', opts: ['BankAccount', 'bankAccount', 'BANK_ACCOUNT', 'bank_account'], a: 0, why: 'Classes use PascalCase.' },
    { role: 'A boolean telling whether the user is active', bad: 'active', opts: ['isActive', 'active', 'activeFlag', 'IS_ACTIVE'], a: 0, why: 'Booleans take an is / has / are prefix (isActive, hasEncryption, areEqual).' },
    { role: 'A private balance field inside a class', bad: 'balance', opts: ['_balance', 'BALANCE', 'Balance', 'balance_'], a: 0, why: 'A private variable can be prefixed with an underscore (not a standard practice, just a convention).' },
    { role: 'A function that returns a user\'s name', bad: 'name', opts: ['getName', 'name', 'NameGetter', 'GET_NAME'], a: 0, why: 'Functions are camelCase and verb-like: <code>name</code> is bad, <code>getName</code> is good.' },
    { role: 'A boolean telling whether the data has encryption', bad: 'encryption', opts: ['hasEncryption', 'encryption', 'isEncryption', 'encrypted_flag'], a: 0, why: '"has" fits ownership of a feature: hasEncryption.' },
  ];
  const picked = {};
  const render = () => {
    const done = Object.keys(picked).length, right = ITEMS.filter((it, i) => picked[i] === it.a).length;
    el.innerHTML = `${bench('text-aa', 'Naming convention fixer', `<span class="num">${right}/${ITEMS.length}</span> correct`)}
    <div class="bench-body">
      <p class="small muted" style="margin-bottom:12px">Each declaration has a badly chosen name. Pick the correct one.</p>
      <div class="sort-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">
        ${ITEMS.map((it, i) => {
          const p = picked[i], cls = p === undefined ? '' : p === it.a ? 'right' : 'wrong';
          return `<div class="sort-item ${cls}"><div>${it.role}<br><span class="small muted">Currently: </span><code>${esc(it.bad)}</code></div>
            ${p === undefined ? `<div class="opts">${it.opts.map((o, j) => `<button type="button" data-i="${i}" data-j="${j}">${esc(o)}</button>`).join('')}</div>`
              : `<div class="why"><strong>${esc(it.opts[it.a])}.</strong> ${p !== it.a ? `You picked ${esc(it.opts[p])}. ` : ''}${it.why}</div>`}</div>`;
        }).join('')}
      </div>
      <div style="margin-top:14px"><button class="btn sm" data-reset><i class="ph ph-arrow-counter-clockwise"></i>Reset</button>
      ${done === ITEMS.length ? `<span class="small ${right === ITEMS.length ? 'hl' : 'muted'}" style="margin-left:10px">${right === ITEMS.length ? 'Perfect run.' : 'Review the red cards, then try again.'}</span>` : ''}</div>
    </div>`;
  };
  on(el, '[data-j]', 'click', (e, b) => {
    picked[+b.dataset.i] = +b.dataset.j;
    if (Object.keys(picked).length === ITEMS.length) recordScore('u4-names', ITEMS.filter((it, i) => picked[i] === it.a).length, ITEMS.length);
    render();
  });
  on(el, '[data-reset]', 'click', () => { Object.keys(picked).forEach(k => delete picked[k]); render(); });
  render();
}

// ---------------------------------------------------------------- bind and arrow wrappers
export function u4Bind(el) {
  const P = ['width', 'length', 'height'];
  let mode = 'fix', fixed = [true, false, false], val = [5, 2, 10];
  const volume = (w, l, h) => l * w * h;
  const fixView = () => {
    const k = fixed.findIndex(f => !f);
    const prefix = k === -1 ? 3 : k;
    const isPrefix = fixed.every((f, i) => (i < prefix ? f : !f));
    const nFixed = fixed.filter(Boolean).length;
    const rest = P.map((p, i) => i).filter(i => !fixed[i]);
    const callArgs = rest.map(i => val[i]);
    const result = volume(...P.map((p, i) => val[i]));
    let codeTxt, verdict;
    if (nFixed === 0) { codeTxt = 'volume(width, length, height)   // nothing pre-filled yet'; verdict = 'Tick at least one parameter to fix.'; }
    else if (isPrefix) {
      codeTxt = `const f = volume.bind(null, ${P.slice(0, prefix).map((p, i) => val[i]).join(', ')});\nf(${callArgs.join(', ')});   // = volume(${P.map((p, i) => val[i]).join(', ')}) = ${result}`;
      verdict = `<span class="hl">bind works:</span> the fixed arguments are the leftmost ones. bind pre-fills <b>from the left</b>.`;
    } else {
      const names = rest.map(i => P[i]);
      codeTxt = `// bind CANNOT do this: it can only pre-fill a prefix (from the left)\nconst f = (${names.join(', ')}) =>\n  volume(${P.map((p, i) => (fixed[i] ? val[i] : p)).join(', ')});\nf(${callArgs.join(', ')});   // = ${result}`;
      verdict = `<span style="color:var(--bad)"><b>bind can't fix only ${P.filter((p, i) => fixed[i]).join(' + ')}.</b></span> Use an <b>arrow function wrapper</b>, which can fix any position.`;
    }
    return `<div class="controls">${P.map((p, i) => `<div class="field"><label><input type="checkbox" data-fix="${i}" ${fixed[i] ? 'checked' : ''}> fix <b>${p}</b></label>
        <input class="num" type="number" value="${val[i]}" data-val="${i}" aria-label="${p} value" style="width:100%"></div>`).join('')}</div>
      <p class="small muted">Signature: <code>function volume(width, length, height)</code>. Unticked values are passed at call time.</p>
      <pre class="code">${esc(codeTxt)}</pre><p class="small">${verdict}</p>`;
  };
  const thisView = () => {
    const add = function (a, b) { return a + b; };
    const variants = {
      good: { code: 'const m = volume.bind(null, 5);\nm(2, 10);', run: () => volume.bind(null, 5)(2, 10), why: 'First argument is <code>this</code> (null = "I don\'t care"). Then 5 pre-fills width: 2 * 5 * 10 = 100.' },
      trap: { code: 'const m = volume.bind(5);\nm(2, 10);', run: () => volume.bind(5)(2, 10), why: 'The 5 became <code>this</code>, not an argument. Nothing is pre-filled, so height is undefined and the result is NaN.' },
      slide: { code: 'function add(a, b) { return a + b; }\nconst add2 = add.bind(2, null);\nadd2(3);', run: () => add.bind(2, null)(3), why: 'Slide trap: 2 is <code>this</code>, null is the first argument a. So a = null, b = 3 and null + 3 = 3.' },
    };
    return `<div style="margin-bottom:12px">${seg([['good', 'bind(null, 5)'], ['trap', 'bind(5)'], ['slide', 'add.bind(2, null)']], tv, 'data-t')}</div>
      <pre class="code">${esc(variants[tv].code)}</pre><div class="readout"><div><div class="k">result</div><div class="v accent">${variants[tv].run()}</div></div></div>
      <p class="small" style="margin-top:10px">${variants[tv].why}</p>`;
  };
  let tv = 'good';
  const draw = () => {
    $(el, '[data-body]').innerHTML = mode === 'fix' ? fixView() : thisView();
    setSeg($(el, '[data-main]'), mode);
  };
  el.innerHTML = `${bench('link-simple', 'bind() and arrow wrappers', 'bind fills from the left')}
    <div class="bench-body"><div data-main style="margin-bottom:14px">${seg([['fix', 'Which args can I fix?'], ['this', 'The "this" trap']], mode)}</div><div data-body></div></div>`;
  on(el, '[data-main] button', 'click', (e, b) => { mode = b.dataset.v; draw(); });
  on(el, '[data-body] [data-t]', 'click', (e, b) => { tv = b.dataset.t; draw(); });
  on(el, '[data-fix]', 'change', (e, c) => { fixed[+c.dataset.fix] = c.checked; draw(); });
  on(el, '[data-val]', 'change', (e, c) => { val[+c.dataset.val] = num(c.value); draw(); });
  draw();
}

// ---------------------------------------------------------------- pattern matching tester
export function u4Match(el) {
  const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const SW = {
    day: {
      title: 'getDayType(day)', def: '"Sunday"', quick: ['Saturday', 'Sunday', 'Friday', 'friday', 'Funday'],
      cases: [
        { lab: 'case "Saturday":', v: 'Saturday' }, { lab: 'case "Sunday":', v: 'Sunday', body: 'return "Weekend";' },
        { lab: 'case "Monday":', v: 'Monday' }, { lab: 'case "Tuesday":', v: 'Tuesday' }, { lab: 'case "Wednesday":', v: 'Wednesday' },
        { lab: 'case "Thursday":', v: 'Thursday' }, { lab: 'case "Friday":', v: 'Friday', body: 'return "Weekday";' },
      ],
      dflt: 'return "Invalid day";', parse: (s) => s,
    },
    shape: {
      title: 'getShapeType(sides)', def: '4', quick: ['3', '4', '5', '7'], strOpt: true,
      cases: [{ lab: 'case 3:', v: 3, body: 'return "Triangle";' }, { lab: 'case 4:', v: 4, body: 'return "Square";' }, { lab: 'case 5:', v: 5, body: 'return "Pentagon";' }],
      dflt: 'return "Unknown Shape";', parse: (s, asStr) => (asStr ? s : (s.trim() === '' ? NaN : Number(s))),
    },
  };
  let kind = 'day', input = 'Saturday', asStr = false;
  const evalSwitch = (def, val) => {
    const idx = def.cases.findIndex(c => c.v === val);
    const rows = [];
    if (idx === -1) {
      def.cases.forEach(c => rows.push({ t: c.lab + (c.body ? ' ' + c.body : ''), s: 'no' }));
      rows.push({ t: 'default: ' + def.dflt, s: 'hit' });
      return { rows, result: def.dflt.replace(/return "(.*)";/, '$1'), note: 'No case equals the value (switch compares with strict ===), so default runs.' };
    }
    let end = idx; while (!def.cases[end].body) end++;
    def.cases.forEach((c, i) => rows.push({ t: c.lab + (c.body ? ' ' + c.body : ''), s: i < idx ? 'skip' : i === idx ? 'hit' : i <= end ? 'fall' : 'no' }));
    rows.push({ t: 'default: ' + def.dflt, s: 'no' });
    const body = def.cases[end].body.replace(/return "(.*)";/, '$1');
    return { rows, result: body, note: end > idx ? `Matched case ${def.cases[idx].lab.slice(5, -1)} has no body, so it <b>falls through</b> to the next case until a return is reached.` : 'Matched and returned immediately.' };
  };
  const evalAge = (age) => {
    const rows = [
      { t: 'if (age < 18) return "Minor";', test: age < 18, r: 'Minor' },
      { t: 'else if (age >= 18 && age < 65) return "Adult";', test: age >= 18 && age < 65, r: 'Adult' },
      { t: 'else return "Senior";', test: true, r: 'Senior' },
    ];
    let hit = rows.findIndex(r => r.test);
    return { rows: rows.map((r, i) => ({ t: r.t, s: i < hit ? 'skip' : i === hit ? 'hit' : 'no' })), result: rows[hit].r, note: age >= 64 && age <= 65 ? 'Boundary check: the Adult branch uses age &lt; 65, so 65 is already Senior.' : age === 18 ? 'Boundary check: 18 is not &lt; 18, so it is not Minor.' : 'Conditions are tested top to bottom, the first true one wins.' };
  };
  const STY = { hit: 'background:var(--accent-soft);color:var(--accent);font-weight:600', fall: 'background:var(--accent-soft);color:var(--accent)', skip: 'color:var(--faint);text-decoration:line-through', no: 'color:var(--muted)' };
  const TAG = { hit: 'matches', fall: 'falls through', skip: 'false / no match', no: '' };
  const draw = () => {
    let r, head;
    if (kind === 'age') {
      const age = Number(input);
      if (input.trim() === '' || Number.isNaN(age)) { $(el, '[data-out]').innerHTML = '<p class="small muted">Type a number for the age.</p>'; return; }
      r = evalAge(age); head = `matchPerson({ name: "A", age: ${age} })`;
    } else {
      const def = SW[kind], val = def.parse(input, asStr);
      r = evalSwitch(def, val); head = `${def.title.split('(')[0]}(${kind === 'day' ? JSON.stringify(input) : asStr ? JSON.stringify(input) : (Number.isNaN(val) ? 'NaN' : val)})`;
    }
    $(el, '[data-out]').innerHTML = `<pre class="code" style="padding:0;overflow:hidden">${r.rows.map(x => `<div style="padding:2px 12px;${STY[x.s]}">${esc(x.t)}${TAG[x.s] ? `<span class="tiny" style="float:right;font-family:var(--sans)">${TAG[x.s]}</span>` : ''}</div>`).join('')}</pre>
      <div class="readout"><div><div class="k">call</div><div class="v" style="font-size:14px;overflow-wrap:anywhere">${esc(head)}</div></div><div><div class="k">returns</div><div class="v accent">"${esc(r.result)}"</div></div></div>
      <p class="small muted" style="margin-top:8px">${r.note}</p>`;
  };
  const shell = () => {
    const quick = kind === 'age' ? ['10', '17', '18', '30', '64', '65', '90'] : SW[kind].quick;
    el.innerHTML = `${bench('equals', 'Pattern matching tester', 'Type an input and see which case matches')}
    <div class="bench-body">
      ${seg([['day', 'getDayType'], ['shape', 'getShapeType'], ['age', 'matchPerson']], kind)}
      <div class="controls" style="margin-top:14px">
        <div class="field"><label for="u4mi">${kind === 'day' ? 'day' : kind === 'shape' ? 'sides' : 'age'}</label><input id="u4mi" class="num" value="${esc(input)}" style="width:100%" autocomplete="off"></div>
        ${kind === 'shape' ? `<label class="small" style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-str ${asStr ? 'checked' : ''}> pass it as a string ("4")</label>` : ''}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">${quick.map(q => `<button class="chip" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>
      <div data-out></div>
    </div>`;
    draw();
  };
  on(el, '.seg button', 'click', (e, b) => { kind = b.dataset.v; input = kind === 'day' ? 'Saturday' : kind === 'shape' ? '4' : '17'; asStr = false; shell(); });
  on(el, '[data-q]', 'click', (e, b) => { input = b.dataset.q; $(el, '#u4mi').value = input; draw(); });
  on(el, '#u4mi', 'input', (e, i) => { input = i.value; draw(); });
  on(el, '[data-str]', 'change', (e, c) => { asStr = c.checked; draw(); });
  shell();
}
