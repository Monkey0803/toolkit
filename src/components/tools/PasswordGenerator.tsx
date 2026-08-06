import { useState } from 'react';
import { generatePassword } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ lower: true, upper: true, digits: true, symbols: false });
  const [password, setPassword] = useState(() => generatePassword(16, { lower: true, upper: true, digits: true, symbols: false }));
  const [status, setStatus] = useState('');

  function toggle(key: keyof typeof options) {
    const next = { ...options, [key]: !options[key] };
    if (Object.values(next).every((value) => !value)) return;
    setOptions(next);
  }

  function regenerate() {
    setPassword(generatePassword(length, options));
    setStatus('Fresh password generated.');
  }

  async function copyPassword() {
    const copied = await copyText(password);
    setStatus(copied ? 'Password copied to clipboard.' : 'Nothing to copy yet.');
  }

  return (
    <ToolPageShell title="Password Generator" category="Generators" description="Create strong random passwords with custom length." status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="password-options-title">
          <div className="tool-panel__heading"><h2 id="password-options-title">Options</h2><span>Length & sets</span></div>
          <div className="unit-fields">
            <div className="unit-field"><label className="field-label" htmlFor="password-length">Length</label><input id="password-length" className="field-input" type="number" min={8} max={64} value={length} onChange={(event) => setLength(Math.min(Math.max(Number(event.target.value) || 8, 8), 64))} /></div>
          </div>
          <div className="check-group">
            {(Object.keys(options) as Array<keyof typeof options>).map((key) => (
              <label className="check-label" key={key}>
                <input type="checkbox" checked={options[key]} onChange={() => toggle(key)} />
                <span>{key}</span>
              </label>
            ))}
          </div>
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={regenerate}>Regenerate</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="password-result-title">
          <div className="tool-panel__heading"><h2 id="password-result-title">Password</h2><button className="text-button" type="button" onClick={copyPassword}>Copy</button></div>
          <pre className="code-result password-result" aria-live="polite">{password}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
