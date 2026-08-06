import { useState } from 'react';
import { formatJson } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function JsonFormatter() {
  const { lang, t } = useLanguage();
  const tool = getTool('json-formatter')!;
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function transform(minify: boolean) {
    try {
      setResult(formatJson(input, minify));
      setError('');
      setStatus(minify ? t('json.minified') : t('json.formatted'));
    } catch {
      setError(t('json.invalid'));
      setStatus('');
    }
  }

  async function copyResult() {
    const copied = await copyText(result);
    setStatus(copied ? t('common.copied') : t('common.nothingToCopy'));
  }

  function clear() {
    setInput('');
    setResult('');
    setError('');
    setStatus(t('common.cleared'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Developer" description={t('json.desc')} status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="json-input-title">
          <div className="tool-panel__heading"><h2 id="json-input-title">{t('common.input')}</h2><span>JSON</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('json.placeholder')} spellCheck={false} />
          <div className="tool-toolbar">
            <button className="button button--primary" type="button" onClick={() => transform(false)}>{t('json.format')}</button>
            <button className="button" type="button" onClick={() => transform(true)}>{t('json.minify')}</button>
            <button className="button button--quiet" type="button" onClick={clear}>{t('common.clear')}</button>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="json-result-title">
          <div className="tool-panel__heading"><h2 id="json-result-title">{t('common.result')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <pre className={`code-result${result ? '' : ' code-result--empty'}`} aria-live="polite">{result || t('json.resultPlaceholder')}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
