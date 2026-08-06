import { useState } from 'react';
import { splitTip } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

export function TipCalculator() {
  const { lang, t } = useLanguage();
  const tool = getTool('tip-calculator')!;
  const [bill, setBill] = useState('100');
  const [percent, setPercent] = useState(15);
  const [people, setPeople] = useState('2');
  const perPerson = splitTip(Number(bill) || 0, percent, Number(people) || 1);
  const total = Number(bill) || 0;
  const tip = total * (percent / 100);

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Everyday" description={t('tip.desc')} status={t('tip.status')}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="tip-input-title">
          <div className="tool-panel__heading"><h2 id="tip-input-title">{t('tip.billResult')}</h2><span>¥</span></div>
          <div className="unit-fields">
            <div className="unit-field"><label className="field-label" htmlFor="tip-bill">{t('tip.bill')}</label><input id="tip-bill" className="field-input" type="number" value={bill} onChange={(event) => setBill(event.target.value)} /></div>
            <div className="unit-field"><label className="field-label" htmlFor="tip-percent">{t('tip.tip')}</label><input id="tip-percent" className="field-input" type="range" min={0} max={30} value={percent} onChange={(event) => setPercent(Number(event.target.value))} /><span className="range-value">{percent}%</span></div>
            <div className="unit-field"><label className="field-label" htmlFor="tip-people">{t('tip.people')}</label><input id="tip-people" className="field-input" type="number" min={1} value={people} onChange={(event) => setPeople(event.target.value)} /></div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="tip-result-title">
          <div className="tool-panel__heading"><h2 id="tip-result-title">{t('tip.breakdown')}</h2><span>{t('tip.perPerson')}</span></div>
          <div className="stat-grid">
            <div className="stat-cell"><span className="stat-value">¥{total.toFixed(2)}</span><span className="stat-label">{t('tip.billResult')}</span></div>
            <div className="stat-cell"><span className="stat-value">¥{tip.toFixed(2)}</span><span className="stat-label">{t('tip.tipResult')}</span></div>
            <div className="stat-cell stat-cell--highlight"><span className="stat-value">¥{perPerson.toFixed(2)}</span><span className="stat-label">{t('tip.eachPays')}</span></div>
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}
