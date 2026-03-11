import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
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
  const spacing = 2
  const totalWidth = (DATA.length - 1) * spacing
  const startX = -totalWidth / 2
  
  return (
    <>
      <CameraController />
      
      {/* Lighting - Enhanced for visibility */}
      <ambientLight intensity={1.5} color={0xffffff} />
      <directionalLight
        position={[20, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-15, 10, -15]} intensity={0.8} color={0x8b5cf6} />
      <pointLight position={[0, 15, 0]} intensity={0.5} color={0x3b82f6} />
      
      {/* Grid and floor for reference */}
      <gridHelper args={[30, 60]} position={[0, -3.1, 0]} />
      
      {/* Ground plane */}
      <mesh position={[0, -3.1, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color={0x0f172a}
          metalness={0.05}
          roughness={0.95}
        />
      </mesh>
      
      {/* Background backdrop */}
      <mesh position={[0, 0, -15]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color={0x0f172a} />
      </mesh>
      
      {/* Bars */}
      {DATA.map((item, index) => {
        const normalizedHeight = (item.value / maxValue) * 3.5
        const xPosition = startX + index * spacing
        
        return (
          <Bar3D
            key={index}
            index={index}
            position={[xPosition, 0, 0]}
            height={normalizedHeight}
            label={item.month}
            value={item.value}
            animationDelay={index * 80}
          />
        )
      })}
      
      {/* Orbit Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate={true}
        autoRotateSpeed={1.5}
        minDistance={12}
        maxDistance={25}
        dampingFactor={0.05}
        enableDamping={true}
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
            camera={{ position: [8, 6, 10], fov: 60 }}
            shadows
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              precision: 'highp',
            }}
          >
            <color attach="background" args={['#050b1c']} />
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
