// Unit 5 widgets: Design Patterns (Singleton and Factory).
import { bench, $, $$, on, seg, setSeg, esc } from '../viz.js';
import { sorter } from './sorter.js';

const chip = (txt, col = 'var(--ink-2)', bg = 'var(--sunken)') =>
  `<span style="display:inline-block;padding:2px 9px;border-radius:999px;border:1px solid ${col};background:${bg};color:${col};font-size:12px;font-family:var(--mono);margin:2px 4px 2px 0">${txt}</span>`;
const badge = (txt, kind) => {
  const c = kind === 'good' ? 'var(--good)' : kind === 'bad' ? 'var(--bad)' : 'var(--muted)';
  const bg = kind === 'good' ? 'var(--good-soft)' : kind === 'bad' ? 'var(--bad-soft)' : 'var(--sunken)';
  return chip(txt, c, bg);
};

// ---------------------------------------------------------------- u5Singleton
export function u5Singleton(el) {
  let mode = 'single', vars = [], objs = 0, inst = null, msg = '', n = 0;
  const MAX = 8;
  const reset = () => { vars = []; objs = 0; inst = null; msg = ''; n = 0; };
  const addVar = (obj) => { n++; vars.push({ name: 'l' + n, obj }); };
  const svg = () => {
    const rows = Math.max(vars.length, objs, 1), h = rows * 34 + 16;
    const vy = i => 14 + i * 34, oy = i => 14 + i * 34;
    let s = `<svg viewBox="0 0 360 ${h}" style="width:100%;max-width:420px;display:block" role="img" aria-label="Variables pointing at heap objects">`;
    s += `<text x="10" y="10" font-size="9" fill="var(--faint)">variables</text><text x="250" y="10" font-size="9" fill="var(--faint)">heap</text>`;
    vars.forEach((v, i) => {
      s += `<line x1="100" y1="${vy(i) + 12}" x2="250" y2="${oy(v.obj - 1) + 14}" stroke="var(--accent-viz)" stroke-width="1.5"/>`;
      s += `<rect x="10" y="${vy(i)}" width="90" height="24" rx="5" fill="var(--sunken)" stroke="var(--line-strong)"/><text x="55" y="${vy(i) + 16}" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">${v.name}</text>`;
    });
    for (let i = 0; i < objs; i++) {
      s += `<rect x="250" y="${oy(i)}" width="100" height="28" rx="6" fill="var(--accent-soft)" stroke="var(--accent-viz)" stroke-width="1.5"/><text x="300" y="${oy(i) + 18}" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">Logger #${i + 1}</text>`;
    }
    return s + '</svg>';
  };
  const render = () => {
    const same = vars.length > 1 && vars.every(v => v.obj === vars[0].obj);
    el.innerHTML = `${bench('number-circle-one', 'One instance, many references', 'Try to break the rule')}
    <div class="bench-body">
      <div class="controls" style="margin-bottom:10px">${seg([['plain', 'Normal class (public ctor)'], ['single', 'Singleton (private ctor)']], mode)}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <button class="btn sm" data-a="new"><i class="ph ph-plus"></i>new Logger()</button>
        <button class="btn sm" data-a="get1"><i class="ph ph-key"></i>Logger.GetInstance()</button>
        <button class="btn sm" data-a="get5">GetInstance() x5</button>
        <button class="btn sm" data-a="reset"><i class="ph ph-arrow-counter-clockwise"></i>Reset</button>
      </div>
      <div class="small" style="min-height:40px;padding:8px 10px;border-radius:8px;border:1px solid var(--line);background:var(--surface-2);margin-bottom:12px">${msg || 'Press a button. Each call stores a reference in a new variable (l1, l2, ...).'}</div>
      ${svg()}
      <div style="margin-top:10px">
        ${chip('objects on heap: ' + objs, objs > 1 ? 'var(--bad)' : 'var(--good)', objs > 1 ? 'var(--bad-soft)' : 'var(--good-soft)')}
        ${mode === 'single' ? chip('Logger.instance = ' + (inst ? '#1' : 'null')) : ''}
        ${vars.length > 1 ? chip('ReferenceEquals(all) = ' + (same ? 'True' : 'False'), same ? 'var(--good)' : 'var(--bad)', same ? 'var(--good-soft)' : 'var(--bad-soft)') : ''}
      </div>
    </div>`;
  };
  on(el, '.seg button', 'click', (e, b) => { mode = b.dataset.v; reset(); render(); });
  on(el, '[data-a]', 'click', (e, b) => {
    const a = b.dataset.a;
    if (a === 'reset') reset();
    else if (a === 'new') {
      if (mode === 'single') msg = '<strong style="color:var(--bad)">Compile error.</strong> <code>new Logger()</code> is not allowed outside the class: the constructor is <code>private</code> (C#: CS0122 inaccessible due to its protection level; Java: "Logger() has private access"). Nothing is created.';
      else if (vars.length >= MAX) msg = 'Limit reached (8 variables). Reset to continue.';
      else { objs++; addVar(objs); msg = '<code>new Logger()</code> always builds a brand new object. Now there are ' + objs + '.'; }
    } else {
      const k = a === 'get5' ? 5 : 1;
      if (mode === 'plain') msg = 'This class has no <code>GetInstance()</code>. Nothing controls creation, so every <code>new</code> makes another object.';
      else if (vars.length + k > MAX) msg = 'Limit reached (8 variables). Reset to continue.';
      else {
        const first = !inst;
        if (first) { inst = true; objs = 1; }
        for (let i = 0; i < k; i++) addVar(1);
        msg = (first ? 'First call: <code>instance</code> was null, so the object was created (lazy). ' : '') + 'Later calls just return the stored reference. Every variable points at the same object.';
      }
    }
    render();
  });
  render();
}

// ---------------------------------------------------------------- u5Race
const RACE = {
  lazy: {
    label: 'Lazy, no lock',
    code: ['public static Logger GetInstance()', '{', '    if (instance == null)', '        instance = new Logger();', '    return instance;', '}'],
    steps: [
      ['-', 0, 'Two threads, A and B, call GetInstance() at the same moment. <code>instance</code> is still null.', {}],
      ['A', 3, 'A checks <code>instance == null</code>: <strong>true</strong>.', {}],
      ['B', 3, 'B checks <code>instance == null</code>: <strong>true</strong> too, because A has not assigned anything yet.', {}],
      ['A', 4, 'A runs <code>new Logger()</code>: creates object #1 and stores it in <code>instance</code>.', { objs: [1], inst: 1 }],
      ['A', 5, 'A returns #1.', { A: 1 }],
      ['B', 4, 'B already passed its check, so it also runs <code>new Logger()</code>: object #2, and it overwrites <code>instance</code>.', { objs: [1, 2], inst: 2 }],
      ['B', 5, 'B returns #2. A holds #1, B holds #2: <strong>two instances. The Singleton is broken.</strong>', { B: 2 }],
    ],
  },
  lock: {
    label: 'Lazy + lock',
    code: ['public static Logger GetInstance()', '{', '    lock (padlock)', '    {', '        if (instance == null)', '            instance = new Logger();', '        return instance;', '    }', '}'],
    steps: [
      ['-', 0, 'Same start: both threads call GetInstance(), <code>instance</code> is null.', {}],
      ['A', 3, 'A acquires the lock.', { lock: 'A' }],
      ['B', 3, 'B wants the lock too: <strong>blocked</strong>, it must wait for A.', {}],
      ['A', 5, 'A checks <code>instance == null</code>: true.', {}],
      ['A', 6, 'A creates object #1.', { objs: [1], inst: 1 }],
      ['A', 7, 'A returns #1 and leaves the lock block (lock released).', { A: 1, lock: null }],
      ['B', 3, 'B finally gets the lock.', { lock: 'B' }],
      ['B', 5, 'B checks <code>instance == null</code>: <strong>false</strong>, A already created it.', {}],
      ['B', 7, 'B returns #1 and releases the lock. <strong>One instance.</strong> Thread safe.', { B: 1, lock: null }],
    ],
  },
  eager: {
    label: 'Eager static readonly',
    code: ['private static readonly Logger instance = new Logger();', 'public static Logger GetInstance()', '{', '    return instance;', '}'],
    steps: [
      ['-', 1, 'The class is loaded. The runtime runs the static initialiser <strong>once</strong>, before any thread can call GetInstance().', { objs: [1], inst: 1 }],
      ['A', 4, 'A returns #1. No null check, nothing to race on.', { A: 1 }],
      ['B', 4, 'B returns #1. <strong>One instance.</strong> Thread safe, but the object exists even if nobody ever uses it.', { B: 1 }],
    ],
  },
};
export function u5Race(el) {
  let mode = 'lazy', i = 0;
  const stateAt = (m, k) => {
    const s = { objs: [], inst: null, A: null, B: null, lock: null, pA: 0, pB: 0, cur: 0, who: '-' };
    RACE[m].steps.slice(0, k + 1).forEach(([who, line, , patch]) => {
      Object.assign(s, patch);
      if (who === 'A') s.pA = line; if (who === 'B') s.pB = line;
      s.cur = line; s.who = who;
    });
    return s;
  };
  const render = () => {
    const R = RACE[mode], st = stateAt(mode, i), last = i === R.steps.length - 1;
    const codeHtml = R.code.map((ln, idx) => {
      const no = idx + 1, isCur = st.cur === no;
      const col = st.who === 'A' ? 'var(--accent-viz)' : st.who === 'B' ? 'var(--second)' : 'var(--faint)';
      const tags = (st.pA === no ? chip('A', 'var(--accent)', 'var(--accent-soft)') : '') + (st.pB === no ? chip('B', 'var(--second)', 'var(--sunken)') : '');
      return `<span style="display:block;padding:1px 6px;border-radius:4px;${isCur ? `background:color-mix(in srgb, ${col} 18%, transparent);` : ''}">${esc(ln)}${tags ? ' &nbsp;' + tags : ''}</span>`;
    }).join('');
    const val = v => v ? '#' + v : 'null';
    el.innerHTML = `${bench('git-fork', 'Two threads, one Singleton?', 'Step through the interleaving')}
    <div class="bench-body">
      <div class="controls" style="margin-bottom:10px">${seg(Object.entries(RACE).map(([k, v]) => [k, v.label]), mode)}</div>
      <pre class="code" style="margin:0 0 10px">${codeHtml}</pre>
      <div class="small" style="padding:8px 10px;border-radius:8px;border:1px solid var(--line);background:var(--surface-2);min-height:44px">
        <strong>Step ${i + 1}/${R.steps.length}${st.who !== '-' ? ' (thread ' + st.who + ')' : ''}:</strong> ${R.steps[i][2]}</div>
      <div style="margin-top:10px">
        ${chip('instance = ' + val(st.inst))}${chip('A got ' + val(st.A), 'var(--accent)')}${chip('B got ' + val(st.B), 'var(--second)')}
        ${mode === 'lock' ? chip('lock: ' + (st.lock || 'free')) : ''}
        ${st.objs.length ? chip('heap: ' + st.objs.map(o => 'Logger #' + o).join(', '), st.objs.length > 1 ? 'var(--bad)' : 'var(--good)', st.objs.length > 1 ? 'var(--bad-soft)' : 'var(--good-soft)') : chip('heap: empty')}
        ${last ? (st.objs.length > 1 ? badge('2 instances: BROKEN', 'bad') : badge('1 instance: OK', 'good')) : ''}
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button class="btn sm" data-n="-1" ${i === 0 ? 'disabled' : ''}><i class="ph ph-caret-left"></i>Back</button>
        <button class="btn sm" data-n="1" ${last ? 'disabled' : ''}>Next step<i class="ph ph-caret-right"></i></button>
        <button class="btn sm" data-n="0"><i class="ph ph-arrow-counter-clockwise"></i>Replay</button>
      </div>
    </div>`;
  };
  on(el, '.seg button', 'click', (e, b) => { mode = b.dataset.v; i = 0; render(); });
  on(el, '[data-n]', 'click', (e, b) => { const d = +b.dataset.n; i = d === 0 ? 0 : Math.max(0, Math.min(RACE[mode].steps.length - 1, i + d)); render(); });
  render();
}

// ---------------------------------------------------------------- u5SingletonBugs
export function u5SingletonBugs(el) {
  const fixes = [
    ['ctor', 'private constructor'],
    ['field', 'static field'],
    ['acc', 'static accessor'],
    ['chk', 'null check'],
  ];
  const on_ = { ctor: false, field: false, acc: false, chk: false };
  const render = () => {
    const s = on_;
    const lines = [
      ['', 'public class Logger'], ['', '{'],
      ['field', s.field ? '    private static Logger instance;' : '    private Logger instance;'],
      ['ctor', s.ctor ? '    private Logger() { }' : '    public Logger() { }'],
      ['acc', s.acc ? '    public static Logger GetInstance()' : '    public Logger GetInstance()'],
      ['', '    {'],
      ...(s.chk ? [['chk', '        if (instance == null)'], ['chk', '            instance = new Logger();']] : [['chk', '        instance = new Logger();']]),
      ['', '        return instance;'], ['', '    }'], ['', '}'],
    ];
    const bad = [];
    let verdict;
    if (s.acc && !s.field) { bad.push('Compile error: a <code>static</code> method cannot use the non-static field <code>instance</code> (C# CS0120).'); verdict = 'does not compile'; }
    else if (!s.ctor) { bad.push('Anyone can write <code>new Logger()</code>, so the number of instances is unlimited.'); verdict = 'unlimited instances'; }
    else if (!s.acc) { bad.push('The constructor is private but <code>GetInstance()</code> needs an object to be called on. Nobody can get an instance at all.'); verdict = '0 reachable instances'; }
    else if (!s.chk) { bad.push('Every <code>GetInstance()</code> call runs <code>new Logger()</code> and overwrites <code>instance</code>: one new object per call.'); verdict = 'one new instance per call'; }
    else { verdict = 'exactly 1 instance'; }
    const ok = !bad.length;
    const hint = [];
    if (!s.ctor) hint.push('Part 1: private constructor.');
    if (!s.field) hint.push('Part 2: the stored instance must be static.');
    if (!s.acc) hint.push('Part 3: the accessor must be static (callable without an object).');
    if (!s.chk) hint.push('Part 4: create only if <code>instance == null</code>.');
    el.innerHTML = `${bench('bug', 'Find and fix the broken Singleton', 'Toggle each fix')}
    <div class="bench-body">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        ${fixes.map(([k, l]) => `<button class="btn sm" data-f="${k}" aria-pressed="${s[k]}" style="${s[k] ? 'border-color:var(--good);color:var(--good)' : ''}"><i class="ph ph-${s[k] ? 'check-square' : 'square'}"></i>${l}</button>`).join('')}
        <button class="btn sm" data-f="all">Apply all</button><button class="btn sm" data-f="none">Reset</button>
      </div>
      <pre class="code" style="margin:0 0 10px">${lines.map(([k, t]) => `<span style="display:block;padding:1px 6px;border-radius:4px;${k && s[k] ? 'background:color-mix(in srgb, var(--good) 16%, transparent)' : k ? 'background:color-mix(in srgb, var(--bad) 14%, transparent)' : ''}">${esc(t)}</span>`).join('')}</pre>
      <div>${ok ? badge('Valid Singleton', 'good') : badge('Broken', 'bad')}${chip('instances possible: ' + verdict, ok ? 'var(--good)' : 'var(--bad)', ok ? 'var(--good-soft)' : 'var(--bad-soft)')}</div>
      <div class="small" style="margin-top:8px">${ok ? 'All four parts are in place: private constructor, static field, static accessor, null check.' : bad.join('<br>')}</div>
      ${hint.length && !ok ? `<div class="small muted" style="margin-top:6px">Still to fix: ${hint.join(' ')}</div>` : ''}
    </div>`;
  };
  on(el, '[data-f]', 'click', (e, b) => {
    const k = b.dataset.f;
    if (k === 'all' || k === 'none') Object.keys(on_).forEach(x => on_[x] = k === 'all'); else on_[k] = !on_[k];
    render();
  });
  render();
}

// ---------------------------------------------------------------- u5Factory
export function u5Factory(el) {
  let mode = 'fm', air = false, out = '';
  const OUT = { road: 'Deliver by land in a truck', sea: 'Deliver by sea in a ship', air: 'Deliver by air in a plane' };
  const fileRow = (name, state, note = '') => {
    const b = state === 'new' ? badge('ADDED', 'good') : state === 'mod' ? badge('MODIFIED', 'bad') : badge('unchanged', 'muted');
    return `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:5px 0;border-bottom:1px solid var(--line)"><code style="font-size:12px">${name}</code>${b}<span class="small muted">${note}</span></div>`;
  };
  const render = () => {
    let files, modified, added, codeTxt, client;
    if (mode === 'simple') {
      files = [fileRow('ITransport.cs', 'same'), fileRow('Truck.cs', 'same'), fileRow('Ship.cs', 'same'),
        fileRow('TransportFactory.cs', air ? 'mod' : 'same', air ? 'new else-if branch' : ''), ...(air ? [fileRow('Airplane.cs', 'new')] : [])];
      modified = air ? 1 : 0; added = air ? 1 : 0;
      codeTxt = `public static ITransport CreateTransport(string type)\n{\n    if (type == "road") return new Truck();\n    else if (type == "sea") return new Ship();` + (air ? `\n    else if (type == "air") return new Airplane();   // EDITED` : '') + `\n    else throw new ArgumentException("Invalid");\n}`;
      client = `ITransport t = TransportFactory.CreateTransport("<type>");`;
    } else {
      files = [fileRow('ITransport.cs', 'same'), fileRow('Logistics.cs (Creator)', 'same'), fileRow('Truck.cs', 'same'), fileRow('Ship.cs', 'same'),
        fileRow('RoadLogistics.cs', 'same'), fileRow('SeaLogistics.cs', 'same'), ...(air ? [fileRow('Airplane.cs', 'new'), fileRow('AirLogistics.cs', 'new')] : [])];
      modified = 0; added = air ? 2 : 0;
      codeTxt = `abstract class Logistics\n{\n    public abstract ITransport CreateTransport();   // factory method\n}\nclass RoadLogistics : Logistics { ... return new Truck(); }\nclass SeaLogistics  : Logistics { ... return new Ship(); }` + (air ? `\nclass AirLogistics  : Logistics { ... return new Airplane(); }   // NEW FILE` : '');
      client = `Logistics l = new <X>Logistics();\nITransport t = l.CreateTransport();`;
    }
    const ocp = modified === 0;
    el.innerHTML = `${bench('factory', 'Add Airplane: what has to change?', 'Compare the two designs')}
    <div class="bench-body">
      <div class="controls" style="margin-bottom:10px">${seg([['simple', 'Simple Factory (if/else)'], ['fm', 'Factory Method (subclasses)']], mode)}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        <button class="btn sm" data-air="1">${air ? '<i class="ph ph-arrow-counter-clockwise"></i>Remove Airplane' : '<i class="ph ph-airplane"></i>Add Airplane'}</button>
      </div>
      <pre class="code" style="margin:0 0 10px">${esc(codeTxt)}</pre>
      <div style="margin-bottom:10px">${files.join('')}</div>
      <div>${chip('files modified: ' + modified, modified ? 'var(--bad)' : 'var(--good)', modified ? 'var(--bad-soft)' : 'var(--good-soft)')}${chip('files added: ' + added)}
        ${air ? (ocp ? badge('Open/Closed kept: open for extension, closed for modification', 'good') : badge('Open/Closed VIOLATED: existing code edited', 'bad')) : badge('Add Airplane to see the effect', 'muted')}</div>
      <div class="small muted" style="margin:12px 0 6px">Client (run it):</div>
      <pre class="code" style="margin:0 0 8px">${esc(client)}</pre>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${['road', 'sea', 'air'].map(t => `<button class="btn sm" data-t="${t}">${mode === 'simple' ? `"${t}"` : `new ${t[0].toUpperCase() + t.slice(1)}Logistics()`}</button>`).join('')}
      </div>
      <div class="small" style="margin-top:8px;min-height:22px">${out}</div>
    </div>`;
  };
  on(el, '.seg button', 'click', (e, b) => { mode = b.dataset.v; out = ''; render(); });
  on(el, '[data-air]', 'click', () => { air = !air; out = ''; render(); });
  on(el, '[data-t]', 'click', (e, b) => {
    const t = b.dataset.t;
    if (t === 'air' && !air) out = mode === 'simple' ? '<strong style="color:var(--bad)">ArgumentException: Invalid transport type.</strong> The factory does not know "air" yet.' : '<strong style="color:var(--bad)">Compile error:</strong> AirLogistics does not exist yet.';
    else out = '<strong style="color:var(--good)">Output:</strong> ' + OUT[t];
    render();
  });
  render();
}

// ---------------------------------------------------------------- sorters
export function u5Roles(el) {
  sorter(el, {
    id: 'u5-roles', icon: 'tree-structure', title: 'Name the Factory Method role', cols: 250,
    hint: 'Two examples: the lab\'s Logistics system, and a document editor. Pick the role each class plays.',
    options: ['Product', 'ConcreteProduct', 'Creator', 'ConcreteCreator'],
    items: [
      { t: '<code>ITransport</code> (declares <code>Deliver()</code>)', a: 'Product', why: 'The interface the client uses. It never mentions Truck or Ship.' },
      { t: '<code>Truck : ITransport</code>', a: 'ConcreteProduct', why: 'A real class that implements the product interface.' },
      { t: '<code>abstract class Logistics</code> with <code>abstract ITransport CreateTransport()</code>', a: 'Creator', why: 'Abstract class that declares the factory method.' },
      { t: '<code>SeaLogistics : Logistics</code> overriding <code>CreateTransport()</code> to <code>return new Ship()</code>', a: 'ConcreteCreator', why: 'Overrides the factory method and decides the concrete class.' },
      { t: '<code>IDocument</code> (declares <code>Open()</code>)', a: 'Product', why: 'The common interface of everything the app creates.' },
      { t: '<code>PdfApplication : Application</code> with <code>override IDocument CreateDocument() { return new PdfDocument(); }</code>', a: 'ConcreteCreator', why: 'A subclass whose override returns one specific product.' },
      { t: '<code>abstract class Application</code> with <code>abstract IDocument CreateDocument()</code> and a method <code>NewFile()</code> that calls it', a: 'Creator', why: 'Declares the factory method and may use it in its own operations.' },
      { t: '<code>PdfDocument : IDocument</code>', a: 'ConcreteProduct', why: 'The object that actually gets created.' },
    ],
  });
}

export function u5Which(el) {
  sorter(el, {
    id: 'u5-which', icon: 'magnifying-glass', title: 'Which pattern fits?', cols: 270,
    hint: 'Read the scenario and choose the best answer.',
    options: ['Singleton', 'Factory Method', 'Simple Factory', 'Neither'],
    items: [
      { t: 'A game needs exactly one <code>AudioManager</code> shared by every screen.', a: 'Singleton', why: 'One shared instance with a global access point.' },
      { t: 'A notification app must create Email, SMS or Push senders, and new channels will be added every semester without editing existing code.', a: 'Factory Method', why: 'Extension by adding subclasses (Open/Closed).' },
      { t: 'A tiny script has one static method: <code>if (fmt == "csv") return new CsvWriter(); else return new JsonWriter();</code>. Formats almost never change.', a: 'Simple Factory', why: 'One method picks a class by a string. Fine for a small, stable system.' },
      { t: 'The whole app must read the same <code>AppConfig</code> (theme, language) so a change in one place is seen everywhere.', a: 'Singleton', why: 'Shared state across components, the lab example.' },
      { t: 'A <code>Student</code> class with a name, an ID and a GPA. Each student is a separate object.', a: 'Neither', why: 'Many instances are required, and no creation logic is hidden. A plain constructor is enough.' },
      { t: 'A logger must be used by all classes, and writing to the same file from two instances would corrupt it.', a: 'Singleton', why: 'Logging services are a lab example of one shared instance.' },
      { t: 'A delivery company adds a new vehicle type each year. Client code must not contain <code>new Truck()</code> or <code>new Ship()</code>.', a: 'Factory Method', why: 'Subclasses (RoadLogistics, SeaLogistics, ...) decide the class.' },
      { t: 'A report generator is called with "pdf" or "excel" and a single <code>switch</code> returns the right exporter. The team accepts editing the switch for new formats.', a: 'Simple Factory', why: 'Centralised creation with conditional logic; editing it breaks OCP but is accepted here.' },
      { t: 'A shop has a <code>Product</code> class, and each product needs its own price and name.', a: 'Neither', why: 'There is nothing to restrict and nothing to hide: ordinary objects.' },
    ],
  });
}

export function u5Solid(el) {
  sorter(el, {
    id: 'u5-solid', icon: 'cube', title: 'Match the SOLID principle', cols: 270,
    hint: 'Which principle is the scenario about?',
    options: ['SRP', 'OCP', 'LSP', 'ISP', 'DIP'],
    items: [
      { t: 'A <code>User</code> class also sends emails and writes logs.', a: 'SRP', why: 'Lab example: a class should have only one reason to change.' },
      { t: 'A new payment method is added by creating a new class, without rewriting old code.', a: 'OCP', why: 'Open for extension, closed for modification (lab example).' },
      { t: 'A child class overrides a method of its parent in a way that breaks code written for the parent.', a: 'LSP', why: 'Subclasses must be replaceable for their parent without breaking behaviour.' },
      { t: 'A <code>Printer</code> class is forced to implement <code>Fax()</code> and <code>Scan()</code> from one huge interface, although it only prints.', a: 'ISP', why: 'Split large interfaces into smaller, specific ones.' },
      { t: 'Business logic depends on an interface, not on a specific database driver.', a: 'DIP', why: 'High-level modules depend on abstractions (lab example).' },
      { t: 'Adding Airplane means adding an <code>else if</code> inside <code>TransportFactory</code>.', a: 'OCP', why: 'Existing code has to be modified, so it violates OCP. Factory Method fixes it.' },
      { t: 'The client holds an <code>ITransport</code> and never mentions <code>Truck</code>.', a: 'DIP', why: 'It depends on the abstraction, not the concrete class.' },
      { t: 'A <code>Square</code> subclass of <code>Rectangle</code> breaks code that sets width and height separately.', a: 'LSP', why: 'The subclass does not honour the parent contract (extra example).' },
    ],
  });
}
