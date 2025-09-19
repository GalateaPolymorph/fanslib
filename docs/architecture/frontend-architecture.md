# Frontend Architecture

## Component Architecture

**Organization Strategy:** Feature-based component organization with shared UI library

```
apps/web/src/
├── components/
│   ├── media/              # Media management features
│   ├── posts/              # Post composition features
│   ├── scheduling/         # Content scheduling features
│   ├── dashboard/          # Dashboard and analytics
│   └── shared/             # Shared business components
├── hooks/                  # Custom React hooks
│   ├── useMediaCollection.ts       # Media data management
│   ├── usePostCollection.ts        # Post data management
│   ├── useElectricSync.ts          # ElectricSQL sync status
│   ├── useAdvancedFilters.ts       # Complex filtering logic
│   └── useContentScheduling.ts     # Scheduling calculations
├── stores/                 # Jotai atoms for local state
│   ├── uiState.ts                  # UI-only state (modals, selections)
│   ├── filterState.ts              # Filter criteria and presets
│   └── editorState.ts              # Editor state (cursor position, etc.)
├── api/                    # API and data access functions
│   ├── electricClient.ts           # ElectricSQL client setup
│   ├── mediaApi.ts                 # Media-related API calls
│   ├── postApi.ts                  # Post-related API calls
│   └── fileSystemApi.ts            # File system operations
└── utils/                  # Frontend utilities
    ├── dateHelpers.ts              # Date/time utilities
    ├── mediaHelpers.ts             # Media processing utilities
    ├── filterHelpers.ts            # Filter query builders
    └── textHelpers.ts              # Text processing utilities
```

## Component Template Pattern

**UI Component Folder Structure:**

**MANDATORY Pattern:** Each UI component must follow this exact folder structure:

```
src/components/ui/ComponentName/
├── ComponentName.tsx          # Main component implementation
├── index.ts                   # Export declarations
└── ComponentName.stories.ts   # Storybook stories
```

**Example Structure:**
```
src/components/ui/Button/
├── Button.tsx
├── index.ts
└── Button.stories.ts
```

**Standard Component Structure:**

```typescript
// Example: MediaCard.tsx (Presentational Component)
import { Media } from "@fanslib/shared/types";

type MediaCardProps = {
  media: Media;
  isSelected?: boolean;
  showShootInfo?: boolean;
  onSelect?: (media: Media) => void;
  onAssignToShoot?: (media: Media) => void;
  onTag?: (media: Media) => void;
};

export const MediaCard = ({
  media,
  isSelected = false,
  showShootInfo = true,
  onSelect,
  onAssignToShoot,
  onTag,
}: MediaCardProps) => {
  return (
    <div
      className={`card bg-base-100 shadow-sm ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <figure className="aspect-square">
        <img
          src={media.thumbnailPath}
          alt={`Media ${media.id}`}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body p-3">
        {showShootInfo && media.shoot && (
          <div className="badge badge-secondary badge-sm">
            {media.shoot.name}
          </div>
        )}
        <div className="card-actions justify-end">
          {onSelect && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onSelect(media)}
            >
              Select
            </button>
          )}
          {onAssignToShoot && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onAssignToShoot(media)}
            >
              Assign
            </button>
          )}
          {onTag && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onTag(media)}
            >
              Tag
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

```typescript
// Example: MediaBrowser.tsx (Container Component)
import { useMediaCollection } from "../hooks/useMediaCollection";
import { useAdvancedFilters } from "../hooks/useAdvancedFilters";
import { MediaGrid } from "./MediaGrid";
import { MediaFilters } from "./MediaFilters";

export const MediaBrowser = () => {
  const { filters, updateFilters, clearFilters } = useAdvancedFilters();
  const { media, isLoading, error } = useMediaCollection(filters);

  return (
    <div className="flex flex-col h-full">
      <MediaFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onClearFilters={clearFilters}
      />
      <div className="flex-1 overflow-auto">
        <MediaGrid media={media} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};
```

## State Management Architecture

**TanStack Query + TanStack DB + Jotai Integration:**

```typescript
// stores/uiState.ts - Local UI state only
import { atom } from "jotai";

export const selectedMediaAtom = atom<string[]>([]);
export const activeModalAtom = atom<"tagging" | "shoot-assignment" | null>(
  null
);
export const sidebarCollapsedAtom = atom<boolean>(false);

// hooks/useMediaCollection.ts - Server state via TanStack DB
import { useCollection } from "@tanstack/db";
import { electricCollectionOptions } from "../api/electricClient";

export const useMediaCollection = (filters?: FilterCriteria) => {
  return useCollection(
    electricCollectionOptions({
      id: "media",
      getKey: (item) => item.id,
      shapeOptions: {
        url: "/api/shapes/media",
        where: filters ? buildWhereClause(filters) : undefined,
      },
    })
  );
};

// api/electricClient.ts - ElectricSQL setup
import { Electric } from "electric-sql";
import { createCollection } from "@tanstack/db";

export const electric = new Electric({
  url: "/api/electric",
});

export const electricCollectionOptions = (options: any) => ({
  ...options,
  electric,
  onUpdate: async ({ transaction }) => {
    // Handle optimistic updates
    const response = await fetch("/api/mutations", {
      method: "POST",
      body: JSON.stringify(transaction),
    });
    return await response.json();
  },
});
```

## Routing Architecture

**React Router with Feature-based Routes:**

```
/                           # Dashboard home
├── /media                  # Media browser
│   ├── /media/shoots       # Shoot management
│   └── /media/tags         # Tag management
├── /posts                  # Post management
│   ├── /posts/new          # Create new post
│   └── /posts/:id/edit     # Edit existing post
├── /calendar               # Content calendar
├── /channels               # Channel management
└── /settings               # Application settings
```

```typescript
// Router setup with nested routes
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      {
        path: "media",
        children: [
          { index: true, element: <MediaBrowser /> },
          { path: "shoots", element: <ShootManagement /> },
          { path: "tags", element: <TagManagement /> },
        ],
      },
      {
        path: "posts",
        children: [
          { index: true, element: <PostList /> },
          { path: "new", element: <PostComposer /> },
          { path: ":id/edit", element: <PostEditor /> },
        ],
      },
      { path: "calendar", element: <ContentCalendar /> },
      { path: "channels", element: <ChannelManagement /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
```

## API Layer

**API Functions with ElectricSQL Integration:**

```typescript
// api/mediaApi.ts
import { electric } from "./electricClient";

// Server mutations (authoritative)
export const scanFileSystem = async (path?: string) => {
  const response = await fetch("/api/media/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  return response.json();
};

export const assignMediaToShoot = async (mediaId: string, shootId: string) => {
  const response = await fetch(`/api/media/${mediaId}/shoot`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shootId }),
  });
  return response.json();
};

// Real-time queries via ElectricSQL shapes
export const getMediaShape = (filters?: FilterCriteria) => {
  return electric.db.media.liveMany({
    where: filters ? buildWhereClause(filters) : undefined,
    include: {
      shoot: true,
      tags: {
        include: {
          tagValue: {
            include: {
              dimension: true,
            },
          },
        },
      },
    },
  });
};
```
