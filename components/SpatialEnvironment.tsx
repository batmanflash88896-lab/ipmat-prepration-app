"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function Architecture() {
  const rig = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }) => {
    if (!rig.current || !wire.current) return;
    rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, pointer.x * 0.12, 0.025);
    rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, -pointer.y * 0.07, 0.025);
    wire.current.rotation.z = clock.elapsedTime * 0.018;
  });

  return (
    <group ref={rig}>
      <group ref={wire} position={[3.8, 0.4, -2.5]} rotation={[0.8, 0.2, 0.2]}>
        <mesh><torusGeometry args={[3.2, 0.012, 8, 120]} /><meshBasicMaterial color="#ff7b45" transparent opacity={0.32} /></mesh>
        <mesh rotation={[1.15, 0.5, 0.3]}><torusGeometry args={[2.4, 0.008, 8, 100]} /><meshBasicMaterial color="#ffc15e" transparent opacity={0.22} /></mesh>
        <mesh rotation={[0.2, 1.1, 0.6]}><torusGeometry args={[1.7, 0.008, 8, 90]} /><meshBasicMaterial color="#776df4" transparent opacity={0.25} /></mesh>
      </group>

      <Float speed={0.5} rotationIntensity={0.12} floatIntensity={0.35}>
        <mesh position={[-4.7, 1.8, -3.2]} rotation={[0.5, 0.7, -0.2]}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshPhysicalMaterial color="#172942" metalness={0.92} roughness={0.18} clearcoat={1} transparent opacity={0.42} wireframe />
        </mesh>
      </Float>
      <Float speed={0.4} rotationIntensity={0.2} floatIntensity={0.25}>
        <mesh position={[4.8, -2.3, -3.8]} rotation={[0.4, 0.2, 0.3]}>
          <boxGeometry args={[1.35, 1.35, 1.35]} />
          <MeshTransmissionMaterial color="#442318" transmission={0.72} thickness={0.5} roughness={0.22} chromaticAberration={0.03} />
        </mesh>
      </Float>
      <Sparkles count={42} scale={[12, 8, 4]} size={1.2} speed={0.12} opacity={0.32} color="#ffc68a" />
    </group>
  );
}

export default function SpatialEnvironment() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${(event.clientX / innerWidth - 0.5) * 2}`);
        root.style.setProperty("--pointer-y", `${(event.clientY / innerHeight - 0.5) * 2}`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(frame); };
  }, []);

  return (
    <div className="spatial-webgl" aria-hidden="true">
      <Canvas dpr={[1, 1.35]} camera={{ position: [0, 0, 8], fov: 48 }} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 5, 5]} intensity={18} color="#ff8b5d" />
        <pointLight position={[-5, -2, 3]} intensity={11} color="#756cf4" />
        <Architecture />
      </Canvas>
    </div>
  );
}
