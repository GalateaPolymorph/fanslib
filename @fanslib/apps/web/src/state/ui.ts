import { atom } from 'jotai';

/**
 * UI State Atoms
 *
 * This module contains all global UI state management using Jotai.
 * Following immutable patterns with only const declarations.
 */

/**
 * Sidebar state atom
 * Controls whether the mobile/tablet sidebar drawer is open
 */
export const sidebarOpenAtom = atom<boolean>(false);

/**
 * Sidebar toggle action atom
 * Write-only atom to toggle sidebar state
 */
export const toggleSidebarAtom = atom(null, (get, set) => {
  set(sidebarOpenAtom, !get(sidebarOpenAtom));
});

/**
 * Sidebar open action atom
 * Write-only atom to open sidebar
 */
export const openSidebarAtom = atom(null, (get, set) => {
  set(sidebarOpenAtom, true);
});

/**
 * Sidebar close action atom
 * Write-only atom to close sidebar
 */
export const closeSidebarAtom = atom(null, (get, set) => {
  set(sidebarOpenAtom, false);
});

/**
 * Theme state atom
 * Controls the current theme (for future use)
 */
export const themeAtom = atom<'light' | 'dark' | 'auto'>('auto');

/**
 * Loading state atom
 * Global loading indicator state
 */
export const globalLoadingAtom = atom<boolean>(false);

/**
 * Notification state atom
 * For managing toast notifications and alerts
 */
export const notificationAtom = atom<{
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
} | null>(null);
