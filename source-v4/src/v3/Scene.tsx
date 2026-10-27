import React, { useMemo, useLayoutEffect } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { staticFile } from "remotion";
import { v3, ease, out, mix } from "./config";

type V = [number, number, number];
const shield = new THREE.Shape();
shield.moveTo(0, 1.12);
shield.bezierCurveTo(0.35, 0.91, 0.69, 0.83, 0.91, 0.82);
shield.bezierCurveTo(1.02, -0.05, 0.78, -0.83, 0, -1.2);
shield.bezierCurveTo(-0.78, -0.83, -1.02, -0.05, -0.91, 0.82);
shield.bezierCurveTo(-0.69, 0.83, -0.35, 0.91, 0, 1.12);
const extrusion = {
  depth: 0.3,
  bevelEnabled: true,
  bevelSegments: 5,
  steps: 1,
  bevelSize: 0.115,
  bevelThickness: 0.115,
  curveSegments: 32,
};
const white = "#fff5fc";
export const ShieldMascot: React.FC<{
  f: number;
  shot: number;
  p: number;
  scale?: number;
  position?: V;
}> = ({ f, shot, p, scale = 1, position = [0, 0, 0] }) => {
  const turn =
    shot === 5
      ? mix(-0.55, 0.2, ease(p))
      : shot === 8
        ? mix(-1.2, -0.85, ease(p))
        : shot === 30
          ? mix(-0.3, 0, out(p))
          : 0.12;
  const blink =
    (f > 100 && f < 111) || (f > 405 && f < 416) || (f > 2170 && f < 2181);
  const wave =
    shot === 6 || shot === 7 ? -0.9 - 0.55 * Math.sin(Math.PI * p) : -0.28;
  const bodyGeo = useMemo(
    () => new THREE.ExtrudeGeometry(shield, extrusion),
    [],
  );
  const rimGeo = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shield, {
        ...extrusion,
        depth: 0.035,
        bevelSize: 0.045,
        bevelThickness: 0.04,
      }),
    [],
  );
  const arm = [-0.99, 0.99];
  return (
    <group
      position={position}
      scale={[
        scale * (1 + (shot === 4 ? 0.035 * Math.sin(p * Math.PI * 2) : 0)),
        scale * (1 - (shot === 4 ? 0.055 * Math.sin(p * Math.PI * 2) : 0)),
        scale,
      ]}
      rotation={[
        shot === 4 ? mix(0.18, 0, out(p)) : 0,
        turn,
        shot === 4 ? mix(-0.1, 0, out(p)) : 0,
      ]}
    >
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={v3.palette.pink}
          roughness={0.27}
          metalness={0.06}
          clearcoat={0.65}
          clearcoatRoughness={0.26}
        />
      </mesh>
      <mesh
        geometry={rimGeo}
        position={[0, 0.01, 0.405]}
        scale={[0.89, 0.89, 1]}
      >
        <meshPhysicalMaterial
          color={white}
          roughness={0.2}
          metalness={0.18}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh
        geometry={rimGeo}
        position={[0, 0.01, 0.455]}
        scale={[0.83, 0.83, 1]}
      >
        <meshStandardMaterial color="#efbad7" roughness={0.37} />
      </mesh>
      {[-0.33, 0.33].map((x, i) => (
        <group key={x} position={[x, 0.2, 0.55]}>
          <mesh scale={[1, blink ? 0.12 : 1.25, 0.65]}>
            <sphereGeometry args={[0.085, 24, 16]} />
            <meshStandardMaterial color="#292330" roughness={0.17} />
          </mesh>
          {!blink && (
            <mesh position={[-0.025, 0.04, 0.055]}>
              <sphereGeometry args={[0.021, 12, 10]} />
              <meshBasicMaterial color="white" />
            </mesh>
          )}
          <mesh
            position={[i === 0 ? -0.1 : 0.1, -0.24, -0.008]}
            scale={[1.7, 0.7, 0.25]}
          >
            <sphereGeometry args={[0.1, 20, 12]} />
            <meshStandardMaterial color="#d883af" roughness={0.65} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.09, 0.565]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.12, 0.018, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#8f577b" />
      </mesh>
      {arm.map((x, i) => (
        <group
          key={x}
          position={[x, -0.03, 0.1]}
          rotation={[0, 0, i === 0 ? 0.3 : wave]}
        >
          <mesh position={[0, -0.19, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.3, 6, 16]} />
            <meshStandardMaterial color={v3.palette.pink} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {[-0.36, 0.36].map((x) => (
        <mesh
          key={x}
          position={[x, -1.19, 0.12]}
          rotation={[0.2, 0, x * 0.3]}
          castShadow
        >
          <capsuleGeometry args={[0.14, 0.2, 6, 16]} />
          <meshStandardMaterial color="#e6a4cc" roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[-0.08, -0.52, 0.56]} rotation={[0, 0, 0.65]}>
        <capsuleGeometry args={[0.027, 0.15, 4, 10]} />
        <meshBasicMaterial color={white} />
      </mesh>
      <mesh position={[0.08, -0.48, 0.56]} rotation={[0, 0, -0.58]}>
        <capsuleGeometry args={[0.027, 0.28, 4, 10]} />
        <meshBasicMaterial color={white} />
      </mesh>
    </group>
  );
};
export const BrowserMesh: React.FC<{
  index: number;
  position?: V;
  rotation?: V;
  scale?: number;
}> = ({ index, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const texture = useLoader(
    THREE.TextureLoader,
    staticFile(`assets/${v3.screenshots[index]}`),
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const aspect =
    (texture.image as HTMLImageElement).width /
    (texture.image as HTMLImageElement).height;
  const w = 6.1,
    h = w / aspect;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.1, -0.09]}>
        <boxGeometry args={[w + 0.14, h + 0.36, 0.17]} />
        <meshStandardMaterial
          color="#fdfaff"
          roughness={0.28}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {[-1, 0, 1].map((x, i) => (
        <mesh
          key={i}
          position={[-w / 2 + 0.16 + i * 0.11, h / 2 + 0.16, 0.014]}
        >
          <circleGeometry args={[0.033, 16]} />
          <meshBasicMaterial color={["#e7b4c9", "#ebd4b0", "#c1d7cb"][i]} />
        </mesh>
      ))}
      {index === 4 && (
        <mesh position={[0, -h * 0.24, 0.023]}>
          <planeGeometry args={[w * 0.54, h * 0.36]} />
          <meshBasicMaterial color="#f5e9f3" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};
function galleryIndex(f: number) {
  const anchors = [
    [1006, 0],
    [1151, 1],
    [1399, 2],
    [1542, 3],
    [1721, 4],
  ];
  for (let i = 0; i < anchors.length - 1; i++)
    if (f < anchors[i + 1][0])
      return mix(
        anchors[i][1],
        anchors[i + 1][1],
        ease((f - anchors[i][0]) / (anchors[i + 1][0] - anchors[i][0])),
      );
  return f < anchors[0][0] ? 0 : 4;
}
export const Gallery: React.FC<{ f: number; shot: number; p: number }> = ({
  f,
  shot,
  p,
}) => {
  const a =
    shot <= 17
      ? 0
      : shot === 18
        ? out(p)
        : shot <= 20
          ? 1
          : shot === 21
            ? 1 + out(p)
            : shot === 22
              ? 2
              : shot === 23
                ? 2 + out(p)
                : shot === 24
                  ? 3
                  : shot === 25
                    ? 3 + out(p)
                    : 4;
  const fold = shot === 29 ? out(p) : 0;
  return (
    <group rotation={[0, shot === 16 ? mix(0.2, 0, out(p)) : 0, 0]}>
      {v3.screenshots.map((_, i) => {
        const u = i - a;
        const base: V = [u * 6.8, Math.sin(u * 0.7) * 0.35, -Math.abs(u) * 1.5];
        const angle = (i / 5) * Math.PI * 2;
        const position: V =
          shot === 29
            ? [
                mix(base[0], Math.sin(angle) * 1.05, fold),
                mix(base[1], Math.cos(angle) * 0.95, fold),
                mix(base[2], -0.1 + i * 0.12, fold),
              ]
            : base;
        return (
          <BrowserMesh
            key={i}
            index={i}
            position={position}
            rotation={[
              fold * (i % 2 ? 0.45 : -0.45),
              -u * 0.15 + fold * angle,
              fold * angle * 0.12,
            ]}
            scale={mix(1, 0.17, fold)}
          />
        );
      })}
    </group>
  );
};
const posePoints: V[] = [
  [0, 1.35, 0],
  [-0.45, 0.85, 0],
  [0.45, 0.85, 0],
  [-0.35, -0.1, 0],
  [0.35, -0.1, 0],
  [-0.45, -0.85, 0],
  [0.45, -0.85, 0],
  [-0.5, -1.55, 0],
  [0.5, -1.55, 0],
  [-0.82, 0.25, 0],
  [0.82, 0.25, 0],
];
const connections = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 7],
  [6, 8],
  [1, 9],
  [2, 10],
];
const Line3D: React.FC<{ a: V; b: V; color?: string }> = ({
  a,
  b,
  color = "#bd58a0",
}) => {
  const av = new THREE.Vector3(...a),
    bv = new THREE.Vector3(...b);
  const d = bv.clone().sub(av);
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    d.clone().normalize(),
  );
  const c = av.clone().add(bv).multiplyScalar(0.5);
  return (
    <mesh position={c} quaternion={q}>
      <cylinderGeometry args={[0.018, 0.018, d.length(), 8]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} />
    </mesh>
  );
};
export const PoseMotif: React.FC<{ f: number; shot: number; p: number }> = ({
  f,
  shot,
  p,
}) => (
  <group
    position={[shot === 27 ? 1.45 : 0, 0, 0]}
    rotation={[0, mix(-0.6, 0.45, ease(p)), 0]}
    scale={shot === 27 ? 1 : 1.12}
  >
    {posePoints.map((v, i) => (
      <mesh
        key={i}
        position={[
          v[0],
          v[1],
          i === 0 ? 0 : Math.sin(i * 0.8 + f / 100) * 0.22,
        ]}
      >
        <sphereGeometry args={[0.057, 16, 12]} />
        <meshPhysicalMaterial
          color={i % 2 ? "#b2dfdc" : "#e79fcd"}
          roughness={0.2}
          metalness={0.15}
          clearcoat={1}
        />
      </mesh>
    ))}
    {connections.map(([a, b], i) => (
      <Line3D key={i} a={posePoints[a]} b={posePoints[b]} />
    ))}
  </group>
);
export function cameraFor(
  shot: number,
  p: number,
): { pos: V; target: V; fov: number } {
  const t = ease(p),
    q = out(p);
  switch (shot) {
    case 1:
      return {
        pos: [mix(0.73, 0.55, t), 0.54, 1.12],
        target: [0.65, 0.43, 0.4],
        fov: 43,
      };
    case 2:
      return {
        pos: [1.45, mix(0.95, 0.45, t), 1.9],
        target: [0.65, 0.55, 0.3],
        fov: 40,
      };
    case 3:
      return {
        pos: [mix(-0.12, 0.12, t), 0.2, 1.35],
        target: [0, 0.16, 0.5],
        fov: 44,
      };
    case 4:
      return {
        pos: [mix(4, 2.9, q), 1.35, mix(7.8, 6.7, q)],
        target: [-0.65, -0.1, 0],
        fov: 37,
      };
    case 5:
      return {
        pos: [-3.6, mix(1.9, 1.2, t), 6],
        target: [-0.45, -0.1, 0],
        fov: 38,
      };
    case 6:
      return { pos: [2, 1, 5.6], target: [-0.6, -0.05, 0], fov: 37 };
    case 7:
      return { pos: [2, 0.4, 2], target: [0.9, -0.05, 0.2], fov: 44 };
    case 8:
      return { pos: [3.1, 0.4, 2.6], target: [0, 0, 0.1], fov: 39 };
    case 9:
      return { pos: [mix(2, 0, q), 1, 6.5], target: [0, 0, 0], fov: 40 };
    case 10:
      return { pos: [0.8, 0.3, 7.5], target: [0, -0.1, 0], fov: 40 };
    case 11:
      return {
        pos: [0.83, 0.32, mix(1.7, 1.4, t)],
        target: [0.83, 0.32, 0.4],
        fov: 40,
      };
    case 12:
      return {
        pos: [mix(3.02, 0, q), mix(0.15, 0.1, q), mix(1.2, 7.2, q)],
        target: [mix(3.02, 0, q), mix(0.15, 0, q), 0],
        fov: 40,
      };
    case 13:
      return {
        pos: [mix(1.9, 0, q), mix(0.8, 0.1, q), mix(5.4, 7.2, q)],
        target: [0, 0, 0],
        fov: 38,
      };
    case 14:
      return {
        pos: [-0.7, 0.25, mix(3.35, 3.05, t)],
        target: [-0.45, 0, 0],
        fov: 40,
      };
    case 19:
      return {
        pos: [mix(-1.25, -0.9, t), 0.3, 3.2],
        target: [-0.8, 0.05, 0],
        fov: 39,
      };
    case 16:
      return {
        pos: [mix(-3, 0, q), mix(2.2, 0.2, q), mix(10, 7.4, q)],
        target: [0, 0, 0],
        fov: 41,
      };
    case 17:
    case 18:
    case 21:
    case 23:
    case 25:
      return {
        pos: [mix(1.2, 0, q), mix(0.6, 0.1, q), mix(8.2, 7.1, q)],
        target: [0, 0, 0],
        fov: 39,
      };
    case 27:
      return {
        pos: [
          mix(3.8, 1.45, t),
          mix(0.9, 1.35, t),
          mix(6.7, 1.47, out((p - 0.55) / 0.45)),
        ],
        target: [mix(0, 1.45, t), mix(0, 1.35, t), 0],
        fov: 40,
      };
    case 28:
      return {
        pos: [0.393, 0.2, mix(2.7, 1.4, q)],
        target: [0.393, 0.2, 0.506],
        fov: 40,
      };
    case 29:
      return {
        pos: [mix(2.2, 0, t), mix(1.4, 0, t), mix(8, 5.6, t)],
        target: [0, 0, 0],
        fov: 42,
      };
    case 30:
      return {
        pos: [mix(-2, 0.6, t), 0.65, 6.8],
        target: [0, -0.1, 0],
        fov: 37,
      };
    case 31:
      return { pos: [0, 0, 7.5], target: [0, 0, 0], fov: 40 };
    case 32:
      return { pos: [0, 0, 8], target: [0, 0, 0], fov: 40 };
    default:
      return { pos: [0, 0.05, 7.2], target: [0, 0, 0], fov: 38 };
  }
}
const Camera: React.FC<{ shot: number; p: number }> = ({ shot, p }) => {
  const { camera, invalidate } = useThree();
  const settings = cameraFor(shot, p);
  if ([4, 9, 16, 18, 21, 23, 25].includes(shot)) {
    const first = cameraFor(shot, 0),
      last = cameraFor(shot, 1);
    const a = new THREE.Vector3(...first.pos),
      b = new THREE.Vector3(...last.pos);
    const control = a
      .clone()
      .add(b)
      .multiplyScalar(0.5)
      .add(new THREE.Vector3(0.25, 0.2, 0.25));
    settings.pos = new THREE.QuadraticBezierCurve3(a, control, b)
      .getPoint(out(p))
      .toArray() as V;
  }
  useLayoutEffect(() => {
    camera.position.set(...settings.pos);
    camera.lookAt(...settings.target);
    (camera as THREE.PerspectiveCamera).fov = settings.fov;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, shot, p]);
  return null;
};
export const Scene: React.FC<{ f: number; shot: number; p: number }> = ({
  f,
  shot,
  p,
}) => {
  const showChar = shot <= 11 || shot === 28 || shot === 30 || shot >= 31;
  return (
    <>
      <Camera shot={shot} p={p} />
      <ambientLight intensity={0.65} />
      <hemisphereLight args={["#fff8ff", "#c7c5db", 0.9]} />
      <directionalLight
        position={[-3, 6, 5]}
        intensity={2.8}
        color="#fff3fa"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[4, 2, -3]} intensity={1.8} color="#c8eef6" />
      <pointLight
        position={[1, 1, 4]}
        intensity={3.5}
        distance={8}
        color="#ffe2f0"
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.47, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.13} />
      </mesh>
      {showChar && (
        <ShieldMascot
          f={f}
          shot={shot}
          p={p}
          position={
            shot === 10
              ? [2.3, -0.1, 0]
              : shot === 31
                ? [2.9, -0.25, 0]
                : shot === 32
                  ? [4, -0.8, 0]
                  : [0, shot === 4 ? mix(0.65, 0, out(p)) : 0, 0]
          }
          scale={shot === 32 ? 0.46 : shot === 31 ? 0.85 : 1}
        />
      )}
      {shot === 9 &&
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const t = out(p),
            a = (i * Math.PI) / 4;
          return (
            <mesh
              key={i}
              position={[
                mix(Math.sin(a) * 2.8, Math.sin(a) * 1.05, t),
                mix(Math.cos(a) * 2.4, Math.cos(a) * 1.05, t),
                mix(-1, -0.3, t),
              ]}
              rotation={[i * 0.4, i * 0.2, t * Math.PI]}
            >
              <boxGeometry args={[0.2, 0.35, 0.12]} />
              <meshPhysicalMaterial
                color={i % 2 ? "#e5d4f3" : "#f0a8d2"}
                roughness={0.2}
                metalness={0.25}
              />
            </mesh>
          );
        })}
      {shot >= 12 && shot <= 26 && <Gallery f={f} shot={shot} p={p} />}
      {shot === 27 && (
        <>
          <group position={[-3, 0.1, -1.4]} rotation={[0, 0.45, 0]}>
            <BrowserMesh index={1} scale={0.65} />
          </group>
          <PoseMotif f={f} shot={shot} p={p} />
        </>
      )}
      {shot === 29 && (
        <>
          <Gallery f={1900} shot={shot} p={p} />
          <group scale={out(p) * 0.75}>
            <ShieldMascot f={f} shot={shot} p={p} />
          </group>
        </>
      )}
    </>
  );
};
