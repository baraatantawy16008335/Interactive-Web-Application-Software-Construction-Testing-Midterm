// Unit 2: Topic 2 (Imperative & Declarative Programming) + Lab 2 (Code Quality & Programming Paradigms)
import { K, T, W, terms, compare, steps, code, table, OUT } from './helpers.js';

export const lecture = {
  id: 'l2', kind: 'lecture', num: 'L2', icon: 'git-branch',
  title: 'Imperative & Declarative Programming',
  navTitle: 'Imperative & Declarative', mapLabel: 'Imperative vs declarative',
  short: 'How versus what: the two big ways of telling a computer what to do, and how to choose between them.',
  goals: [
    'Define a programming paradigm and name the four in the lecture',
    'Explain imperative programming: definition, features, strengths, weaknesses',
    'Explain declarative programming: definition, features, examples, weakness',
    'Reproduce the imperative vs declarative comparison table',
    'List the factors for choosing the right paradigm',
  ],
  sections: [
    {
      id: 'paradigms', title: 'Programming paradigms',
      body: `<div class="prose">
        <p>A <strong>programming paradigm</strong> is a fundamental approach or style of programming. It guides the <strong>structure, organization and implementation</strong> of software. Each paradigm is a set of principles, concepts and techniques for solving problems, and it shapes <strong>readability, maintainability and extensibility</strong>.</p>
        <p>The lecture overview covers four paradigms:</p></div>
      ${terms([
        ['list-numbers', 'Imperative', 'A sequence of instructions describing <strong>how</strong> to compute. Mutable state and explicit control flow. Gives fine-grained control, so you can optimize performance and handle low-level details.'],
        ['cube', 'Object-Oriented (OOP)', 'Objects encapsulate <strong>data and behavior</strong>. Built on encapsulation, inheritance and polymorphism. Organizes software around objects.'],
        ['function', 'Functional', 'Computation is the evaluation of mathematical functions. Avoids mutable state and side effects. Uses immutability and higher-order functions. Gives predictable, composable code.'],
        ['target', 'Declarative', 'Specify <strong>what</strong> must be achieved, not how. Includes declarative languages, logic programming and database query languages. Focus on the problem domain.'],
      ])}
      ${K('The rest of this topic zooms in on the two ends of the spectrum: <b>imperative = HOW</b> and <b>declarative = WHAT</b>. Remember the one-line rule: imperative is explicit control, declarative is the desired outcome.')}`,
    },
    {
      id: 'imperative', title: 'Imperative programming',
      body: `<div class="prose">
        <p><strong>Definition.</strong> A paradigm that describes a <strong>sequence of statements or instructions</strong> that explicitly specify <strong>how</strong> to perform a computation. Execution is driven by <strong>mutating state</strong> and manipulating data with statements and control structures. Typical commands: assignments, loops, conditionals, function calls.</p></div>
      ${terms([
        ['pencil-simple', 'Mutable state', 'Variables are assigned and modified over time (assignments, function calls, etc.).'],
        ['arrows-split', 'Control flow', 'Loops (<code>for</code>, <code>while</code>) and conditionals (<code>if-else</code>) decide the order of execution.'],
        ['package', 'Procedural abstraction', 'Procedures or functions encapsulate a group of statements, enabling reuse and modularity.'],
        ['list-checks', 'Emphasis on "How"', 'The programmer spells out the exact sequence of steps.'],
      ])}
      ${compare(['thumbs-up', 'Strengths', ['Fine-grained control over execution', 'Efficient access to mutable data', 'Precise performance tuning']], ['thumbs-down', 'Weaknesses', ['Potential for bugs', 'Complex code', 'Harder to reason about']])}
      <div class="prose"><p><strong>Examples:</strong> C, Java, Python.</p></div>
      ${K('If you can point at a variable that changes while the program runs, and at a loop or if that decides what happens next, you are looking at imperative code.')}`,
    },
    {
      id: 'declarative', title: 'Declarative programming',
      body: `<div class="prose">
        <p><strong>Definition.</strong> A paradigm that describes <strong>what</strong> needs to be achieved rather than how. The programmer defines the desired result, and execution is driven by <strong>declarative statements and rules</strong>. It gives a higher level of abstraction.</p></div>
      ${terms([
        ['quotes', 'Declarative statements', 'Express the desired outcome: relationships, constraints, rules, patterns.'],
        ['database', 'Data-driven execution', 'The system or runtime decides the flow from the declarations. There is no explicit control flow written by you.'],
        ['stack', 'Abstraction and separation of concerns', 'Focus on the problem domain. Modular, reusable, composable components.'],
        ['text-align-left', 'Expressiveness and conciseness', 'High-level constructs make code more readable and maintainable.'],
      ])}
      ${table(['Examples', 'Type'], [
        ['<strong>SQL</strong>', 'Database queries'],
        ['<strong>HTML, XML</strong>', 'Markup languages'],
        ['<strong>Prolog</strong>', 'Rule-based (logic) systems'],
        ['<strong>Haskell</strong>', 'Functional language'],
      ])}
      ${compare(['thumbs-up', 'Strengths', ['Simplified logic', 'Code clarity', 'Modularity']], ['thumbs-down', 'Weakness', ['Limited control over low-level implementation', 'Runtime may add performance overhead']])}
      ${T('SQL is declarative: <code>SELECT ... WHERE ...</code> says <i>what</i> rows you want, and the database engine decides <i>how</i> to find them. Java and C are imperative. Do not mix them up because "SQL has commands".')}`,
    },
    {
      id: 'compare', title: 'Imperative vs declarative',
      body: `<div class="prose"><p>This table is a likely exam question. Learn each row.</p></div>
      ${table(['Aspect', 'Imperative', 'Declarative'], [
        ['<strong>Focus</strong>', '<b>How</b> to achieve a computation', '<b>What</b> needs to be achieved'],
        ['<strong>Control flow</strong>', 'Explicit (loops, conditionals)', 'Data-driven, controlled by the system'],
        ['<strong>State</strong>', 'Mutable, with modifications and updates', 'Emphasizes immutability, avoids mutable state'],
        ['<strong>Statements</strong>', 'Series of instructions and commands', 'Declarative statements, rules, constraints'],
        ['<strong>Abstraction</strong>', 'Lower level, explicit programming', 'Higher level, separation of concerns'],
        ['<strong>Readability</strong>', 'Can be complex and harder to understand', 'Often more readable and concise'],
        ['<strong>Reasoning</strong>', 'Needs detailed understanding of program flow', 'Focus on the problem domain, fewer details'],
        ['<strong>Examples</strong>', 'C, Java, Python', 'SQL, HTML, XML, Prolog, Haskell'],
        ['<strong>Advantages</strong>', 'Fine-grained control, efficient mutable data access', 'Simplified logic, code clarity, modularity'],
        ['<strong>Disadvantages</strong>', 'Bugs, complex code, harder to reason about', 'Limited control over low-level implementation'],
      ])}
      ${W('u2Twin')}
      ${W('u2Classify')}
      ${T('Same language, different style. JavaScript and Python can be written both ways: a <code>for</code> loop that pushes into an array is imperative, while <code>filter</code>/<code>map</code> in the same language is declarative. The style is about how you express the solution, not only which language you use.')}`,
    },
    {
      id: 'choosing', title: 'Choosing the right paradigm',
      body: `<div class="prose"><p>The choice depends on four things: the <strong>nature of the problem</strong>, the <strong>project requirements</strong>, the <strong>available tools and technologies</strong>, and the <strong>preferences and expertise of the team</strong>. In practice, check these factors:</p></div>
      ${table(['Factor', 'Declarative fits when...', 'Imperative fits when...'], [
        ['<strong>Problem domain</strong>', 'Rules, constraints, relationships (DB queries, rule-based systems)', 'Needs fine-grained control, mutable state, explicit control flow'],
        ['<strong>Abstraction level</strong>', 'You want to focus on the problem domain, not low-level details', 'You need precise control and performance optimization'],
        ['<strong>Readability and maintainability</strong>', 'More readable and concise (details abstracted away)', 'More verbose, but with clear and explicit control flow'],
        ['<strong>Tools and ecosystem</strong>', 'Consider libraries, frameworks, maturity, community support and tool performance for each paradigm', 'Same'],
        ['<strong>Team skills</strong>', 'Align with team strengths for productivity and quality, or use the project as a chance to learn a new paradigm', 'Same'],
        ['<strong>Performance</strong>', 'Relies on the runtime, may add overhead', 'Low-level control enables tuning'],
        ['<strong>Project constraints</strong>', 'Architecture, compatibility, industry standards or regulations may favor one paradigm', 'Same'],
      ])}
      ${W('u2Paradigm')}`,
    },
    {
      id: 'conclusion', title: 'Conclusion and common traps',
      body: `${K('<b>Conclusion of the lecture:</b> engineers need <b>both</b> paradigms. Choose the right tool for the job to build robust, maintainable, efficient systems.')}
      ${compare(['list-numbers', 'Imperative in one line', ['HOW: steps, mutable state, explicit control flow', 'C, Java, Python', 'Control and efficiency, but bug-prone']], ['target', 'Declarative in one line', ['WHAT: desired result, system decides the flow', 'SQL, HTML, XML, Prolog, Haskell', 'Clarity and abstraction, but less low-level control']])}
      ${T('"Declarative code has no control flow at all" is too strong. The control flow still exists, it is just handled by the system or runtime instead of being written by you.')}
      ${T('Performance cuts both ways in the exam answers: imperative gives <i>precise performance tuning</i>; declarative <i>may add runtime overhead</i>. Do not claim declarative is always slower or always faster.')}`,
    },
  ],
};

export const lab = {
  id: 'lab2', kind: 'lab', num: 'Lab 2', icon: 'bug',
  title: 'Code Quality & Programming Paradigms',
  navTitle: 'Code Quality & Smells', mapLabel: 'Code smells',
  short: 'Both styles in one language, then the code smells that make code hard to maintain and how to fix them.',
  goals: [
    'Write the same task imperatively and declaratively (loops vs filter/map)',
    'Pick the better style for a given problem',
    'Name the 4 smells and fix each one',
    'Apply Return Early and explain Fail Fast',
    'Know when not to return early',
  ],
  sections: [
    {
      id: 'same-language', title: 'Both styles in the same language',
      body: `<div class="prose">
        <p>One language, two styles. <strong>Imperative</strong> JavaScript describes <em>how</em>: a loop, a check, a push. <strong>Declarative</strong> JavaScript describes <em>what</em>: <code>filter</code> and <code>map</code>.</p></div>
      ${code(`
// Imperative: filter even numbers
const numbers = [1,2,3,4,5,6,7,8,9,10];
const evenNumbers = [];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    evenNumbers.push(numbers[i]);
  }
}
console.log("Even numbers:", evenNumbers);`, 'JavaScript · imperative')}
      ${code(`
// Declarative: filter even numbers
const numbers = [1,2,3,4,5,6,7,8,9,10];
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log("Even numbers:", evenNumbers);`, 'JavaScript · declarative')}
      ${code(`
// Square the odd numbers, declaratively
const squaredOddNumbers = numbers
  .filter(num => num % 2 !== 0)
  .map(num => num ** 2);`, 'JavaScript · declarative')}
      ${table(['Aspect', 'Imperative', 'Declarative'], [
        ['Focus', '<b>How</b> to perform a task (step by step)', '<b>What</b> result is needed'],
        ['Control', 'Explicit loops and conditions', 'System or framework handles execution details'],
        ['State', 'Mutable, variables updated directly', 'Often avoids mutable state'],
        ['Code style', 'Detailed, explicit, can become complex', 'Abstract, usually clear and concise'],
        ['Control level', 'Greater flexibility, fine-grained control', 'Less low-level control, system optimizations'],
        ['Examples', 'C, C++, Java, Python (loops), JS (<code>for</code>/<code>while</code>)', 'SQL, HTML, CSS, Prolog, Haskell, JS (<code>map</code>, <code>filter</code>, React)'],
      ])}
      ${K('<b>Trade-off:</b> imperative gives more control over execution; declarative gives more abstraction and simplicity.')}
      <div class="prose"><h4>Which style fits?</h4></div>
      ${W('u2Which')}
      <div class="prose"><h4>Testing styles: a successful login</h4></div>
      ${compare(['list-numbers', 'Imperative: how the test runs', ['Open the login page', 'Enter username "user123"', 'Enter the password', 'Click Login', 'Verify the dashboard opens', 'Verify "user123" is displayed']], ['target', 'Declarative: what behaviour we expect', ['Given the user is on the login page', 'When the user enters valid credentials', 'And submits the login form', 'Then the dashboard should be displayed', 'And the username should appear']])}
      <div class="prose"><p>Declarative-style test code hides the low-level steps (find the username field, enter it, find the password field, enter it, click Login) behind a reusable abstraction such as <code>login_page.login("user123", "password456")</code>. The steps still exist, but the test now focuses on <strong>what</strong>.</p></div>`,
    },
    {
      id: 'smells', title: 'Code smells and anti-patterns',
      body: `<div class="prose">
        <p>A <strong>code smell</strong> is a warning sign in the code that suggests the design or structure could be improved. It makes code hard to maintain. An <strong>anti-pattern</strong> is a common solution that seems helpful but is ineffective and creates new problems: the opposite of a design pattern.</p>
        <p>The lab covers four smells:</p></div>
      ${table(['Smell', 'What it looks like', 'Fix'], [
        ['<strong>1. Arrow anti-pattern</strong>', 'Deep nesting that pushes code right in an arrow shape', 'Return Early (guard clauses)'],
        ['<strong>2. Too many arguments</strong>', 'A long parameter list (interface smell)', 'Split responsibilities, or pass an object'],
        ['<strong>3. Code clones</strong>', 'The same code repeated (violates DRY)', 'Extract function, class or module; parameters; Template/Strategy'],
        ['<strong>4. Unnecessary else</strong>', 'An <code>else</code> after a branch that already returns', 'Remove the else'],
      ])}
      ${W('u2Smells')}`,
    },
    {
      id: 'arrow', title: 'Arrow anti-pattern and Return Early',
      body: `<div class="prose">
        <p>Deeply nested code makes the program <strong>non-linear</strong> and hard to follow. It is hard to tell which <code>else</code> matches which <code>if</code>, error handling gets confusing, and the <strong>main (positive) path is buried</strong> inside the nesting. If nothing stops invalid execution (no <code>return</code> or <code>throw</code>), the function may keep going. Result: harder to read, debug and extend, and more bugs.</p></div>
      ${code(`
// Without Return Early
public void processOrder(Order order) {
    if (order != null) {
        if (order.isPaid()) {
            if (order.isInStock()) {
                // process the order
            }
        }
    }
}`, 'Java · arrow-shaped')}
      <div class="prose"><p><strong>Return Early</strong> (also called the <strong>guard clause</strong> or <strong>bouncer pattern</strong>) means a function exits early when a condition is met. Handle the invalid cases first, so the main logic stays flat and clear. It helps with simplifying code, handling edge cases and readability.</p></div>
      ${code(`
// With Return Early
public void processOrder(Order order) {
    if (order == null) return;
    if (!order.isPaid()) return;
    if (!order.isInStock()) return;

    // process the order
}`, 'Java · guard clauses')}
      ${W('u2Arrow')}
      ${code(`
// Slide exercise: arrow-shaped sendEmail
function sendEmail(email: string, message: string) {
  if (isEmailValid(email)) {
    if (message !== '') {
      return sendgrid.send(email, message);
    } else {
      throw new Error('Cannot send an empty message.');
    }
  } else {
    throw new Error('Email is not valid.');
  }
}`, 'TypeScript · the problem')}
      ${code(`
// (extra example) Refactored: reject invalid cases first
function sendEmail(email: string, message: string) {
  if (!isEmailValid(email)) throw new Error('Email is not valid.');
  if (message === '') throw new Error('Cannot send an empty message.');
  return sendgrid.send(email, message);
}`, 'TypeScript · refactored')}`,
    },
    {
      id: 'failfast', title: 'Fail Fast, and when NOT to return early',
      body: `<div class="prose">
        <p><strong>Fail Fast</strong> means detecting invalid conditions <strong>early and terminating immediately</strong>, so bugs are easy to detect and fix instead of the program running on in an unstable state. It helps with detecting errors early, debugging and program integrity.</p></div>
      ${code(`
function processOrder(order) {
  if (!order) {
    throw new Error("Order cannot be null or undefined");
  }
  if (!order.isPaid) {
    throw new Error("Order must be paid before processing");
  }
  // process the order
}`, 'JavaScript · validate before processing')}
      ${W('u2FailFast')}
      ${compare(['stack-simple', 'Return Early', ['A <b>code structure / pattern</b>', 'Flatter, easier to read', 'About how the function is laid out']], ['lightning', 'Fail Fast', ['An <b>error-handling principle</b>', 'Detect invalid state early and stop', 'About not continuing incorrectly']])}
      ${K('The <code>processOrder</code> example above uses <b>both</b>: the guards are Return Early in structure, and throwing an error is Fail Fast in spirit.')}
      <div class="prose"><h4>Do not return early every time</h4>
        <p>Use <code>return</code> when it <strong>simplifies the flow</strong>, not automatically. Needless multiple returns hurt readability, make debugging harder and risk missing edge cases.</p></div>
      ${code(`
// Unnecessary return
function setAge(age) {
  if (!age) {
    return;
  }
  this.age = age;
}

// Refactored
function setAge(age) {
  if (age) {
    this.age = age;
  }
}`, 'JavaScript')}
      ${T('Return Early is a style to <b>simplify</b> code, not a rule to always apply. In <code>setAge</code> the early return adds nothing: a single positive <code>if (age)</code> is clearer. Note also that <code>!age</code> is true for undefined, null, 0 and "" (falsy values), so <code>setAge(0)</code> would skip the assignment.')}`,
    },
    {
      id: 'other-smells', title: 'Too many arguments, DRY, unnecessary else',
      body: `<div class="prose"><h4>Smell 2: too many arguments (interface smell)</h4>
        <p>A long parameter list is hard to call correctly and hard to extend. Two fixes:</p></div>
      ${compare(['scissors', 'Solution 1: split responsibilities', ['Each group of values belongs to a different responsibility', 'Use smaller handlers: setName, setAge, setWeight, setHeight']], ['package', 'Solution 2: pass an object', ['Related values travel together', 'New inputs can be added without changing the signature or breaking calls', 'Use destructuring inside']])}
      ${code(`
function setName(firstName, lastName) {...}
function setAge(age) {...}

function setPerson(person) {
  const { firstName, lastName, age, weight, height } = person;
  ...
}`, 'JavaScript')}
      <div class="prose"><h4>Smell 3: code clones (DRY)</h4>
        <p><strong>DRY = Don't Repeat Yourself.</strong> Repeated code is a <strong>code clone</strong>. Problems: a bug fixed in one place remains in the others, more maintenance effort and file size, hidden abstractions, and code that is harder to read and refactor.</p></div>
      ${code(`
// Before: repeated ifs
function setPerson(data) {
  const {firstName, lastName, age, weight, height} = data;
  let person = '';
  if (firstName) { person += firstName + ' '; }
  if (lastName)  { person += lastName + ' '; }
  if (age)       { person += age + ' '; }
  if (weight)    { person += weight + ' '; }
  if (height)    { person += height; }
  return person;
}

// After: one shared expression
function setPerson(data) {
  const {firstName, lastName, age, weight, height} = data;
  return [firstName, lastName, age, weight, height]
    .filter(Boolean).join(' ');
}`, 'JavaScript · DRY')}
      ${steps([
        ['Extract Function / Method', 'Give the repeated logic one name and call it everywhere.'],
        ['Extract Class / Module', 'When the repeated code shares state or behavior.'],
        ['Parameters / Generics', 'For small variations between the copies.'],
        ['Template / Strategy patterns', 'For pluggable differences in behavior.'],
      ])}
      <div class="prose"><h4>Smell 4: unnecessary else</h4>
        <p>If the first branch already returns, the final <code>else</code> is not needed. Removing it makes the execution path obvious.</p></div>
      ${code(`
// Smell
function getName(useNickName, data) {
  const { nickName, fullName } = data;
  if (useNickName) {
    return nickName;
  } else {
    return fullName;
  }
}

// Fixed
function getName(useNickName, data) {
  const { nickName, fullName } = data;
  if (useNickName) {
    return nickName;
  }
  return fullName;
}`, 'JavaScript')}`,
    },
  ],
};

const Q = (id, m, q, o, why) => ({ id, m, q, o, why });
export const questions = [
  // ---------------- lecture ----------------
  Q('l2-1', 'l2', 'Which statement best describes the <strong>imperative</strong> paradigm?',
    ['A sequence of instructions that explicitly specify how to perform a computation, driven by mutating state', 'A description of the desired result, with the system deciding the flow', 'Computation as the evaluation of mathematical functions only', 'A way of organizing software purely around objects and inheritance'],
    'Imperative = HOW: statements, mutable state and explicit control flow. The second option is declarative, the third is functional, the fourth is OOP.'),
  Q('l2-2', 'l2', 'Which of the following is a <strong>key feature</strong> of imperative programming?',
    ['Mutable state changed through assignments and control flow', 'Data-driven execution decided by the runtime', 'Avoiding all mutable state and side effects', 'Describing relationships and constraints between facts'],
    'Mutable state and explicit control flow define imperative code. The others describe declarative or functional programming.'),
  Q('l2-3', 'l2', 'Which of these is a <strong>weakness</strong> of imperative programming?',
    ['Potential for bugs and code that is harder to reason about', 'Limited control over low-level implementation', 'Inability to tune performance', 'Cannot use loops or conditionals'],
    'Imperative code can be complex and bug-prone. Limited low-level control is the declarative weakness.'),
  Q('l2-4', 'l2', 'Which of the following is a <strong>declarative</strong> language or notation?',
    ['SQL', 'C', 'Java', 'A Python <code>while</code> loop'],
    'SQL states what data is wanted and the engine decides how. C, Java and loops in Python are imperative.'),
  Q('l2-5', 'l2', 'A developer writes <code>SELECT name FROM students WHERE gpa &gt; 3.5</code>. Why is this called declarative?',
    ['It states what result is wanted, while the database engine decides how to find it', 'It uses a loop to scan each row in a fixed order', 'It changes variables step by step until the result is ready', 'It is compiled instead of interpreted'],
    'Declarative code describes the desired outcome; the system controls the execution flow.'),
  Q('l2-6', 'l2', 'In the comparison between the two paradigms, which row is <strong>correct</strong>?',
    ['Imperative: control flow is explicit. Declarative: control flow is data-driven and system-controlled', 'Imperative: emphasizes immutability. Declarative: mutable state', 'Imperative: higher-level abstraction. Declarative: lower-level abstraction', 'Imperative: examples are SQL and HTML. Declarative: examples are C and Java'],
    'The other rows are swapped. Declarative emphasizes immutability and has the higher level of abstraction; its examples are SQL, HTML, XML, Prolog and Haskell.'),
  Q('l2-7', 'l2', 'What is the main drawback of declarative programming?',
    ['Limited control over low-level implementation, with possible runtime overhead', 'Code is usually longer and harder to read', 'It requires mutable state everywhere', 'It cannot express rules or constraints'],
    'Because the runtime decides the flow, you give up fine-grained control and may pay a performance overhead.'),
  Q('l2-8', 'l2', 'A team must build a real-time simulation where every millisecond counts and precise control over memory and state updates is essential. Which approach best fits?',
    ['Imperative, because it allows fine-grained control and performance tuning', 'Declarative, because it hides all low-level details', 'Declarative, because the runtime always optimizes better than hand-written code', 'Neither, because paradigms do not affect performance'],
    'Performance-critical work with mutable state needs low-level control, which is the imperative strength.'),
  Q('l2-9', 'l2', 'A company needs to extract customer records that match complex business rules from a large database, and wants the code to be concise and easy to maintain. Which approach fits best?',
    ['Declarative (a query language), because the focus is rules and relationships in the problem domain', 'Imperative, with nested loops over every record', 'Imperative, because declarative code cannot filter data', 'Any approach, because the factors do not matter'],
    'Rules, constraints and database queries are the textbook declarative domain.'),
  Q('l2-10', 'l2', 'Which of the following is <strong>not</strong> one of the factors the lecture lists for choosing a paradigm?',
    ['The programmer\'s favourite editor colour theme', 'Team skills and expertise', 'Tools and ecosystem', 'Project constraints such as standards or regulations'],
    'Problem domain, abstraction level, readability, tools, team skills, performance and project constraints are the listed factors.'),
  Q('l2-11', 'l2', 'Which statement best explains why engineers should know <strong>both</strong> paradigms?',
    ['Different problems favour different paradigms, so the right tool must be chosen for the job', 'Declarative code is outdated and imperative is the only modern style', 'Imperative code is always faster, so declarative is never needed', 'Mixing paradigms is forbidden, so one must be learned for each project'],
    'The conclusion of the lecture: choose the right tool for the job to build robust, maintainable, efficient systems.'),
  Q('l2-12', 'l2', 'Which paradigm is characterized by encapsulation, inheritance and polymorphism?',
    ['Object-oriented', 'Functional', 'Declarative', 'Imperative'],
    'OOP organizes software around objects that encapsulate data and behavior.'),
  Q('l2-13', 'l2', 'Which paradigm avoids mutable state and side effects, using immutability and higher-order functions?',
    ['Functional', 'Imperative', 'Object-oriented', 'Procedural'],
    'Functional programming treats computation as evaluating mathematical functions without mutating state.'),
  Q('l2-14', 'l2', 'A team knows only C and Java very well and has a tight deadline. Which factor from the lecture is most relevant to choosing a paradigm?',
    ['Team skills: align with the team\'s strengths for productivity and quality', 'Abstraction level only', 'The format of the documentation', 'Whether the language has a mascot'],
    'Team skills and expertise are an explicit factor. Using a paradigm the team does not know costs time unless learning is a goal.'),
  Q('l2-15', 'l2', 'Which pair correctly matches the paradigm with its typical examples?',
    ['Declarative: Prolog, Haskell. Imperative: C, Java', 'Declarative: C, Java. Imperative: Prolog, Haskell', 'Declarative: Python only. Imperative: HTML only', 'Declarative: Java, SQL. Imperative: XML, C'],
    'Declarative: SQL, HTML, XML, Prolog, Haskell. Imperative: C, Java, Python.'),
  // ---------------- lab ----------------
  Q('lab2-1', 'lab2', 'Which snippet is written in the <strong>declarative</strong> style?',
    ['<pre class="code">const r = nums.filter(n =&gt; n % 2 === 0);</pre>', '<pre class="code">const r = [];\nfor (let i = 0; i &lt; nums.length; i++) {\n  if (nums[i] % 2 === 0) r.push(nums[i]);\n}</pre>', '<pre class="code">let r = [], i = 0;\nwhile (i &lt; nums.length) { if (nums[i] % 2 === 0) r.push(nums[i]); i++; }</pre>', '<pre class="code">let r = [];\nnums.forEach(n =&gt; { if (n % 2 === 0) r.push(n); });</pre>'],
    'Only filter states the result wanted with no manual loop or manual array mutation. The others all build the array by hand with a mutable variable. (forEach with push is still imperative in style.)'),
  Q('lab2-2', 'lab2', 'What is the main problem with the following function?<pre class="code">function processOrder(order) {\n  if (order != null) {\n    if (order.isPaid()) {\n      if (order.isInStock()) {\n        // process the order\n      }\n    }\n  }\n}</pre>',
    ['It is an arrow anti-pattern: deep nesting buries the main logic; fix with Return Early', 'It has too many arguments', 'It contains a code clone', 'It has an unnecessary else'],
    'Deep nesting pushing code to the right is the arrow anti-pattern. Use guard clauses: return early for null, unpaid and out-of-stock cases.'),
  Q('lab2-3', 'lab2', 'What does the following refactoring remove?<pre class="code">// before\nif (useNickName) { return nickName; } else { return fullName; }\n// after\nif (useNickName) { return nickName; }\nreturn fullName;</pre>',
    ['An unnecessary else, because the first branch already returns', 'A code clone', 'An arrow anti-pattern', 'A fail-fast check'],
    'When the if branch returns, the else adds nothing. Removing it makes the execution path obvious.'),
  Q('lab2-4', 'lab2', 'Which statement correctly distinguishes <strong>Return Early</strong> from <strong>Fail Fast</strong>?',
    ['Return Early is a code structure that flattens a function; Fail Fast is an error-handling principle that stops on invalid state', 'Return Early is an error-handling principle; Fail Fast is a code structure', 'They are two names for the same thing', 'Fail Fast means returning only at the end of a function; Return Early means never throwing'],
    'Return Early = pattern/structure (reduce nesting). Fail Fast = philosophy (detect invalid state early and terminate). The processOrder example uses both.'),
  Q('lab2-5', 'lab2', 'A function <code>createReport(title, author, date, format, pages, color, margin, footer)</code> takes eight positional arguments and callers often mix up the order. Which fix does the lab suggest?',
    ['Split responsibilities into smaller handlers, or pass a single object and destructure it', 'Add three more arguments with default values', 'Replace the arguments with global variables', 'Wrap the call in nested if statements'],
    'The "too many arguments" smell is fixed by splitting responsibilities or passing an object. A single object also lets you add inputs without breaking the signature.'),
  Q('lab2-6', 'lab2', 'Three functions apply the same 20% discount formula, copied with different names. A bug is found in the formula. Why is this a problem, and what principle is violated?',
    ['The bug must be fixed in every copy; this violates DRY (Don\'t Repeat Yourself)', 'The bug is fixed automatically everywhere; DRY is not relevant', 'Repeated code runs slower; this violates Fail Fast', 'Nothing is wrong, because copies are independent and safer'],
    'Code clones leave the bug alive in the other copies and raise maintenance effort. Extract one function (with parameters for variations).'),
];

export const glossary = [
  ['Programming paradigm', 'A fundamental approach or style of programming that guides the structure, organization and implementation of software.', 'l2'],
  ['Imperative programming', 'A paradigm describing a sequence of instructions that specify HOW to compute, using mutable state and explicit control flow.', 'l2'],
  ['Declarative programming', 'A paradigm describing WHAT result is wanted; the system or runtime decides how to achieve it.', 'l2'],
  ['Mutable state', 'Variables whose values are assigned and modified while the program runs. Typical of imperative code.', 'l2'],
  ['Control flow', 'The order of execution decided by loops and conditionals. Explicit in imperative code, system-controlled in declarative code.', 'l2'],
  ['Procedural abstraction', 'Encapsulating statements in procedures or functions for reuse and modularity (an imperative feature).', 'l2'],
  ['Object-oriented programming', 'Paradigm organizing software around objects that encapsulate data and behavior (encapsulation, inheritance, polymorphism).', 'l2'],
  ['Data-driven execution', 'The system decides the flow from the declarations instead of explicit control flow. A declarative feature.', 'l2'],
  ['Code smell', 'A warning sign in the code that suggests the design or structure could be improved and makes it hard to maintain.', 'lab2'],
  ['Anti-pattern', 'A common solution that seems helpful but is ineffective and creates new problems (the opposite of a design pattern).', 'lab2'],
  ['Arrow anti-pattern', 'Deeply nested conditionals that push code to the right in an arrow shape and bury the main path.', 'lab2'],
  ['Return Early (guard clause)', 'Exit a function as soon as a condition is met, handling invalid cases first so the main logic stays flat. Also called the bouncer pattern.', 'lab2'],
  ['Fail Fast', 'Principle of detecting invalid conditions early and terminating immediately instead of continuing in an unstable state.', 'lab2'],
  ['DRY', 'Don\'t Repeat Yourself. Repeated code (a code clone) should be extracted into shared functions, classes or modules.', 'lab2'],
  ['Code clone', 'The same or very similar code repeated in several places. Fixes: Extract Function/Class, parameters/generics, Template/Strategy.', 'lab2'],
  ['Too many arguments', 'An interface smell (long parameter list). Fix: split responsibilities or pass one object with destructuring.', 'lab2'],
  ['Unnecessary else', 'An else after a branch that already returns. Remove it to make the execution path obvious.', 'lab2'],
];

export const cheat = [
  ['l2', 'Imperative vs declarative', [
    '<b>Imperative = HOW</b>: sequence of instructions, mutable state, explicit control flow (loops, if-else), procedural abstraction',
    '<b>Declarative = WHAT</b>: desired result, declarative statements/rules, data-driven execution, system decides flow',
    'Imperative examples: C, Java, Python. Declarative: SQL, HTML, XML, Prolog, Haskell',
    'Imperative +: fine-grained control, efficient mutable data, performance tuning. -: bugs, complex, hard to reason about',
    'Declarative +: simplified logic, clarity, modularity, concise. -: limited low-level control, runtime overhead',
    'State: imperative mutable; declarative emphasizes immutability',
    'Abstraction: imperative lower level; declarative higher level, separation of concerns',
  ]],
  ['l2', 'Paradigms and choosing', [
    '4 paradigms in the lecture: imperative, OOP, functional, declarative',
    'OOP = objects, encapsulation, inheritance, polymorphism. Functional = math functions, immutability, higher-order functions',
    'Factors: problem domain, abstraction level, readability/maintainability, tools and ecosystem, team skills, performance, project constraints',
    'Rules/constraints/DB queries lean declarative; fine-grained control and mutable state lean imperative',
    'Conclusion: engineers need both; choose the right tool for the job',
  ]],
  ['lab2', 'Code smells and fixes', [
    '<b>Arrow anti-pattern</b> (deep nesting) -> Return Early / guard clauses',
    '<b>Too many arguments</b> -> split responsibilities, or pass one object (destructure)',
    '<b>Code clones</b> (DRY) -> Extract Function/Method, Extract Class/Module, parameters/generics, Template/Strategy',
    '<b>Unnecessary else</b> -> remove the else when the if already returns',
    'Code smell = warning sign. Anti-pattern = ineffective solution that creates new problems',
  ]],
  ['lab2', 'Return Early vs Fail Fast', [
    '<b>Return Early</b> = code structure (guard clause, bouncer pattern): flatter, more readable',
    '<b>Fail Fast</b> = error-handling principle: detect invalid state early and stop (e.g. throw)',
    'processOrder example uses both: guards structure + throw errors',
    'Do NOT return early every time: only when it simplifies the flow (setAge example)',
    '<code>!age</code> is true for undefined, null, 0 and ""',
    'Lab styles: loop+push = imperative; filter/map = declarative. Timer, factorial = imperative; DB query, render HTML list, filter+double = declarative',
    'Login test: step-by-step clicks = imperative; Given/When/Then = declarative (hide steps behind login_page.login())',
  ]],
];
