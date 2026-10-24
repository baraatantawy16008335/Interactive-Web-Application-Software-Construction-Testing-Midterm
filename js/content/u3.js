import { K, T, W, terms, compare, steps, code, table, OUT } from './helpers.js';

export const lecture = {
  id: 'l3', kind: 'lecture', num: 'L3', icon: 'function',
  title: 'Functional Programming: Fundamentals',
  navTitle: 'FP Fundamentals', mapLabel: 'FP basics',
  short: 'Pure functions, immutability, higher-order functions, recursion, composition and map / filter / reduce.',
  goals: [
    'Define FP, pure functions and side effects',
    'List the 4 characteristics and 4 benefits of pure functions',
    'Explain immutability and higher-order functions',
    'Describe recursion with base case and recursive case',
    'Trace map, filter, reduce and function composition',
  ],
  sections: [
    {
      id: 'what-is-fp', title: 'What is functional programming?',
      body: `<div class="prose">
        <p><strong>Functional programming (FP)</strong> is a programming paradigm that treats computation as the <strong>evaluation of mathematical functions</strong> and avoids changing state and mutable data.</p>
        <ul>
          <li>It focuses on <strong>composing functions</strong> to perform tasks, rather than writing explicit instructions and control flow.</li>
          <li>It is a different mindset from imperative programming. Code tends to be more <strong>concise, modular and reusable</strong>, which promotes safety and maintainability.</li>
          <li>In the lab wording, FP is a <strong>declarative</strong> style: say <em>what</em> you want, not <em>how</em> to do it step by step. Examples: Haskell, Lisp, JavaScript (map, reduce).</li>
        </ul>
      </div>
      ${compare(
        ['gear', 'Imperative', ['Focus: <b>how</b>, step by step, control flow', 'State: mutable variables, shared state', 'Repetition: loops', 'Side effects are common']],
        ['function', 'Functional', ['Focus: <b>what</b>, by composing functions', 'State: immutable data, stateless', 'Repetition: recursion, map / filter / reduce', 'Side effects are avoided (pure functions)']]
      )}
      ${K('Five ideas carry the whole topic: <b>pure functions, immutability, higher-order functions, recursion, composition</b>. Every later section is one of them.')}`
    },
    {
      id: 'pure', title: 'Pure functions',
      body: `<div class="prose">
        <p>A <strong>pure function</strong>, given the same input, always produces the same output and has <strong>no side effects</strong>.</p>
      </div>
      ${table(['Characteristic', 'Meaning'], [
        ['<strong>Deterministic</strong>', 'Same inputs give the same output. The output depends only on the input: no hidden state or external factors.'],
        ['<strong>No side effects</strong>', 'No observable effect outside the function\'s scope (no change to globals, databases, files). Behavior is isolated and predictable.'],
        ['<strong>Referential transparency</strong>', 'A call can be replaced by its resulting value without changing program behavior. This allows equational reasoning and simplification.'],
        ['<strong>Immutable data</strong>', 'Does not modify its inputs. It creates and returns new data structures or values.'],
      ])}
      <div class="prose">
        <p>A <strong>side effect</strong> is any change that happens when a function runs, other than returning a value (it changes something outside its scope). Typical side effects:</p>
        <ul>
          <li>Modifying a global or external variable</li>
          <li>Changing the contents of a data structure passed in</li>
          <li>Writing to a file or database</li>
          <li>Printing to the console or showing an alert</li>
          <li>Making a network request</li>
        </ul>
      </div>
      ${W('u3PureImpure')}
      <div class="prose"><h4>Benefits of pure functions</h4></div>
      ${terms([
        ['test-tube', 'Testability', 'Same input gives the same output with no dependence on external state or resources, so unit tests are straightforward and reliable.'],
        ['book-open-text', 'Readability and maintainability', 'Self-contained, no hidden dependencies. Inputs and return values are explicit, so fewer bugs.'],
        ['arrows-split', 'Parallelism and concurrency', 'Inherently thread-safe: no shared mutable state, so no race conditions and no synchronization needed.'],
        ['bug', 'Debugging', 'Clear input-output relationships make problems easy to locate.'],
      ])}
      ${T('"Pure" needs <b>both</b> halves: same output for the same input <b>and</b> no side effects. A function that prints (<code>console.log</code>) can be deterministic and still be impure.')}`
    },
    {
      id: 'immutability', title: 'Immutability',
      body: `<div class="prose">
        <p><strong>Immutability</strong>: once a value is assigned, it cannot be changed or mutated. It is a core FP concept: treat data as immutable and avoid side effects.</p>
        <ul>
          <li><strong>Immutable data structures</strong> (lists, sets, maps, trees) allow no modification after creation. An operation that "modifies" them returns a <strong>new copy</strong> and leaves the original intact.</li>
          <li><strong>Pure functions and immutability:</strong> immutability enables purity, because inputs and external state are never modified.</li>
          <li><strong>Avoiding state mutation:</strong> instead of changing variables or data in place, create new structures from existing ones.</li>
          <li><strong>Concurrency and parallelism:</strong> immutable data can be shared across threads without locking or synchronization.</li>
        </ul>
      </div>
      ${K('Memory trick from the lab: <b>"Don\'t mutate, return new."</b> Mutable (changes the original) = impure. Immutable (creates a new object) = pure.')}
      <div class="prose"><p>Why it matters: it prevents unintended changes, makes code easier to reason about, reduces side effects and supports pure functions. You can try the push vs spread comparison in the Lab 3 notes.</p></div>`
    },
    {
      id: 'hof', title: 'Higher-order functions',
      body: `<div class="prose">
        <p>A <strong>higher-order function (HOF)</strong> takes other functions as arguments and/or returns a function as its result. This works because functions are <strong>first-class citizens</strong>: they can be assigned to variables, passed as arguments and returned, like any other data.</p>
      </div>
      ${compare(
        ['arrow-bend-down-right', 'Functions as arguments', ['The passed function is a <b>callback</b> (function argument)', 'The HOF invokes it inside its own implementation, passing data to it', 'Example: <code>[1,2,3].map(x => x * 2)</code>']],
        ['arrow-bend-up-left', 'Functions as return values', ['The returned function can be stored in a variable, passed on, or invoked <b>later</b>', 'Creates specialized functions or composes functions into new behavior', 'Example: <code>multiplier(2)</code> returns a doubler']]
      )}
      ${W('u3Multiplier')}
      <div class="prose"><h4>Benefits</h4>
        <ul><li>Modularity and reusability (parameterize behavior by passing a function)</li><li>Abstraction and encapsulation of common patterns</li><li>Function composition</li><li>A more declarative style</li></ul>
      </div>
      ${T('A function that merely <em>calls</em> another function inside its body is not higher-order. It must <b>receive</b> a function as a parameter or <b>return</b> one.')}`
    },
    {
      id: 'recursion', title: 'Recursion',
      body: `<div class="prose">
        <p><strong>Recursion</strong>: a function calls itself within its own definition. It is fundamental to FP and is the alternative to the iterative loops of imperative languages.</p>
      </div>
      ${table(['Characteristic', 'Meaning'], [
        ['<strong>Self-reference</strong>', 'The definition refers to itself (directly or indirectly) with different inputs.'],
        ['<strong>Base case</strong>', 'The condition that terminates the recursion. It prevents infinite loops.'],
        ['<strong>Recursive case</strong>', 'Calls the function again with modified input, moving toward the base case.'],
        ['<strong>Inductive reasoning</strong>', 'Break a complex problem into smaller, simpler instances and solve the base case directly.'],
      ])}
      ${W('u3Recursion')}
      <div class="prose"><h4>Benefits</h4>
        <ul>
          <li>Concise, expressive code; modularity and reuse</li>
          <li>Natural for <strong>trees and graphs</strong> (recursive structure)</li>
          <li>Models math problems: factorial, Fibonacci, exponentiation</li>
          <li>Depth-first search and backtracking</li>
          <li>Fits FP: no mutable variables or control-flow structures, only calls and parameter passing</li>
        </ul>
      </div>
      ${T('A recursive function with <b>no base case</b> (or one the input never reaches) never stops. Always check that every recursive call moves toward the base case.')}`
    },
    {
      id: 'composition', title: 'Composition and pipelines',
      body: `<div class="prose">
        <p>The idea: reduce a big problem into much smaller ones, each solved by <strong>one function</strong>, then reuse, mix and match those functions to build a bigger function.</p>
        <ul>
          <li><strong>Function composition:</strong> combining two or more functions to create a <em>new function</em>.</li>
          <li><strong>Pipeline:</strong> a specific form of composition that emphasizes a <strong>sequential flow</strong>. Functions are applied in order, and the output of each is the input of the next.</li>
        </ul>
      </div>
      ${W('u3Compose')}
      ${T('<code>compose(f, g)</code> is <code>x => f(g(x))</code>: <b>g runs first</b>, then f. Reading it left to right gives the wrong order. A pipeline reads in execution order.')}`
    },
    {
      id: 'lists', title: 'Lists: map, filter, reduce',
      body: `<div class="prose">
        <p><strong>Lists</strong> are collections of elements of any type and are the essential FP data structure for sequences. The functional list operations are themselves higher-order functions.</p>
      </div>
      ${table(['Operation', 'Idea', 'Description'], [
        ['<code>map</code>', 'transform', 'Applies a function to <b>each element</b> and returns a new list of transformed elements (same structure and size).'],
        ['<code>filter</code>', 'select', 'Returns a new list with only the elements that satisfy a <b>predicate</b> function.'],
        ['<code>reduce</code>', 'combine', 'Iterates over the list applying a combining function to accumulate a <b>single value</b>. Takes an initial value.'],
      ])}
      ${code(`
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x * 2);                 // [2, 4, 6, 8]
const evens   = numbers.filter(x => x % 2 === 0);        // [2, 4]
const sum     = numbers.reduce((acc, x) => acc + x, 0);  // 10  (0 is the initial value)
`, 'JavaScript · lecture')}
      ${W('u3Pipeline')}
      ${K('<b>map = transform, filter = select, reduce = combine.</b> None of them mutate the original list.')}`
    },
    {
      id: 'conclusion', title: 'Conclusion',
      body: `${terms([
        ['lock-key', 'Immutability', 'Unmodifiable data for clarity, fewer bugs and better reasoning.'],
        ['seal-check', 'Pure functions', 'The core of FP: no side effects, consistent output. Reliable, testable, composable.'],
        ['function', 'Higher-order functions', 'Functions as first-class citizens give powerful abstractions and composability.'],
        ['repeat', 'Recursion', 'Favored over iterative loops: elegant and readable.'],
        ['puzzle-piece', 'Composition', 'Small functions for reuse, modularity and readability.'],
      ])}
      ${K('Imperative = <b>how</b>, mutable state, loops. Functional = <b>what</b>, immutable data, recursion and map / filter / reduce.')}`
    },
  ],
};

export const lab = {
  id: 'lab3', kind: 'lab', num: 'Lab 3', icon: 'code',
  title: 'Functional Programming I (JavaScript)',
  navTitle: 'FP in JavaScript I', mapLabel: 'Pure & immutable',
  short: 'JavaScript practice: impure vs pure, immutability, returning functions, compose, factorial and the temperature converter.',
  goals: [
    'Spot impure code and rewrite it as pure',
    'Replace push and ++ with spread and new objects',
    'Write a function that returns a function',
    'Evaluate compose and trace a recursive factorial',
  ],
  sections: [
    {
      id: 'lab-pure', title: 'Pure vs impure examples',
      body: `<div class="prose">
        <p>Lab recap: FP is declarative. Core ideas: pure functions, first-class (higher-order) functions, <strong>no side effects</strong>, <strong>lazy evaluation</strong> (delay computation until the value is needed), <strong>statelessness</strong> (do not rely on state that may change) and <strong>immutable data</strong> (create and return new data).</p>
        <h4>Impure: modifies global state</h4>
      </div>
      ${code(`
let total = 0;
function addImpure(a, b) {
  total += a + b;   // modifies global
  return total;
}
addImpure(3, 4);   // 7
addImpure(1, 2);   // 10  (not 3!)
`, 'JavaScript · lab 3')}
      <div class="prose"><h4>Impure: counter, and the pure fix</h4></div>
      ${code(`
let counter = 0;
function increment() {
  counter = counter + 1;
  return counter;
}
increment();   // changes the external counter

// Pure fix: pass the value in, return a new value
function incrementPure(counter) {
  return counter + 1;   // no side effects
}
let c1 = incrementPure(0);    // 1
let c2 = incrementPure(c1);   // 2
`, 'JavaScript · lab 3 (the lab names both versions increment)')}
      ${W('u3SameInput')}
      ${compare(
        ['x-circle', 'Why impure', ['Modifies an external variable', 'Output depends on previous calls', 'Harder to test']],
        ['check-circle', 'Why pure', ['Does not modify external state', 'Same input, same output', 'Easier to test and reuse']]
      )}
      <div class="prose"><h4>Logging is a side effect</h4></div>
      ${code(`
function addAndLog(a, b) {
  const s = a + b;
  console.log(s);   // side effect
  return s;
}
`, 'JavaScript · lab 3')}
      ${K('Keep functions pure: <b>no logging, no I/O</b> inside them. Return the value and print it outside the function.')}`
    },
    {
      id: 'lab-immutable', title: 'Immutability with arrays and objects',
      body: `<div class="prose"><p>Arrays: <code>push</code> changes the original, the spread operator builds a new array.</p></div>
      ${code(`
// Mutable
const numbers = [1, 2, 3];
numbers.push(4);
console.log(numbers);   // [1, 2, 3, 4]

// Immutable
const numbers2 = [1, 2, 3];
const updated = [...numbers2, 4];
console.log(numbers2);  // [1, 2, 3]
console.log(updated);   // [1, 2, 3, 4]
`, 'JavaScript · lab 3')}
      <div class="prose"><p>Objects: mutating the object is impure, returning a new object is pure.</p></div>
      ${code(`
// Mutable object = impure
const user = { name: "Ali", points: 10 };
function addPoint() {
  user.points++;   // modifies original
}
addPoint();
console.log(user.points);   // 11

// Immutable object = pure
function addPointPure(user) {
  return { name: user.name, points: user.points + 1 };
}
const updatedUser = addPointPure(user);
// the original user is untouched; updatedUser.points is one higher
`, 'JavaScript · lab 3 (lab names both functions addPoint)')}
      ${W('u3Mutation')}
      <div class="prose"><p><code>map</code> also does not mutate the original:</p></div>
      ${code(`
const nums = [1, 2, 3];
const doubledNumbers = nums.map(num => num * 2);
console.log(nums);             // [1, 2, 3]  original
console.log(doubledNumbers);   // [2, 4, 6]  new array
`, 'JavaScript · lab 3')}
      ${T('<code>const</code> does <b>not</b> make an array or object immutable. <code>const numbers = [1,2,3]; numbers.push(4)</code> still works. Immutability here comes from how you write the code (spread, new object, map).')}`
    },
    {
      id: 'lab-hof', title: 'Higher-order functions, compose and recursion',
      body: `<div class="prose"><h4>A function returning a function</h4></div>
      ${code(`
function multiplier(factor) {
  return function (x) {
    return x * factor;
  };
}
const double = multiplier(2);
double(5);   // 10
double(7);   // 14
`, 'JavaScript · lab 3')}
      <div class="prose"><h4>Composition</h4></div>
      ${code(`
const double = x => x * 2;
const addOne = x => x + 1;
const compose = (f, g) => x => f(g(x));
const doubleThenAddOne = compose(addOne, double);
doubleThenAddOne(3);   // 7
`, 'JavaScript · lab 3')}
      ${K('<b>Likely exam point:</b> <code>compose(f, g)</code> returns <code>x => f(g(x))</code>, so g runs first. <code>compose(addOne, double)(3) = addOne(double(3)) = addOne(6) = 7</code>.')}
      ${W('u3Compose')}
      <div class="prose"><h4>Recursion: factorial</h4></div>
      ${code(`
const factorial = n => {
  if (n === 0) {              // base case
    return 1;
  }
  return n * factorial(n - 1);   // recursive case
};
console.log(factorial(5));   // 120
`, 'JavaScript · lab 3')}
      ${W('u3Recursion')}
      <div class="prose"><p>Recursion promotes modularity and reuse. By using calls and parameter passing it avoids mutable variables and control-flow structures.</p></div>`
    },
    {
      id: 'lab-activity', title: 'Activity: temperature converter',
      body: `<div class="prose">
        <p>Formulas: <code>C = (F - 32) * 5 / 9</code> and <code>F = (C * 9 / 5) + 32</code>.</p>
        <ul>
          <li><strong>Imperative version:</strong> a <code>TemperatureConverter</code> class with two methods (feels like OOP; the methods belong to the class).</li>
          <li><strong>Functional version:</strong> standalone <strong>pure functions</strong> <code>convertToCelsius()</code> and <code>convertToFahrenheit()</code>. No object is needed.</li>
        </ul>
      </div>
      ${code(`
const convertToCelsius = f => (f - 32) * 5 / 9;
const convertToFahrenheit = c => (c * 9 / 5) + 32;
console.log(convertToCelsius(212));    // 100
console.log(convertToFahrenheit(0));   // 32
`, 'JavaScript · extra example, written from the lab instructions')}
      ${compare(
        ['gear', 'Imperative', ['Focus: how, step by step', 'Mutable variables, shared state', 'Loops', 'Side effects common']],
        ['function', 'Functional', ['Focus: what, by composing functions', 'Immutable data, stateless', 'Recursion, map / filter / reduce', 'Side effects avoided']]
      )}
      ${K('Both functions are pure: the result depends only on the argument and nothing outside changes. That is exactly why they are easy to test (<code>convertToCelsius(212) === 100</code>).')}`
    },
  ],
};

const Q = (id, m, q, o, why) => ({ id, m, q, o, why });
export const questions = [
  Q('l3-1', 'l3', 'Which statement best defines functional programming?', [
    'A paradigm that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data',
    'A paradigm that models a program as objects holding mutable state and methods',
    'A paradigm that lists explicit step-by-step instructions controlled by loops',
    'A paradigm that only works with recursion and never allows variables of any kind'], 'FP is built on mathematical functions and avoids mutable state. Objects with state and explicit loops describe other styles.'),
  Q('l3-2', 'l3', 'Which of these is NOT one of the four key characteristics of a pure function?', [
    'Lazy evaluation of every argument',
    'Deterministic output',
    'No side effects',
    'Referential transparency'], 'The four are deterministic, no side effects, referential transparency and immutable data. Lazy evaluation appears only in the lab recap of FP ideas.'),
  Q('l3-3', 'l3', 'A function is called twice with the same argument and returns different values each time. Which characteristic of purity does it violate?', [
    'Deterministic: the output must depend only on the input',
    'Immutable data: it must never modify its inputs',
    'Parallelism: it must be thread-safe',
    'Debugging: it must have clear names'], 'Same input must give the same output. Reading hidden or external state breaks determinism.'),
  Q('l3-4', 'l3', 'What does referential transparency mean?', [
    'A function call can be replaced by its resulting value without changing the program\'s behavior',
    'A function\'s source code is visible to every other function',
    'A function can refer to variables declared outside its own scope',
    'A function refers to itself in its own definition'], 'Referential transparency allows equational reasoning: replace the call with its value. Self-reference is recursion.'),
  Q('l3-5', 'l3', 'Which of the following is NOT a side effect?', [
    'Returning a new array built from the input',
    'Writing a record to a database',
    'Showing an alert to the user',
    'Changing the contents of an array that was passed in'], 'Returning a value is the normal job of a function. Database writes, alerts and mutating arguments change something outside the function.'),
  Q('l3-6', 'l3', 'A team says: "Our pricing functions are easy to unit test because they need no setup, no database and no mocks." Which benefit of pure functions are they describing?', [
    'Testability',
    'Parallelism',
    'Lazy evaluation',
    'Recursion'], 'Pure functions depend only on their inputs, so tests just supply inputs and check outputs.'),
  Q('l3-7', 'l3', 'Why are pure functions inherently thread-safe?', [
    'They use no shared mutable state, so there are no race conditions and no need for synchronization',
    'They always run on a single thread',
    'The compiler locks every pure function automatically',
    'They never take parameters, so threads cannot interfere'], 'No shared mutable state means threads cannot corrupt each other\'s data, so no locking is needed.'),
  Q('l3-8', 'l3', 'A service processes millions of orders in parallel on many threads and keeps corrupting shared totals. Which FP idea most directly fixes this?', [
    'Immutable data and pure functions that return new values instead of updating shared ones',
    'Replacing every loop with recursion',
    'Adding more global variables to track the totals',
    'Using longer function names'], 'Immutable data can be shared across threads without locking, and pure functions avoid shared mutable state.'),
  Q('l3-10', 'l3', 'Which of these makes a function a higher-order function?', [
    'It takes a function as an argument and/or returns a function',
    'It calls another function somewhere inside its body',
    'It has more than three parameters',
    'It calls itself'], 'A HOF receives or returns functions. Calling itself is recursion; calling a helper does not make it higher-order.'),
  Q('l3-12', 'l3', 'A recursive function is missing its base case. What is the most likely result?', [
    'It keeps calling itself and never terminates normally (until resources run out)',
    'It returns 0 automatically',
    'It behaves like a loop that runs once',
    'It becomes a pure function'], 'The base case is what terminates the recursion. Without it the calls never stop.'),
  Q('l3-13', 'l3', 'Which statement best describes the recursive case?', [
    'It calls the function again with modified input that moves toward the base case',
    'It returns the final answer directly without any further calls',
    'It declares the loop counter variable',
    'It handles errors thrown by the base case'], 'The recursive case reduces the problem toward the base case; the base case ends it.'),
  Q('l3-14', 'l3', 'Why is recursion especially natural for trees and graphs?', [
    'Their structure is itself recursive (a tree is a node with smaller trees below it)',
    'Recursion uses less memory than any loop',
    'Trees cannot be stored in arrays',
    'Loops cannot run on non-numeric data'], 'The lecture lists trees and graphs as natural fits because of their recursive structure.'),
  Q('l3-15', 'l3', 'What is the difference between function composition and a pipeline?', [
    'A pipeline is composition that emphasizes sequential flow: the output of each function is the input of the next',
    'Composition modifies the original functions, a pipeline does not',
    'A pipeline only works with arrays, composition only with numbers',
    'They are unrelated concepts'], 'Composition combines functions into a new one. A pipeline is the sequential form where each output feeds the next.'),
  Q('l3-16', 'l3', 'What does this code print?<pre class="code">const result = [1, 2, 3, 4]\n  .filter(x => x % 2 === 0)\n  .map(x => x * 10)\n  .reduce((acc, x) => acc + x, 0);\nconsole.log(result);</pre>', [
    '60', '100', '[20, 40]', '10'], 'filter keeps [2, 4], map gives [20, 40], reduce sums to 60.'),
  Q('l3-17', 'l3', 'What does <code>reduce</code> return?', [
    'A single accumulated value, built using a combining function and an initial value',
    'A new list with the same size as the input',
    'A list containing only the elements that pass a test',
    'The original list, sorted'], 'map returns a same-size list, filter returns a subset, reduce combines everything into one value.'),
  Q('l3-18', 'l3', 'A shop needs a list of prices that are all increased by 10% while keeping the original price list unchanged. Which approach is the functional one?', [
    '<code>const newPrices = prices.map(p => p * 1.1);</code>',
    '<code>for (let i = 0; i < prices.length; i++) { prices[i] *= 1.1; }</code>',
    '<code>prices.forEach((p, i) => { prices[i] = p * 1.1; });</code>',
    '<code>let total = 0; prices.forEach(p => { total += p; });</code>'], 'map returns a new array and leaves prices alone. The other options mutate the original or do something else entirely.'),
  Q('lab3-1', 'lab3', 'What is the problem with this function?<pre class="code">let total = 0;\nfunction addImpure(a, b) {\n  total += a + b;\n  return total;\n}</pre>', [
    'It modifies a global variable, so the output depends on previous calls',
    'It does not return anything',
    'It uses too many parameters',
    'It should use recursion instead'], 'addImpure(3, 4) gives 7 but a later addImpure(1, 2) gives 10, not 3, because total changed.'),
  Q('lab3-2', 'lab3', 'Which rewrite of this function is pure?<pre class="code">let counter = 0;\nfunction increment() {\n  counter = counter + 1;\n  return counter;\n}</pre>', [
    '<code>function increment(counter) { return counter + 1; }</code>',
    '<code>function increment() { return ++counter; }</code>',
    '<code>function increment() { counter += 1; return counter; }</code>',
    '<code>function increment() { console.log(counter); return counter + 1; }</code>'], 'The pure version takes the value as input and returns a new value. The others still touch the global or log.'),
  Q('lab3-3', 'lab3', 'After this code runs, what are the values of <code>numbers</code> and <code>updated</code>?<pre class="code">const numbers = [1, 2, 3];\nconst updated = [...numbers, 4];</pre>', [
    'numbers = [1, 2, 3], updated = [1, 2, 3, 4]',
    'numbers = [1, 2, 3, 4], updated = [1, 2, 3, 4]',
    'numbers = [1, 2, 3], updated = [4]',
    'numbers = [1, 2, 3, 4], updated = [1, 2, 3]'], 'The spread operator copies into a new array, so the original is not changed.'),
  Q('lab3-4', 'lab3', 'Which function adds a point <b>without</b> mutating the user?', [
    '<code>const addPoint = user => ({ name: user.name, points: user.points + 1 });</code>',
    '<code>const addPoint = user => { user.points++; return user; };</code>',
    '<code>const addPoint = user => { user.points = user.points + 1; };</code>',
    '<code>const addPoint = user => user.points += 1;</code>'], 'Only the first builds and returns a new object. The others change the object passed in.'),
  Q('lab3-5', 'lab3', 'What does this print?<pre class="code">const compose = (f, g) => x => f(g(x));\nconst double = x => x * 2;\nconst addOne = x => x + 1;\nconsole.log(compose(double, addOne)(3));</pre>', [
    '8', '7', '6', '4'], 'g = addOne runs first: 3 + 1 = 4, then f = double: 8. (compose(addOne, double)(3) would be 7.)'),
  Q('lab3-6', 'lab3', 'What does this print?<pre class="code">const mul = f => x => x * f;\nconst triple = mul(3);\nconsole.log(triple(5));</pre>', [
    '15', '8', '35', 'It prints a function'], 'mul(3) returns a function x => x * 3. Calling it with 5 gives 15.'),
  Q('lab3-8', 'lab3', 'A student writes <code>function addAndLog(a, b) { const s = a + b; console.log(s); return s; }</code> and claims it is pure because it is deterministic. What is the best correction?', [
    'It is impure: console.log is a side effect, so remove the logging and print the returned value outside',
    'It is pure: logging does not count as a side effect',
    'It is impure only because it uses const',
    'It is impure because it returns a number'], 'Printing to the console is an observable effect outside the function, so determinism alone is not enough.'),
];

export const glossary = [
  ['Functional programming', 'Paradigm that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data.', 'l3'],
  ['Pure function', 'Same input always gives the same output, and it has no side effects.', 'l3'],
  ['Deterministic', 'Output depends only on the input, with no hidden state or external factors.', 'l3'],
  ['Side effect', 'Any change when a function runs other than returning a value (global change, mutating an argument, I/O, console, network).', 'l3'],
  ['Referential transparency', 'A call can be replaced by its resulting value without changing program behavior.', 'l3'],
  ['Immutability', 'Once assigned, a value is never changed; "modifying" returns a new copy.', 'l3'],
  ['First-class function', 'A function treated like any other data: assignable, passable as an argument, returnable.', 'l3'],
  ['Higher-order function', 'A function that takes functions as arguments and/or returns a function.', 'l3'],
  ['Callback', 'A function passed as an argument that the higher-order function invokes.', 'l3'],
  ['Recursion', 'A function calls itself within its own definition; replaces loops in FP.', 'l3'],
  ['Base case', 'The condition that terminates a recursion.', 'l3'],
  ['Recursive case', 'Calls the function again with modified input, moving toward the base case.', 'l3'],
  ['Function composition', 'Combining two or more functions to create a new function.', 'l3'],
  ['Pipeline', 'Composition emphasizing sequential flow: the output of each function is the input of the next.', 'l3'],
  ['map / filter / reduce', 'map transforms each element, filter selects by a predicate, reduce combines into one value; none mutate the original.', 'l3'],
  ['compose(f, g)', 'Returns x => f(g(x)): g runs first, then f.', 'lab3'],
  ['Spread operator', 'The ... syntax: [...numbers, 4] builds a new array instead of mutating with push.', 'lab3'],
  ['Statelessness', 'Not relying on state that may change between calls.', 'lab3'],
];

export const cheat = [
  ['l3', 'Pure functions', [
    'Pure = same input gives same output AND no side effects',
    '4 characteristics: deterministic, no side effects, referential transparency, immutable data',
    '4 benefits: testability, readability and maintainability, parallelism and concurrency, debugging',
    'Side effects: change global, mutate argument, write file or DB, console or alert, network request',
    'Immutability: "modify" returns a new copy; the original stays intact',
  ]],
  ['l3', 'HOF, recursion, composition', [
    'HOF: takes functions as arguments and/or returns a function (functions are first-class)',
    'Callback = function argument that the HOF invokes',
    'Recursion = self-call; needs a base case and a recursive case',
    'Recursion suits trees, graphs, factorial, Fibonacci, DFS and backtracking',
    'Composition combines functions; pipeline = sequential, output feeds the next',
    'map = transform, filter = select, reduce = combine (single value, initial value)',
  ]],
  ['lab3', 'Lab 3 code patterns', [
    'Impure: total += a + b on a global; counter = counter + 1; console.log inside a function',
    'Pure fix: pass the value in, return a new value; print outside',
    'numbers.push(4) mutates; [...numbers, 4] makes a new array',
    'user.points++ mutates; return { name: user.name, points: user.points + 1 } is pure',
    'multiplier(factor) returns x => x * factor',
    'compose = (f, g) => x => f(g(x)): g first. compose(addOne, double)(3) = 7',
    'factorial: base case n === 0 returns 1; else n * factorial(n - 1)',
    'Temperature: C = (F - 32) * 5 / 9 and F = (C * 9 / 5) + 32 as pure functions',
  ]],
];
