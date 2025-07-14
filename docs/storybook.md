# Storybook Documentation

## Overview

Storybook is set up for FansLib to enable isolated development, documentation, and visual testing of React UI components. It's configured to work with React 18, TypeScript, Tailwind CSS, and Shadcn/ui components.

## Getting Started

### Running Storybook

Start Storybook in development mode:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006`.

### Building Storybook

Build a static version of Storybook:

```bash
npm run build-storybook
```

## Features

- **Component Library**: Browse and interact with all UI components
- **Theme Switching**: Toggle between light and dark themes using the toolbar
- **Interactive Controls**: Modify component props in real-time
- **Documentation**: Auto-generated docs for each component
- **Accessibility Testing**: Built-in accessibility checks

## Creating Stories

### Mandatory Requirement

**All new UI components must include a corresponding Storybook story.** This is a development workflow requirement to ensure:

- Components are properly documented
- Visual consistency is maintained
- Components work in isolation
- Regression testing is possible

### Story Structure

Create a `.stories.tsx` file next to your component:

```typescript
// src/renderer/src/components/ui/your-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "./your-component";

const meta: Meta<typeof YourComponent> = {
  title: "UI/YourComponent",
  component: YourComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Define controls for component props
    variant: {
      control: { type: "select" },
      options: ["default", "secondary"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};
```

### Best Practices

1. **Use descriptive story names**: `Default`, `Large`, `Disabled`, etc.
2. **Show all variants**: Create stories for each variant/state
3. **Include edge cases**: Empty states, long text, disabled states
4. **Use realistic data**: Don't use "Lorem ipsum" if possible
5. **Group related stories**: Use consistent naming patterns

### Story Examples

The following components already have stories as examples:

- `Button` (`src/renderer/src/components/ui/button.stories.tsx`)
- `Input` (`src/renderer/src/components/ui/input.stories.tsx`)
- `Dialog` (`src/renderer/src/components/ui/dialog.stories.tsx`)

## Configuration

### File Structure

```
.storybook/
├── main.ts          # Main Storybook configuration
└── preview.ts       # Global settings and decorators
```

### Main Configuration

The main configuration includes:

- **Framework**: React with Vite builder
- **Stories**: Automatically discovers `*.stories.tsx` files
- **Addons**: Essential addons for controls, docs, and interactions
- **Path Aliases**: Supports `@renderer` alias

### Preview Configuration

- **Global Styles**: Imports Tailwind CSS and project styles
- **Theme Decorator**: Adds light/dark theme support
- **Controls**: Configured for color and date matching

## Styling

### Tailwind CSS Integration

All Tailwind classes work in Storybook stories. The theme system is fully integrated:

```tsx
// Light/dark theme classes work automatically
<div className="bg-background text-foreground">Content that respects theme</div>
```

### Shadcn/ui Components

All Shadcn/ui components and their styles are available in Storybook. Use them as you would in the main application.

## Workflow Integration

### Development Process

1. **Create Component**: Build your UI component
2. **Create Story**: Add a `.stories.tsx` file with examples
3. **Test in Storybook**: Verify component works in isolation
4. **Document Variants**: Show all possible states/variants
5. **Review**: Ensure story follows best practices

### Code Review Checklist

When reviewing pull requests, ensure:

- [ ] New UI components have corresponding stories
- [ ] Stories show all major variants
- [ ] Story controls are properly configured
- [ ] Component renders correctly in both themes
- [ ] Documentation is clear and helpful

## Troubleshooting

### Common Issues

1. **Module Resolution**: If imports fail, check the `@renderer` alias in `.storybook/main.ts`
2. **Styling Issues**: Verify Tailwind CSS is imported in `.storybook/preview.ts`
3. **Theme Problems**: Use the theme toolbar to switch between light/dark
4. **TypeScript Errors**: Ensure story types match component props

### Getting Help

- Check the [Storybook documentation](https://storybook.js.org/docs/react/get-started/introduction)
- Review existing stories for patterns
- Ask team members for guidance

## Future Enhancements

Potential improvements to consider:

- Visual regression testing with Chromatic
- Accessibility testing automation
- Component usage analytics
- Performance monitoring
- Custom addon development
