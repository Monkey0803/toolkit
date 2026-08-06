import { useState } from 'react';
import { countWords } from '../../lib/toolkit-tools';
import { ToolPageShell } from '../ToolPageShell';

const SAMPLE = 'Small tools, big momentum.\nUseful utilities for the small frictions in your day.';

export function WordCounter() {
  const [input, setInput] = useState('');
  const stats = countWords(input);

  const items = [
    ['Words', String(stats.words)],
    ['Characters', String(stats.characters)],
    ['No spaces', String(stats.charactersNoSpaces)],
    ['Sentences', String(stats.sentences)],
    ['Reading time', `${stats.readingMinutes} min`],
  ];

  return (
    <ToolPageShell title="Word Counter" category="Text" description="Count words, characters and estimated reading time as you type." status="Live counts update as you type.">
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="word-counter-input-title">
          <div className="tool-panel__heading"><h2 id="word-counter-input-title">Text</h2><span>Live</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={SAMPLE} spellCheck={false} />
        </section>
        <section className="tool-panel" aria-labelledby="word-counter-stats-title">
          <div className="tool-panel__heading"><h2 id="word-counter-stats-title">Stats</h2><span>Instant</span></div>
          <div className="stat-grid">
            {items.map(([label, value]) => (
              <div className="stat-cell" key={label}>
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}
