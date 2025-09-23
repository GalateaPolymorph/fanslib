# Source Tree Reference

This document provides a focused reference for development agents to understand the current project structure and file organization patterns. See `unified-project-structure.md` for the complete monorepo architecture.

## Current Project State

**Status:** Documentation and planning phase - implementation structure will follow the unified architecture

```
fanslib-2/                          # Current project root
├── docs/                           # Comprehensive documentation
│   ├── architecture/               # Technical architecture specs
│   │   ├── api-specification.md
│   │   ├── backend-architecture.md
│   │   ├── coding-standards.md     # MANDATORY dev agent rules
│   │   ├── components.md
│   │   ├── data-models.md
│   │   ├── database-schema.md
│   │   ├── deployment-architecture.md
│   │   ├── development-workflow.md
│   │   ├── error-handling-strategy.md
│   │   ├── external-apis.md
│   │   ├── frontend-architecture.md
│   │   ├── high-level-architecture.md
│   │   ├── security-and-performance.md
│   │   ├── tech-stack.md           # Technology decisions
│   │   ├── testing-strategy.md
│   │   ├── unified-project-structure.md # Complete monorepo plan
│   │   └── source-tree.md          # This file
│   ├── prd/                        # Product requirements
│   │   ├── epic-*.md               # Feature epics
│   │   ├── goals-and-background-context.md
│   │   ├── requirements.md
│   │   └── technical-assumptions.md
│   ├── front-end-spec/             # UI/UX specifications
│   └── stories/                    # Development stories
└── .bmad-core/                     # AI agent configurations
    └── core-config.yaml            # Project configuration
```

## Implementation Structure (To Be Created)

When implementation begins, the structure will follow the unified architecture:

```
@fanslib/                           # Monorepo packages (future)
├── apps/
│   ├── web/                        # React frontend with integrated UI and Storybook
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── ui/             # Design system components (integrated)
│   │   │   └── ...                 # Other app code
│   │   ├── stories/                # Storybook stories (integrated)
│   │   └── .storybook/             # Storybook config (integrated)
│   └── server/                     # Bun backend
├── libraries/                      # Domain-specific shared libraries only
│   └── [domain-libs]/              # Shared business logic libraries
└── configs/                        # Shared configs
    ├── eslint/
    ├── typescript/
    └── prettier/
```

## Key File Patterns

### Component Organization

- **Feature-based structure:** `components/media/`, `components/posts/`
- **Integrated UI library:** `src/components/ui/` directory within web package with local exports
- **File naming:** kebab-case (e.g., `media-browser.tsx`)

### Module Organization

- **Functional modules:** Pure functions organized by domain
- **No classes:** Functional programming patterns throughout
- **Result types:** Error handling with ts-belt Result types

### Configuration Files

- **Root:** `package.json`, `turbo.json`, `bun.lockb`
- **TypeScript:** Shared configs in `@fanslib/typescript`
- **ESLint:** Shared configs in `@fanslib/eslint`

## Development Workflow

### Current Phase

1. **Documentation Complete:** Architecture and requirements defined
3. **Implementation:** Following unified architecture plan

### File Creation Rules

- Follow coding-standards.md for all naming and patterns
- Use tech-stack.md for technology selections
- Reference unified-project-structure.md for monorepo organization
- Never use default exports, always named exports

## Critical References

- **`docs/architecture/coding-standards.md`** - MANDATORY rules for AI agents
- **`docs/architecture/tech-stack.md`** - Technology decisions
- **`docs/architecture/unified-project-structure.md`** - Complete monorepo plan
- **`.bmad-core/core-config.yaml`** - Project configuration

This source tree will evolve as implementation progresses, but the architectural patterns and standards are established and must be followed consistently.
