import { useState } from 'react';
import { contrastRatio, wcagLevel } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function ContrastChecker() {
  const { lang, t } = useLanguage();
  const tool = getTool('contrast-checker')!;
  const [foreground, setForeground] = useState('#17283A');
  const [background, setBackground] = useState('#FFFFFF');
  const [status, setStatus] = useState('');
  const ratio = contrastRatio(foreground, background);
  const level = wcagLevel(ratio);
  const valid = ratio > 0;

  async function copyRatio() {
    const copied = await copyText(`Contrast ratio: ${ratio.toFixed(2)}:1 (WCAG ${level})`);
    setStatus(copied ? t('contrast.ratioCopied') : t('color.clipboardUnavailable'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Image & Color" description={t('contrast.desc')} status={status}>
      <div className="tool-workbench color-workbench">
        <section className="tool-panel color-input-panel" aria-labelledby="contrast-input-title">
          <div className="tool-panel__heading"><h2 id="contrast-input-title">{t('contrast.colors')}</h2><span>{t('common.live')}</span></div>
          <div className="color-pair">
            <label className="field-label" htmlFor="contrast-fg">{t('contrast.foreground')}</label>
            <input id="contrast-fg" className="field-input code-input" value={foreground} onChange={(event) => setForeground(event.target.value)} placeholder="#17283A" spellCheck={false} />
            <label className="field-label" htmlFor="contrast-bg">{t('contrast.background')}</label>
            <input id="contrast-bg" className="field-input code-input" value={background} onChange={(event) => setBackground(event.target.value)} placeholder="#FFFFFF" spellCheck={false} />
          </div>
          <div className="contrast-preview" style={{ color: foreground, backgroundColor: background }} aria-hidden="true">Small tools, big momentum.</div>
        </section>
        <section className="tool-panel" aria-labelledby="contrast-result-title">
          <div className="tool-panel__heading"><h2 id="contrast-result-title">{t('contrast.result')}</h2><button className="text-button" type="button" onClick={copyRatio}>{t('contrast.copyRatio')}</button></div>
          <div className="contrast-result">
            <span className="unit-result__value">{valid ? ratio.toFixed(2) : '—'}<span className="unit-result__unit">:1</span></span>
            <span className={`contrast-badge contrast-badge--${valid ? level.replace(/\s/g, '-').toLowerCase() : 'fail'}`}>{valid ? `WCAG ${level}` : t('contrast.invalid')}</span>
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}
