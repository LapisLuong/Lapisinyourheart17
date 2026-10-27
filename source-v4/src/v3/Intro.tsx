import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { v3, shotAt, out } from "./config";
import { Scene } from "./Scene";
// Separate opt-in fallback. It is not used in the final V3 export.
import { FallbackMascot as FlatMascot } from "./Fallback";

const Lift: React.FC<{
  children: React.ReactNode;
  p: number;
  size?: number;
}> = ({ children, p, size = 124 }) => (
  <div style={{ overflow: "hidden", paddingBottom: 16 }}>
    <div
      style={{
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: -5,
        transform: `translateY(${(1 - out(p)) * 120}%)`,
      }}
    >
      {children}
    </div>
  </div>
);
const Mark: React.FC<{ p: number; large?: boolean }> = ({
  p,
  large = false,
}) => (
  <div
    style={{
      overflow: "hidden",
      clipPath: `inset(0 ${(1 - out(p)) * 100}% 0 0)`,
    }}
  >
    <div
      style={{
        fontSize: large ? 160 : 136,
        fontWeight: 700,
        letterSpacing: -7,
        lineHeight: 1.2,
      }}
    >
      Fall<span style={{ color: "#bd4c96" }}>Sense</span>
    </div>
  </div>
);
export const FallSenseCinematicIntroV3: React.FC = () => {
  const f = useCurrentFrame();
  const s = shotAt(f);
  const id = s.id,
    p = (f - s.startFrame) / (s.endFrame - s.startFrame);
  const caption =
    id >= 18 && id <= 20
      ? "Live Monitor"
      : id === 21 || id === 22
        ? "AI Training Lab"
        : id === 23 || id === 24
          ? "Incidents"
          : id === 25 || id === 26
            ? "Settings"
            : "Overview";
  const blur =
    [12, 16, 23].includes(id) && p < 0.18
      ? Math.sin((Math.PI * p) / 0.18) * 9
      : 0;
  const ui = id >= 12 && id <= 26;
  const brand = id === 10 || id === 31;
  return (
    <AbsoluteFill
      style={{
        background:
          id >= 31
            ? "#fcf9fc"
            : "radial-gradient(ellipse at 70% 20%,#fcf5fc 0%,#eaf7fb 65%,#e9ddf8 120%)",
        fontFamily: "Noto",
        color: v3.palette.ink,
        overflow: "hidden",
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter
            id="v3-directional-whip"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation={`${blur} 0`} />
          </filter>
        </defs>
      </svg>
      {brand && (
        <div
          style={{
            position: "absolute",
            left: 110,
            top: id === 31 ? 320 : 310,
            zIndex: 1,
            transformOrigin: "left",
          }}
        >
          <Mark p={p * 4} large />
          {id === 31 && (
            <div
              style={{
                fontSize: 28,
                letterSpacing: 5,
                marginTop: 28,
                color: "#84667f",
              }}
            >
              A LITTLE GUARDIAN.
            </div>
          )}
        </div>
      )}
      {v3.useFallback ? (
        <div style={{ position: "absolute", right: 300, top: 250 }}>
          <FlatMascot size={500} />
        </div>
      ) : (
        <ThreeCanvas
          width={1920}
          height={1080}
          dpr={1}
          shadows="soft"
          camera={{ fov: 40, near: 0.03, far: 220, position: [0, 0, 7] }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            filter: blur > 0 ? "url(#v3-directional-whip)" : "none",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000", 0);
            gl.toneMappingExposure = 1;
          }}
        >
          <Scene f={f} shot={id} p={p} />
        </ThreeCanvas>
      )}
      {(id === 4 || id === 5 || id === 6) && (
        <div style={{ position: "absolute", left: 105, top: 110, zIndex: 3 }}>
          <Lift p={p * 3}>{v3.copy.observe}</Lift>
          <div
            style={{
              fontSize: 28,
              letterSpacing: 5,
              marginTop: 24,
              color: "#8a6b83",
            }}
          >
            FALLSENSE / A LITTLE GUARDIAN
          </div>
        </div>
      )}
      {ui && (
        <>
          <div
            style={{
              position: "absolute",
              left: 95,
              top: 48,
              zIndex: 4,
              display: "flex",
              alignItems: "baseline",
              gap: 30,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 4,
                color: "#a4558b",
              }}
            >
              FALLSENSE
            </div>
            <div style={{ fontSize: 54, fontWeight: 700, letterSpacing: -1.5 }}>
              {caption}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 98,
              bottom: 42,
              zIndex: 4,
              fontSize: 30,
              color: "#5c5364",
              padding: "10px 20px",
              background: "#fcf9fcde",
              borderRadius: 50,
            }}
          >
            {id >= 18 && id <= 20
              ? "DEMO SIM · Điểm tổng hợp, không phải xác suất"
              : id >= 25
                ? "Thông tin liên hệ đã ẩn"
                : id < 18
                  ? "Camera trong ảnh chưa khởi động"
                  : "Giao diện thật được cung cấp"}
          </div>
          {id === 16 && (
            <div
              style={{ position: "absolute", right: 90, top: 142, zIndex: 4 }}
            >
              <Lift p={p * 3} size={76}>
                {v3.copy.recognize}
              </Lift>
            </div>
          )}
        </>
      )}
      {id === 27 && (
        <>
          <div style={{ position: "absolute", left: 100, top: 85, zIndex: 4 }}>
            <Lift p={p * 3} size={96}>
              {v3.copy.recognize}
            </Lift>
          </div>
          <div
            style={{
              position: "absolute",
              left: 100,
              bottom: 48,
              fontSize: 30,
              zIndex: 4,
              color: "#726179",
            }}
          >
            Sơ đồ tư thế minh họa · Không phải kết quả nhận diện
          </div>
        </>
      )}
      {id === 29 && (
        <div style={{ position: "absolute", left: 100, top: 95, zIndex: 4 }}>
          <Lift p={p * 4} size={92}>
            {v3.copy.respond}
          </Lift>
        </div>
      )}
      {id === 30 && (
        <div style={{ position: "absolute", left: 105, top: 140, zIndex: 4 }}>
          <div style={{ fontSize: 31, letterSpacing: 5, color: "#a4558b" }}>
            MỘT NGƯỜI BẠN NHỎ.
          </div>
        </div>
      )}
      {id === 32 && (
        <div
          style={{
            position: "absolute",
            left: 115,
            top: 205,
            width: 1500,
            zIndex: 4,
            clipPath: `inset(0 0 ${(1 - out(p * 5)) * 100}% 0)`,
          }}
        >
          <div
            style={{
              fontSize: 27,
              letterSpacing: 6,
              color: "#a4558b",
              marginBottom: 48,
            }}
          >
            FALLSENSE / A LITTLE GUARDIAN
          </div>
          <h1
            style={{
              fontSize: 78,
              lineHeight: 1.35,
              letterSpacing: -2,
              margin: 0,
              maxWidth: 1450,
            }}
          >
            {v3.copy.final}
          </h1>
          <div
            style={{
              width: 110,
              height: 5,
              background: "#bd4c96",
              marginTop: 55,
            }}
          />
        </div>
      )}
      <Audio
        src={staticFile(v3.music)}
        volume={(frame) =>
          v3.gain *
          Math.max(
            0,
            Math.min(
              1,
              frame / (v3.fadeIn * 60),
              (v3.duration - frame) / (v3.fadeOut * 60),
            ),
          )
        }
      />
    </AbsoluteFill>
  );
};
