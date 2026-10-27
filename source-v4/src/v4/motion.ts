import * as THREE from 'three';
export type V=[number,number,number];
export const span=(f:number,a:number,b:number)=>Math.max(0,Math.min(1,(f-a)/(b-a)));
export const smooth=(t:number)=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(10+x*(-15+6*x));};
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export type Key={f:number;v:number[]};
// Piecewise quintic stop/hold curves: C2 continuous at every key, no shot-local reset.
export function track(f:number,keys:Key[]):number[]{
 if(f<=keys[0].f)return [...keys[0].v];
 for(let i=0;i<keys.length-1;i++)if(f<=keys[i+1].f){const t=smooth(span(f,keys[i].f,keys[i+1].f));return keys[i].v.map((a,j)=>lerp(a,keys[i+1].v[j],t));}
 return [...keys[keys.length-1].v];
}
export const cameraKeys=[
 {f:0,pos:[.75,.50,1.35] as V,target:[.6,.4,.4] as V,fov:42},
 {f:90,pos:[.25,.25,2.6] as V,target:[0,.18,.4] as V,fov:40},
 {f:210,pos:[3,1.1,7.0] as V,target:[-.65,-.1,0] as V,fov:37},
 {f:390,pos:[1.2,.55,6.5] as V,target:[-.65,-.1,0] as V,fov:40},
 {f:590,pos:[.8,.3,8] as V,target:[0,-.1,0] as V,fov:40},
 {f:730,pos:[0,.1,7.3] as V,target:[0,0,0] as V,fov:38},
 {f:1850,pos:[0,.1,7.3] as V,target:[0,0,0] as V,fov:38},
 {f:2070,pos:[0,.4,8.1] as V,target:[0,0,0] as V,fov:40},
 {f:2260,pos:[0,.25,7.1] as V,target:[0,-.1,0] as V,fov:38},
 {f:2390,pos:[0,0,8] as V,target:[0,0,0] as V,fov:40},
 {f:2580,pos:[0,0,8] as V,target:[0,0,0] as V,fov:40},
];
const rotations=cameraKeys.map(k=>{const m=new THREE.Matrix4().lookAt(new THREE.Vector3(...k.pos),new THREE.Vector3(...k.target),new THREE.Vector3(0,1,0));return new THREE.Quaternion().setFromRotationMatrix(m);});
export function cameraAt(f:number){
 const found=cameraKeys.findIndex((k,j)=>j<cameraKeys.length-1&&f<=cameraKeys[j+1].f);
 const i=found<0?cameraKeys.length-2:found;
 const k=cameraKeys[i],next=cameraKeys[i+1],t=smooth(span(f,k.f,next.f));
 const pos=k.pos.map((v,j)=>lerp(v,next.pos[j],t)) as V;
 // Very gentle orbit in the UI chapter; its envelope and derivatives vanish at boundaries.
 const ui=span(f,730,1850);const envelope=Math.pow(Math.sin(Math.PI*ui),4);
 pos[0]+=.32*Math.sin(2*Math.PI*ui)*envelope;pos[1]+=.12*Math.sin(Math.PI*ui)*envelope;
 return {pos,quaternion:rotations[i].clone().slerp(rotations[i+1],t).toArray(),fov:lerp(k.fov,next.fov,t)};
}
export const pageKeys:Key[]=[{f:0,v:[0]},{f:1006,v:[0]},{f:1151,v:[1]},{f:1296,v:[1]},{f:1475,v:[2]},{f:1542,v:[2]},{f:1654,v:[3]},{f:1721,v:[3]},{f:1833,v:[4]},{f:2580,v:[4]}];
export const pageAt=(f:number)=>track(f,pageKeys)[0];
export const mascotPosition=(f:number)=>track(f,[{f:0,v:[0,0,0]},{f:390,v:[0,0,0]},{f:535,v:[2.3,-.1,0]},{f:720,v:[3.7,-1.0,-1.5]},{f:1890,v:[3.7,-1.0,-1.5]},{f:2150,v:[0,0,.3]},{f:2260,v:[0,0,.3]},{f:2390,v:[4,-.8,0]},{f:2580,v:[4,-.8,0]}]) as V;
export const mascotScale=(f:number)=>track(f,[{f:0,v:[1]},{f:535,v:[1]},{f:720,v:[.45]},{f:1890,v:[.45]},{f:2150,v:[1]},{f:2260,v:[1]},{f:2390,v:[.46]},{f:2580,v:[.46]}])[0];
export const revealAt=(f:number)=>smooth(span(f,570,730));
export const foldAt=(f:number)=>smooth(span(f,1900,2140));
export const fadeGallery=(f:number)=>1-smooth(span(f,2150,2250));
export const phases=[0,90,210,285,390,535,590,730,1006,1151,1296,1475,1542,1654,1721,1833,1850,1900,2070,2140,2260,2390,2580];
