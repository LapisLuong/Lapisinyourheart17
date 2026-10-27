from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED,ZIP_STORED
import json,stat,hashlib
root=Path(__file__).resolve().parent.parent
source=[]
for directory in ['src/v3','src/v4','public/assets','public/fonts','public/audio','macOS/v4','reports']:
 source += [p for p in (root/directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts]
source += [root/p for p in ['package.json','package-lock.json','tsconfig.json','V4_MACOS_README.md']]
source += list((root/'scripts').glob('v4-*'))+[root/'scripts/browser.mjs']
with ZipFile(root/'out/FallSense_V4_Source.zip','w',ZIP_DEFLATED) as z:
 for p in source:
  rel=p.relative_to(root).as_posix()
  if rel=='package.json':
   data=json.loads(p.read_text());data['scripts']={'studio':'remotion studio src/v4/index.tsx','typecheck':'tsc --noEmit','render:v4':'node scripts/v4-render.mjs','qa:v4':'node scripts/v4-review.mjs'};z.writestr('FallSense_V4/package.json',json.dumps(data,indent=2)+'\n')
  else:z.write(p,'FallSense_V4/'+rel)
 z.writestr('FallSense_V4/src/index.ts','import "./v4/index";\n')
 z.writestr('FallSense_V4/.gitignore','node_modules/\nout/\n.cache/\n.DS_Store\n')
 assert z.testzip() is None
# --source-only supports clean-install validation while the final video is rendering.
import sys
if '--source-only' in sys.argv:print('Created V4 source ZIP');raise SystemExit(0)
video=root/'out/FallSense_Cinematic_Intro_V4_Smooth3D_1080p60.mp4';assert video.exists()
with ZipFile(root/'out/FallSense_V4_Source.zip') as src,ZipFile(root/'out/FallSense_V4_macOS_PPT.zip','w') as z:
 for info in src.infolist():z.writestr(info,src.read(info.filename))
 for path,dest in [(video,'Videos/'+video.name),(root/'out/FallSense_V4_EndFrame.png','Videos/FallSense_V4_EndFrame.png'),(root/'out/FallSense_Academic_13_Slides_Editable.pptx','Slides/FallSense_Academic_13_Slides_Editable.pptx'),(root/'out/v4/ppt-preview/FallSense_Academic_13_Slides_Editable.pdf','Slides/FallSense_Academic_13_Slides_Preview.pdf'),(root/'out/v4/PPT_ContactSheet.jpg','Slides/PPT_ContactSheet.jpg'),(root/'out/v4/AB_Comparison.jpg','Comparison/AB_Comparison.jpg')]:
  z.write(path,'FallSense_V4/'+dest,compress_type=ZIP_STORED)
 z.writestr('FallSense_V4/BAT_DAU_TREN_MAC.txt','''FALLSENSE V4 — VIDEO + POWERPOINT CHỈNH SỬA

1. Giải nén toàn bộ ZIP bằng Finder.
2. Mở Videos/FallSense_Cinematic_Intro_V4_Smooth3D_1080p60.mp4 bằng QuickTime.
3. Mở Slides/FallSense_Academic_13_Slides_Editable.pptx bằng PowerPoint.
4. Nếu chỉ cần xem slide, mở bản Preview.pdf bằng ứng dụng Preview.

Không cần Node.js để xem video hoặc dùng PowerPoint. Chuyển từ video sang PPT bằng thao tác của người trình bày.
Mã nguồn/kiểm tra nằm trong src, scripts, reports. Chỉ cần Node.js 22/24 LTS khi muốn chỉnh video hoặc render lại.
Chưa thử trực tiếp trên macOS 27/M2. Chạy macOS/v4/Diagnose_Mac.command để ghi thông số máy thực tế nếu cần hỗ trợ.
''')
 i=__import__('zipfile').ZipInfo('FallSense_V4/XEM_VIDEO.command');i.create_system=3;i.external_attr=(stat.S_IFREG|0o755)<<16;z.writestr(i,'#!/bin/bash\ncd "$(dirname "$0")"\n/usr/bin/open -a "QuickTime Player" "Videos/FallSense_Cinematic_Intro_V4_Smooth3D_1080p60.mp4"\n')
 assert z.testzip() is None
print('Created V4 Mac video + editable PowerPoint ZIP')
