import React, { useMemo, useLayoutEffect } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { staticFile } from "remotion";
import { v3, ease, out, mix } from "../v3/config";
import {smooth,span} from "./motion";

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
  const turn = -.18 + .4*smooth(span(f,150,330)) - .22*smooth(span(f,420,570));
  const blinkAmount = Math.max(...[105,370,2135].map(center=>Math.exp(-Math.pow((f-center)/4.5,2))));
  const wave=-.28-1.05*Math.sin(Math.PI*smooth(span(f,285,440)));
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
      scale={[scale*(1+.028*Math.sin(Math.PI*span(f,165,235))),scale*(1-.042*Math.sin(Math.PI*span(f,165,235))),scale]}
      rotation={[.07*(1-smooth(span(f,0,210))),turn,-.04*(1-smooth(span(f,0,210)))]}
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
          <mesh scale={[1, 1.25-1.13*blinkAmount, 0.65]}>
            <sphereGeometry args={[0.085, 24, 16]} />
            <meshStandardMaterial color="#292330" roughness={0.17} />
          </mesh>
          {(
            <mesh position={[-0.025, 0.04, 0.055]} scale={1-blinkAmount}>
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
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
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
