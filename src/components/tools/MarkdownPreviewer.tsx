import { useState } from 'react';
import { renderMarkdown } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

const SAMPLE_EN = `# Welcome

A **small** markdown previewer.

- Works offline
- No dependencies
- Keeps your text safe

[Back to collection](#/)`;

const SAMPLE_ZH = `# 欢迎

一个**轻量** Markdown 预览器。

- 完全离线可用
- 无依赖
- 保证文本安全

[返回工具集](#/)`;

export function MarkdownPreviewer() {
  const { lang, t } = useLanguage();
  const tool = getTool('markdown-previewer')!;
  const [input, setInput] = useState('');
  const html = renderMarkdown(input);

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Text" description={t('md.desc')} status={t('md.status')}>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="md-input-title">
          <div className="tool-panel__heading"><h2 id="md-input-title">{t('md.markdown')}</h2><span>{t('md.source')}</span></div>
          <textarea className="code-editor" value={input} onChange={(event) => setInput(event.target.value)} placeholder={lang === 'zh' ? SAMPLE_ZH : SAMPLE_EN} spellCheck={false} />
        </section>
        <section className="tool-panel" aria-labelledby="md-preview-title">
          <div className="tool-panel__heading"><h2 id="md-preview-title">{t('common.preview')}</h2><span>{t('common.live')}</span></div>
          <div className="md-preview" dangerouslySetInnerHTML={{ __html: html || `<p class="md-empty">${t('md.previewPlaceholder')}</p>` }} />
        </section>
      </div>
    </ToolPageShell>
  );
}
