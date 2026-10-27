import { existsSync } from 'node:fs';
import { availableParallelism } from 'node:os';

// Honor explicit overrides; otherwise use an installed browser or Remotion's download.
export function resolveBrowser(platform = process.platform, exists = existsSync, override = process.env.CHROME_PATH) {
  if (override) {
    if (!exists(override)) throw new Error(`CHROME_PATH does not exist: ${override}`);
    return override;
  }
  const candidates = platform === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium']
    : platform === 'linux' ? ['/usr/bin/chromium', '/usr/bin/google-chrome'] : [];
  return candidates.find(exists);
}
export const renderConcurrency = Math.max(1, Math.min(4, availableParallelism() - 1));
