import { useState } from 'react';
import QRCode from 'qrcode';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export function QrCodeMaker() {
  const { lang, t } = useLanguage();
  const tool = getTool('qr-code-maker')!;
  const [content, setContent] = useState('https://toolkit.local/');
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrection>('M');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  async function generate() {
    if (!content.trim()) {
      setError(t('qr.empty'));
      setDataUrl('');
      return;
    }
    try {
      const url = await QRCode.toDataURL(content.trim(), { width: size, errorCorrectionLevel: errorCorrection, margin: 2 });
      setDataUrl(url);
      setError('');
      setStatus(t('qr.generated'));
    } catch {
      setError(t('img.readError'));
      setStatus('');
    }
  }

  function download() {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode.png';
    link.click();
    setStatus(t('qr.downloaded'));
  }

  const correctionOptions: Array<[ErrorCorrection, string]> = [
    ['L', t('qr.ecLow')],
    ['M', t('qr.ecMedium')],
    ['Q', t('qr.ecQuartile')],
    ['H', t('qr.ecHigh')],
  ];

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Generators" description={t('qr.desc')} status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench tool-workbench--split">
        <section className="tool-panel" aria-labelledby="qr-input-title">
          <div className="tool-panel__heading"><h2 id="qr-input-title">{t('qr.content')}</h2><span>{t('qr.desc')}</span></div>
          <label className="field-label" htmlFor="qr-content">{t('qr.content')}</label>
          <textarea id="qr-content" className="code-editor" value={content} onChange={(event) => setContent(event.target.value)} placeholder={t('qr.contentPlaceholder')} spellCheck={false} />
          <div className="unit-fields">
            <div className="unit-field">
              <label className="field-label" htmlFor="qr-size">{t('qr.size')}</label>
              <input id="qr-size" className="field-input" type="number" min={64} max={1024} step={32} value={size} onChange={(event) => setSize(Math.min(Math.max(Number(event.target.value) || 256, 64), 1024))} />
            </div>
            <div className="unit-field">
              <label className="field-label" htmlFor="qr-ec">{t('qr.errorCorrection')}</label>
              <select id="qr-ec" className="field-input" value={errorCorrection} onChange={(event) => setErrorCorrection(event.target.value as ErrorCorrection)}>
                {correctionOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </div>
          </div>
          <div className="tool-toolbar"><button className="button button--primary" type="button" onClick={generate}>{t('common.generate')}</button></div>
        </section>
        <section className="tool-panel" aria-labelledby="qr-result-title">
          <div className="tool-panel__heading"><h2 id="qr-result-title">{t('common.preview')}</h2><button className="text-button" type="button" onClick={download}>{t('qr.download')}</button></div>
          <div className="qr-preview">
            {dataUrl ? <img src={dataUrl} width={Math.min(size, 320)} height={Math.min(size, 320)} alt={t('qr.desc')} /> : <span className="code-result--empty">{t('qr.empty')}</span>}
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}
