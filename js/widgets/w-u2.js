// Unit 2 simulators: Imperative & Declarative Programming (lecture) + Code Quality (lab).
import { bench, $, $$, on, seg, setSeg, esc, reduced } from '../viz.js';
import { sorter } from './sorter.js';

const chipStyle = 'display:inline-block;min-width:28px;text-align:center;padding:1px 7px;margin:2px;border-radius:6px;border:1px solid var(--line);background:var(--surface-2);font:13px var(--mono);';
const numChip = (v, mode = '') => {
  const extra = mode === 'keep' ? 'border-color:var(--accent);background:var(--accent-soft);color:var(--accent);font-weight:600;'
    : mode === 'drop' ? 'opacity:.4;text-decoration:line-through;'
    : mode === 'new' ? 'border-color:var(--good);background:var(--good-soft);color:var(--good);font-weight:600;' : '';
  return `<span style="${chipStyle}${extra}">${v}</span>`;
};
const lineHtml = (text, cls = '') => {
  const st = cls === 'bad' ? 'background:var(--bad-soft);box-shadow:inset 2px 0 0 var(--bad);' : cls === 'dim' ? 'opacity:.4;' : '';
  return `<span class="dom-line ${cls === 'hit' ? 'hit' : ''}" style="${st}">${esc(text) || ' '}</span>`;
};

// ------------------------------------------------------------------
// 1. Same task, two styles: imperative loop vs declarative pipeline
// ------------------------------------------------------------------
const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const TASKS = {
  even: {
    label: 'Keep the even numbers', res: 'evenNumbers', test: 'numbers[i] % 2 === 0', push: 'numbers[i]',
    cond: n => n % 2 === 0, val: n => n,
    decl: [{ code: '.filter(n => n % 2 === 0)', kind: 'filter', fn: n => n % 2 === 0 }],
  },
  sq: {
    label: 'Square the odd numbers', res: 'squaredOddNumbers', test: 'numbers[i] % 2 !== 0', push: 'numbers[i] ** 2',
    cond: n => n % 2 !== 0, val: n => n ** 2,
    decl: [{ code: '.filter(num => num % 2 !== 0)', kind: 'filter', fn: n => n % 2 !== 0 }, { code: '.map(num => num ** 2)', kind: 'map', fn: n => n ** 2 }],
  },
};

function twinTrace(t) {
  const out = [{ line: 0, i: null, n: null, test: null, res: [], note: 'Declare the input array.' }];
  const res = [];
  out.push({ line: 1, i: null, n: null, test: null, res: [...res], note: `Create an empty array. This is <strong>mutable state</strong> we will keep changing.` });
  for (let i = 0; i < NUMS.length; i++) {
    const n = NUMS[i];
    out.push({ line: 2, i, n, test: null, res: [...res], note: `Loop: <code>i = ${i}</code>, and ${i} &lt; ${NUMS.length}, so run the body.` });
    const ok = t.cond(n);
    out.push({ line: 3, i, n, test: ok, res: [...res], note: `Check <code>${esc(t.test.replace('numbers[i]', n))}</code> : <strong>${ok}</strong>.` });
    if (ok) { res.push(t.val(n)); out.push({ line: 4, i, n, test: ok, res: [...res], note: `Mutate: push <strong>${t.val(n)}</strong> into the result array.` }); }
  }
  out.push({ line: 2, i: NUMS.length, n: null, test: null, res: [...res], note: `<code>i = ${NUMS.length}</code>, and ${NUMS.length} &lt; ${NUMS.length} is false: the loop ends.` });
  out.push({ line: 7, i: NUMS.length, n: null, test: null, res: [...res], note: 'Print the result. Done.' });
  return out;
}

export function u2Twin(el) {
  const st = { task: 'even', step: 0, timer: null };
  let trace = twinTrace(TASKS[st.task]);
  const stop = () => { if (st.timer) { clearInterval(st.timer); st.timer = null; } };
  const render = () => {
    const t = TASKS[st.task], s = trace[st.step], last = trace.length - 1;
    const lines = [
      'const numbers = [1,2,3,4,5,6,7,8,9,10];',
      `const ${t.res} = [];`,
      'for (let i = 0; i < numbers.length; i++) {',
      `  if (${t.test}) {`,
      `    ${t.res}.push(${t.push});`,
      '  }',
      '}',
      `console.log(${t.res});`,
    ];
    const nStages = t.decl.length;
    const shown = st.step === 0 ? 0 : Math.ceil((st.step / last) * nStages);
    let cur = NUMS, declHtml = '';
    t.decl.forEach((d, k) => {
      const active = k < shown;
      const input = cur, output = input.filter(d.fn).map(x => x);
      let chips;
      if (d.kind === 'filter') {
        chips = input.map(x => numChip(x, active ? (d.fn(x) ? 'keep' : 'drop') : '')).join('');
        cur = input.filter(d.fn);
      } else {
        const mapped = input.map(d.fn);
        chips = active ? mapped.map(x => numChip(x, 'new')).join('') : input.map(x => numChip(x)).join('');
        cur = mapped;
      }
      declHtml += `<div style="margin-top:10px;${active ? '' : 'opacity:.45'}"><div class="tiny muted" style="font-family:var(--mono)">${active ? '' : 'not evaluated yet : '}${esc(d.code)}</div><div>${chips}</div></div>`;
    });
    const finalOut = shown === nStages ? cur : null;
    el.innerHTML = `${bench('git-diff', 'Same task, two styles', 'Step through the loop; watch the pipeline keep pace')}
    <div class="bench-body">
      <div class="controls" style="align-items:center;margin-bottom:12px">
        ${seg(Object.entries(TASKS).map(([k, v]) => [k, v.label]), st.task)}
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn sm primary" data-act="step" ${st.step >= last ? 'disabled' : ''}><i class="ph ph-arrow-line-down"></i>Step</button>
          <button class="btn sm" data-act="play" ${st.step >= last ? 'disabled' : ''}><i class="ph ph-${st.timer ? 'pause' : 'play'}"></i>${st.timer ? 'Pause' : 'Play'}</button>
          <button class="btn sm" data-act="reset"><i class="ph ph-arrow-counter-clockwise"></i>Reset</button>
        </div>
      </div>
      <div class="two">
        <div>
          <div class="small" style="font-weight:600;margin-bottom:4px"><i class="ph ph-list-numbers"></i> Imperative : HOW</div>
          <pre class="code" style="margin:0">${lines.map((l, k) => lineHtml(l, k === s.line && (st.step > 0 || k === 0) ? 'hit' : '')).join('')}</pre>
          <div class="readout">
            <div><div class="k">i</div><div class="v">${s.i === null ? '-' : s.i}</div></div>
            <div><div class="k">numbers[i]</div><div class="v">${s.n === null ? '-' : s.n}</div></div>
            <div><div class="k">test</div><div class="v ${s.test ? 'accent' : ''}">${s.test === null ? '-' : s.test}</div></div>
          </div>
          <div style="margin-top:8px"><div class="tiny muted">${t.res} (mutated)</div><div>${s.res.length ? s.res.map(v => numChip(v, 'new')).join('') : '<span class="small muted">[ ]</span>'}</div></div>
        </div>
        <div>
          <div class="small" style="font-weight:600;margin-bottom:4px"><i class="ph ph-funnel"></i> Declarative : WHAT</div>
          <pre class="code" style="margin:0">${lineHtml('const numbers = [1,2,3,4,5,6,7,8,9,10];')}${lineHtml(`const ${t.res} = numbers`)}${t.decl.map(d => lineHtml('  ' + d.code + (d === t.decl[nStages - 1] ? ';' : ''))).join('')}${lineHtml(`console.log(${t.res});`)}</pre>
          <div class="tiny muted" style="margin-top:8px">Data flowing through each stage (no variable is changed by hand)</div>
          <div style="margin-top:4px"><div class="tiny muted" style="font-family:var(--mono)">numbers</div><div>${NUMS.map(x => numChip(x)).join('')}</div></div>
          ${declHtml}
        </div>
      </div>
      <div class="explain">${st.step === 0 ? 'Press <strong>Step</strong>. The left side runs one line at a time. The right side states the result and lets <code>filter</code>/<code>map</code> do the looping.' : s.note}
        ${st.step >= last ? `<br><strong>Same answer both ways:</strong> [${(finalOut || s.res).join(', ')}]. The imperative side needed ${last + 1} steps and a mutable array; the declarative side is ${nStages} stage${nStages > 1 ? 's' : ''} describing the result.` : ''}</div>
    </div>`;
  };
  const advance = () => { if (st.step < trace.length - 1) st.step++; if (st.step >= trace.length - 1) stop(); render(); };
  on(el, '[data-act]', 'click', (e, b) => {
    const a = b.dataset.act;
    if (a === 'step') { stop(); advance(); }
    else if (a === 'reset') { stop(); st.step = 0; render(); }
    else if (a === 'play') {
      if (st.timer) { stop(); render(); return; }
      if (reduced()) { st.step = trace.length - 1; render(); return; }
      st.timer = setInterval(advance, 500); render();
    }
  });
  on(el, '.seg button', 'click', (e, b) => { stop(); st.task = b.dataset.v; trace = twinTrace(TASKS[st.task]); st.step = 0; render(); });
  render();
  return stop;
}

// ------------------------------------------------------------------
// 2. Classify: imperative or declarative?
// ------------------------------------------------------------------
export function u2Classify(el) {
  const c = s => `<code>${esc(s)}</code>`;
  sorter(el, {
    id: 'u2-classify', icon: 'git-branch', title: 'Imperative or declarative?', options: ['Imperative', 'Declarative'], cols: 260,
    hint: 'Decide for each snippet: does it spell out HOW, or state WHAT is wanted?',
    items: [
      { t: c('SELECT name FROM users WHERE age > 18'), a: 'Declarative', why: 'SQL says what rows you want. The database engine decides how to find them.' },
      { t: c('<ul><li>Home</li><li>About</li></ul>'), a: 'Declarative', why: 'HTML (a markup language) describes what the page contains, not the steps to draw it.' },
      { t: c('total = 0; for (i = 0; i < n; i++) { total += a[i]; }'), a: 'Imperative', why: 'A mutable variable updated inside an explicit loop: the classic how.' },
      { t: c('nums.map(n => n * 2)'), a: 'Declarative', why: 'You state the transformation. The looping is hidden inside <code>map</code>.' },
      { t: c('sum [x*x | x <- [1..10], odd x]') + '<div class="tiny muted">Haskell</div>', a: 'Declarative', why: 'Haskell is a declarative (functional) language: an expression describing the result.' },
      { t: c('grandparent(X,Z) :- parent(X,Y), parent(Y,Z).') + '<div class="tiny muted">Prolog</div>', a: 'Declarative', why: 'A rule describing a relationship. Prolog finds the answers itself.' },
      { t: 'Selenium test: find the username field, type "user123", find the password field, type it, click Login, check the page.', a: 'Imperative', why: 'Every low-level step of how the test is performed is spelled out.' },
      { t: 'Given the user is on the login page, When the user enters valid credentials, Then the dashboard is displayed.', a: 'Declarative', why: 'Given/When/Then states the expected behaviour (what), not the clicks.' },
      { t: c('while (i < 10) { if (a[i] % 2 === 0) count++; i++; }') + '<div class="tiny muted">C / Java style</div>', a: 'Imperative', why: 'Explicit control flow (while, if) and mutated counters.' },
    ],
  });
}

// ------------------------------------------------------------------
// 3. Arrow anti-pattern vs Return Early
// ------------------------------------------------------------------
const CONDS = [
  { ok: 'order != null', bad: 'order == null' },
  { ok: 'order.isPaid()', bad: '!order.isPaid()' },
  { ok: 'order.isInStock()', bad: '!order.isInStock()' },
  { ok: 'order.hasAddress()', bad: '!order.hasAddress()' },
];
const SCEN = [['ok', 'Valid order'], ['0', 'null order'], ['1', 'Unpaid'], ['2', 'Out of stock'], ['3', 'No address']];

export function u2Arrow(el) {
  const st = { early: false, scen: 'ok' };
  const render = () => {
    const k = st.scen === 'ok' ? 4 : +st.scen;
    let lines, depth, fail = null;
    if (!st.early) {
      lines = [{ t: 'public void processOrder(Order order) {' }];
      CONDS.forEach((c, i) => lines.push({ t: '  '.repeat(i + 1) + `if (${c.ok}) {`, cond: i }));
      lines.push({ t: '  '.repeat(5) + '// process the order', main: true });
      for (let i = 3; i >= 0; i--) lines.push({ t: '  '.repeat(i + 1) + '}', close: true });
      lines.push({ t: '}' });
      depth = 4;
    } else {
      lines = [{ t: 'public void processOrder(Order order) {' }];
      CONDS.forEach((c, i) => lines.push({ t: `  if (${c.bad}) return;`, cond: i }));
      lines.push({ t: '' });
      lines.push({ t: '  // process the order', main: true });
      lines.push({ t: '}' });
      depth = 1;
    }
    const rendered = lines.map((l, idx) => {
      let cls = '';
      if (idx === 0) cls = 'hit';
      else if (l.cond !== undefined) cls = l.cond < k ? 'hit' : l.cond === k ? 'bad' : 'dim';
      else if (l.main) cls = k === 4 ? 'hit' : 'dim';
      else if (l.close) cls = 'dim';
      return lineHtml(l.t, cls);
    }).join('');
    const reason = k < 4 ? CONDS[k].bad : null;
    let msg;
    if (k === 4) msg = '<strong>Main logic runs.</strong> All guards passed' + (st.early ? ', and the happy path sits at the left margin.' : ', but it is buried four levels deep.');
    else if (st.early) msg = `<strong>Exits at guard ${k + 1}</strong> (<code>${esc(reason)}</code>). The reader sees exactly where and why execution stopped, and nothing below it runs.`;
    else msg = `<strong>Fails at the <code>if</code> on level ${k + 1}.</strong> Control then falls out through ${4 - k} closing brace${4 - k === 1 ? '' : 's'} and the function ends with no signal. Which <code>else</code> would belong to which <code>if</code> if you added error handling?`;
    el.innerHTML = `${bench('arrow-fat-right', 'Arrow anti-pattern', 'Toggle Return Early and watch the nesting meter')}
    <div class="bench-body">
      <div class="controls" style="align-items:center">
        ${seg([['no', 'Nested ifs'], ['yes', 'Return Early']], st.early ? 'yes' : 'no')}
        ${seg(SCEN, st.scen, 'data-s')}
      </div>
      <pre class="code" style="margin:0">${rendered}</pre>
      <div class="readout">
        <div><div class="k">Max nesting depth</div><div class="v ${depth > 1 ? '' : 'accent'}">${depth}</div></div>
        <div><div class="k">Style</div><div class="v" style="font-size:14px">${st.early ? 'guard clauses' : 'arrow shape'}</div></div>
      </div>
      <div class="meter" aria-hidden="true"><span style="transform:scaleX(${depth / 4});${depth > 2 ? 'background:var(--bad)' : ''}"></span></div>
      <div class="explain">${msg}</div>
      <p class="tiny muted" style="margin-top:8px">The fourth check (<code>hasAddress</code>) is an extra example added to make the arrow deeper. The slide version has three checks.</p>
    </div>`;
  };
  on(el, '[data-v]', 'click', (e, b) => { st.early = b.dataset.v === 'yes'; render(); });
  on(el, '[data-s]', 'click', (e, b) => { st.scen = b.dataset.s; render(); });
  render();
}

// ------------------------------------------------------------------
// 4. Spot the smell
// ------------------------------------------------------------------
export function u2Smells(el) {
  const pre = s => `<pre class="code" style="margin:0;font-size:12px">${esc(s.trim())}</pre>`;
  sorter(el, {
    id: 'u2-smells', icon: 'bug', title: 'Spot the smell', cols: 290,
    options: ['Arrow', 'Too many args', 'Code clone', 'Unnecessary else'],
    hint: 'Each snippet has one main smell. Name it.',
    items: [
      { t: pre(`
function sendEmail(email, message) {
  if (isEmailValid(email)) {
    if (message !== '') {
      return sendgrid.send(email, message);
    } else {
      throw new Error('Cannot send an empty message.');
    }
  } else {
    throw new Error('Email is not valid.');
  }
}`), a: 'Arrow', why: 'Nested ifs push the real work to the right and the errors are far from their checks. Fix: reject invalid cases first (Return Early).' },
      { t: pre(`
function createUser(first, last, age,
                    weight, height, city, phone) {
  ...
}`), a: 'Too many args', why: 'Long, order-sensitive signatures are hard to call and to extend. Fix: split responsibilities or pass one object.' },
      { t: pre(`
function isAdult(age) {
  if (age >= 18) {
    return true;
  } else {
    return false;
  }
}`), a: 'Unnecessary else', why: 'The first branch already returns, so the else only adds noise. Remove it (or simply return the condition).' },
      { t: pre(`
let s = '';
if (firstName) { s += firstName + ' '; }
if (lastName)  { s += lastName + ' '; }
if (age)       { s += age + ' '; }
if (weight)    { s += weight + ' '; }`), a: 'Code clone', why: 'The same pattern is repeated for each field (violates DRY). Fix: one shared expression such as filter(Boolean).join(" ").' },
      { t: pre(`
function pay(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.total > 0) {
        charge(order);
      }
    }
  }
}`), a: 'Arrow', why: 'Three levels of nesting around one line of real work. Flatten with guard clauses.' },
      { t: pre(`
function studentPrice(p) { return p - p * 0.2; }
function seniorPrice(p)  { return p - p * 0.2; }
function memberPrice(p)  { return p - p * 0.2; }`), a: 'Code clone', why: 'Identical logic copied three times. A bug fixed in one copy stays in the others. Fix: one function with a parameter.' },
    ],
  });
}

// ------------------------------------------------------------------
// 5. Fail Fast vs silently continuing
// ------------------------------------------------------------------
const FF_INPUTS = [
  ['null', 'null order'], ['unpaid', 'Unpaid order'], ['nostock', 'Out of stock'], ['valid', 'Valid order'],
];
const FF_CODE = [
  'if (!order) throw new Error("Order cannot be null");',
  'if (!order.isPaid) throw new Error("Order must be paid");',
  'if (!order.isInStock) throw new Error("Out of stock");',
  'reserveStock(order);',
  'shipOrder(order);',
];
const LAZY_CODE = [
  'const items = order ? order.items : [];',
  'reserveStock(items);',
  'shipOrder(order);',
  'console.log("Order processed");',
];
function ffRun(inp) {
  const fail = { null: 0, unpaid: 1, nostock: 2, valid: -1 }[inp];
  const fast = { hit: [], failAt: fail, msg: '' };
  if (fail >= 0) {
    for (let i = 0; i <= fail; i++) fast.hit.push(i);
    fast.msg = `<strong>Throws at line ${fail + 1}</strong>: ${['Order cannot be null', 'Order must be paid', 'Out of stock'][fail]}. Nothing was reserved or shipped. The stack trace points straight at the cause.`;
  } else { fast.hit = [0, 1, 2, 3, 4]; fast.msg = '<strong>All guards pass.</strong> Stock is reserved and the order ships. Correct behaviour.'; }
  const effects = {
    null: ['Hides the null: items = []', 'Reserves nothing', 'Ships to "undefined"', 'Logs "Order processed"'],
    unpaid: ['items read normally', 'Stock reserved', 'Ships an UNPAID order', 'Logs "Order processed"'],
    nostock: ['items read normally', 'Reserve fails silently', 'Ships goods that do not exist', 'Logs "Order processed"'],
    valid: ['items read normally', 'Stock reserved', 'Order shipped', 'Logs "Order processed"'],
  }[inp];
  const lazy = { effects, bad: inp !== 'valid' };
  return { fast, lazy };
}

export function u2FailFast(el) {
  const st = { inp: 'unpaid' };
  const render = () => {
    const { fast, lazy } = ffRun(st.inp);
    el.innerHTML = `${bench('lightning', 'Fail Fast vs silently continuing', 'Feed an input into both versions of processOrder')}
    <div class="bench-body">
      <div class="controls">${seg(FF_INPUTS, st.inp)}</div>
      <div class="two">
        <div>
          <div class="small" style="font-weight:600;margin-bottom:4px;color:var(--good)"><i class="ph ph-shield-check"></i> Fail Fast version</div>
          <pre class="code" style="margin:0;font-size:12px">${FF_CODE.map((l, i) => lineHtml(l, fast.hit.includes(i) ? (i === fast.failAt ? 'bad' : 'hit') : 'dim')).join('')}</pre>
          <div class="explain">${fast.msg}</div>
        </div>
        <div>
          <div class="small" style="font-weight:600;margin-bottom:4px;color:var(--bad)"><i class="ph ph-warning-octagon"></i> No validation, keeps going</div>
          <pre class="code" style="margin:0;font-size:12px">${LAZY_CODE.map((l, i) => lineHtml(l, lazy.bad && i >= 1 ? 'bad' : 'hit')).join('')}</pre>
          <div class="explain">
            <div style="margin-bottom:6px">${lazy.effects.map((e, i) => `<div class="small"><span class="num">${i + 1}.</span> ${esc(e)}</div>`).join('')}</div>
            ${lazy.bad ? '<strong style="color:var(--bad)">Ran to the end with bad state.</strong> The log says success, so the bug shows up later and far from its cause.' : '<strong>Works for valid input.</strong> The difference only shows when input is invalid.'}
          </div>
        </div>
      </div>
    </div>`;
  };
  on(el, '[data-v]', 'click', (e, b) => { st.inp = b.dataset.v; render(); });
  render();
}

// ------------------------------------------------------------------
// 6. Lecture: choose the paradigm from project factors
// ------------------------------------------------------------------
const FACTORS = [
  { k: 'Problem domain', rule: 'Declarative fits rules, constraints and relationships (DB queries, rule-based systems). Imperative fits needs for fine-grained control, mutable state and explicit flow.',
    o: [['D', 'Rules, constraints, DB queries'], ['I', 'Needs mutable state, explicit flow'], ['N', 'Mixed']] },
  { k: 'Abstraction level', rule: 'Declarative lets you focus on the problem domain. Imperative gives precise control.',
    o: [['D', 'Stay at the problem level'], ['I', 'Need precise, low-level control'], ['N', 'No preference']] },
  { k: 'Readability', rule: 'Declarative is usually more readable and concise. Imperative is more verbose but has clear, explicit control flow.',
    o: [['D', 'Short, readable code wins'], ['I', 'Explicit flow must be visible'], ['N', 'No preference']] },
  { k: 'Performance', rule: 'Declarative relies on the runtime and may add overhead. Imperative low-level control allows tuning.',
    o: [['D', 'Overhead is acceptable'], ['I', 'Must squeeze out performance'], ['N', 'Not critical']] },
  { k: 'Tools and ecosystem', rule: 'Consider libraries, frameworks, maturity, community support and the performance of the tools for each paradigm.',
    o: [['D', 'Mature declarative tools exist (SQL, UI framework)'], ['I', 'Best libraries are imperative'], ['N', 'Both well supported']] },
  { k: 'Team skills', rule: 'Align with the team strengths for productivity and quality, or treat it as a chance to learn a new paradigm.',
    o: [['D', 'Team strong in SQL / functional'], ['I', 'Team strong in C / Java'], ['N', 'Team happy to learn']] },
  { k: 'Project constraints', rule: 'Architecture, compatibility, industry standards or regulations may favour one paradigm.',
    o: [['D', 'Standards require declarative config'], ['I', 'Legacy code base is imperative'], ['N', 'No constraints']] },
];
const PRESETS = {
  'Report from a database': ['D', 'D', 'D', 'N', 'D', 'D', 'N'],
  'Real-time game physics loop': ['I', 'I', 'N', 'I', 'N', 'I', 'N'],
  'Render a list on a web page': ['D', 'D', 'D', 'N', 'D', 'N', 'N'],
};

export function u2Paradigm(el) {
  const pick = FACTORS.map(() => 'N');
  const render = () => {
    const d = pick.filter(v => v === 'D').length, i = pick.filter(v => v === 'I').length;
    const verdict = d === i ? ['Mixed', 'The factors balance out. Use both: declarative for the what, imperative where you need control. Engineers need both paradigms.']
      : d > i ? ['Lean declarative', 'Most factors favour describing the result and letting the system handle the flow.']
      : ['Lean imperative', 'Most factors favour explicit control, mutable state and tuning.'];
    const total = Math.max(1, d + i);
    el.innerHTML = `${bench('scales', 'Choose the paradigm', 'Set each factor, or load a project')}
    <div class="bench-body">
      <div class="chips" style="margin-bottom:12px">${Object.keys(PRESETS).map(p => `<button class="chip" data-p="${esc(p)}"><i class="ph ph-lightning"></i>${p}</button>`).join('')}<button class="chip" data-p="__reset">Reset</button></div>
      ${FACTORS.map((f, n) => `<div style="padding:10px 0;border-top:1px solid var(--line)">
        <div class="small" style="font-weight:600">${f.k}</div>
        <div class="chips" style="margin:6px 0">${f.o.map(([v, l]) => `<button class="chip" data-f="${n}" data-v="${v}" aria-pressed="${pick[n] === v}">${l}</button>`).join('')}</div>
        ${pick[n] !== 'N' ? `<div class="tiny muted">${f.rule}</div>` : ''}</div>`).join('')}
      <div class="readout">
        <div><div class="k">Favour declarative</div><div class="v ${d > i ? 'accent' : ''}">${d}</div></div>
        <div><div class="k">Favour imperative</div><div class="v ${i > d ? 'accent' : ''}">${i}</div></div>
        <div><div class="k">Verdict</div><div class="v" style="font-size:15px">${verdict[0]}</div></div>
      </div>
      <div class="meter" aria-hidden="true"><span style="transform:scaleX(${d / total})"></span></div>
      <div class="explain">${verdict[1]}</div>
    </div>`;
  };
  on(el, '[data-f]', 'click', (e, b) => { pick[+b.dataset.f] = b.dataset.v; render(); });
  on(el, '[data-p]', 'click', (e, b) => {
    const p = b.dataset.p;
    (PRESETS[p] || FACTORS.map(() => 'N')).forEach((v, n) => { pick[n] = v; });
    render();
  });
  render();
}

// ------------------------------------------------------------------
// 7. Lab: which style fits?
// ------------------------------------------------------------------
export function u2Which(el) {
  sorter(el, {
    id: 'u2-which', icon: 'puzzle-piece', title: 'Which style fits best?', options: ['Imperative', 'Declarative'], cols: 250,
    hint: 'The lab asks which style suits each problem. Choose, then read the reason.',
    items: [
      { t: 'Filter and double the even numbers', a: 'Declarative', why: '<code>filter().map()</code>: clear, concise, no manual loops.' },
      { t: 'Compute the factorial of a number', a: 'Imperative', why: 'Simple step-by-step multiplication. <code>reduce()</code> works but is less clear for beginners.' },
      { t: 'Query a database for user information', a: 'Declarative', why: 'SQL or an ORM states what you want. The engine handles how.' },
      { t: 'Countdown timer that stops at 0', a: 'Imperative', why: 'Needs step-by-step control and side effects (<code>setInterval()</code>, stop at 0).' },
      { t: 'Render a list of items in HTML', a: 'Declarative', why: 'UI frameworks describe what to render and handle the rendering themselves.' },
      { t: 'Write the login test as "open page, type username, type password, click Login, check dashboard"', a: 'Imperative', why: 'It lists exactly how the test is performed, step by step.' },
      { t: 'Write the login test as "Given on the login page, When valid credentials, Then dashboard displayed"', a: 'Declarative', why: 'It states the expected behaviour. A page object like <code>login_page.login(user, pw)</code> hides the low-level steps.' },
    ],
  });
}
