import { useState } from 'react';
import { generatePassword } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function PasswordGenerator() {
  const { lang, t } = useLanguage();
  const tool = getTool('password-generator')!;
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ lower: true, upper: true, digits: true, symbols: false });
  const [password, setPassword] = useState(() => generatePassword(16, { lower: true, upper: true, digits: true, symbols: false }));
  const [status, setStatus] = useState('');

  function toggle(key: keyof typeof options) {
    const next = { ...options, [key]: !options[key] };
    if (Object.values(next).every((value) => !value)) return;
    setOptions(next);
  }

  function regenerate() {
    setPassword(generatePassword(length, options));
    setStatus(t('pwd.fresh'));
  }

  async function copyPassword() {
    const copied = await copyText(password);
    setStatus(copied ? t('pwd.copied') : t('common.nothingToCopy'));
  }

  const optionKeys: Array<[keyof typeof options, string]> = [
    ['lower', t('pwd.lower')],
    ['upper', t('pwd.upper')],
    ['digits', t('pwd.digits')],
    ['symbols', t('pwd.symbols')],
  ];

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Generators" description={t('pwd.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="password-options-title">
          <div className="tool-panel__heading"><h2 id="password-options-title">{t('common.options')}</h2><span>{t('pwd.lengthLabel')}</span></div>
          <div className="unit-fields">
            <div className="unit-field"><label className="field-label" htmlFor="password-length">{t('pwd.length')}</label><input id="password-length" className="field-input" type="number" min={8} max={64} value={length} onChange={(event) => setLength(Math.min(Math.max(Number(event.target.value) || 8, 8), 64))} /></div>
          </div>
          <div className="check-group">
            {optionKeys.map(([key, label]) => (
              <label className="check-label" key={key}>
                <input type="checkbox" checked={options[key]} onChange={() => toggle(key)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={regenerate}>{t('common.regenerate')}</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="password-result-title">
          <div className="tool-panel__heading"><h2 id="password-result-title">{t('pwd.password')}</h2><button className="text-button" type="button" onClick={copyPassword}>{t('common.copy')}</button></div>
          <pre className="code-result password-result" aria-live="polite">{password}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
