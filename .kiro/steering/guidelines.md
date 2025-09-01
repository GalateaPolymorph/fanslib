---
inclusion: always
---

# Development Guidelines

## Core Programming Paradigm

**Functional Programming First** - Write pure, composable functions that are easy to test and reason about.

## Code Style Rules

### Functions & Variables

- Use arrow functions exclusively: `const func = () => {}`
- Use implicit returns for single expressions: `const add = (a, b) => a + b`
- Always use `const`, never `let` or `var`
- Prefer early returns over nested conditionals
- Write small, single-responsibility functions and components

### Documentation & Comments

- Only add comments for the **why**, not the **what** or **how**

### Data Transformations

- Use `map/filter/reduce` chains instead of loops
- Never use `for` loops - use `map/filter/reduce` instead
- Maintain immutability - never mutate existing data

#### BAD

```
let sum = 0;
for (const x of xs) {
   if (x <= 0) {
      continue;
   }
   sum = sum + x + 1;
}
```

#### GOOD

```
const foo = xs
   .filter(x => x > 0)
   .map(x => x + 1)
   .reduce((acc, cur) => cur + acc, 0);
```

### TypeScript Conventions

- Use `type` declarations over `interface`
- Prefer `unknown` over `any` for strict typing
- Use manual type definitions over complex utility types

### Asynchronous Code

- Prefer `.then` and `.catch` over `async/await` in all cases
- Splitting up individual operations into smaller functions helps chaining `.then`s
- Use `async/await` ONLY for dataflow orchestration

### Module Organization

- In components, factor out logic units into separate hooks (e.g. for fetching, state handling or calculations)
- Factor out parts of complex components into separate, smaller components
- Only allow one component per file! Place related components in the same directory
- Use contexts for state sharing to prevent prop-drilling
- Use named exports exclusively, avoid default exports
- Use relative imports (`./`, `../`) instead of path mapping
- Do not use `index.ts` files as barrel files - import everything explicitly

## Architecture Patterns

### Component Organization

- Place shared UI components in `components/ui/`
- Use composition over inheritance
- Prefer function components with hooks

### Error Handling

- Return Promise rejections for simple async functions
- Do not overdo error handling, keep it very simple
- Validate inputs with Zod schemas
