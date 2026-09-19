import { useState } from 'react';
import { CheckSquare } from 'lucide-react';

export default function FamilyChecklist() {
  const [items, setItems] = useState(['Check current alerts','Locate a lifeguard station','Keep children supervised','Identify an emergency contact','Stay within designated areas']);
  const [done, setDone] = useState([]);
  const toggle = (x) => setDone((d) => d.includes(x) ? d.filter((i) => i !== x) : [...d, x]);
  return <div className="panel checklist-panel"><div className="panel-heading"><div><span className="eyebrow">FAMILY MODE</span><h3>Safety checklist</h3></div><CheckSquare size={25}/></div><div className="checklist">{items.map((x) => <button key={x} onClick={() => toggle(x)} className={done.includes(x) ? 'checked' : ''}>{done.includes(x) ? '✓' : '○'} {x}</button>)}</div><small>{done.length}/{items.length} completed</small></div>;
}
