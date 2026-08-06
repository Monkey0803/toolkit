import { useState } from 'react';
import { calculatePercentage } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

type PercentType = 'percent' | 'increase' | 'difference';

export function PercentageCalculator() {
  const [type, setType] = useState<PercentType>('percent');
  const [a, setA] = useState('50');
  const [b, setB] = useState('200');
  const [status, setStatus] = useState('');

  const result = calculatePercentage(type, Number(a) || 0, Number(b) || 0);

  async function copyResult() {
    const copied = await copyText(`${result}`);
    setStatus(copied ? 'Result copied to clipboard.' : 'Nothing to copy yet.');
  }

  const labels: Record<PercentType, { title: string; a: string; b: string }> = {
    percent: { title: 'What percent of B is A?', a: 'Value A', b: 'Value B' },
    increase: { title: 'Increase from A to B?', a: 'Start', b: 'End' },
    difference: { title: 'Difference between A and B?', a: 'Value A', b: 'Value B' },
  };

  return (
    <ToolPageShell title="Percentage Calculator" category="Everyday" description="Work out percentages, increases, decreases and differences." status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="percent-input-title">
          <div className="tool-panel__heading"><h2 id="percent-input-title">Inputs</h2><span>Choose a mode</span></div>
          <div className="case-options" aria-label="Calculation type">
            {(Object.keys(labels) as PercentType[]).map((item) => <button className={type === item ? 'is-active' : ''} type="button" aria-pressed={type === item} key={item} onClick={() => setType(item)}>{item}</button>)}
          </div>
          <p className="field-hint">{labels[type].title}</p>
          <div className="unit-fields">
            <div className="unit-field"><label className="field-label" htmlFor="percent-a">{labels[type].a}</label><input id="percent-a" className="field-input" type="number" value={a} onChange={(event) => setA(event.target.value)} /></div>
            <div className="unit-field"><label className="field-label" htmlFor="percent-b">{labels[type].b}</label><input id="percent-b" className="field-input" type="number" value={b} onChange={(event) => setB(event.target.value)} /></div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="percent-result-title">
          <div className="tool-panel__heading"><h2 id="percent-result-title">Result</h2><button className="text-button" type="button" onClick={copyResult}>Copy result</button></div>
          <div className="unit-result"><span className="unit-result__value">{result}</span></div>
        </section>
      </div>
    </ToolPageShell>
  );
}
