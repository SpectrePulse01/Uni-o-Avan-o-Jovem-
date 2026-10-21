import {useEffect,useRef,useState} from 'react';
import type {CSSProperties,PointerEvent as ReactPointerEvent} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {chapters,chapterIds,proposals,members} from './content';
import {usePages} from './navigation';
import {Action,Reveal,Title,ease} from './motion';
import ThreeStage from './ThreeStage';
import BrandMark from './BrandMark';
import FlagBackdrop from './FlagBackdrop';
import {principles,PrincipleIcon,VisionSignal} from './vision';
import Dialog from './Dialog';
import {memberAvatars} from './avatars';

type Panel='menu'|'proposal'|'team'|'vision'|'symbol'|'commitment'|null;
const photos=['./uaj-hero-classroom-v4.webp','./uaj-bandeira-realista-v1.webp','./uaj-vision-council-v4.webp','./uaj-projects-campus-v4.webp','./uaj-team-background-v5.webp','./uaj-hero-classroom-v4.webp'];
const statuses=[['✓','Resolvido','Concluído e entregue.'],['◉','Em andamento','Trabalho acontecendo.'],['↗','Encaminhado','Aguardando aprovação.'],['×','Não foi possível','Motivo explicado.']];

export default function Home(){
 const [panel,setPanel]=useState<Panel>(null),[paused,setPaused]=useState(false);
 const systemReduced=useReducedMotion(),reduced=!!systemReduced||paused;
 const {page,direction,go,onPointerDown,onPointerUp,onPointerCancel}=usePages(!!panel);
 const [proposal,setProposal]=useState(0),[member,setMember]=useState(0);
 const [contentDirection,setContentDirection]=useState(1);
 const [principle,setPrinciple]=useState(0);
 const selected=proposals[proposal],person=members[member];
 const gesture=useRef<{x:number;y:number}|null>(null);
 const switchProposal=(next:number)=>{setContentDirection(next>proposal?1:-1);setProposal((next+proposals.length)%proposals.length);};
 const switchMember=(next:number)=>{setContentDirection(next>member?1:-1);setMember((next+members.length)%members.length);};
 useEffect(()=>{
   if(![3,4].includes(page)||panel)return;
   const key=(e:KeyboardEvent)=>{
     if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||!['ArrowLeft','ArrowRight'].includes(e.key))return;
     if(e.target instanceof Element&&e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="dialog"],[role="slider"],[role="tablist"]'))return;
     e.preventDefault();
     const delta=e.key==='ArrowRight'?1:-1;
     setContentDirection(delta);
     if(page===3)setProposal(current=>(current+delta+proposals.length)%proposals.length);
     else setMember(current=>(current+delta+members.length)%members.length);
   };
   window.addEventListener('keydown',key);
   return()=>window.removeEventListener('keydown',key);
 },[page,panel]);
 const localStart=(e:ReactPointerEvent)=>{if(e.pointerType==='touch')gesture.current={x:e.clientX,y:e.clientY};};
 const localEnd=(e:ReactPointerEvent,kind:'proposal'|'member')=>{
   if(!gesture.current)return;const dx=e.clientX-gesture.current.x,dy=e.clientY-gesture.current.y;gesture.current=null;
   if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){const delta=dx<0?1:-1;kind==='proposal'?switchProposal(proposal+delta):switchMember(member+delta);}
 };
 useEffect(()=>{
   if(page===3)document.querySelector('.project-tabs [aria-pressed="true"]')?.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:reduced?'instant':'smooth'});
 },[page,proposal,reduced]);
 const goto=(n:number)=>{setPanel(null);go(n);};
 useEffect(()=>{document.title=`${chapters[page]} · União Avanço Jovem`;},[page]);
 const css={'--accent':page===3?selected.accent:page===4?person.accent:'#f3364f'} as CSSProperties;
 const sectionLabel=<div className="section-label"><span>{String(page+1).padStart(2,'0')} / 06</span><i />{['GRÊMIO ESTUDANTIL · 2026','IDENTIDADE EM MOVIMENTO','O QUE NOS MOVE','PROJETOS PARA A ENNY','QUEM FAZ ACONTECER','NOSSO COMPROMISSO'][page]}</div>;

 return <main className={`experience chapter-${page} ${reduced?'quiet':''}`} style={css} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}>
  <div className="backdrops" aria-hidden><AnimatePresence initial={false}><motion.img key={page} src={photos[page]} alt="" initial={{opacity:0,scale:reduced?1:1.05}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:reduced?0:1.15,ease}} /></AnimatePresence></div>
  <div className={`environment-light light-${page}`} aria-hidden/><div className="screen-grain" aria-hidden/>
  <header className="site-header">
   <button className="brand" aria-label="Ir para o início" onClick={()=>goto(0)}><BrandMark/><strong>U.A.J.<small>UNIÃO AVANÇO JOVEM</small></strong></button>
   <nav className="desktop-nav" aria-label="Páginas">{chapters.map((name,i)=><button key={name} aria-current={page===i?'page':undefined} className={page===i?'selected':''} onClick={()=>goto(i)}>{page===i&&<motion.span layoutId="nav-line" className="nav-line" transition={{duration:reduced?0:.4,ease}}/>}{name}</button>)}</nav>
   <button className="menu-trigger" aria-label="Abrir menu de páginas" onClick={()=>setPanel('menu')}><span>MENU</span><i/><i/></button>
  </header>
  <FlagBackdrop active={page===1} reduced={reduced}/>
  <ThreeStage page={page} reduced={reduced}/>
  <div className="pages-container">
   <AnimatePresence mode="wait" custom={direction} initial={false}>
    <motion.section key={page} id={chapterIds[page]} aria-label={chapters[page]} className={`page page-${page}`} custom={direction}
     variants={{enter:(d:number)=>({opacity:0,y:reduced?0:d*28}),show:{opacity:1,y:0},leave:(d:number)=>({opacity:0,y:reduced?0:-d*24})}}
     initial="enter" animate="show" exit="leave" transition={{duration:reduced?0:.28,ease}}>
     {sectionLabel}
     {page===0&&<>
       <div className="hero-heading"><Title reduced={reduced} lines={['A escola vai',<>ouvir <em>nossa</em></>,<em>voz.</em>]}/><Reveal reduced={reduced} delay={.4} className="hero-caption"><span>União que escuta.</span><span>Avanço que acontece.</span></Reveal></div>
       <Reveal reduced={reduced} delay={.55} className="hero-bottom"><div className="hero-numbers"><button onClick={()=>goto(3)}><b>{proposals.length}</b><span>propostas<br/>possíveis</span></button><i/><button onClick={()=>goto(4)}><b>14</b><span>vozes.<br/>uma direção.</span></button></div><Action reduced={reduced} onClick={()=>goto(1)}>Entrar na experiência</Action></Reveal>
       <div className="hero-side-word" aria-hidden>AVANÇO</div>
     </>}
     {page===1&&<>
       <div className="symbol-heading"><Title reduced={reduced} lines={['União. Avanço.',<em>Jovem.</em>]}/></div>
       <Reveal reduced={reduced} delay={.45} className="symbol-bottom"><p>A escola muda quando a voz dos alunos deixa de ser fundo e vira direção.</p><div className="value-line"><span>UNIÃO</span><i>✦</i><span>VOZ</span><i>✦</i><span>AVANÇO</span></div><button className="text-link" onClick={()=>setPanel('symbol')}>O significado do nosso símbolo <span>↗</span></button></Reveal>
     </>}
     {page===2&&<>
       <div className="vision-heading"><Title reduced={reduced} lines={['Não é sobre', 'uma chapa.', <em>É sobre a escola.</em>]}/><Reveal reduced={reduced} delay={.4} className="vision-copy"><p>O Grêmio não deve falar pelos alunos.<br/>Deve falar <strong>com</strong> os alunos.</p></Reveal></div>
       <VisionSignal/>
       <Reveal reduced={reduced} delay={.5} className="pillars">{principles.map((p,i)=><button key={p.title} onClick={()=>{setPrinciple(i);setPanel('vision');}}><span>0{i+1}</span><strong>{p.title}</strong><small>{p.subtitle}</small><i><PrincipleIcon index={i}/></i></button>)}</Reveal>
     </>}
     {page===3&&<>
      <div className="proposal-top"><span className="eyebrow">{selected.category}</span><div className="item-count"><b>{selected.number}</b> / {proposals.length}</div></div>
      <div className="proposal-layout" data-no-page onPointerDown={localStart} onPointerUp={e=>localEnd(e,'proposal')} onPointerCancel={()=>gesture.current=null}>
       <AnimatePresence mode="wait" initial={false} custom={contentDirection}>
        <motion.div key={proposal} className="proposal-story" initial={{opacity:0,x:reduced?0:contentDirection*22}} animate={{opacity:1,x:0}} exit={{opacity:0,x:reduced?0:-contentDirection*22}} transition={{duration:reduced?0:.25,ease}}>
         <h1>{selected.title}</h1><p>{selected.summary}</p><Action reduced={reduced} secondary onClick={()=>setPanel('proposal')}>Conhecer a proposta</Action>
        </motion.div>
       </AnimatePresence>
       <div className="proposal-art"><div className="art-halo"/><span className="art-number" aria-hidden>{selected.number}</span><AnimatePresence mode="wait" initial={false}><motion.img key={selected.art} src={selected.art} alt="" initial={{opacity:0,rotate:reduced?0:-9,scale:reduced?1:.82}} animate={{opacity:1,rotate:0,scale:1}} exit={{opacity:0,rotate:reduced?0:7,scale:reduced?1:.9}} transition={{duration:reduced?0:.45,ease}}/></AnimatePresence><span className="drag-hint">← DESLIZE PARA EXPLORAR →</span></div>
      </div>
      <div className="project-navigation" data-no-page><div className="project-tabs">{proposals.map((p,i)=><button aria-label={`Abrir ${p.title}`} aria-pressed={i===proposal} title={p.title} key={p.number} onClick={()=>switchProposal(i)}>{i===proposal&&<motion.span layoutId="project-marker" className="project-marker" transition={{duration:reduced?0:.35,ease}}/>}<span>{p.number}</span></button>)}</div></div>
     </>}
     {page===4&&<>
       <div className="team-heading"><span className="eyebrow">14 PESSOAS. UMA DIREÇÃO.</span><button className="text-link" onClick={()=>setPanel('team')}>Ver equipe <span>↗</span></button></div>
       <div className="member-layout" data-no-page onPointerDown={localStart} onPointerUp={e=>localEnd(e,'member')} onPointerCancel={()=>gesture.current=null}>
        <div className="member-art"><motion.div className="member-aura" animate={{backgroundColor:person.accent}} transition={{duration:reduced?0:.6}}/><motion.img key={person.name} width={500} height={750} className={memberAvatars[person.name]?"personal-avatar":""} src={memberAvatars[person.name]||"./uaj-team-sculpture-v4.webp"} alt={memberAvatars[person.name]?`Avatar em estilo 3D de ${person.name}`:""} draggable={false} decoding="async" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:reduced?0:.35}}/>{!memberAvatars[person.name]&&<motion.span className="member-initials" key={member} initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{duration:reduced?0:.45}}>{person.initials}</motion.span>}</div>
        <AnimatePresence mode="wait" initial={false}><motion.div key={member} className="member-copy" initial={{opacity:0,y:reduced?0:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-12}} transition={{duration:reduced?0:.25,ease}}><span className="member-role">{person.role}</span><h1>{person.name.split(' ')[0]}<small>{person.name.split(' ').slice(1).join(' ')}</small></h1><p>{person.description}</p><div className="member-tags">{person.focus.map(f=><span key={f}>{f}</span>)}</div></motion.div></AnimatePresence>
       </div>
       <div className="member-navigation" data-no-page><div><b>{String(member+1).padStart(2,'0')}</b><span>/ 14</span><small>UNIÃO AVANÇO JOVEM</small></div></div>
     </>}
     {page===5&&<>
       <div className="closing-heading"><Title reduced={reduced} lines={['Prometer menos.',<em>Ouvir mais.</em>,'Fazer acontecer.']}/></div>
       <Reveal reduced={reduced} delay={.45} className="closing-bottom"><p>Algumas propostas dependem de verba e aprovação. Nosso compromisso é tentar de verdade e mostrar cada etapa.</p><button className="text-link" onClick={()=>setPanel('commitment')}>Transparência em cada etapa <span>↗</span></button><Action reduced={reduced} secondary onClick={()=>goto(0)}>Rever desde o início</Action></Reveal>
     </>}
    </motion.section>
   </AnimatePresence>
  </div>
  <aside className="page-rail" aria-label="Escolher página">{chapters.map((name,i)=><button key={name} aria-label={`Ir para ${name}`} aria-current={page===i?'page':undefined} onClick={()=>goto(i)}><span>{String(i+1).padStart(2,'0')}</span><i className={i===page?'rail-active':''}/></button>)}</aside>
  <footer className="experience-footer">
   <button className="motion-toggle" aria-label={paused?'Retomar movimento':'Pausar movimento'} aria-pressed={paused} onClick={()=>setPaused(!paused)}><span>{reduced?'▷':'Ⅱ'}</span><small>{reduced?'MOVIMENTO REDUZIDO':'MOVIMENTO ATIVO'}</small></button>
   <div className="page-controls"><div className="page-counter"><AnimatePresence mode="wait" initial={false}><motion.b key={page} initial={{y:reduced?0:15,opacity:0}} animate={{y:0,opacity:1}} exit={{y:reduced?0:-15,opacity:0}} transition={{duration:reduced?0:.18}}>{String(page+1).padStart(2,'0')}</motion.b></AnimatePresence><span>{chapters[page]}</span><i>/ 06</i></div></div>
   <span className={`scroll-cue ${page===5?"cue-hidden":""}`} aria-hidden="true"><svg viewBox="0 0 24 32"><path d="M12 3v24m-6-6 6 6 6-6"/></svg></span>
  </footer>
  <div className="page-progress" aria-hidden><motion.div animate={{scaleX:(page+1)/6}} transition={{duration:reduced?0:.6,ease}}/></div>
  {panel&&<Dialog title={panel==='menu'?'Explore a U.A.J.':panel==='proposal'?selected.title:panel==='team'?'Quem faz acontecer':panel==='vision'?principles[principle].title:panel==='symbol'?'União. Avanço. Jovem.':'Transparência, de verdade.'} onClose={()=>setPanel(null)} reduced={reduced}>
   {panel==='menu'&&<nav className="menu-list">{chapters.map((name,i)=><button key={name} onClick={()=>goto(i)} aria-current={i===page?'page':undefined}><span>0{i+1}</span><strong>{name}</strong><i>↗</i></button>)}</nav>}
   {panel==='proposal'&&<div className="proposal-full"><span className="eyebrow">{selected.category}</span><p className="dialog-lead">{selected.summary}</p><h3>Como vai funcionar</h3><p>{selected.how}</p><h3>Impacto direto</h3><ul>{selected.benefits.map(b=><li key={b}>{b}</li>)}</ul><div className="detail-note">{selected.extra}</div></div>}
   {panel==='team'&&<div className="team-list">{members.map((p,i)=><button key={p.name+p.role} onClick={()=>{setMember(i);setPanel(null);}} aria-pressed={i===member}><span style={{color:p.accent}}>{memberAvatars[p.name]?<img src={memberAvatars[p.name]} alt="" loading="lazy" decoding="async"/>:p.initials}</span><div><strong>{p.name}</strong><small>{p.role}</small><small className="roster-description">{p.description}</small><small className="roster-focus">{p.focus.join(" · ")}</small></div><i>↗</i></button>)}</div>}
   {panel==='vision'&&<div className="editorial-detail vision-detail"><div className="principle-tabs" aria-label="Princípios">{principles.map((p,i)=><button key={p.title} aria-pressed={principle===i} onClick={()=>setPrinciple(i)}><PrincipleIcon index={i}/>{p.title}</button>)}</div><div key={principle} className="principle-content"><p className="dialog-lead">{principles[principle].lead}</p><p>{principles[principle].subtitle}</p><ol className="principle-steps">{principles[principle].steps.map(([title,body],i)=><li key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol></div><p className="detail-note">O Grêmio não deve falar pelos alunos. Deve falar <strong>com</strong> os alunos — e transformar participação em ação.</p></div>}

   {panel==='symbol'&&<div className="editorial-detail"><img className="flag-detail" src="./uaj-bandeira.jpg" alt="Bandeira da União Avanço Jovem"/><p className="dialog-lead">Uma bandeira para lembrar que a escola muda quando a voz dos alunos deixa de ser fundo e vira direção.</p><h3>União</h3><p>Várias vozes. Uma direção.</p><h3>Voz</h3><p>Todo aluno merece espaço.</p><h3>Avanço</h3><p>Ideias que saem do papel.</p></div>}
   {panel==='commitment'&&<div className="editorial-detail"><p className="dialog-lead">Algumas propostas dependem de verba e aprovação. Nosso compromisso é tentar de verdade e mostrar cada etapa.</p><div className="status-list">{statuses.map(([icon,title,description],i)=><div key={title} className={`status-${i}`}><i>{icon}</i><div><strong>{title}</strong><p>{description}</p></div></div>)}</div><p>Gestão aberta. Escuta e transparência em cada etapa.</p><h3>Nosso foco</h3><p>Avanço científico, tecnológico e entretenimento.</p><p>Avante, juventude! O amanhã se faz hoje. Viva União Avanço Jovem.</p></div>}
  </Dialog>}
 </main>;
}
