import { useRef, useState } from 'react';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { copyText, ToolPageShell } from '../ToolPageShell';

export function ImageToBase64() {
  const { lang, t } = useLanguage();
  const tool = getTool('image-to-base64')!;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [status, setStatus] = useState('');
  const base64 = dataUrl.split(',')[1] ?? '';

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus(t('img.notImage'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setFileName(file.name);
      setDataUrl(url);
      setStatus(`${file.name} · ${(file.size / 1024).toFixed(1)} KB`);
    };
    reader.readAsDataURL(file);
  }

  async function copyBase64() {
    const copied = await copyText(base64);
    setStatus(copied ? t('img64.copied') : t('common.nothingToCopy'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Convert" description={t('img64.desc')} status={status}>
      <div className="tool-workbench">
        <section className="tool-panel color-input-panel" aria-labelledby="img64-upload-title">
          <div className="tool-panel__heading"><h2 id="img64-upload-title">{t('img64.upload')}</h2><span>data URI</span></div>
          <input ref={fileInputRef} className="visually-hidden" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
          <button className="upload-drop" type="button" onClick={() => fileInputRef.current?.click()}>
            <span className="upload-drop__icon" aria-hidden="true">↑</span>
            <span>{t('img64.upload')}</span>
          </button>
          <p className="field-hint">{t('img64.hint')}</p>
        </section>
        <section className="tool-panel" aria-labelledby="img64-result-title">
          <div className="tool-panel__heading"><h2 id="img64-result-title">{t('common.result')}</h2><button className="text-button" type="button" onClick={copyBase64}>{t('common.copy')}</button></div>
          <div className="img-box"><span className="img-box__label">{fileName || t('img.noImage')}</span>{dataUrl ? <img src={dataUrl} alt={fileName} /> : <span className="code-result--empty">{t('img64.none')}</span>}</div>
          <pre className="code-result img64-result">{base64 ? `${base64.slice(0, 120)}${base64.length > 120 ? '…' : ''}` : t('img64.none')}</pre>
        </section>
      </div>
    </ToolPageShell>
  );
}