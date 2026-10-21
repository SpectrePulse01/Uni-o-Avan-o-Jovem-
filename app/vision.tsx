import type {CSSProperties} from 'react';
export const principles=[
 {title:'Escutar',subtitle:'Toda voz merece espaço.',lead:'Uma escola melhor começa com quem vive nela todos os dias.',steps:[['Dar espaço','Ouvir sugestões, dúvidas e necessidades dos alunos.'],['Entender juntos','Conversar sobre o que faz diferença na rotina da escola.'],['Definir prioridades','Transformar as demandas em pontos de partida para as propostas.']]},
 {title:'Construir',subtitle:'Ideias viram planos possíveis.',lead:'Participação ganha força quando uma ideia encontra um caminho para acontecer.',steps:[['Organizar a ideia','Definir o objetivo e quem pode participar.'],['Ver o que é possível','Conversar com a escola sobre recursos, regras e aprovação.'],['Trabalhar em equipe','Dividir responsabilidades e acompanhar cada etapa.']]},
 {title:'Mostrar',subtitle:'Transparência em cada etapa.',lead:'Você merece acompanhar o que avançou, o que está em andamento e o que não foi possível.',steps:[['Dar visibilidade','Apresentar o andamento das propostas.'],['Explicar os limites','Deixar claro o que depende de verba ou aprovação.'],['Manter a conversa','Ouvir o retorno dos alunos e ajustar o caminho.']]}
];
export function PrincipleIcon({index}:{index:number}){
 return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 {index===0?<><path d="M6 18v-4a10 10 0 0 1 20 0v4M6 14H4v9h5v-9H6m20 0h2v9h-5v-9h3M23 24q0 5-8 4"/><path d="M13 12v8m4-11v14m4-10v6"/></>:index===1?<><path d="m16 3 12 7-12 7L4 10Zm-12 14 12 7 12-7M4 24l12 6 12-6"/></>:<><rect x="4" y="5" width="24" height="22" rx="3"/><path d="M9 21v-5m7 5V10m7 11v-8M9 10h2"/></>}
 </svg>;
}
export function VisionSignal(){
 return <div className="vision-signal" aria-hidden="true"><span className="signal-kicker">CADA VOZ CONTA</span><div className="signal-wave">{[12,22,38,24,49,65,38,76,52,31,61,42,23,36,17].map((h,i)=><i key={i} style={{'--bar':`${h}%`,'--delay':`${i*-.13}s`} as CSSProperties}/>)}</div><div className="signal-caption"><span>VOZ</span><i/><span>AÇÃO</span></div></div>;
}
