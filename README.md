# Interactive Web Application: Software Construction & Testing Midterm

An interactive study companion for **Software Construction & Testing** (GIU, Winter 2026, Dr. Ahmed Maghawry): five lectures and five labs turned into notes you can play with, built for midterm preparation.

**Scope follows the course email:** all topics from lectures and labs, but from the Design Patterns lecture only the **Singleton** and **Factory** creational patterns. Question styles match the email too: MCQs, critical analysis, real-life scenarios, coding, and identifying and correcting code errors.

## What's inside

| Area | Content |
|---|---|
| **Lectures 1-5** | Construction & testing (methodologies, levels, box testing), imperative vs declarative, functional programming fundamentals and advanced (currying, laziness, pattern matching, concurrency), Singleton and Factory Method |
| **Labs 1-5** | Methodology scenarios and V-model vs Spiral, code smells / Return Early / Fail Fast, FP in JavaScript, specifications and JSDoc, Singleton AppConfig, Simple Factory vs Factory Method, SOLID |
| **Simulators** | Methodology picker, interactive V-model, imperative vs declarative stepper, arrow anti-pattern flattener, pure vs impure, mutation vs immutability, map/filter/reduce pipeline, recursion call stack, currying and bind, lazy vs eager, a Singleton thread race, and "add Airplane" to see the Open/Closed Principle |
| **Code lab** | Find-and-fix-the-bug, predict-the-output and write-the-code exercises in C#, Java and JavaScript, each with a model answer |
| **Practice** | Exam-style questions with explanations, flashcards with spaced repetition, a searchable glossary and a printable cheat sheet |

Progress (sections understood, quiz history, flashcard boxes, solved exercises) is saved in your browser's local storage.

## Run it

Static site, no build step. ES modules need to be served over HTTP:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Structure

```
index.html
css/                 styles, quiz, motion
js/app.js            router, home, module pages, quiz, flashcards, glossary, cheat sheet, search
js/codelab-view.js   the Code lab page
js/content/u1-u5.js  one file per lecture + lab: notes, questions, glossary, cheat sheet
js/content/codelab.js  bug-fix, trace and coding exercises
js/widgets/w-u1-u5.js  the simulators
js/store.js          local progress
js/viz.js            SVG and helper functions
```

## Credits

The app framework (layout, router, quiz, flashcards, motion, service worker) is adapted from [Ahmed Atef Youssef's Data Engineering & Visualization study app](https://github.com/ahmedatefyoussef/Interactive-Web-Application-Data-Engineering-Visualization-Midterm). Course content and simulators are new.
