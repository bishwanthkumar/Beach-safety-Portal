import { useState } from 'react';
import { useContext } from 'react';
import { Camera, Flag, Send } from 'lucide-react';
import { submitReport } from '../api';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

export default function ReportHazard({ beachId }) {
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);
  const [form, setForm] = useState({ category: 'Strong Waves', description: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function send(e) {
    e.preventDefault();
    setBusy(true);
    try { await submitReport({ beachId, ...form }); setSent(true); setForm({ category: 'Strong Waves', description: '' }); }
    finally { setBusy(false); }
  }

  const categories = [['Strong Waves', t('strongWaves')], ['Possible Rip Current', t('possibleRipCurrent')], ['Flooding', t('flooding')], ['Damaged Facility', t('damagedFacility')], ['Pollution', t('pollution')], ['Dangerous Object', t('dangerousObject')], ['Other', t('other')]];
  return <section className="report-panel panel">
    <div className="panel-heading"><div><span className="eyebrow">{t('communitySafety')}</span><h3>{t('reportAHazard')}</h3></div><Flag size={25}/></div>
    {sent ? <div className="success-state">✓ {t('reportSubmittedReview')}</div> : <form onSubmit={send} className="report-form"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t('describeObservedHazard')}></textarea><div className="report-row"><label className="attach"><Camera size={16}/> {t('photoUi')}</label><button disabled={busy}><Send size={16}/> {busy ? t('sending') : t('submitReport')}</button></div></form>}
  </section>;
}
