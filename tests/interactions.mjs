import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
import {build} from 'esbuild';
const mode=process.argv[2]||'desktop', mobile=mode==='mobile';
const window=new Window({url:'https://preview.test/'});
window.happyDOM.setWindowSize({width:mobile?390:1440,height:mobile?844:900});
for(const key of ['window','document','navigator','HTMLElement','HTMLInputElement','HTMLCanvasElement','HTMLDialogElement','HTMLMediaElement','SVGElement','Element','Node','NodeList','HTMLCollection','Document','DocumentFragment','MutationObserver','ResizeObserver','IntersectionObserver','HTMLVideoElement','getComputedStyle','requestAnimationFrame','cancelAnimationFrame','history','location']){
 const value=key==='window'?window:window[key];Object.defineProperty(globalThis,key,{configurable:true,value:typeof value==='function'&&['getComputedStyle','requestAnimationFrame','cancelAnimationFrame'].includes(key)?value.bind(window):value});
}
globalThis.innerHeight=window.innerHeight;globalThis.innerWidth=window.innerWidth;globalThis.devicePixelRatio=1;
const native=window.matchMedia.bind(window);
const match=query=>{const q=native(query);if(query.includes('prefers-reduced-motion'))Object.defineProperty(q,'matches',{value:mode==='reduced'});return q;};
globalThis.matchMedia=match;window.matchMedia=match;
window.Element.prototype.animate=undefined; // DOM test: exercise Motion's JS fallback, not native WAAPI.
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const errors=[];const originalError=console.error;
console.error=(...args)=>{
 // WebGL is intentionally unavailable in the DOM test environment. The real fallback is exercised.
 if(String(args[0]).includes('THREE.WebGLRenderer'))return;
 errors.push(args.map(String).join(' '));originalError(...args);
};
await build({entryPoints:['app/page.tsx'],outfile:'tests/.component.mjs',bundle:true,format:'esm',platform:'node',packages:'external',jsx:'automatic',logLevel:'silent'});
const React=await import('react'),{act}=React;
const {createRoot}=await import('react-dom/client');
const {default:Home}=await import('./.component.mjs');
const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
const settle=async(ms=330)=>{await act(async()=>{await new Promise(r=>setTimeout(r,ms));});};
const click=async el=>{assert.ok(el,'target exists');await act(async()=>el.click());await settle();};
const select=q=>document.querySelector(q);
await act(async()=>root.render(React.createElement(Home)));await settle();
assert.equal(select('.experience').classList.contains('reading-mode'),false);
assert.equal(document.querySelectorAll('.page').length,1);
assert.equal(select('.state-loading .compatible-stage'),null,'no provisional letters during loading');
assert.ok(select('.state-fallback .compatible-stage'),'WebGL failure keeps animated UAJ');
assert.equal(document.querySelectorAll('.compatible-letter').length,3);
assert.equal(select('.three-stage img'),null,'No mannequin substitutes for the opening');
for(let i=0;i<6;i++){
 await click(document.querySelectorAll('.desktop-nav button')[i]);
 assert.equal(select('.page').id,['inicio','simbolo','visao','propostas','equipe','compromisso'][i]);
 assert.equal(document.querySelectorAll('.page').length,1,'exactly one page after transition');
}
await click(document.querySelectorAll('.desktop-nav button')[3]);
const titles=["QR Codes pela escola","Mural de avisos","Novas propostas","Feira Jovem","Jornal Escolar","Grêmio Digital","Campanhas de caridade","Liderança em sala","Intervalo cultural","Campeonato de E-sports","Gincana escolar","Cinema na escola","Palestras profissionais","Jogos de Tabuleiro no Intervalo","Feira de Ciências","Festas culturais","Mais pátio no intervalo","Espaço de convivência","Olimpíadas do Conhecimento","Tecnologia e infraestrutura"];
for(let i=0;i<titles.length;i++){
 await click(document.querySelectorAll('.project-tabs button')[i]);
 assert.equal(select('.proposal-story h1').textContent,titles[i]);
 await click(select('.proposal-story .action'));
 assert.ok(select('dialog').open);
 assert.equal(document.querySelectorAll('.proposal-full li').length,3);
 assert.ok(select('.detail-note').textContent.length>15);
 await click(select('[aria-label="Fechar painel"]'));
 assert.equal(select('dialog'),null);
}
assert.equal(select('.project-navigation .round-button'),null);
await click(document.querySelectorAll('.project-tabs button')[0]);assert.equal(select('.proposal-story h1').textContent,'QR Codes pela escola');

const proposalKey=async(key,extra={})=>{await act(async()=>document.body.dispatchEvent(new window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,...extra})));await settle();};
await proposalKey('ArrowLeft');assert.equal(select('.proposal-story h1').textContent,'Tecnologia e infraestrutura');
await proposalKey('ArrowRight');assert.equal(select('.proposal-story h1').textContent,'QR Codes pela escola');
await proposalKey('ArrowRight',{ctrlKey:true});assert.equal(select('.proposal-story h1').textContent,'QR Codes pela escola');
await click(select('.proposal-story .action'));await proposalKey('ArrowRight');assert.equal(select('.proposal-story h1').textContent,'QR Codes pela escola');await click(select('[aria-label="Fechar painel"]'));

// Horizontal carousel gesture must not trigger a vertical page change.
await act(async()=>{
 const target=select('.proposal-layout');target.dispatchEvent(new window.PointerEvent('pointerdown',{bubbles:true,pointerType:'touch',clientX:250,clientY:250}));target.dispatchEvent(new window.PointerEvent('pointerup',{bubbles:true,pointerType:'touch',clientX:120,clientY:252}));
});await settle();assert.equal(select('.page').id,'propostas');assert.equal(select('.proposal-story h1').textContent,'Mural de avisos');
await click(document.querySelectorAll('.desktop-nav button')[4]);
const names=['Pedro','Gabriel Gentil','Fábio','Gabriel Garrido','Samuel','Yury','Yasmin','Kelvin','Karollyne','Pietro','Gabriely','Gabrielly Fer','Gustavo','Natasha','Karina','José Ricardo','Luciane Petrocelli'];
for(let i=0;i<names.length;i++){
 await click(select('.team-heading .text-link'));
 assert.equal(document.querySelectorAll('.team-list button').length,names.length);
 const options=document.querySelectorAll('.team-list button');assert.equal(options[i].querySelector('strong').textContent,names[i]);
 await click(options[i]);assert.equal(select('.member-copy h1').textContent.replaceAll(' ',''),names[i].replaceAll(' ',''));
 const personalized=['Pietro','Gabriel Garrido','Gabrielly Fer','Gustavo','Fábio','Karollyne','Pedro','Gabriel Gentil','Samuel','Yury','Yasmin','Kelvin','Gabriely','Natasha','Karina','José Ricardo','Luciane Petrocelli'].includes(names[i]);
 assert.equal(!!document.querySelector('.personal-avatar'),personalized);
 if(personalized)assert.equal(select('.personal-avatar').alt,`Avatar em estilo 3D de ${names[i]}`);

}
assert.equal(select('.member-navigation button'),null);
const press=async(key,target=document.body,extra={})=>{await act(async()=>target.dispatchEvent(new window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,...extra})));await settle();};
await press('ArrowRight');assert.equal(select('.member-copy h1').textContent,'Pedro');
await press('ArrowLeft');assert.equal(select('.member-copy h1').textContent,'LucianePetrocelli');
await press('ArrowLeft',document.body,{ctrlKey:true});assert.equal(select('.member-copy h1').textContent,'LucianePetrocelli');
await click(select('.team-heading .text-link'));
await press('ArrowRight');assert.equal(select('.member-copy h1').textContent,'LucianePetrocelli');
await click(select('[aria-label="Fechar painel"]'));
await act(async()=>{const target=select('.member-layout');target.dispatchEvent(new window.PointerEvent('pointerdown',{bubbles:true,pointerType:'touch',clientX:250,clientY:250}));target.dispatchEvent(new window.PointerEvent('pointerup',{bubbles:true,pointerType:'touch',clientX:120,clientY:252}));});await settle();
assert.equal(select('.member-copy h1').textContent,'Pedro');assert.equal(select('.page').id,'equipe');
await click(select('.menu-trigger'));assert.equal(document.querySelectorAll('.menu-list button').length,6);
await click(document.querySelectorAll('.menu-list button')[1]);assert.equal(select('.page').id,'simbolo');
assert.ok(select('.flag-active video'));assert.equal(select('.three-stage').classList.contains('stage-visible'),false);
for(const [width,height,profile] of [[390,844,'mobile'],[820,1180,'tablet'],[1440,900,'desktop'],[844,390,'desktop']]){
 await act(async()=>{globalThis.innerWidth=width;globalThis.innerHeight=height;window.dispatchEvent(new window.Event('resize'));});
 assert.ok(select('.flag-'+profile));
 assert.ok(select('.flag-active video source').getAttribute('src').includes(profile==='desktop'?'vento-v1':profile));
}

await click(select('.symbol-bottom .text-link'));assert.ok(select('.flag-detail'));await click(select('[aria-label="Fechar painel"]'));
await click(select('.motion-toggle'));assert.ok(select('.quiet'));assert.equal(select('.motion-toggle').getAttribute('aria-pressed'),'true');
// Vertical swipe still changes discrete pages on mobile.
await act(async()=>{const target=select('.page');target.dispatchEvent(new window.PointerEvent('pointerdown',{bubbles:true,pointerType:'touch',clientX:25,clientY:350}));target.dispatchEvent(new window.PointerEvent('pointerup',{bubbles:true,pointerType:'touch',clientX:25,clientY:200}));});
await settle();assert.equal(select('.page').id,'visao');
for(let i=0;i<3;i++){
 await click(document.querySelectorAll('.pillars>button')[i]);
 assert.equal(select('#dialog-title').textContent,['Escutar','Construir','Mostrar'][i]);
 assert.equal(document.querySelectorAll('.principle-steps li').length,3);
 const tabs=document.querySelectorAll('.principle-tabs button');await click(tabs[(i+1)%3]);
 assert.equal(select('#dialog-title').textContent,['Escutar','Construir','Mostrar'][(i+1)%3]);
 await click(select('[aria-label="Fechar painel"]'));
}
await click(document.querySelectorAll('.desktop-nav button')[5]);await click(select('.closing-bottom .text-link'));assert.equal(document.querySelectorAll('.status-list>div').length,4);await click(select('[aria-label="Fechar painel"]'));
await click(select('.closing-bottom .action'));assert.equal(select('.page').id,'inicio');
await act(async()=>root.unmount());window.happyDOM.abort();console.error=originalError;
assert.deepEqual(errors,[]);
console.log(`PASS ${mode}: discrete pages, 20 complete proposals, 17 profiles, all panels, gestures, wraparound, reduced motion and WebGL fallback. Real GPU/layout excluded.`);
