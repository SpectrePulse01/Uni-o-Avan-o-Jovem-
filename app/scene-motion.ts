import { gsap } from 'gsap';
import type { Group, Mesh } from 'three';

// Own the transition lifecycle separately from the renderer. Repeated React
// effects must never cancel an in-flight assembly for the same state.
export function createSceneMotion(mono:Group,flag:Group,letters:Mesh[],wake:()=>void,onInteractive:(ready:boolean)=>void){
 let mode:number|undefined,quiet=false,assembled=false,interactive=false;
 let timeline:gsap.core.Timeline|null=null;
 const settle=()=>letters.forEach((letter,i)=>{
  letter.position.set((i-1)*1.52,0,0);
  letter.rotation.set(0,-.12+i*.08,0);
 });
 function setMode(next:number,reduced:boolean){
  if(next===mode&&quiet===reduced)return;
  mode=next;quiet=reduced;timeline?.kill();interactive=false;onInteractive(false);
  const active=[0,1,5].includes(next);
  // Leaving during assembly settles it; returning never exposes stranded parts.
  if(!active){settle();assembled=true;return;}
  const intro=next===0&&!assembled&&!quiet;
  if(!intro){settle();assembled=true;}
  const finish=()=>{settle();assembled=true;interactive=true;onInteractive(true);wake();};
  timeline=gsap.timeline({onUpdate:wake,onComplete:finish});
  timeline.to(flag.scale,{x:next===1?1:0,y:next===1?1:0,z:next===1?1:0,duration:quiet?0:.7,ease:'power3.out'},0);
  timeline.to(mono.scale,{x:next===1?0:1,y:next===1?0:1,z:next===1?0:1,duration:quiet?0:.7,ease:'power3.out'},0);
  if(intro)letters.forEach((letter,i)=>{
   timeline!.fromTo(letter.position,{y:i===1?-1.55:1.35,z:-1.2},{y:0,z:0,duration:1.35,ease:'power3.inOut'},.18+i*.12);
   timeline!.fromTo(letter.rotation,{x:-.8,y:.8,z:i===1?.12:-.12},{x:0,y:-.12+i*.08,z:0,duration:1.35,ease:'power3.inOut'},.18+i*.12);
  });
  // Zero-duration transitions must also unlock synchronously.
  if(quiet){timeline.progress(1);finish();}
  wake();
 }
 return {setMode,canInteract:()=>interactive,isAnimating:()=>!!timeline?.isActive(),dispose:()=>timeline?.kill()};
}
