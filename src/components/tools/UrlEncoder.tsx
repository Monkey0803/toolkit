import { useState } from 'react';
import { decodeUrlComponent, encodeUrlComponent } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

type UrlMode = 'encode' | 'decode';

export function UrlEncoder() {
  const [mode, setMode] = useState<UrlMode>('encode');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function convert() {
    try {
      const output = mode === 'encode' ? encodeUrlComponent(input) : decodeUrlComponent(input);
      setResult(output);
      setError('');
      setStatus(mode === 'encode' ? 'URL encoded.' : 'URL decoded.');
    } catch {
      setResult('');
      setError('That is not valid percent-encoded text.');
      setStatus('');
    }
  }

  async function copyResult() {
    const copied = await copyText(result);
    setStatus(copied ? 'Result copied to clipboard.' : 'Nothing to copy yet.');
  }

  return (
    <ToolPageShell title="URL Encoder" category="Convert" description="Safely encode or decode URL components for the web." status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-mode-switch" aria-label="URL mode">
        <button className={mode === 'encode' ? 'is-active' : ''} type="button" aria-pressed={mode === 'encode'} onClick={() => setMode('encode')}>Encode</button>
        <button className={mode === 'decode' ? 'is-active' : ''} type="button" aria-pressed={mode === 'decode'} onClick={() => setMode('decode')}>Decode</button>
      </div>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="url-input-title">
          <div className="tool-panel__heading"><h2 id="url-input-title">Input</h2><span>{mode === 'encode' ? 'Text' : 'Encoded'}</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'encode' ? 'hello world & more' : 'hello%20world%20%26%20more'} spellCheck={false} />
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={convert}>Convert</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="url-result-title">
          <div className="tool-panel__heading"><h2 id="url-result-title">Result</h2><button className="text-button" type="button" onClick={copyResult}>Copy result</button></div>
          <textarea className="code-editor" readOnly value={result} placeholder="Your converted text will appear here." spellCheck={false} />
        </section>
      </div>
    </ToolPageShell>
  );
}
