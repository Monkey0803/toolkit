import { useState } from 'react';
import { buildGradient, parseHexColor } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function GradientGenerator() {
  const [from, setFrom] = useState('#B1D94F');
  const [to, setTo] = useState('#6D93B6');
  const [angle, setAngle] = useState(90);
  const [status, setStatus] = useState('');

  const css = buildGradient(from, to, angle);
  const validFrom = safeHex(from);
  const validTo = safeHex(to);

  async function copyCss() {
    const copied = await copyText(`background: ${css};`);
    setStatus(copied ? 'Gradient CSS copied to clipboard.' : 'Nothing to copy yet.');
  }

  return (
    <ToolPageShell title="Gradient Generator" category="Image & Color" description="Build simple CSS gradients with balanced color stops." status={status}>
      <div className="tool-workbench">
        <section className="tool-panel color-input-panel" aria-labelledby="gradient-input-title">
          <div className="tool-panel__heading"><h2 id="gradient-input-title">Colors</h2><span>Live</span></div>
          <div className="color-pair">
            <label className="field-label" htmlFor="gradient-from">From</label>
            <input id="gradient-from" className="field-input code-input" value={from} onChange={(event) => setFrom(event.target.value)} placeholder="#B1D94F" spellCheck={false} />
            <label className="field-label" htmlFor="gradient-to">To</label>
            <input id="gradient-to" className="field-input code-input" value={to} onChange={(event) => setTo(event.target.value)} placeholder="#6D93B6" spellCheck={false} />
            <label className="field-label" htmlFor="gradient-angle">Angle</label>
            <input id="gradient-angle" className="field-input" type="number" min={0} max={360} value={angle} onChange={(event) => setAngle(Number(event.target.value) || 0)} />
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="gradient-result-title">
          <div className="tool-panel__heading"><h2 id="gradient-result-title">Preview</h2><button className="text-button" type="button" onClick={copyCss}>Copy CSS</button></div>
          <div className="gradient-preview" style={{ background: `linear-gradient(${angle}deg, ${validFrom}, ${validTo})` }} aria-hidden="true" />
          <pre className="code-result">{`background: ${css};`}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}

function safeHex(value: string): string {
  try {
    return parseHexColor(value).hex;
  } catch {
    return '#CBD7E2';
  }
}
