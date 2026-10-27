import React,{useLayoutEffect,useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {BrowserMesh,ShieldMascot} from './Assets';
import {cameraAt,pageAt,mascotPosition,mascotScale,revealAt,foldAt,fadeGallery,smooth,span,lerp} from './motion';
const Camera:React.FC<{f:number}>=({f})=>{const {camera,invalidate}=useThree();const s=cameraAt(f);useLayoutEffect(()=>{camera.position.set(...s.pos);camera.quaternion.set(...s.quaternion);(camera as THREE.PerspectiveCamera).fov=s.fov;(camera as THREE.PerspectiveCamera).updateProjectionMatrix();camera.updateMatrixWorld(true);invalidate();},[camera,invalidate,f]);return null;};
const PoseThread:React.FC<{f:number}>=({f})=>{
 const p=smooth(span(f,1830,1950))*(1-smooth(span(f,2060,2160)));
 const points=useMemo(()=>Array.from({length:18},(_,i)=>new THREE.Vector3(Math.sin(i*.54)*3,Math.cos(i*.54)*1.4,-1+Math.sin(i*.3))),[]);
 const geo=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),72,.012,6,false),[points]);
 return <group scale={Math.max(.0001,p)} rotation={[0,.25*smooth(span(f,1830,2160)),0]}>
 <mesh geometry={geo}><meshStandardMaterial color="#c878ab" roughness={.35}/></mesh>
 {points.map((v,i)=><mesh key={i} position={v}><sphereGeometry args={[.042,12,8]}/><meshStandardMaterial color={i%2?'#d9c7ee':'#c1e0df'} roughness={.3}/></mesh>)}
 </group>;
};
export const Scene:React.FC<{f:number}>=({f})=>{
 const a=pageAt(f),r=revealAt(f),fold=foldAt(f),fade=fadeGallery(f);
 return <><Camera f={f}/><ambientLight intensity={.65}/><hemisphereLight args={['#fff8ff','#c7c5db',.9]}/>
 <directionalLight position={[-3,6,5]} intensity={2.8} color="#fff3fa" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={6} shadow-camera-bottom={-5} shadow-bias={-.0005}/>
 <directionalLight position={[4,2,-3]} intensity={1.8} color="#c8eef6"/><pointLight position={[1,1,4]} intensity={3.5} distance={8} color="#ffe2f0"/>
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.47,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial transparent opacity={.13}/></mesh>
 <ShieldMascot f={f} shot={0} p={0} position={mascotPosition(f)} scale={mascotScale(f)}/>
 <group scale={Math.max(.00001,r*fade)}>
 {[0,1,2,3,4].map(i=>{const u=i-a,angle=i*Math.PI*2/5;return <BrowserMesh key={i} index={i} position={[lerp(u*6.8,Math.sin(angle)*1.05,fold),lerp(Math.sin(u*.65)*.35,Math.cos(angle)*.95,fold),lerp(-Math.abs(u)*1.4,-.3+i*.12,fold)]} rotation={[fold*(i%2?.3:-.3),lerp(-u*.14,angle*.35,fold),fold*Math.sin(angle)*.1]} scale={lerp(1,.15,fold)}/>;})}
 </group><PoseThread f={f}/></>;
};
