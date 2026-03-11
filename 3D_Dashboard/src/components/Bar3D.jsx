import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useChartStore } from '../store/chartStore'
import * as THREE from 'three'

const Bar3D = ({ 
  position, 
  height, 
  index, 
  label, 
  value,
  animationDelay 
}) => {
  const meshRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const setHoveredBar = useChartStore((state) => state.setHoveredBar)
  const setTooltipData = useChartStore((state) => state.setTooltipData)
  
  const startTimeRef = useRef(Date.now() + animationDelay)
  const glowRef = useRef()
  const outlineRef = useRef()
  
  useFrame(() => {
    if (!meshRef.current) return
    
    const elapsed = Date.now() - startTimeRef.current
    const duration = 1200 // Animation duration in ms
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function - cubic ease out
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    
    // Grow from the base: scale Y and move center upward as height increases.
    meshRef.current.scale.y = easeProgress
    meshRef.current.position.y = (height * easeProgress) / 2

    if (glowRef.current) {
      glowRef.current.scale.y = 0.7 + easeProgress * 0.3
      glowRef.current.position.y = (height * easeProgress) / 2

      if (isHovered) {
        const pulse = 0.11 + 0.07 * Math.sin(elapsed * 0.015)
        glowRef.current.material.opacity = pulse
      }
    }

    if (outlineRef.current) {
      outlineRef.current.position.y = (height * easeProgress) / 2
      if (isHovered) {
        outlineRef.current.material.opacity = 0.55 + 0.2 * Math.sin(elapsed * 0.02)
      }
    }
    
    // Smooth hover effect on X and Z
    const targetScale = isHovered ? 1.08 : 1
    const currentScaleX = meshRef.current.scale.x
    const currentScaleZ = meshRef.current.scale.z
    meshRef.current.scale.x += (targetScale - currentScaleX) * 0.15
    meshRef.current.scale.z += (targetScale - currentScaleZ) * 0.15
  })
  
  const handlePointerEnter = (event) => {
    event.stopPropagation()
    setIsHovered(true)
    setHoveredBar(index)
    setTooltipData({
      label,
      value: value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      index,
      x: event.clientX,
      y: event.clientY,
    })
  }

  const handlePointerMove = (event) => {
    event.stopPropagation()
    setTooltipData({
      label,
      value: value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      index,
      x: event.clientX,
      y: event.clientY,
    })
  }
  
  const handlePointerLeave = () => {
    setIsHovered(false)
    setHoveredBar(null)
    setTooltipData(null)
  }
  
  // Determine color based on index and hover state
  const baseColor = [
    0x3b82f6, // Blue
    0x8b5cf6, // Purple
    0xec4899, // Pink
    0xf59e0b, // Amber
    0x10b981, // Emerald
    0x06b6d4, // Cyan
    0xef4444, // Red
    0x6366f1, // Indigo
  ][index % 8]
  
  const color = isHovered ? new THREE.Color(baseColor).multiplyScalar(1.5) : new THREE.Color(baseColor)
  
  return (
    <group position={position}>
      {/* Main bar */}
      <mesh
        ref={meshRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        <boxGeometry args={[0.86, height, 0.86]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.35}
          roughness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.14}
          emissive={isHovered ? baseColor : 0x000000}
          emissiveIntensity={isHovered ? 0.44 : 0.08}
        />
      </mesh>
      
      {/* Glow effect for hovered bar */}
      {isHovered && (
        <mesh ref={glowRef} position={[0, height / 2, 0]}>
          <boxGeometry args={[0.95, height + 0.18, 0.95]} />
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={0.1}
          />
        </mesh>
      )}

      {isHovered && (
        <mesh ref={outlineRef} position={[0, height / 2, 0]}>
          <boxGeometry args={[0.98, height + 0.22, 0.98]} />
          <meshBasicMaterial
            color={0xe8f1ff}
            transparent
            opacity={0.6}
            wireframe
          />
        </mesh>
      )}

      <mesh position={[0, height + 0.03, 0]}>
        <cylinderGeometry args={[0.26, 0.34, 0.06, 32]} />
        <meshStandardMaterial
          color={isHovered ? 0xdce7ff : 0x9fb3d8}
          emissive={isHovered ? baseColor : 0x000000}
          emissiveIntensity={isHovered ? 0.3 : 0}
          metalness={0.7}
          roughness={0.22}
        />
      </mesh>
      
      {/* Base platform for each bar */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.56, 0.62, 0.11, 28]} />
        <meshStandardMaterial
          color={0x15243f}
          metalness={0.45}
          roughness={0.45}
        />
      </mesh>

      <mesh position={[0, 0.01, 0]}>
        <torusGeometry args={[0.5, 0.02, 10, 48]} />
        <meshStandardMaterial
          color={isHovered ? baseColor : 0x2b466f}
          emissive={isHovered ? baseColor : 0x000000}
          emissiveIntensity={isHovered ? 0.38 : 0}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

export default Bar3D
