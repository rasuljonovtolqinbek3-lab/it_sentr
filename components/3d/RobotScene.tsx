"use client";

import React, { useRef, useState, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Float, OrbitControls, ContactShadows, useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

function enhanceMaterial(material: THREE.Material) {
  if (
    material instanceof THREE.MeshStandardMaterial ||
    material instanceof THREE.MeshPhysicalMaterial
  ) {
    material.roughness = 0.4;
    material.metalness = 0.5;
  }
}
function CustomRobot({ onClick }: { onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/robot.glb");
  const { viewport } = useThree();
  
  // Extremely safe scale values to ensure 100% visibility
  // If the model is still too big, it will be scaled down further
  const isMobile = viewport.width < 5;
  const responsiveScale = isMobile ? 0.3 : 0.45; 

  let mixer: THREE.AnimationMixer | null = null;
  if (animations && animations.length > 0) {
    mixer = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => {
      mixer?.clipAction(clip).play();
    });
  }

  const pointer = useThree((state) => state.pointer);
  const [isClicked, setIsClicked] = useState(false);
  const clickTime = useRef(0);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => {
              mat.roughness = 0.4;
              mat.metalness = 0.5;
            });
          } else {
            (obj.material as THREE.MeshStandardMaterial).roughness = 0.4;
            (obj.material as THREE.MeshStandardMaterial).metalness = 0.5;
          }
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (mixer) mixer.update(delta);
    
    let rotationSpeed = 0.2;
    let yOffset = 0;
    
    if (isClicked) {
      const timeSinceClick = t - clickTime.current;
      if (timeSinceClick < 1.0) {
        rotationSpeed = 5.0 * (1 - timeSinceClick); 
        yOffset = Math.sin(timeSinceClick * Math.PI) * 0.5;
      } else {
        setIsClicked(false);
      }
    }

    groupRef.current.rotation.y += delta * rotationSpeed;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (pointer.y * Math.PI) * 0.05, 0.1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, (-pointer.x * Math.PI) * 0.05, 0.1);
    
    // Float gently, adjusted for the new smaller scale
    groupRef.current.position.y = Math.sin(t * 2) * 0.1 + yOffset;
  });

  const handleRobotClick = (e: any) => {
    e.stopPropagation();
    if (!isClicked) {
      setIsClicked(true);
      clickTime.current = e.state?.clock?.getElapsedTime() || 0;
    }
    onClick();
  };

  return (
    <group ref={groupRef}>
      <mesh visible={false} position={[0, 0, 0]} onClick={handleRobotClick} onPointerOver={(e) => (document.body.style.cursor = 'pointer')} onPointerOut={(e) => (document.body.style.cursor = 'auto')}>
        <boxGeometry args={[4, 6, 4]} />
      </mesh>
      <Center scale={responsiveScale}>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

class RobotErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial color="#00d654" wireframe />
        </mesh>
      );
    }
    return this.props.children;
  }
}

function SceneSetup() {
  const { gl, scene } = useThree();
  useEffect(() => {
    scene.background = null;
    gl.setClearColor(0x000000, 0);
  }, [gl, scene]);
  return null;
}

function LoadingIndicator() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 2;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial color="#00d654" wireframe />
    </mesh>
  );
}

export default function RobotScene() {
  return (
    <div
      className="w-full h-full touch-manipulation relative bg-transparent"
      title="Robotga teging"
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45 }}
        dpr={[1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1)]}
        shadows
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        style={{ background: "transparent" }}
      >
        <SceneSetup />

        <ambientLight intensity={0.6} />
        <spotLight
          position={[5, 10, 5]}
          angle={0.3}
          penumbra={1}
          intensity={2.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#00d654" />
        <directionalLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />

        <RobotErrorBoundary>
          <Suspense fallback={<LoadingIndicator />}>
            <CustomRobot onClick={() => {}} />
          </Suspense>
        </RobotErrorBoundary>

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.8}
          scale={10}
          blur={2.5}
          far={4}
          color="#000000"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}

if (typeof window !== "undefined") {
  useGLTF.preload("/models/robot.glb");
}
