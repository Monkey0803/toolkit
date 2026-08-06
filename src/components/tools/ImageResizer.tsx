import { useEffect, useRef, useState } from 'react';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

type ResizeFormat = 'image/png' | 'image/jpeg';

export function ImageResizer() {
  const { lang, t } = useLanguage();
  const tool = getTool('image-resizer')!;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [originalSrc, setOriginalSrc] = useState('');
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState(800);
  const [format, setFormat] = useState<ResizeFormat>('image/png');
  const [resizedSrc, setResizedSrc] = useState('');
  const [resizedSize, setResizedSize] = useState({ width: 0, height: 0 });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (originalImageRef.current) applyResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetWidth, format]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setError(t('img.notImage'));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(t('img.readError'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setFileName(file.name);
        setOriginalSrc(String(reader.result));
        setOriginalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setError('');
        applyResize();
      };
      img.onerror = () => setError(t('img.readError'));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function applyResize() {
    const img = originalImageRef.current;
    if (!img || !img.naturalWidth) return;

    const width = Math.max(Math.round(targetWidth) || 1, 1);
    const height = Math.max(Math.round(img.naturalHeight * (width / img.naturalWidth)), 1);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);
    setResizedSrc(canvas.toDataURL(format, 0.92));
    setResizedSize({ width, height });
    setStatus(t('img.exported'));
  }

  function download() {
    if (!resizedSrc) return;
    const extension = format === 'image/png' ? 'png' : 'jpg';
    const base = fileName.replace(/\.[^.]+$/, '') || 'image';
    const link = document.createElement('a');
    link.href = resizedSrc;
    link.download = `${base}-${resizedSize.width}w.${extension}`;
    link.click();
    setStatus(t('img.downloaded'));
  }

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Image & Color" description={t('img.desc')} status={error || status} statusKind={error ? 'error' : 'neutral'}>
      <div className="tool-workbench">
        <section className="tool-panel color-input-panel" aria-labelledby="img-upload-title">
          <div className="tool-panel__heading"><h2 id="img-upload-title">{t('img.upload')}</h2><span>{t('img.px')}</span></div>
          <input ref={fileInputRef} className="visually-hidden" type="file" accept="image/png,image/jpeg" onChange={(event) => handleFile(event.target.files?.[0])} />
          <button className="upload-drop" type="button" onClick={() => fileInputRef.current?.click()}>
            <span className="upload-drop__icon" aria-hidden="true">↑</span>
            <span>{t('img.upload')}</span>
          </button>
          <p className="field-hint">{t('img.dropHint')}</p>
          <div className="unit-fields">
            <div className="unit-field">
              <label className="field-label" htmlFor="img-width">{t('img.width')}</label>
              <input id="img-width" className="field-input" type="number" min={16} value={targetWidth} onChange={(event) => setTargetWidth(Number(event.target.value) || 0)} />
            </div>
            <div className="unit-field">
              <label className="field-label" htmlFor="img-format">{t('img.format')}</label>
              <select id="img-format" className="field-input" value={format} onChange={(event) => setFormat(event.target.value as ResizeFormat)}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
              </select>
            </div>
          </div>
          {fileName && <p className="field-hint">{fileName} · {originalSize.width}×{originalSize.height}</p>}
        </section>
        <section className="tool-panel" aria-labelledby="img-result-title">
          <div className="tool-panel__heading"><h2 id="img-result-title">{t('img.resized')}</h2><button className="text-button" type="button" onClick={download}>{t('img.download')}</button></div>
          <div className="img-compare">
            <div className="img-box">
              <span className="img-box__label">{t('img.original')}</span>
              {originalSrc ? <img src={originalSrc} alt={fileName} /> : <span className="code-result--empty">{t('img.noImage')}</span>}
            </div>
            <div className="img-box">
              <span className="img-box__label">{resizedSrc ? `${t('img.resized')} · ${resizedSize.width}×${resizedSize.height}` : t('img.resized')}</span>
              {resizedSrc ? <img src={resizedSrc} alt={t('img.resized')} /> : <span className="code-result--empty">{t('img.noImage')}</span>}
            </div>
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}
