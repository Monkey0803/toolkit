export type ParsedColor = {
  hex: string;
  rgb: string;
  hsl: string;
};

export function formatJson(input: string, minify = false): string {
  const value: unknown = JSON.parse(input);
  return JSON.stringify(value, null, minify ? 0 : 2);
}

export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary);
}

export function decodeBase64(input: string): string {
  const normalized = input.trim();
  if (!normalized || normalized.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error('Invalid Base64 input.');
  }

  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function parseHexColor(input: string): ParsedColor {
  const match = input.trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/i);
  if (!match) {
    throw new Error('Use a 3 or 6 digit HEX color.');
  }

  const raw = match[1].length === 3
    ? match[1].split('').map((digit) => `${digit}${digit}`).join('')
    : match[1];
  const red = Number.parseInt(raw.slice(0, 2), 16);
  const green = Number.parseInt(raw.slice(2, 4), 16);
  const blue = Number.parseInt(raw.slice(4, 6), 16);
  const { hue, saturation, lightness } = rgbToHsl(red, green, blue);

  return {
    hex: `#${raw.toUpperCase()}`,
    rgb: `rgb(${red}, ${green}, ${blue})`,
    hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
  };
}

function rgbToHsl(red: number, green: number, blue: number): { hue: number; saturation: number; lightness: number } {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { hue: 0, saturation: 0, lightness: Math.round(lightness * 100) };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue: number;

  if (max === r) {
    hue = (g - b) / delta + (g < b ? 6 : 0);
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  return {
    hue: Math.round(hue * 60),
    saturation: Math.round(saturation * 100),
    lightness: Math.round(lightness * 100),
  };
}

export function getRouteFromHash(hash: string): string {
  return hash.replace(/^#\/?/, '').replace(/\/+$/, '');
}

export type WordStats = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  readingMinutes: number;
};

export function countWords(text: string): WordStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length : 0;
  const readingMinutes = Math.ceil(words / 200);

  return { words, characters, charactersNoSpaces, sentences, readingMinutes };
}

export type CaseStyle = 'title' | 'sentence' | 'lower' | 'upper' | 'camel' | 'pascal' | 'snake' | 'kebab';

export function convertCase(text: string, style: CaseStyle): string {
  const words = text.trim().split(/\s+/).filter(Boolean);

  switch (style) {
    case 'lower':
      return text.toLowerCase();
    case 'upper':
      return text.toUpperCase();
    case 'title':
      return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    case 'sentence':
      return text.length ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : text;
    case 'camel':
      return words.map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
    case 'pascal':
      return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
    case 'snake':
      return words.map((word) => word.toLowerCase()).join('_');
    case 'kebab':
      return words.map((word) => word.toLowerCase()).join('-');
  }
}

function escapeHtml(source: string): string {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderMarkdown(source: string): string {
  const lines = escapeHtml(source).split(/\r?\n/);
  const output: string[] = [];
  let inCode = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      output.push(inCode ? '</code></pre>' : '<pre><code>');
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      output.push(`${line}\n`);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)/);
    if (heading) {
      const level = Math.min(heading[1].length, 3);
      output.push(`<h${level}>${heading[2]}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^\s*[-*]\s+(.+)/);
    if (listItem) {
      output.push(`<li>${listItem[1]}</li>`);
      continue;
    }

    const link = line.match(/^\[(.+)\]\((.+)\)$/);
    if (link) {
      output.push(`<p><a href="${link[2]}">${link[1]}</a></p>`);
      continue;
    }

    if (line.trim() === '') {
      output.push('');
      continue;
    }

    const formatted = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
    output.push(`<p>${formatted}</p>`);
  }

  if (inCode) output.push('</code></pre>');
  return output.join('\n');
}

export function encodeUrlComponent(value: string): string {
  return encodeURIComponent(value);
}

export function decodeUrlComponent(value: string): string {
  return decodeURIComponent(value.replace(/\+/g, ' '));
}

export function unixToDate(value: string, unit: 'seconds' | 'milliseconds'): string {
  const number = Number(value.trim());
  if (!Number.isFinite(number)) throw new Error('Enter a numeric timestamp.');
  const multiplier = unit === 'seconds' ? 1000 : 1;
  const date = new Date(number * multiplier);
  if (Number.isNaN(date.getTime())) throw new Error('That timestamp is out of range.');
  return date.toLocaleString();
}

export function dateToUnix(year: number, month: number, day: number, hour: number, minute: number): { seconds: number; milliseconds: number } {
  const date = new Date(year, month - 1, day, hour, minute);
  return { seconds: Math.floor(date.getTime() / 1000), milliseconds: date.getTime() };
}

type UnitKind = 'length' | 'weight' | 'temperature';

type UnitTable = {
  [kind in UnitKind]: { [unit: string]: number };
};

const UNITS: UnitTable = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, t: 1000, lb: 0.45359237, oz: 0.028349523125 },
  temperature: { c: 0, f: 0, k: 0 },
};

export function convertUnit(value: number, from: string, to: string, kind: UnitKind): number {
  if (kind === 'temperature') {
    const celsius = { c: value, f: (value - 32) * 5 / 9, k: value - 273.15 }[from] ?? value;
    return { c: celsius, f: celsius * 9 / 5 + 32, k: celsius + 273.15 }[to] ?? celsius;
  }

  const fromFactor = UNITS[kind][from] ?? 1;
  const toFactor = UNITS[kind][to] ?? 1;
  return value * fromFactor / toFactor;
}

export function generateUuidV4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
}

export function generateUuids(count: number): string[] {
  return Array.from({ length: Math.min(Math.max(count, 1), 10) }, generateUuidV4);
}

export function regexMatches(pattern: string, source: string): string[] {
  if (!pattern) return [];
  try {
    const flags = pattern.startsWith('/') ? (pattern.match(/\/([a-z]*)$/)?.[1] ?? '') : 'g';
    const body = pattern.startsWith('/') ? pattern.slice(1, pattern.lastIndexOf('/')) : pattern;
    const regex = new RegExp(body, flags.includes('g') ? flags : `${flags}g`);
    return source.match(regex) ?? [];
  } catch {
    return [];
  }
}

export function parseRgb(hex: string): { r: number; g: number; b: number } | null {
  try {
    const parsed = parseHexColor(hex);
    const match = parsed.rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
    if (!match) return null;
    return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
  } catch {
    return null;
  }
}

function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const fg = parseRgb(foreground);
  const bg = parseRgb(background);
  if (!fg || !bg) return 0;
  const lighter = Math.max(luminance(fg), luminance(bg));
  const darker = Math.min(luminance(fg), luminance(bg));
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function wcagLevel(ratio: number): 'AAA' | 'AA' | 'AA Large' | 'Fail' {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export function buildGradient(from: string, to: string, angle: number): string {
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

export function calculatePercentage(type: 'percent' | 'increase' | 'difference', a: number, b: number): string {
  if (type === 'percent') return `${(a / b * 100).toFixed(2)}%`;
  if (type === 'increase') return `${((b - a) / a * 100).toFixed(2)}%`;
  return `${((b - a) / ((a + b) / 2) * 100).toFixed(2)}%`;
}

export function splitTip(bill: number, percent: number, people: number): number {
  if (people <= 0) return 0;
  return Number((bill * (1 + percent / 100) / people).toFixed(2));
}

export function daysBetween(from: string, to: string): number {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new Error('Choose two valid dates.');
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

export function generatePassword(length: number, options: { lower: boolean; upper: boolean; digits: boolean; symbols: boolean }): string {
  const pools = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits: '0123456789',
    symbols: '!@#$%^&*()-_=+',
  };
  const enabled = Object.entries(pools).filter(([key]) => options[key as keyof typeof options]).map(([, value]) => value);
  const pool = enabled.join('') || pools.lower;
  const random = new Uint8Array(length);
  crypto.getRandomValues(random);
  return Array.from(random, (byte) => pool[byte % pool.length]).join('');
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod',
  'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim',
  'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
  'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

export function generateLorem(paragraphs: number, startWithLorem = true): string {
  const count = Math.min(Math.max(paragraphs, 1), 10);
  const output: string[] = [];
  for (let p = 0; p < count; p += 1) {
    const length = 18 + Math.floor(Math.random() * 12);
    const sentence = Array.from({ length }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(' ');
    output.push(startWithLorem && p === 0 ? `Lorem ipsum dolor sit amet, ${sentence.slice(0, -1)}.` : `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`);
  }
  return output.join('\n\n');
}
