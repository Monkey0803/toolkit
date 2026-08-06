import { useState } from 'react';
import { decodeUrlComponent, encodeUrlComponent } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

type UrlMode = 'encode' | 'decode';

export function UrlEncoder() {
  const { lang, t } = useLanguage();
  const tool = getTool('url-encoder')!;
  const [mode, setMode] = useState<UrlMode>('encode');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function convert() {
    try {
      const output = mode === 'encode' ? encodeUrlComponent(input) : decodeUrlComponent(input);
      setResult(output);
      setError('');
      setStatus(mode === 'encode' ? t('url.encoded') : t('url.decoded'));
    } catch {
      setResult('');
      setError(t('url.invalid'));
      setStatus('');
    }
  }

  async function copyResult() {
    const copied = await copyText(result);
    setStatus(copied ? t('common.copied') : t('common.nothingToCopy'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Convert" description={t('url.desc')} status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-mode-switch" aria-label="URL mode">
        <button className={mode === 'encode' ? 'is-active' : ''} type="button" aria-pressed={mode === 'encode'} onClick={() => setMode('encode')}>{t('b64.encode')}</button>
        <button className={mode === 'decode' ? 'is-active' : ''} type="button" aria-pressed={mode === 'decode'} onClick={() => setMode('decode')}>{t('b64.decode')}</button>
      </div>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="url-input-title">
          <div className="tool-panel__heading"><h2 id="url-input-title">{t('common.input')}</h2><span>{mode === 'encode' ? t('word.text') : t('url.encodedLabel')}</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'encode' ? t('url.placeholderEn') : t('url.placeholderDec')} aria-label={t('common.input')} spellCheck={false} />
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={convert}>{t('common.convert')}</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="url-result-title">
          <div className="tool-panel__heading"><h2 id="url-result-title">{t('common.result')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <textarea className="code-editor" readOnly value={result} placeholder={t('url.resultPlaceholder')} aria-label={t('common.result')} spellCheck={false} />
        </section>
      </div>
    </ToolPageShell>
  );
}
