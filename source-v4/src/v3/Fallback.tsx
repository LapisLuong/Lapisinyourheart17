import React from "react";
// Separate, explicitly flat preview-only fallback. Final export uses Three meshes.
export const FallbackMascot: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 400 400">
    <defs>
      <radialGradient id="flat">
        <stop stopColor="#fff4fb" />
        <stop offset="1" stopColor="#da92bd" />
      </radialGradient>
    </defs>
    <path
      d="M200 35Q265 75 320 75Q345 280 200 365Q55 280 80 75Q135 75 200 35"
      fill="url(#flat)"
      stroke="#fff0fa"
      strokeWidth="7"
    />
    <ellipse cx="150" cy="180" rx="10" ry="16" fill="#332639" />
    <ellipse cx="250" cy="180" rx="10" ry="16" fill="#332639" />
    <path
      d="M180 215Q200 240 220 215"
      fill="none"
      stroke="#994e82"
      strokeWidth="7"
    />
  </svg>
);
