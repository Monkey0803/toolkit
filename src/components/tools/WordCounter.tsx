import { useState } from 'react';
import { countWords } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

const SAMPLE_EN = 'Small tools, big momentum.\nUseful utilities for the small frictions in your day.';
const SAMPLE_ZH = '小工具，大能量。\n应对日常琐事的有用小工具。';

export function WordCounter() {
  const { lang, t } = useLanguage();
  const tool = getTool('word-counter')!;
  const [input, setInput] = useState('');
  const stats = countWords(input);

  const items = [
    [t('word.words'), String(stats.words)],
    [t('word.characters'), String(stats.characters)],
    [t('word.noSpaces'), String(stats.charactersNoSpaces)],
    [t('word.sentences'), String(stats.sentences)],
    [t('word.reading'), `${stats.readingMinutes} ${t('word.minutes')}`],
  ];

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Text" description={t('word.desc')} status={t('word.status')}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="word-counter-input-title">
          <div className="tool-panel__heading"><h2 id="word-counter-input-title">{t('word.text')}</h2><span>{t('common.live')}</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={lang === 'zh' ? SAMPLE_ZH : SAMPLE_EN} spellCheck={false} />
        </section>
        <section className="tool-panel" aria-labelledby="word-counter-stats-title">
          <div className="tool-panel__heading"><h2 id="word-counter-stats-title">{t('word.stats')}</h2><span>{t('common.instant')}</span></div>
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
