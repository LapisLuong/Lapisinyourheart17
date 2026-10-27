import map from "./beat-map.json";
export const v3 = {
  width: 1920,
  height: 1080,
  fps: 60,
  duration: 2580,
  quality: 17,
  palette: {
    milk: "#fbf8fc",
    pink: "#efbad7",
    rim: "#ffe6f7",
    ink: "#25242d",
    ice: "#EAF7FB",
    lavender: "#e9ddf8",
  },
  music: "audio/user-supplied.m4a",
  gain: 0.4,
  fadeIn: 1.2,
  fadeOut: 3,
  screenshots: [
    "overview.jpg",
    "live-monitor.jpg",
    "training.jpg",
    "incidents.jpg",
    "settings.jpg",
  ],
  labels: [
    "Overview",
    "Live Monitor",
    "AI Training Lab",
    "Incidents",
    "Settings",
  ],
  copy: {
    observe: "QUAN SÁT.",
    recognize: "NHẬN BIẾT.",
    respond: "CẢNH BÁO.",
    brand: "FallSense",
    final:
      "FallSense — Hệ thống hỗ trợ giám sát và cảnh báo té ngã bằng camera",
  },
  useFallback: false,
  shots: map.shots,
};
export function shotAt(f: number) {
  return (
    v3.shots.find((s) => f >= s.startFrame && f < s.endFrame) ??
    v3.shots[v3.shots.length - 1]
  );
}
export const ease = (p: number) => {
  const t = Math.max(0, Math.min(1, p));
  return t * t * (3 - 2 * t);
};
export const out = (p: number) =>
  1 - Math.pow(1 - Math.max(0, Math.min(1, p)), 3);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
