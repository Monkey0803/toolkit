import type { ReactNode } from 'react';
import { categoryName } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

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
  const { lang, t, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell tool-shell">
      <header className="site-header">
        <a className="brand" href="#/" aria-label="Toolkit home">TOOLKIT<span aria-hidden="true">.</span></a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a className="tool-header-link" href="#/">{t('shell.browseAll')} <span aria-hidden="true">↗</span></a>
          <button className="lang-toggle" type="button" aria-label={t('lang.label')} onClick={toggleLang}>{t('lang.button')}</button>
          <button className="lang-toggle theme-toggle" type="button" aria-label={t('theme.toggle')} onClick={toggleTheme}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span></button>
        </nav>
      </header>

      <main className="tool-page" aria-labelledby="tool-page-title">
        <a className="back-link" href="#/" onClick={onBack}>
          <span aria-hidden="true">←</span> {t('shell.back')}
        </a>
        <section className="tool-intro">
          <p className="eyebrow"><span aria-hidden="true">/</span> {categoryName(lang, category)}</p>
          <h1 id="tool-page-title">{title}</h1>
          <p className="tool-description">{description}</p>
        </section>
        <section className="tool-workspace" aria-label={`${title} ${t('common.input')}`}>
          {children}
        </section>
        <div className={`tool-status tool-status--${statusKind}`} role={statusKind === 'error' ? 'alert' : 'status'} aria-live="polite" aria-atomic="true">
          {status || <span className="tool-status__placeholder" aria-hidden="true">{t('shell.ready')}</span>}
        </div>
      </main>

      <footer className="site-footer">
        <p><span aria-hidden="true">{t('brand')}</span> {t('footer.left')}</p>
        <p>{t('shell.runsLocal')} <span aria-hidden="true">↗</span></p>
      </footer>
    </div>
  );
}
