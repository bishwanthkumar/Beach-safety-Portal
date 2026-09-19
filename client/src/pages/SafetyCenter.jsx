import { ShieldCheck, AlertTriangle, Waves, Phone, LifeBuoy } from 'lucide-react';

export default function SafetyCenter() {
  return <div className="container page-pad">
    <div className="section-title-row"><div><span className="eyebrow">SAFETY CENTER</span><h1>Learn, prepare and respond</h1><p>Use this page to understand the safety layers available across the portal.</p></div></div>
    <div className="safety-center-grid"><div className="panel"><ShieldCheck size={26}/><h3>Understand the status</h3><p>Our demo status is an information summary generated from marine values and portal alerts. It is not an official declaration that a beach is safe.</p></div><div className="panel"><AlertTriangle size={26}/><h3>Read the alert reason</h3><p>Each alert includes a type, severity, source and timestamp so users can understand where the information came from.</p></div><div className="panel"><Waves size={26}/><h3>Check the water</h3><p>Marine data can show wave height, period, current and sea surface temperature, with a coastal-data limitation note.</p></div><div className="panel"><LifeBuoy size={26}/><h3>Find help</h3><p>Use the emergency panel, lifeguard points and nearby first-aid locations to act quickly.</p></div></div>
    <div className="guideline-box"><div><Phone size={25}/></div><div><h3>Emergency rule of thumb</h3><p>When there is a conflict between portal information and instructions from authorities or lifeguards, follow the official local instruction.</p></div></div>
  </div>;
}
