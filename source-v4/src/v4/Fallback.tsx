import React from 'react';
import {Img,staticFile} from 'remotion';
import {FallbackMascot} from '../v3/Fallback';
import {pageAt,span,smooth} from './motion';
import {v4} from './config';
// Explicit recovery preview only. The verified V4 delivery uses actual Three meshes.
export const SafeFallback:React.FC<{f:number}>=({f})=>{
 const ui=smooth(span(f,590,730))*(1-smooth(span(f,1900,2160)));const index=Math.round(pageAt(f));
 return <><div style={{position:'absolute',left:f>2250?1550:1050,top:f>2250?600:240,opacity:1-ui*.9}}><FallbackMascot size={f>2250?220:520}/></div>
 <div style={{position:'absolute',left:250,top:240,width:1420,opacity:ui,border:'3px solid white',borderRadius:24,overflow:'hidden'}}><Img src={staticFile(`assets/${v4.screenshots[index]}`)} style={{display:'block',width:'100%'}}/>{index===4&&<div style={{position:'absolute',left:'24%',right:'24%',top:'58%',bottom:'10%',background:'#f5e9f3'}}/>}</div></>;
};
