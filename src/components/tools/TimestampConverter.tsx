import { useState } from 'react';
import { dateToUnix, unixToDate } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

type TsMode = 'to-date' | 'to-timestamp';

export function TimestampConverter() {
  const { lang, t } = useLanguage();
  const tool = getTool('timestamp-converter')!;
  const [mode, setMode] = useState<TsMode>('to-date');
  const [timestamp, setTimestamp] = useState('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [dateParts, setDateParts] = useState({ year: '2024', month: '1', day: '1', hour: '0', minute: '0' });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function convert() {
    try {
      setResult(mode === 'to-date'
        ? unixToDate(timestamp, unit)
        : JSON.stringify(dateToUnix(Number(dateParts.year), Number(dateParts.month), Number(dateParts.day), Number(dateParts.hour), Number(dateParts.minute)), null, 2));
      setError('');
      setStatus('');
    } catch {
      setResult('');
      setError(mode === 'to-date' ? t('ts.invalidTimestamp') : t('ts.invalidDate'));
      setStatus('');
    }
  }

  async function copyResult() {
    const copied = await copyText(result);
    setStatus(copied ? t('common.copied') : t('common.nothingToCopy'));
  }

  const dateKeys = [
    ['year', t('ts.year')],
    ['month', t('ts.month')],
    ['day', t('ts.day')],
    ['hour', t('ts.hour')],
    ['minute', t('ts.minute')],
  ] as const;

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Convert" description={t('ts.desc')} status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-mode-switch" aria-label="Timestamp mode">
        <button className={mode === 'to-date' ? 'is-active' : ''} type="button" aria-pressed={mode === 'to-date'} onClick={() => setMode('to-date')}>{t('ts.toDate')}</button>
        <button className={mode === 'to-timestamp' ? 'is-active' : ''} type="button" aria-pressed={mode === 'to-timestamp'} onClick={() => setMode('to-timestamp')}>{t('ts.toTimestamp')}</button>
      </div>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="ts-input-title">
          <div className="tool-panel__heading"><h2 id="ts-input-title">{t('common.input')}</h2><span>{mode === 'to-date' ? 'Unix' : t('common.instant')}</span></div>
          {mode === 'to-date' ? (
            <>
              <label className="field-label" htmlFor="ts-value">{t('ts.timestamp')}</label>
              <input id="ts-value" className="field-input" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} placeholder="1704067200" inputMode="numeric" />
              <div className="ts-unit-row" aria-label={t('ts.timestamp')}>
                <button className={unit === 'seconds' ? 'is-active' : ''} type="button" aria-pressed={unit === 'seconds'} onClick={() => setUnit('seconds')}>{t('ts.seconds')}</button>
                <button className={unit === 'milliseconds' ? 'is-active' : ''} type="button" aria-pressed={unit === 'milliseconds'} onClick={() => setUnit('milliseconds')}>{t('ts.milliseconds')}</button>
              </div>
            </>
          ) : (
            <div className="date-input-grid">
              {dateKeys.map(([key, label]) => (
                <label className="field-label date-field" key={key} htmlFor={`ts-${key}`}>
                  {label}
                  <input id={`ts-${key}`} className="field-input" type="number" value={dateParts[key]} onChange={(event) => setDateParts((prev) => ({ ...prev, [key]: event.target.value }))} />
                </label>
              ))}
            </div>
          )}
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={convert}>{t('common.convert')}</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="ts-result-title">
          <div className="tool-panel__heading"><h2 id="ts-result-title">{t('common.result')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <pre className={`code-result${result ? '' : ' code-result--empty'}`} aria-live="polite">{result || t('ts.resultPlaceholder')}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
