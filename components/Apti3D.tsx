"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, RoundedBox, Sparkles } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

function Mascot() {
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.22;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.12;
    }
    if (ring.current) ring.current.rotation.z -= delta * 0.35;
  });

  return (
    <group ref={group} rotation={[0.04, -0.22, 0]}>
      <mesh ref={ring} rotation={[1.22, 0.1, 0]} scale={1.3}>
        <torusGeometry args={[1.45, 0.025, 12, 90]} />
        <meshStandardMaterial color="#ff9a62" emissive="#ff6b35" emissiveIntensity={2} />
      </mesh>

      <mesh scale={[1.05, 1.12, 1]}>
        <icosahedronGeometry args={[1.05, 5]} />
        <MeshDistortMaterial color="#ff713c" roughness={0.22} metalness={0.18} distort={0.16} speed={2.2} />
      </mesh>
      <mesh position={[-0.36, 0.2, 0.9]} scale={[0.17, 0.24, 0.1]}>
        <sphereGeometry args={[1, 24, 24]} /><meshStandardMaterial color="#fff8ec" />
      </mesh>
      <mesh position={[0.36, 0.2, 0.9]} scale={[0.17, 0.24, 0.1]}>
        <sphereGeometry args={[1, 24, 24]} /><meshStandardMaterial color="#fff8ec" />
      </mesh>
      <mesh position={[-0.34, 0.18, 1.0]} scale={0.085}>
        <sphereGeometry args={[1, 20, 20]} /><meshStandardMaterial color="#091426" roughness={0.1} />
      </mesh>
      <mesh position={[0.34, 0.18, 1.0]} scale={0.085}>
        <sphereGeometry args={[1, 20, 20]} /><meshStandardMaterial color="#091426" roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.22, 1.0]} rotation={[0, 0, 0]} scale={[0.34, 0.07, 0.06]}>
        <sphereGeometry args={[1, 24, 12, 0, Math.PI]} /><meshStandardMaterial color="#30130c" />
      </mesh>

      <group position={[0, 1.02, 0.02]} rotation={[0.05, 0, -0.05]}>
        <RoundedBox args={[1.65, 0.1, 1.25]} radius={0.04} smoothness={3} rotation={[0, 0.15, 0]}>
          <meshStandardMaterial color="#17132f" roughness={0.3} metalness={0.25} />
        </RoundedBox>
        <RoundedBox args={[0.72, 0.35, 0.72]} radius={0.08} smoothness={3} position={[0, 0.16, 0]}>
          <meshStandardMaterial color="#211b43" />
        </RoundedBox>
        <mesh position={[0.78, -0.08, 0.1]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.025, 0.025, 0.95, 12]} /><meshStandardMaterial color="#ffc15e" emissive="#ffc15e" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.86, -0.54, 0.1]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#ffc15e" /></mesh>
      </group>

      <Float speed={2.1} rotationIntensity={1.4} floatIntensity={1.5}>
        <mesh position={[-1.75, 0.82, -0.15]} rotation={[0.2, 0.5, 0.4]}>
          <octahedronGeometry args={[0.28]} /><meshStandardMaterial color="#78f2c0" emissive="#2fa67a" emissiveIntensity={0.65} roughness={0.18} />
        </mesh>
      </Float>
      <Float speed={1.7} rotationIntensity={1.7} floatIntensity={1.8}>
        <mesh position={[1.72, -0.48, 0.15]} rotation={[0.5, 0.1, 0]}>
          <torusKnotGeometry args={[0.22, 0.07, 64, 10]} /><meshStandardMaterial color="#8b7cf6" emissive="#5943d8" emissiveIntensity={0.8} metalness={0.4} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Apti3D({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative w-full overflow-hidden ${compact ? "h-[320px]" : "h-[430px]"}`} aria-label="Apti, the three-dimensional IPMAT study guide">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0.15, 5.4], fov: 42 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.25} />
        <directionalLight position={[3, 4, 5]} intensity={3.2} color="#fff2dc" />
        <pointLight position={[-3, -1, 2]} intensity={28} distance={7} color="#ff6b35" />
        <pointLight position={[3, 1, 1]} intensity={24} distance={7} color="#7267f0" />
        <Suspense fallback={null}>
          <Sparkles count={compact ? 35 : 55} scale={[5, 3.8, 2]} size={2.3} speed={0.28} color="#ffc15e" opacity={0.55} />
          <Mascot />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-x-8 bottom-2 h-12 rounded-full bg-orange/20 blur-2xl" />
    </div>
  );
}
