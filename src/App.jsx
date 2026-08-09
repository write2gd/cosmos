import React, { useState, useCallback } from 'react';
import CosmosCanvas from './components/CosmosCanvas';
import HeaderHUD from './components/UI/HeaderHUD';
import PlanetDrawer from './components/UI/PlanetDrawer';
import ControlBar from './components/UI/ControlBar';
import { spaceAudio } from './audio/spaceSynth';

export default function App() {
  const [selectedBodyId, setSelectedBodyId] = useState('earth');
  const [isRealisticScale, setIsRealisticScale] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const handleSelectBody = useCallback((id) => {
    setSelectedBodyId(id);
    spaceAudio.playChime(id === 'sun' ? 520 : id === 'milkyway' ? 660 : 440);
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
        isRealisticScale={isRealisticScale}
        timeSpeed={timeSpeed}
        isPaused={isPaused}
        showOrbits={showOrbits}
      />

      {/* Top Header HUD */}
      <HeaderHUD
        selectedBodyId={selectedBodyId}
        onSelectBody={handleSelectBody}
        isRealisticScale={isRealisticScale}
        onToggleScale={() => setIsRealisticScale((prev) => !prev)}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
      />

      {/* Side Planet Info Drawer */}
      <PlanetDrawer
        selectedBodyId={selectedBodyId}
        onClose={() => setSelectedBodyId(null)}
        onSelectBody={handleSelectBody}
      />

      {/* Bottom Controls Bar */}
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
