import { useState } from 'react';
import { parseHexColor, type ParsedColor } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function ColorConverter() {
  const { lang, t } = useLanguage();
  const tool = getTool('color-converter')!;
  const [input, setInput] = useState('#6D93B6');
  const [color, setColor] = useState<ParsedColor>(() => parseHexColor('#6D93B6'));
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function updateColor(value: string) {
    setInput(value);
    if (!value.trim()) {
      setError('');
      return;
    }

    try {
      setColor(parseHexColor(value));
      setError('');
    } catch {
      setError(t('color.invalid'));
      setStatus('');
    }
  }

  async function copyValue(value: string, label: string) {
    const copied = await copyText(value);
    setStatus(copied ? `${label} ${t('color.copied')}` : t('color.clipboardUnavailable'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Image & Color" description={t('color.desc')} status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench color-workbench">
        <section className="tool-panel color-input-panel" aria-labelledby="color-input-title">
          <div className="tool-panel__heading"><h2 id="color-input-title">{t('color.hex')}</h2><span>{t('common.live')}</span></div>
          <label className="field-label" htmlFor="hex-color">{t('color.enterHex')}</label>
          <div className="color-input-row"><span className="color-swatch" style={{ backgroundColor: error ? '#CBD7E2' : color.hex }} aria-hidden="true" /><input id="hex-color" value={input} onChange={(event) => updateColor(event.target.value)} placeholder="#6D93B6" spellCheck={false} /></div>
          <p className="field-hint">{t('color.hint')}</p>
        </section>
        <section className="tool-panel" aria-labelledby="color-result-title">
          <div className="tool-panel__heading"><h2 id="color-result-title">{t('color.values')}</h2><span>{t('color.copyAny')}</span></div>
          <div className="color-values">
            <ColorValue label="HEX" value={color.hex} copyLabel={t('common.copy')} onCopy={() => copyValue(color.hex, 'HEX')} />
            <ColorValue label="RGB" value={color.rgb} copyLabel={t('common.copy')} onCopy={() => copyValue(color.rgb, 'RGB')} />
            <ColorValue label="HSL" value={color.hsl} copyLabel={t('common.copy')} onCopy={() => copyValue(color.hsl, 'HSL')} />
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}

function ColorValue({ label, value, copyLabel, onCopy }: { label: string; value: string; copyLabel: string; onCopy: () => void }) {
  return (
    <div className="color-value-row">
      <span>{label}</span>
      <code>{value}</code>
      <button className="text-button" type="button" onClick={onCopy}>{copyLabel}</button>
    </div>
  );
}
