import { useState } from 'react';
import { convertUnit } from '../../lib/toolkit-tools';
import { copyText, ToolPageShell } from '../ToolPageShell';

const UNITS = {
  length: ['m', 'km', 'cm', 'mm', 'mi', 'ft', 'in'],
  weight: ['kg', 'g', 't', 'lb', 'oz'],
  temperature: ['c', 'f', 'k'],
} as const;

type UnitKind = keyof typeof UNITS;
type UnitName = 'm' | 'km' | 'cm' | 'mm' | 'mi' | 'ft' | 'in' | 'kg' | 'g' | 't' | 'lb' | 'oz' | 'c' | 'f' | 'k';

const LABELS: Record<UnitName, string> = {
  m: 'Meters', km: 'Kilometers', cm: 'Centimeters', mm: 'Millimeters', mi: 'Miles', ft: 'Feet', in: 'Inches',
  kg: 'Kilograms', g: 'Grams', t: 'Tonnes', lb: 'Pounds', oz: 'Ounces',
  c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin',
};

export function UnitConverter() {
  const [kind, setKind] = useState<UnitKind>('length');
  const [from, setFrom] = useState<UnitName>('km');
  const [to, setTo] = useState<UnitName>('m');
  const [value, setValue] = useState('1');
  const [status, setStatus] = useState('');

  const units = UNITS[kind] as readonly UnitName[];
  const result = convertUnit(Number(value) || 0, from, to, kind);

  function selectKind(next: UnitKind) {
    setKind(next);
    setFrom(UNITS[next][0]);
    setTo(UNITS[next][1]);
  }

  async function copyResult() {
    const copied = await copyText(`${value} ${from} = ${result.toFixed(4)} ${to}`);
    setStatus(copied ? 'Result copied to clipboard.' : 'Nothing to copy yet.');
  }

  return (
    <ToolPageShell title="Unit Converter" category="Everyday" description="Convert length, weight and temperature at a glance." status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="unit-kind-title">
          <div className="tool-panel__heading"><h2 id="unit-kind-title">Category</h2><span>Choose</span></div>
          <div className="case-options" aria-label="Unit category">
            {(Object.keys(UNITS) as UnitKind[]).map((item) => (
              <button className={kind === item ? 'is-active' : ''} type="button" aria-pressed={kind === item} key={item} onClick={() => selectKind(item)}>{item}</button>
            ))}
          </div>
          <div className="unit-fields">
            <div className="unit-field">
              <label className="field-label" htmlFor="unit-value">Value</label>
              <input id="unit-value" className="field-input" type="number" value={value} onChange={(event) => setValue(event.target.value)} />
            </div>
            <div className="unit-field">
              <label className="field-label" htmlFor="unit-from">From</label>
              <select id="unit-from" className="field-input" value={from} onChange={(event) => setFrom(event.target.value as UnitName)}>
                {units.map((unit) => <option value={unit} key={unit}>{LABELS[unit]}</option>)}
              </select>
            </div>
            <div className="unit-field">
              <label className="field-label" htmlFor="unit-to">To</label>
              <select id="unit-to" className="field-input" value={to} onChange={(event) => setTo(event.target.value as UnitName)}>
                {units.map((unit) => <option value={unit} key={unit}>{LABELS[unit]}</option>)}
              </select>
            </div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="unit-result-title">
          <div className="tool-panel__heading"><h2 id="unit-result-title">Result</h2><button className="text-button" type="button" onClick={copyResult}>Copy result</button></div>
          <div className="unit-result">
            <span className="unit-result__value">{result.toFixed(4)}</span>
            <span className="unit-result__unit">{LABELS[to]}</span>
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}
