import { projects } from "@/content/projects";

export const N = projects.length;
export const PAGES = N + 1;
export const CONTACT_THRESHOLD = N / PAGES;

/** Normalize scroll offset (0..1 over PAGES) to project range (0..1 over N projects). */
export function projectOffset(offset: number): number {
  return Math.min(1, (offset * PAGES) / N);
}
