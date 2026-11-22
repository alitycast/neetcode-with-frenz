import type { Problem } from '../types'

/**
 * Normalizes a problem/folder identifier so matching is resilient to
 * capitalization and whitespace/hyphen/underscore differences between
 * a participant's repo and our canonical NeetCode slugs.
 */
export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Given the full problem list and the set of folder names found in a
 * participant's repo, returns the subset of canonical problem slugs that
 * have a matching solution folder. Unrecognized repo folders are ignored
 * rather than causing an error.
 */
export function buildCompletionSet(
  problems: Problem[],
  repoFolderNames: Iterable<string>,
): Set<string> {
  const normalizedFolders = new Set<string>()
  for (const folder of repoFolderNames) {
    normalizedFolders.add(normalizeSlug(folder))
  }

  const completed = new Set<string>()
  for (const problem of problems) {
    if (normalizedFolders.has(normalizeSlug(problem.slug))) {
      completed.add(problem.slug)
    }
  }
  return completed
}
