import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import {resolveBrowser} from './browser.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const frames=[650,1100,1900,2150],records=[];
for(const version of ['v3','v4']){
 const serveUrl=await bundle({entryPoint:`src/${version}/index.tsx`});
 const browser=await openBrowser('chrome',{browserExecutable:resolveBrowser(),chromiumOptions:{gl:'swangle'}});
 try{
  const composition=await selectComposition({serveUrl,id:version==='v3'?'FallSenseCinematicIntroV3':'FallSenseCinematicIntroV4',puppeteerInstance:browser});
  const dir=`out/v4/determinism/${version}`;await mkdir(dir,{recursive:true});
  const render=async(frame,pass)=>{await renderStill({serveUrl,composition,puppeteerInstance:browser,frame,output:`${dir}/${pass}-${frame}.png`,scale:.5});console.log(version,pass,frame);};
  for(const f of frames)await render(f,'c1-forward');
  const reverse=[...frames].reverse();for(let i=0;i<reverse.length;i+=2)await Promise.all(reverse.slice(i,i+2).map(f=>render(f,'c2-reverse')));
  records.push({version,frames,orders:['forward concurrency=1','reverse batches concurrency=2'],scale:.5});
 }finally{await browser.close({silent:true});}
}
await writeFile('reports/v4/determinism-capture.json',JSON.stringify(records,null,2));
