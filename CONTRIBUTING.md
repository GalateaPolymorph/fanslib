# Contributing to FansLib

## Development Workflow

### Prerequisites

1. Node.js 18+ and npm
2. Git
3. Familiarity with React, TypeScript, and Electron

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Start Storybook: `npm run storybook`

## Code Standards

### UI Component Requirements

**MANDATORY: All new UI components must include a Storybook story.**

When adding or modifying UI components in `src/renderer/src/components/`, you must:

1. Create a corresponding `.stories.tsx` file
2. Include stories for all component variants/states
3. Test the component in Storybook before submitting
4. Follow the naming convention: `ComponentName.stories.tsx`

Example structure:

```
src/renderer/src/components/ui/
├── button.tsx
├── button.stories.tsx
├── input.tsx
├── input.stories.tsx
```

### Code Quality

Before submitting changes:

1. **Format code**: `npm run format`
2. **Lint code**: `npm run lint`
3. **Type check**: `npm run typecheck`
4. **Run all checks**: `npm run check`

### Testing

- Test components in isolation using Storybook
- Verify components work in both light and dark themes
- Test all interactive states (hover, focus, disabled, etc.)
- Ensure components work with realistic data

## Pull Request Process

### Checklist

- [ ] Code follows project conventions (functional programming, arrow functions, etc.)
- [ ] All new UI components have corresponding Storybook stories
- [ ] Stories demonstrate all component variants and states
- [ ] Components render correctly in both themes
- [ ] Code is properly formatted and linted
- [ ] TypeScript compilation passes
- [ ] No console errors in Storybook

### Description

Include in your PR description:

1. **What**: Brief description of changes
2. **Why**: Explanation of the need/problem solved
3. **Testing**: How you tested the changes
4. **Storybook**: Link to relevant stories if applicable

### Review Process

1. Code review for functionality and style
2. Storybook review for component behavior
3. Testing in development environment
4. Approval and merge

## Component Development Guidelines

### Storybook Stories

Stories should include:

- **Default state**: Basic usage example
- **All variants**: Each prop combination
- **Edge cases**: Empty states, long content, errors
- **Interactive states**: Hover, focus, disabled
- **Responsive behavior**: Different screen sizes when relevant

### Styling

- Use Tailwind CSS classes
- Follow Shadcn/ui patterns
- Support dark mode via CSS variables
- Test in both themes

### TypeScript

- Use strict typing with `unknown` over `any`
- Prefer `type` over `interface`
- Export component types for reuse

## Documentation

### When to Update Docs

- New features or components
- Changes to existing APIs
- Development workflow changes
- Architecture decisions

### Documentation Files

- `CLAUDE.md`: Development commands and architecture
- `docs/storybook.md`: Storybook usage and guidelines
- `CONTRIBUTING.md`: This file

## Getting Help

- Review existing components and stories for patterns
- Check the Storybook documentation
- Ask questions in pull request reviews
- Consult the team for architectural decisions

## Enforcement

Pull requests that add UI components without corresponding Storybook stories will be automatically rejected. This ensures:

- Consistent component documentation
- Visual regression prevention
- Improved development experience
- Better code quality

Thank you for contributing to FansLib!
