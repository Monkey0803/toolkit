import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const head = html.split('<script>')[0];
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);

assert.ok(scriptMatch, 'built page should contain an inline script');
assert.ok(styleMatch, 'built page should contain inline styles');
assert.ok(html.indexOf('<script>') > html.indexOf('<div id="root">'), 'inline script should follow the root element');
assert.doesNotMatch(scriptMatch[1], /<\/script>/, 'inline script must not contain a raw closing tag');
assert.doesNotMatch(styleMatch[1], /<\/style>/, 'inline styles must not contain a raw closing tag');
assert.doesNotMatch(head, /<script[^>]*type="module"/, 'built page must not require module loading');
assert.doesNotMatch(head, /(?:src|href)="(?:\.\/|\/)assets\//, 'built page must not depend on external assets');
