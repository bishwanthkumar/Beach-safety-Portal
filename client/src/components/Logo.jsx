import { ShieldCheck } from 'lucide-react';

export default function Logo() {
  return <div className="brand" aria-label="BeachSafe India Beach Safety Portal">
    <div className="brand-mark"><ShieldCheck size={20} /></div>
    <div>
      <div className="brand-title">BeachSafe</div>
      <div className="brand-sub">India Beach Safety Portal</div>
    </div>
  </div>;
}
