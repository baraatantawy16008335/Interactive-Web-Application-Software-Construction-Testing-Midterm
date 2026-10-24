import { K, T, W, terms, compare, steps, code, table, OUT } from './helpers.js';

export const lecture = {
  id: 'l4', kind: 'lecture', num: 'L4', icon: 'brackets-curly',
  title: 'Functional Programming: Advanced', navTitle: 'FP Advanced', mapLabel: 'FP advanced',
  short: 'Currying, partial application, type systems and inference, laziness, pattern matching, concurrency vs parallelism.',
  goals: [
    'Define currying and partial application and tell them apart',
    'Explain type systems, type safety and type inference',
    'Explain laziness and why it allows infinite data structures',
    'Define pattern matching and its benefit',
    'Contrast concurrency with parallelism',
  ],
  sections: [
    {
      id: 'currying', title: 'Currying and partial application',
      body: `<div class="prose"><p>Both ideas transform a function with <strong>multiple arguments</strong> into functions with <strong>fewer arguments</strong>, or into a <strong>sequence of single-argument functions</strong>. Both rely on <strong>higher-order functions</strong> (functions are first-class citizens: they can be passed around and returned).</p></div>
      ${compare(
        ['stack', 'Currying', ['Convert a function taking <strong>multiple arguments</strong> into a <strong>sequence of functions, each taking a single argument</strong>.', 'The curried function takes the first argument and returns a new function for the second, and so on, until all arguments are consumed and the result is returned.', '<code>f(a, b, c)</code> becomes <code>f(a)(b)(c)</code>.']],
        ['funnel', 'Partial application', ['<strong>Fix (pre-fill) some</strong> of the arguments to get a new function with fewer arguments.', 'Gives <strong>specialised versions</strong> of a general function.', 'The new function is called later with the <strong>remaining</strong> arguments.']]
      )}
      ${table(['', 'Currying', 'Partial application'], [
        ['Idea', 'Break into <strong>one argument at a time</strong>', '"Pre-fill" <strong>some</strong> arguments at once'],
        ['Call style', '<code>f(a)(b)(c)</code>', '<code>g = f.bind(null, a); g(b, c)</code>'],
        ['Benefit', 'Modularity, reusability, composability, flexibility', 'Modularity, reusability, composability, flexibility'],
      ])}
      ${W('u4Curry')}
      ${K('Currying always goes <strong>one argument per function</strong>. Partial application can fix <strong>several</strong> arguments in one step and returns a function for the rest.')}
      ${T('Do not say "partial application is currying". The slides treat them as similar but different: curried form is <code>f(a)(b)(c)</code>; partial application is "pre-fill some, call the rest later".')}`,
    },
    {
      id: 'types', title: 'Type systems and type inference',
      body: `<div class="prose"><p>A <strong>type system</strong> is a set of <strong>rules and constraints</strong> that assign types to variables, expressions and functions.</p><ul>
        <li>It ensures <strong>type safety</strong>: it enforces the type rules and prevents incompatible operations.</li>
        <li>It gives <strong>static type checking</strong>, program correctness and safety.</li></ul>
        <p><strong>Type inference</strong> means the compiler <strong>automatically deduces types</strong> from the usage and the context of the declaration. This removes the need for explicit type annotations in some cases, so code is <strong>more concise and readable</strong>.</p></div>
      ${compare(
        ['shield-check', 'Type system', ['Rules that assign types', 'Enforces type safety', 'Prevents incompatible operations (e.g. adding a number to a function)', 'Static checking before the program runs']],
        ['magic-wand', 'Type inference', ['Compiler deduces the types for you', 'Fewer explicit annotations', 'Still type safe', 'Shorter, more readable code']]
      )}
      ${code(`// (extra example, TypeScript-style)
const price = 12.5;            // inferred: number, no annotation needed
price.toUpperCase();           // compile-time error: type system blocks it`, 'extra example')}
      ${K('Inference does not mean "no types". The types still exist and are still checked; the compiler just works them out so you do not have to write them.')}`,
    },
    {
      id: 'laziness', title: 'Laziness and infinite data structures',
      body: `<div class="prose"><p><strong>Laziness</strong>: expressions or computations are <strong>deferred until their value is actually needed</strong> (on-demand evaluation). It avoids unnecessary computation, which is a performance gain.</p>
        <p><strong>Infinite data structures</strong> represent an <strong>unbounded, potentially infinite</strong> amount of data. You work with the sequence <strong>without defining its size</strong> or generating all elements upfront.</p></div>
      ${K('Laziness is what makes infinite structures possible: only the elements you ask for are ever computed.')}
      ${code(`function* naturals() { let n = 0; while (true) yield n++; }   // infinite, but lazy
const it = naturals();
it.next().value;   // 0  (computed only now)
it.next().value;   // 1`, 'JavaScript (extra example)')}
      ${W('u4Lazy')}
      ${T('An eager version of an infinite list never finishes. Laziness is not "slow"; it is "do the work only when someone asks for the result".')}`,
    },
    {
      id: 'pattern', title: 'Pattern matching',
      body: `<div class="prose"><p><strong>Pattern matching</strong> is a technique to <strong>match the structure of data against predefined patterns</strong> and perform <strong>different computations or actions based on the match</strong>.</p><ul>
        <li>Simplifies handling of complex data structures with concise, structured actions.</li>
        <li>Improves <strong>readability</strong> and logic in functional programming (replaces long if-else chains).</li></ul>
        <p>Languages without full pattern matching approximate it. In the lab, JavaScript uses <code>switch</code> and destructuring (see Lab 4).</p></div>
      ${code(`function describe(shape) {
  switch (shape.kind) {          // (extra example)
    case "circle": return "round";
    case "square": return "four equal sides";
    default:       return "unknown";
  }
}`, 'JavaScript (extra example)')}`,
    },
    {
      id: 'conc', title: 'Concurrency and parallelism',
      body: `${table(['', 'Concurrency', 'Parallelism'], [
        ['Meaning', 'Multiple tasks execute <strong>independently, potentially overlapping in time</strong>', '<strong>Simultaneous execution</strong> of multiple tasks'],
        ['Aim', 'Manage different tasks, <strong>maximise resource utilisation and responsiveness</strong>', 'Improve <strong>performance</strong> by dividing a larger task into smaller subtasks run at the same time'],
        ['Useful when', 'Tasks can progress concurrently, <strong>even if not executed simultaneously</strong>', '<strong>Computationally intensive</strong> tasks that divide into <strong>independent units of work</strong>'],
      ])}
      ${W('u4Concurrency')}
      ${K('Concurrency is about <strong>dealing with</strong> many things at once (responsiveness). Parallelism is about <strong>doing</strong> many things at once (speed). One core can be concurrent but never parallel.')}
      ${T('"Concurrent" does not mean "simultaneous". Overlapping in time can be achieved by taking turns.')}`,
    },
    {
      id: 'conclusion', title: 'Conclusion: what each concept gives you',
      body: `${table(['Concept', 'Payoff'], [
        ['Currying / partial application', 'Modularity and reusability, composability, flexibility'],
        ['Type systems / inference', 'Correctness and safety, static checking, fewer annotations'],
        ['Laziness / infinite structures', 'Delayed computation, efficiency, concise large or infinite datasets'],
        ['Pattern matching', 'Concise structured actions, readability'],
        ['Concurrency / parallelism', 'Responsiveness, scalability, efficiency'],
      ])}
      ${W('u4Concepts')}`,
    },
  ],
};

export const lab = {
  id: 'lab4', kind: 'lab', num: 'Lab 4', icon: 'file-code',
  title: 'Functional Programming II: Specs, Design & Currying', navTitle: 'Specs, Design & Bind', mapLabel: 'Specs and bind',
  short: 'Method specifications, JSDoc, function design, naming conventions, currying, bind, and switch-based pattern matching in JavaScript.',
  goals: [
    'Write a specification with requires, effects and modifies',
    'Say who is responsible for the precondition and the postcondition',
    'Spot bad function design and apply the design principles',
    'Apply naming conventions and JSDoc tags',
    'Write currying, bind and switch pattern matching in JavaScript',
  ],
  sections: [
    {
      id: 'spec', title: 'Method specification',
      body: `<div class="prose"><p>A <strong>specification</strong> is a <strong>contract between a method and its callers</strong>. It defines what the method <strong>expects</strong> and what behaviour it <strong>guarantees</strong>. Code alone does not tell the caller the guaranteed behaviour.</p>
        <p>Slide example: <code>findA</code> returns the first index and <code>a.length</code> if the value is missing; <code>findB</code> returns the last index and <code>-1</code> if missing. Same goal, different behaviour: which index? what if it appears twice? what if it does not appear?</p></div>
      ${table(['Clause', 'Keyword', 'Meaning', 'Responsible'], [
        ['Precondition', '<code>requires</code>', 'Must be true <strong>before</strong> the call. If violated, behaviour is <strong>not guaranteed</strong> (may throw, return arbitrary results, modify arbitrary state, or not terminate)', '<strong>Caller</strong>'],
        ['Postcondition', '<code>effects</code>', 'Guaranteed true <strong>after</strong> execution (correct return values, exceptions thrown, state modified or not)', '<strong>Implementer</strong>'],
        ['Frame condition', '<code>modifies</code>', 'Variables whose value <strong>may</strong> be modified. Related to the postcondition. <strong>May be omitted</strong> if nothing is modified (desirable in FP, pure functions)', 'Implementer'],
      ])}
      ${K('If the caller satisfies the precondition, the implementation <strong>must</strong> satisfy the postcondition. Pre asks "What must be true?" (before, caller). Post asks "What will be true?" (after, implementer).')}
      ${compare(
        ['magnifying-glass', 'Example: find', ['<code>requires:</code> val occurs exactly once in a', '<code>effects:</code> returns the index i such that a[i] == val', '<code>modifies:</code> nothing']],
        ['bank', 'Example: withdraw', ['<code>function withdraw(balance, amount) { return balance - amount; }</code>', '<code>requires:</code> amount &gt; 0 and amount &lt;= balance', '<code>effects:</code> returns balance - amount', '<code>modifies:</code> nothing']]
      )}
      ${W('u4Spec')}
      ${W('u4Blame')}
      ${T('If the precondition is violated, the implementer is <strong>not</strong> at fault, whatever the method does. Blame the implementer only when the precondition held and the postcondition did not.')}`,
    },
    {
      id: 'design', title: 'JSDoc and good function design',
      body: `<div class="prose"><p><strong>JSDoc</strong> (JavaDoc in Java) is a convention for documenting code with structured comments. Keep documentation <strong>close to the code</strong> so it does not go out of date.</p></div>
      ${table(['Describes', 'Tag'], [['Parameters', '<code>@param</code>'], ['Results', '<code>@return</code>'], ['Exceptions', '<code>@throws</code>']])}
      ${code(`/**
 * Find value in an array.
 * @param a   array to search; requires that val occurs exactly once in a
 * @param val value to search for
 * @return index i such that a[i] = val
 */
static int find(int[] a, int val)`, 'Java doc (slide)')}
      ${code(`/**
 * @param {number} age - The user's age     // @tag {type} name - description
 */
function checkAge(age) { /* ... */ }`, 'JSDoc form (extra example)')}
      <div class="prose"><p>A good specification is <strong>clear, concise and well-structured</strong>. But clear and concise can still be <strong>ambiguous or incomplete</strong>. If a function is hard to specify, it has a design problem.</p></div>
      ${compare(
        ['warning', 'sumFind: bad design', ['<code>sumFind(int[] a, int[] b, int val)</code>: returns the sum of all indices in a and b at which val appears', 'Multiple responsibilities: searches two arrays <strong>and</strong> sums indices', 'Fix: one function to find matching indices, another to sum them']],
        ['warning', 'countLongWords: bad design', ['<code>public static int LONG_WORD_LENGTH = 5;</code> and <code>public static String longestWord;</code> are <strong>global variables</strong>', '<strong>Prints</strong> instead of returning', '<strong>Two responsibilities</strong>: count long words and find the longest', 'Fix: split into two functions']]
      )}
      ${K('One responsibility &rarr; easier specification &rarr; easier testing &rarr; easier reuse.')}
      ${terms([
        ['repeat', 'DRY', 'Do not repeat yourself.'],
        ['lightning', 'Fail fast', 'Report problems as early as possible.'],
        ['number-circle-one', 'Avoid magic numbers', 'Hard-coded unexplained literals, e.g. <code>3.14</code> instead of a named constant.'],
        ['target', 'One responsibility', 'One job per function.'],
        ['text-aa', 'Meaningful names', 'Names that say what the thing is or does.'],
        ['globe', 'Avoid global variables', 'In Java: <code>public static</code>.'],
        ['arrow-u-up-left', 'Return, do not print', 'Return results so callers can reuse them.'],
        ['chat-text', 'Comments only when needed', 'Do not comment the obvious.'],
      ])}
      ${W('u4Smells')}
      <div class="prose"><p>Recap of a good function: clear inputs and outputs, predictable behaviour, no side effects, single responsibility, reusable.</p></div>`,
    },
    {
      id: 'naming', title: 'Naming conventions',
      body: `${table(['Item', 'Convention', 'Example'], [
        ['Variables', 'camelCase', '<code>totalPrice</code>'],
        ['Functions', 'camelCase, verb-like (<code>name</code> bad, <code>getName</code> good)', '<code>getName</code>'],
        ['Constants', 'UPPER_SNAKE_CASE', '<code>LONG_WORD_LENGTH</code>'],
        ['Classes', 'PascalCase', '<code>BankAccount</code>'],
        ['Private variable', 'can prefix with <code>_</code> (not a standard practice)', '<code>_balance</code>'],
        ['Booleans', 'is / has / are prefix', '<code>isActive</code>, <code>hasEncryption</code>, <code>areEqual</code>'],
        ['File names', 'Frontend components: PascalCase. Backend: varies, kebab-case and camelCase are common', ''],
      ])}
      ${W('u4Names')}
      ${K('Use meaningful and consistent names throughout the project.')}`,
    },
    {
      id: 'bind', title: 'Currying and partial application in JavaScript',
      body: `${compare(
        ['stack', 'Currying: multiply', ['<code>multiply(2, 3, 4)</code> gives 24', 'Curried: <code>multiply(2)(3)(4)</code> gives 24', 'Each nested function returns the next one']],
        ['funnel', 'Partial application with bind', ['<code>const multiplyBy2 = multiply.bind(null, 2)</code> (fix a as 2)', '<code>multiplyBy2(3, 4)</code> gives 24', 'Reuse: specific versions of general functions; common in React, Lodash, Ramda']]
      )}
      ${code(`function multiply(a, b, c) {
  return a * b * c;
}
multiply(2, 3, 4); // 24

function multiply(a) {
  return function(b) {
    return function(c) {
      return a * b * c;
    }
  }
}
multiply(2)(3)(4); // 24`, 'JavaScript · currying')}
      <div class="callout trap"><i class="ph ph-warning"></i><div><strong>bind syntax.</strong> <code>fn.bind(thisValue, arg1, arg2, ...)</code>. The <strong>first</strong> argument is the <code>this</code> value (<code>null</code> = "I don't care"). The rest are pre-filled <strong>from the left</strong>. So <code>add.bind(2, null)</code> sets this = 2 and a = null (the slide's trap).</div></div>
      ${code(`function greet(timeOfDay) {
  return function(name) {
    return \`Good \${timeOfDay}, \${name}!\`;
  };
}
const morningGreet = greet("morning");
const result = morningGreet("Menna");  // "Good morning, Menna!"`, 'Exercise 1: curried greet')}
      ${code(`// Solution 1: bind (width first in the signature, bind fills from the left)
function volume(width, length, height) {
  return length * width * height;
}
const volumeWithFixedWidth = volume.bind(null, 5);

// Solution 2: arrow function (can fix any position)
function volume(length, width, height) {
  return length * width * height;
}
const volumeWithFixedWidth = (length, height) => volume(length, 5, height);
volumeWithFixedWidth(2, 10); // 2*5*10 = 100`, 'Exercise 2: volume of a box, fix width = 5')}
      ${W('u4Bind')}
      ${K('That is why the parameter order differs between the two solutions: <code>bind</code> pre-fills from the <strong>left</strong>, so width had to come first. An arrow wrapper can fix any position.')}`,
    },
    {
      id: 'match', title: 'Pattern matching in JavaScript',
      body: `<div class="prose"><p>Compare a value or structure against patterns and act on the match. <strong>Benefits</strong>: cleaner code (fewer complex if-else), expressive, readable. <strong>Use cases</strong>: checking the possible values of a variable, extracting values from objects or lists by structure, handling complex structures (trees, graphs). The lab uses <code>switch</code> and <strong>destructuring</strong>.</p></div>
      ${code(`function getDayType(day) {
  switch (day) {
    case "Saturday":
    case "Sunday":
      return "Weekend";
    case "Monday": case "Tuesday":
    case "Wednesday": case "Thursday":
    case "Friday":
      return "Weekday";
    default:
      return "Invalid day";
  }
}
getDayType("Saturday"); // "Weekend"`, 'switch with fall-through')}
      ${code(`function getShapeType(sides) {
  switch (sides) {
    case 3: return "Triangle";
    case 4: return "Square";
    case 5: return "Pentagon";
    default: return "Unknown Shape";
  }
}
getShapeType(7); // "Unknown Shape"

function matchPerson(person) {
  const { age } = person;
  if (age < 18) return "Minor";
  else if (age >= 18 && age < 65) return "Adult";
  else return "Senior";
}`, 'Exercises 1 and 2: getShapeType, matchPerson (destructuring)')}
      ${W('u4Match')}
      ${T('Cases without <code>return</code> or <code>break</code> <strong>fall through</strong> into the next case. That is how "Saturday" and "Sunday" share one result. <code>default</code> handles no match. Remember <code>switch</code> compares with strict equality: the string "4" does not match <code>case 4</code>.')}`,
    },
  ],
};

const Q = (id, m, q, o, why) => ({ id, m, q, o, why });
export const questions = [
  Q('l4-1', 'l4', 'Which statement best describes currying?', ['A multi-argument function becomes a chain of functions, each taking a single argument', 'Some arguments of a function are fixed so a new function takes the rest', 'Computation is deferred until its value is needed', 'Tasks are split into subtasks running simultaneously'], 'Currying turns f(a, b, c) into f(a)(b)(c). The second option describes partial application.'),
  Q('l4-2', 'l4', 'What is the main difference between currying and partial application?', ['Currying takes one argument per function; partial application pre-fills some arguments at once', 'Currying works only on two-argument functions; partial application works on any', 'Currying is lazy; partial application is eager', 'Partial application needs a type system; currying does not'], 'Both reduce arguments, but currying goes one at a time while partial application "pre-fills" several in one go.'),
  Q('l4-3', 'l4', 'What does this print?' + `<pre class="code">${'function multiply(a, b, c) { return a * b * c; }\nconst m = multiply.bind(null, 2);\nconsole.log(m(3, 4));'.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`, ['24', '12', 'NaN', '2'], 'bind fixes a = 2, then m(3, 4) calls multiply(2, 3, 4) = 24.'),
  Q('l4-4', 'l4', 'A shop wants <code>priceWithTax(rate)(price)</code> so it can create <code>vat14</code> once and reuse it for every price. Which technique is this?', ['Currying', 'Lazy evaluation', 'Concurrency', 'Type inference'], 'A function that takes one argument and returns a function for the next is a curried function; vat14 is a specialised, reusable version.'),
  Q('l4-5', 'l4', 'Which is a benefit of type inference?', ['The compiler deduces types, so fewer explicit annotations are needed', 'It removes all types from the program', 'It checks types only at runtime', 'It makes programs run in parallel'], 'Inference makes code more concise and readable while types are still checked statically.'),
  Q('l4-6', 'l4', 'What does a type system primarily provide?', ['Rules assigning types that enforce type safety and prevent incompatible operations', 'Automatic parallel execution', 'Delayed evaluation of expressions', 'Replacement of if-else chains'], 'A type system is a set of rules and constraints on types of variables, expressions and functions; it ensures type safety.'),
  Q('l4-7', 'l4', 'Why do lazy evaluation and infinite data structures go together?', ['Only the elements that are requested are computed, so the whole sequence never has to exist', 'Infinite structures are stored in a special infinite memory', 'Lazy code runs on all cores at once', 'Laziness forces every element to be computed upfront'], 'On-demand evaluation lets you work with an unbounded sequence without defining its size or generating all elements.'),
  Q('l4-8', 'l4', 'What does this code do?' + `<pre class="code">function* naturals() { let n = 0; while (true) yield n++; }\nconst it = naturals();\nit.next(); it.next();\nconsole.log(it.next().value);</pre>`, ['Prints 2, and only three values were ever computed', 'Runs forever without printing', 'Prints 0', 'Throws an error because the loop is infinite'], 'The generator is lazy: each next() computes one value. Three calls give 0, 1, 2, so the last printed value is 2.'),
  Q('l4-9', 'l4', 'A programmer builds the list of ALL prime numbers eagerly before using the first 10. What is the main problem?', ['The program never finishes building an unbounded list; a lazy sequence would compute only 10', 'Primes cannot be represented in a type system', 'The list would be built in parallel and corrupt', 'Pattern matching cannot handle primes'], 'Eager evaluation of an infinite structure never terminates. Laziness defers work until the values are needed.'),
  Q('l4-10', 'l4', 'Which definition of pattern matching matches the lecture?', ['Matching the structure of data against predefined patterns and acting on the match', 'Fixing some arguments of a function in advance', 'Running independent tasks at the same time', 'Deducing variable types from context'], 'Pattern matching simplifies complex data handling and improves readability, replacing long if-else chains.'),
  Q('l4-11', 'l4', 'A developer replaces a 15-line if-else chain on a "shape" field with a single construct that lists each shape and its action. Which concept is being used?', ['Pattern matching', 'Currying', 'Parallelism', 'Type inference'], 'Listing patterns with an action per match is exactly pattern matching (a switch is the JavaScript approximation).'),
  Q('l4-12', 'l4', 'Which statement correctly contrasts concurrency and parallelism?', ['Concurrency lets tasks overlap in time, even on one core; parallelism runs subtasks simultaneously', 'Concurrency always needs several cores; parallelism does not', 'Parallelism is about responsiveness; concurrency is about speed', 'They are two names for the same thing'], 'Concurrency: independent progress, possibly interleaved. Parallelism: simultaneous execution of subtasks to improve performance.'),
  Q('l4-13', 'l4', 'A video editor splits a large render into 8 independent chunks processed at the same time on 8 cores. Which term fits best?', ['Parallelism', 'Currying', 'Laziness', 'Concurrency without simultaneity'], 'One computationally intensive task divided into independent units executed simultaneously is parallelism.'),
  Q('l4-14', 'l4', 'A single-core phone app keeps the UI responsive while a download and a sync both make progress by taking turns. What is this?', ['Concurrency', 'Parallelism', 'Currying', 'Pattern matching'], 'Tasks overlap in time and progress independently, but a single core cannot run them simultaneously, so it is concurrency only.'),
  Q('l4-15', 'l4', 'Which statement about concurrency is true?', ['Tasks can progress concurrently even if they are not executed simultaneously', 'It requires every task to run at the same instant', 'It is only useful for computationally intensive tasks', 'It always makes a single task finish faster'], 'The lecture stresses "even if not executed simultaneously". Speeding up one big task is the goal of parallelism.'),
  Q('l4-16', 'l4', 'Which pairing of concept and payoff matches the lecture conclusion?', ['Type systems: correctness and safety, static checking', 'Pattern matching: scalability', 'Laziness: static type checking', 'Currying: responsiveness'], 'Type systems give correctness and safety; pattern matching gives concise actions and readability; laziness gives delayed computation and efficiency; concurrency gives responsiveness.'),
  Q('lab4-1', 'lab4', 'In a method specification, who is responsible for making the precondition (<code>requires</code>) true?', ['The caller', 'The implementer', 'The compiler', 'The test suite'], 'The caller must guarantee the precondition. The implementer guarantees the postcondition if the precondition held.'),
  Q('lab4-2', 'lab4', 'For <code>withdraw(balance, amount)</code> returning <code>balance - amount</code>, <code>withdraw(100, 250)</code> returns -150. Who is at fault?', ['The caller, because amount &lt;= balance (the precondition) was violated', 'The implementer, because negative results are never allowed', 'Nobody, because the spec forbids returning numbers', 'The compiler'], 'If the precondition fails, behaviour is not guaranteed, so the caller is responsible.'),
  Q('lab4-3', 'lab4', 'Which clause may be omitted when a function changes no state?', ['<code>modifies</code> (the frame condition)', '<code>requires</code>', '<code>effects</code>', 'All three must always appear'], 'The frame condition may be omitted if nothing is modified. This is desirable in functional programming with pure functions.'),
  Q('lab4-4', 'lab4', 'Which problems does this have?' + `<pre class="code">public static int LONG_WORD_LENGTH = 5;\npublic static String longestWord;\npublic static void countLongWords(List&lt;String&gt; words)</pre>`, ['Global variables, prints instead of returning, and two responsibilities', 'Only that the method name is too long', 'It lacks a type system', 'It is not curried'], 'The lab lists global (public static) variables, printing the result, and two responsibilities (count long words and find the longest).'),
  Q('lab4-5', 'lab4', 'What does <code>matchPerson({ name: "A", age: 65 })</code> return with the lab code (<code>age &lt; 18</code> Minor, <code>age &gt;= 18 &amp;&amp; age &lt; 65</code> Adult, else Senior)?', ['"Senior"', '"Adult"', '"Minor"', 'undefined'], '65 is not less than 65, so the Adult branch fails and the else branch returns "Senior".'),
  Q('lab4-6', 'lab4', 'Why does <code>getDayType("Saturday")</code> return "Weekend" although the <code>case "Saturday"</code> has no <code>return</code>?', ['The case falls through to the next case, "Sunday", which returns "Weekend"', 'switch always returns the last string', 'default runs first', 'It is a syntax error that happens to work'], 'Without return or break, execution continues into the next case body. That is how several values share one result.'),
  Q('lab4-7', 'lab4', 'You need a function with width fixed at 5 and the signature <code>volume(length, width, height)</code>. Which works?', ['An arrow wrapper: <code>(length, height) =&gt; volume(length, 5, height)</code>', '<code>volume.bind(null, 5)</code>', '<code>volume.bind(5)</code>', '<code>volume(5)</code>'], 'bind pre-fills from the left (that would fix length). An arrow wrapper can fix any position. bind(5) would set this, not an argument.'),
  Q('lab4-8', 'lab4', 'Which names follow the lab conventions for (constant, class, boolean, variable)?', ['<code>MAX_SIZE</code>, <code>UserAccount</code>, <code>isActive</code>, <code>totalPrice</code>', '<code>maxSize</code>, <code>userAccount</code>, <code>active</code>, <code>TotalPrice</code>', '<code>MaxSize</code>, <code>user_account</code>, <code>IS_ACTIVE</code>, <code>total_price</code>', '<code>MAX_SIZE</code>, <code>userAccount</code>, <code>isActive</code>, <code>TOTAL_PRICE</code>'], 'Constants: UPPER_SNAKE_CASE; classes: PascalCase; booleans: is/has/are prefix; variables: camelCase.'),
];

export const glossary = [
  ['Currying', 'Turning a function of several arguments into a chain of single-argument functions: f(a, b, c) becomes f(a)(b)(c).', 'l4'],
  ['Partial application', 'Fixing (pre-filling) some arguments of a function to get a new function that takes the rest.', 'l4'],
  ['Type system', 'Rules and constraints assigning types to variables, expressions and functions; ensures type safety.', 'l4'],
  ['Type inference', 'The compiler deduces types from usage and context, reducing explicit annotations.', 'l4'],
  ['Laziness', 'Deferring a computation until its value is actually needed.', 'l4'],
  ['Infinite data structure', 'A structure that can represent unbounded data without generating all elements upfront.', 'l4'],
  ['Pattern matching', 'Matching the structure of data against predefined patterns and acting on the match.', 'l4'],
  ['Concurrency', 'Independent tasks overlapping in time to maximise resource use and responsiveness, not necessarily simultaneous.', 'l4'],
  ['Parallelism', 'Simultaneous execution of subtasks of a larger task to improve performance.', 'l4'],
  ['Specification', 'A contract between a method and its callers: what it expects and what it guarantees.', 'lab4'],
  ['requires', 'Precondition: must be true before the call; the caller is responsible.', 'lab4'],
  ['effects', 'Postcondition: guaranteed after execution if the precondition held; the implementer is responsible.', 'lab4'],
  ['modifies', 'Frame condition: which variables may change; can be omitted if nothing is modified.', 'lab4'],
  ['JSDoc', 'Convention for structured code comments with tags @param, @return, @throws.', 'lab4'],
  ['Magic number', 'A hard-coded, unexplained literal such as 3.14 instead of a named constant.', 'lab4'],
  ['bind', 'fn.bind(thisValue, arg1, ...) returns a function with leading arguments pre-filled (from the left).', 'lab4'],
  ['Fall-through', 'In a switch, a case without return or break continues into the next case.', 'lab4'],
];

export const cheat = [
  ['l4', 'Functional Programming II', [
    'Currying: f(a, b, c) becomes f(a)(b)(c), one argument per function',
    'Partial application: pre-fill some args, get a function for the rest (bind or arrow)',
    'Both need higher-order functions; payoff: modularity, reusability, composability, flexibility',
    'Type system: rules assigning types, ensures type safety, static checking',
    'Type inference: compiler deduces types, fewer annotations, still safe',
    'Laziness: compute only when needed; enables infinite data structures',
    'Pattern matching: match structure against patterns and act; replaces long if-else',
    'Concurrency: tasks overlap, responsiveness, may not be simultaneous. Parallelism: simultaneous subtasks, performance',
  ]],
  ['lab4', 'Specs, design, bind, switch', [
    'requires = precondition (caller); effects = postcondition (implementer); modifies = frame (may omit if nothing changes)',
    'Precondition violated: behaviour not guaranteed (throw, arbitrary result, arbitrary state, no termination)',
    'JSDoc tags: @param, @return, @throws',
    'Design: DRY, fail fast, no magic numbers, one responsibility, meaningful names, no globals, return do not print, comments only when needed',
    'Naming: camelCase variables and functions (verb-like), UPPER_SNAKE_CASE constants, PascalCase classes, is/has/are booleans, _ for private',
    'fn.bind(thisValue, arg1, ...): first argument is this (null), the rest fill from the LEFT; arrow wrapper can fix any position',
    'multiply(2)(3)(4) is curried; multiply.bind(null, 2)(3, 4) is partial; both give 24',
    'switch: strict ===, no return/break means fall-through, default for no match',
  ]],
];
