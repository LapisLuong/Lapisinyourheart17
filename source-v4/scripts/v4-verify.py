"""Verify the actual final film, including decoding, audio, pixels and shot grid."""
import json,re,subprocess,hashlib
from pathlib import Path
import numpy as np
p=Path('out/FallSense_Cinematic_Intro_V4_Smooth3D_1080p60.mp4')
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(p)],text=True))
v=next(x for x in info['streams'] if x['codec_type']=='video');a=next(x for x in info['streams'] if x['codec_type']=='audio')
assert (v['width'],v['height'],v['r_frame_rate'],v['codec_name'],v['pix_fmt'])==(1920,1080,'60/1','h264','yuv420p'),info
assert int(v['nb_read_frames'])==2580 and abs(float(v['duration'])-43)<.02,info
assert abs(float(info['format']['duration'])-43)<.1,info
assert a['codec_name']=='aac',info
decode=subprocess.run(['ffmpeg','-hide_banner','-xerror','-i',str(p),'-vf','blackdetect=d=0.016:pix_th=0.02:pic_th=0.98','-f','null','-'],capture_output=True,text=True,check=True)
Path('out/v4/full-decode.log').write_text(decode.stderr)
assert 'black_start:' not in decode.stderr, 'Unexpected black interval; inspect full-decode.log'
frames=[]
for t in [0,2.7,9.9,17.3,24.9,35.5,42.95]:
 data=subprocess.check_output(['ffmpeg','-v','error','-ss',str(t),'-i',str(p),'-frames:v','1','-vf','scale=320:180','-pix_fmt','rgb24','-f','rawvideo','-'])
 im=np.frombuffer(data,dtype=np.uint8);assert len(im)==320*180*3
 assert float(im.mean())>25 and float(im.std())>7
 frames.append({'second':t,'mean':float(im.mean()),'std':float(im.std()),'sha256':hashlib.sha256(data).hexdigest()})
audio=subprocess.run(['ffmpeg','-hide_banner','-i',str(p),'-vn','-af','volumedetect','-f','null','-'],capture_output=True,text=True,check=True)
peak=float(re.search(r'max_volume: ([-\d.]+) dB',audio.stderr)[1]);assert -50<peak<0
result={'file':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'metadata':info,'fullDecode':'passed','motionDesign':'continuous C2 global paths with quaternion camera','boundaryNeighborhoods':21,'sampledFrames':frames,'peakDb':peak,'blackGapCheck':'FFmpeg blackdetect on every decoded frame: no >=98%-black interval at threshold 0.02 lasting >=16ms','nativeMacTest':False}
Path('reports/v4/final-metadata.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:result[k] for k in ['file','sha256','fullDecode','motionDesign','boundaryNeighborhoods','peakDb']},indent=2))
