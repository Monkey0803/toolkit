import { useState } from 'react';
import { calculateBmi } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

export function BmiCalculator() {
  const { lang, t } = useLanguage();
  const tool = getTool('bmi-calculator')!;
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const { bmi, category } = calculateBmi(Number(height) || 0, Number(weight) || 0);
  const categoryLabel = t(`bmi.${category}` as never);

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Everyday" description={t('bmi.desc')} status={t('loan.status')}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="bmi-input-title">
          <div className="tool-panel__heading"><h2 id="bmi-input-title">{t('common.input')}</h2><span>BMI</span></div>
          <div className="unit-fields">
            <div className="unit-field"><label className="field-label" htmlFor="bmi-h">{t('bmi.height')}</label><input id="bmi-h" className="field-input" type="number" value={height} onChange={(event) => setHeight(event.target.value)} /><span className="range-value">cm</span></div>
            <div className="unit-field"><label className="field-label" htmlFor="bmi-w">{t('bmi.weight')}</label><input id="bmi-w" className="field-input" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} /><span className="range-value">kg</span></div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="bmi-result-title">
          <div className="tool-panel__heading"><h2 id="bmi-result-title">{t('common.result')}</h2><span>{t('common.live')}</span></div>
          <div className="unit-result">
            <span className="unit-result__value">{bmi}</span>
            <span className="contrast-badge">{categoryLabel}</span>
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}