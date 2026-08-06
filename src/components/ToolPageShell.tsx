import type { ReactNode } from 'react';

type ToolPageShellProps = {
  title: string;
  description: string;
  category: string;
  children: ReactNode;
  status?: string;
  statusKind?: 'neutral' | 'error';
  onBack?: () => void;
};

export async function copyText(value: string): Promise<boolean> {
  if (!value || !navigator.clipboard) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function ToolPageShell({ title, description, category, children, status, statusKind = 'neutral', onBack }: ToolPageShellProps) {
  return (
    <div className="app-shell tool-shell">
      <header className="site-header">
        <a className="brand" href="#/" aria-label="Toolkit home">TOOLKIT<span aria-hidden="true">.</span></a>
        <a className="tool-header-link" href="#/">Browse all tools <span aria-hidden="true">↗</span></a>
      </header>

      <main className="tool-page" aria-labelledby="tool-page-title">
        <a className="back-link" href="#/" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to collection
        </a>
        <section className="tool-intro">
          <p className="eyebrow"><span aria-hidden="true">/</span> {category}</p>
          <h1 id="tool-page-title">{title}</h1>
          <p className="tool-description">{description}</p>
        </section>
        <section className="tool-workspace" aria-label={`${title} workspace`}>
          {children}
        </section>
        <div className={`tool-status tool-status--${statusKind}`} role={statusKind === 'error' ? 'alert' : 'status'} aria-live="polite" aria-atomic="true">
          {status || <span className="tool-status__placeholder" aria-hidden="true">Ready when you are.</span>}
        </div>
      </main>

      <footer className="site-footer">
        <p><span aria-hidden="true">TOOLKIT.</span> A small collection for getting unstuck.</p>
        <p>Runs locally in your browser <span aria-hidden="true">↗</span></p>
      </footer>
    </div>
  );
}
