import { useState } from 'react';
import { splitTip } from '../../lib/toolkit-tools';
import { ToolPageShell } from '../ToolPageShell';

export function TipCalculator() {
  const [bill, setBill] = useState('100');
  const [percent, setPercent] = useState(15);
  const [people, setPeople] = useState('2');
  const perPerson = splitTip(Number(bill) || 0, percent, Number(people) || 1);
  const total = Number(bill) || 0;
  const tip = total * (percent / 100);

  return (
    <ToolPageShell title="Tip Calculator" category="Everyday" description="Split a bill and calculate a fair tip in seconds." status="Totals update as you change the numbers.">
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="tip-input-title">
          <div className="tool-panel__heading"><h2 id="tip-input-title">Bill</h2><span>Amounts</span></div>
          <div className="unit-fields">
            <div className="unit-field"><label className="field-label" htmlFor="tip-bill">Bill total</label><input id="tip-bill" className="field-input" type="number" value={bill} onChange={(event) => setBill(event.target.value)} /></div>
            <div className="unit-field"><label className="field-label" htmlFor="tip-percent">Tip</label><input id="tip-percent" className="field-input" type="range" min={0} max={30} value={percent} onChange={(event) => setPercent(Number(event.target.value))} /><span className="range-value">{percent}%</span></div>
            <div className="unit-field"><label className="field-label" htmlFor="tip-people">People</label><input id="tip-people" className="field-input" type="number" min={1} value={people} onChange={(event) => setPeople(event.target.value)} /></div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="tip-result-title">
          <div className="tool-panel__heading"><h2 id="tip-result-title">Breakdown</h2><span>Per person</span></div>
          <div className="stat-grid">
            <div className="stat-cell"><span className="stat-value">¥{total.toFixed(2)}</span><span className="stat-label">Bill</span></div>
            <div className="stat-cell"><span className="stat-value">¥{tip.toFixed(2)}</span><span className="stat-label">Tip</span></div>
            <div className="stat-cell stat-cell--highlight"><span className="stat-value">¥{perPerson.toFixed(2)}</span><span className="stat-label">Each pays</span></div>
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}
