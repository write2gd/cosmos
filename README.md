# 🌌 COSMOS 3D - Solar System Explorer

An immersive, interactive 3D visualization of our Solar System, the Milky Way galaxy, and deep space objects built with React, Three.js, and Vite.

![React](https://img.shields.io/badge/react-19.2-blue?logo=react) ![Three.js](https://img.shields.io/badge/three.js-0.185-orange?logo=three.js) ![Vite](https://img.shields.io/badge/vite-8.2-646cff?logo=vite)

## ✨ Features

### 🪐 Solar System
- **All Planets**: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
- **Moons & Satellites**: Earth's Moon, Mars' Phobos & Deimos, Jupiter's Galilean moons, Saturn's Titan, and more
- **Realistic Textures**: Procedurally generated textures with:
  - **Sun**: Photorealistic surface with granulation, sunspots, solar flares, and chromosphere glow
  - **Earth**: Detailed landmasses, ocean gradients, polar ice caps, and cloud formations
  - **Other planets**: Unique atmospheric and surface characteristics
- **Asteroid Belt**: 750 dynamically rendered asteroids with proximity-based brightness effects

### 🌌 Galaxy Scale
- **Milky Way**: Accurate galactic structure with 500,000+ stars and spiral arm visualization
- **Andromeda Galaxy**: Large spiral galaxy with 200,000+ stars and realistic arm structure
- **Triangulum Galaxy (M33)**: Smaller spiral galaxy with 80,000 stars
- **Dwarf Galaxies**: 5 elliptical dwarf galaxies surrounding Andromeda
- **Nebula Clusters**: Volumetric nebula filaments for deep space ambiance

### 🎮 Interactive Controls
- **3D Object Selection**: Click on any celestial object to view detailed information
- **Orbit Visualization**: Toggle orbital trails for all bodies
- **Time Control**: Speed up/slow down orbital motion (0.1x to 10x)
- **Geocentric View**: Observe the cosmos from any planet's perspective
- **Realistic Scale Toggle**: Switch between visual and scientifically accurate scales
- **Smooth Camera Flight**: Cinematic animated transitions between objects

### 🖥️ User Interface
- **Header HUD**: Comprehensive object selector dropdown organized by category
- **Info Board**: Displays detailed astronomical data when clicking on objects
- **Control Panel**: Playback controls, speed slider, orbit toggle, audio controls
- **Hover Tooltips**: Quick object identification on hover

### 🎵 Audio
- **Ambient Synth Soundtrack**: Immersive space music that changes based on selected object
- **Interactive Chimes**: Different tones for different celestial bodies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cosmos-3d.git
cd cosmos-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5174`

### Build for Production

```bash
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── CosmosCanvas.jsx          # Main 3D rendering engine
│   └── UI/
│       ├── HeaderHUD.jsx         # Top navigation and object selector
│       ├── ControlBar.jsx        # Bottom playback controls
│       └── PlanetDrawer.jsx      # Info panel
├── three/
│   └── proceduralTextures.js     # Procedural texture generation
├── data/
│   └── celestialData.js          # All celestial body definitions
├── audio/
│   └── spaceSynth.js             # Audio synthesis
├── App.jsx                        # Root component
└── main.jsx                       # Application entry point
```

## 🎨 Technology Stack

- **Frontend Framework**: React 19.2
- **3D Graphics**: Three.js 0.185
- **Build Tool**: Vite 8.2
- **UI Components**: Lucide React icons
- **Camera Controls**: OrbitControls (Three.js)

## 🌍 Celestial Data

All astronomical data is based on real measurements:
- Planetary distances, sizes, and orbital periods
- Realistic color profiles
- Accurate satellite information
- Galaxy positions and star distributions

## 🎯 Usage Tips

1. **Exploring**: Use mouse to rotate view, scroll to zoom, middle-click to pan
2. **Selection**: Click any object to view information and navigate to it
3. **Speed Control**: Adjust time multiplier from 0.1x (slow motion) to 10x (fast forward)
4. **Geocentric View**: Click the 🔭 button to observe from a selected planet
5. **Realistic Scale**: Toggle scale to see planets at true relative sizes

## 📊 Performance

- Optimized with InstancedMesh for asteroids
- GPU-accelerated rendering
- Procedural texture generation (no large image files)
- Efficient LOD (Level of Detail) culling

## 🌐 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Every push to `main` or `master` branch triggers a build and deployment.

### Manual Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting
```

## 📝 License

MIT License - feel free to use this project for educational and personal purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs and suggest features
- Improve textures and visual effects
- Add more celestial objects
- Enhance UI/UX
- Optimize performance

## 🙏 Credits

- Three.js community for excellent 3D library
- NASA for astronomical data
- Real-time procedural texture algorithms
- Vite for fast development experience

## 🔗 Links

- [Live Demo](https://yourusername.github.io/cosmos-3d)
- [GitHub Repository](https://github.com/yourusername/cosmos-3d)

---

**Made with ❤️ for space enthusiasts** 🚀✨
