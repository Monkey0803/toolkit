import { describe, expect, it } from 'vitest';
import { categoryName, translate, translations } from './i18n';

describe('translation dictionary', () => {
  it('has matching keys across languages', () => {
    const enKeys = Object.keys(translations.en);
    const zhKeys = Object.keys(translations.zh);
    expect(enKeys.sort()).toEqual(zhKeys.sort());
  });

  it('returns non-empty translated strings', () => {
    for (const key of Object.keys(translations.en) as Array<keyof typeof translations.en>) {
      expect(translate('en', key)).not.toBe('');
      expect(translate('zh', key)).not.toBe('');
    }
  });
});

describe('category names', () => {
  it('localizes known categories', () => {
    expect(categoryName('zh', 'Text')).toBe('文本');
    expect(categoryName('en', 'Text')).toBe('Text');
    expect(categoryName('zh', 'Image & Color')).toBe('图片与颜色');
  });
});
