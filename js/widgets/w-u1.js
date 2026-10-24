// Unit 1 simulators: Introduction to Software Construction & Testing (lecture 1 + lab 1).
import { bench, $, $$, on, seg, setSeg, esc, reduced } from '../viz.js';
import { sorter } from './sorter.js';

// ------------------------------------------------------------------ methodology sorter
export function u1Methodology(el) {
  sorter(el, {
    id: 'u1-methodology', icon: 'flow-arrow', title: 'Which methodology fits?', cols: 270,
    options: ['Waterfall', 'Agile', 'V-model', 'Spiral', 'XP'],
    hint: 'Read each scenario and pick the best construction methodology. The first five are the lab use cases.',
    items: [
      { t: 'Requirements are completely fixed and almost no change is expected (banking back office, government, manufacturing).', a: 'Waterfall', why: 'Linear and sequential: fine when nothing will change.' },
      { t: 'A mobile or web app where users constantly give feedback and the product keeps changing.', a: 'Agile', why: 'Iterative and incremental, short iterations with frequent feedback.' },
      { t: 'Software that controls a medical device.', a: 'V-model', why: 'Safety-critical: every development phase has a matching test phase.' },
      { t: 'A huge, complex online banking system with significant technical risks.', a: 'Spiral', why: 'Risk-driven: each loop identifies and mitigates risks before building more.' },
      { t: 'A small team, rapidly changing requirements, strong focus on TDD and pair programming.', a: 'XP', why: 'XP is the Agile method with TDD, pair programming, CI and refactoring.' },
      { t: 'A payroll system for a ministry. The law fixes every rule up front and the scope is signed off before coding starts. (extra example)', a: 'Waterfall', why: 'Stable, well-understood requirements suit a linear plan.' },
      { t: 'An airbag controller: the team must show that each requirement and each design level is verified by a matching test. (extra example)', a: 'V-model', why: 'Well-defined, safety-critical, heavy documentation, test planned per phase.' },
      { t: 'A new product that relies on unproven technology. The team wants to build a prototype and judge feasibility before committing. (extra example)', a: 'Spiral', why: 'Risk analysis plus prototype in each loop is the Spiral signature.' },
      { t: 'A 6-person team with weekly releases, collective code ownership, refactoring and continuous customer feedback. (extra example)', a: 'XP', why: '1 to 2 week iterations, collective ownership and engineering practices point to XP, not generic Agile.' },
    ],
  });
}

// ------------------------------------------------------------------ V-model
const VPAIRS = [
  { dev: 'Requirements analysis', test: 'Acceptance testing', checks: 'The finished software against the customer\'s acceptance criteria. Requirements are verified at every stage, and the customer confirms the right product was built.', ex: 'Client confirms checkout works before launch.' },
  { dev: 'System design', test: 'System testing', checks: 'The entire system against the specified requirements, end to end.', ex: 'Run the full e-commerce site from browsing to payment.' },
  { dev: 'Architecture / module design', test: 'Integration testing', checks: 'How the different components or modules work together through their interfaces.', ex: 'Login, database and API work together.' },
  { dev: 'Implementation (coding)', test: 'Unit testing', checks: 'Individual components or modules, each in isolation.', ex: 'login() returns true for valid credentials.' },
];
export function u1VModel(el) {
  let sel = 0;
  const render = () => {
    const p = VPAIRS[sel];
    const row = (i, side) => {
      const x = side === 'dev' ? i * 14 : (3 - i) * 14;
      const on_ = i === sel;
      const label = side === 'dev' ? VPAIRS[i].dev : VPAIRS[i].test;
      return `<button type="button" data-i="${i}" data-side="${side}" class="chip ${on_ ? 'accent' : ''}" style="justify-content:flex-start;width:calc(100% - ${x}px);margin-${side === 'dev' ? 'left' : 'left'}:${x}px;border-radius:10px;padding:9px 12px;${on_ ? 'font-weight:600;border-color:var(--accent)' : ''}">${label}</button>`;
    };
    el.innerHTML = `${bench('git-merge', 'V-model explorer', 'Click a phase on either arm')}
    <div class="bench-body">
      <div class="two" style="gap:14px">
        <div><div class="small muted" style="margin-bottom:6px"><i class="ph ph-arrow-down"></i> Development (verification)</div><div style="display:grid;gap:8px">${VPAIRS.map((_, i) => row(i, 'dev')).join('')}</div></div>
        <div><div class="small muted" style="margin-bottom:6px"><i class="ph ph-arrow-up"></i> Testing (validation)</div><div style="display:grid;gap:8px">${VPAIRS.map((_, i) => row(i, 'test')).join('')}</div></div>
      </div>
      <div class="explain"><strong>${p.dev}</strong> is matched by <strong>${p.test}</strong>.<br>
        <span class="small"><strong>What it checks:</strong> ${p.checks}</span><br>
        <span class="small muted">Example: ${p.ex}</span></div>
      <p class="small muted" style="margin-top:10px">The lecture lists the V as requirements, design, implementation, testing, deployment, with each development phase tied to a testing phase. The exact four-way pairing above is the standard textbook V (extra example).</p>
    </div>`;
  };
  on(el, '[data-i]', 'click', (e, b) => { sel = +b.dataset.i; render(); });
  render();
}

// ------------------------------------------------------------------ Spiral
const SP_PH = [
  ['Planning', 'Gather requirements, set objectives, explore alternatives, outline solutions.'],
  ['Risk Analysis', 'Identify risks, evaluate feasibility, create strategies, build a prototype.'],
  ['Engineering', 'Design, code, test and deploy based on the prototype.'],
  ['Evaluation', 'Collect client feedback, review changes, fix issues, prepare the next spiral.'],
];
const SP_LOOP = [
  'Loop 1: biggest unknowns (is online payment feasible?). Prototype 1 shows the core idea. (extra example)',
  'Loop 2: requirements firmer, remaining risks smaller (security, load). Prototype 2 adds real features. (extra example)',
  'Loop 3: few risks left, so this loop builds and releases the product. (extra example)',
];
const SP_RISK = [90, 62, 32, 8];
export function u1Spiral(el) {
  let s = 0;
  const N = 12;
  const pt = t => { const a = (-135 + 90 * t) * Math.PI / 180, r = 22 + 36 * (t / 4); return [160 + r * Math.cos(a), 160 + r * Math.sin(a)]; };
  const path = to => { let d = ''; for (let t = 0; t <= to + 1e-9; t += 0.1) { const [x, y] = pt(t); d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } return d; };
  const render = () => {
    const loop = Math.floor(s / 4), ph = s % 4, [dx, dy] = pt(s);
    const risk = ph === 3 ? SP_RISK[loop + 1] : SP_RISK[loop];
    const lab = (x, y, i) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="11" fill="${i === ph ? 'var(--accent)' : 'var(--muted)'}" font-weight="${i === ph ? 700 : 400}">${SP_PH[i][0]}</text>`;
    el.innerHTML = `${bench('arrows-clockwise', 'Spiral model stepper', 'Walk through 3 loops, 4 phases each')}
    <div class="bench-body">
      <div class="two" style="gap:16px;align-items:center">
        <svg class="viz" viewBox="0 0 320 320" role="img" aria-label="Spiral with four quadrants" style="max-width:340px;width:100%;margin:0 auto;display:block">
          <line x1="160" y1="8" x2="160" y2="312" stroke="var(--line)"/><line x1="8" y1="160" x2="312" y2="160" stroke="var(--line)"/>
          ${lab(70, 20, 0)}${lab(250, 20, 1)}${lab(250, 308, 2)}${lab(70, 308, 3)}
          <path d="${path(N - 0.01)}" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="3 4"/>
          <path d="${path(s)}" fill="none" stroke="var(--accent-viz)" stroke-width="3" stroke-linecap="round"/>
          <circle cx="${dx}" cy="${dy}" r="8" fill="var(--accent)"/>
        </svg>
        <div>
          <div class="readout" style="margin-top:0"><div><div class="k">Loop</div><div class="v accent">${loop + 1} / 3</div></div><div><div class="k">Phase</div><div class="v" style="font-size:15px">${SP_PH[ph][0]}</div></div><div><div class="k">Risk left</div><div class="v">${risk}%</div></div></div>
          <div class="meter" aria-label="Remaining risk"><span style="transform:scaleX(${risk / 100})"></span></div>
          <div class="explain" style="min-height:0"><strong>${SP_PH[ph][0]}.</strong> ${SP_PH[ph][1]}<br><span class="small muted">${SP_LOOP[loop]}</span></div>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
        <button class="btn sm" data-a="back" ${s === 0 ? 'disabled' : ''}><i class="ph ph-caret-left"></i>Back</button>
        <button class="btn sm primary" data-a="next" ${s === N - 1 ? 'disabled' : ''}>Next phase<i class="ph ph-caret-right"></i></button>
        <button class="btn sm" data-a="reset"><i class="ph ph-arrow-counter-clockwise"></i>Reset</button>
        ${s === N - 1 ? '<span class="small hl" style="align-self:center">Risk is low, product released.</span>' : ''}
      </div>
    </div>`;
  };
  on(el, '[data-a]', 'click', (e, b) => {
    const a = b.dataset.a;
    if (a === 'next') s = Math.min(N - 1, s + 1); else if (a === 'back') s = Math.max(0, s - 1); else s = 0;
    render();
  });
  render();
}

// ------------------------------------------------------------------ black / gray / white box
const BOX_CODE = [
  'int discount(int total, boolean member) {',
  '  if (total < 0) throw new IllegalArgumentException();',
  '  if (member && total >= 100) return total * 10 / 100;',
  '  if (member) return 5;',
  '  return 0;',
  '}',
];
const BOX_SPEC = 'Spec: members get 10% off orders of 100 or more and a flat 5 on smaller orders. Non-members get nothing. A negative total is invalid.';
const BOX_TESTS = {
  black: [['discount(100, true) = 10', [0, 2], 'Boundary value from the spec'], ['discount(99, true) = 5', [0, 3], 'Just under the boundary'], ['discount(50, false) = 0', [0, 4], 'Non-member case'], ['discount(-1, true) throws', [0, 1], 'Invalid input from the spec']],
  gray: [['discount(100, true) = 10', [0, 2], 'Boundary from the spec'], ['discount(-1, true) throws', [0, 1], 'Tester knows a guard clause exists, aims at it'], ['discount(100, false) = 0', [0, 2, 4], 'Knows the member check comes first, tries the other side of it']],
  white: [['discount(-1, false) throws', [0, 1], 'Covers the guard (line 2)'], ['discount(100, true) = 10', [0, 2], 'Covers the && branch (line 3)'], ['discount(99, true) = 5', [0, 3], 'Condition true, total >= 100 false (line 4 reached)'], ['discount(100, false) = 0', [0, 2, 4], 'member false short-circuits, falls to line 5'], ['Change >= 100 to > 100: does a test fail?', [2], 'Reading the code lets you target the exact operator']],
};
export function u1Boxes(el) {
  let mode = 'black', t = 0;
  const render = () => {
    const visible = i => mode === 'white' || (mode === 'gray' && i <= 1);
    const tests = BOX_TESTS[mode];
    if (t >= tests.length) t = 0;
    const hit = tests[t][1];
    const lines = BOX_CODE.map((l, i) => {
      const vis = visible(i);
      const lit = vis && hit.includes(i) && i > 0 || (vis && i === 0 && mode !== 'black');
      return `<div style="${vis ? '' : 'filter:blur(5px);user-select:none;'}${hit.includes(i) && i > 0 && vis ? 'background:color-mix(in srgb, var(--accent-viz) 22%, transparent);' : ''}white-space:pre;border-radius:4px;transition:filter .3s">${esc(l)}</div>`;
    }).join('');
    const sees = { black: 'Only inputs and outputs (the spec). No code.', gray: 'Some internals: the signature and part of the logic (think database schema or API contract).', white: 'Everything: full source, every branch and condition.' }[mode];
    el.innerHTML = `${bench('eye', 'Black, gray and white box', 'Change how much the tester can see')}
    <div class="bench-body">
      <div class="controls" style="margin-bottom:10px">${seg([['black', 'Black box'], ['gray', 'Gray box'], ['white', 'White box']], mode)}</div>
      <div class="small muted" style="margin-bottom:8px"><strong>Tester sees:</strong> ${sees}</div>
      <pre class="code" style="margin:0 0 12px">${lines}</pre>
      <div class="small" style="margin-bottom:10px;padding:10px 12px;border:1px dashed var(--line-strong, var(--line));border-radius:10px">${BOX_SPEC}</div>
      <div class="small muted" style="margin-bottom:6px">Test cases this tester can design (click one${mode === 'white' ? ' to light up the lines it covers' : ''}):</div>
      <div style="display:grid;gap:6px">${tests.map((c, i) => `<button type="button" class="chip ${i === t ? 'accent' : ''}" data-t="${i}" style="border-radius:10px;justify-content:flex-start;text-align:left;padding:8px 12px"><span class="num">${esc(c[0])}</span></button>`).join('')}</div>
      <div class="explain"><strong>${mode === 'black' ? 'Black box' : mode === 'gray' ? 'Gray box' : 'White box'}.</strong> ${esc(tests[t][2])}.
        ${mode === 'black' ? ' Testing without knowledge of the internal workings or code.' : mode === 'gray' ? ' Testing with some knowledge of the internal workings or code.' : ' Testing with knowledge of the internal workings or code.'}</div>
    </div>`;
  };
  on(el, '[data-v]', 'click', (e, b) => { mode = b.dataset.v; t = 0; render(); });
  on(el, '[data-t]', 'click', (e, b) => { t = +b.dataset.t; render(); });
  render();
}

// ------------------------------------------------------------------ testing levels zoom
const COMPS = [
  ['ui', 'Login form'], ['fn', 'login()'], ['db', 'User DB'], ['api', 'Auth API'], ['cart', 'Cart'], ['pay', 'Payment'], ['wish', 'Wishlist (new)'],
];
const LEVELS = {
  unit: { name: 'Unit testing', on: ['fn'], text: 'Tests an individual component or module on its own.', ex: 'A login function returns true for valid credentials.' },
  integration: { name: 'Integration testing', on: ['fn', 'db', 'api'], text: 'Tests how different components or modules work together.', ex: 'Login, database, and API work together.' },
  system: { name: 'System testing', on: ['ui', 'fn', 'db', 'api', 'cart', 'pay'], text: 'Tests the entire system against the specified requirements.', ex: 'Run the full e-commerce site end to end.' },
  acceptance: { name: 'Acceptance testing (UAT)', on: ['ui', 'fn', 'db', 'api', 'cart', 'pay'], who: 'client', text: 'Checks the software meets the acceptance criteria of the customer or end user. Final testing by clients or stakeholders.', ex: 'Client verifies checkout works before launch.' },
  regression: { name: 'Regression testing', on: ['cart', 'pay', 'fn', 'ui'], changed: 'wish', text: 'Re-tests after changes or updates to make sure no new defects were introduced.', ex: 'Re-test checkout after adding a Wishlist feature.' },
};
export function u1Levels(el) {
  let lv = 'unit';
  const render = () => {
    const L = LEVELS[lv];
    const box = ([id, label]) => {
      if (id === 'wish' && lv !== 'regression') return '';
      const under = L.on.includes(id), changed = L.changed === id;
      return `<div style="padding:10px 12px;border-radius:10px;border:${changed ? '2px dashed var(--bad)' : under ? '2px solid var(--accent)' : '1px solid var(--line)'};background:${under ? 'var(--accent-soft)' : 'var(--sunken)'};opacity:${under || changed ? 1 : .45};font:600 14px var(--mono);text-align:center;transition:all .3s">${label}</div>`;
    };
    el.innerHTML = `${bench('magnifying-glass-plus', 'Testing levels: scope zoom', 'Which parts are under test? (e-commerce site)')}
    <div class="bench-body">
      <div class="controls" style="margin-bottom:12px">${seg([['unit', 'Unit'], ['integration', 'Integration'], ['system', 'System'], ['acceptance', 'Acceptance'], ['regression', 'Regression']], lv)}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px">${COMPS.map(box).join('')}</div>
      <div class="small muted" style="margin-top:8px">${L.on.length} of ${lv === 'regression' ? 7 : 6} components in scope${L.who ? ' &middot; run by the client or stakeholders' : ''}${L.changed ? ' &middot; dashed red = the change' : ''}</div>
      <div class="explain"><strong>${L.name}.</strong> ${L.text}<br><span class="small muted">Example: ${L.ex}</span></div>
    </div>`;
  };
  on(el, '[data-v]', 'click', (e, b) => { lv = b.dataset.v; render(); });
  render();
}

// ------------------------------------------------------------------ verification vs validation
export function u1VerVal(el) {
  sorter(el, {
    id: 'u1-verval', icon: 'seal-check', title: 'Verification or validation?', cols: 270,
    options: ['Verification', 'Validation'],
    hint: 'Verification: "Are we building the product right?" (correctness). Validation: "Are we building the right product?" (usefulness).',
    items: [
      { t: 'A unit test checks that <code>add(2, 2)</code> returns 4, as the specification says.', a: 'Verification', why: 'The code is checked against its spec: built right.' },
      { t: 'The client tries the prototype and says: "This is not what our staff actually need."', a: 'Validation', why: 'The product may be correct yet useless: wrong product.' },
      { t: 'A team reviews the design document to confirm it covers every listed requirement.', a: 'Verification', why: 'Checking one artefact against the previous one: built right.' },
      { t: 'Users run UAT on checkout and confirm it fits their business process.', a: 'Validation', why: 'Acceptance by the customer answers "right product?".' },
      { t: 'A code review finds a function that does not follow the agreed design.', a: 'Verification', why: 'Conformance to design is correctness.' },
      { t: 'The app passes every test in the suite, but customers never use the feature it implements.', a: 'Validation', why: 'Correct but not useful: fails validation.' },
      { t: 'Integration tests confirm the login module returns what the API contract promises.', a: 'Verification', why: 'Checks against a specified interface.' },
      { t: 'Early user feedback sessions decide whether the product solves their real problem.', a: 'Validation', why: 'Usefulness to the user is what validation measures.' },
    ],
  });
}

// ------------------------------------------------------------------ functional vs non-functional
export function u1FuncNonFunc(el) {
  sorter(el, {
    id: 'u1-funcnon', icon: 'gauge', title: 'Functional or non-functional?', cols: 250,
    options: ['Functional', 'Non-functional'],
    hint: 'Functional: what does the system do? Non-functional: how does it behave (speed, security, usability)?',
    items: [
      { t: 'Check that the calculator shows 4 for 2 + 2.', a: 'Functional', why: 'Correct feature output: what it does.' },
      { t: 'Check that the calculator stays fast under heavy use.', a: 'Non-functional', why: 'Performance: how it behaves.' },
      { t: 'Log in with valid credentials and confirm you reach the dashboard.', a: 'Functional', why: 'A feature working per requirements.' },
      { t: 'Simulate 10,000 users hitting the checkout at once.', a: 'Non-functional', why: 'Load testing is a performance type.' },
      { t: 'Run OWASP ZAP against the site to look for vulnerabilities.', a: 'Non-functional', why: 'Security testing.' },
      { t: 'Confirm the cart total includes tax and the discount code.', a: 'Functional', why: 'A business rule: what the system does.' },
      { t: 'Ask new users to find the checkout and note how confusing it is.', a: 'Non-functional', why: 'Usability.' },
      { t: 'A smoke test: does the app start and show the home page?', a: 'Functional', why: 'The lab lists smoke testing under functional types.' },
      { t: 'Check the system recovers within 5 seconds after a server restart. (extra example)', a: 'Non-functional', why: 'Reliability is a non-functional quality.' },
      { t: 'Verify the search returns the products that match the keyword.', a: 'Functional', why: 'Feature behaviour per use case.' },
    ],
  });
}
