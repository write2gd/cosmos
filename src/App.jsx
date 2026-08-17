import React, { useState, useCallback, useRef } from 'react';
import CosmosCanvas from './components/CosmosCanvas';
import HeaderHUD from './components/UI/HeaderHUD';
import PlanetDrawer from './components/UI/PlanetDrawer';
import ControlBar from './components/UI/ControlBar';
import { spaceAudio } from './audio/spaceSynth';

export default function App() {
  const [selectedBodyId, setSelectedBodyId] = useState('earth');
  const [infoBodyId, setInfoBodyId] = useState(null); // Separate state for info board
  const [isRealisticScale, setIsRealisticScale] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [observeFromPlanetId, setObserveFromPlanetId] = useState(null);

  // Zoom controls — CosmosCanvas populates this ref with { zoomIn, zoomOut }
  const zoomRef = useRef(null);
  const handleZoomIn = useCallback(() => zoomRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => zoomRef.current?.zoomOut(), []);

  const handleSelectBody = useCallback((id) => {
    setSelectedBodyId(id);
    spaceAudio.playChime(id === 'sun' ? 520 : id === 'milkyway' ? 660 : id === 'andromeda' ? 700 : 440);
  }, []);

  const handleToggleAudio = () => {
    const active = spaceAudio.toggle();
    setIsAudioActive(active);
  };

  return (
    <main style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#030308'
    }}>
      {/* 3D Cosmos Canvas Engine */}
      <CosmosCanvas
        selectedBodyId={selectedBodyId}
        onSelectBody={handleSelectBody}
        onClickBodyInScene={setInfoBodyId}
        isRealisticScale={isRealisticScale}
        timeSpeed={timeSpeed}
        isPaused={isPaused}
        showOrbits={showOrbits}
        observeFromPlanetId={observeFromPlanetId}
        zoomRef={zoomRef}
      />

      {/* Top Header HUD */}
      <HeaderHUD
        selectedBodyId={selectedBodyId}
        onSelectBody={handleSelectBody}
        isRealisticScale={isRealisticScale}
        onToggleScale={() => setIsRealisticScale((prev) => !prev)}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        observeFromPlanetId={observeFromPlanetId}
        onSetObserveFromPlanet={setObserveFromPlanetId}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* Side Planet Info Drawer */}
      <PlanetDrawer
        selectedBodyId={infoBodyId}
        onClose={() => setInfoBodyId(null)}
        onSelectBody={handleSelectBody}
      />

      {/* Bottom Speed Control Panel */}
      <ControlBar
        selectedBodyId={selectedBodyId}
        onSelectBody={handleSelectBody}
        timeSpeed={timeSpeed}
        onChangeTimeSpeed={setTimeSpeed}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits((prev) => !prev)}
      />
    </main>
  );
}
