import { useState } from 'react';
import { categories, tools, type Tool, type ToolCategory } from './data/tools';
import { filterTools, readSavedToolIds, writeSavedToolIds } from './lib/toolkit';

type ActiveCategory = 'All' | ToolCategory;
type SavedIds = Set<string>;

function getInitialSavedIds(): Set<string> {
  try {
    return readSavedToolIds(window.localStorage);
  } catch {
    return new Set();
  }
}

function saveIds(ids: SavedIds): void {
  try {
    writeSavedToolIds(window.localStorage, ids);
  } catch {
    // Keep the interface usable when browser storage is unavailable.
  }
}

function ToolCard({ tool, isSaved, onToggleSaved }: { tool: Tool; isSaved: boolean; onToggleSaved: (id: string) => void }) {
  return (
    <article className="tool-card">
      <div className="tool-card__topline">
        <span className="tool-icon" aria-hidden="true">{tool.icon}</span>
        <button
          className={`favorite-button${isSaved ? ' favorite-button--saved' : ''}`}
          type="button"
          aria-label={isSaved ? `Remove ${tool.name} from saved tools` : `Save ${tool.name}`}
          aria-pressed={isSaved}
          onClick={() => onToggleSaved(tool.id)}
        >
          <span aria-hidden="true">{isSaved ? '★' : '☆'}</span>
        </button>
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <div className="tool-card__meta">
        <span className="category-label">{tool.category}</span>
        <span className="tool-tags">{tool.tags.slice(0, 2).join(' / ')}</span>
      </div>
    </article>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('All');
  const [savedIds, setSavedIds] = useState<Set<string>>(getInitialSavedIds);
  const visibleTools = filterTools(tools, query, activeCategory);

  function toggleSaved(id: string) {
    setSavedIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }
      saveIds(nextIds);
      return nextIds;
    });
  }

  function clearFilters() {
    setQuery('');
    setActiveCategory('All');
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Toolkit home">
          TOOLKIT<span aria-hidden="true">.</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#tool-directory">Browse tools</a>
          <a href="#about">About</a>
          <span className="saved-count" aria-label={`${savedIds.size} saved tools`}>
            Saved <strong>{String(savedIds.size).padStart(2, '0')}</strong>
          </span>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow"><span aria-hidden="true">/</span> A useful place to start</p>
          <h1 id="page-title">Small tools,<br /><em>big momentum.</em></h1>
          <p className="hero-copy">Useful utilities for the small frictions in your day.</p>
          <div className="search-wrap">
            <label htmlFor="tool-search">Search the collection</label>
            <div className="search-field">
              <span className="search-mark" aria-hidden="true">⌕</span>
              <input
                id="tool-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools by name or category..."
              />
              <kbd>/</kbd>
            </div>
          </div>
        </section>

        <section className="catalog" id="tool-directory" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <div>
              <p className="section-kicker">The collection</p>
              <h2 id="catalog-title">Find your next shortcut.</h2>
            </div>
            <p className="result-summary" aria-live="polite">
              {visibleTools.length} {visibleTools.length === 1 ? 'tool' : 'tools'}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            </p>
          </div>

          <nav className="category-nav" aria-label="Filter tools by category">
            <div className="category-list">
              {categories.map((category) => (
                <button
                  className={`category-button${activeCategory === category ? ' category-button--active' : ''}`}
                  type="button"
                  aria-pressed={activeCategory === category}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                  {category === 'All' && <span className="category-count">{tools.length}</span>}
                </button>
              ))}
            </div>
          </nav>

          {visibleTools.length > 0 ? (
            <div className="tools-grid">
              {visibleTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} isSaved={savedIds.has(tool.id)} onToggleSaved={toggleSaved} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">?</span>
              <h3>No tools match that search.</h3>
              <p>Try another phrase or browse the full collection.</p>
              <button type="button" onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <p id="about"><span aria-hidden="true">TOOLKIT.</span> A small collection for getting unstuck.</p>
        <p>20 tools and counting <span aria-hidden="true">↗</span></p>
      </footer>
    </div>
  );
}

export default App;
