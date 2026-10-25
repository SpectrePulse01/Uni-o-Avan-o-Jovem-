import {useEffect, useState} from 'react';
import {remainingTime} from './countdown';
import {AnimatePresence, motion} from 'motion/react';

function NumberShift({value,reduced}:{value:number;reduced:boolean}) {
 return <span className="term-number"><AnimatePresence initial={false} mode="popLayout"><motion.span key={value} initial={{opacity:reduced?1:0,y:reduced?0:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-14}} transition={{duration:reduced?0:.35,ease:[.22,1,.36,1]}}>{String(value).padStart(2,'0')}</motion.span></AnimatePresence></span>;
}

export default function TermCountdown({reduced=false}:{reduced?:boolean}) {
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
 const units = [[time.hours, 'Horas'], [time.minutes, 'Minutos'], [time.seconds, 'Segundos']] as const;
 return <section className={`term-countdown ${time.complete ? 'term-started' : ''}`} aria-labelledby="term-title">
  <div className="term-kicker"><span/> A NOSSA VEZ ESTÁ CHEGANDO</div>
  <h2 id="term-title">{time.complete ? 'O futuro começa agora.' : 'Da nossa voz. Para a nossa escola.'}</h2>
  <div className="term-core">
   <svg className="term-orbits" viewBox="0 0 360 360" aria-hidden="true">
    <defs><linearGradient id="term-spectrum" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff3b62"/><stop offset=".5" stopColor="#d78bb5"/><stop offset="1" stopColor="#40c9ff"/></linearGradient></defs>
    <circle className="term-track" cx="180" cy="180" r="168"/>
    <g className="term-orbit-one"><circle cx="180" cy="180" r="168" stroke="url(#term-spectrum)" strokeDasharray="230 825"/><circle className="term-spark" cx="348" cy="180" r="3"/></g>
    <g className="term-orbit-two"><circle cx="180" cy="180" r="153" stroke="url(#term-spectrum)" strokeDasharray="80 110 190 581"/></g>
    <circle className="term-inner" cx="180" cy="180" r="137"/>
   </svg>
   <div className="term-day" role="timer" aria-live="off" aria-label="Dias restantes para o início da gestão">
    <span className="term-overline">{time.complete ? 'GESTÃO 2027' : 'FALTAM'}</span>
    <strong>{time.complete ? <span className="term-go">É AGORA</span> : <NumberShift value={time.days} reduced={reduced}/>}</strong>
    <span className="term-day-caption">{time.complete ? 'Vamos fazer acontecer.' : time.days===1 ? 'DIA PARA FAZER ACONTECER' : 'DIAS PARA FAZER ACONTECER'}</span>
   </div>
  </div>
  {!time.complete && <dl className="term-digits" role="timer" aria-live="off" aria-label="Horas, minutos e segundos restantes">{units.map(([value, label]) => <div key={label}><dt>{label}</dt><dd><NumberShift value={value} reduced={reduced}/></dd></div>)}</dl>}
  {time.complete && <p className="term-message">Chegou o dia de transformar união em ação.</p>}
  <div className="term-date"><span>INÍCIO DA GESTÃO</span><time dateTime="2027-02-11T00:00:00-03:00">11 <b>FEV</b> 2027</time><small>Horário de Brasília</small></div>
 </section>;
}
