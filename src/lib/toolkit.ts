import type { Tool } from '../data/tools';

export const SAVED_TOOLS_KEY = 'toolkit:saved-tools';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function filterTools(tools: Tool[], query: string, category: string): Tool[] {
  const normalizedQuery = query.trim().toLowerCase();

  return tools.filter((tool) => {
    const matchesCategory = category === 'All' || tool.category === category;
    const searchableText = [tool.name, tool.description, ...tool.tags].join(' ').toLowerCase();
    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
}

export function readSavedToolIds(storage: StorageLike): Set<string> {
  try {
    const raw = storage.getItem(SAVED_TOOLS_KEY);
    if (!raw) return new Set();

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((value): value is string => typeof value === 'string')
      ? new Set(parsed)
      : new Set();
  } catch {
    return new Set();
  }
}

export function writeSavedToolIds(storage: StorageLike, ids: Set<string>): void {
  try {
    storage.setItem(SAVED_TOOLS_KEY, JSON.stringify([...ids].sort()));
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}
