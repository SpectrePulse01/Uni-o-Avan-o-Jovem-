import {useId,useRef,useState} from 'react';
// SVG and CSS keep the opening alive even when WebGL is unavailable.
const paths=[
 'M20 20H62V118Q62 151 88 151Q114 151 114 118V20H156V120Q156 193 88 193Q20 193 20 120Z',
 'M15 190L72 20H126L183 190H137L125 150H72L60 190ZM83 112H114L99 60Z',
 'M25 20H164V121Q164 193 95 193Q28 193 28 125H70Q70 151 95 151Q122 151 122 121V61H25Z'
];
export default function CompatibleStage({reduced}:{reduced:boolean}){
 const id=useId().replaceAll(':','');
 const drag=useRef<{x:number;y:number;rx:number;ry:number}|null>(null);
 const [angle,setAngle]=useState({x:-7,y:-13});
 return <div className={`compatible-stage ${reduced?'compatible-quiet':''}`} role="img" aria-label="Letras UAJ animadas, arraste para girar"
 onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,rx:angle.x,ry:angle.y};e.currentTarget.setPointerCapture(e.pointerId);}}
 onPointerMove={e=>{const d=drag.current;if(d)setAngle({x:Math.max(-35,Math.min(35,d.rx-(e.clientY-d.y)*.25)),y:Math.max(-65,Math.min(65,d.ry+(e.clientX-d.x)*.3))});}}
 onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null} onLostPointerCapture={()=>drag.current=null}>
 <div className="compatible-tilt" style={{transform:`rotateX(${angle.x}deg) rotateY(${angle.y}deg)`}}>
 <svg viewBox="0 0 660 300" className="compatible-letters" aria-hidden="true">
 <defs>{[['#fffef2','#9eabbc'],['#ff6679','#b6082b'],['#66a6ff','#1546bd']].map(([light,dark],i)=><linearGradient key={i} id={`${id}-letter-${i}`} x1="0" y1="0" x2=".85" y2="1"><stop stopColor={light}/><stop offset=".48" stopColor={light}/><stop offset="1" stopColor={dark}/></linearGradient>)}</defs>
 {paths.map((d,i)=><g key={i} transform={`translate(${20+i*207} 30)`}><g className={`compatible-letter letter-${i}`}>
 {Array.from({length:12},(_,n)=><path key={n} d={d} fill={['#5c6878','#79071f','#102c75'][i]} fillRule="evenodd" transform={`translate(${12-n} ${12-n})`}/>)}
 <path d={d} fill={`url(#${id}-letter-${i})`} fillRule="evenodd" stroke={['#eaf3ff','#ff7183','#87b7ff'][i]} strokeWidth="2"/>
 </g></g>)}
 <path className="compatible-ribbon" d="M25 244L635 277" stroke="#ef3e58" strokeWidth="4"/>
 </svg></div></div>;
}
