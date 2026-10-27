import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {v4} from './config';
import {Scene} from './Scene';
import {SafeFallback} from './Fallback';
import {smooth,span,pageAt} from './motion';
const windowAlpha=(f:number,a:number,b:number,c:number,d:number)=>smooth(span(f,a,b))*(1-smooth(span(f,c,d)));
const Type:React.FC<{children:React.ReactNode;progress:number;size?:number}>=({children,progress,size=124})=><div style={{overflow:'hidden',paddingBottom:16}}><div style={{fontSize:size,fontWeight:700,lineHeight:1.17,letterSpacing:size<100?-2:-4,transform:`translateY(${(1-progress)*110}%)`}}>{children}</div></div>;
export const FallSenseCinematicIntroV4:React.FC<{forceFallback?:boolean}>=({forceFallback=false})=>{
 const f=useCurrentFrame(),a=pageAt(f),index=Math.round(a),ui=windowAlpha(f,710,760,1880,1940),brand=windowAlpha(f,425,470,580,625),observe=windowAlpha(f,145,205,365,425),respond=windowAlpha(f,1920,1980,2190,2260);
 return <AbsoluteFill style={{background:'radial-gradient(ellipse at 70% 20%,#fcf5fc 0%,#eaf7fb 65%,#e9ddf8 120%)',fontFamily:'Noto',color:'#25242d',overflow:'hidden'}}>
 <div style={{position:'absolute',inset:0,background:'#fcf9fc',opacity:smooth(span(f,2260,2390))}}/>
 <div style={{position:'absolute',left:110,top:310,zIndex:1,opacity:brand,clipPath:`inset(0 ${(1-smooth(span(f,425,475)))*100}% 0 0)`}}><div style={{fontSize:160,fontWeight:700,letterSpacing:-7}}>Fall<span style={{color:'#bd4c96'}}>Sense</span></div></div>
 {v4.useFallback||forceFallback?<SafeFallback f={f}/>:<ThreeCanvas width={1920} height={1080} dpr={1} shadows="soft" camera={{fov:42,near:.03,far:220,position:[.75,.5,1.35]}} gl={{alpha:true,antialias:true,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping}} style={{position:'absolute',inset:0,zIndex:2}} onCreated={({gl})=>{gl.setClearColor('#000000',0);gl.toneMappingExposure=1;}}><Scene f={f}/></ThreeCanvas>}
 <div style={{position:'absolute',left:105,top:100,zIndex:3,opacity:observe}}><Type progress={smooth(span(f,145,195))}>{v4.copy.observe}</Type><div style={{fontSize:28,letterSpacing:5,marginTop:24,color:'#8a6b83'}}>FALLSENSE / A LITTLE GUARDIAN</div></div>
 <div style={{position:'absolute',left:95,top:50,zIndex:4,opacity:ui}}><div style={{fontSize:27,letterSpacing:5,color:'#a4558b'}}>FALLSENSE</div><div style={{fontSize:58,fontWeight:700,marginTop:10}}>{v4.copy.recognize}</div></div>
 {v4.labels.map((label,i)=>{const opacity=ui*Math.max(0,1-Math.abs(a-i)*2);return <div key={label} style={{position:'absolute',right:100,top:62,zIndex:4,fontSize:37,fontWeight:700,opacity,transform:`translateY(${(1-opacity)*8}px)`}}>{label}</div>})}
 <div style={{position:'absolute',left:98,bottom:42,zIndex:4,fontSize:29,color:'#5c5364',padding:'10px 20px',background:'#fcf9fcde',borderRadius:50,opacity:ui}}>{index===1?'DEMO SIM · Điểm tổng hợp, không phải xác suất':index===4?'Thông tin liên hệ đã ẩn':index===0?'Camera trong ảnh chưa khởi động':'Giao diện thật được cung cấp'}</div>
 <div style={{position:'absolute',left:105,top:110,zIndex:4,opacity:respond}}><Type progress={smooth(span(f,1920,1980))} size={104}>{v4.copy.respond}</Type></div>
 <div style={{position:'absolute',left:100,bottom:48,zIndex:4,fontSize:28,color:'#75657b',opacity:windowAlpha(f,1830,1900,2050,2130)}}>Hình học minh họa · Không phải kết quả đo</div>
 <div style={{position:'absolute',left:115,top:205,width:1500,zIndex:4,opacity:smooth(span(f,2320,2380))}}><div style={{fontSize:27,letterSpacing:6,color:'#a4558b',marginBottom:48}}>FALLSENSE / A LITTLE GUARDIAN</div><Type progress={smooth(span(f,2320,2380))} size={78}>{v4.copy.final}</Type><div style={{width:110,height:5,background:'#bd4c96',marginTop:38}}/></div>
 <Audio src={staticFile(v4.music)} volume={n=>v4.gain*Math.max(0,Math.min(1,n/(v4.fadeIn*60),(v4.duration-n)/(v4.fadeOut*60)))}/>
 </AbsoluteFill>;
};
