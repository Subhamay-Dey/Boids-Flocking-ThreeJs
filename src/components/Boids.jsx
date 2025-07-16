import { useAnimations, useGLTF } from "@react-three/drei";

import { useAtom } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";
import { themeAtom, THEMES } from "./UI";
import { useControls } from "leva"

export const Boids = ({}) => {
  const [theme] = useAtom(themeAtom);

  const {} = useControls(
    "General settings",
    {
      "Boids": {
        value: true,
        disabled: true,
      },
      "Boids count": {
        value: 1,
        min: 1,
        max: 1000,
        step: 1,
      },
      "Boids speed": {
        value: 1,
        min: 0.1,
        max: 10,
        step: 0.1,
      },
    },
  )
  return (
    <>
      <Boid
        position={new Vector3(0, 0, 0)}
        model={THEMES[theme].models[0]}
        animation={"Fish_Armature|Swimming_Fast"}
      />
    </>
  );
};

const Boid = ({ position, model, animation, ...props }) => {
  const { scene, animations } = useGLTF(`/models/${model}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
  }, []);

  useEffect(() => {
    actions[animation]?.play();
    return () => {
      actions[animation]?.stop();
    };
  }, [animation]);

  return (
    <group {...props} ref={group} position={position}>
      <primitive object={clone} rotation-y={Math.PI / 2} />
    </group>
  );
};
