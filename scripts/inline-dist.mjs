import { readFile, writeFile } from 'node:fs/promises';

const htmlUrl = new URL('../dist/index.html', import.meta.url);
let html = await readFile(htmlUrl, 'utf8');

const scriptMatch = html.match(/<script type="module" crossorigin src="([^"]+\.js)"><\/script>/);
const styleMatch = html.match(/<link rel="stylesheet" crossorigin href="([^"]+\.css)">/);

if (!scriptMatch || !styleMatch) {
  throw new Error('Could not find the Vite JavaScript or CSS asset in dist/index.html');
}

const [scriptUrl, styleUrl] = [scriptMatch[1], styleMatch[1]].map((assetPath) => new URL(assetPath, htmlUrl));
const [script, styles] = await Promise.all([readFile(scriptUrl, 'utf8'), readFile(styleUrl, 'utf8')]);
const safeScript = script.replaceAll('</script>', '<\\/script>');
const safeStyles = styles.replaceAll('</style>', '<\\/style>');

html = html.replace(scriptMatch[0], '');
html = html.replace(styleMatch[0], () => `<style>\n${safeStyles}\n</style>`);
html = html.replace('</body>', () => `    <script>\n${safeScript}\n</script>\n  </body>`);

await writeFile(htmlUrl, html);
