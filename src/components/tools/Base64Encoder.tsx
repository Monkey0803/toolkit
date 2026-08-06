import { useState } from 'react';
import { decodeBase64, encodeBase64 } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

type Base64Mode = 'encode' | 'decode';

export function Base64Encoder() {
  const [mode, setMode] = useState<Base64Mode>('encode');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function convert() {
    try {
      setResult(mode === 'encode' ? encodeBase64(input) : decodeBase64(input));
      setError('');
      setStatus(mode === 'encode' ? 'Text encoded.' : 'Base64 decoded.');
    } catch {
      setError('That is not valid Base64. Check the input and try again.');
      setStatus('');
    }
  }

  async function copyResult() {
    const copied = await copyText(result);
    setStatus(copied ? 'Result copied to clipboard.' : 'Nothing to copy yet.');
  }

  function clear() {
    setInput('');
    setResult('');
    setError('');
    setStatus('Workspace cleared.');
  }

  return (
    <ToolPageShell title="Base64 Encoder" category="Convert" description="Encode or decode text and small payloads in Base64 without leaving your browser." status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-mode-switch" aria-label="Base64 mode">
        <button className={mode === 'encode' ? 'is-active' : ''} type="button" aria-pressed={mode === 'encode'} onClick={() => { setMode('encode'); setError(''); }}>Encode</button>
        <button className={mode === 'decode' ? 'is-active' : ''} type="button" aria-pressed={mode === 'decode'} onClick={() => { setMode('decode'); setError(''); }}>Decode</button>
      </div>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="base64-input-title">
          <div className="tool-panel__heading"><h2 id="base64-input-title">Input</h2><span>{mode === 'encode' ? 'Plain text' : 'Base64'}</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'encode' ? 'Type or paste text here...' : 'Paste Base64 here...'} spellCheck={false} />
          <div className="tool-toolbar">
            <button className="button button--primary" type="button" onClick={convert}>Convert</button>
            <button className="button button--quiet" type="button" onClick={clear}>Clear</button>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="base64-result-title">
          <div className="tool-panel__heading"><h2 id="base64-result-title">Result</h2><button className="text-button" type="button" onClick={copyResult}>Copy result</button></div>
          <pre className={`code-result${result ? '' : ' code-result--empty'}`} aria-live="polite">{result || 'Your converted text will appear here.'}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
