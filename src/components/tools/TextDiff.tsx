import { useMemo, useState } from 'react';
import { diffLines } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

export function TextDiff() {
  const { lang, t } = useLanguage();
  const tool = getTool('text-diff')!;
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const lines = useMemo(() => diffLines(left, right), [left, right]);
  const added = lines.filter((line) => line.type === 'added').length;
  const removed = lines.filter((line) => line.type === 'removed').length;

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Text" description={t('diff.desc')} status={`+${added} / -${removed}`}>
      <div className="tool-workbench">
        <section className="tool-panel tool-panel--stack" aria-labelledby="diff-input-title">
          <div className="tool-panel__heading"><h2 id="diff-input-title">{t('common.input')}</h2><span>{t('common.live')}</span></div>
          <div className="diff-inputs">
            <div className="diff-input">
              <label className="field-label" htmlFor="diff-left">{t('diff.original')}</label>
              <textarea id="diff-left" className="code-editor" value={left} onChange={(event) => setLeft(event.target.value)} aria-label={t('diff.original')} spellCheck={false} />
            </div>
            <div className="diff-input">
              <label className="field-label" htmlFor="diff-right">{t('diff.modified')}</label>
              <textarea id="diff-right" className="code-editor" value={right} onChange={(event) => setRight(event.target.value)} aria-label={t('diff.modified')} spellCheck={false} />
            </div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="diff-result-title">
          <div className="tool-panel__heading"><h2 id="diff-result-title">{t('diff.result')}</h2><span>{lines.length} {lang === 'zh' ? '行' : 'lines'}</span></div>
          <div className="diff-view">
            {lines.map((line, index) => (
              <div className={`diff-line diff-line--${line.type}`} key={index}><code>{line.text === '' ? ' ' : line.text}</code></div>
            ))}
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}