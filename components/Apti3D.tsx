"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox, Sparkles } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

function PrecisionCore() {
  const assembly = useRef<Group>(null);
  const outer = useRef<Mesh>(null);
  const middle = useRef<Mesh>(null);
  const inner = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (assembly.current) {
      assembly.current.rotation.y = state.pointer.x * 0.28;
      assembly.current.rotation.x = state.pointer.y * -0.16;
      assembly.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.06;
    }
    if (outer.current) outer.current.rotation.z += delta * 0.16;
    if (middle.current) middle.current.rotation.x -= delta * 0.21;
    if (inner.current) inner.current.rotation.y += delta * 0.28;
  });

  return (
    <group ref={assembly} rotation={[0.08, -0.2, -0.08]}>
      <mesh ref={outer} rotation={[1.16, 0.12, 0.3]} castShadow>
        <torusGeometry args={[1.48, 0.095, 32, 160]} />
        <meshPhysicalMaterial color="#c66a3b" metalness={1} roughness={0.14} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh ref={middle} rotation={[0.3, 0.55, 0.15]} castShadow>
        <torusGeometry args={[1.2, 0.055, 24, 140]} />
        <meshPhysicalMaterial color="#8f96a4" metalness={1} roughness={0.1} clearcoat={1} />
      </mesh>
      <mesh ref={inner} rotation={[0.5, -0.25, 1.1]} castShadow>
        <torusGeometry args={[0.92, 0.035, 20, 120]} />
        <meshStandardMaterial color="#d8ab67" metalness={0.95} roughness={0.16} emissive="#7c3f13" emissiveIntensity={0.18} />
      </mesh>

      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.7, 96, 96]} />
        <meshPhysicalMaterial color="#111825" metalness={0.52} roughness={0.08} clearcoat={1} clearcoatRoughness={0.04} transmission={0.16} thickness={1.2} ior={1.45} />
      </mesh>
      <mesh scale={0.48}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#e67038" metalness={0.7} roughness={0.2} emissive="#ff5c1f" emissiveIntensity={0.55} wireframe />
      </mesh>
      <pointLight color="#ff6b35" intensity={18} distance={3.2} />

      {Array.from({ length: 12 }, (_, index) => {
        const angle = index / 12 * Math.PI * 2;
        return <mesh key={index} position={[Math.cos(angle) * 1.48, Math.sin(angle) * 1.48, 0]} scale={0.045}><sphereGeometry args={[1, 16, 16]} /><meshStandardMaterial color="#ffd29c" emissive="#ff8b4c" emissiveIntensity={2} /></mesh>;
      })}

      <Float speed={1.15} rotationIntensity={0.18} floatIntensity={0.34}>
        <group position={[-1.95, -0.9, -0.18]} rotation={[-0.2, 0.38, -0.12]}>
          <RoundedBox args={[1.25, 0.12, 0.78]} radius={0.035} smoothness={5} castShadow><meshPhysicalMaterial color="#252b36" metalness={0.85} roughness={0.2} /></RoundedBox>
          <RoundedBox args={[1.16, 0.065, 0.7]} radius={0.025} smoothness={4} position={[0, 0.1, 0]}><meshStandardMaterial color="#d4c7ad" roughness={0.52} /></RoundedBox>
          <mesh position={[0, 0.15, 0.02]}><boxGeometry args={[0.58, 0.018, 0.03]} /><meshStandardMaterial color="#c66a3b" /></mesh>
        </group>
      </Float>
      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.38}>
        <RoundedBox args={[0.72, 0.9, 0.06]} radius={0.04} smoothness={5} position={[1.92, 0.92, -0.32]} rotation={[0.08, -0.45, 0.08]} castShadow>
          <meshPhysicalMaterial color="#151b27" metalness={0.75} roughness={0.13} clearcoat={1} />
        </RoundedBox>
      </Float>
    </group>
  );
}

export default function Apti3D({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative w-full overflow-hidden ${compact ? "h-[340px]" : "h-[520px]"}`} aria-label="Interactive three-dimensional precision learning engine">
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0.1, 5.7], fov: 38 }} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.34} />
        <spotLight position={[4, 6, 5]} intensity={85} angle={0.34} penumbra={0.8} color="#fff0dc" castShadow />
        <spotLight position={[-5, 1, 3]} intensity={55} angle={0.48} penumbra={1} color="#ff7138" />
        <spotLight position={[4, -2, 2]} intensity={48} angle={0.45} penumbra={1} color="#6557d9" />
        <Suspense fallback={null}>
          <Sparkles count={compact ? 30 : 48} scale={[5, 3.4, 2]} size={1.25} speed={0.12} color="#e1b989" opacity={0.38} />
          <PrecisionCore />
          <ContactShadows position={[0, -1.82, 0]} opacity={0.58} scale={6} blur={2.5} far={4} color="#000000" />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-x-[18%] bottom-7 h-10 rounded-full bg-orange/10 blur-2xl" />
    </div>
  );
}
