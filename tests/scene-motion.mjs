import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Group,Mesh} from 'three';
import {gsap} from 'gsap';
await build({entryPoints:['app/scene-motion.ts'],outfile:'tests/.scene-motion.mjs',bundle:true,format:'esm',platform:'node',packages:'external',logLevel:'silent'});
const {createSceneMotion}=await import('./.scene-motion.mjs');
function fixture(){
 const mono=new Group(),flag=new Group(),letters=[new Mesh(),new Mesh(),new Mesh()];
 const motion=createSceneMotion(mono,flag,letters,()=>{},()=>{});
 return {mono,flag,letters,motion};
}
const finish=()=>gsap.globalTimeline.getChildren(false,true,true).forEach(t=>t.progress(1));
const settled=f=>f.letters.forEach((l,i)=>{assert.equal(l.position.y,0);assert.equal(l.position.z,0);assert.equal(l.rotation.x,0);assert.equal(l.rotation.z,0);assert.equal(l.position.x,(i-1)*1.52);});
const f=fixture();
f.motion.setMode(0,false);assert.ok(f.letters[0].position.y>0);assert.ok(f.letters[1].position.y<0);assert.equal(f.motion.canInteract(),false);
f.motion.setMode(0,false); // regression: duplicate setup previously killed assembly
finish();settled(f);assert.equal(f.motion.canInteract(),true);
f.motion.setMode(1,false);finish();assert.equal(f.flag.scale.x,1);assert.equal(f.mono.scale.x,0);
f.motion.setMode(0,false);finish();settled(f);assert.equal(f.mono.scale.x,1);f.motion.dispose();
const interrupted=fixture();interrupted.motion.setMode(0,false);interrupted.motion.setMode(2,false);interrupted.motion.setMode(0,false);finish();settled(interrupted);assert.equal(interrupted.motion.canInteract(),true);interrupted.motion.dispose();
const reduced=fixture();reduced.motion.setMode(0,true);settled(reduced);assert.equal(reduced.motion.canInteract(),true);reduced.motion.dispose();
const pause=fixture();pause.motion.setMode(0,false);pause.motion.setMode(0,true);settled(pause);assert.equal(pause.motion.canInteract(),true);pause.motion.dispose();
const slow=fixture();slow.motion.setMode(0,false);slow.motion.advance(1000);
assert.ok(Math.abs(slow.letters[0].rotation.x)<=.18,'entrance uses a small tilt');
slow.motion.advance(2600);settled(slow);assert.equal(slow.motion.canInteract(),true,'a stalled frame must not stretch assembly');slow.motion.dispose();
gsap.ticker.sleep();console.log('PASS: separated entrance, duplicate initialization, assembly completion, interaction lock, flag transition, navigation interruption and reduced motion.');
