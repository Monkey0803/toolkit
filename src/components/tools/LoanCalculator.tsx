import { useState } from 'react';
import { calculateLoan } from '../../lib/toolkit-tools';
import { getTool } from '../../data/tools';
import { useLanguage } from '../../context/LanguageContext';
import { ToolPageShell } from '../ToolPageShell';

type LoanType = 'equal-payment' | 'equal-principal';

export function LoanCalculator() {
  const { lang, t } = useLanguage();
  const tool = getTool('loan-calculator')!;
  const [type, setType] = useState<LoanType>('equal-payment');
  const [principal, setPrincipal] = useState('1000000');
  const [rate, setRate] = useState('4.2');
  const [years, setYears] = useState('20');
  const plan = calculateLoan(type, Number(principal) || 0, Number(rate) || 0, Number(years) || 0);
  const totalPayment = (Number(principal) || 0) + plan.totalInterest;

  return (
    <ToolPageShell title={lang === 'zh' ? tool.nameZh ?? tool.name : tool.name} category="Everyday" description={t('loan.desc')} status={t('loan.status')}>
      <div className="tool-workbench">
        <section className="tool-panel" aria-labelledby="loan-input-title">
          <div className="tool-panel__heading"><h2 id="loan-input-title">{t('common.input')}</h2><span>¥</span></div>
          <div className="case-options" aria-label={t('loan.type')}>
            <button className={type === 'equal-payment' ? 'is-active' : ''} type="button" aria-pressed={type === 'equal-payment'} onClick={() => setType('equal-payment')}>{t('loan.equalPayment')}</button>
            <button className={type === 'equal-principal' ? 'is-active' : ''} type="button" aria-pressed={type === 'equal-principal'} onClick={() => setType('equal-principal')}>{t('loan.equalPrincipal')}</button>
          </div>
          <div className="unit-fields">
            <div className="unit-field"><label className="field-label" htmlFor="loan-p">{t('loan.principal')}</label><input id="loan-p" className="field-input" type="number" value={principal} onChange={(event) => setPrincipal(event.target.value)} /></div>
            <div className="unit-field"><label className="field-label" htmlFor="loan-r">{t('loan.rate')}</label><input id="loan-r" className="field-input" type="number" step="0.01" value={rate} onChange={(event) => setRate(event.target.value)} /></div>
            <div className="unit-field"><label className="field-label" htmlFor="loan-n">{t('loan.years')}</label><input id="loan-n" className="field-input" type="number" value={years} onChange={(event) => setYears(event.target.value)} /></div>
          </div>
        </section>
        <section className="tool-panel" aria-labelledby="loan-result-title">
          <div className="tool-panel__heading"><h2 id="loan-result-title">{t('common.result')}</h2><span>{type === 'equal-payment' ? t('loan.equalPayment') : t('loan.equalPrincipal')}</span></div>
          <div className="stat-grid">
            <div className="stat-cell stat-cell--highlight"><span className="stat-value">¥{plan.monthlyPayment.toLocaleString()}</span><span className="stat-label">{t('loan.monthly')}</span></div>
            <div className="stat-cell"><span className="stat-value">¥{plan.totalInterest.toLocaleString()}</span><span className="stat-label">{t('loan.totalInterest')}</span></div>
            <div className="stat-cell"><span className="stat-value">¥{totalPayment.toLocaleString()}</span><span className="stat-label">{t('loan.totalPayment')}</span></div>
            {type === 'equal-principal' && (
              <>
                <div className="stat-cell"><span className="stat-value">¥{plan.firstPayment.toLocaleString()}</span><span className="stat-label">{t('loan.first')}</span></div>
                <div className="stat-cell"><span className="stat-value">¥{plan.lastPayment.toLocaleString()}</span><span className="stat-label">{t('loan.last')}</span></div>
              </>
            )}
          </div>
        </section>
      </div>
    </ToolPageShell>
  );
}