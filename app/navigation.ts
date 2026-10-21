import {useCallback,useEffect,useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent} from 'react';
import {chapterIds} from './content';
export function usePages(blocked:boolean) {
 const initial=()=>Math.max(0,chapterIds.indexOf(location.hash.slice(1)));
 const [page,setPage]=useState(initial),[direction,setDirection]=useState(1);
 const current=useRef(page),lastWheel=useRef(0),wheelSum=useRef(0),lastMove=useRef(-1000),touch=useRef<{x:number;y:number}|null>(null);
 const go=useCallback((next:number)=>{
   next=Math.max(0,Math.min(5,next));if(current.current===next)return;
   setDirection(next>current.current?1:-1);current.current=next;setPage(next);
   history.replaceState(null,'','#'+chapterIds[next]);
 },[]);
 useEffect(()=>{
   const hash=()=>{const n=chapterIds.indexOf(location.hash.slice(1));if(n>=0)go(n);};
   const key=(e:KeyboardEvent)=>{
     if(blocked||e.ctrlKey||e.metaKey||e.altKey||(e.target as HTMLElement).closest('button,a,input,textarea,select,[role="dialog"]'))return;
     if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();go(current.current+1);}
     if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(current.current-1);}
     if(e.key==='Home'){e.preventDefault();go(0);}if(e.key==='End'){e.preventDefault();go(5);}
   };
   const wheel=(e:WheelEvent)=>{
     if(blocked||e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||(e.target as HTMLElement).closest('[data-no-page]'))return;
     e.preventDefault();const t=performance.now();if(t-lastWheel.current>170)wheelSum.current=0;lastWheel.current=t;
     if(t-lastMove.current<800)return;
     wheelSum.current+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
     if(Math.abs(wheelSum.current)>70){go(current.current+Math.sign(wheelSum.current));wheelSum.current=0;lastMove.current=t;}
   };
   window.addEventListener('keydown',key);window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('hashchange',hash);
   return()=>{window.removeEventListener('keydown',key);window.removeEventListener('wheel',wheel);window.removeEventListener('hashchange',hash);};
 },[go,blocked]);
 const onPointerDown=(e:ReactPointerEvent)=>{
   touch.current=null;if(blocked||e.pointerType!=='touch'||(e.target as HTMLElement).closest('button,a,[data-no-page]'))return;
   touch.current={x:e.clientX,y:e.clientY};
 };
 const onPointerUp=(e:ReactPointerEvent)=>{
   if(!touch.current||blocked)return;const dx=e.clientX-touch.current.x,dy=e.clientY-touch.current.y;touch.current=null;
   if(Math.abs(dy)>55&&Math.abs(dy)>Math.abs(dx)*1.2)go(current.current+(dy<0?1:-1));
 };
 return {page,direction,go,onPointerDown,onPointerUp,onPointerCancel:()=>{touch.current=null;}};
}
