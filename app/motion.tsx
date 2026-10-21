import {motion} from 'motion/react';
import type {ReactNode} from 'react';
export const ease=[.22,1,.36,1] as const;
export function Title({lines,reduced=false,className=''}:{lines:ReactNode[];reduced?:boolean;className?:string}){
 return <h1 className={`display-title ${className}`}>{lines.map((line,i)=><span className="line-mask" key={i}><motion.span initial={reduced?false:{y:'110%',rotateX:35}} animate={{y:0,rotateX:0}} transition={{duration:reduced?0:.85,delay:reduced?0:.08+i*.085,ease}}>{line}</motion.span></span>)}</h1>;
}
export function Reveal({children,delay=0,className='',reduced=false}:{children:ReactNode;delay?:number;className?:string;reduced?:boolean}){
 return <motion.div className={className} initial={reduced?false:{y:18,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:reduced?0:.6,delay:reduced?0:delay,ease}}>{children}</motion.div>;
}
export function Action({children,onClick,secondary=false,reduced=false}:{children:ReactNode;onClick:()=>void;secondary?:boolean;reduced?:boolean}){
 return <motion.button className={`action ${secondary?'action-secondary':''}`} onClick={onClick} whileTap={reduced?undefined:{scale:.96}} whileHover={reduced?undefined:{y:-3}} transition={{duration:.2}}>{children}<span aria-hidden>↗</span></motion.button>;
}
