import React from 'react';
import { X, Orbit, Radio } from 'lucide-react';
import { CELESTIAL_BODIES, GALAXY_INFO } from '../../data/celestialData';

export default function PlanetDrawer({ selectedBodyId, onClose, onSelectBody }) {
  if (!selectedBodyId) return null;

  const data = selectedBodyId === 'milkyway'
    ? GALAXY_INFO
    : CELESTIAL_BODIES.find((b) => b.id === selectedBodyId);

  if (!data) return null;

  const moons = CELESTIAL_BODIES.filter((b) => b.parentBodyId === selectedBodyId);

  return (
    <aside className="glass-panel" style={{
      position: 'absolute',
      top: '80px',
      right: '16px',
      bottom: '96px',
      width: '320px',
      zIndex: 20,
      pointerEvents: 'auto',
      borderRadius: '24px',
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
    }}>
      <div>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
          paddingBottom: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: data.color || '#a855f7',
              boxShadow: '0 0 12px rgba(255,255,255,0.6)'
            }} />
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px' }}>
                {data.name}
              </h2>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#22d3ee', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {data.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Description */}
        <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' }}>
          {data.description}
        </p>

        {/* Specs Table */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#22d3ee',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Radio style={{ width: '14px', height: '14px' }} /> Astronomical Specs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.stats &&
              Object.entries(data.stats).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}
                >
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>{key}</span>
                  <span style={{ color: '#a5f3fc', fontFamily: 'monospace', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Moons list */}
        {moons.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#22d3ee',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Orbit style={{ width: '14px', height: '14px' }} /> Natural Satellites ({moons.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {moons.map((moon) => (
                <button
                  key={moon.id}
                  onClick={() => onSelectBody(moon.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    fontSize: '11px',
                    color: '#cffaff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: moon.color }} />
                  {moon.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
