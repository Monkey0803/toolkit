import { describe, expect, it } from 'vitest';
import {
  buildGradient,
  calculateBmi,
  calculateLoan,
  calculatePercentage,
  contrastRatio,
  convertBase,
  convertCase,
  convertEncoding,
  convertUnit,
  countWords,
  dateToUnix,
  daysBetween,
  decodeJwt,
  decodeUrlComponent,
  diffLines,
  encodeUrlComponent,
  generateLorem,
  generatePassword,
  generateUuids,
  getRouteFromHash,
  hashText,
  parseHexColor,
  regexMatches,
  renderMarkdown,
  splitTip,
  transformLines,
  unixToDate,
  wcagLevel,
  decodeBase64,
  encodeBase64,
  decodeBase32,
  encodeBase32,
  decodeBase58,
  encodeBase58,
  decodeBase16,
  encodeBase16,
  decodeUnicode,
  encodeUnicode,
  decodeUtf8Hex,
  encodeUtf8Hex,
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

describe('encoding codecs', () => {
  const zh = '工具箱 Toolkit';

  it('round-trips Base32 and Base58', () => {
    expect(decodeBase32(encodeBase32(zh))).toBe(zh);
    expect(decodeBase58(encodeBase58(zh))).toBe(zh);
  });

  it('round-trips Base16 and Unicode escapes', () => {
    expect(decodeBase16(encodeBase16(zh))).toBe(zh);
    expect(decodeUnicode(encodeUnicode(zh))).toBe(zh);
    expect(encodeUnicode('中')).toBe('\\u4e2d');
  });

  it('round-trips UTF-8 hex bytes for Chinese', () => {
    expect(encodeUtf8Hex('中')).toBe('E4 B8 AD');
    expect(decodeUtf8Hex('E4 B8 AD')).toBe('中');
    expect(decodeUtf8Hex('%E4%B8%AD')).toBe('中');
    expect(decodeUtf8Hex('\\xE4\\xB8\\xAD')).toBe('中');
  });

  it('routes every type through convertEncoding', () => {
    expect(convertEncoding('base32', 'decode', convertEncoding('base32', 'encode', zh))).toBe(zh);
    expect(convertEncoding('utf8', 'decode', convertEncoding('utf8', 'encode', zh))).toBe(zh);
    expect(convertEncoding('base58', 'decode', convertEncoding('base58', 'encode', zh))).toBe(zh);
    expect(() => convertEncoding('base32', 'decode', '?!')).toThrow();
    expect(() => convertEncoding('utf8', 'decode', 'zz')).toThrow();
  });
});

describe('JWT decoder', () => {
  it('decodes header and payload without verification', () => {
    const b64url = (value: string) => encodeBase64(value).replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const token = `${b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${b64url(JSON.stringify({ sub: '123', name: '中文' }))}.sig`;
    const { header, payload } = decodeJwt(token);
    expect(JSON.parse(header).alg).toBe('HS256');
    expect(JSON.parse(payload).name).toBe('中文');
  });

  it('rejects malformed tokens', () => {
    expect(() => decodeJwt('not-a-token')).toThrow();
  });
});

describe('hash generator', () => {
  it('produces a known SHA-256 digest', async () => {
    expect(await hashText('SHA-256', 'abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});

describe('text diff', () => {
  it('flags added and removed lines', () => {
    const result = diffLines('a\nb\nc', 'a\nx\nc');
    const types = result.map((line) => `${line.type}:${line.text}`).join('|');
    expect(types).toContain('removed:b');
    expect(types).toContain('added:x');
  });
});

describe('line tools', () => {
  it('sorts, dedupes, and filters lines', () => {
    const input = 'banana\napple\nbanana\n\n  cherry';
    expect(transformLines(input, { sort: 'asc', unique: true, trim: true, removeEmpty: true, filter: '' })).toBe('apple\nbanana\ncherry');
  });
});

describe('number base conversion', () => {
  it('converts between bases with BigInt precision', () => {
    expect(convertBase('255', 10, 16)).toBe('FF');
    expect(convertBase('10', 10, 2)).toBe('1010');
    expect(convertBase('FFFF', 16, 10)).toBe('65535');
  });
});

describe('loan and BMI calculators', () => {
  it('computes equal-payment loan', () => {
    const plan = calculateLoan('equal-payment', 1000000, 4, 20);
    expect(plan.monthlyPayment).toBeGreaterThan(0);
    expect(plan.totalInterest).toBeGreaterThan(plan.monthlyPayment * 12 * 20 - 1000000 - 1);
  });

  it('computes equal-principal totals', () => {
    const plan = calculateLoan('equal-principal', 1200000, 12, 10);
    expect(plan.firstPayment).toBeGreaterThan(plan.lastPayment);
    expect(plan.totalInterest).toBeGreaterThan(0);
  });

  it('classifies BMI', () => {
    expect(calculateBmi(175, 45).category).toBe('underweight');
    expect(calculateBmi(175, 70).category).toBe('normal');
    expect(calculateBmi(175, 80).category).toBe('overweight');
    expect(calculateBmi(170, 90).category).toBe('obese');
  });
});
