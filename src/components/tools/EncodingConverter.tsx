import { useState } from 'react';
import { convertEncoding, type EncodingDirection, type EncodingType } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function EncodingConverter() {
  const { lang, t } = useLanguage();
  const tool = getTool('encoding-converter')!;
  const [type, setType] = useState<EncodingType>('base64');
  const [direction, setDirection] = useState<EncodingDirection>('encode');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const types: Array<[EncodingType, string]> = [
    ['base64', t('enc.base64')],
    ['base32', t('enc.base32')],
    ['base58', t('enc.base58')],
    ['base16', t('enc.base16')],
    ['url', t('enc.url')],
    ['unicode', t('enc.unicode')],
    ['utf8', t('enc.utf8')],
  ];

  function convert() {
    try {
      setResult(convertEncoding(type, direction, input));
      setError('');
      setStatus(direction === 'encode' ? t('enc.encoded') : t('enc.decoded'));
    } catch {
      setResult('');
      setError(t('enc.invalid'));
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
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Convert" description={t('enc.desc')} status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="enc-input-title">
          <div className="tool-panel__heading"><h2 id="enc-input-title">{t('common.input')}</h2><span>{t('enc.type')}</span></div>
          <div className="enc-controls">
            <label className="field-label" htmlFor="enc-type">{t('enc.type')}</label>
            <select id="enc-type" className="field-input" value={type} onChange={(event) => setType(event.target.value as EncodingType)}>
              {types.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
            <div className="tool-mode-switch" aria-label={t('enc.type')}>
              <button className={direction === 'encode' ? 'is-active' : ''} type="button" aria-pressed={direction === 'encode'} onClick={() => setDirection('encode')}>{t('enc.encode')}</button>
              <button className={direction === 'decode' ? 'is-active' : ''} type="button" aria-pressed={direction === 'decode'} onClick={() => setDirection('decode')}>{t('enc.decode')}</button>
            </div>
          </div>
          <label className="field-label" htmlFor="enc-input">{direction === 'encode' ? t('enc.inputEncode') : t('enc.inputDecode')}</label>
          <textarea id="enc-input" className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('enc.placeholder')} aria-label={t('common.input')} spellCheck={false} />
          {type === 'utf8' && direction === 'decode' && <p className="field-hint">{t('enc.hintUtf8')}</p>}
          {type === 'base16' && direction === 'decode' && <p className="field-hint">{t('enc.hintHex')}</p>}
          <div className="tool-toolbar">
            <button className="button button--primary" type="button" onClick={convert}>{t('common.convert')}</button>
            <button className="button button--quiet" type="button" onClick={clear}>{t('common.clear')}</button>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="enc-result-title">
          <div className="tool-panel__heading"><h2 id="enc-result-title">{t('common.result')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <pre className={`code-result${result ? '' : ' code-result--empty'}`} aria-live="polite">{result || t('enc.resultPlaceholder')}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}