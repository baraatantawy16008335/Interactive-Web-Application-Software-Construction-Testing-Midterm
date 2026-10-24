import { K, T, W, terms, compare, steps, code, table, OUT } from './helpers.js';

// ---------------------------------------------------------------- code samples (RAW)
const SINGLETON_LAZY_CS = `
public class Singleton
{
    private static Singleton instance;        // 2. the one stored instance (static, own type)

    private Singleton() { }                    // 1. private constructor: no "new Singleton()" outside

    public static Singleton Instance           // 3. global access point
    {
        get {
            if (instance == null)              // 4. create on first use only (lazy)
                instance = new Singleton();
            return instance;
        }
    }
}
// Usage
Singleton singleton = Singleton.Instance;`;

const SINGLETON_LOCK_CS = `
public sealed class Singleton
{
    private static Singleton instance;
    private static readonly object padlock = new object();

    private Singleton() { }

    public static Singleton Instance
    {
        get {
            lock (padlock)                     // only one thread at a time passes this point
            {
                if (instance == null)
                    instance = new Singleton();
                return instance;
            }
        }
    }
}`;

const SINGLETON_EAGER_CS = `
public sealed class Logger
{
    private static readonly Logger instance = new Logger();   // created once, when the class is first used

    private Logger() { }

    public static Logger Instance => instance;

    public void Log(string msg) { Console.WriteLine("[LOG] " + msg); }
}
// Usage
Logger a = Logger.Instance;
Logger b = Logger.Instance;
Console.WriteLine(ReferenceEquals(a, b));   // True`;

const SINGLETON_LAZY_JAVA = `
public class Singleton {
    private static Singleton instance;                  // 2. static field of own type

    private Singleton() { }                              // 1. private constructor

    public static synchronized Singleton getInstance() { // 3. static accessor (synchronized = thread safe)
        if (instance == null)                            // 4. lazy creation
            instance = new Singleton();
        return instance;
    }
}
// Usage
Singleton s = Singleton.getInstance();`;

const SINGLETON_EAGER_JAVA = `
public final class AppConfig {
    private static final AppConfig INSTANCE = new AppConfig();   // eager, thread safe

    private AppConfig() { }

    public static AppConfig getInstance() { return INSTANCE; }

    public String theme = "Light";
}
// Usage
AppConfig c1 = AppConfig.getInstance();
AppConfig c2 = AppConfig.getInstance();
c1.theme = "Dark";
System.out.println(c2.theme);     // Dark
System.out.println(c1 == c2);     // true`;

const FM_CS = `
// Product
public interface IProduct
{ void Operation(); }

// ConcreteProduct
public class ConcreteProduct : IProduct
{
    public void Operation() { Console.WriteLine("ConcreteProduct.Operation"); }
}

// Creator
public abstract class Creator
{
    public abstract IProduct FactoryMethod();       // subclasses decide
    public void SomeOperation()
    {
        IProduct product = FactoryMethod();         // no concrete class named here
        product.Operation();
    }
}

// ConcreteCreator
public class ConcreteCreator : Creator
{
    public override IProduct FactoryMethod() { return new ConcreteProduct(); }
}

// Usage
Creator creator = new ConcreteCreator();
creator.SomeOperation();`;

const FM_JAVA = `
interface IProduct { void operation(); }

class ConcreteProduct implements IProduct {
    public void operation() { System.out.println("ConcreteProduct.operation"); }
}

abstract class Creator {
    public abstract IProduct factoryMethod();
    public void someOperation() {
        IProduct product = factoryMethod();
        product.operation();
    }
}

class ConcreteCreator extends Creator {
    @Override
    public IProduct factoryMethod() { return new ConcreteProduct(); }
}

// Usage
Creator creator = new ConcreteCreator();
creator.someOperation();`;

const LOGI_CS = `
// Product
interface ITransport { void Deliver(); }

// Concrete Products
class Truck : ITransport
{ public void Deliver() { Console.WriteLine("Deliver by land in a truck"); } }
class Ship : ITransport
{ public void Deliver() { Console.WriteLine("Deliver by sea in a ship"); } }

// Creator (the "factory")
abstract class Logistics
{
    public abstract ITransport CreateTransport();   // Factory Method
}

// Concrete Creators
class RoadLogistics : Logistics
{ public override ITransport CreateTransport() { return new Truck(); } }
class SeaLogistics : Logistics
{ public override ITransport CreateTransport() { return new Ship(); } }

// Client
Logistics logistics = new RoadLogistics();
ITransport transport = logistics.CreateTransport();
transport.Deliver();`;

const LOGI_JAVA = `
interface ITransport { void deliver(); }

class Truck implements ITransport {
    public void deliver() { System.out.println("Deliver by land in a truck"); }
}
class Ship implements ITransport {
    public void deliver() { System.out.println("Deliver by sea in a ship"); }
}

abstract class Logistics {
    public abstract ITransport createTransport();      // factory method
}
class RoadLogistics extends Logistics {
    @Override public ITransport createTransport() { return new Truck(); }
}
class SeaLogistics extends Logistics {
    @Override public ITransport createTransport() { return new Ship(); }
}

// Client
Logistics logistics = new RoadLogistics();
logistics.createTransport().deliver();`;

const AIR_CS = `
// Two NEW classes. Nothing else is edited.
class Airplane : ITransport
{
    public void Deliver() { Console.WriteLine("Deliver by air in a plane"); }
}
class AirLogistics : Logistics
{
    public override ITransport CreateTransport() { return new Airplane(); }
}

// Client
Logistics logistics = new AirLogistics();
logistics.CreateTransport().Deliver();`;

const SIMPLE_CS = `
public static class TransportFactory
{
    public static ITransport CreateTransport(string type)
    {
        if (type.ToLower() == "road")
            return new Truck();
        else if (type.ToLower() == "sea")
            return new Ship();
        // adding Airplane = editing THIS method (another else if)
        else
            throw new ArgumentException("Invalid transport type");
    }
}
// Client
ITransport transport = TransportFactory.CreateTransport("road");
transport.Deliver();      // Deliver by land in a truck`;

const NOSINGLE_CS = `
class AppConfig
{
    public string Theme = "Light";
}
AppConfig config1 = new AppConfig();
AppConfig config2 = new AppConfig();      // a second, independent object
config1.Theme = "Dark";
Console.WriteLine(config1.Theme);          // Dark
Console.WriteLine(config2.Theme);          // Light  (problem: two different configs)`;

const APPCONFIG_CS = `
sealed class AppConfig
{
    private static readonly AppConfig instance = new AppConfig();
    private AppConfig() { }
    public static AppConfig Instance => instance;
    public string Theme = "Light";
}
AppConfig c1 = AppConfig.Instance;
AppConfig c2 = AppConfig.Instance;
c1.Theme = "Dark";
Console.WriteLine(c2.Theme);                  // Dark
Console.WriteLine(ReferenceEquals(c1, c2));   // True`;

// ---------------------------------------------------------------- LECTURE
export const lecture = {
  id: 'l5', kind: 'lecture', num: 'L5', icon: 'blueprint',
  title: 'Design Patterns: Singleton & Factory', navTitle: 'Singleton & Factory', mapLabel: 'Design patterns',
  short: 'Reusable blueprints for common design problems. For the midterm only two matter: Singleton and Factory Method.',
  goals: [
    'Define a design pattern and name the three categories.',
    'Write a Singleton (lazy and thread safe) in C# and Java, and spot a broken one.',
    'Explain why the lazy version is not thread safe and how lock or eager initialisation fixes it.',
    'Write Factory Method with the four roles and show how it follows the Open/Closed Principle.',
    'Pick Singleton, Factory Method or neither for a real-life scenario.',
  ],
  sections: [
    {
      id: 'what-are-patterns', title: 'What a design pattern is',
      body: `<div class="prose">
<p><strong>Design patterns</strong> are <strong>reusable solutions to common problems</strong> that arise during software development. They give a structured approach to designing software and help improve <strong>code quality, maintainability and scalability</strong>.</p>
<ul>
<li>A pattern is a <strong>blueprint</strong> (a template), not ready-made code you copy. You adapt it to your problem.</li>
<li>It is <strong>language independent</strong>: the same idea works in C#, Java, Python. That is why the exam accepts any language.</li>
<li>Each pattern has its own purpose and usage scenario. Patterns can be combined and adapted.</li>
<li><strong>Why reuse?</strong> No reinventing the wheel, proven solutions are more reliable, development is faster, and it promotes best practices (lab).</li>
</ul></div>
${K('Almost every pattern is built from the same ingredients: an <strong>interface</strong>, classes that <strong>implement</strong> it, and a class that holds a <strong>reference to the interface</strong>. Learn the role names (Product, Creator, ...) because exam answers are marked on them.')}`,
    },
    {
      id: 'categories', title: 'The three categories (and where our two patterns live)',
      body: `<div class="prose"><p>The lecture groups patterns by <em>what problem they address</em>.</p></div>
${terms([
  ['hammer', 'Creational', 'How objects are <strong>created</strong>: flexible, reusable creation. Singleton, Factory Method, Builder.'],
  ['blocks', 'Structural', 'How classes and objects are <strong>composed</strong> into larger structures. Adapter, Decorator, Proxy.'],
  ['chats-circle', 'Behavioral', 'How objects <strong>communicate</strong> and share responsibilities. Observer, Strategy, Command.'],
])}
${K('<strong>Singleton and Factory Method are both CREATIONAL.</strong> Lecturer definitions to memorise: <em>Singleton</em> ensures a class has only one instance and provides a global point of access to it. <em>Factory Method</em> defines an interface for creating objects but lets subclasses decide which class to instantiate.')}
${table(['Creational pattern', 'One-line idea'], [
  ['Singleton', 'Exactly one instance + a global access point.'],
  ['Factory Method', 'Subclasses decide which class to instantiate; client never calls <code>new ConcreteProduct()</code>.'],
])}
${OUT('The other lecture patterns are not examined: Builder, Abstract Factory (creational), Adapter, Decorator, Proxy, Facade (structural), Observer, Strategy, Command, Iterator (behavioral). Only know that they are not Singleton or Factory.')}`,
    },
    {
      id: 'singleton', title: 'Singleton: intent and structure',
      body: `<div class="prose">
<p><strong>Intent:</strong> only <strong>one instance</strong> of a class, plus a <strong>global access point</strong> to it.</p>
<p><strong>Use it when</strong> several components must share the same object and one shared instance is genuinely required. Typical examples: <strong>application configuration, a logging service, a cache manager</strong>, a database connection manager (extra example).</p>
<p><strong>Without it</strong>, every <code>new</code> creates another independent object, so two parts of the app can hold different values:</p></div>
${code(NOSINGLE_CS, 'C# · lab 5 · the problem')}
<div class="prose"><h4>The 3 structural parts (+ the guard)</h4></div>
${steps([
  ['Private constructor', 'Prevents anyone outside from writing <code>new Singleton()</code>.'],
  ['Private static field of its own type', 'Stores the single instance. It is <code>static</code> so it belongs to the class, not to an object.'],
  ['Public static property or method', 'The global access point (<code>Instance</code> / <code>GetInstance()</code>). It is <code>static</code> so it can be called with no object.'],
  ['Creation rule', 'Lazy: create when the field is still <code>null</code>. Eager: create at declaration with <code>static readonly</code>.'],
])}
${code(SINGLETON_LAZY_CS, 'C# · lecture · lazy initialisation')}
${code(SINGLETON_LAZY_JAVA, 'Java · same idea')}
${W('u5Singleton')}
${T('The chicken-and-egg trap: if the accessor is <em>not</em> static and the constructor is private, nobody can ever get an object. Both the field and the accessor must be <code>static</code>.')}
<div class="prose"><p><strong>Spot it in a question:</strong> "only one", "shared / global", "configuration", "logger", "connection", or code with a private constructor and a static field of its own type.</p></div>`,
    },
    {
      id: 'singleton-threads', title: 'Singleton and threads: lazy, lock, eager',
      body: `<div class="prose">
<p>The <strong>lazy</strong> version from the lecture (<code>if (instance == null) instance = new Singleton();</code>) is <strong>not thread safe</strong>. If two threads call it at the same moment, both can see <code>null</code> before either has assigned, so <strong>each creates its own object</strong>. The "only one instance" promise is broken.</p>
<p>Watch the interleaving, then switch to the two fixes and replay.</p></div>
${W('u5Race')}
${compare(
  ['lock-key', 'Lazy + lock (thread safe)', ['Object is created on first use.', 'A <code>lock</code> makes threads queue; the second one then sees <code>instance != null</code>.', 'Cost: every call pays for the lock.', 'Java: <code>synchronized</code> on the method.']],
  ['lightning', 'Eager static readonly (thread safe)', ['Object is created once when the class is first used, by the runtime.', 'No null check, nothing to race on, simplest code.', 'This is the <strong>lab</strong> version.', 'Cost: created even if never used.']],
)}
${code(SINGLETON_LOCK_CS, 'C# · lazy + lock (extra, not on the slides)')}
${code(SINGLETON_EAGER_CS, 'C# · eager, the lab style')}
${code(SINGLETON_EAGER_JAVA, 'Java · eager')}
${K('Lab note: <em>"static initialisation provides thread-safe instance creation in C#."</em> If the question says "thread safe", use the eager <code>private static readonly ... = new ...()</code> version, or add a lock to the lazy one.')}
<div class="prose"><h4>Pitfalls (extra, general knowledge)</h4>
<ul>
<li><strong>Global state:</strong> any code can change the shared object, so bugs can appear far from their cause.</li>
<li><strong>Hard to test:</strong> tests share the same instance, so one test can leak state into the next, and you cannot easily swap in a fake.</li>
<li><strong>Overuse:</strong> use it only when one shared instance is <em>genuinely required</em> (lab wording). A <code>Student</code> or <code>Product</code> class must have many instances.</li>
</ul></div>`,
    },
    {
      id: 'singleton-bugs', title: 'Spot and fix a broken Singleton',
      body: `<div class="prose"><p>Exam questions often give a nearly correct Singleton and ask you to find the error. Check the four parts in order: <strong>constructor, field, accessor, creation rule</strong>.</p></div>
${W('u5SingletonBugs')}
${table(['Symptom in the code', 'What is wrong', 'Fix'], [
  ['<code>public Logger() { }</code>', 'Anyone can call <code>new</code>', 'Make the constructor <code>private</code>'],
  ['<code>private Logger instance;</code> (no static)', 'The field belongs to an object; a static accessor cannot reach it', 'Add <code>static</code>'],
  ['<code>public Logger GetInstance()</code> (no static)', 'You need an object to call it, but you cannot create one', 'Add <code>static</code> to the method'],
  ['<code>instance = new Logger();</code> with no <code>if</code>', 'A new object on every call', 'Guard with <code>if (instance == null)</code>'],
  ['Lazy check, two threads', 'Race: two objects', 'Add <code>lock</code> / <code>synchronized</code>, or go eager'],
])}
${T('<code>readonly</code> / <code>final</code> alone does not make a Singleton. A public constructor still lets callers build more objects. The private constructor is the core of the pattern.')}`,
    },
    {
      id: 'factory-method', title: 'Factory Method',
      body: `<div class="prose">
<p><strong>Intent:</strong> a <strong>Creator</strong> declares a factory method that returns a <strong>Product interface</strong>; <strong>subclasses decide</strong> which concrete class to instantiate. The client never calls <code>new ConcreteProduct()</code> directly.</p>
<p><strong>Use it when</strong> creation logic would otherwise be spread over the code (<code>new</code> everywhere), making it tightly coupled to concrete classes, and when <strong>new product types will be added later</strong>.</p></div>
${terms([
  ['package', 'Product', 'The interface (<code>IProduct</code>, <code>ITransport</code>). The only type the client knows.'],
  ['cube', 'ConcreteProduct', 'Implements Product (<code>Truck</code>, <code>Ship</code>).'],
  ['factory', 'Creator', 'Abstract class that declares the factory method and may use it in other operations.'],
  ['gear', 'ConcreteCreator', 'Subclass that overrides the factory method and returns one ConcreteProduct (<code>RoadLogistics</code>).'],
])}
${code(FM_CS, 'C# · lecture template')}
${code(FM_JAVA, 'Java · same template')}
${W('u5Roles')}
<div class="prose"><h4>How it follows the Open/Closed Principle</h4>
<p>OCP says software should be <strong>open for extension, closed for modification</strong>. To support a new product you <strong>add</strong> a new ConcreteProduct and a new ConcreteCreator. The Product interface, the Creator and the existing creators and products are <strong>not touched</strong>. The client works through the Creator, so it does not change either.</p></div>
${K('<strong>Spot it:</strong> an <em>abstract method that returns an interface type</em>, and several subclasses that each override it with <code>return new X()</code>. The Creator\'s own method (<code>SomeOperation</code>) calls the factory method and uses the result through the interface, with no concrete class named.')}
${T('Do not confuse Factory Method with a static <code>if/else</code> factory method that picks a class from a string. That is the <strong>Simple Factory</strong> (Lab 5 section). It centralises creation but must be edited for each new type, so it violates OCP.')}`,
    },
    {
      id: 'which-pattern', title: 'Which pattern? Scenario practice',
      body: `<div class="prose"><p>Scenario questions give a story and ask for the pattern <em>with a reason</em>. Key phrases:</p></div>
${table(['If the question says...', 'Answer'], [
  ['exactly one shared object for the whole app (config, logger, cache, connection)', 'Singleton'],
  ['client should not call <code>new</code>; new product types will be added; subclasses decide', 'Factory Method'],
  ['one static method picks a class from a string/enum, small stable system', 'Simple Factory (not a full pattern; violates OCP)'],
  ['ordinary data objects, many instances, nothing to hide', 'Neither'],
])}
${W('u5Which')}
${OUT('Other patterns you may see named: Builder, Abstract Factory, Adapter, Decorator, Proxy, Observer, Strategy, Command, Facade, Iterator. Not tested, so do not spend revision time on their code.')}`,
    },
    {
      id: 'exam-recipes', title: 'Writing it in the exam',
      body: `<div class="prose"><p>Coding questions accept <strong>any language</strong>. Write role names in comments; markers look for them.</p>
<h4>Singleton recipe</h4></div>
${steps([
  ['Class header', 'C#: <code>sealed class X</code> (optional). Java: <code>final class X</code>.'],
  ['Private static field of own type', 'Lazy: <code>private static X instance;</code> Eager: <code>private static readonly X instance = new X();</code> (Java: <code>static final</code>).'],
  ['Private constructor', '<code>private X() { }</code>'],
  ['Public static accessor', 'C#: <code>public static X Instance { get { ... } }</code> or <code>=&gt; instance</code>. Java: <code>public static X getInstance()</code>.'],
  ['Guard (lazy only)', '<code>if (instance == null) instance = new X();</code> and mention <code>lock</code> / <code>synchronized</code> if thread safety is asked.'],
  ['Usage', '<code>X a = X.Instance; X b = X.Instance;</code> then show <code>ReferenceEquals(a, b)</code> is true (Java: <code>a == b</code>). Never use <code>new X()</code>.'],
])}
${code(SINGLETON_EAGER_CS, 'C# · complete answer')}
<div class="prose"><h4>Factory Method recipe</h4></div>
${steps([
  ['Product interface', '<code>interface IProduct { void Operation(); }</code>'],
  ['Two ConcreteProducts', 'Each implements the interface and prints something.'],
  ['Abstract Creator', '<code>abstract IProduct FactoryMethod();</code> (optionally a method that uses it).'],
  ['One ConcreteCreator per product', 'Override and <code>return new ConcreteProductX();</code>'],
  ['Client', '<code>Creator c = new ConcreteCreatorX(); c.FactoryMethod().Operation();</code> and comment the roles.'],
])}
${code(LOGI_CS, 'C# · complete answer (Logistics)')}
${code(LOGI_JAVA, 'Java · complete answer')}
${table(['C# (slides)', 'Java'], [
  ['<code>class A : B</code> / <code>class A : IB</code>', '<code>class A extends B</code> / <code>class A implements IB</code>'],
  ['<code>public override</code>', '<code>@Override public</code>'],
  ['<code>sealed class</code>', '<code>final class</code>'],
  ['<code>static readonly</code>', '<code>static final</code>'],
  ['property <code>Instance { get {...} }</code>', 'method <code>getInstance()</code>'],
  ['<code>lock (padlock) { }</code>', '<code>synchronized</code> method'],
  ['<code>ReferenceEquals(a, b)</code>', '<code>a == b</code>'],
  ['<code>Console.WriteLine</code>', '<code>System.out.println</code>'],
])}`,
    },
  ],
};

// ---------------------------------------------------------------- LAB
export const lab = {
  id: 'lab5', kind: 'lab', num: 'Lab 5', icon: 'factory',
  title: 'Design Patterns I: Singleton, Factory & SOLID', navTitle: 'Singleton, Factory, SOLID', mapLabel: 'Patterns in C#',
  short: 'Lab practice: why reuse, SOLID, the AppConfig Singleton, and Simple Factory versus Factory Method with the Transport example.',
  goals: [
    'Explain why we reuse design ideas and what the three types are.',
    'State the five SOLID principles with the lab examples.',
    'Explain each keyword in the lab Singleton: sealed, private static readonly, private constructor, Instance.',
    'Refactor a Simple Factory into Factory Method (add Airplane) and justify it with OCP.',
  ],
  sections: [
    {
      id: 'lab-reuse-types', title: 'Why reuse, and the types of patterns',
      body: `<div class="prose">
<p><strong>Why reuse?</strong> It avoids duplication (no reinventing the wheel), enhances reliability (proven solutions, fewer bugs), speeds up development and promotes best practices. We can reuse code or design ideas.</p>
<p><strong>Design patterns</strong> are reusable solutions to commonly occurring design problems. They are <strong>design templates</strong> (a blueprint, not ready-to-use code) and <strong>language independent</strong>.</p></div>
${table(['Type', 'Focus (lab wording)', 'Examples'], [
  ['Creational', 'How objects are created. Use inheritance or delegation to make creation flexible and reusable.', 'Singleton, Factory Method, Abstract Factory'],
  ['Structural', 'How classes and objects are combined into larger structures. Use inheritance or composition to add functionality without changing existing code.', 'Facade, Adapter, Decorator'],
  ['Behavioral', 'How objects communicate. Define how responsibilities and behaviour are distributed between objects.', 'Observer, Strategy, Iterator'],
])}
${OUT('Facade (structural) is shown in Lab 5 as a video-converter example: one simple <code>Convert()</code> method hides a complex subsystem. It is not part of the Singleton/Factory scope, so skip its code.')}`,
    },
    {
      id: 'lab-singleton', title: 'Singleton lab example: AppConfig',
      body: `<div class="prose"><p><strong>Singleton</strong> is a creational pattern that ensures a class has <strong>only one instance</strong> while providing a <strong>global access point</strong>. It is useful when multiple components share the same object: app configuration, logging services, cache managers. Use it only when one shared instance is genuinely required.</p>
<p><strong>Problem:</strong> if the whole app must share one configuration, <code>new</code> gives independent objects with different values.</p></div>
${code(NOSINGLE_CS, 'C# · lab · without Singleton')}
<div class="prose"><p><strong>Solution</strong> (the lab says static initialisation is thread safe in C#):</p></div>
${code(APPCONFIG_CS, 'C# · lab · with Singleton')}
${table(['Keyword', 'Meaning (lab)'], [
  ['<code>sealed class</code>', 'Prevents another class from inheriting from AppConfig (a subclass could otherwise create more instances).'],
  ['<code>private static readonly</code>', 'Stores a shared reference that cannot be reassigned after initialisation.'],
  ['<code>new AppConfig()</code>', 'Creates the single instance (once, by static initialisation).'],
  ['<code>private AppConfig()</code>', 'Prevents other classes from calling the constructor.'],
  ['<code>public static Instance</code>', 'Lets other classes access the shared instance.'],
])}
${K('Both variables reference <strong>the same object</strong>, so changing <code>c1.Theme</code> is seen through <code>c2</code>, and <code>ReferenceEquals(c1, c2)</code> is <code>True</code>.')}
${code(SINGLETON_EAGER_JAVA, 'Java version')}`,
    },
    {
      id: 'lab-factory', title: 'Factory: Simple Factory vs Factory Method',
      body: `<div class="prose">
<p><strong>Factory Method</strong> is a creational pattern that defines a method for creating objects in a superclass while letting <strong>subclasses decide</strong> which concrete class to instantiate. It hides creation logic from the client: instead of <code>new</code>, the client calls a factory method.</p>
<p><strong>Problem (lab):</strong> a logistics company delivers by land or by sea. If Truck and Ship are created with <code>new</code> directly in client code, creation logic is repeated and tightly coupled to specific classes. Adding Airplane means modifying client code <strong>everywhere</strong>. The system becomes tightly coupled, hard to maintain and hard to extend.</p>
<h4>Step 1: Simple Factory (centralise creation)</h4>
<p>Move creation into one factory method that selects the class from an input. Object creation is now out of the client, but:</p></div>
${code(SIMPLE_CS, 'C# · Simple Factory')}
${T('<strong>Adding Airplane requires modifying</strong> <code>TransportFactory.CreateTransport()</code>. Existing code must change, so it <strong>violates the Open/Closed Principle</strong>. Simple Factory is fine only for small systems or when types rarely change.')}
<div class="prose"><h4>Step 2: Factory Method (the lab solution)</h4></div>
${code(LOGI_CS, 'C# · Factory Method')}
<div class="prose"><p><strong>Role mapping:</strong> Product = <code>ITransport</code>; ConcreteProducts = <code>Truck</code>, <code>Ship</code>; Creator = <code>Logistics</code>; ConcreteCreators = <code>RoadLogistics</code>, <code>SeaLogistics</code>. The client only cares that the transport can <code>Deliver()</code>.</p>
<h4>Adding Airplane</h4></div>
${code(AIR_CS, 'C# · new transport')}
${W('u5Factory')}
${code(LOGI_JAVA, 'Java version')}
${table(['Aspect', 'Simple Factory', 'Factory Method'], [
  ['Creation', 'One method selects a concrete class', 'Subclasses determine the concrete class'],
  ['Mechanism', 'Conditional logic (static)', 'Inheritance and overriding (dynamic)'],
  ['New transport', 'Modify the existing factory', 'Add a new concrete creator'],
  ['OCP', 'Limited (violates)', 'Supports extension through new creators'],
])}`,
    },
    {
      id: 'lab-solid', title: 'SOLID principles',
      body: `<div class="prose"><p>SOLID helps us design software that is <strong>easier to maintain, extend and test</strong>. It guides us to clear responsibilities and reduced coupling, and helps avoid common design problems.</p></div>
${table(['Principle', 'Rule', 'Lab example'], [
  ['<strong>S</strong>ingle Responsibility', 'A class should have only one reason to change.', 'A <code>User</code> class should not also send emails or write logs.'],
  ['<strong>O</strong>pen/Closed', 'Open for extension, closed for modification.', 'Add a new payment method by creating a new class, not rewriting old code.'],
  ['<strong>L</strong>iskov Substitution', 'Subclasses should be replaceable for their parent without breaking behaviour.', 'A child class must honour the contract of the parent.'],
  ['<strong>I</strong>nterface Segregation', 'Classes should not be forced to depend on methods they do not use.', 'Split large interfaces into smaller, specific ones.'],
  ['<strong>D</strong>ependency Inversion', 'High-level modules depend on abstractions, not concrete implementations.', 'Business logic depends on an interface, not a specific DB driver.'],
])}
${K('<strong>Why OCP matters here:</strong> Simple Factory breaks it (edit the factory for every new type); Factory Method keeps it (add classes only). Coding to <code>ITransport</code> in the client is Dependency Inversion.')}
${W('u5Solid')}`,
    },
  ],
};

// ---------------------------------------------------------------- QUESTIONS
const Q = (id, m, q, o, why) => ({ id, m, q, o, why });
const pre = (s) => `<pre class="code">${s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;

export const questions = [
  Q('l5-1', 'l5', 'Which statement best describes a design pattern?',
    ['A reusable, language-independent solution template for a common design problem', 'A ready-made class library that you copy into your project', 'A programming language feature that enforces good structure', 'A testing technique for finding errors in object-oriented code'],
    'A pattern is a blueprint for a commonly occurring problem, not finished code and not tied to one language.'),
  Q('l5-2', 'l5', 'To which category do <strong>Singleton</strong> and <strong>Factory Method</strong> both belong?',
    ['Creational: they control how objects are created', 'Structural: they compose classes into larger structures', 'Behavioral: they define how objects communicate', 'Structural for Singleton, creational for Factory Method'],
    'Both deal with object creation, so both are creational patterns.'),
  Q('l5-3', 'l5', 'Which set lists the three structural parts of a Singleton?',
    ['Private constructor, private static instance field, public static access property/method', 'Public constructor, public instance field, public static method', 'Abstract class, interface, concrete subclass', 'Private constructor, public instance method, public setter'],
    'Private constructor stops outside creation, the static field stores the instance, and a static accessor returns it.'),
  Q('l5-4', 'l5', 'Why must the field that stores the single instance be <code>static</code>?',
    ['It must belong to the class itself so it can be reached without creating an object', 'So that it can be modified by every thread without locking', 'Because C# forbids instance fields in classes with private constructors', 'So that the garbage collector never removes the object'],
    'No object exists before the first call, so the stored instance and the accessor must belong to the class.'),
  Q('l5-5', 'l5', 'A hospital app needs one shared <code>AppSettings</code> object that every screen reads (language, theme), and a change must be visible everywhere. Which pattern fits best?',
    ['Singleton', 'Factory Method', 'Simple Factory', 'No pattern: each screen should create its own AppSettings'],
    'One shared object with a global access point is exactly the Singleton intent (application configuration is a lecture/lab example).'),
  Q('l5-6', 'l5', 'A shop has a <code>Customer</code> class. Each customer has a different name and cart. A developer makes <code>Customer</code> a Singleton. What is the main problem?',
    ['The system now allows only one customer object, but many are required', 'Singletons cannot contain string fields', 'The constructor becomes public, which is unsafe', 'Customers can no longer be compared with ReferenceEquals'],
    'Singleton is only for cases where one shared instance is genuinely required. Entities with many instances must not be Singletons.'),
  Q('l5-7', 'l5', 'What does this lazy Singleton risk when two threads call <code>Instance</code> at the same time?' + pre(`public static Singleton Instance {
    get {
        if (instance == null)
            instance = new Singleton();
        return instance;
    }
}`),
    ['Both threads may see null and create two objects', 'A deadlock, because both threads wait forever', 'A NullReferenceException on the second call', 'Nothing: the check makes it always thread safe'],
    'The check and the assignment are separate steps, so both threads can pass the null check before either assigns. Two instances result.'),
  Q('l5-8', 'l5', 'Which change makes the <strong>lazy</strong> Singleton above thread safe while keeping lazy creation?',
    ['Wrap the null check and creation in <code>lock (padlock)</code>', 'Make the constructor public', 'Replace <code>if</code> with <code>while</code>', 'Make the <code>Instance</code> property non-static'],
    'A lock lets only one thread at a time run the check and creation, so the second thread sees a non-null instance.'),
  Q('l5-9', 'l5', 'What is the main trade-off of the eager version <code>private static readonly Logger instance = new Logger();</code>?',
    ['It is thread safe and simple, but the object is created even if never used', 'It is lazy but not thread safe', 'It allows several instances but is faster', 'It cannot be accessed from other classes'],
    'Static initialisation runs once for the class (thread safe) but cannot wait for first use.'),
  Q('l5-10', 'l5', 'What happens when code outside the class runs <code>Logger l = new Logger();</code> and <code>Logger</code> is a correct Singleton?',
    ['Compile error: the constructor is private', 'It returns the existing instance', 'It creates a second instance that is ignored', 'A runtime exception is thrown on the second call'],
    'A private constructor is the compiler-enforced barrier. Callers must use the static accessor.'),
  Q('l5-11', 'l5', 'Find the bug in this "Singleton":' + pre(`public class Logger {
    private static Logger instance;
    private Logger() { }
    public Logger GetInstance() {
        if (instance == null) instance = new Logger();
        return instance;
    }
}`),
    ['<code>GetInstance</code> is not static, so no one can call it (the constructor is private)', 'The constructor must be public', 'The field must not be static', 'The null check must be removed'],
    'Without static the method needs an object, which cannot be created. The accessor must be static.'),
  Q('l5-12', 'l5', 'What does this code print?' + pre(`public class Logger {
    private static Logger instance;
    private Logger() { }
    public static Logger GetInstance() {
        instance = new Logger();
        return instance;
    }
}
// Client
var a = Logger.GetInstance();
var b = Logger.GetInstance();
Console.WriteLine(ReferenceEquals(a, b));`),
    ['False: the null check is missing, so every call creates a new object', 'True: the constructor is private', 'True: the field is static', 'It does not compile'],
    'Each call assigns a brand new Logger, so a and b point to different objects. Guard with <code>if (instance == null)</code>.'),
  Q('l5-13', 'l5', 'Given a correct Singleton <code>AppConfig</code> with a public field <code>Theme</code>, what is printed?' + pre(`var c1 = AppConfig.Instance;
var c2 = AppConfig.Instance;
c1.Theme = "Dark";
Console.WriteLine(c2.Theme);`),
    ['Dark', 'Light', 'null', 'It does not compile'],
    'c1 and c2 reference the same object, so the change is visible through both.'),
  Q('l5-14', 'l5', 'Which is a commonly cited drawback of the Singleton pattern (general knowledge, not on the slides)?',
    ['It introduces global shared state, which makes code harder to test and reason about', 'It prevents the class from having any methods', 'It always requires multiple threads', 'It makes object creation slower for every call'],
    'Everything touches the same object, so tests can leak state into each other and swapping in a fake is awkward.'),
  Q('l5-15', 'l5', 'Which is the lecturer\'s definition of <strong>Factory Method</strong>?',
    ['It defines an interface for creating objects but lets subclasses decide which class to instantiate', 'It ensures a class has only one instance with a global access point', 'It separates the construction of a complex object from its representation', 'It converts the interface of a class into another interface clients expect'],
    'The other options describe Singleton, Builder and Adapter.'),
  Q('l5-16', 'l5', 'In the Factory Method pattern, which role declares the factory method (usually abstract) and may use it in its own operations?',
    ['Creator', 'Product', 'ConcreteProduct', 'Client'],
    'The Creator declares <code>FactoryMethod()</code>. ConcreteCreators override it to return a ConcreteProduct.'),
  Q('l5-17', 'l5', 'In the Logistics example, a new transport <code>Airplane</code> is added with Factory Method. Which classes must be <strong>modified</strong>?',
    ['None: only <code>Airplane</code> and <code>AirLogistics</code> are added', 'Logistics and every ConcreteCreator', 'Only the client class', 'Truck and Ship'],
    'Factory Method supports extension by adding classes. Nothing existing needs editing, which is the Open/Closed Principle.'),
  Q('l5-18', 'l5', 'Adding Airplane to a <strong>Simple Factory</strong> requires adding another <code>else if</code> in <code>CreateTransport()</code>. Which principle does this violate?',
    ['Open/Closed Principle', 'Single Responsibility Principle', 'Interface Segregation Principle', 'Liskov Substitution Principle'],
    'Existing code must be modified to extend behaviour: it is not closed for modification.'),
  Q('l5-19', 'l5', 'What does this code print?' + pre(`Logistics l = new SeaLogistics();
ITransport t = l.CreateTransport();
t.Deliver();
// SeaLogistics.CreateTransport() returns new Ship()
// Ship.Deliver() prints "Deliver by sea in a ship"`),
    ['Deliver by sea in a ship', 'Deliver by land in a truck', 'Nothing: Logistics is abstract and cannot be assigned', 'It does not compile because the client names ITransport'],
    'The variable type is the abstract Creator, but the runtime object is SeaLogistics, so its override runs and creates a Ship.'),
  Q('l5-20', 'l5', 'Identify the pattern:' + pre(`abstract class Application {
    public abstract IDocument CreateDocument();
}
class PdfApplication : Application {
    public override IDocument CreateDocument() { return new PdfDocument(); }
}
class WordApplication : Application {
    public override IDocument CreateDocument() { return new WordDocument(); }
}`),
    ['Factory Method', 'Singleton', 'Simple Factory', 'Strategy'],
    'An abstract method returning an interface, overridden by subclasses that each return <code>new X()</code>: Factory Method. (There is no if/else, so not Simple Factory.)'),
  Q('l5-21', 'l5', 'A messaging app supports Email and SMS now, and Push, WhatsApp and others will be added over time without editing existing, tested code. Which design is the best choice?',
    ['Factory Method: a Sender interface with a creator subclass per channel', 'A Simple Factory with a growing if/else on the channel name', 'A Singleton that stores all senders', 'Create each sender with <code>new</code> directly in the client'],
    'New types should be added by new classes only. Simple Factory forces editing the factory, and a Singleton does not address creation of varying types.'),
  Q('l5-22', 'l5', 'A small tool converts a file with <code>if (fmt == "csv") return new CsvWriter(); else return new JsonWriter();</code> in one static method. Formats almost never change. Which description is most accurate?',
    ['A Simple Factory: acceptable for small stable systems, but not open for extension', 'A Factory Method: subclasses decide the class', 'A Singleton: there is one writer at a time', 'Not a pattern of any kind: it is just a method'],
    'One method selecting a class by input is Simple Factory. It centralises creation but needs edits for new types.'),
  Q('l5-23', 'l5', 'Critical analysis: why does the client in Factory Method create its transport through <code>Logistics</code> instead of calling <code>new Truck()</code>?',
    ['So the client depends only on abstractions and does not need to change when new products are added', 'Because Truck has a private constructor', 'Because <code>new</code> is slower than a method call', 'Because interfaces cannot be instantiated in C#'],
    'Hiding the concrete class reduces coupling, which also supports Dependency Inversion and Open/Closed.'),
  Q('l5-24', 'l5', 'Which sentence about the <code>Creator</code>\'s <code>SomeOperation()</code> in the lecture template is correct?' + pre(`public void SomeOperation() {
    IProduct product = FactoryMethod();
    product.Operation();
}`),
    ['It works with any product because it only knows the IProduct interface', 'It must be edited each time a ConcreteProduct is added', 'It decides which ConcreteProduct to create using an if/else', 'It can only be called on the abstract Creator itself'],
    'The Creator calls the abstract factory method; the subclass chooses the product, and the Creator never names a concrete class.'),
  Q('l5-25', 'l5', 'Which of these patterns is <strong>creational</strong>?',
    ['Factory Method', 'Adapter', 'Strategy', 'Proxy'],
    'Adapter and Proxy are structural, Strategy is behavioral.'),
  Q('l5-26', 'l5', 'A developer says: "I made the Singleton thread safe by marking the instance field <code>readonly</code>, but I left <code>public Singleton() { }</code>." What is the flaw?',
    ['The public constructor lets anyone create more instances, so it is not a Singleton at all', 'readonly cannot be used on static fields', 'Singletons must be lazy', 'The class must be abstract'],
    'Thread safety is irrelevant if the constructor is public. The private constructor is the core of the pattern.'),
  Q('l5-27', 'l5', 'A game needs a single <code>ScoreBoard</code> shared by all levels, created only when the first level asks for it. Which implementation fits <strong>and</strong> is safe if levels load on different threads?',
    ['A static field with a null check inside a <code>lock</code> block', 'A static field with a null check and no lock', 'An instance field plus a public constructor', 'A new ScoreBoard created in each level'],
    'Lazy creation needs the null check; multiple threads need the lock to keep it to one object.'),

  // ---- lab
  Q('lab5-1', 'lab5', 'In the lab\'s AppConfig Singleton, what does the keyword <code>sealed</code> do?',
    ['Prevents another class from inheriting from AppConfig', 'Prevents the constructor from being called', 'Makes the field thread safe', 'Stops the Theme field from being changed'],
    'A subclass could otherwise add its own creation path and break the one-instance guarantee.'),
  Q('lab5-2', 'lab5', 'In the lab, what does <code>private static readonly</code> on the instance field mean?',
    ['It stores a shared reference that cannot be reassigned after initialisation', 'The object can only be read, never modified', 'The field is created every time it is read', 'The field is visible to subclasses only'],
    '<code>readonly</code> locks the reference, not the object\'s contents (Theme can still change).'),
  Q('lab5-3', 'lab5', 'Which SOLID principle is violated by a <code>User</code> class that also sends emails and writes logs?',
    ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Dependency Inversion'],
    'The class has several reasons to change. SRP: only one.'),
  Q('lab5-4', 'lab5', 'Business logic depends on an <code>IDatabase</code> interface rather than a specific driver class. Which principle is this?',
    ['Dependency Inversion', 'Interface Segregation', 'Single Responsibility', 'Open/Closed'],
    'High-level modules depend on abstractions, not concrete implementations.'),
  Q('lab5-5', 'lab5', 'Which row of the lab comparison between Simple Factory and Factory Method is correct?',
    ['Simple Factory uses conditional logic; Factory Method uses inheritance and overriding', 'Simple Factory uses inheritance; Factory Method uses conditional logic', 'Both need the existing factory to change when a type is added', 'Factory Method needs a string parameter to choose the class'],
    'Simple Factory selects with if/else (static). Factory Method lets subclasses decide through overriding.'),
  Q('lab5-6', 'lab5', 'A class <code>Printer</code> is forced to implement <code>Fax()</code> and <code>Scan()</code> from one big <code>IMachine</code> interface although it only prints. Which principle suggests splitting the interface?',
    ['Interface Segregation', 'Single Responsibility', 'Open/Closed', 'Liskov Substitution'],
    'Classes should not be forced to depend on methods they do not use.'),
  Q('lab5-7', 'lab5', 'Why does the lab say Factory Method "supports extension" while Simple Factory has "limited" OCP?',
    ['A new type means adding a new creator class, not editing an existing method', 'Factory Method has fewer classes overall', 'Simple Factory cannot return interface types', 'Factory Method avoids using interfaces'],
    'Open for extension (add a class), closed for modification (no edits to existing code).'),
  Q('lab5-8', 'lab5', 'When is Singleton useful, according to the lab?',
    ['Several components must share the same object, e.g. configuration, logging or cache managers', 'It makes every class faster by reusing memory', 'It lets a class be created without a constructor', 'It replaces the need for interfaces'],
    'The lab: useful when multiple components need to share the same object; use it when one shared instance is genuinely required.'),
];

// ---------------------------------------------------------------- GLOSSARY
export const glossary = [
  ['Design pattern', 'Reusable, language-independent blueprint for a common design problem; not ready-made code.', 'l5'],
  ['Creational pattern', 'Pattern about how objects are created (Singleton, Factory Method, Builder).', 'l5'],
  ['Structural pattern', 'Pattern about composing classes/objects into larger structures (Adapter, Decorator, Proxy).', 'l5'],
  ['Behavioral pattern', 'Pattern about how objects communicate (Observer, Strategy, Command).', 'l5'],
  ['Singleton', 'Ensures a class has only one instance and provides a global point of access to it.', 'l5'],
  ['Private constructor', 'Singleton part 1: stops outside code from calling <code>new</code>.', 'l5'],
  ['Lazy initialisation', 'The instance is created on first use (<code>if (instance == null)</code>). Not thread safe by itself.', 'l5'],
  ['Eager initialisation', 'Instance created at declaration (<code>static readonly ... = new ...()</code>). Thread safe, may be created unused.', 'l5'],
  ['Thread safety (lock)', '<code>lock</code> / <code>synchronized</code> makes threads take turns so only one instance is created.', 'l5'],
  ['Factory Method', 'Defines an interface for creating objects but lets subclasses decide which class to instantiate.', 'l5'],
  ['Product / ConcreteProduct', 'The interface the client uses, and the real classes that implement it.', 'l5'],
  ['Creator / ConcreteCreator', 'Abstract class declaring the factory method, and subclasses that override it to return a ConcreteProduct.', 'l5'],
  ['Simple Factory', 'One method selects a concrete class with if/else; centralises creation but violates OCP.', 'lab5'],
  ['Open/Closed Principle', 'Open for extension, closed for modification: add new classes instead of editing old ones.', 'lab5'],
  ['SOLID', 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.', 'lab5'],
  ['sealed / final', 'Class modifier that prevents inheritance (C# sealed, Java final).', 'lab5'],
  ['static readonly', 'Field set once at static initialisation and never reassigned (Java: static final).', 'lab5'],
];

// ---------------------------------------------------------------- CHEAT SHEET
export const cheat = [
  ['l5', 'Design patterns and Singleton', [
    'Pattern = reusable, language-independent blueprint for a common problem.',
    'Categories: Creational (creation), Structural (composition), Behavioral (communication).',
    'Midterm: ONLY Singleton and Factory Method (both creational).',
    'Singleton = one instance + global access point.',
    '3 parts: private ctor, private static field, public static accessor (+ null check if lazy).',
    'Lazy (if null) is NOT thread safe: two threads can each create an object.',
    'Fixes: lock / synchronized, or eager static readonly (lab, thread safe).',
    'Use for config, logger, cache, connection. Not for entities with many instances.',
  ]],
  ['l5', 'Factory Method', [
    'Subclasses decide which class to instantiate; client never calls new ConcreteProduct().',
    'Roles: Product (interface), ConcreteProduct, Creator (abstract, FactoryMethod()), ConcreteCreator (override, return new X()).',
    'Add a product = add ConcreteProduct + ConcreteCreator, edit nothing (OCP).',
    'Spot: abstract method returning an interface + subclasses returning new X().',
    'Exam: any language; name roles in comments; show usage with Creator-typed variable.',
  ]],
  ['lab5', 'Lab: Singleton, Factory, SOLID', [
    'AppConfig: sealed class, private static readonly instance, private ctor, public static Instance.',
    'ReferenceEquals(c1, c2) is True; change via c1 visible via c2.',
    'Simple Factory = static if/else; adding Airplane edits it, violating OCP.',
    'Factory Method = inheritance/overriding; add AirLogistics + Airplane only.',
    'SOLID: SRP one reason to change, OCP extend not modify, LSP substitutable, ISP small interfaces, DIP depend on abstractions.',
    'Facade (structural) appears in the lab but is out of the midterm scope.',
  ]],
];
