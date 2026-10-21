import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {ExtrudeGeometry,Box3,Vector3} from 'three';
await build({entryPoints:['app/scene-engine.ts'],outfile:'tests/.geometry.mjs',bundle:true,format:'esm',platform:'node',packages:'external',logLevel:'silent'});
const {letterShapes}=await import('./.geometry.mjs');
const shapes=letterShapes();assert.equal(shapes.length,3);assert.equal(shapes[1].holes.length,1);
for(const shape of shapes){
 const geo=new ExtrudeGeometry(shape,{depth:.52,bevelEnabled:true,bevelSegments:4,bevelSize:.065,bevelThickness:.065,curveSegments:14});
 for(const attr of [geo.attributes.position,geo.attributes.normal])assert.ok([...attr.array].every(Number.isFinite));
 geo.computeBoundingBox();const size=geo.boundingBox.getSize(new Vector3());assert.ok(size.x>1&&size.x<2&&size.y>1&&size.y<2&&size.z>.5&&size.z<.8);
 assert.ok(geo.attributes.position.count>100);geo.dispose();
}
console.log('PASS: U/A/J shapes, A cutout, finite positions/normals and bounded bevel extrusion. GPU rendering not exercised.');
