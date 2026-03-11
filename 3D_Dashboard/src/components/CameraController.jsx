import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

const CameraController = () => {
  const { camera } = useThree()
  
  useEffect(() => {
    // Framed to keep bars dominant and centered in panel.
    camera.position.set(0, 2.7, 7.8)
    camera.lookAt(0, 1, 0)
  }, [camera])
  
  return null
}

export default CameraController
