import { useEffect, useRef, useState } from 'react';
import { categories, tools, type Tool, type ToolCategory } from './data/tools';
import { filterTools, readRecentToolIds, readSavedToolIds, recordRecentTool, sortTools, writeSavedToolIds, type SortMode } from './lib/toolkit';
import { getRouteFromHash } from './lib/toolkit-tools';
import { categoryName } from './lib/i18n';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { BmiCalculator } from './components/tools/BmiCalculator';
import { CaseConverter } from './components/tools/CaseConverter';
import { ColorConverter } from './components/tools/ColorConverter';
import { ContrastChecker } from './components/tools/ContrastChecker';
import { DateDifference } from './components/tools/DateDifference';
import { EncodingConverter } from './components/tools/EncodingConverter';
import { GradientGenerator } from './components/tools/GradientGenerator';
import { JsonFormatter } from './components/tools/JsonFormatter';
import { ImageResizer } from './components/tools/ImageResizer';
import { LoremIpsum } from './components/tools/LoremIpsum';
import { MarkdownPreviewer } from './components/tools/MarkdownPreviewer';
import { PasswordGenerator } from './components/tools/PasswordGenerator';
import { PercentageCalculator } from './components/tools/PercentageCalculator';
import { QrCodeMaker } from './components/tools/QrCodeMaker';
import { RegexTester } from './components/tools/RegexTester';
import { TimestampConverter } from './components/tools/TimestampConverter';
import { TipCalculator } from './components/tools/TipCalculator';
import { UuidGenerator } from './components/tools/UuidGenerator';
import { HashGenerator } from './components/tools/HashGenerator';
import { ImageToBase64 } from './components/tools/ImageToBase64';
import { JwtDecoder } from './components/tools/JwtDecoder';
import { LineTools } from './components/tools/LineTools';
import { LoanCalculator } from './components/tools/LoanCalculator';
import { NumberBase } from './components/tools/NumberBase';
import { TextDiff } from './components/tools/TextDiff';
import { UnitConverter } from './components/tools/UnitConverter';
import { WordCounter } from './components/tools/WordCounter';

type ActiveCategory = 'All' | ToolCategory;
type SavedIds = Set<string>;
type DirState = {
  query: string;
  activeCategory: ActiveCategory;
  showSavedOnly: boolean;
  showRecentOnly: boolean;
  sortMode: SortMode;
};

const DIR_STATE_KEY = 'toolkit:dir-state';

function readDirState(): Partial<DirState> {
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(DIR_STATE_KEY) ?? 'null');
    return parsed && typeof parsed === 'object' ? (parsed as Partial<DirState>) : {};
  } catch {
    return {};
  }
}

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
  const { lang } = useLanguage();
  const name = lang === 'zh' ? tool.nameZh ?? tool.name : tool.name;
  const description = lang === 'zh' ? tool.descriptionZh ?? tool.description : tool.description;

  const details = (
    <>
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="tool-card__meta">
        <span className="category-label">{categoryName(lang, tool.category)}</span>
        <span className="tool-tags">{tool.tags.slice(0, 2).join(' / ')}</span>
      </div>
    </>
  );

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
      {tool.route ? <a className="tool-card__link" href={`#/tools/${tool.route}`}>{details}</a> : details}
    </article>
  );
}

function App() {
  const { lang, t, toggleLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const initialDirState = readDirState();
  const [route, setRoute] = useState(() => getRouteFromHash(window.location.hash));
  const [query, setQuery] = useState(initialDirState.query ?? '');
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>(initialDirState.activeCategory ?? 'All');
  const [showSavedOnly, setShowSavedOnly] = useState(initialDirState.showSavedOnly ?? false);
  const [showRecentOnly, setShowRecentOnly] = useState(initialDirState.showRecentOnly ?? false);
  const [sortMode, setSortMode] = useState<SortMode>(initialDirState.sortMode ?? 'default');
  const [savedIds, setSavedIds] = useState<Set<string>>(getInitialSavedIds);
  const [recentIds, setRecentIds] = useState<string[]>(() => readRecentToolIds(window.localStorage));
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoryFiltered = filterTools(tools, query, activeCategory);
  const filtered = showSavedOnly
    ? categoryFiltered.filter((tool) => savedIds.has(tool.id))
    : categoryFiltered;
  const visibleTools = sortTools(showRecentOnly ? filtered.filter((tool) => recentIds.includes(tool.id)) : filtered, sortMode);

  useEffect(() => {
    const state: DirState = { query, activeCategory, showSavedOnly, showRecentOnly, sortMode };
    try {
      window.sessionStorage.setItem(DIR_STATE_KEY, JSON.stringify(state));
    } catch {
      // Directory state persistence is optional.
    }
  }, [query, activeCategory, showSavedOnly, showRecentOnly, sortMode]);

  useEffect(() => {
    document.title = lang === 'zh' ? '工具箱 · 小工具，大能量。' : 'Toolkit. Small tools, big momentum.';
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash(window.location.hash));
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!route.startsWith('tools/')) return;
    const tool = tools.find((item) => item.route === route.slice('tools/'.length));
    if (!tool) return;
    setRecentIds((current) => {
      const next = recordRecentTool(window.localStorage, tool.id);
      return next.length === current.length && next[0] === current[0] ? current : next;
    });
  }, [route]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (event.key === '/' && !isTyping && route === '') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if (event.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setQuery('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [route]);

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
    setShowSavedOnly(false);
    setShowRecentOnly(false);
  }

  function exportSaved() {
    const savedTools = tools
      .filter((tool) => savedIds.has(tool.id))
      .map(({ id, name, nameZh, route }) => ({ id, name, nameZh, route }));
    if (savedTools.length === 0) return;

    const blob = new Blob([JSON.stringify(savedTools, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'toolkit-saved.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  if (route === 'tools/json-formatter') {
    return <JsonFormatter />;
  }

  if (route === 'tools/word-counter') {
    return <WordCounter />;
  }

  if (route === 'tools/case-converter') {
    return <CaseConverter />;
  }

  if (route === 'tools/markdown-previewer') {
    return <MarkdownPreviewer />;
  }

  if (route === 'tools/encoding-converter') {
    return <EncodingConverter />;
  }

  if (route === 'tools/timestamp-converter') {
    return <TimestampConverter />;
  }

  if (route === 'tools/unit-converter') {
    return <UnitConverter />;
  }

  if (route === 'tools/uuid-generator') {
    return <UuidGenerator />;
  }

  if (route === 'tools/regex-tester') {
    return <RegexTester />;
  }

  if (route === 'tools/color-converter') {
    return <ColorConverter />;
  }

  if (route === 'tools/contrast-checker') {
    return <ContrastChecker />;
  }

  if (route === 'tools/gradient-generator') {
    return <GradientGenerator />;
  }

  if (route === 'tools/qr-code-maker') {
    return <QrCodeMaker />;
  }

  if (route === 'tools/image-resizer') {
    return <ImageResizer />;
  }

  if (route === 'tools/password-generator') {
    return <PasswordGenerator />;
  }

  if (route === 'tools/lorem-ipsum') {
    return <LoremIpsum />;
  }

  if (route === 'tools/percentage-calculator') {
    return <PercentageCalculator />;
  }

  if (route === 'tools/tip-calculator') {
    return <TipCalculator />;
  }

  if (route === 'tools/date-difference') {
    return <DateDifference />;
  }

  if (route === 'tools/text-diff') {
    return <TextDiff />;
  }

  if (route === 'tools/line-tools') {
    return <LineTools />;
  }

  if (route === 'tools/image-to-base64') {
    return <ImageToBase64 />;
  }

  if (route === 'tools/jwt-decoder') {
    return <JwtDecoder />;
  }

  if (route === 'tools/hash-generator') {
    return <HashGenerator />;
  }

  if (route === 'tools/number-base') {
    return <NumberBase />;
  }

  if (route === 'tools/loan-calculator') {
    return <LoanCalculator />;
  }

  if (route === 'tools/bmi-calculator') {
    return <BmiCalculator />;
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#tool-directory">{t('a11y.skip')}</a>
      <header className="site-header">
        <a className="brand" href="#/" aria-label="Toolkit home">
          TOOLKIT<span aria-hidden="true">.</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#tool-directory">{t('nav.browse')}</a>
          <a href="#about">{t('nav.about')}</a>
          <span className="saved-count" aria-label={`${savedIds.size} ${t('nav.saved')}`}>
            {t('nav.saved')} <strong>{String(savedIds.size).padStart(2, '0')}</strong>
          </span>
          <button className="lang-toggle" type="button" aria-label={t('lang.label')} onClick={toggleLang}>{t('lang.button')}</button>
          <label className="theme-select" aria-label={t('theme.toggle')}>
            <select value={theme} onChange={(event) => setTheme(event.target.value as 'light' | 'dark' | 'system')}>
              <option value="light">{t('theme.light')}</option>
              <option value="dark">{t('theme.dark')}</option>
              <option value="system">{t('theme.system')}</option>
            </select>
          </label>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow"><span aria-hidden="true">/</span> {t('hero.eyebrow')}</p>
          <h1 id="page-title">{t('hero.title').split('\n').map((line, index) => (
            <span key={line} style={{ display: 'block' }}>{index === 1 ? <em>{line}</em> : line}</span>
          ))}</h1>
          <p className="hero-copy">{t('hero.subtitle')}</p>
          <div className="search-wrap">
            <label htmlFor="tool-search">{t('search.label')}</label>
            <div className="search-field">
              <span className="search-mark" aria-hidden="true">⌕</span>
              <input
                id="tool-search"
                type="search"
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('search.placeholder')}
              />
              <kbd>/</kbd>
            </div>
          </div>
        </section>

        <section className="catalog" id="tool-directory" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <div>
              <p className="section-kicker">{t('section.kicker')}</p>
              <h2 id="catalog-title">{t('section.title')}</h2>
            </div>
            <div className="catalog-tools">
              <label className="sort-control" htmlFor="sort-select">
                <span>{t('sort.label')}</span>
                <select id="sort-select" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                  <option value="default">{t('sort.default')}</option>
                  <option value="name">{t('sort.name')}</option>
                  <option value="category">{t('sort.category')}</option>
                </select>
              </label>
              <button className="text-button" type="button" disabled={savedIds.size === 0} title={savedIds.size === 0 ? t('export.none') : undefined} onClick={exportSaved}>{t('export.saved')}</button>
              <p className="result-summary" aria-live="polite">
                {visibleTools.length} {lang === 'zh' ? '个工具' : (visibleTools.length === 1 ? 'tool' : 'tools')}
                {showSavedOnly ? (lang === 'zh' ? '，已收藏' : ' saved') : ''}
                {showRecentOnly ? (lang === 'zh' ? '，最近使用' : ' recent') : ''}
                {activeCategory !== 'All' ? `${lang === 'zh' ? '，' : ' in '}${categoryName(lang, activeCategory)}` : ''}
              </p>
            </div>
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
                  {categoryName(lang, category)}
                  {category === 'All' && <span className="category-count">{tools.length}</span>}
                </button>
              ))}
              <button
                className={`category-button category-button--saved${showSavedOnly ? ' category-button--active' : ''}`}
                type="button"
                aria-pressed={showSavedOnly}
                onClick={() => setShowSavedOnly((current) => !current)}
              >
                {t('category.saved')}
                <span className="category-count">{savedIds.size}</span>
              </button>
              <button
                className={`category-button category-button--saved${showRecentOnly ? ' category-button--active' : ''}`}
                type="button"
                aria-pressed={showRecentOnly}
                onClick={() => setShowRecentOnly((current) => !current)}
              >
                {t('category.recent')}
                <span className="category-count">{recentIds.length}</span>
              </button>
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
              <span className="empty-icon" aria-hidden="true">{showSavedOnly ? '☆' : showRecentOnly ? '◷' : '?'}</span>
              <h3>{showSavedOnly ? t('empty.savedTitle') : showRecentOnly ? t('empty.recentTitle') : t('empty.searchTitle')}</h3>
              <p>{showSavedOnly ? t('empty.savedBody') : showRecentOnly ? t('empty.recentBody') : t('empty.searchBody')}</p>
              <button type="button" onClick={clearFilters}>{t('empty.clear')}</button>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <p id="about"><span aria-hidden="true">{t('brand')}</span> {t('footer.left')}</p>
        <p>{t('footer.right')} <span aria-hidden="true">↗</span></p>
      </footer>
    </div>
  );
}

export default App;
