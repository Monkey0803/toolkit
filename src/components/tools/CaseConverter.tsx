import { useState } from 'react';
import { convertCase, type CaseStyle } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

const STYLES: Array<{ value: CaseStyle; labelKey: 'case.title' | 'case.sentence' | 'case.lower' | 'case.upper' | 'case.camel' | 'case.pascal' | 'case.snake' | 'case.kebab' }> = [
  { value: 'title', labelKey: 'case.title' },
  { value: 'sentence', labelKey: 'case.sentence' },
  { value: 'lower', labelKey: 'case.lower' },
  { value: 'upper', labelKey: 'case.upper' },
  { value: 'camel', labelKey: 'case.camel' },
  { value: 'pascal', labelKey: 'case.pascal' },
  { value: 'snake', labelKey: 'case.snake' },
  { value: 'kebab', labelKey: 'case.kebab' },
];

export function CaseConverter() {
  const { lang, t } = useLanguage();
  const tool = getTool('case-converter')!;
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<CaseStyle>('title');
  const [status, setStatus] = useState('');
  const output = convertCase(input, style);

  async function copyResult() {
    const copied = await copyText(output);
    setStatus(copied ? t('common.copied') : t('common.nothingToCopy'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Text" description={t('case.desc')} status={status}>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="case-input-title">
          <div className="tool-panel__heading"><h2 id="case-input-title">{t('common.input')}</h2><span>{t('word.text')}</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={'hello world'} spellCheck={false} />
        </section>
        <section className="tool-panel" aria-labelledby="case-result-title">
          <div className="tool-panel__heading"><h2 id="case-result-title">{t('common.output')}</h2><button className="text-button" type="button" onClick={copyResult}>{t('common.copyResult')}</button></div>
          <div className="case-options" aria-label={t('case.title')}>
            {STYLES.map(({ value, labelKey }) => (
              <button className={style === value ? 'is-active' : ''} type="button" aria-pressed={style === value} key={value} onClick={() => setStyle(value)}>{t(labelKey)}</button>
            ))}
          </div>
          <pre className={`code-result${output ? '' : ' code-result--empty'}`} aria-live="polite">{output || t('case.resultPlaceholder')}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}
