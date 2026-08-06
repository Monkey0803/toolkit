import { useState } from 'react';
import { dateToUnix, unixToDate } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

type TsMode = 'to-date' | 'to-timestamp';

export function TimestampConverter() {
  const [mode, setMode] = useState<TsMode>('to-date');
  const [timestamp, setTimestamp] = useState('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [dateString, setDateString] = useState('');
  const [dateParts, setDateParts] = useState({ year: '2024', month: '1', day: '1', hour: '0', minute: '0' });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function convert() {
    try {
      setResult(mode === 'to-date' ? unixToDate(timestamp, unit) : JSON.stringify(dateToUnix(Number(dateParts.year), Number(dateParts.month), Number(dateParts.day), Number(dateParts.hour), Number(dateParts.minute)), null, 2));
      setError('');
      setStatus(mode === 'to-date' ? 'Timestamp converted.' : 'Date converted.');
    } catch {
      setResult('');
      setError(mode === 'to-date' ? 'Enter a numeric timestamp.' : 'Fill in a complete date and time.');
      setStatus('');
    }
  }

  async function copyResult() {
    const copied = await copyText(result);
    setStatus(copied ? 'Result copied to clipboard.' : 'Nothing to copy yet.');
  }

  return (
    <ToolPageShell title="Timestamp Converter" category="Convert" description="Translate Unix timestamps into readable dates and times, and back." status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-mode-switch" aria-label="Timestamp mode">
        <button className={mode === 'to-date' ? 'is-active' : ''} type="button" aria-pressed={mode === 'to-date'} onClick={() => setMode('to-date')}>Timestamp → Date</button>
        <button className={mode === 'to-timestamp' ? 'is-active' : ''} type="button" aria-pressed={mode === 'to-timestamp'} onClick={() => setMode('to-timestamp')}>Date → Timestamp</button>
      </div>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="ts-input-title">
          <div className="tool-panel__heading"><h2 id="ts-input-title">Input</h2><span>{mode === 'to-date' ? 'Unix' : 'Local time'}</span></div>
          {mode === 'to-date' ? (
            <>
              <label className="field-label" htmlFor="ts-value">Unix timestamp</label>
              <input id="ts-value" className="field-input" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} placeholder="1704067200" inputMode="numeric" />
              <div className="ts-unit-row" aria-label="Timestamp unit">
                <button className={unit === 'seconds' ? 'is-active' : ''} type="button" aria-pressed={unit === 'seconds'} onClick={() => setUnit('seconds')}>Seconds</button>
                <button className={unit === 'milliseconds' ? 'is-active' : ''} type="button" aria-pressed={unit === 'milliseconds'} onClick={() => setUnit('milliseconds')}>Milliseconds</button>
              </div>
            </>
          ) : (
            <div className="date-input-grid">
              {(['year', 'month', 'day', 'hour', 'minute'] as const).map((key) => (
                <label className="field-label date-field" key={key} htmlFor={`ts-${key}`}>
                  {key}
                  <input id={`ts-${key}`} className="field-input" type="number" value={dateParts[key]} onChange={(event) => setDateParts((prev) => ({ ...prev, [key]: event.target.value }))} />
                </label>
              ))}
            </div>
          )}
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={convert}>Convert</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="ts-result-title">
          <div className="tool-panel__heading"><h2 id="ts-result-title">Result</h2><button className="text-button" type="button" onClick={copyResult}>Copy result</button></div>
          <pre className={`code-result${result ? '' : ' code-result--empty'}`} aria-live="polite">{result || 'Your converted value will appear here.'}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
