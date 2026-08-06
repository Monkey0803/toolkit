import { useState } from 'react';
import { convertUnit } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

const UNITS = {
  length: ['m', 'km', 'cm', 'mm', 'mi', 'ft', 'in'],
  weight: ['kg', 'g', 't', 'lb', 'oz'],
  temperature: ['c', 'f', 'k'],
} as const;

type UnitKind = keyof typeof UNITS;
type UnitName = 'm' | 'km' | 'cm' | 'mm' | 'mi' | 'ft' | 'in' | 'kg' | 'g' | 't' | 'lb' | 'oz' | 'c' | 'f' | 'k';

const LABELS_EN: Record<UnitName, string> = {
  m: 'Meters', km: 'Kilometers', cm: 'Centimeters', mm: 'Millimeters', mi: 'Miles', ft: 'Feet', in: 'Inches',
  kg: 'Kilograms', g: 'Grams', t: 'Tonnes', lb: 'Pounds', oz: 'Ounces',
  c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin',
};

const LABELS_ZH: Record<UnitName, string> = {
  m: '米', km: '千米', cm: '厘米', mm: '毫米', mi: '英里', ft: '英尺', in: '英寸',
  kg: '千克', g: '克', t: '吨', lb: '磅', oz: '盎司',
  c: '摄氏度', f: '华氏度', k: '开尔文',
};

export function UnitConverter() {
  const { lang, t } = useLanguage();
  const tool = getTool('unit-converter')!;
  const [kind, setKind] = useState<UnitKind>('length');
  const [from, setFrom] = useState<UnitName>('km');
  const [to, setTo] = useState<UnitName>('m');
  const [value, setValue] = useState('1');
  const [status, setStatus] = useState('');

  const labels = lang === 'zh' ? LABELS_ZH : LABELS_EN;
  const units = UNITS[kind] as readonly UnitName[];
  const result = convertUnit(Number(value) || 0, from, to, kind);

  function selectKind(next: UnitKind) {
    setKind(next);
    setFrom(UNITS[next][0]);
    setTo(UNITS[next][1]);
  }

  async function copyResult() {
    const copied = await copyText(`${value} ${labels[from]} = ${result.toFixed(4)} ${labels[to]}`);
    setStatus(copied ? t('common.copied') : t('common.nothingToCopy'));
  }

  const kinds: Array<[UnitKind, string]> = [
    ['length', t('unit.length')],
    ['weight', t('unit.weight')],
    ['temperature', t('unit.temperature')],
  ];

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Everyday" description={t('unit.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="unit-kind-title">
          <div className="tool-panel__heading"><h2 id="unit-kind-title">{t('unit.category')}</h2><span>{t('unit.choose')}</span></div>
          <div className="case-options" aria-label={t('unit.category')}>
            {kinds.map(([item, label]) => (
              <button className={kind === item ? 'is-active' : ''} type="button" aria-pressed={kind === item} key={item} onClick={() => selectKind(item)}>{label}</button>
            ))}
          </div>
          <div className="unit-fields">
            <div className="unit-field">
              <label className="field-label" htmlFor="unit-value">{t('unit.value')}</label>
              <input id="unit-value" className="field-input" type="number" value={value} onChange={(event) => setValue(event.target.value)} />
            </div>
            <div className="unit-field">
              <label className="field-label" htmlFor="unit-from">{t('unit.from')}</label>
              <select id="unit-from" className="field-input" value={from} onChange={(event) => setFrom(event.target.value as UnitName)}>
                {units.map((unit) => <option value={unit} key={unit}>{labels[unit]}</option>)}
              </select>
            </div>
            <div className="unit-field">
              <label className="field-label" htmlFor="unit-to">{t('unit.to')}</label>
              <select id="unit-to" className="field-input" value={to} onChange={(event) => setTo(event.target.value as UnitName)}>
                {units.map((unit) => <option value={unit} key={unit}>{labels[unit]}</option>)}
              </select>
            </div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="unit-result-title">
          <div className="tool-panel__heading"><h2 id="unit-result-title">{t('unit.result')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <div className="unit-result">
            <span className="unit-result__value">{result.toFixed(4)}</span>
            <span className="unit-result__unit">{labels[to]}</span>
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}
