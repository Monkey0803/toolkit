import { useState } from 'react';
import { generateLorem } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function LoremIpsum() {
  const { lang, t } = useLanguage();
  const tool = getTool('lorem-ipsum')!;
  const [paragraphs, setParagraphs] = useState(2);
  const [text, setText] = useState(() => generateLorem(2));
  const [status, setStatus] = useState('');

  function generate() {
    setText(generateLorem(paragraphs));
    setStatus(t('lorem.fresh'));
  }

  async function copyTextResult() {
    const copied = await copyText(text);
    setStatus(copied ? t('lorem.copied') : t('common.nothingToCopy'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Generators" description={t('lorem.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="lorem-options-title">
          <div className="tool-panel__heading"><h2 id="lorem-options-title">{t('common.options')}</h2><span>{t('lorem.paragraphs')}</span></div>
          <label className="field-label" htmlFor="lorem-count">{t('lorem.countLabel')}</label>
          <input id="lorem-count" className="field-input" type="number" min={1} max={10} value={paragraphs} onChange={(event) => setParagraphs(Math.min(Math.max(Number(event.target.value) || 1, 1), 10))} />
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={generate}>{t('common.generate')}</button><button className="button" type="button" onClick={copyTextResult}>{t('common.copy')}</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="lorem-result-title">
          <div className="tool-panel__heading"><h2 id="lorem-result-title">{t('lorem.text')}</h2><span>{t('lorem.placeholder')}</span></div>
          <div className="lorem-result" aria-live="polite">{text}</div>
        </section>
      </div>
    </ToolPageShell>
  );
}
