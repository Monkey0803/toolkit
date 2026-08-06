import { useState } from 'react';
import { generateUuids } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>(() => generateUuids(1));
  const [status, setStatus] = useState('');

  function regenerate() {
    setUuids(generateUuids(count));
    setStatus('Fresh UUIDs generated.');
  }

  async function copyAll() {
    const copied = await copyText(uuids.join('\n'));
    setStatus(copied ? 'All UUIDs copied to clipboard.' : 'Nothing to copy yet.');
  }

  async function copyOne(value: string) {
    const copied = await copyText(value);
    setStatus(copied ? 'UUID copied to clipboard.' : 'Nothing to copy yet.');
  }

  return (
    <ToolPageShell title="UUID Generator" category="Developer" description="Generate unique IDs for records, mocks and prototypes." status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="uuid-count-title">
          <div className="tool-panel__heading"><h2 id="uuid-count-title">Options</h2><span>Count</span></div>
          <label className="field-label" htmlFor="uuid-count">How many UUIDs?</label>
          <input id="uuid-count" className="field-input" type="number" min={1} max={10} value={count} onChange={(event) => setCount(Math.min(Math.max(Number(event.target.value) || 1, 1), 10))} />
          <div className="tool-toolbar">
            <button className="button button--primary" type="button" onClick={regenerate}>Regenerate</button>
            <button className="button" type="button" onClick={copyAll}>Copy all</button>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="uuid-list-title">
          <div className="tool-panel__heading"><h2 id="uuid-list-title">UUIDs</h2><span>v4</span></div>
          <ul className="uuid-list">
            {uuids.map((value) => (
              <li key={value}><code>{value}</code><button className="text-button" type="button" onClick={() => copyOne(value)}>Copy</button></li>
            ))}
          </ul>
        </section>
      </div>
    </ToolPageShell>
  );
}
