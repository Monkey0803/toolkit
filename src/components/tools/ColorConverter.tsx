import { useState } from 'react';
import { parseHexColor, type ParsedColor } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function ColorConverter() {
  const [input, setInput] = useState('#6D93B6');
  const [color, setColor] = useState<ParsedColor>(() => parseHexColor('#6D93B6'));
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function updateColor(value: string) {
    setInput(value);
    if (!value.trim()) {
      setError('');
      return;
    }

    try {
      setColor(parseHexColor(value));
      setError('');
    } catch {
      setError('Use a 3 or 6 digit HEX color, such as #6D93B6.');
      setStatus('');
    }
  }

  async function copyValue(value: string, label: string) {
    const copied = await copyText(value);
    setStatus(copied ? `${label} copied to clipboard.` : 'Clipboard is unavailable in this browser.');
  }

  return (
    <ToolPageShell title="Color Converter" category="Image & Color" description="Move between HEX, RGB and HSL color values with a live preview." status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench color-workbench">
        <section className="tool-panel color-input-panel" aria-labelledby="color-input-title">
          <div className="tool-panel__heading"><h2 id="color-input-title">HEX color</h2><span>Live</span></div>
          <label className="field-label" htmlFor="hex-color">Enter a HEX value</label>
          <div className="color-input-row"><span className="color-swatch" style={{ backgroundColor: error ? '#CBD7E2' : color.hex }} aria-hidden="true" /><input id="hex-color" value={input} onChange={(event) => updateColor(event.target.value)} placeholder="#6D93B6" spellCheck={false} /></div>
          <p className="field-hint">Supports shorthand like #F00 and full values like #FF0000.</p>
        </section>
        <section className="tool-panel" aria-labelledby="color-result-title">
          <div className="tool-panel__heading"><h2 id="color-result-title">Values</h2><span>Copy any value</span></div>
          <div className="color-values">
            <ColorValue label="HEX" value={color.hex} onCopy={() => copyValue(color.hex, 'HEX')} />
            <ColorValue label="RGB" value={color.rgb} onCopy={() => copyValue(color.rgb, 'RGB')} />
            <ColorValue label="HSL" value={color.hsl} onCopy={() => copyValue(color.hsl, 'HSL')} />
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}

function ColorValue({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="color-value-row">
      <span>{label}</span>
      <code>{value}</code>
      <button className="text-button" type="button" onClick={onCopy}>Copy</button>
    </div>
  );
}
