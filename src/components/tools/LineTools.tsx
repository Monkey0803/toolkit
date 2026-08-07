import { useState } from 'react';
import { transformLines } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function LineTools() {
  const { lang, t } = useLanguage();
  const tool = getTool('line-tools')!;
  const [input, setInput] = useState('');
  const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [unique, setUnique] = useState(false);
  const [trim, setTrim] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [filter, setFilter] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');

  function apply() {
    setResult(transformLines(input, { sort, unique, trim, removeEmpty, filter }));
    setStatus(t('common.cleared'));
  }

  async function copyResult() {
    const copied = await copyText(result);
    setStatus(copied ? t('common.copied') : t('common.nothingToCopy'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Text" description={t('lines.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="lines-input-title">
          <div className="tool-panel__heading"><h2 id="lines-input-title">{t('common.input')}</h2><span>{t('common.options')}</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} aria-label={t('common.input')} spellCheck={false} />
          <div className="enc-controls">
            <label className="field-label" htmlFor="lines-sort">{t('lines.sort')}</label>
            <select id="lines-sort" className="field-input" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
              <option value="none">{t('lines.sortNone')}</option>
              <option value="asc">{t('lines.asc')}</option>
              <option value="desc">{t('lines.descending')}</option>
            </select>
            <label className="field-label" htmlFor="lines-filter">{t('lines.filter')}</label>
            <input id="lines-filter" className="field-input" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="contain..." />
          </div>
          <div className="check-group">
            <label className="check-label"><input type="checkbox" checked={trim} onChange={() => setTrim((v) => !v)} /><span>{t('lines.trim')}</span></label>
            <label className="check-label"><input type="checkbox" checked={removeEmpty} onChange={() => setRemoveEmpty((v) => !v)} /><span>{t('lines.removeEmpty')}</span></label>
            <label className="check-label"><input type="checkbox" checked={unique} onChange={() => setUnique((v) => !v)} /><span>{t('lines.unique')}</span></label>
          </div>
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={apply}>{t('lines.apply')}</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="lines-result-title">
          <div className="tool-panel__heading"><h2 id="lines-result-title">{t('common.result')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <pre className="code-result" aria-live="polite">{result}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}