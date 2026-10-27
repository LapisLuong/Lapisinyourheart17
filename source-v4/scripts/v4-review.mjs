import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import {resolveBrowser} from './browser.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const url=await bundle({entryPoint:'src/v4/index.tsx'});
const browser=await openBrowser('chrome',{browserExecutable:resolveBrowser(),chromiumOptions:{gl:'swangle'}});
try{
 const composition=await selectComposition({serveUrl:url,id:'FallSenseCinematicIntroV4',puppeteerInstance:browser});
 await mkdir('out/v4/review',{recursive:true});
 const frames=[0,90,180,300,535,650,760,1006,1100,1296,1450,1654,1833,1950,2070,2220,2390,2579];
 for(const frame of frames){await renderStill({serveUrl:url,composition,puppeteerInstance:browser,frame,output:`out/v4/review/${String(frame).padStart(5,'0')}.png`,scale:.5});console.log('V4 still',frame);}
 await writeFile('out/v4/review-manifest.json',JSON.stringify({frames,scale:.5},null,2));
}finally{await browser.close({silent:true});}
