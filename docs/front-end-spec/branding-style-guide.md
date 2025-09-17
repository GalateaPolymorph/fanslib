# Branding & Style Guide

## Visual Identity

**Brand Guidelines:** Clean, professional interface optimized for content creator workflows. Design emphasizes visual hierarchy and information density balanced with visual clarity appropriate for power users who prefer efficient, structured interfaces.

## Color Palette

**FansLib Custom Daisy UI Theme:** Light theme with sophisticated purple primary and warm accent colors

| Color Type | OKLCH Value                                | Usage                                   |
| ---------- | ------------------------------------------ | --------------------------------------- |
| Primary    | oklch(60% 0.25 292.717)                    | Primary actions, links, selected states |
| Secondary  | oklch(94% 0.028 342.258)                   | Secondary actions, subtle backgrounds   |
| Accent     | oklch(90% 0.182 98.111)                    | Accent elements, highlights             |
| Success    | oklch(79% 0.209 151.711)                   | Positive feedback, confirmations        |
| Warning    | oklch(94% 0.129 101.54)                    | Cautions, important notices             |
| Error      | oklch(63% 0.237 25.331)                    | Errors, destructive actions             |
| Info       | oklch(90% 0.058 230.902)                   | Informational messages                  |
| Neutral    | oklch(94% 0.033 307.174)                   | Borders, dividers, muted backgrounds    |
| Base       | oklch(100% 0 0) to oklch(95% 0.03 308.299) | Main backgrounds, cards                 |

**Content Status Colors:**

- **Posted:** Success (Green) - Content that has been published
- **Scheduled:** Info (Blue) - Content queued for future posting
- **Draft:** Warning (Yellow) - Posts in progress
- **Untagged:** Error (Red) - Content requiring attention

**Theme Characteristics:**

- **Border Radius:** 1rem for consistent rounded corners
- **Border Width:** 0.5px for subtle definition
- **Color Scheme:** Light theme optimized for extended usage sessions

## Typography

### Font Families

- **Primary:** "Nunito Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Secondary:** "Nunito Sans" (consistent throughout for simplicity)
- **Monospace:** "JetBrains Mono", Consolas, "Courier New"

### Type Scale

| Element | Size            | Weight | Line Height |
| ------- | --------------- | ------ | ----------- |
| H1      | 2rem (32px)     | 600    | 1.2         |
| H2      | 1.5rem (24px)   | 600    | 1.3         |
| H3      | 1.25rem (20px)  | 500    | 1.4         |
| Body    | 0.875rem (14px) | 400    | 1.5         |
| Small   | 0.75rem (12px)  | 400    | 1.4         |

## Iconography

**Icon Library:** Lucide Icons (clean, consistent, well-maintained icon set)

**Usage Guidelines:**

- Consistent 16px and 20px sizing for interface icons
- 24px for primary action buttons
- Status indicators use color + icon combinations for accessibility
- Drag-and-drop affordances use directional icons

## Spacing & Layout

**Grid System:** CSS Grid and Flexbox with Tailwind CSS utilities

**Spacing Scale:** Tailwind's default spacing scale (4px base unit)

- **Tight spacing:** 0.25rem (4px) - 0.5rem (8px) for related elements
- **Standard spacing:** 1rem (16px) - 1.5rem (24px) for component separation
- **Loose spacing:** 2rem (32px) - 3rem (48px) for section separation

**Content Management Specific:**

- **Thumbnail grids:** 0.5rem (8px) gap for dense information display
- **Filter panels:** 1rem (16px) internal padding for comfortable interaction
- **Calendar cells:** Minimum 3rem (48px) height for drag-drop target areas
