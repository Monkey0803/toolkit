// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ToolPageShell } from './ToolPageShell';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';

function renderShell() {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <ToolPageShell title="Word Counter" description="Count words" category="Text">
          <p>workspace</p>
        </ToolPageShell>
      </LanguageProvider>
    </ThemeProvider>,
  );
}

describe('ToolPageShell', () => {
  it('renders the title, back link, and copy-link control', () => {
    renderShell();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Word Counter');
    expect(screen.getByRole('link', { name: /返回工具集/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /复制链接/ })).toBeInTheDocument();
    expect(screen.getByText('workspace')).toBeInTheDocument();
  });

  it('shows the localized category eyebrow', () => {
    renderShell();
    expect(screen.getByText('文本')).toBeInTheDocument();
  });
});
