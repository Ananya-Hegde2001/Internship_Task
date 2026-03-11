# 3D Dashboard Widget - Premium Sales Analytics

A stunning, premium 3D dashboard widget that visualizes monthly sales data as an interactive 3D bar chart. Built with React Three Fiber, featuring smooth animations, hover effects, and professional styling.

## Features

✨ **3D Visualization**
- Interactive 3D bar chart using Three.js
- Smooth animations with cubic easing
- Multi-colored bars with metallic effects

🎨 **Premium Design**
- Modern gradient background
- Glass-morphism UI elements
- Real-time tooltips
- Smooth hover effects with glow

🖱️ **Interactivity**
- Orbit controls for camera manipulation
- Auto-rotating scene for cinematic effect
- Hover-to-highlight with value display
- Zoom and pan controls

⚡ **Performance**
- Optimized Three.js rendering
- Efficient state management with Zustand
- Smooth 60fps animations
- Responsive design

## Prerequisites

- Node.js 16+ and npm/yarn
- Modern web browser with WebGL support

## Installation

1. **Clone or navigate to the project directory:**
```bash
cd Internship_Task
```

2. **Install dependencies:**
```bash
npm install
```

## Running the Project

### Development Mode
```bash
npm run dev
```
The dashboard will automatically open at `http://localhost:3000`

### Build for Production
```bash
npm build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── main.jsx                 # React entry point
├── App.jsx                  # Main app component
├── App.css                  # App styles
├── components/
│   ├── Dashboard3D.jsx      # Main dashboard component
│   ├── Dashboard3D.css      # Dashboard styles
│   ├── Bar3D.jsx            # Individual 3D bar component
│   └── CameraController.jsx # Camera setup component
└── store/
    └── chartStore.js        # Zustand state management
```

## Customization

### Modify Sales Data
Edit the `DATA` array in [Dashboard3D.jsx](src/components/Dashboard3D.jsx):

```javascript
const DATA = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 52000 },
  // ... add more months
]
```

### Change Bar Colors
Modify the color array in [Bar3D.jsx](src/components/Bar3D.jsx):

```javascript
const baseColor = [
  0x3b82f6, // Blue
  0x8b5cf6, // Purple
  // ... customize colors
][index % 8]
```

### Adjust Animation Speed
In [Bar3D.jsx](src/components/Bar3D.jsx), modify the `duration`:

```javascript
const duration = 1200 // Animation duration in milliseconds
```

### Camera Position
In [CameraController.jsx](src/components/CameraController.jsx):

```javascript
camera.position.set(5, 4, 8) // Adjust X, Y, Z position
```

## Technologies Used

- **React 18** - UI framework
- **Three.js (r128)** - 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful helpers for React Three Fiber
- **Zustand** - Lightweight state management
- **Vite** - Modern build tool
- **CSS3** - Styling with animations and effects

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers (limited)

## Performance Tips

1. Reduce the number of bars if experiencing performance issues
2. Decrease `autoRotateSpeed` in OrbitControls for smoother rotation
3. Disable shadow maps on low-end devices
4. Use `dpr={1}` instead of `dpr={2}` for better performance on mobile

## License

MIT - Feel free to use this for your projects!

## Notes

- The dashboard uses hardcoded data (no API calls)
- All animations are optimized for smooth 60fps performance
- The design is responsive but works best on desktop/large screens
- Tooltips appear on hover with formatted currency values
