import React, { useState } from 'react';
import { Search, Volume2, VolumeX, Eye, Sparkles, Compass } from 'lucide-react';
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

  const filteredBodies = CELESTIAL_BODIES.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Brand & Scale Toggle */}
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

      {/* Search & Audio Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '12px'
          }}>
            <Search style={{ width: '16px', height: '16px', color: '#22d3ee' }} />
            <input
              type="text"
              placeholder="Search star, planet, moon..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '12px',
                color: '#ffffff',
                width: '170px'
              }}
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '48px',
              left: 0,
              right: 0,
              background: 'rgba(8, 12, 24, 0.95)',
              borderRadius: '12px',
              maxHeight: '240px',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}>
              <button
                onClick={() => {
                  onSelectBody('milkyway');
                  setIsSearchOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#d8b4fe',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles style={{ width: '14px', height: '14px', color: '#c084fc' }} />
                Milky Way Galaxy
              </button>
              {filteredBodies.length > 0 ? (
                filteredBodies.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onSelectBody(b.id);
                      setIsSearchOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: '12px',
                      color: '#e2e8f0',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: b.color }} />
                      {b.name}
                    </span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{b.category}</span>
                  </button>
                ))
              ) : (
                <div style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                  No cosmic body found
                </div>
              )}
            </div>
          )}
        </div>

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
