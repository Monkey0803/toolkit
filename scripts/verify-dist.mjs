import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const head = html.split('<script>')[0];
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);

// The application bundle is the last inline script and must sit after the root element.
const bundle = scripts[scripts.length - 1];

assert.ok(bundle, 'built page should contain an inline application script');
assert.ok(styleMatch, 'built page should contain inline styles');
assert.ok(html.indexOf(bundle[0]) > html.indexOf('<div id="root">'), 'application script should follow the root element');
assert.doesNotMatch(bundle[1], /<\/script>/, 'application script must not contain a raw closing tag');
assert.doesNotMatch(styleMatch[1], /<\/style>/, 'inline styles must not contain a raw closing tag');
assert.doesNotMatch(head, /<script[^>]*type="module"/, 'built page must not require module loading');
assert.doesNotMatch(head, /(?:src|href)="(?:\.\/|\/)assets\//, 'built page must not depend on external assets');
