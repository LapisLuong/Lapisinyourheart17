# FallSense V4 — video mượt hơn và PowerPoint chỉnh sửa được

## Xem trên Mac

Giải nén toàn bộ `FallSense_V4_macOS_PPT.zip` bằng Finder.

- Mở `Videos/FallSense_Cinematic_Intro_V4_Smooth3D_1080p60.mp4` bằng QuickTime Player. Không cần Node.js để xem.
- Mở `Slides/FallSense_Academic_13_Slides_Editable.pptx` bằng Microsoft PowerPoint. Có 13 slide, chữ/sơ đồ/bảng chỉnh sửa được, notes và chuyển trang Fade theo click. Ảnh giao diện là ảnh thật, không biến thành dữ liệu UI có thể chỉnh sửa.
- Nếu chỉ cần xem nội dung, `Slides/FallSense_Academic_13_Slides_Preview.pdf` mở bằng Preview của macOS, không cần PowerPoint.
- `Videos/FallSense_V4_EndFrame.png` là hình kết khớp video. Chuyển sang bài PowerPoint bằng thao tác của người trình bày; không có lời hứa tự động chuyển ứng dụng.

Bản mới là PPTX tạo riêng theo yêu cầu trực tiếp của người dùng. Hai PPTX nguồn được giữ nguyên, không ghi đè. Nguồn WHO/BMJ, trọng số, ví dụ giả định và các điểm chưa xác minh source app được ghi trong notes/footnotes. Không có kết quả hiệu quả lâm sàng hoặc kiểm thử email được bịa thêm.

## Chỉnh video / render trên M2

Cài Node.js 22 hoặc 24 LTS từ nodejs.org. Mở `macOS/v4/Open_V4.command` hoặc `Render_V4.command`. Nếu Finder không chạy, dùng Terminal:

```sh
bash macOS/v4/Open_V4.command
# hoặc
bash macOS/v4/Render_V4.command
```

Script render trên Mac khởi đầu với 1 worker. Có thể thử `V4_CONCURRENCY=2 node scripts/v4-render.mjs` sau khi kiểm tra bộ nhớ. Cloud đã kiểm tra render các khung giống nhau theo thứ tự khác nhau / concurrency 1 và 2, kết quả trùng pixel ở các khung đã chọn. Không suy ra Mac M2 của bạn có bao nhiêu RAM/GPU core từ tên máy.

Chạy `macOS/v4/Diagnose_Mac.command` để ghi **thực tế** `sw_vers`, `uname -m`, CPU/RAM, Node và dung lượng trống vào `reports/native-mac/runtime.txt`; không thu serial. Phiên cloud là Linux x86_64, không phải macOS 27/M2, nên chưa kiểm thử trực tiếp trên thiết bị đó.

Mặc định backend WebGL phần mềm `swangle`, H.264 software CRF17, không kết hợp hardware acceleration với CRF. `V4_GL=angle` có thể thử trên Mac nếu Chrome/headless hỗ trợ GPU; chưa xác minh trong phiên này. Không tuyên bố Metal/VideoToolbox sửa lỗi chuyển động. `CHROME_PATH` chọn browser; nếu không, script tìm Chrome hoặc dùng tải browser của Remotion.

## Source

- `src/v4/motion.ts`: quỹ đạo C2 toàn cục, quaternion slerp, camera/page/mascot.
- `src/v4/Assets.tsx`: chibi mesh, mí mắt mượt, tay và vật liệu; texture mipmap/anisotropy.
- `src/v4/Intro.tsx`, `Scene.tsx`: phim một không gian 3D liên tục, nhạc và chữ frame-based.
- `reports/motion_audit.md`, `reports/render_validation.md`: kiểm tra và giới hạn thực tế.
- `scripts/v4-ppt.py` + `reports/v4/ppt-content.json`: nguồn tạo PPTX. Các script Python phân tích/tạo PPT là tùy chọn, cần Python, numpy, Pillow, python-pptx; xem/render video bằng Node không cần chúng. FFmpeg CLI/LibreOffice chỉ cần cho kiểm tra/xuất PDF tùy chọn.

Nhạc do người dùng cung cấp, chưa xác minh quyền phát hành thương mại/công khai; không có SFX ngoài. Noto Sans có OFL đi kèm. PowerPoint dùng Arial để giảm phụ thuộc font ngoài. Chưa thử native PowerPoint/QuickTime trên macOS 27; đã kiểm tra cấu trúc PPTX, xuất PDF và codec/giải mã MP4 trên cloud.
