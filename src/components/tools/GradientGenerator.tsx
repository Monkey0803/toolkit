import { useState } from 'react';
import { buildGradient, parseHexColor } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function GradientGenerator() {
  const { lang, t } = useLanguage();
  const tool = getTool('gradient-generator')!;
  const [from, setFrom] = useState('#B1D94F');
  const [to, setTo] = useState('#6D93B6');
  const [angle, setAngle] = useState(90);
  const [status, setStatus] = useState('');

  const css = buildGradient(from, to, angle);
  const validFrom = safeHex(from);
  const validTo = safeHex(to);

  async function copyCss() {
    const copied = await copyText(`background: ${css};`);
    setStatus(copied ? t('gradient.copied') : t('gradient.nothing'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Image & Color" description={t('gradient.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel color-input-panel" aria-labelledby="gradient-input-title">
          <div className="tool-panel__heading"><h2 id="gradient-input-title">{t('contrast.colors')}</h2><span>{t('common.live')}</span></div>
          <div className="color-pair">
            <label className="field-label" htmlFor="gradient-from">{t('gradient.from')}</label>
            <input id="gradient-from" className="field-input code-input" value={from} onChange={(event) => setFrom(event.target.value)} placeholder="#B1D94F" spellCheck={false} />
            <label className="field-label" htmlFor="gradient-to">{t('gradient.to')}</label>
            <input id="gradient-to" className="field-input code-input" value={to} onChange={(event) => setTo(event.target.value)} placeholder="#6D93B6" spellCheck={false} />
            <label className="field-label" htmlFor="gradient-angle">{t('gradient.angle')}</label>
            <input id="gradient-angle" className="field-input" type="number" min={0} max={360} value={angle} onChange={(event) => setAngle(Number(event.target.value) || 0)} />
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="gradient-result-title">
          <div className="tool-panel__heading"><h2 id="gradient-result-title">{t('gradient.preview')}</h2><button className="text-button" type="button" onClick={copyCss}>{t('gradient.copyCss')}</button></div>
          <div className="gradient-preview" style={{ background: `linear-gradient(${angle}deg, ${validFrom}, ${validTo})` }} aria-hidden="true" />
          <pre className="code-result">{`background: ${css};`}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}

function safeHex(value: string): string {
  try {
    return parseHexColor(value).hex;
  } catch {
    return '#CBD7E2';
  }
}
