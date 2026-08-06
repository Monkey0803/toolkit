import { useState } from 'react';
import { renderMarkdown } from '../../lib/toolkit-tools';
import { ToolPageShell } from '../ToolPageShell';

const SAMPLE = `# Welcome

A **small** markdown previewer.

- Works offline
- No dependencies
- Keeps your text safe

[Back to collection](#/)`;

export function MarkdownPreviewer() {
  const [input, setInput] = useState('');
  const html = renderMarkdown(input);

  return (
    <ToolPageShell title="Markdown Previewer" category="Text" description="Preview lightweight Markdown with a clean live layout." status="Preview updates as you type.">
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="md-input-title">
          <div className="tool-panel__heading"><h2 id="md-input-title">Markdown</h2><span>Source</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={SAMPLE} spellCheck={false} />
        </section>
        <section className="tool-panel" aria-labelledby="md-preview-title">
          <div className="tool-panel__heading"><h2 id="md-preview-title">Preview</h2><span>Live</span></div>
          <div className="md-preview" dangerouslySetInnerHTML={{ __html: html || '<p class="md-empty">Your preview will appear here.</p>' }} />
        </section>
      </div>
    </ToolPageShell>
  );
}
