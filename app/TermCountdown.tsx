import {useEffect, useState} from 'react';
import {remainingTime} from './countdown';

export default function TermCountdown() {
 const [time, setTime] = useState(() => remainingTime());
 useEffect(() => {
  let timer: ReturnType<typeof setInterval> | undefined;
  const update = () => {
   const next = remainingTime();
   setTime(next);
   if (next.complete) clearInterval(timer);
  };
  const resume = () => {
   clearInterval(timer);
   if (document.hidden) return;
   update();
   if (!remainingTime().complete) timer = setInterval(update, 1000);
  };
  resume();
  document.addEventListener('visibilitychange', resume);
  return () => {clearInterval(timer); document.removeEventListener('visibilitychange', resume);};
 }, []);
 const units = [[time.days, 'Dias'], [time.hours, 'Horas'], [time.minutes, 'Minutos'], [time.seconds, 'Segundos']] as const;
 return <section className={`term-countdown ${time.complete ? 'term-started' : ''}`} aria-labelledby="term-title">
  <div className="term-kicker"><span/> UNIÃO AVANÇO JOVEM · GESTÃO 2027</div>
  <h2 id="term-title">{time.complete ? 'É hora de fazer acontecer.' : 'O próximo capítulo começa em'}</h2>
  {!time.complete && <dl className="term-digits" role="timer" aria-live="off" aria-label="Tempo restante para o início da gestão">{units.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{String(value).padStart(2, '0')}</dd></div>)}</dl>}
  {time.complete && <p className="term-message">Chegou o dia de transformar união em ação. Acompanhe nossas propostas e cada nova etapa.</p>}
  <div className="term-date"><span>INÍCIO DA GESTÃO</span><time dateTime="2027-02-11T00:00:00-03:00">11 FEV 2027</time><small>Horário de Brasília</small></div>
 </section>;
}
