import { K, T, W, terms, compare, steps, code, table } from './helpers.js';

export const lecture = {
  id: 'l1', kind: 'lecture', num: 'L1', icon: 'flask',
  title: 'Introduction to Software Construction and Testing',
  navTitle: 'Construction & Testing', mapLabel: 'Intro & testing',
  short: 'What construction and testing are, the five methodologies, the kinds of testing, tools, best practices and ethics.',
  goals: ['List the six construction activities', 'Name the five testing levels', 'Match each methodology to its one-line idea', 'Separate black, gray and white box testing', 'Recall the ethics principles'],
  sections: [
    {
      id: 'construction', title: 'Software construction',
      body: `<div class="prose">
        <p><strong>Software construction</strong> is the process of creating software, including the <strong>design, development, testing, and deployment</strong> of software systems.</p>
      </div>
      ${table(['Activity', 'What it involves'], [
        ['<strong>Requirements analysis</strong>', 'Identify the needs of the system: functional and non-functional requirements'],
        ['<strong>Design</strong>', 'Detailed design: architecture, data structures, algorithms, user interfaces'],
        ['<strong>Implementation</strong>', 'Write the code using programming languages, development tools, and SE principles'],
        ['<strong>Testing</strong>', 'Verify and validate that the system meets requirements and works as expected'],
        ['<strong>Deployment</strong>', 'Install, configure, and deploy the system in the production environment'],
        ['<strong>Maintenance</strong>', 'Update, modify, and fix the system over time as user needs change'],
      ])}
      ${K('The activities are connected. A bad requirement causes a bad design, a bad design creates difficult code, and difficult code is difficult to test.')}`
    },
    {
      id: 'testing', title: 'Software testing and its levels',
      body: `<div class="prose">
        <p><strong>Software testing</strong> is the process of evaluating the <strong>quality, functionality, and performance</strong> of software to ensure it meets the requirements and expectations of its users.</p>
      </div>
      ${terms([
        ['cube', 'Unit testing', 'Tests individual components or modules to ensure they function correctly.'],
        ['plugs-connected', 'Integration testing', 'Tests how different components or modules work together.'],
        ['desktop', 'System testing', 'Tests the entire system against the specified requirements.'],
        ['handshake', 'Acceptance testing', 'Tests that the software meets the acceptance criteria of the customer or end user.'],
        ['arrow-u-up-left', 'Regression testing', 'Tests the software after changes or updates to ensure no new defects were introduced.'],
      ])}
      ${W('u1Levels')}
      ${T('Unit is one component alone, integration is components together, system is the whole product. If the question says "login, database and API work together" the answer is integration, not system.')}`
    },
    {
      id: 'methodologies', title: 'The five construction methodologies',
      body: `<div class="prose"><p>Know the one-line idea of each model. Typical questions give a scenario and ask which model fits (practise in Lab 1 below).</p></div>
      ${table(['Methodology', 'Approach'], [
        ['<strong>Waterfall</strong>', '<strong>Linear</strong> approach: requirements, design, implementation, testing, deployment run in a sequential manner.'],
        ['<strong>Agile</strong>', '<strong>Iterative and incremental</strong>. Delivers working software in short iterations with frequent feedback and adaptation to changing requirements.'],
        ['<strong>V-model</strong>', '<strong>Verification and Validation</strong> model. Shaped like a V: requirements at the top, then design, implementation, testing, deployment. Each development phase has a matching testing phase.'],
        ['<strong>Spiral</strong>', '<strong>Risk-driven</strong>. Iteratively builds and evaluates software, focusing on identifying and mitigating risks.'],
        ['<strong>Extreme Programming (XP)</strong>', '<strong>Iterative and incremental</strong>. Emphasizes customer satisfaction, teamwork, and frequent deliveries.'],
      ])}
      ${W('u1VModel')}
      ${K('Keyword shortcuts: Waterfall = linear/sequential. Agile = iterative + feedback. V-model = a test phase for every development phase. Spiral = risk. XP = customer satisfaction, teamwork, frequent deliveries.')}
      ${T('Agile and XP are both "iterative and incremental". XP is a specific Agile methodology, so do not pick it unless the scenario mentions its practices (TDD, pair programming, very short cycles).')}`
    },
    {
      id: 'types', title: 'Testing methodologies (types)',
      body: `${table(['Type', 'Definition'], [
        ['<strong>Black box</strong>', 'Testing <strong>without</strong> knowledge of the internal workings or code'],
        ['<strong>White box</strong>', 'Testing <strong>with</strong> knowledge of the internal workings or code'],
        ['<strong>Gray box</strong>', 'Testing with <strong>some</strong> knowledge of the internal workings or code'],
        ['<strong>Functional</strong>', 'Testing software for its intended functionality'],
        ['<strong>Non-functional</strong>', 'Testing performance, scalability, security, and other non-functional requirements'],
        ['<strong>Regression</strong>', 'Testing after changes or updates to ensure no new defects were introduced'],
        ['<strong>Acceptance</strong>', 'Testing to ensure the software meets the acceptance criteria of the customer or end user'],
        ['<strong>Exploratory</strong>', 'Unscripted, unstructured testing to discover new issues or defects'],
      ])}
      ${W('u1Boxes')}
      ${K('Think of the code as a box. Black: you cannot see inside. White: you can see everything. Gray: you can see a bit.')}
      ${T('Exploratory testing is unscripted. If a tester follows written test cases step by step it is not exploratory.')}`
    },
    {
      id: 'tools', title: 'Tools and technologies',
      body: `<div class="prose"><p>You are expected to name an example tool per category.</p></div>
      ${compare(['hammer', 'Software construction', [
        '<strong>IDEs:</strong> Eclipse, Visual Studio, IntelliJ IDEA',
        '<strong>Version control:</strong> Git, SVN, Mercurial',
        '<strong>Agile project management:</strong> Jira, Trello, Asana',
        '<strong>Code editors:</strong> Sublime Text, Atom, Emacs',
        '<strong>Build automation:</strong> Maven, Gradle, Ant',
        '<strong>Deployment automation:</strong> Ansible, Puppet, Chef',
        '<strong>CI/CD:</strong> Jenkins, Travis CI, CircleCI',
        '<strong>Code analysis:</strong> SonarQube, CodeCoverage',
        '<strong>Code generation:</strong> Eclipse Code Generation, Visual Studio Code Generator',
        '<strong>TDD tools:</strong> JUnit, TestNG, NUnit',
      ]], ['bug', 'Software testing', [
        '<strong>Test management:</strong> TestRail, TestLink, PractiTest',
        '<strong>Automated testing:</strong> Selenium, Appium, TestComplete',
        '<strong>Performance testing:</strong> JMeter, LoadRunner, Gatling',
        '<strong>Security testing:</strong> Burp Suite, OWASP ZAP, Vega',
        '<strong>Testing frameworks:</strong> JUnit, TestNG, NUnit',
        '<strong>Acceptance testing:</strong> Cucumber, JBehave, SpecFlow',
        '<strong>Regression testing:</strong> TestComplete, TestLink',
        '<strong>Defect tracking:</strong> JIRA, Bugzilla, Redmine',
        '<strong>Test data management:</strong> TestData Manager, TestData Pro',
        '<strong>Continuous testing:</strong> Jenkins, Travis CI, CircleCI',
      ]])}
      ${K('CI/CD tools build and test the software automatically whenever code changes. Some tools appear twice (JUnit, TestNG, NUnit as TDD tools and testing frameworks; Jenkins, Travis CI, CircleCI for CI/CD and continuous testing; JIRA for Agile management and defect tracking).')}`
    },
    {
      id: 'practices', title: 'Best practices',
      body: `${compare(['hammer', 'Construction', [
        'Follow a development process (Agile, Scrum, Waterfall)',
        'Use version control (Git, SVN)',
        'Write clean, readable code',
        'Use modular design',
        'Use abstraction and encapsulation',
        'Test-Driven Development (TDD): write tests before code',
        'CI/CD to automate build, test, deploy',
      ]], ['bug', 'Testing', [
        'Test early and often',
        'Test thoroughly: functional, performance, security, usability',
        'Use automated testing (Selenium, Appium)',
        'Test for accessibility',
        'Test for security vulnerabilities',
        'Use testing frameworks (JUnit, TestNG)',
        'Use defect tracking tools (JIRA, Bugzilla)',
      ]])}`
    },
    {
      id: 'ethics', title: 'Ethics for software developers',
      body: `${terms([
        ['medal', 'Honesty and integrity', 'Report the real state of the software, including bad news.'],
        ['lock-key', 'Respect for users', 'Protect their privacy and data.'],
        ['shield-check', 'Responsibility', 'Own the quality of the product and its defects.'],
        ['eye', 'Transparency', 'Be open about what the software can and cannot do.'],
        ['users-three', 'Collaboration', 'Work well with developers, testers, and users.'],
        ['graduation-cap', 'Continuous learning', 'Keep skills and knowledge up to date.'],
        ['scales', 'Compliance', 'Follow laws on data privacy and security.'],
      ])}
      ${K('Seven principles: honesty and integrity, respect for users (privacy and data), responsibility for quality and defects, transparency about capabilities, collaboration, continuous learning, compliance with laws.')}`
    },
  ],
};

export const lab = {
  id: 'lab1', kind: 'lab', num: 'Lab 1', icon: 'clipboard-text',
  title: 'Methodologies & Testing Categories',
  navTitle: 'Methodologies & Testing', mapLabel: 'Methods & tests',
  short: 'Methodology use cases, the Spiral phases, V vs Spiral, Agile vs XP, verification vs validation, functional vs non-functional, and levels with examples.',
  goals: ['Pick the right methodology for a scenario', 'Name the four Spiral phases in order', 'Contrast V-model with Spiral and Agile with XP', 'Explain verification vs validation', 'Give an e-commerce example per testing level'],
  sections: [
    {
      id: 'overview', title: 'Course roadmap and assessment',
      body: `<div class="prose">
        <p>The lab recaps software construction (methodologies and use cases), the main testing categories, and the tools. The course flows as: <strong>How do I write software? → How do I design it well? → How do I make sure it works?</strong></p>
      </div>
      ${table(['No.', 'Topic'], [
        ['1', 'Introduction to Software Construction & Testing'],
        ['2', 'Imperative & Declarative Programming'],
        ['3 to 4', 'Functional Programming I & II'],
        ['5 to 6', 'Design Patterns I & II'],
        ['7', 'Design Abstractions & Layered Designs'],
        ['8', 'Design by Contract: Interface Specification'],
        ['9', 'Test Driven Development'],
        ['10', 'Manual Testing'],
        ['11', 'End-to-End Testing'],
        ['12', 'Performance Testing'],
      ])}
      ${K('Assessment: Project 40% (Milestone 1 10%, Milestone 2 15%, Milestone 3 15%), Midterm exam 25%, Final exam 35%.')}`
    },
    {
      id: 'use-cases', title: 'Methodology use cases',
      body: `${table(['Scenario', 'Best methodology'], [
        ['Completely fixed requirements, almost no expected changes (banking, government, manufacturing)', '<strong>Waterfall</strong>'],
        ['Mobile or web app where users constantly give feedback', '<strong>Agile</strong>'],
        ['Software that controls a medical device (safety-critical)', '<strong>V-model</strong>'],
        ['Huge, complex project with significant technical risks (e.g. online banking system)', '<strong>Spiral</strong>'],
        ['Small team, rapidly changing requirements, strong focus on TDD and pair programming', '<strong>XP</strong>'],
      ])}
      ${W('u1Methodology')}
      ${T('Watch the trigger words: "fixed" means Waterfall, "feedback" means Agile, "safety-critical" means V-model, "risk" means Spiral, "TDD / pair programming" means XP.')}`
    },
    {
      id: 'spiral-v', title: 'Spiral phases and V-model vs Spiral',
      body: `<div class="prose"><p>The four Spiral phases, in order, repeated in every loop:</p></div>
      ${steps([
        ['Planning', 'Gather requirements, set objectives, explore alternatives, outline solutions.'],
        ['Risk Analysis', 'Identify risks, evaluate feasibility, create strategies, build a prototype.'],
        ['Engineering', 'Design, code, test, and deploy based on the prototype.'],
        ['Evaluation', 'Collect client feedback, review changes, fix issues, prepare the next spiral.'],
      ])}
      ${W('u1Spiral')}
      ${table(['Aspect', 'V-Model', 'Spiral Model'], [
        ['Structure', 'Sequential, V-shaped', 'Iterative, spiral cycles'],
        ['Testing', 'After each development phase', 'During each cycle'],
        ['Risk / change', 'Low risk, good for stable requirements', 'High risk tolerance, good when requirements or risks evolve'],
        ['Flexibility', 'Rigid, hard to change', 'Flexible, adapts easily'],
        ['Documentation', 'Heavy, detailed at each step', 'Moderate, supports prototypes'],
        ['Best for', 'Safety-critical, well-defined systems', 'Complex, high-risk, evolving projects'],
      ])}`
    },
    {
      id: 'agile-xp', title: 'Agile vs XP',
      body: `${table(['Aspect', 'Agile', 'Extreme Programming (XP)'], [
        ['Type', 'Broad philosophy with multiple methodologies', 'A specific Agile methodology'],
        ['Main focus', 'Customer collaboration, flexibility, delivery', 'Technical excellence, code quality'],
        ['Iterations', 'Short iterations, 2 to 4 weeks', 'Very short iterations, 1 to 2 weeks'],
        ['Feedback', 'In planning and review phases', 'Continuous customer feedback'],
        ['Engineering practices', 'Not specific', 'TDD, pair programming, CI, refactoring'],
        ['Roles', 'Defined roles (Scrum Master, Product Owner)', 'Fewer roles, collective code ownership'],
        ['Releases', 'At the end of iterations', 'Small, frequent releases, even within iterations'],
      ])}
      ${K('Agile focuses on managing the process and adapting to change. XP focuses more on how the code is written.')}`
    },
    {
      id: 'categories', title: 'Testing categories and levels with examples',
      body: `<div class="prose">
        <p><strong>Verification</strong>: "Are we building the product <em>right</em>?" (correctness). <strong>Validation</strong>: "Are we building the <em>right</em> product?" (usefulness).</p>
      </div>
      ${W('u1VerVal')}
      ${table(['Aspect', 'Functional testing', 'Non-functional testing'], [
        ['Purpose', 'Verify the system functions correctly per requirements', 'Ensure the system performs well in speed, security, usability'],
        ['Focus', 'What does the system do? (features and functions)', 'How does the system behave? (performance, usability, reliability)'],
        ['Types', 'Unit, integration, system, UAT, smoke', 'Performance, load, security, usability'],
        ['Based on', 'Functional requirements or use cases', 'Non-functional requirements (performance, scalability)'],
        ['Calculator example', 'Checking 2 + 2 = 4 works', 'Checking it is fast under heavy use and easy to use'],
      ])}
      ${W('u1FuncNonFunc')}
      <div class="prose"><p>Testing levels with the e-commerce example from the lab:</p></div>
      ${table(['Level', 'Example'], [
        ['Unit', 'A login function returns true for valid credentials'],
        ['Integration', 'Login, database, and API work together'],
        ['System', 'Run the full e-commerce site end to end'],
        ['Acceptance (UAT)', 'Client verifies checkout works before launch (final testing by clients or stakeholders)'],
        ['Regression', 'Re-test checkout after adding a Wishlist feature'],
        ['Smoke', 'Quick tests of the basic functionality of the system'],
      ])}
      ${code(`
// Unit test for the calculator example (extra example, not on slides)
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class CalculatorTest {
    @Test
    void addReturnsSum() {
        Calculator calc = new Calculator();
        assertEquals(4, calc.add(2, 2));   // functional test: 2 + 2 = 4
    }
}`, 'Java · JUnit 5 · extra example')}
      ${T('Smoke testing is a quick check of basic functionality, not a deep test. Do not confuse it with regression (re-testing after a change).')}`
    },
  ],
};

const Q = (id, m, q, o, why) => ({ id, m, q, o, why });
export const questions = [
  Q('l1-1', 'l1', 'Which list contains all six software construction activities from the lecture?', ['Requirements analysis, design, implementation, testing, deployment, maintenance', 'Planning, design, implementation, testing, release, marketing', 'Requirements analysis, coding, debugging, testing, documentation, billing', 'Design, implementation, integration, testing, deployment, retirement'], 'The lecture lists requirements analysis, design, implementation, testing, deployment and maintenance.'),
  Q('l1-2', 'l1', 'Which statement best defines software testing?', ['Evaluating the quality, functionality, and performance of software to ensure it meets requirements and user expectations', 'Writing code that implements the system requirements', 'Removing all defects from a program before release', 'Installing the system in the production environment'], 'Testing is evaluation of quality, functionality and performance against requirements and expectations. It cannot promise zero defects.'),
  Q('l1-3', 'l1', 'A tester checks that the login function, the user database and the authentication API work correctly together. Which testing level is this?', ['Integration testing', 'Unit testing', 'System testing', 'Acceptance testing'], 'Components working together is integration testing. System testing would cover the entire system.'),
  Q('l1-4', 'l1', 'The team adds a Wishlist feature to an online shop and then re-runs the old checkout tests. What is this?', ['Regression testing', 'Acceptance testing', 'Exploratory testing', 'Unit testing'], 'Regression testing re-tests after changes to ensure no new defects were introduced.'),
  Q('l1-5', 'l1', 'A hospital is building software that controls an infusion pump. Requirements are well defined and every development phase must have a matching test phase. Which methodology fits best?', ['V-model', 'Waterfall', 'Extreme Programming', 'Agile'], 'V-model pairs each development phase with a testing phase, ideal for safety-critical systems. Waterfall has no such pairing.'),
  Q('l1-6', 'l1', 'A bank starts a huge online banking platform with several unproven technologies. Management wants prototypes and risk evaluation before building each part. Which methodology?', ['Spiral', 'Waterfall', 'V-model', 'Extreme Programming'], 'Spiral is risk-driven: each loop identifies and mitigates risks, with a prototype.'),
  Q('l1-7', 'l1', 'Which description matches Extreme Programming (XP)?', ['Iterative and incremental, emphasizing customer satisfaction, teamwork, and frequent deliveries', 'A linear approach where phases run sequentially', 'Risk-driven, iteratively building and evaluating software', 'Shaped like a V with a test phase for every development phase'], 'The slide describes XP as iterative and incremental with customer satisfaction, teamwork and frequent deliveries.'),
  Q('l1-8', 'l1', 'A tester has no access to the source code and only checks inputs against expected outputs. Which approach is this?', ['Black box testing', 'White box testing', 'Gray box testing', 'Exploratory testing'], 'No knowledge of internal workings or code means black box.'),
  Q('l1-9', 'l1', 'A tester reads the source of a function and writes tests so that every branch of every <code>if</code> is executed. Which approach is this?', ['White box testing', 'Black box testing', 'Non-functional testing', 'Acceptance testing'], 'Using knowledge of the code to design the tests is white box testing.'),
  Q('l1-10', 'l1', 'Which is the best description of exploratory testing?', ['Unscripted, unstructured testing to discover new issues or defects', 'Re-testing after a change to confirm nothing broke', 'Testing against the acceptance criteria of the customer', 'Testing performance and scalability under load'], 'Exploratory testing is unscripted and unstructured, aimed at discovering new defects.'),
  Q('l1-11', 'l1', 'Which pair of tools belongs to the same category of the lecture tool list (build automation)?', ['Maven and Gradle', 'Jenkins and Selenium', 'Git and JMeter', 'Cucumber and Ansible'], 'Build automation: Maven, Gradle, Ant. Jenkins is CI/CD, Selenium is automated testing, JMeter is performance testing.'),
  Q('l1-12', 'l1', 'A team wants to automate building, testing and deploying every time code is pushed. Which tools fit this CI/CD goal?', ['Jenkins, Travis CI, CircleCI', 'Eclipse, Visual Studio, IntelliJ IDEA', 'Burp Suite, OWASP ZAP, Vega', 'Bugzilla, Redmine, JIRA'], 'Jenkins, Travis CI and CircleCI are the CI/CD tools. The others are IDEs, security testing and defect tracking.'),
  Q('l1-13', 'l1', 'A QA engineer wants to record, assign and follow up on bugs found during testing. Which tool category is needed?', ['Defect tracking (JIRA, Bugzilla, Redmine)', 'Performance testing (JMeter, LoadRunner, Gatling)', 'Version control (Git, SVN, Mercurial)', 'Build automation (Maven, Gradle, Ant)'], 'Defect tracking tools manage the lifecycle of bugs.'),
  Q('l1-14', 'l1', 'Which practice means writing the tests before writing the code?', ['Test-Driven Development (TDD)', 'Regression testing', 'Continuous deployment', 'Exploratory testing'], 'TDD is listed among the best practices: write tests before code.'),
  Q('l1-15', 'l1', 'A developer discovers a serious security flaw just before release and the manager asks to keep it quiet. Which ethical principles are most directly at stake?', ['Honesty and integrity, and responsibility for quality and defects', 'Continuous learning and collaboration', 'Compliance with licensing of version control tools', 'Abstraction and encapsulation'], 'Hiding a known defect violates honesty and integrity and responsibility for quality. It may also breach compliance with security laws.'),
  Q('l1-16', 'l1', 'Critical analysis: why does the lecture say bad requirements hurt testing later?', ['A bad requirement leads to a bad design, which creates difficult code, which is difficult to test', 'Testing tools cannot read requirement documents', 'Requirements are only used during deployment', 'Test cases are automatically generated from requirements'], 'The construction activities are connected: problems flow downstream.'),
  Q('lab1-1', 'lab1', 'A start-up builds a mobile app and users constantly send feedback that changes priorities every two weeks. Which methodology fits best?', ['Agile', 'Waterfall', 'V-model', 'Spiral'], 'Agile is iterative and incremental, with frequent feedback and adaptation to changing requirements.'),
  Q('lab1-2', 'lab1', 'What are the four phases of the Spiral model, in order?', ['Planning, Risk Analysis, Engineering, Evaluation', 'Planning, Engineering, Risk Analysis, Evaluation', 'Requirements, Design, Engineering, Testing', 'Risk Analysis, Planning, Evaluation, Engineering'], 'Spiral loops go Planning, Risk Analysis, Engineering, Evaluation, then the next spiral starts.'),
  Q('lab1-3', 'lab1', 'Which statement correctly contrasts Agile with XP?', ['XP is a specific Agile methodology with practices like TDD and pair programming, while Agile is a broad philosophy', 'Agile uses 1 to 2 week iterations while XP uses 2 to 4 weeks', 'XP has many defined roles such as Scrum Master, while Agile has none', 'Agile prescribes TDD and pair programming, while XP does not'], 'XP is one Agile methodology, with shorter iterations (1 to 2 weeks), continuous feedback and specific engineering practices.'),
  Q('lab1-4', 'lab1', 'A user acceptance session shows that a feature works exactly as specified, but customers say they do not need it. Which question has failed?', ['Validation: are we building the right product?', 'Verification: are we building the product right?', 'Regression: did the change break old behaviour?', 'Smoke: does the basic system start?'], 'The product meets its spec (verification passes) but is not useful, so validation fails.'),
  Q('lab1-5', 'lab1', 'Which test is a non-functional test of a calculator app?', ['Checking that it stays fast and responsive under heavy use', 'Checking that 2 + 2 gives 4', 'Checking that dividing 6 by 3 gives 2', 'Checking that the square root button returns the right value'], 'Speed and usability are non-functional. The others check what the calculator does.'),
  Q('lab1-6', 'lab1', 'Compared with the V-model, what is a key advantage of the Spiral model?', ['It is flexible and adapts when requirements or risks evolve', 'It produces heavier documentation at each step', 'It tests only after all development is complete', 'It is best for fully fixed, well-defined requirements'], 'Spiral is iterative, flexible, with moderate documentation. V-model is rigid and heavy on documentation.'),
  Q('lab1-7', 'lab1', 'What is the weighting of the course assessment?', ['Project 40%, Midterm 25%, Final 35%', 'Project 25%, Midterm 40%, Final 35%', 'Project 35%, Midterm 25%, Final 40%', 'Project 30%, Midterm 30%, Final 40%'], 'Lab 1 lists Project 40% (three milestones), Midterm 25%, Final 35%.'),
];

export const glossary = [
  ['Software construction', 'Creating software, including design, development, testing, and deployment.', 'l1'],
  ['Software testing', 'Evaluating the quality, functionality, and performance of software against requirements and user expectations.', 'l1'],
  ['Unit testing', 'Tests individual components or modules.', 'l1'],
  ['Integration testing', 'Tests how components or modules work together.', 'l1'],
  ['System testing', 'Tests the entire system against the specified requirements.', 'l1'],
  ['Acceptance testing', 'Tests that the software meets the customer\'s or end user\'s acceptance criteria.', 'l1'],
  ['Regression testing', 'Re-testing after changes to make sure no new defects were introduced.', 'l1'],
  ['Waterfall', 'Linear, sequential approach to construction.', 'l1'],
  ['Agile', 'Iterative and incremental delivery with frequent feedback.', 'l1'],
  ['V-model', 'Verification and validation model: each development phase has a matching test phase.', 'l1'],
  ['Spiral model', 'Risk-driven iterative model: Planning, Risk Analysis, Engineering, Evaluation.', 'l1'],
  ['Extreme Programming (XP)', 'Agile method stressing customer satisfaction, teamwork, frequent deliveries, TDD and pair programming.', 'l1'],
  ['Black / gray / white box', 'Testing with no, some, or full knowledge of the internal code.', 'l1'],
  ['Exploratory testing', 'Unscripted, unstructured testing to discover new defects.', 'l1'],
  ['Verification', '"Are we building the product right?" (correctness).', 'lab1'],
  ['Validation', '"Are we building the right product?" (usefulness).', 'lab1'],
  ['Functional vs non-functional', 'What the system does vs how it behaves (performance, security, usability).', 'lab1'],
  ['Smoke testing', 'Quick tests of the basic functionality of the system.', 'lab1'],
];

export const cheat = [
  ['l1', 'Construction and testing', [
    'Construction activities: requirements, design, implementation, testing, deployment, maintenance',
    'Testing = evaluate quality, functionality, performance vs requirements',
    'Levels: unit (one module), integration (modules together), system (whole), acceptance (customer criteria), regression (after changes)',
    'Types: black (no code), gray (some), white (full code), functional, non-functional, exploratory (unscripted)',
    'Bad requirement, bad design, difficult code, difficult tests',
  ]],
  ['l1', 'Five methodologies', [
    'Waterfall: linear, sequential',
    'Agile: iterative, incremental, frequent feedback',
    'V-model: each development phase has a matching test phase',
    'Spiral: risk-driven, iterative with prototypes',
    'XP: iterative, customer satisfaction, teamwork, frequent deliveries',
  ]],
  ['l1', 'Tools, practices, ethics', [
    'IDE: Eclipse, VS, IntelliJ. VCS: Git, SVN. Build: Maven, Gradle, Ant. CI/CD: Jenkins, Travis, CircleCI',
    'Testing: JUnit/TestNG/NUnit, Selenium/Appium, JMeter, Burp/ZAP, JIRA/Bugzilla',
    'Practices: version control, clean modular code, TDD, CI/CD, test early and often, automate',
    'Ethics: honesty, respect for users, responsibility, transparency, collaboration, learning, compliance',
  ]],
  ['lab1', 'Pick the methodology', [
    'Fixed requirements, no change: Waterfall',
    'Constant user feedback: Agile',
    'Safety-critical (medical device): V-model',
    'Huge, complex, technical risk: Spiral',
    'Small team, TDD, pair programming: XP',
    'Spiral phases: Planning, Risk Analysis, Engineering, Evaluation',
  ]],
  ['lab1', 'Compare and contrast', [
    'V-model: sequential, rigid, heavy docs. Spiral: iterative, flexible, moderate docs',
    'Agile: broad philosophy, 2 to 4 week iterations, defined roles. XP: specific method, 1 to 2 weeks, TDD, pair programming, CI, refactoring',
    'Verification = built right (correctness). Validation = right product (usefulness)',
    'Functional = what it does. Non-functional = how it behaves',
    'E-commerce: unit login(), integration login+DB+API, system whole site, UAT client checks checkout, regression after Wishlist',
    'Assessment: Project 40%, Midterm 25%, Final 35%',
  ]],
];
