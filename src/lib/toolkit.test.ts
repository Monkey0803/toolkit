import { describe, expect, it } from 'vitest';
import { filterTools, readRecentToolIds, readSavedToolIds, recordRecentTool, sortTools, writeSavedToolIds } from './toolkit';
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

describe('sortTools', () => {
  const three: Tool[] = [
    { id: 'b', name: 'Bravo', description: '', category: 'Text', icon: '', tags: [] },
    { id: 'a', name: 'Alpha', description: '', category: 'Developer', icon: '', tags: [] },
    { id: 'c', name: 'Charlie', description: '', category: 'Developer', icon: '', tags: [] },
  ];

  it('keeps default order and sorts by name', () => {
    expect(sortTools(three, 'default').map((tool) => tool.id)).toEqual(['b', 'a', 'c']);
    expect(sortTools(three, 'name').map((tool) => tool.id)).toEqual(['a', 'b', 'c']);
  });

  it('sorts by category then name', () => {
    expect(sortTools(three, 'category').map((tool) => tool.id)).toEqual(['a', 'c', 'b']);
  });

  it('does not mutate the input', () => {
    const input = [...three];
    sortTools(input, 'name');
    expect(input.map((tool) => tool.id)).toEqual(['b', 'a', 'c']);
  });
});

describe('recent tools', () => {
  it('records most recent first with dedupe and a cap', () => {
    const storage = new Map<string, string>();
    const adapter = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    };

    recordRecentTool(adapter, 'a');
    recordRecentTool(adapter, 'b');
    recordRecentTool(adapter, 'a');
    for (let i = 0; i < 10; i += 1) recordRecentTool(adapter, `t${i}`);

    const recent = readRecentToolIds(adapter);
    expect(recent[0]).toBe('t9');
    expect(recent).toHaveLength(6);
    expect(recent).not.toContain('a');
  });
});
