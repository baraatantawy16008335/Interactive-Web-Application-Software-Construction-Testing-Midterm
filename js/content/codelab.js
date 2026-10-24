// Code lab exercises. kind: 'fix' (click the buggy lines), 'trace' (predict output), 'write' (write code from a spec).
// Singleton and Factory only from the design patterns lecture (per the doctor's email).
export const CODE = [
  // ---------------------------------------------------------------- Singleton
  { id: 'fix-singleton-1', m: 'l5', kind: 'fix', lang: 'C#', title: 'Singleton that is not one',
    prompt: 'This <code>AppConfig</code> is meant to be a Singleton, but two things break the pattern. Find them.',
    code: `
public sealed class AppConfig
{
    private static readonly AppConfig instance = new AppConfig();
    public string Theme = "light";
    public AppConfig() { }
    public AppConfig Instance => instance;
}`,
    bugLines: [5, 6],
    answer: `
public sealed class AppConfig
{
    private static readonly AppConfig instance = new AppConfig();
    public string Theme = "light";
    private AppConfig() { }
    public static AppConfig Instance => instance;
}`,
    why: `<ul><li><strong>Line 5:</strong> the constructor is <code>public</code>, so any client can write <code>new AppConfig()</code> and get a second object. A Singleton needs a <strong>private constructor</strong>.</li><li><strong>Line 6:</strong> <code>Instance</code> is not <code>static</code>, so you would need an instance just to reach the instance (chicken and egg). The global access point must be <strong>public static</strong>.</li></ul>` },

  { id: 'fix-singleton-2', m: 'lab5', kind: 'fix', lang: 'Java', title: 'Lazy Singleton with a missing check',
    prompt: 'A lazy Java Singleton logger. Two lines defeat the pattern: one in the class and one in the client.',
    code: `
public class Logger {
    private static Logger instance;
    private Logger() { }
    public static Logger getInstance() {
        instance = new Logger();
        return instance;
    }
    public void log(String msg) { System.out.println("LOG: " + msg); }
}
class Demo {
    public static void main(String[] args) {
        Logger log = new Logger();
        log.log("started");
    }
}`,
    bugLines: [5, 12],
    answer: `
public class Logger {
    private static Logger instance;
    private Logger() { }
    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }
    public void log(String msg) { System.out.println("LOG: " + msg); }
}
class Demo {
    public static void main(String[] args) {
        Logger log = Logger.getInstance();
        log.log("started");
    }
}`,
    why: `<ul><li><strong>Line 5:</strong> no <code>null</code> check, so every call to <code>getInstance()</code> creates a brand new <code>Logger</code>. Lazy initialisation means: create only <em>if</em> <code>instance == null</code>.</li><li><strong>Line 12:</strong> the client uses <code>new</code>, which the private constructor forbids (compile error). Clients must call <code>Logger.getInstance()</code>.</li></ul>` },

  { id: 'fix-singleton-3', m: 'l5', kind: 'fix', lang: 'C#', title: 'Lazy Singleton and threads',
    prompt: 'This lazy <code>Cache</code> Singleton is called from many threads at once. Which lines are the race condition (two threads can both create an instance)? Then write the thread-safe version.',
    code: `
public sealed class Cache
{
    private static Cache instance;
    private Cache() { }
    public static Cache GetInstance()
    {
        if (instance == null)
            instance = new Cache();
        return instance;
    }
}`,
    bugLines: [7, 8],
    answer: `
public sealed class Cache
{
    private static Cache instance;
    private static readonly object padlock = new object();
    private Cache() { }
    public static Cache GetInstance()
    {
        lock (padlock)
        {
            if (instance == null)
                instance = new Cache();
        }
        return instance;
    }
}`,
    why: `<p>Check-then-create is not atomic: thread A passes the <code>null</code> check, thread B passes it too before A assigns, and both run <code>new Cache()</code>. Fix: put the check and the creation inside a <code>lock</code> on a private static object.</p><p>Alternative that needs no lock: eager <code>private static readonly Cache instance = new Cache();</code> (static initialisation is thread-safe in C#, as in the lab's AppConfig).</p>` },

  { id: 'fix-singleton-4', m: 'lab5', kind: 'fix', lang: 'Java', title: 'Singleton with a parameter',
    prompt: 'A Singleton <code>Settings</code> that does not compile and is not a real Singleton. Find the two lines.',
    code: `
public class Settings {
    private static final Settings INSTANCE = new Settings();
    private String theme;
    public Settings(String theme) { this.theme = theme; }
    public static Settings getInstance() { return INSTANCE; }
    public String getTheme() { return theme; }
}`,
    bugLines: [2, 4],
    answer: `
public class Settings {
    private static final Settings INSTANCE = new Settings();
    private String theme = "light";
    private Settings() { }
    public static Settings getInstance() { return INSTANCE; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}`,
    why: `<ul><li><strong>Line 4:</strong> the constructor is public (anyone can create more instances) and takes a parameter. The Singleton creates itself, so no client can supply constructor arguments; use a <strong>private no-argument constructor</strong> with defaults and a setter if the value must change.</li><li><strong>Line 2:</strong> <code>new Settings()</code> calls a no-argument constructor that no longer exists once line 4 declares one with a parameter (compile error). It is fixed by the private no-arg constructor.</li></ul>` },

  { id: 'trace-singleton-1', m: 'l5', kind: 'trace', lang: 'C#', title: 'Shared counter',
    prompt: 'What does this program print? (Four lines.)',
    code: `
public sealed class Counter
{
    private static readonly Counter instance = new Counter();
    private int count;
    private Counter() { }
    public static Counter Instance => instance;
    public int Next() { return ++count; }
}
public static class Program
{
    public static void Main()
    {
        Counter a = Counter.Instance;
        Counter b = Counter.Instance;
        Console.WriteLine(a.Next());
        Console.WriteLine(b.Next());
        Console.WriteLine(a.Next());
        Console.WriteLine(ReferenceEquals(a, b));
    }
}`,
    answer: `
1
2
3
True`,
    why: `<code>a</code> and <code>b</code> hold <strong>the same object</strong>, so they share one <code>count</code>. Each <code>Next()</code> increments it: 1, 2, 3. <code>ReferenceEquals(a, b)</code> is <code>True</code>. With a normal class you would have seen 1, 1, 2.` },

  { id: 'write-singleton-logger', m: 'l5', kind: 'write', lang: 'C#', title: 'Thread-safe Logger Singleton',
    prompt: 'Write a thread-safe Singleton <code>Logger</code> in C# (or Java). It needs <code>Instance</code> (global access), a method <code>Log(string message)</code> that stores the message, and a <code>Count</code> property.',
    answer: `
using System.Collections.Generic;

public sealed class Logger
{
    // static initialisation: created once, thread-safe in C#
    private static readonly Logger instance = new Logger();
    private static readonly object padlock = new object();
    private readonly List<string> messages = new List<string>();

    private Logger() { }                       // no outside "new"

    public static Logger Instance => instance; // global access point

    public void Log(string message)
    {
        lock (padlock)                         // the shared list is not thread-safe
        {
            messages.Add(message);
        }
    }

    public int Count
    {
        get { lock (padlock) { return messages.Count; } }
    }
}`,
    why: 'Same shape as the lab\'s <code>AppConfig</code>: sealed class, private constructor, private static readonly instance, public static accessor. The extra <code>lock</code> is there because many threads share the one object and the internal list is not thread-safe.',
    checklist: ['Private constructor', 'Private static field holding the single instance', 'Public static property or method returning it (<code>Instance</code> / <code>getInstance()</code>)', 'Thread safety: eager static initialisation, or a <code>lock</code> around check-and-create', 'Mutable shared state (the list) protected when written', 'Client code uses <code>Logger.Instance.Log(...)</code>, never <code>new</code>'] },

  // ----------------------------------------------------------------- Factory
  { id: 'write-factory-notification', m: 'l5', kind: 'write', lang: 'C#', title: 'NotificationFactory (Factory Method)',
    prompt: 'An app sends notifications by Email, SMS or Push. Using <strong>Factory Method</strong> write: a product interface <code>INotification</code> with <code>Send(string)</code>, three concrete products, an abstract creator <code>NotificationFactory</code> with an abstract factory method, and one concrete creator per product. Show how the client uses it.',
    answer: `
public interface INotification { void Send(string message); }

public class EmailNotification : INotification
{
    public void Send(string message) => Console.WriteLine("Email: " + message);
}
public class SmsNotification : INotification
{
    public void Send(string message) => Console.WriteLine("SMS: " + message);
}
public class PushNotification : INotification
{
    public void Send(string message) => Console.WriteLine("Push: " + message);
}

public abstract class NotificationFactory
{
    public abstract INotification CreateNotification();   // the factory method

    public void Notify(string message)
    {
        INotification n = CreateNotification();
        n.Send(message);
    }
}
public class EmailFactory : NotificationFactory
{
    public override INotification CreateNotification() => new EmailNotification();
}
public class SmsFactory : NotificationFactory
{
    public override INotification CreateNotification() => new SmsNotification();
}
public class PushFactory : NotificationFactory
{
    public override INotification CreateNotification() => new PushNotification();
}

// Client
NotificationFactory factory = new SmsFactory();
factory.Notify("Your code is 1234");     // SMS: Your code is 1234`,
    why: 'The creator declares the factory method and the shared logic (<code>Notify</code>); each subclass decides <em>which</em> concrete product to instantiate. The client only knows <code>NotificationFactory</code> and <code>INotification</code>, never <code>new SmsNotification()</code>. Adding Slack means a new product + a new creator, with <strong>no edits</strong> to existing classes (Open/Closed Principle).',
    checklist: ['Common product interface', 'Concrete products implement the interface', 'Abstract creator with an abstract method returning the <strong>interface</strong> type', 'Concrete creators override it with <code>new ConcreteProduct()</code>', 'Client works through the creator / interface only', 'Mentions or shows that new types need no change to existing code'] },

  { id: 'write-factory-airplane', m: 'lab5', kind: 'write', lang: 'C#', title: 'Add Airplane to Logistics',
    prompt: `The logistics company already has this Factory Method design. Management wants <strong>air delivery</strong> ("Deliver by air in a crate."). Write only the new code, without modifying any existing class, and show the client call.
<pre class="code">public interface ITransport { void Deliver(); }
public class Truck : ITransport { /* Deliver by land in a box. */ }
public class Ship  : ITransport { /* Deliver by sea in a container. */ }
public abstract class Logistics {
    public abstract ITransport CreateTransport();
    public void PlanDelivery() { CreateTransport().Deliver(); }
}
public class RoadLogistics : Logistics { /* returns new Truck() */ }
public class SeaLogistics  : Logistics { /* returns new Ship() */ }</pre>`,
    answer: `
public class Airplane : ITransport
{
    public void Deliver() => Console.WriteLine("Deliver by air in a crate.");
}

public class AirLogistics : Logistics
{
    public override ITransport CreateTransport() => new Airplane();
}

// Client
Logistics logistics = new AirLogistics();
logistics.PlanDelivery();     // Deliver by air in a crate.`,
    why: 'Two new classes and nothing else: a concrete product (<code>Airplane</code>) and a concrete creator (<code>AirLogistics</code>). <code>Logistics</code>, <code>RoadLogistics</code>, <code>SeaLogistics</code> and the client logic stay untouched, which is exactly what a Simple Factory could not give you (you would have to edit its if/else).',
    checklist: ['<code>Airplane</code> implements <code>ITransport</code>', '<code>AirLogistics</code> extends <code>Logistics</code> and overrides <code>CreateTransport()</code>', 'Returns <code>new Airplane()</code> typed as <code>ITransport</code>', 'No existing class edited (OCP)'] },

  { id: 'fix-simple-factory-ocp', m: 'lab5', kind: 'fix', lang: 'C#', title: 'Simple Factory breaks OCP',
    prompt: 'Adding <code>Airplane</code> to this Simple Factory forces you to edit the class itself, violating the Open/Closed Principle. Click the lines that must be changed every time a new transport appears, then see the Factory Method refactoring.',
    code: `
public static class TransportFactory
{
    public static ITransport CreateTransport(string type)
    {
        if (type == "road") return new Truck();
        else if (type == "sea") return new Ship();
        else throw new ArgumentException("Invalid transport type");
    }
}`,
    bugLines: [5, 6],
    answer: `
public abstract class Logistics
{
    public abstract ITransport CreateTransport();
    public void PlanDelivery() { CreateTransport().Deliver(); }
}
public class RoadLogistics : Logistics
{
    public override ITransport CreateTransport() => new Truck();
}
public class SeaLogistics : Logistics
{
    public override ITransport CreateTransport() => new Ship();
}
// New transport = new subclass, existing code untouched.`,
    why: `<p>The <code>if / else if</code> chain (lines 5 and 6) is the problem: each new transport adds another branch, so the factory is <strong>open for modification</strong>. The lecture says exactly this: Simple Factory is fine for small systems or types that rarely change.</p><p>Factory Method moves the decision into subclasses, so extending means adding classes, not editing old ones.</p>` },

  { id: 'fix-factory-client', m: 'l5', kind: 'fix', lang: 'C#', title: 'Factory Method that still says new',
    prompt: 'Assume <code>ITransport</code>, <code>Truck</code> and <code>Ship</code> exist. This Factory Method is wrongly written in two places.',
    code: `
public abstract class Logistics
{
    public abstract Truck CreateTransport();
    public void PlanDelivery()
    {
        ITransport t = new Truck();
        t.Deliver();
    }
}
public class SeaLogistics : Logistics
{
    public override ITransport CreateTransport() => new Ship();
}`,
    bugLines: [3, 6],
    answer: `
public abstract class Logistics
{
    public abstract ITransport CreateTransport();
    public void PlanDelivery()
    {
        ITransport t = CreateTransport();
        t.Deliver();
    }
}
public class SeaLogistics : Logistics
{
    public override ITransport CreateTransport() => new Ship();
}`,
    why: `<ul><li><strong>Line 3:</strong> the factory method returns the <em>concrete</em> <code>Truck</code>. It must return the <strong>product interface</strong> <code>ITransport</code>, otherwise <code>SeaLogistics</code> cannot return a <code>Ship</code> (compile error) and the creator is tied to one product.</li><li><strong>Line 6:</strong> <code>new Truck()</code> inside the creator defeats the pattern. The creator must call its own <code>CreateTransport()</code> and let the subclass decide.</li></ul>` },

  { id: 'trace-factory-1', m: 'lab5', kind: 'trace', lang: 'C#', title: 'Which transport is made?',
    prompt: 'Assume <code>Truck.Deliver()</code> prints <code>Deliver by land in a box.</code> and <code>Ship.Deliver()</code> prints <code>Deliver by sea in a container.</code> (both with <code>WriteLine</code>). What is printed?',
    code: `
public abstract class Logistics
{
    public abstract ITransport CreateTransport();
    public void PlanDelivery()
    {
        Console.Write("Plan: ");
        CreateTransport().Deliver();
    }
}
public class RoadLogistics : Logistics
{
    public override ITransport CreateTransport() { return new Truck(); }
}
public class SeaLogistics : Logistics
{
    public override ITransport CreateTransport() { return new Ship(); }
}
// in Main:
Logistics l = new SeaLogistics();
l.PlanDelivery();
l = new RoadLogistics();
l.PlanDelivery();
new RoadLogistics().CreateTransport().Deliver();`,
    answer: `
Plan: Deliver by sea in a container.
Plan: Deliver by land in a box.
Deliver by land in a box.`,
    why: 'The variable type is always <code>Logistics</code>, but the <em>runtime</em> type decides which <code>CreateTransport()</code> runs (polymorphism). First call: <code>SeaLogistics</code> makes a <code>Ship</code>. After reassignment: <code>RoadLogistics</code> makes a <code>Truck</code>. The last line skips <code>PlanDelivery()</code>, so there is no <code>Plan: </code> prefix.' },

  { id: 'fix-factory-java', m: 'l5', kind: 'fix', lang: 'Java', title: 'Simple Factory in Java',
    prompt: 'This Java Simple Factory receives the type as text read from a file. It has three problems, one on each of the lines you should click.',
    code: `
class TransportFactory {
    static Transport create(String type) {
        if (type == "road") return new Truck();
        if (type == "sea") return new Ship();
        return null;
    }
}`,
    bugLines: [3, 4, 5],
    answer: `
class TransportFactory {
    static Transport create(String type) {
        if (type.equals("road")) return new Truck();
        if (type.equals("sea")) return new Ship();
        throw new IllegalArgumentException("Invalid transport type: " + type);
    }
}`,
    why: `<ul><li><strong>Lines 3 and 4:</strong> in Java <code>==</code> compares <em>references</em>, not text. A string read at runtime is a different object from the literal <code>"road"</code>, so the test fails. Use <code>.equals()</code>.</li><li><strong>Line 5:</strong> returning <code>null</code> for an unknown type pushes a <code>NullPointerException</code> onto the client later. Fail fast: throw <code>IllegalArgumentException</code> (the lecture's version throws <code>ArgumentException</code> in C#).</li></ul>` },

  // ----------------------------------------------------------- FP (Topics 3 & 4)
  { id: 'fix-impure-1', m: 'l3', kind: 'fix', lang: 'JavaScript', title: 'Impure function',
    prompt: 'This function should be <strong>pure</strong>. Find the two lines that make it impure, then rewrite it.',
    code: `
let total = 0;
function addToTotal(x) {
  total += x;
  console.log("added " + x);
  return total;
}`,
    bugLines: [3, 4],
    answer: `
const addToTotal = (total, x) => total + x;

let t = addToTotal(0, 5);   // 5
t = addToTotal(t, 3);       // 8`,
    why: `<ul><li><strong>Line 3:</strong> it <em>mutates a global</em> (<code>total</code>). The result depends on hidden state, so the same input <code>addToTotal(5)</code> gives different outputs on different calls. That breaks referential transparency.</li><li><strong>Line 4:</strong> <code>console.log</code> is an observable <strong>side effect</strong> (I/O).</li></ul><p>Pure version: everything it needs comes in as arguments, the only output is the return value.</p>` },

  { id: 'fix-mutation-1', m: 'lab3', kind: 'fix', lang: 'JavaScript', title: 'Mutating the input array',
    prompt: 'The caller\'s array must stay unchanged. Which two lines mutate it? Fix them immutably.',
    code: `
function addAndSort(list, x) {
  list.push(x);
  return list.sort((a, b) => a - b);
}
const nums = [3, 1];
const sorted = addAndSort(nums, 2);
console.log(nums);`,
    bugLines: [2, 3],
    answer: `
function addAndSort(list, x) {
  return [...list, x].sort((a, b) => a - b);
}
const nums = [3, 1];
const sorted = addAndSort(nums, 2);
console.log(nums);   // [ 3, 1 ]  (unchanged)`,
    why: `<p><code>push</code> and <code>sort</code> both change the array they are called on. Lab rule: "don't mutate, return new". <code>[...list, x]</code> builds a <strong>new</strong> array, and sorting that copy leaves <code>nums</code> alone. Original code would print <code>[ 1, 2, 3 ]</code> for <code>nums</code>.</p>` },

  { id: 'fix-reduce-1', m: 'lab3', kind: 'fix', lang: 'JavaScript', title: 'reduce without an initial value',
    prompt: 'Both helpers misbehave: one throws on an empty array, the other returns garbage. Click the two lines.',
    code: `
const sum = nums => nums.reduce((acc, x) => acc + x);
const maxLen = words => words.reduce((m, w) => Math.max(m, w.length));

console.log(sum([]));
console.log(maxLen(["aa", "bbb"]));`,
    bugLines: [1, 2],
    answer: `
const sum = nums => nums.reduce((acc, x) => acc + x, 0);
const maxLen = words => words.reduce((m, w) => Math.max(m, w.length), 0);

console.log(sum([]));                 // 0
console.log(maxLen(["aa", "bbb"]));   // 3`,
    why: `<p>Without an initial value <code>reduce</code> uses the first element as the accumulator. On an empty array that throws <code>TypeError: Reduce of empty array with no initial value</code>. In <code>maxLen</code> the accumulator becomes the <em>string</em> <code>"aa"</code>, so <code>Math.max("aa", 3)</code> is <code>NaN</code>. Always pass the initial value (<code>0</code> here).</p>` },

  { id: 'fix-recursion-1', m: 'l3', kind: 'fix', lang: 'JavaScript', title: 'Recursion base cases',
    prompt: 'Each function recurses forever for some input. Find the faulty line in each.',
    code: `
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n);
}`,
    bugLines: [2, 7],
    answer: `
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}`,
    why: `<ul><li><strong>Line 2:</strong> <code>factorial(0)</code> never hits <code>n === 1</code>, goes to -1, -2, ... and overflows the stack. Make the base case cover <code>0</code> too (<code>n &lt;= 1</code>).</li><li><strong>Line 7:</strong> the recursive call passes the <em>same</em> <code>n</code>, so the problem never gets smaller. Each recursive call must move toward the base case: <code>sumTo(n - 1)</code>.</li></ul>` },

  { id: 'trace-compose-1', m: 'l3', kind: 'trace', lang: 'JavaScript', title: 'compose order',
    prompt: 'What are the three lines printed?',
    code: `
const compose = (f, g) => x => f(g(x));
const double = x => x * 2;
const addOne = x => x + 1;

console.log(compose(double, addOne)(5));
console.log(compose(addOne, double)(5));
console.log(compose(double, compose(addOne, double))(3));`,
    answer: `
12
11
14`,
    why: '<code>compose(f, g)</code> runs <strong>g first, then f</strong>. (1) <code>addOne(5) = 6</code>, then <code>double</code> gives 12. (2) <code>double(5) = 10</code>, then <code>addOne</code> gives 11. (3) inner function is <code>addOne(double(x))</code>; for 3: <code>double(3)=6</code>, <code>addOne=7</code>, outer <code>double=14</code>.' },

  { id: 'trace-mfr-1', m: 'l3', kind: 'trace', lang: 'JavaScript', title: 'filter, map, reduce chain',
    prompt: 'What is printed by the three <code>console.log</code> calls?',
    code: `
const items = [
  { n: "pen",  p: 3,  q: 4 },
  { n: "book", p: 20, q: 1 },
  { n: "bag",  p: 50, q: 0 },
  { n: "ink",  p: 5,  q: 2 },
];
const r = items.filter(i => i.q > 0).map(i => i.p * i.q).reduce((a, x) => a + x, 0);
console.log(r);
console.log(items.map(i => i.n.toUpperCase()).filter(n => n.length === 3));
console.log(items.length);`,
    answer: `
42
[ 'PEN', 'BAG', 'INK' ]
4`,
    why: 'Chain 1: filter keeps pen, book, ink (bag has q 0); map gives [12, 20, 10]; reduce sums to 42. Chain 2: map uppercases all four names, filter keeps names of length 3 (BOOK is dropped). The original array is untouched, so length is still 4 (none of map / filter / reduce mutate).' },

  { id: 'trace-bind-1', m: 'l4', kind: 'trace', lang: 'JavaScript', title: 'bind fills from the left',
    prompt: 'What is printed?',
    code: `
const sub = (a, b, c) => a - b - c;
const f = sub.bind(null, 10);
const g = f.bind(null, 3);
console.log(f(2, 1));
console.log(g(1));
const h = sub.bind(null, 1, 2, 3);
console.log(h(100));`,
    answer: `
7
6
-4`,
    why: '<code>bind(null, args...)</code> pre-fills arguments <strong>from the left</strong> (the first <code>null</code> is the <code>this</code> value). <code>f(2,1) = sub(10,2,1) = 7</code>. <code>g</code> fixes 10 and 3, so <code>g(1) = sub(10,3,1) = 6</code>. <code>h</code> has all three filled; the extra <code>100</code> is ignored: <code>1-2-3 = -4</code>.' },

  { id: 'write-curry-1', m: 'lab4', kind: 'write', lang: 'JavaScript', title: 'Curried discount',
    prompt: 'Write a <strong>curried</strong> function <code>applyDiscount(pct)(price)</code> that returns the price after a percentage discount. Use it to create <code>discount25</code>. Then show the same partial application using <code>bind</code> on a normal two-argument function.',
    answer: `
// curried: one argument per call
const applyDiscount = pct => price => price - price * pct / 100;
const discount25 = applyDiscount(25);
console.log(discount25(200));          // 150
console.log(applyDiscount(10)(50));    // 45

// partial application with bind
const discountPlain = (pct, price) => price - price * pct / 100;
const discount25b = discountPlain.bind(null, 25);
console.log(discount25b(200));         // 150`,
    why: 'Currying turns <code>f(a, b)</code> into <code>f(a)(b)</code>: each call takes one argument and returns the next function. Partial application fixes some arguments of a normal function (<code>bind(null, 25)</code> fills <code>pct</code>, the leftmost one) and returns a function awaiting the rest.',
    checklist: ['Arrow chain <code>pct => price => ...</code> (or nested <code>function</code> returning a function)', 'Correct formula: <code>price - price * pct / 100</code>', 'Specialised function created by calling with one argument', '<code>bind(null, 25)</code>: first arg is <code>this</code>, values fill from the left'] },

  { id: 'fix-switch-1', m: 'lab4', kind: 'fix', lang: 'JavaScript', title: 'switch fall-through',
    prompt: '<code>sizeName(1)</code> returns <code>"double"</code> instead of <code>"single"</code>. Which line causes it?',
    code: `
function sizeName(n) {
  let name;
  switch (n) {
    case 1: name = "single";
    case 2: name = "double";
      break;
    default: name = "many";
  }
  return name;
}`,
    bugLines: [4],
    answer: `
function sizeName(n) {
  let name;
  switch (n) {
    case 1: name = "single";
      break;
    case 2: name = "double";
      break;
    default: name = "many";
  }
  return name;
}`,
    why: 'Without <code>break</code> a <code>case</code> <strong>falls through</strong> into the next one. For <code>n = 1</code> the code sets <code>"single"</code>, then continues into <code>case 2</code> and overwrites it with <code>"double"</code>. Fall-through is only intentional when you stack empty cases (e.g. <code>case "Sat": case "Sun":</code>).' },

  { id: 'write-spec-1', m: 'lab4', kind: 'write', lang: 'JavaScript', title: 'Write the specification',
    prompt: 'Write a JSDoc comment with <strong>requires / effects / modifies</strong> for this function (describe the contract, not the code).',
    code: `
function safeDivide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}`,
    answer: `
/**
 * Divides a by b.
 *
 * requires: a and b are numbers
 * effects:  returns a / b;
 *           throws Error("Division by zero") if b is 0
 * modifies: nothing
 *
 * @param {number} a - the dividend
 * @param {number} b - the divisor
 * @returns {number} a / b
 * @throws {Error} if b is 0
 */`,
    why: 'A specification is a contract: <strong>requires</strong> is the precondition (caller\'s responsibility), <strong>effects</strong> is the postcondition (return value and exceptions, implementer\'s responsibility), <strong>modifies</strong> lists what may change (nothing: the function is pure). Note that here the behaviour for <code>b = 0</code> is specified (an exception), so it is part of <em>effects</em>, not a precondition. JSDoc tags: <code>@param</code>, <code>@returns</code>, <code>@throws</code>.',
    checklist: ['Precondition under <strong>requires</strong> (types, or alternatively "b is not 0" with matching effects)', 'Return value and the thrown exception under <strong>effects</strong>', '<strong>modifies: nothing</strong>', 'JSDoc tags <code>@param {type} name - description</code>, <code>@returns</code>, <code>@throws</code>', 'Describes behaviour, not implementation'] },

  // ------------------------------------------------------- Topic 2 / Lab 2
  { id: 'write-return-early-1', m: 'lab2', kind: 'write', lang: 'JavaScript', title: 'Flatten the arrow',
    prompt: 'Rewrite this arrow anti-pattern using <strong>Return Early</strong> (guard clauses). Behaviour must be identical.',
    code: `
function processOrder(order) {
  if (order !== null) {
    if (order.items.length > 0) {
      if (order.paid) {
        return "ship";
      } else {
        return "ask for payment";
      }
    } else {
      return "empty order";
    }
  } else {
    return "no order";
  }
}`,
    answer: `
function processOrder(order) {
  if (order === null) return "no order";
  if (order.items.length === 0) return "empty order";
  if (!order.paid) return "ask for payment";
  return "ship";
}`,
    why: 'Handle every invalid or special case first and leave the function immediately; the happy path stays at the left margin. Nesting depth drops from 3 to 0 and the unnecessary <code>else</code>s disappear. Note how each condition is <strong>inverted</strong> (<code>!== null</code> becomes <code>=== null</code>).',
    checklist: ['Conditions inverted correctly', 'Each guard returns immediately', 'No nested ifs, no unnecessary else', 'Happy path ("ship") last', 'Same four outcomes'] },

  { id: 'fix-else-1', m: 'lab2', kind: 'fix', lang: 'JavaScript', title: 'Unnecessary else',
    prompt: 'Click the lines that are code smells (an <code>else</code> that adds nothing, and a redundant way of returning a boolean).',
    code: `
function grade(score) {
  if (score >= 50) {
    return "pass";
  } else {
    return "fail";
  }
}
function isAdult(age) {
  if (age >= 18) { return true; } else { return false; }
}`,
    bugLines: [4, 9],
    answer: `
function grade(score) {
  if (score >= 50) {
    return "pass";
  }
  return "fail";
}
function isAdult(age) {
  return age >= 18;
}`,
    why: `<ul><li><strong>Line 4:</strong> the <code>if</code> branch already returns, so the <code>else</code> is unnecessary; drop it (that is Return Early).</li><li><strong>Line 9:</strong> <code>if (c) return true; else return false;</code> is just <code>return c;</code>.</li></ul>` },

  { id: 'write-args-1', m: 'lab2', kind: 'write', lang: 'JavaScript', title: 'Too many arguments',
    prompt: `Refactor this code smell: pass a single object instead of six positional arguments (and make <code>isAdmin</code> default to <code>false</code>). Update the call too.
<pre class="code">function createUser(name, email, age, city, country, isAdmin) { /* ... */ }
createUser("Sara", "s@x.com", 20, "Cairo", "Egypt", false);</pre>`,
    answer: `
function createUser({ name, email, age, city, country, isAdmin = false }) {
  return { name, email, age, city, country, isAdmin };
}

createUser({
  name: "Sara",
  email: "s@x.com",
  age: 20,
  city: "Cairo",
  country: "Egypt",
});`,
    why: 'With six positional arguments the caller must remember the order and it is easy to swap two strings (<code>city</code> and <code>country</code>) without any error. An object (destructured in the parameter list) makes the call self-documenting, order-independent, and lets you add optional fields with defaults.',
    checklist: ['One object parameter (destructuring or a plain object)', 'Default for <code>isAdmin</code>', 'Call site uses named properties', 'Mentions order/readability as the reason'] },

  { id: 'write-dry-1', m: 'lab2', kind: 'write', lang: 'JavaScript', title: 'Remove the code clones',
    prompt: `These two functions are clones with magic numbers. Apply <strong>DRY</strong>: one function and named constants.
<pre class="code">function orderTotalEgypt(price) { return price + price * 0.14 + 20; }
function orderTotalUAE(price)   { return price + price * 0.05 + 35; }</pre>`,
    answer: `
const EGYPT_TAX = 0.14, EGYPT_SHIPPING = 20;
const UAE_TAX = 0.05, UAE_SHIPPING = 35;

const orderTotal = (price, taxRate, shipping) => price + price * taxRate + shipping;

orderTotal(100, EGYPT_TAX, EGYPT_SHIPPING);   // 134
orderTotal(100, UAE_TAX, UAE_SHIPPING);       // 140`,
    why: 'Duplicated logic means every fix (say, adding a discount) must be made in several places and one will be forgotten. The shared formula lives once; the parts that differ become parameters. Replacing <code>0.14</code>, <code>20</code> etc. with <code>UPPER_SNAKE_CASE</code> constants also removes the magic numbers.',
    checklist: ['One function containing the formula once', 'Differences passed as parameters', 'Named constants (UPPER_SNAKE_CASE) instead of magic numbers', 'Results unchanged (134 and 140 for price 100)'] },

  { id: 'write-declarative-1', m: 'l2', kind: 'write', lang: 'JavaScript', title: 'Imperative to declarative',
    prompt: 'Rewrite the loop declaratively (no mutable <code>result</code>, no index) using <code>filter</code> and <code>map</code>.',
    code: `
const users = [
  { name: "ali", age: 17 },
  { name: "sara", age: 22 },
  { name: "omar", age: 30 },
];
const result = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age >= 18) {
    result.push(users[i].name.toUpperCase());
  }
}`,
    answer: `
const result = users
  .filter(u => u.age >= 18)
  .map(u => u.name.toUpperCase());
// [ 'SARA', 'OMAR' ]`,
    why: 'Imperative code says <em>how</em> (index, mutation, push); declarative code says <em>what</em>: keep the adults, then uppercase their names. <code>filter</code> selects, <code>map</code> transforms, and neither mutates <code>users</code>.',
    checklist: ['<code>filter</code> with the age condition', '<code>map</code> with <code>toUpperCase()</code>', 'Order: filter then map (works either way, but this is cheaper)', '<code>const</code>, no loop, no <code>push</code>'] },

  { id: 'write-failfast-1', m: 'lab2', kind: 'write', lang: 'JavaScript', title: 'Fail Fast withdraw',
    prompt: 'Rewrite <code>withdraw</code> so it <strong>fails fast</strong>: reject a non-positive amount and an amount larger than the balance immediately, with clear errors, instead of silently returning the old balance.',
    code: `
function withdraw(balance, amount) {
  let newBalance = balance;
  if (amount > 0) {
    if (amount <= balance) {
      newBalance = balance - amount;
    }
  }
  return newBalance;
}`,
    answer: `
function withdraw(balance, amount) {
  if (amount <= 0) throw new Error("Amount must be positive");
  if (amount > balance) throw new Error("Insufficient funds");
  return balance - amount;
}`,
    why: 'Fail Fast stops execution as soon as something invalid is detected, with a clear error, so bugs show up at their source instead of spreading silently. The original hides errors (the caller cannot tell a failed withdrawal from a zero one) and also forms an arrow. Guard clauses solve both.',
    checklist: ['Validation first, at the top', 'Throws (or otherwise clearly reports) for <code>amount &lt;= 0</code> and <code>amount &gt; balance</code>', 'Informative error messages', 'Normal result is a simple <code>balance - amount</code>, no nesting'] },

  // ------------------------------------------------------- Topic 1 / Lab 1
  { id: 'fix-test-wrong-1', m: 'lab1', kind: 'fix', lang: 'Java (JUnit 5)', title: 'Broken unit tests',
    prompt: 'The <code>Calculator</code> is correct (<code>add(2, 2) = 4</code>, <code>max(3, 7) = 7</code>, <code>subtract(5, 3) = 2</code>). All three tests are wrong. Click the faulty assertion lines.',
    code: `
class CalculatorTest {
    Calculator calc = new Calculator();

    @Test void addsTwoNumbers() {
        assertEquals(5, calc.add(2, 2));
    }
    @Test void maxReturnsLarger() {
        assertEquals(calc.max(3, 7), calc.max(3, 7));
    }
    @Test void subtractsNumbers() {
        assertEquals(2, calc.add(5, 3));
    }
}`,
    bugLines: [5, 8, 11],
    answer: `
class CalculatorTest {
    Calculator calc = new Calculator();

    @Test void addsTwoNumbers() {
        assertEquals(4, calc.add(2, 2));
    }
    @Test void maxReturnsLarger() {
        assertEquals(7, calc.max(3, 7));
    }
    @Test void subtractsNumbers() {
        assertEquals(2, calc.subtract(5, 3));
    }
}`,
    why: `<ul><li><strong>Line 5:</strong> wrong expected value: 2 + 2 is 4, so this test fails on correct code.</li><li><strong>Line 8:</strong> the actual value is compared with <em>itself</em>, so the test can never fail (a tautology). The expected value must be written independently: 7.</li><li><strong>Line 11:</strong> the test is named "subtracts" but calls <code>add</code>, so it tests the wrong method. Note <code>assertEquals(expected, actual)</code>: expected comes first.</li></ul>` },

  { id: 'write-unit-test-1', m: 'l1', kind: 'write', lang: 'Java (JUnit 5)', title: 'Write the unit tests',
    prompt: 'Write JUnit 5 functional unit tests for this method. Aim for typical values, both sides of the boundary, and the error case.',
    code: `
static String classify(int age) {
    if (age < 0) throw new IllegalArgumentException("negative age");
    return age >= 18 ? "adult" : "minor";
}`,
    answer: `
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class ClassifyTest {
    @Test void typicalMinor()      { assertEquals("minor", classify(10)); }
    @Test void typicalAdult()      { assertEquals("adult", classify(30)); }
    @Test void justBelowBoundary() { assertEquals("minor", classify(17)); }
    @Test void atBoundary()        { assertEquals("adult", classify(18)); }
    @Test void zeroIsMinor()       { assertEquals("minor", classify(0)); }
    @Test void negativeThrows() {
        assertThrows(IllegalArgumentException.class, () -> classify(-1));
    }
}`,
    why: 'A unit test checks one small unit in isolation: call it with known input and assert the expected output (<code>assertEquals(expected, actual)</code>). These are <strong>functional</strong> tests (they check what the method does, not how fast). Bugs hide at boundaries, so test 17 and 18 (the <code>&gt;=</code> mistake), 0, and the exception path.',
    checklist: ['<code>@Test</code> methods with descriptive names', 'Expected value first in <code>assertEquals</code>, written independently of the code', 'Both sides of the boundary (17 and 18)', 'Error case with <code>assertThrows</code>', 'Each test checks one behaviour'] },
];
