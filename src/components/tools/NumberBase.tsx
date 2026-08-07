import { useState } from 'react';
import { convertBase } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

const BASES = [2, 8, 10, 16];

export function NumberBase() {
  const { lang, t } = useLanguage();
  const tool = getTool('number-base')!;
  const [input, setInput] = useState('255');
  const [from, setFrom] = useState(10);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const outputs = BASES.filter((base) => base !== from).map((base) => {
    let value = '';
    let invalid = false;
    try {
      value = convertBase(input, from, base);
    } catch {
      invalid = true;
    }
    return { base, value, invalid };
  });

  async function copyValue(value: string, base: number) {
    const copied = await copyText(value);
    setStatus(`${t('common.copy')} (base ${base}): ${copied ? t('common.copied') : t('common.nothingToCopy')}`);
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Developer" description={t('base.desc')} status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="base-input-title">
          <div className="tool-panel__heading"><h2 id="base-input-title">{t('common.input')}</h2><span>{t('common.live')}</span></div>
          <div className="enc-controls">
            <label className="field-label" htmlFor="base-value">{t('base.value')}</label>
            <input id="base-value" className="field-input code-input" value={input} onChange={(event) => { setInput(event.target.value); setError(''); }} placeholder="255" spellCheck={false} />
            <label className="field-label" htmlFor="base-from">{t('base.from')}</label>
            <select id="base-from" className="field-input" value={from} onChange={(event) => setFrom(Number(event.target.value))}>
              {BASES.map((base) => <option value={base} key={base}>{base}</option>)}
            </select>
          </div>
          {outputs.some((item) => item.invalid) && <p className="field-hint">{t('base.invalid')}</p>}
        </section>
        <section className="tool-panel" aria-labelledby="base-result-title">
          <div className="tool-panel__heading"><h2 id="base-result-title">{t('base.result')}</h2><span>{t('common.instant')}</span></div>
          <div className="color-values">
            {outputs.map(({ base, value, invalid }) => (
              <div className="color-value-row" key={base}>
                <span>base {base}</span>
                <code>{invalid ? '—' : value}</code>
                <button className="text-button" type="button" disabled={invalid} onClick={() => copyValue(value, base)}>{t('common.copy')}</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}