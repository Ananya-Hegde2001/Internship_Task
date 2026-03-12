# 3D Dashboard Widget

https://github.com/user-attachments/assets/9e0b7669-b7e4-44a4-949e-5b33ecefa11f

Interactive 3D sales dashboard built with React + Three.js (React Three Fiber).
The current design uses a dark, cinematic analytics theme with teal accents, a live status header, metric cards, and a fully interactive 3D bar scene.

## Design Overview

The UI is structured in three layers:

1. Header layer
- Live status pill with animated pulse dot
- Primary title: "Monthly Sales Overview"
- Subtitle: "Interactive 3D revenue visualization - FY 2026"

2. Metrics layer
- Four summary cards:
  - Total Revenue
  - Monthly Avg
  - Peak Month
  - Growth (vs first month)
- Hover lift and shine effects for each card

3. Visualization layer
- 3D revenue bars for Jan-Dec
- Value axis with formatted USD ticks
- Month labels, top value labels, and floor grid
- Tooltip on hover with exact monthly value

## Visual Style

- Theme: Deep navy + cyan/teal highlight palette
- Lighting: Ambient + spot + point lights for premium depth
- Materials: Metallic and clearcoat bars, glow on hover
- Motion: Entrance bar growth animation and subtle scene autorotation
- Responsiveness: Metric grid collapses from 4 columns to 2 and then 1 on smaller screens

## Interaction Model

- Drag: Rotate scene
- Scroll/pinch: Zoom in/out
- Hover on bar:
  - Highlights bar with glow + wireframe outline
  - Updates floating tooltip with month and currency value
- Camera constraints:
  - Pan disabled for controlled framing
  - Polar/distance limits to keep data centered

## Tech Stack

- React 18
- Three.js
- @react-three/fiber
- @react-three/drei
- Zustand
- Vite

## Project Structure

```text
src/
  main.jsx
  App.jsx
  App.css
  components/
    Dashboard3D.jsx
    Dashboard3D.css
    Bar3D.jsx
    CameraController.jsx
  store/
    chartStore.js
```

## Setup

### Prerequisites

- Node.js 16+
- npm
- Browser with WebGL support

### Install

```bash
npm install
```

### Run (Development)

```bash
npm run dev
```

Dev server runs at: `http://localhost:3000`

### Build (Production)

```bash
npm run build
```

### Preview (Production Build)

```bash
npm run preview
```

### Windows Quick Start

```bat
start.bat
```

## Data and Metrics

- Data source is currently local and defined in `src/components/Dashboard3D.jsx`
- Dashboard computes:
  - Total revenue
  - Monthly average
  - Peak month
  - Growth percentage from first to last month

## Customization Guide

1. Update monthly data
- Edit `DATA` in `src/components/Dashboard3D.jsx`

2. Change color palette
- Edit `baseColor` array in `src/components/Bar3D.jsx`

3. Tune animation timing
- Edit `duration` in `src/components/Bar3D.jsx`

4. Adjust camera behavior
- Edit orbit settings in `src/components/Dashboard3D.jsx`
- Edit initial camera placement in `src/components/CameraController.jsx`

5. Restyle dashboard shell/cards
- Edit classes in `src/components/Dashboard3D.css`

## Notes

- Current implementation is client-side only (no API integration)
- Designed for both desktop and mobile layouts, with best spatial experience on desktop
- Tooltip values are formatted in USD
- Axis scale adapts to the maximum value in the dataset
