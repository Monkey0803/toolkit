import { useState } from 'react';
import { regexMatches } from '../../lib/toolkit-tools';
import { ToolPageShell } from '../ToolPageShell';

export function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [source, setSource] = useState('');

  const matches = regexMatches(pattern, source);
  const highlighted = highlightMatches(pattern, source);

  return (
    <ToolPageShell title="Regex Tester" category="Developer" description="Check patterns against sample text with readable matches." status={matches.length ? `${matches.length} match${matches.length === 1 ? '' : 'es'} found.` : (pattern ? 'No matches yet.' : 'Enter a pattern to start.')}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="regex-pattern-title">
          <div className="tool-panel__heading"><h2 id="regex-pattern-title">Pattern</h2><span>Regular expression</span></div>
          <label className="field-label" htmlFor="regex-pattern">Expression</label>
          <input id="regex-pattern" className="field-input code-input" value={pattern} onChange={(event) => setPattern(event.target.value)} placeholder="\d+" spellCheck={false} />
          <label className="field-label" htmlFor="regex-source">Sample text</label>
          <textarea id="regex-source" className="code-editor" value={source} onChange={(event) => setSource(event.target.value)} placeholder={'a1 b22 c333'} spellCheck={false} />
        </section>
        <section className="tool-panel" aria-labelledby="regex-result-title">
          <div className="tool-panel__heading"><h2 id="regex-result-title">Matches</h2><span>{matches.length}</span></div>
          <div className="regex-highlight" aria-live="polite">{highlighted || <span className="code-result--empty">Matches will be highlighted here.</span>}</div>
          {matches.length > 0 && <ul className="match-list">{matches.map((match, index) => <li key={`${match}-${index}`}><code>{match}</code></li>)}</ul>}
        </section>
      </div>
    </ToolPageShell>
  );
}

function highlightMatches(pattern: string, source: string): string {
  if (!pattern) return escape(source);
  try {
    const flags = pattern.startsWith('/') ? (pattern.match(/\/([a-z]*)$/)?.[1] ?? '') : 'g';
    const body = pattern.startsWith('/') ? pattern.slice(1, pattern.lastIndexOf('/')) : pattern;
    const regex = new RegExp(body, flags.includes('g') ? flags : `${flags}g`);
    return escape(source).replace(regex, (match) => `<mark>${match}</mark>`);
  } catch {
    return escape(source);
  }
}

function escape(source: string): string {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
