import { useState } from 'react';
import { generateUuids } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function UuidGenerator() {
  const { lang, t } = useLanguage();
  const tool = getTool('uuid-generator')!;
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>(() => generateUuids(1));
  const [status, setStatus] = useState('');

  function regenerate() {
    setUuids(generateUuids(count));
    setStatus(t('uuid.fresh'));
  }

  async function copyAll() {
    const copied = await copyText(uuids.join('\n'));
    setStatus(copied ? t('uuid.copiedAll') : t('common.nothingToCopy'));
  }

  async function copyOne(value: string) {
    const copied = await copyText(value);
    setStatus(copied ? t('uuid.copiedOne') : t('common.nothingToCopy'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Developer" description={t('uuid.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="uuid-count-title">
          <div className="tool-panel__heading"><h2 id="uuid-count-title">{t('common.options')}</h2><span>1–10</span></div>
          <label className="field-label" htmlFor="uuid-count">{t('uuid.countLabel')}</label>
          <input id="uuid-count" className="field-input" type="number" min={1} max={10} value={count} onChange={(event) => setCount(Math.min(Math.max(Number(event.target.value) || 1, 1), 10))} />
          <div className="tool-toolbar">
            <button className="button button--primary" type="button" onClick={regenerate}>{t('common.regenerate')}</button>
            <button className="button" type="button" onClick={copyAll}>{t('common.copyAll')}</button>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="uuid-list-title">
          <div className="tool-panel__heading"><h2 id="uuid-list-title">{t('uuid.uuids')}</h2><span>{t('uuid.v4')}</span></div>
          <ul className="uuid-list">
            {uuids.map((value) => (
              <li key={value}><code>{value}</code><button className="text-button" type="button" onClick={() => copyOne(value)}>{t('common.copy')}</button></li>
            ))}
          </ul>
        </section>
      </div>
    </ToolPageShell>
  );
}
