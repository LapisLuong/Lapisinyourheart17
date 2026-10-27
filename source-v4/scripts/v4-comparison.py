from pathlib import Path
from PIL import Image,ImageDraw
import subprocess,hashlib,json
start=1006/60;duration=241/60
subprocess.run(['ffmpeg','-y','-v','error','-ss',str(start),'-i','out/FallSense_Cinematic_Intro_FINAL.mp4','-t',str(duration),'-vf','scale=960:540','-c:v','libx264','-preset','fast','-crf','18','-c:a','aac','-b:a','192k','out/v4/V3_Matched_Proof.mp4'],check=True)
paths={'previous':'out/v4/V3_Matched_Proof.mp4','new':'out/v4/V4_Motion_Proof.mp4'}
order=['previous','new'] if hashlib.sha256(b'FallSense smoothness review v4').digest()[0]&1 else ['new','previous']
Path('reports/v4/ab-map.json').write_text(json.dumps(dict(zip(['A','B'],order)),indent=2))
img=Image.new('RGB',(1920,1160),'white');d=ImageDraw.Draw(img)
for row,(label,name) in enumerate(zip(['A','B'],order)):
 for j,t in enumerate([.1,1.,2.,3.]):
  p=Path(f'out/v4/ab-{label}-{j}.jpg');subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',paths[name],'-frames:v','1',str(p)],check=True)
  a=Image.open(p);a.thumbnail((480,270));x=j*480;y=row*580;img.paste(a,(x,y));d.text((x+10,y+275),f'{label}: global {start+t:.3f}s',fill='black')
 # A second row from the transition neighborhood with matching exact global timestamps.
 for j,t in enumerate([2.23,2.33,2.43,2.53]):
  p=Path(f'out/v4/ab-{label}-near-{j}.jpg');subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',paths[name],'-frames:v','1',str(p)],check=True)
  a=Image.open(p);a.thumbnail((480,270));x=j*480;y=row*580+290;img.paste(a,(x,y));d.text((x+10,y+275),f'{label}: global {start+t:.3f}s',fill='black')
img.save('out/v4/AB_Comparison.jpg');print('Prepared masked A/B labels at identical global timestamps; mapping withheld in separate JSON')
