#!/bin/bash
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd "$(dirname "$0")/../.."
if ! command -v node >/dev/null 2>&1; then echo 'Cai Node.js 22/24 LTS tu https://nodejs.org/'; read -r -p 'Enter de dong...' _; exit 1; fi
npm ci --cache "$PWD/.cache/npm" --no-audit --no-fund
npx remotion studio src/v4/index.tsx
