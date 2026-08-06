import { useState } from 'react';
import { formatJson } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function transform(minify: boolean) {
    try {
      setResult(formatJson(input, minify));
      setError('');
      setStatus(minify ? 'JSON minified.' : 'JSON formatted.');
    } catch {
      setError('That is not valid JSON. Check commas, quotes, and brackets.');
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
    <ToolPageShell title="JSON Formatter" category="Developer" description="Clean, validate and prettify JSON in a readable shape." status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="json-input-title">
          <div className="tool-panel__heading"><h2 id="json-input-title">Input</h2><span>JSON</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={'Paste JSON here...\n\n{"name":"Toolkit"}'} spellCheck={false} />
          <div className="tool-toolbar">
            <button className="button button--primary" type="button" onClick={() => transform(false)}>Format</button>
            <button className="button" type="button" onClick={() => transform(true)}>Minify</button>
            <button className="button button--quiet" type="button" onClick={clear}>Clear</button>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="json-result-title">
          <div className="tool-panel__heading"><h2 id="json-result-title">Result</h2><button className="text-button" type="button" onClick={copyResult}>Copy result</button></div>
          <pre className={`code-result${result ? '' : ' code-result--empty'}`} aria-live="polite">{result || 'Your formatted JSON will appear here.'}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
