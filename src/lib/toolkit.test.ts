import { describe, expect, it } from 'vitest';
import { filterTools, readSavedToolIds, writeSavedToolIds } from './toolkit';
import type { Tool } from '../data/tools';

const sampleTools: Tool[] = [
  { id: 'json', name: 'JSON Formatter', description: 'Clean JSON', category: 'Developer', icon: '{}', tags: ['json', 'format'] },
  { id: 'words', name: 'Word Counter', description: 'Count words', category: 'Text', icon: 'Aa', tags: ['writing'] },
];

describe('filterTools', () => {
  it('matches name, description, and tags case-insensitively', () => {
    expect(filterTools(sampleTools, 'JSON', 'All')).toHaveLength(1);
    expect(filterTools(sampleTools, 'writing', 'All')[0].id).toBe('words');
  });

  it('combines query and category filters', () => {
    expect(filterTools(sampleTools, '', 'Text').map((tool) => tool.id)).toEqual(['words']);
    expect(filterTools(sampleTools, 'json', 'Text')).toEqual([]);
  });
});

describe('favorite persistence', () => {
  it('round-trips a set and ignores malformed data', () => {
    const storage = new Map<string, string>();
    const adapter = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    };

    writeSavedToolIds(adapter, new Set(['words', 'json']));
    expect(readSavedToolIds(adapter)).toEqual(new Set(['json', 'words']));
    storage.set('toolkit:saved-tools', '{bad');
    expect(readSavedToolIds(adapter)).toEqual(new Set());
  });
});
