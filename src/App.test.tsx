// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

function renderApp() {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>,
  );
}

function cardCount() {
  return screen.queryAllByRole('article').length;
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState(null, '', '#/');
});

describe('directory', () => {
  it('renders the hero, search, and all 19 tool cards', () => {
    renderApp();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(cardCount()).toBe(19);
  });

  it('filters tools by search query', () => {
    renderApp();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'JSON' } });
    expect(cardCount()).toBe(1);
  });

  it('filters by category capsule', () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: '开发' }));
    const count = cardCount();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(20);
  });

  it('shows only saved tools when the Saved capsule is active', () => {
    renderApp();
    const saveButtons = screen.getAllByRole('button', { name: /^Save / });
    fireEvent.click(saveButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: /已收藏/ }));
    expect(cardCount()).toBe(1);
  });

  it('shows an empty state for an unmatched query', () => {
    renderApp();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzznope' } });
    expect(cardCount()).toBe(0);
    expect(screen.getByText('没有匹配的工具。')).toBeInTheDocument();
  });
});
