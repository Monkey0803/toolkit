import { useState } from 'react';
import { decodeBase64, encodeBase64 } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

type Base64Mode = 'encode' | 'decode';

export function Base64Encoder() {
  const { lang, t } = useLanguage();
  const tool = getTool('base64-encoder')!;
  const [mode, setMode] = useState<Base64Mode>('encode');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function convert() {
    try {
      setResult(mode === 'encode' ? encodeBase64(input) : decodeBase64(input));
      setError('');
      setStatus(mode === 'encode' ? t('b64.encoded') : t('b64.decoded'));
    } catch {
      setError(t('b64.invalid'));
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
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Convert" description={t('b64.desc')} status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-mode-switch" aria-label="Base64 mode">
        <button className={mode === 'encode' ? 'is-active' : ''} type="button" aria-pressed={mode === 'encode'} onClick={() => { setMode('encode'); setError(''); }}>{t('b64.encode')}</button>
        <button className={mode === 'decode' ? 'is-active' : ''} type="button" aria-pressed={mode === 'decode'} onClick={() => { setMode('decode'); setError(''); }}>{t('b64.decode')}</button>
      </div>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="base64-input-title">
          <div className="tool-panel__heading"><h2 id="base64-input-title">{t('common.input')}</h2><span>{mode === 'encode' ? t('b64.plainText') : t('b64.base64')}</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'encode' ? t('b64.placeholderEn') : t('b64.placeholderDec')} aria-label={t('common.input')} spellCheck={false} />
          <div className="tool-toolbar">
            <button className="button button--primary" type="button" onClick={convert}>{t('common.convert')}</button>
            <button className="button button--quiet" type="button" onClick={clear}>{t('common.clear')}</button>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="base64-result-title">
          <div className="tool-panel__heading"><h2 id="base64-result-title">{t('common.result')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <pre className={`code-result${result ? '' : ' code-result--empty'}`} aria-live="polite">{result || t('b64.resultPlaceholder')}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
