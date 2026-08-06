import { describe, expect, it } from 'vitest';
import qrcode from 'qrcode-generator';

describe('qr-code-generator', () => {
  it('builds a scannable matrix for text', () => {
    const qr = qrcode(0, 'M');
    qr.addData('https://toolkit.local/');
    qr.make();
    expect(qr.getModuleCount()).toBeGreaterThan(10);
  });

  it('produces larger matrices for longer content', () => {
    const short = buildQr('hi');
    const long = buildQr('this is a much longer payload that needs more modules');
    expect(long.getModuleCount()).toBeGreaterThan(short.getModuleCount());
  });
});

function buildQr(text: string) {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  return qr;
}
