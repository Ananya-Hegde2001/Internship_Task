import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, Text } from '@react-three/drei'
import Bar3D from './Bar3D'
import CameraController from './CameraController'
import { useChartStore } from '../store/chartStore'
import './Dashboard3D.css'

// Monthly sales data
const DATA = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 52000 },
  { month: 'Mar', value: 48000 },
  { month: 'Apr', value: 61000 },
  { month: 'May', value: 55000 },
  { month: 'Jun', value: 67000 },
  { month: 'Jul', value: 72000 },
  { month: 'Aug', value: 68000 },
]

const TOTAL_REVENUE = DATA.reduce((sum, item) => sum + item.value, 0)
const MONTHLY_AVG = Math.round(TOTAL_REVENUE / DATA.length)
const PEAK_MONTH = DATA.reduce((max, item) => (item.value > max.value ? item : max), DATA[0])
const GROWTH = Math.round(((DATA[DATA.length - 1].value - DATA[0].value) / DATA[0].value) * 100)

const formatCompactUSD = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 0,
  }).format(value)

const Scene = () => {
  // Calculate max value for scaling
  const maxValue = Math.max(...DATA.map((d) => d.value))
  const spacing = 1.45
  const totalWidth = (DATA.length - 1) * spacing
  const startX = -totalWidth / 2
  
  return (
    <>
      <CameraController />

      {/* Premium cinematic lighting */}
      <ambientLight intensity={0.48} color={0xc8d8ff} />
      <spotLight
        position={[0, 12, 7]}
        intensity={2.2}
        angle={0.44}
        penumbra={0.7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color={0x9ec5ff}
      />
      <pointLight position={[-8, 3.5, -3]} intensity={0.95} color={0x16d5b5} />
      <pointLight position={[9, 5, 4]} intensity={0.75} color={0x6fa0ff} />

      <Environment preset="night" />
      
      {/* Floor and reference plane */}
      <gridHelper args={[14, 28, '#6f7f9b', '#2c3551']} position={[0, -0.02, 0]} />
      
      {/* Ground plane */}
      <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[8.2, 64]} />
        <meshStandardMaterial
          color={0x070f22}
          metalness={0.25}
          roughness={0.68}
        />
      </mesh>

      <ContactShadows position={[0, -0.02, 0]} opacity={0.45} scale={12} blur={2.2} far={3.8} />
      
      {/* Bars */}
      {DATA.map((item, index) => {
        const normalizedHeight = (item.value / maxValue) * 2.75
        const xPosition = startX + index * spacing
        
        return (
          <group key={index}>
            <Bar3D
              index={index}
              position={[xPosition, 0, 0]}
              height={normalizedHeight}
              label={item.month}
              value={item.value}
              animationDelay={index * 90}
            />
            <Text
              position={[xPosition, -0.35, 0.42]}
              fontSize={0.15}
              color="#7f90af"
              anchorX="center"
              anchorY="middle"
            >
              {item.month}
            </Text>
          </group>
        )
      })}
      
      {/* Orbit Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.55}
        minDistance={6.4}
        maxDistance={11}
        minPolarAngle={0.9}
        maxPolarAngle={1.55}
        dampingFactor={0.08}
        enableDamping={true}
        target={[0, 1, 0]}
      />
    </>
  )
}

const Dashboard3D = () => {
  const tooltipData = useChartStore((state) => state.tooltipData)
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="live-pill">
            <span className="live-dot" />
            <span>LIVE DASHBOARD</span>
          </div>
          <h1>Monthly Sales Overview</h1>
          <p>Interactive 3D revenue visualization • FY 2024</p>
        </header>

        <section className="metric-grid" aria-label="Sales summary metrics">
          <article className="metric-card">
            <span className="metric-label">Total Revenue</span>
            <strong className="metric-value">{formatCompactUSD(TOTAL_REVENUE)}</strong>
            <span className="metric-sub">FY 2024</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">Monthly Avg</span>
            <strong className="metric-value">{formatCompactUSD(MONTHLY_AVG)}</strong>
            <span className="metric-sub">12 months</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">Peak Month</span>
            <strong className="metric-value">{PEAK_MONTH.month}</strong>
            <span className="metric-sub">{formatCompactUSD(PEAK_MONTH.value)}</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">Growth</span>
            <strong className="metric-value">+{GROWTH}%</strong>
            <span className="metric-sub">vs first month</span>
          </article>
        </section>

        <section className="chart-panel" aria-label="3D sales chart panel">
          <div className="chart-panel-head">
            <span>3D Revenue Bars</span>
            <span className="drag-hint">Drag to rotate</span>
          </div>

          <Canvas
            className="canvas-3d"
            camera={{ position: [0, 2.7, 7.8], fov: 46 }}
            shadows
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              precision: 'highp',
            }}
          >
            <color attach="background" args={['#050b1c']} />
            <fog attach="fog" args={['#050b1c', 8, 20]} />
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </section>
      </div>
      
      {/* Tooltip */}
      {tooltipData && (
        <div
          className="tooltip"
          style={{
            left: tooltipData.x,
            top: tooltipData.y,
            transform: 'translate(14px, -110%)',
          }}
        >
          <div className="tooltip-header">{tooltipData.label}</div>
          <div className="tooltip-value">{tooltipData.value}</div>
        </div>
      )}
    </div>
  )
}

export default Dashboard3D
