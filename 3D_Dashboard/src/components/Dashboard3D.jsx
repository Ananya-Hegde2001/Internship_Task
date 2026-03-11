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
  { month: 'May', value: 100000 },
  { month: 'Jun', value: 67000 },
  { month: 'Jul', value: 72000 },
  { month: 'Aug', value: 68000 },
  { month: 'Sep', value: 41000 },
  { month: 'Oct', value: 80000 },
  { month: 'Nov', value: 65000 },
  { month: 'Dec', value: 94000 },
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

const formatAxisUSD = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 0,
  }).format(value)

const Scene = () => {
  // Calculate max value for scaling
  const maxValue = Math.max(...DATA.map((d) => d.value))
  const tickCount = 4
  const axisStepValue = Math.ceil(maxValue / tickCount / 5000) * 5000
  const axisMaxValue = axisStepValue * tickCount
  const chartHeight = 2.75
  const spacing = 1.45
  const totalWidth = (DATA.length - 1) * spacing
  const startX = -totalWidth / 2
  const axisX = startX - 1.25
  const guideWidth = totalWidth + 1.5
  const tickValues = Array.from({ length: tickCount + 1 }, (_, index) => index * axisStepValue)
  
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

      {/* Axis system and value scale */}
      <mesh position={[axisX, chartHeight / 2, 0]}>
        <boxGeometry args={[0.035, chartHeight + 0.12, 0.035]} />
        <meshStandardMaterial color={0x2e405f} metalness={0.45} roughness={0.35} />
      </mesh>

      <mesh position={[0, 0.001, 0]}>
        <boxGeometry args={[guideWidth, 0.028, 0.028]} />
        <meshStandardMaterial color={0x233552} metalness={0.4} roughness={0.42} />
      </mesh>

      {tickValues.map((tickValue, index) => {
        const tickY = (tickValue / axisMaxValue) * chartHeight
        const isBase = index === 0

        return (
          <group key={tickValue}>
            <mesh position={[axisX + guideWidth / 2 - 0.02, tickY, -0.48]}>
              <boxGeometry args={[guideWidth, 0.018, 0.018]} />
              <meshBasicMaterial
                color={isBase ? 0x32496f : 0x27405f}
                transparent
                opacity={isBase ? 0.52 : 0.24}
              />
            </mesh>

            <mesh position={[axisX, tickY, 0]}>
              <boxGeometry args={[0.14, 0.022, 0.022]} />
              <meshStandardMaterial color={0x5b7296} metalness={0.5} roughness={0.35} />
            </mesh>

            <Text
              position={[axisX - 0.38, tickY, 0.1]}
              fontSize={0.13}
              color={isBase ? '#d0dbef' : '#95a8c8'}
              anchorX="right"
              anchorY="middle"
            >
              {formatAxisUSD(tickValue)}
            </Text>
          </group>
        )
      })}

      <Text
        position={[axisX - 0.95, chartHeight / 2, 0.08]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.15}
        color="#8fa6c8"
        anchorX="center"
        anchorY="middle"
      >
        Revenue (USD)
      </Text>

      <Text
        position={[0, -0.62, 0.52]}
        fontSize={0.16}
        color="#8fa6c8"
        anchorX="center"
        anchorY="middle"
      >
        Months
      </Text>
      
      {/* Bars */}
      {DATA.map((item, index) => {
        const normalizedHeight = (item.value / axisMaxValue) * chartHeight
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
            <mesh position={[xPosition, 0.13, 0.88]}>
              <planeGeometry args={[0.72, 0.22]} />
              <meshBasicMaterial color={0x0a1a34} transparent opacity={0.5} />
            </mesh>
            <Text
              position={[xPosition, 0.13, 0.9]}
              fontSize={0.19}
              color="#f3f7ff"
              outlineWidth={0.006}
              outlineColor="#1c325a"
              anchorX="center"
              anchorY="middle"
            >
              {item.month}
            </Text>

            <Text
              position={[xPosition, normalizedHeight + 0.22, 0.18]}
              fontSize={0.11}
              color="#7fa0cf"
              anchorX="center"
              anchorY="middle"
            >
              {formatAxisUSD(item.value)}
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
        minDistance={4.8}
        maxDistance={9.25}
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
          <p>Interactive 3D revenue visualization • FY 2026</p>
        </header>

        <section className="metric-grid" aria-label="Sales summary metrics">
          <article className="metric-card">
            <span className="metric-label">Total Revenue</span>
            <strong className="metric-value">{formatCompactUSD(TOTAL_REVENUE)}</strong>
            <span className="metric-sub">FY 2026</span>
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
