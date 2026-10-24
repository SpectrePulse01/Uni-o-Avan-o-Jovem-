import { gsap } from 'gsap';
import type { Group, Mesh } from 'three';

// Own the transition lifecycle separately from the renderer. Repeated React
// effects must never cancel an in-flight assembly for the same state.
export function createSceneMotion(mono:Group,flag:Group,letters:Mesh[],wake:()=>void,onInteractive:(ready:boolean)=>void){
 let mode:number|undefined,quiet=false,assembled=false,interactive=false;
 let timeline:gsap.core.Timeline|null=null;
 let startedAt:number|undefined;
 const settle=()=>letters.forEach((letter,i)=>{
  letter.position.set((i-1)*1.52,0,0);
  letter.rotation.set(0,-.12+i*.08,0);
 });
 function setMode(next:number,reduced:boolean){
  if(next===mode&&quiet===reduced)return;
  mode=next;quiet=reduced;timeline?.kill();startedAt=undefined;interactive=false;onInteractive(false);
  const active=[0,1,5].includes(next);
  // Leaving during assembly settles it; returning never exposes stranded parts.
  if(!active){settle();assembled=true;return;}
  const intro=next===0&&!assembled&&!quiet;
  if(!intro){settle();assembled=true;}
  const finish=()=>{settle();assembled=true;interactive=true;onInteractive(true);wake();};
  // Advance by wall time from the first visible frame, not GSAP lag smoothing.
  timeline=gsap.timeline({paused:true,onComplete:finish});
  timeline.to(flag.scale,{x:next===1?1:0,y:next===1?1:0,z:next===1?1:0,duration:quiet?0:.7,ease:'power3.out'},0);
  timeline.to(mono.scale,{x:next===1?0:1,y:next===1?0:1,z:next===1?0:1,duration:quiet?0:.7,ease:'power3.out'},0);
  if(intro)letters.forEach((letter,i)=>{
   timeline!.fromTo(letter.position,{y:i===1?-.9:.8,z:-.55},{y:0,z:0,duration:1.1,ease:'power3.inOut'},.08+i*.08);
   timeline!.fromTo(letter.rotation,{x:-.18,y:.2,z:i===1?.035:-.035},{x:0,y:-.12+i*.08,z:0,duration:1.1,ease:'power3.inOut'},.08+i*.08);
  });
  // Zero-duration transitions must also unlock synchronously.
  if(quiet){timeline.progress(1);finish();}
  wake();
 }
 function advance(now:number){
  if(!timeline||interactive)return;
  startedAt??=now;
  timeline.totalTime(Math.min((now-startedAt)/1000,timeline.totalDuration()),false);
 }
 return {setMode,advance,canInteract:()=>interactive,isAnimating:()=>!!timeline&&!interactive&&[0,1,5].includes(mode??-1),dispose:()=>timeline?.kill()};
}
