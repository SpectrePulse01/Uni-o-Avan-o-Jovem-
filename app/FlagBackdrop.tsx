import {useEffect,useRef,useState} from 'react';
export function flagProfile(width:number,height:number){
 return height>width&&width<=1024?(width<=600?'mobile':'tablet'):'desktop';
}
/** Dedicated portrait edits retain the full flag; desktop uses the original clip. */
export default function FlagBackdrop({active,reduced}:{active:boolean;reduced:boolean}){
 const ref=useRef<HTMLVideoElement>(null);
 const [profile,setProfile]=useState(()=>flagProfile(innerWidth,innerHeight));
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{
  const resize=()=>setProfile(flagProfile(innerWidth,innerHeight));
  window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);
 },[]);
 useEffect(()=>{setLoaded(false);},[profile]);
 useEffect(()=>{
  const video=ref.current;if(!video)return;
  let cancelled=false;
  const sync=()=>{
   if(!active||reduced||document.hidden){video.pause();return;}
   const playback=video.play();
   playback?.then(()=>{if(cancelled||document.hidden)video.pause();}).catch(()=>{});
  };
  sync();document.addEventListener('visibilitychange',sync);
  return()=>{cancelled=true;video.pause();document.removeEventListener('visibilitychange',sync);};
 },[active,reduced,profile]);
 const poster=profile==='desktop'?'./uaj-bandeira-realista-v1.webp':`./uaj-bandeira-${profile}.webp`;
 return <div className={`flag-cinema flag-${profile} ${active?'flag-active':''}`} aria-hidden="true">
  <img src={poster} alt=""/>
  <video key={profile} ref={ref} className={loaded?'film-ready':''} muted loop playsInline preload="metadata" poster={poster} onPlaying={()=>setLoaded(true)} onError={()=>setLoaded(false)}>
   {profile==='desktop'?<><source src="./uaj-bandeira-vento-v1.webm" type="video/webm"/><source src="./uaj-bandeira-vento-v1.mp4" type="video/mp4"/></>:<source src={`./uaj-bandeira-${profile}.mp4`} type="video/mp4"/>}
  </video>
  <div className="flag-cinema-shade"/>
 </div>;
}
