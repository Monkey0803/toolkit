import { useState } from 'react';
import { hashText } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

type HashAlgo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export function HashGenerator() {
  const { lang, t } = useLanguage();
  const tool = getTool('hash-generator')!;
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgo>('SHA-256');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');

  async function generate() {
    try {
      const digest = await hashText(algorithm, input);
      setResult(digest);
      setStatus(`${algorithm} · ${digest.length / 2} bytes`);
    } catch {
      setStatus(t('hash.error'));
    }
  }

  async function copyResult() {
    const copied = await copyText(result);
    setStatus(copied ? t('common.copied') : t('common.nothingToCopy'));
  }

  const algorithms: Array<[HashAlgo, string]> = [
    ['SHA-1', 'SHA-1'],
    ['SHA-256', 'SHA-256'],
    ['SHA-384', 'SHA-384'],
    ['SHA-512', 'SHA-512'],
  ];

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Developer" description={t('hash.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="hash-input-title">
          <div className="tool-panel__heading"><h2 id="hash-input-title">{t('common.input')}</h2><span>{t('hash.algo')}</span></div>
          <label className="field-label" htmlFor="hash-input">{t('hash.input')}</label>
          <textarea id="hash-input" className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder="text to hash" aria-label={t('hash.input')} spellCheck={false} />
          <label className="field-label" htmlFor="hash-algo">{t('hash.algo')}</label>
          <select id="hash-algo" className="field-input" value={algorithm} onChange={(event) => setAlgorithm(event.target.value as HashAlgo)}>
            {algorithms.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={generate}>{t('hash.hash')}</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="hash-result-title">
          <div className="tool-panel__heading"><h2 id="hash-result-title">{t('common.result')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <pre className={`code-result hash-result${result ? '' : ' code-result--empty'}`} aria-live="polite">{result || t('hash.result')}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}