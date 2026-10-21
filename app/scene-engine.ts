import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createSceneMotion } from './scene-motion';

export type Engine = { setMode:(mode:number,quiet:boolean)=>void; dispose:()=>void };

export function letterShapes() {
  const u=new T.Shape();
  u.moveTo(-.64,.78);u.lineTo(-.24,.78);u.lineTo(-.24,-.23);u.quadraticCurveTo(-.24,-.48,0,-.48);u.quadraticCurveTo(.24,-.48,.24,-.23);u.lineTo(.24,.78);u.lineTo(.64,.78);u.lineTo(.64,-.24);u.bezierCurveTo(.64,-.96,-.64,-.96,-.64,-.24);u.closePath();
  const a=new T.Shape();
  a.moveTo(-.72,-.78);a.lineTo(-.25,.78);a.lineTo(.25,.78);a.lineTo(.72,-.78);a.lineTo(.3,-.78);a.lineTo(.2,-.39);a.lineTo(-.2,-.39);a.lineTo(-.3,-.78);a.closePath();
  const hole=new T.Path();hole.moveTo(-.13,-.06);hole.lineTo(.13,-.06);hole.lineTo(0,.42);hole.closePath();a.holes.push(hole);
  const j=new T.Shape();j.moveTo(-.47,.78);j.lineTo(.57,.78);j.lineTo(.57,-.25);j.bezierCurveTo(.57,-.97,-.65,-.97,-.65,-.27);j.lineTo(-.25,-.27);j.quadraticCurveTo(-.25,-.49,-.03,-.49);j.quadraticCurveTo(.17,-.49,.17,-.25);j.lineTo(.17,.39);j.lineTo(-.47,.39);j.closePath();
  return [u,a,j];
}

export function createScene(host:HTMLElement,onReady:()=>void,onFail:()=>void,onInteractive:(ready:boolean)=>void):Engine {
  const mobile=matchMedia('(pointer:coarse)').matches;
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'default'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:1.8));
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping; renderer.toneMappingExposure=1.35;
  renderer.setClearColor(0x000000,0);
  host.appendChild(renderer.domElement);
  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(33,1,.1,60);camera.position.set(0,.15,9.4);
  const pmrem=new T.PMREMGenerator(renderer);
  const room=new RoomEnvironment(); const environment=pmrem.fromScene(room,.04); scene.environment=environment.texture;room.dispose();pmrem.dispose();
  const ambient=new T.HemisphereLight(0xe0efff,0x111321,2.6);scene.add(ambient);
  const key=new T.DirectionalLight(0xffffff,4);key.position.set(-3,5,6);scene.add(key);
  const rim=new T.DirectionalLight(0x629fff,3);rim.position.set(4,1,-2);scene.add(rim);
  const redLight=new T.PointLight(0xff163b,28,14);redLight.position.set(-4,-1,3);scene.add(redLight);
  const rig=new T.Group();scene.add(rig);
  const mono=new T.Group();rig.add(mono);
  const letters:T.Mesh[]=[];
  const colors=[0xe8e8e2,0xe32642,0x236af7];
  const disposables:T.Texture[]=[];
  letterShapes().forEach((shape,i)=>{
    const geo=new T.ExtrudeGeometry(shape,{depth:.52,bevelEnabled:true,bevelSegments:4,bevelSize:.065,bevelThickness:.065,curveSegments:14,steps:1});
    geo.translate(0,0,-.26);
    const front=new T.MeshStandardMaterial({color:colors[i],metalness:.8,roughness:.22,envMapIntensity:1.6});
    const edge=new T.MeshStandardMaterial({color:colors[i],metalness:.95,roughness:.16,envMapIntensity:2});
    const mesh=new T.Mesh(geo,[front,edge]);mesh.position.x=(i-1)*1.52;mesh.rotation.y=-.12+(i*.08);mono.add(mesh);letters.push(mesh);
  });
  // A beveled red and blue ribbon echoes the diagonal of the original flag.
  const ribbonGeo=new T.BoxGeometry(5.4,.035,.035);
  const ribbon=new T.Mesh(ribbonGeo,new T.MeshStandardMaterial({color:0xeb3048,metalness:.7,roughness:.3}));
  ribbon.rotation.z=-.17;ribbon.position.set(0,-1.17,-.35);mono.add(ribbon);
  const flag=new T.Group();rig.add(flag);flag.scale.setScalar(0);
  const flagGeo=new T.PlaneGeometry(5,2.82,mobile?32:48,mobile?18:28);
  const flagMaterial=new T.MeshStandardMaterial({color:0xffffff,roughness:.68,metalness:.08,side:T.DoubleSide});
  const cloth=new T.Mesh(flagGeo,flagMaterial);flag.add(cloth);
  const loader=new T.TextureLoader();
  let disposed=false;
  loader.load('./uaj-bandeira.jpg',texture=>{
    if(disposed){texture.dispose();return;}
    texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    flagMaterial.map=texture;flagMaterial.needsUpdate=true;disposables.push(texture);wake();
  },undefined,()=>{ /* The optional flag texture must never disable the UAJ sculpture. */ });
  const pole=new T.Mesh(new T.CylinderGeometry(.024,.024,3.8,12),new T.MeshStandardMaterial({color:0xbfc8d8,metalness:.9,roughness:.17}));pole.position.set(-2.53,-.4,0);flag.add(pole);
  const finial=new T.Mesh(new T.SphereGeometry(.065,12,8),new T.MeshStandardMaterial({color:0xe6e6e6,metalness:.9,roughness:.15}));finial.position.set(-2.53,1.53,0);flag.add(finial);
  const base=Float32Array.from(flagGeo.attributes.position.array);
  let mode=0,quiet=false,active=true,frame=0,last=0,elapsed=0,drag=false,px=0,py=0,tx=-.28,ty=.13,rx=0,ry=0,failed=false;
  const choreography=createSceneMotion(mono,flag,letters,wake,onInteractive);
  function resize(){
    const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
    renderer.setSize(w,h,false);camera.aspect=w/h;
    // Fit the complete sculpture even on very tall or narrow canvases.
    const verticalFov=T.MathUtils.degToRad(camera.fov);
    const required=Math.max(2.1/Math.tan(verticalFov/2),3.05/(Math.tan(verticalFov/2)*camera.aspect));
    camera.position.z=Math.max(6.7,required);camera.updateProjectionMatrix();draw();
  }
  function draw(){
    if(disposed||failed)return;
    try{renderer.render(scene,camera);}catch{failed=true;cancelAnimationFrame(frame);onFail();}
  }
  function tick(now:number){
    frame=0;if(disposed||failed||!active||document.hidden)return;
    const dt=Math.min((now-last)/1000||.016,.05);last=now;elapsed+=dt;
    const smoothing=1-Math.exp(-8*dt);rx+=(ty-rx)*smoothing;ry+=(tx-ry)*smoothing;
    rig.rotation.set(rx,ry,quiet?0:Math.sin(elapsed*.45)*.018);
    rig.position.y=quiet?0:Math.sin(elapsed*.8)*.045;
    if(mode===1){
      const pos=flagGeo.attributes.position;
      for(let i=0;i<pos.count;i++){
        const x=base[i*3], y=base[i*3+1], weight=(x+2.5)/5;
        pos.setZ(i,(Math.sin(x*2.3-elapsed*2.2)*.16+Math.sin(y*3+x-elapsed*1.5)*.06)*weight);
      }
      pos.needsUpdate=true;flagGeo.computeVertexNormals();
    }
    draw();
    if(!quiet||drag||Math.abs(tx-ry)+Math.abs(ty-rx)>.002||choreography.isAnimating())frame=requestAnimationFrame(tick);
  }
  function wake(){if(!frame&&active&&!document.hidden&&!disposed){last=performance.now();frame=requestAnimationFrame(tick);}}
  function reset(){tx=mode===1?-.15:-.28;ty=mode===1?.04:.13;wake();}
  function setMode(next:number,reduced:boolean){
    mode=next;quiet=reduced;active=[0,1,5].includes(next);drag=false;
    choreography.setMode(next,reduced);
    if(!active){cancelAnimationFrame(frame);frame=0;return;}
    reset();wake();
  }

  const down=(e:PointerEvent)=>{if(!active||!choreography.canInteract())return;drag=true;px=e.clientX;py=e.clientY;host.setPointerCapture(e.pointerId);wake();};
  const move=(e:PointerEvent)=>{if(!drag)return;tx+=(e.clientX-px)*.008;ty=Math.max(-.65,Math.min(.65,ty+(e.clientY-py)*.006));px=e.clientX;py=e.clientY;wake();};
  const up=()=>{drag=false;wake();};
  const lost=(e:Event)=>{e.preventDefault();failed=true;cancelAnimationFrame(frame);onFail();};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();};
  host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);
  renderer.domElement.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',visibility);
  const observer=new ResizeObserver(resize);observer.observe(host);resize();if(!failed)onReady();
  return {setMode,dispose:()=>{
    disposed=true;cancelAnimationFrame(frame);choreography.dispose();observer.disconnect();document.removeEventListener('visibilitychange',visibility);
    host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',up);
    renderer.domElement.removeEventListener('webglcontextlost',lost);
    scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});
    disposables.forEach(t=>t.dispose());environment.dispose();renderer.dispose();renderer.domElement.remove();
  }};
}
