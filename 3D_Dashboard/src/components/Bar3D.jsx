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
        <boxGeometry args={[0.75, height, 0.75]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.3}
          emissive={isHovered ? baseColor : 0x000000}
          emissiveIntensity={isHovered ? 0.4 : 0}
          wireframe={false}
        />
      </mesh>
      
      {/* Glow effect for hovered bar */}
      {isHovered && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[0.85, height + 0.1, 0.85]} />
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={0.05}
          />
        </mesh>
      )}
      
      {/* Base platform for each bar */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
        <meshStandardMaterial
          color={0x1e293b}
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
    </group>
  )
}

export default Bar3D
