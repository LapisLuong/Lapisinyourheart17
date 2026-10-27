import {bundle} from '@remotion/bundler';import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';import {resolveBrowser} from './browser.mjs';import {mkdir,writeFile} from 'node:fs/promises';
const boundaries=[90,210,285,390,535,590,730,1006,1151,1296,1475,1542,1654,1721,1833,1850,1900,2070,2140,2260,2390];
const serveUrl=await bundle({entryPoint:'src/v4/index.tsx'});const browser=await openBrowser('chrome',{browserExecutable:resolveBrowser(),chromiumOptions:{gl:'swangle'}});
try{const composition=await selectComposition({serveUrl,id:'FallSenseCinematicIntroV4',puppeteerInstance:browser});await mkdir('out/v4/boundaries',{recursive:true});
 for(const frame of boundaries.flatMap(f=>[f-6,f,f+6])){await renderStill({serveUrl,composition,puppeteerInstance:browser,frame,output:`out/v4/boundaries/${String(frame).padStart(5,'0')}.jpg`,imageFormat:'jpeg',scale:.5});console.log('Boundary frame',frame);}
 await writeFile('reports/v4/boundary-manifest.json',JSON.stringify({boundaries,offsets:[-6,0,6],scale:.5},null,2));
}finally{await browser.close({silent:true});}
