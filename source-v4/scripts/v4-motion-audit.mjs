import ts from 'typescript';
import * as THREE from 'three';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const dir='out/v4/audit-runtime';await mkdir(dir,{recursive:true});
for(const [input,output] of [['src/v3/config.ts','config'],['src/v3/Scene.tsx','Scene'],['src/v4/motion.ts','motion']]){
 let text=await readFile(input,'utf8');if(output==='Scene')text=text.replace('"./config"','"./config.cjs"');
 const js=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 await writeFile(`${dir}/${output}.cjs`,js);
}
await copyFile('src/v3/beat-map.json',`${dir}/beat-map.json`);
const require=createRequire(import.meta.url);const scene=require(`../${dir}/Scene.cjs`),config=require(`../${dir}/config.cjs`),v4=require(`../${dir}/motion.cjs`);
function oldCam(f){const s=config.shotAt(f),p=(f-s.startFrame)/(s.endFrame-s.startFrame);const c=scene.cameraFor(s.id,p);
 if([4,9,16,18,21,23,25].includes(s.id)){const first=scene.cameraFor(s.id,0),last=scene.cameraFor(s.id,1),a=new THREE.Vector3(...first.pos),b=new THREE.Vector3(...last.pos),control=a.clone().add(b).multiplyScalar(.5).add(new THREE.Vector3(.25,.2,.25));c.pos=new THREE.QuadraticBezierCurve3(a,control,b).getPoint(config.out(p)).toArray();}
 return c.pos;
}
function oldPage(f){const s=config.shotAt(f),p=(f-s.startFrame)/(s.endFrame-s.startFrame),id=s.id;return id<=17?0:id===18?config.out(p):id<=20?1:id===21?1+config.out(p):id===22?2:id===23?2+config.out(p):id===24?3:id===25?3+config.out(p):4;}
function metrics(fn,a,b){let maxStep=0,maxAcc=0,maxJerk=0;for(let f=a+3;f<b;f++){const p=[0,1,2,3].map(i=>fn(f-i));const v=p[0].map((x,i)=>x-p[1][i]);const acc=p[0].map((x,i)=>x-2*p[1][i]+p[2][i]);const jerk=p[0].map((x,i)=>x-3*p[1][i]+3*p[2][i]-p[3][i]);maxStep=Math.max(maxStep,Math.hypot(...v));maxAcc=Math.max(maxAcc,Math.hypot(...acc));maxJerk=Math.max(maxJerk,Math.hypot(...jerk));}return {maxUnitsPerFrame:maxStep,maxDeltaVelocity:maxAcc,maxDiscreteJerk:maxJerk};}
const jumps=config.v3.shots.slice(1).map(s=>({frame:s.startFrame,seconds:s.startFrame/60,previousToNextDistance:Math.hypot(...oldCam(s.startFrame).map((x,i)=>x-oldCam(s.startFrame-1)[i]))})).filter(j=>j.previousToNextDistance>.4);
const result={interpretation:'V3 discontinuities include deliberate editorial cuts; these are not decoded dropped frames. V4 changes to a continuous camera and C2 object paths, intentionally reducing that discontinuity.',cameraV3:metrics(oldCam,0,2580),cameraV4:metrics(f=>v4.cameraAt(f).pos,0,2580),pageV3:metrics(f=>[oldPage(f)],1006,1900),pageV4:metrics(f=>[v4.pageAt(f)],1006,1900),v3LargeCameraCuts:jumps};
await writeFile('reports/v4/trajectory-metrics.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
