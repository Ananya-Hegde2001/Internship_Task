import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const CameraController = () => {
  const { camera } = useThree()
  
  useEffect(() => {
    // Set initial camera position with nice angle
    camera.position.set(5, 4, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])
  
  return null
}

export default CameraController
