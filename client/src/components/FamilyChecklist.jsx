import { useMemo, useState } from 'react';
import { AlertTriangle, Check, CheckSquare, Compass, ShieldAlert } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';

export default function FamilyChecklist({ beach, safetyStatus, marine }) {
  const { language } = useContext(LanguageContext);
  const { t } = useLanguage(language);
  const [answers, setAnswers] = useState({ swimmer: '', group: '', visit: '', activity: '' });

  const plan = useMemo(() => {
    if (Object.values(answers).some((answer) => !answer)) return null;

    const statusKey = safetyStatus?.key || 'green';
    const reasons = [];
    let notRecommended = statusKey === 'red';
    if (statusKey === 'red') reasons.push(t('planReasonRed'));
    if (statusKey === 'yellow') reasons.push(t('planReasonYellow'));
    if (answers.swimmer === 'no' && statusKey !== 'green') {
      notRecommended = true;
      reasons.push(t('planReasonNonSwimmer'));
    }
    if (answers.group === 'children' && statusKey !== 'green') reasons.push(t('planReasonChildren'));
    if (answers.visit === 'first' && statusKey !== 'green') reasons.push(t('planReasonFirstVisit'));
    if (answers.activity === 'walk') reasons.push(t('planReasonWalk'));
    if (!reasons.length) reasons.push(t('planReasonClear'));

    return {
      title: notRecommended ? t('planNotRecommended') : statusKey === 'yellow' ? t('planCaution') : t('planNoAdvisory'),
      tone: notRecommended ? 'not-recommended' : statusKey === 'yellow' ? 'caution' : 'clear',
      reasons,
      window: beach?.lifeguard?.dutyHours || t('planAskLifeguard')
    };
  }, [answers, beach, safetyStatus, t]);

  const questions = [
    ['swimmer', t('planCanSwim'), [['yes', t('yes')], ['no', t('no')]]],
    ['group', t('planGroupNeedsCare'), [['none', t('no')], ['children', t('yes')]]],
    ['visit', t('planFirstVisit'), [['returning', t('no')], ['first', t('yes')]]],
    ['activity', t('planActivity'), [['water', t('planEnterWater')], ['walk', t('planWalkOnly')]]]
  ];

  return <div className="panel checklist-panel plan-panel">
    <div className="panel-heading"><div><span className="eyebrow">{t('myBeachPlan')}</span><h3>{t('personalGoNoGo')}</h3></div><Compass size={25}/></div>
    <p className="plan-intro">{t('planIntro')}</p>
    <div className="plan-questions">
      {questions.map(([key, label, options]) => <fieldset key={key}>
        <legend>{label}</legend>
        <div className="plan-options">{options.map(([value, text]) => <button type="button" key={value} className={answers[key] === value ? 'selected' : ''} onClick={() => setAnswers((current) => ({ ...current, [key]: value }))}>{answers[key] === value && <Check size={14}/>} {text}</button>)}</div>
      </fieldset>)}
    </div>
      {plan ? <div className={`plan-verdict ${plan.tone}`}>
      {plan.tone === 'not-recommended' ? <ShieldAlert size={23}/> : <AlertTriangle size={23}/>}<div><span className="eyebrow">{t('yourCurrentPlan')}</span><h4>{plan.title}</h4><ul>{plan.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul><strong><CheckSquare size={15}/> {t('bestSupervisedWindow')}: {plan.window}</strong></div>
    </div> : <small className="plan-progress">{t('planCompleteAnswers')}</small>}
  </div>;
}
