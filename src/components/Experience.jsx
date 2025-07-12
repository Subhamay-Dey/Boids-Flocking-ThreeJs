import { Environment, OrbitControls, SoftShadows } from "@react-three/drei";

import { useAtom } from "jotai";
import { Boids } from "./Boids";
import { themeAtom, THEMES } from "./UI";
import { useControls } from "leva";
import { DoubleSide } from "three";
import { useState } from "react";

export const Experience = () => {
  const [theme] = useAtom(themeAtom);

  const boundaries = useControls(
    "Boundaries",
    {
      debug: true,
      x: {value: 12, min: 0, max: 40},
      y: {value: 8, min: 0, max: 40},
      z: {value: 20, min: 0, max: 40},
    },
    {collapsed: true}
  );

  const [size, setSize] = useState([window.innerWidth, window.innerHeight])

  const scaleX = Math.max(0.5, size[0] / 1920);
  const scaleY = Math.max(0.5, size[1] / 1080);
  
  const responsiveBoundaries = {
    x: boundaries.x * scaleX,
    y: boundaries.y * scaleY,
    z: boundaries.z,
  }

  return (
    <>
      <OrbitControls />

      <Boids />
      <mesh visible={boundaries.debug}>
        <boxGeometry args={[boundaries.x, boundaries.y, boundaries.z]}/>
        <meshStandardMaterial
          color="orange"
          transparent
          opacity={0.5}
          side={DoubleSide}
        />
      </mesh>

      {/* LIGHTS */}
      <SoftShadows size={15} focus={1.5} samples={12} />
      <Environment preset="sunset"></Environment>
      <directionalLight
        position={[15, 15, 15]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-far={300}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
      />
      <hemisphereLight
        intensity={1.35}
        color={THEMES[theme].skyColor}
        groundColor={THEMES[theme].groundColor}
      />
    </>
  );
};
