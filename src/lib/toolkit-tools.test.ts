import { describe, expect, it } from 'vitest';
import {
  buildGradient,
  calculatePercentage,
  contrastRatio,
  convertCase,
  convertUnit,
  countWords,
  dateToUnix,
  daysBetween,
  decodeUrlComponent,
  encodeUrlComponent,
  generateLorem,
  generatePassword,
  generateUuids,
  getRouteFromHash,
  parseHexColor,
  regexMatches,
  renderMarkdown,
  splitTip,
  unixToDate,
  wcagLevel,
  decodeBase64,
  encodeBase64,
  formatJson,
} from './toolkit-tools';

describe('JSON helpers', () => {
  it('formats and minifies valid JSON', () => {
    const input = '{"name":"Toolkit","items":[1,2]}';
    expect(formatJson(input)).toBe(`{
  "name": "Toolkit",
  "items": [
    1,
    2
  ]
}`);
    expect(formatJson(input, true)).toBe('{"name":"Toolkit","items":[1,2]}');
  });

  it('throws for invalid JSON', () => {
    expect(() => formatJson('{broken')).toThrow();
  });
});

describe('Base64 helpers', () => {
  it('round-trips UTF-8 text', () => {
    const encoded = encodeBase64('工具箱 Toolkit');
    expect(decodeBase64(encoded)).toBe('工具箱 Toolkit');
  });

  it('throws for malformed Base64', () => {
    expect(() => decodeBase64('%%%')).toThrow();
  });
});

describe('color helpers', () => {
  it('normalizes short and full HEX colors', () => {
    expect(parseHexColor('#f00')).toEqual({ hex: '#FF0000', rgb: 'rgb(255, 0, 0)', hsl: 'hsl(0, 100%, 50%)' });
    expect(parseHexColor('336699')).toEqual({ hex: '#336699', rgb: 'rgb(51, 102, 153)', hsl: 'hsl(210, 50%, 40%)' });
  });

  it('throws for invalid colors', () => {
    expect(() => parseHexColor('#12')).toThrow();
  });
});

describe('hash routes', () => {
  it('normalizes hash values', () => {
    expect(getRouteFromHash('#/tools/json-formatter')).toBe('tools/json-formatter');
    expect(getRouteFromHash('')).toBe('');
  });
});

describe('word counting', () => {
  it('counts words, characters, sentences, and reading time', () => {
    expect(countWords('Hello world. This is a test.')).toEqual({
      words: 6,
      characters: 28,
      charactersNoSpaces: 23,
      sentences: 2,
      readingMinutes: 1,
    });
  });
});

describe('case conversion', () => {
  it('converts between common styles', () => {
    expect(convertCase('hello world', 'title')).toBe('Hello World');
    expect(convertCase('hello world', 'camel')).toBe('helloWorld');
    expect(convertCase('hello world', 'snake')).toBe('hello_world');
    expect(convertCase('hello world', 'kebab')).toBe('hello-world');
  });
});

describe('markdown rendering', () => {
  const md = (source: string) => renderMarkdown(source).replace(/\n/g, '');

  it('renders headings, lists, emphasis, and escapes HTML', () => {
    expect(md('# Title')).toContain('<h1>Title</h1>');
    expect(md('- item')).toContain('<ul><li>item</li></ul>');
    expect(md('<script>alert(1)</script>')).not.toContain('<script>');
  });

  it('groups consecutive list items into a single list', () => {
    expect(md('- a\n- b\n- c')).toContain('<ul><li>a</li><li>b</li><li>c</li></ul>');
  });

  it('renders ordered lists, blockquotes, and horizontal rules', () => {
    expect(md('1. first\n2. second')).toContain('<ol><li>first</li><li>second</li></ol>');
    expect(md('> note')).toContain('<blockquote>note</blockquote>');
    expect(md('---')).toContain('<hr />');
  });

  it('renders images and links with escaped attributes', () => {
    expect(md('![alt text](https://example.com/a.png)')).toContain('<img src="https://example.com/a.png" alt="alt text" />');
    expect(md('[link](https://example.com/?a=1&b=2)')).toContain('href="https://example.com/?a=1&amp;b=2"');
  });
});

describe('URL helpers', () => {
  it('encodes and decodes URL components', () => {
    expect(encodeUrlComponent('a b&c')).toBe('a%20b%26c');
    expect(decodeUrlComponent('a%20b%26c')).toBe('a b&c');
  });
});

describe('timestamp helpers', () => {
  it('converts timestamps both directions', () => {
    const { seconds, milliseconds } = dateToUnix(2024, 1, 1, 0, 0);
    expect(milliseconds).toBe(seconds * 1000);
    expect(unixToDate(String(seconds), 'seconds')).toContain('2024');
  });
});

describe('unit conversion', () => {
  it('converts length and temperature', () => {
    expect(convertUnit(1, 'km', 'm', 'length')).toBeCloseTo(1000, 6);
    expect(convertUnit(0, 'c', 'f', 'temperature')).toBeCloseTo(32, 6);
  });
});

describe('developer helpers', () => {
  it('generates UUIDs and matches regex', () => {
    expect(generateUuids(3)).toHaveLength(3);
    expect(generateUuids(3)[0]).toMatch(/^[\da-f-]{36}$/);
    expect(regexMatches('\\d+', 'a1b22')).toEqual(['1', '22']);
    expect(regexMatches('[', 'x')).toEqual([]);
  });
});

describe('color and gradient helpers', () => {
  it('computes contrast and WCAG level', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
    expect(wcagLevel(7)).toBe('AAA');
    expect(wcagLevel(2)).toBe('Fail');
  });

  it('builds a gradient string', () => {
    expect(buildGradient('#FFFFFF', '#000000', 90)).toBe('linear-gradient(90deg, #FFFFFF, #000000)');
  });
});

describe('everyday helpers', () => {
  it('calculates percentage and tip split', () => {
    expect(calculatePercentage('percent', 50, 200)).toBe('25.00%');
    expect(splitTip(100, 15, 4)).toBe(28.75);
  });

  it('computes date difference in days', () => {
    expect(daysBetween('2024-01-01', '2024-01-31')).toBe(30);
  });

  it('generates passwords with a minimum length', () => {
    expect(generatePassword(16, { lower: true, upper: true, digits: true, symbols: true })).toHaveLength(16);
  });

  it('generates lorem paragraphs', () => {
    expect(generateLorem(2).split('\n\n')).toHaveLength(2);
  });
});
