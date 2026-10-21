import {useEffect,useRef} from 'react';
import type {ReactNode} from 'react';
import {motion} from 'motion/react';
import {ease} from './motion';
export default function Dialog({title,onClose,children,reduced}:{title:string;onClose:()=>void;children:ReactNode;reduced:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
   const previous=document.activeElement as HTMLElement|null;
   ref.current?.showModal();
   return()=>{ref.current?.close();previous?.focus();};
 },[]);
 return <dialog ref={ref} className="detail-dialog" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}} aria-labelledby="dialog-title" data-no-page>
  <motion.div className="dialog-sheet" initial={reduced?false:{y:65,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.45,ease}}>
   <header className="dialog-head"><span>UNIÃO AVANÇO JOVEM</span><button onClick={onClose} aria-label="Fechar painel" autoFocus>×</button></header>
   <h2 id="dialog-title">{title}</h2>{children}
  </motion.div>
 </dialog>;
}
