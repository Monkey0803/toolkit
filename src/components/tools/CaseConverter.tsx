import { useState } from 'react';
import { convertCase, type CaseStyle } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

const STYLES: Array<{ value: CaseStyle; label: string }> = [
  { value: 'title', label: 'Title' },
  { value: 'sentence', label: 'Sentence' },
  { value: 'lower', label: 'Lower' },
  { value: 'upper', label: 'Upper' },
  { value: 'camel', label: 'Camel' },
  { value: 'pascal', label: 'Pascal' },
  { value: 'snake', label: 'Snake' },
  { value: 'kebab', label: 'Kebab' },
];

export function CaseConverter() {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<CaseStyle>('title');
  const [status, setStatus] = useState('');
  const output = convertCase(input, style);

  async function copyResult() {
    const copied = await copyText(output);
    setStatus(copied ? 'Result copied to clipboard.' : 'Nothing to copy yet.');
  }

  return (
    <ToolPageShell title="Case Converter" category="Text" description="Switch text between title, sentence, camel and snake case." status={status}>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="case-input-title">
          <div className="tool-panel__heading"><h2 id="case-input-title">Input</h2><span>Text</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={'hello world'} spellCheck={false} />
        </section>
        <section className="tool-panel" aria-labelledby="case-result-title">
          <div className="tool-panel__heading"><h2 id="case-result-title">Output</h2><button className="text-button" type="button" onClick={copyResult}>Copy result</button></div>
          <div className="case-options" aria-label="Case style">
            {STYLES.map(({ value, label }) => (
              <button className={style === value ? 'is-active' : ''} type="button" aria-pressed={style === value} key={value} onClick={() => setStyle(value)}>{label}</button>
            ))}
          </div>
          <pre className={`code-result${output ? '' : ' code-result--empty'}`} aria-live="polite">{output || 'Your converted text will appear here.'}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
