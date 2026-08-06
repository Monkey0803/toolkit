import { useState } from 'react';
import { daysBetween } from '../../lib/toolkit-tools';
import { ToolPageShell } from '../ToolPageShell';

export function DateDifference() {
  const [from, setFrom] = useState('2024-01-01');
  const [to, setTo] = useState('2024-01-31');

  const computed = computeDays(from, to);
  const error = computed === null ? 'Choose two valid dates.' : '';
  const days = computed ?? 0;
  const weeks = Number((Math.abs(days) / 7).toFixed(1));
  const years = Number((Math.abs(days) / 365).toFixed(2));

  return (
    <ToolPageShell title="Date Difference" category="Everyday" description="See the exact distance between two dates or milestones." status={error} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="date-input-title">
          <div className="tool-panel__heading"><h2 id="date-input-title">Dates</h2><span>Two points</span></div>
          <div className="unit-fields">
            <div className="unit-field"><label className="field-label" htmlFor="date-from">From</label><input id="date-from" className="field-input" type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></div>
            <div className="unit-field"><label className="field-label" htmlFor="date-to">To</label><input id="date-to" className="field-input" type="date" value={to} onChange={(event) => setTo(event.target.value)} /></div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="date-result-title">
          <div className="tool-panel__heading"><h2 id="date-result-title">Distance</h2><span>{days < 0 ? 'Past' : 'Future'}</span></div>
          <div className="stat-grid">
            <div className="stat-cell"><span className="stat-value">{Math.abs(days)}</span><span className="stat-label">Days</span></div>
            <div className="stat-cell"><span className="stat-value">{weeks}</span><span className="stat-label">Weeks</span></div>
            <div className="stat-cell"><span className="stat-value">{years}</span><span className="stat-label">Years</span></div>
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}

function computeDays(from: string, to: string): number | null {
  try {
    return daysBetween(from, to);
  } catch {
    return null;
  }
}
