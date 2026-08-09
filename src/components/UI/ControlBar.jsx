import React from 'react';
import { Play, Pause, FastForward, RotateCcw, Orbit } from 'lucide-react';
import { CELESTIAL_BODIES } from '../../data/celestialData';

export default function ControlBar({
  selectedBodyId,
  onSelectBody,
  timeSpeed,
  onChangeTimeSpeed,
  isPaused,
  onTogglePause,
  showOrbits,
  onToggleOrbits
}) {
  // All solar system planets & deep space objects in order
  const mainPills = [
    'sun',
    'mercury',
    'venus',
    'earth',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
    'milkyway'
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      left: '16px',
      right: '16px',
      zIndex: 20,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      {/* Quick Access Celestial Pills for ALL Planets */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'auto',
        overflowX: 'auto',
        maxWidth: '65vw',
        paddingBottom: '4px'
      }}>
        {mainPills.map((id) => {
          const body = id === 'milkyway'
            ? { id: 'milkyway', name: 'Milky Way', color: '#a855f7' }
            : CELESTIAL_BODIES.find((b) => b.id === id);

          if (!body) return null;
          const isSelected = selectedBodyId === id;

          return (
            <button
              key={id}
              onClick={() => onSelectBody(id)}
              className="glass-panel"
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isSelected ? '#cffaff' : '#cbd5e1',
                borderColor: isSelected ? '#06b6d4' : 'rgba(255,255,255,0.1)',
                background: isSelected ? 'rgba(6, 182, 212, 0.3)' : 'rgba(0,0,0,0.65)',
                boxShadow: isSelected ? '0 0 15px rgba(6,182,212,0.4)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: body.color }} />
              {body.name}
            </button>
          );
        })}
      </div>

      {/* Orbit Speed & Control Buttons */}
      <div className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
        padding: '8px 16px',
        borderRadius: '16px'
      }}>
        {/* Play / Pause */}
        <button
          onClick={onTogglePause}
          style={{
            padding: '8px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          title={isPaused ? 'Resume Orbits' : 'Pause Orbits'}
        >
          {isPaused ? <Play style={{ width: '16px', height: '16px', color: '#34d399' }} /> : <Pause style={{ width: '16px', height: '16px', color: '#fbbf24' }} />}
        </button>

        {/* Speed Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FastForward style={{ width: '14px', height: '14px', color: '#22d3ee' }} />
          <input
            type="range"
            min="1"
            max="100"
            value={timeSpeed}
            onChange={(e) => onChangeTimeSpeed(Number(e.target.value))}
            style={{
              width: '90px',
              cursor: 'pointer',
              accentColor: '#22d3ee'
            }}
          />
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#67e8f9', width: '30px' }}>
            {timeSpeed}x
          </span>
        </div>

        {/* Orbit Trails Toggle */}
        <button
          onClick={onToggleOrbits}
          style={{
            padding: '8px',
            borderRadius: '10px',
            background: showOrbits ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.05)',
            border: showOrbits ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.1)',
            color: showOrbits ? '#67e8f9' : '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Toggle Orbit Path Lines"
        >
          <Orbit style={{ width: '16px', height: '16px' }} />
        </button>

        {/* Reset View to Earth */}
        <button
          onClick={() => onSelectBody('earth')}
          style={{
            padding: '8px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Reset View to Earth"
        >
          <RotateCcw style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  );
}
