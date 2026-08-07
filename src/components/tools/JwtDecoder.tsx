import { useState } from 'react';
import { decodeJwt } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

export function JwtDecoder() {
  const { lang, t } = useLanguage();
  const tool = getTool('jwt-decoder')!;
  const [input, setInput] = useState('');
  const [parts, setParts] = useState<string[] | null>(null);
  const [error, setError] = useState('');

  function decode() {
    try {
      const { header, payload } = decodeJwt(input);
      const pretty = (value: string) => JSON.stringify(JSON.parse(value), null, 2);
      setParts([pretty(header), pretty(payload)]);
      setError('');
    } catch {
      setParts(null);
      setError(t('jwt.invalid'));
    }
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Developer" description={t('jwt.desc')} status={error} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="jwt-input-title">
          <div className="tool-panel__heading"><h2 id="jwt-input-title">{t('common.input')}</h2><span>JWT</span></div>
          <label className="field-label" htmlFor="jwt-input">{t('jwt.inputLabel')}</label>
          <textarea id="jwt-input" className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.sig" aria-label={t('common.input')} spellCheck={false} />
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={decode}>{t('common.decode')}</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="jwt-result-title">
          <div className="tool-panel__heading"><h2 id="jwt-result-title">{t('common.result')}</h2><span>Header · Payload</span></div>
          {parts ? (
            <div className="jwt-parts">
              <div><span className="stat-label">{t('jwt.header')}</span><pre className="code-result">{parts[0]}</pre></div>
              <div><span className="stat-label">{t('jwt.payload')}</span><pre className="code-result">{parts[1]}</pre></div>
            </div>
          ) : <div className="code-result code-result--empty">{t('jwt.placeholder')}</div>}
        </section>
      </div>
    </ToolPageShell>
  );
}