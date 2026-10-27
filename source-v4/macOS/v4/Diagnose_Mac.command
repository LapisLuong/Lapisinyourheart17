#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd "$(dirname "$0")/../.."
mkdir -p reports/native-mac
{
 echo 'FallSense V4: actual Mac runtime diagnostics (no serial numbers)'
 date
 sw_vers
 uname -m
 echo 'CPU logical cores:'; sysctl -n hw.ncpu
 echo 'Memory bytes:'; sysctl -n hw.memsize
 echo 'Available disk:'; df -h .
 echo 'Node:'; node --version
 echo 'npm:'; npm --version
 echo 'FFmpeg (optional):'; if command -v ffmpeg >/dev/null 2>&1; then ffmpeg -version | head -2; else echo 'Not installed; Remotion has its own encoder'; fi
 echo 'Display/GPU model and Metal availability (not proof of headless acceleration):'
 system_profiler SPDisplaysDataType 2>/dev/null | sed -n '/Chipset Model:/p;/Total Number of Cores:/p;/Metal Support:/p'
} | tee reports/native-mac/runtime.txt
read -r -p 'Nhan Enter de dong...' _
