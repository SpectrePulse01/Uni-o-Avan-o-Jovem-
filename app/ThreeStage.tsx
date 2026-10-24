import { useEffect, useRef, useState } from 'react';
import CompatibleStage from './CompatibleStage';
import type { Engine } from './scene-engine';
export default function ThreeStage({page,reduced}:{page:number;reduced:boolean}) {
 const host=useRef<HTMLDivElement>(null), engine=useRef<Engine|null>(null);
 const latest=useRef({page,reduced});latest.current={page,reduced};
 const [interactive,setInteractive]=useState(false);
 const [state,setState]=useState<'loading'|'ready'|'fallback'>('loading');
 useEffect(()=>{
   let cancelled=false;
   import('./scene-engine').then(({createScene})=>{
     if(cancelled||!host.current)return;
     try{engine.current=createScene(host.current,()=>setState('ready'),()=>setState('fallback'),setInteractive);engine.current.setMode(latest.current.page===1?2:latest.current.page,latest.current.reduced);}
     catch{setState('fallback');}
   }).catch(()=>{if(!cancelled)setState('fallback');});
   return()=>{cancelled=true;engine.current?.dispose();engine.current=null;};
 },[]);
 useEffect(()=>{engine.current?.setMode(page===1?2:page,reduced);},[page,reduced]);
 const active=[0,5].includes(page);
 return <div className={`three-stage stage-${page} ${active?'stage-visible':''} ${interactive?'can-drag':'assembling'} state-${state}`} aria-hidden={!active} inert={!active} data-no-page>
   {state==='fallback'&&active&&<CompatibleStage key={page} reduced={reduced}/>}

   <div className="webgl-host" ref={host} role="img" aria-label={page===1?'Bandeira U.A.J. em 3D, arraste para girar':'Escultura U.A.J. em 3D, arraste para girar'} />
 </div>;
}
