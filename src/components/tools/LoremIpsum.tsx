import { useState } from 'react';
import { generateLorem } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(2);
  const [text, setText] = useState(() => generateLorem(2));
  const [status, setStatus] = useState('');

  function generate() {
    setText(generateLorem(paragraphs));
    setStatus('Fresh placeholder text generated.');
  }

  async function copyTextResult() {
    const copied = await copyText(text);
    setStatus(copied ? 'Placeholder text copied to clipboard.' : 'Nothing to copy yet.');
  }

  return (
    <ToolPageShell title="Lorem Ipsum" category="Generators" description="Generate placeholder copy for layouts and early prototypes." status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="lorem-options-title">
          <div className="tool-panel__heading"><h2 id="lorem-options-title">Options</h2><span>Paragraphs</span></div>
          <label className="field-label" htmlFor="lorem-count">How many paragraphs?</label>
          <input id="lorem-count" className="field-input" type="number" min={1} max={10} value={paragraphs} onChange={(event) => setParagraphs(Math.min(Math.max(Number(event.target.value) || 1, 1), 10))} />
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={generate}>Generate</button><button className="button" type="button" onClick={copyTextResult}>Copy</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="lorem-result-title">
          <div className="tool-panel__heading"><h2 id="lorem-result-title">Text</h2><span>Placeholder</span></div>
          <div className="lorem-result" aria-live="polite">{text}</div>
        </section>
      </div>
    </ToolPageShell>
  );
}
