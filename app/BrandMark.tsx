import {useId} from 'react';
/** Small-format enamel seal: large readable shapes instead of miniature lettering. */
export default function BrandMark(){
 const id=useId().replace(/:/g,'');
 return <span className="brand-seal" aria-hidden="true"><svg viewBox="0 0 80 88" focusable="false">
 <defs><linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#399fff"/><stop offset=".5" stopColor="#1557b6"/><stop offset="1" stopColor="#08275e"/></linearGradient><linearGradient id={`${id}s`}><stop stopColor="#ad9c78"/><stop offset=".4" stopColor="#fff4d6"/><stop offset="1" stopColor="#b6a88a"/></linearGradient></defs>
 <path d="M18 26Q40 35 62 26V53Q62 70 40 80Q18 70 18 53Z" fill="#030915" stroke="#162842" strokeWidth="4" transform="translate(1 2)"/>
 <path d="M18 26Q40 35 62 26V53Q62 70 40 80Q18 70 18 53Z" fill={`url(#${id}b)`} stroke={`url(#${id}s)`} strokeWidth="1.6"/>
 <path d="M22 33V52Q22 66 40 75" fill="none" stroke="#91c9ff" strokeOpacity=".5"/>
 <g fill="#27664f" stroke="#6b9f73" strokeWidth=".6"><path d="M16 65Q4 59 7 48Q17 52 16 65ZM13 51Q2 44 6 34Q14 39 13 51ZM22 76Q8 76 7 66Q19 66 22 76Z"/><path d="M64 65Q76 59 73 48Q63 52 64 65ZM67 51Q78 44 74 34Q66 39 67 51ZM58 76Q72 76 73 66Q61 66 58 76Z"/></g>
 <path d="M26 40Q34 38 40 43Q46 38 54 40V60Q46 58 40 63Q34 58 26 60Z" fill="#f6edd7" stroke="#062859" strokeWidth="1.6"/><path d="M40 43V62M44 47h6m-6 5h6m-6 5h5" stroke="#58708c" strokeWidth="1"/>
 <path d="m33 44 1.3 3 3.2.3-2.4 2.2.8 3.2-2.9-1.7-2.9 1.7.8-3.2-2.4-2.2 3.2-.3Z" fill="#1c5794"/>
 <path d="M28 23v7q12 7 24 0v-7" fill="#0b1424" stroke="#c0b79d" strokeWidth="1"/><path d="m17 19 23-10 23 10-23 10Z" fill="#111d30" stroke={`url(#${id}s)`} strokeWidth="1.3"/><path d="M59 21v13" stroke="#dac9a3" strokeWidth="1.4"/>
 <path d="M29 67q11 5 22 0" fill="none" stroke="#eee0bd" strokeWidth="2"/><path d="M37 77h6v7h-6Z" fill="#bf3044"/><path d="M40 78v5m-2-2.5h4" stroke="#f4e4cb"/>
 </svg></span>;
}
