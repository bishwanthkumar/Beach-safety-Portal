import { useState } from 'react';
import { Camera, Flag, Send } from 'lucide-react';
import { submitReport } from '../api';

export default function ReportHazard({ beachId }) {
  const [form, setForm] = useState({ category: 'Strong Waves', description: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function send(e) {
    e.preventDefault();
    setBusy(true);
    try { await submitReport({ beachId, ...form }); setSent(true); setForm({ category: 'Strong Waves', description: '' }); }
    finally { setBusy(false); }
  }

  return <section className="report-panel panel">
    <div className="panel-heading"><div><span className="eyebrow">COMMUNITY SAFETY</span><h3>Report a hazard</h3></div><Flag size={25}/></div>
    {sent ? <div className="success-state">✓ Report submitted for review. Thank you for helping keep the beach community informed.</div> : <form onSubmit={send} className="report-form"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Strong Waves','Possible Rip Current','Flooding','Damaged Facility','Pollution','Dangerous Object','Other'].map((x) => <option key={x}>{x}</option>)}</select><textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe what you observed..."></textarea><div className="report-row"><label className="attach"><Camera size={16}/> Photo (UI)</label><button disabled={busy}><Send size={16}/> {busy ? 'Sending...' : 'Submit Report'}</button></div></form>}
  </section>;
}
