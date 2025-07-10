# Relative Path Storage Implementation Plan

## Overview

Convert FansLib from absolute paths to relative paths using existing libraryPath setting. Keep existing filePath for safety during migration.

## Step 1: Database Schema Updates

**Goal**: Add relativePath column while keeping filePath as backup

### 1.1: Update Media Entity

- Add new `relativePath` column (nullable initially)
- Keep existing `filePath` column (mark as deprecated)
- Update TypeORM entity definition

### 1.2: Create Migration Function

- Convert existing absolute paths to relative paths using current `libraryPath`
- Populate `relativePath` column for all Media records
- Keep `filePath` unchanged for safety

### 1.3: Update Media Types

- Update IPC types to include both `filePath` and `relativePath`
- Update frontend Media type definitions
- Mark `filePath` as deprecated in TypeScript

## Step 2: Core Path Utilities

**Goal**: Build functional utilities for path operations

### 2.1: Path Conversion Functions

- `convertAbsoluteToRelative(absolutePath: string, libraryPath: string): string`
- `convertRelativeToAbsolute(relativePath: string, libraryPath: string): string`

### 2.2: Media Resolution Functions

- `resolveMediaPath(media: Media, libraryPath: string): string` - use relativePath, fallback to filePath
- `validateMediaExists(media: Media, libraryPath: string): Promise<boolean>`
- `migrateMediaToRelativePaths(libraryPath: string): Promise<void>`

### 2.3: Path Validation Functions

- `validateLibraryPath(path: string): Promise<boolean>`
- `validateMigration(): Promise<ValidationResult[]>`

## Step 3: Update Media Serving

**Goal**: Update all media serving to use new path resolution

### 3.1: Update Protocol Handlers

- Modify custom protocol handlers to use `resolveMediaPath()`
- Update `media://` and `thumbnail://` protocols
- Fallback to `filePath` if `relativePath` is null

### 3.2: Update Media Operations

- Update all media CRUD operations to use path resolution
- Modify file import/scanning to populate both `filePath` and `relativePath`
- Update thumbnail generation to work with path resolution

### 3.3: Update Media Display

- Ensure all frontend media display uses new path resolution
- Update media grid, previews, and detailed views
- Test that all media types (images, videos) work correctly

## Step 4: Migration Tools

**Goal**: Convert existing database to relative paths

### 4.1: Migration Functions

- `migrateToRelativePaths(libraryPath: string): Promise<void>`
- `validateMigration(): Promise<ValidationResult[]>`
- `backupDatabase(): Promise<void>`

### 4.2: Migration UI

- Migration wizard in settings, keep it simple
- Progress tracking
- Validation results and fixes

### 4.3: Automatic Migration Detection

- Detect if database needs migration on startup
- Prompt user to confirm library path
- Optional automatic migration with smart path detection

## Implementation Notes

### Functional Programming Approach

- All utilities as pure functions
- Use Ramda for composition and data transformation
- No classes, only functions and plain objects

### Error Handling

- Use Result<T, E> types for complex operations
- Promise rejections for simple functions
- Optional chaining and nullish coalescing

### Testing Strategy

- Unit tests for each utility function
- Integration tests for import workflow
- Test with real database copies

### Simplified Architecture

- Use existing `libraryPath` setting (no new settings needed)
- Add `relativePath` column, keep `filePath` as backup
- All media resolution uses: `path.join(libraryPath, relativePath)` with fallback to `filePath`

## Current Status

- [ ] Step 1: Database Schema Updates
- [ ] Step 2: Core Path Utilities
- [ ] Step 3: Update Media Serving
- [ ] Step 4: Migration Tools

## Notes for Implementation

- Start with Step 1.1 to establish foundation
- Test each step thoroughly before moving to next
- Keep `filePath` as safety backup during entire migration
- Use `relativePath` in all resolution
- Focus on converting existing absolute paths to relative paths only
