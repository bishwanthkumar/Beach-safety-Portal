import { useMemo, useState } from 'react';
import { AlertTriangle, Check, CheckSquare, Compass, ShieldAlert } from 'lucide-react';

export default function FamilyChecklist({ beach, safetyStatus, marine }) {
  const [answers, setAnswers] = useState({ swimmer: '', group: '', visit: '', activity: '' });

  const plan = useMemo(() => {
    if (Object.values(answers).some((answer) => !answer)) return null;

    const statusKey = safetyStatus?.key || 'green';
    const reasons = [];
    let notRecommended = statusKey === 'red';
    if (statusKey === 'red') reasons.push('The current beach conditions are not recommended for water entry.');
    if (statusKey === 'yellow') reasons.push('A caution-level condition or advisory is active.');
    if (answers.swimmer === 'no' && statusKey !== 'green') {
      notRecommended = true;
      reasons.push('You selected that you are not a swimmer, so a caution-level condition is not a good match for water entry.');
    }
    if (answers.group === 'children' && statusKey !== 'green') reasons.push('Children need close supervision when conditions are not clear.');
    if (answers.visit === 'first' && statusKey !== 'green') reasons.push('For a first visit, use marked areas and ask the lifeguard before entering.');
    if (answers.activity === 'walk') reasons.push('Walking only keeps the water-entry decision out of your plan.');
    if (!reasons.length) reasons.push('No active portal advisory is recorded for this beach right now.');

    return {
      title: notRecommended ? 'Not recommended for you now' : statusKey === 'yellow' ? 'Recommended with caution' : 'No active advisory for your plan',
      tone: notRecommended ? 'not-recommended' : statusKey === 'yellow' ? 'caution' : 'clear',
      reasons,
      window: beach?.lifeguard?.dutyHours || 'Ask the lifeguard for the current supervised hours.'
    };
  }, [answers, beach, safetyStatus]);

  const questions = [
    ['swimmer', 'Can you swim confidently?', [['yes', 'Yes'], ['no', 'No']]],
    ['group', 'Is anyone with you a child or older adult?', [['none', 'No'], ['children', 'Yes']]],
    ['visit', 'Is this your first visit here?', [['returning', 'No'], ['first', 'Yes']]],
    ['activity', 'What will you do at the beach?', [['water', 'Enter the water'], ['walk', 'Walk only']]]
  ];

  return <div className="panel checklist-panel plan-panel">
    <div className="panel-heading"><div><span className="eyebrow">MY BEACH PLAN</span><h3>Personal go / no-go</h3></div><Compass size={25}/></div>
    <p className="plan-intro">Answer four quick questions. This is a decision aid, not a guarantee of safety.</p>
    <div className="plan-questions">
      {questions.map(([key, label, options]) => <fieldset key={key}>
        <legend>{label}</legend>
        <div className="plan-options">{options.map(([value, text]) => <button type="button" key={value} className={answers[key] === value ? 'selected' : ''} onClick={() => setAnswers((current) => ({ ...current, [key]: value }))}>{answers[key] === value && <Check size={14}/>} {text}</button>)}</div>
      </fieldset>)}
    </div>
    {plan ? <div className={`plan-verdict ${plan.tone}`}>
      {plan.tone === 'not-recommended' ? <ShieldAlert size={23}/> : <AlertTriangle size={23}/>}<div><span className="eyebrow">YOUR CURRENT PLAN</span><h4>{plan.title}</h4><ul>{plan.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul><strong><CheckSquare size={15}/> Best supervised window: {plan.window}</strong></div>
    </div> : <small className="plan-progress">Complete all four answers to see your personalized recommendation.</small>}
  </div>;
}
