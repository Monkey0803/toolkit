import { describe, expect, it } from 'vitest';
import {
  decodeBase64,
  encodeBase64,
  formatJson,
  getRouteFromHash,
  parseHexColor,
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
