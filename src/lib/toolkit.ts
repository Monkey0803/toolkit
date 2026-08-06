import type { Tool } from '../data/tools';

export const SAVED_TOOLS_KEY = 'toolkit:saved-tools';
export const RECENT_TOOLS_KEY = 'toolkit:recent-tools';
export const MAX_RECENT = 6;

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export type SortMode = 'default' | 'name' | 'category';

export function sortTools(tools: Tool[], mode: SortMode): Tool[] {
  const sorted = [...tools];
  if (mode === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (mode === 'category') {
    sorted.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }
  return sorted;
}

export function readRecentToolIds(storage: StorageLike): string[] {
  try {
    const raw = storage.getItem(RECENT_TOOLS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((value): value is string => typeof value === 'string')
      ? parsed.slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

export function recordRecentTool(storage: StorageLike, id: string): string[] {
  const next = [id, ...readRecentToolIds(storage).filter((value) => value !== id)].slice(0, MAX_RECENT);
  try {
    storage.setItem(RECENT_TOOLS_KEY, JSON.stringify(next));
  } catch {
    // Recent tracking is optional when storage is unavailable.
  }
  return next;
}

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
