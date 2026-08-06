import { useState } from 'react';
import { regexMatches } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

export function RegexTester() {
  const { lang, t } = useLanguage();
  const tool = getTool('regex-tester')!;
  const [pattern, setPattern] = useState('');
  const [source, setSource] = useState('');

  const matches = regexMatches(pattern, source);
  const highlighted = highlightMatches(pattern, source);
  const status = matches.length
    ? `${matches.length} ${t('regex.matchesFound')}`
    : (pattern ? t('regex.noMatches') : t('regex.enterPattern'));

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Developer" description={t('regex.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="regex-pattern-title">
          <div className="tool-panel__heading"><h2 id="regex-pattern-title">{t('regex.pattern')}</h2><span>RegExp</span></div>
          <label className="field-label" htmlFor="regex-pattern">{t('regex.expression')}</label>
          <input id="regex-pattern" className="field-input code-input" value={pattern} onChange={(event) => setPattern(event.target.value)} placeholder="\d+" spellCheck={false} />
          <label className="field-label" htmlFor="regex-source">{t('regex.sampleText')}</label>
          <textarea id="regex-source" className="code-editor" value={source} onChange={(event) => setSource(event.target.value)} placeholder={'a1 b22 c333'} aria-label={t('regex.sampleText')} spellCheck={false} />
        </section>
        <section className="tool-panel" aria-labelledby="regex-result-title">
          <div className="tool-panel__heading"><h2 id="regex-result-title">{t('regex.matches')}</h2><span>{matches.length}</span></div>
          <div className="regex-highlight" aria-live="polite">{highlighted || <span className="code-result--empty">{t('regex.highlightPlaceholder')}</span>}</div>
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
