import { useState } from 'react';
import { calculatePercentage } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

type PercentType = 'percent' | 'increase' | 'difference';

export function PercentageCalculator() {
  const { lang, t } = useLanguage();
  const tool = getTool('percentage-calculator')!;
  const [type, setType] = useState<PercentType>('percent');
  const [a, setA] = useState('50');
  const [b, setB] = useState('200');
  const [status, setStatus] = useState('');

  const result = calculatePercentage(type, Number(a) || 0, Number(b) || 0);

  async function copyResult() {
    const copied = await copyText(`${result}`);
    setStatus(copied ? t('common.copied') : t('common.nothingToCopy'));
  }

  const types: Array<[PercentType, string, string, string]> = [
    ['percent', t('percent.percent'), t('percent.percentTitle'), t('percent.valueA')],
    ['increase', t('percent.increase'), t('percent.increaseTitle'), t('percent.start')],
    ['difference', t('percent.difference'), t('percent.differenceTitle'), t('percent.valueA')],
  ];
  const active = types.find(([value]) => value === type)!;

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Everyday" description={t('percent.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="percent-input-title">
          <div className="tool-panel__heading"><h2 id="percent-input-title">{t('percent.inputs')}</h2><span>{t('unit.choose')}</span></div>
          <div className="case-options" aria-label={t('percent.inputs')}>
            {types.map(([value, label]) => <button className={type === value ? 'is-active' : ''} type="button" aria-pressed={type === value} key={value} onClick={() => setType(value)}>{label}</button>)}
          </div>
          <p className="field-hint">{active[2]}</p>
          <div className="unit-fields">
            <div className="unit-field"><label className="field-label" htmlFor="percent-a">{active[3]}</label><input id="percent-a" className="field-input" type="number" value={a} onChange={(event) => setA(event.target.value)} /></div>
            <div className="unit-field"><label className="field-label" htmlFor="percent-b">{type === 'increase' ? t('percent.end') : t('percent.valueB')}</label><input id="percent-b" className="field-input" type="number" value={b} onChange={(event) => setB(event.target.value)} /></div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="percent-result-title">
          <div className="tool-panel__heading"><h2 id="percent-result-title">{t('percent.result')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <div className="unit-result"><span className="unit-result__value">{result}</span></div>
        </section>
      </div>
    </ToolPageShell>
  );
}
