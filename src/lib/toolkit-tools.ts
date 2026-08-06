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
