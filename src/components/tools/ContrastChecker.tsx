import { useState } from 'react';
import { contrastRatio, wcagLevel } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function ContrastChecker() {
  const [foreground, setForeground] = useState('#17283A');
  const [background, setBackground] = useState('#FFFFFF');
  const ratio = contrastRatio(foreground, background);
  const level = wcagLevel(ratio);
  const valid = ratio > 0;

  async function copyRatio() {
    const copied = await copyText(`Contrast ratio: ${ratio.toFixed(2)}:1 (WCAG ${level})`);
    setStatus(copied ? 'Ratio copied to clipboard.' : 'Clipboard is unavailable in this browser.');
  }

  const [status, setStatus] = useState('');

  return (
    <ToolPageShell title="Contrast Checker" category="Image & Color" description="Check foreground and background contrast for readable UI." status={status}>
      <div className="tool-workbench color-workbench">
        <section className="tool-panel color-input-panel" aria-labelledby="contrast-input-title">
          <div className="tool-panel__heading"><h2 id="contrast-input-title">Colors</h2><span>Live</span></div>
          <div className="color-pair">
            <label className="field-label" htmlFor="contrast-fg">Foreground</label>
            <input id="contrast-fg" className="field-input code-input" value={foreground} onChange={(event) => setForeground(event.target.value)} placeholder="#17283A" spellCheck={false} />
            <label className="field-label" htmlFor="contrast-bg">Background</label>
            <input id="contrast-bg" className="field-input code-input" value={background} onChange={(event) => setBackground(event.target.value)} placeholder="#FFFFFF" spellCheck={false} />
          </div>
          <div className="contrast-preview" style={{ color: foreground, backgroundColor: background }} aria-hidden="true">Small tools, big momentum.</div>
        </section>
        <section className="tool-panel" aria-labelledby="contrast-result-title">
          <div className="tool-panel__heading"><h2 id="contrast-result-title">Result</h2><button className="text-button" type="button" onClick={copyRatio}>Copy ratio</button></div>
          <div className="contrast-result">
            <span className="unit-result__value">{valid ? ratio.toFixed(2) : '—'}<span className="unit-result__unit">:1</span></span>
            <span className={`contrast-badge contrast-badge--${valid ? level.replace(/\s/g, '-').toLowerCase() : 'fail'}`}>{valid ? `WCAG ${level}` : 'Invalid colors'}</span>
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}
