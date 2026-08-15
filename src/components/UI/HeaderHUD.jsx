import React, { useState } from 'react';
import { Search, Volume2, VolumeX, Eye, Sparkles, Compass, ChevronDown } from 'lucide-react';
import { CELESTIAL_BODIES } from '../../data/celestialData';

export default function HeaderHUD({
  selectedBodyId,
  onSelectBody,
  isRealisticScale,
  onToggleScale,
  isAudioActive,
  onToggleAudio
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isObjectsDropdownOpen, setIsObjectsDropdownOpen] = useState(false);

  const deepSpaceObjects = [
    { id: 'milkyway', name: 'Milky Way Galaxy', category: 'Deep Space', color: '#a855f7' },
    { id: 'andromeda', name: 'Andromeda Galaxy (M31)', category: 'Deep Space', color: '#3b82f6' },
    { id: 'triangulum', name: 'Triangulum Galaxy (M33)', category: 'Deep Space', color: '#60a5fa' }
  ];

  const extraBodies = deepSpaceObjects;

  const filteredBodies = [
    ...extraBodies.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase())),
    ...CELESTIAL_BODIES.filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ];

  return (
    <header style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      right: '16px',
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      pointerEvents: 'none'
    }}>
      {/* Brand, Scale Toggle & Objects Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
        <div className="glass-panel" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRadius: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #06b6d4, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass style={{ width: '18px', height: '18px', color: '#ffffff' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '1px',
              background: 'linear-gradient(90deg, #22d3ee, #ffffff, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              COSMOS 3D
            </h1>
            <p style={{ fontSize: '10px', color: 'rgba(34,211,238,0.7)', fontFamily: 'monospace', letterSpacing: '2px' }}>
              SOLAR SYSTEM EXPLORER
            </p>
          </div>
        </div>

        {/* Objects Dropdown Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsObjectsDropdownOpen(!isObjectsDropdownOpen)}
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#cffaff',
              borderColor: 'rgba(6,182,212,0.5)',
              background: isObjectsDropdownOpen ? 'rgba(6, 182, 212, 0.2)' : 'rgba(0,0,0,0.65)'
            }}
          >
            <span>🌍 Select Object</span>
            <ChevronDown style={{ width: '14px', height: '14px' }} />
          </button>

          {/* Objects Dropdown Menu */}
          {isObjectsDropdownOpen && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '48px',
              left: 0,
              width: '280px',
              background: 'rgba(8, 12, 24, 0.95)',
              borderRadius: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              zIndex: 1000
            }}>
              {/* Deep Space Objects */}
              <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ padding: '8px 14px', fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  🌌 GALAXIES
                </div>
                {deepSpaceObjects.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onSelectBody(b.id);
                      setIsObjectsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: '12px',
                      color: selectedBodyId === b.id ? '#00ffff' : '#e2e8f0',
                      background: selectedBodyId === b.id ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: b.color }} />
                    {b.name}
                  </button>
                ))}
              </div>

              {/* Planets & Moons grouped by category */}
              {['Star', 'Inner Planets', 'Outer Planets', 'Moons'].map((category) => {
                const bodiesInCategory = CELESTIAL_BODIES.filter(b => b.category === category);
                if (bodiesInCategory.length === 0) return null;
                
                const categoryIcons = {
                  'Star': '☀️',
                  'Inner Planets': '🪨',
                  'Outer Planets': '🪐',
                  'Moons': '🌙'
                };

                return (
                  <div key={category} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ padding: '8px 14px', fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                      {categoryIcons[category]} {category}
                    </div>
                    {bodiesInCategory.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          onSelectBody(b.id);
                          setIsObjectsDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          textAlign: 'left',
                          fontSize: '12px',
                          color: selectedBodyId === b.id ? '#00ffff' : '#e2e8f0',
                          background: selectedBodyId === b.id ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: b.color }} />
                        {b.name}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dual Scale Toggle */}
        <button
          onClick={onToggleScale}
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            color: isRealisticScale ? '#e9d5ff' : '#cffaff',
            borderColor: isRealisticScale ? 'rgba(168,85,247,0.5)' : 'rgba(6,182,212,0.5)'
          }}
        >
          <Eye style={{ width: '16px', height: '16px' }} />
          <span>{isRealisticScale ? 'Realistic Scale' : 'Visual Scale'}</span>
        </button>
      </div>

      {/* Audio Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto', position: 'relative' }}>
        {/* Audio Toggle Button */}
        <button
          onClick={onToggleAudio}
          className="glass-panel"
          style={{
            padding: '10px',
            borderRadius: '12px',
            cursor: 'pointer',
            color: isAudioActive ? '#22d3ee' : 'rgba(255,255,255,0.5)',
            borderColor: isAudioActive ? '#06b6d4' : 'rgba(255,255,255,0.1)'
          }}
          title={isAudioActive ? 'Mute Ambient Space Synth' : 'Play Cosmic Ambient Drone'}
        >
          {isAudioActive ? <Volume2 style={{ width: '16px', height: '16px' }} /> : <VolumeX style={{ width: '16px', height: '16px' }} />}
        </button>
      </div>
    </header>
  );
}
