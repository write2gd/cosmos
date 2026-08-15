export const CELESTIAL_BODIES = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    category: 'Star',
    color: '#ffaa00',
    emissiveColor: '#ff7700',
    realRadius: 696340,
    visualRadius: 18,
    realDistance: 0,
    visualDistance: 0,
    orbitalPeriod: 0,
    rotationSpeed: 0.002,
    tilt: 7.25,
    atmosphereColor: '#ff6600',
    description: 'The Sun is the star at the center of the Solar System. It is a nearly perfect ball of hot plasma, heated to incandescence by nuclear fusion reactions in its core.',
    stats: {
      'Type': 'Yellow Dwarf (G2V)',
      'Diameter': '1,392,700 km',
      'Surface Temp': '5,500 °C',
      'Core Temp': '15,000,000 °C',
      'Mass': '333,000 Earths',
      'Age': '4.6 Billion Years'
    }
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    category: 'Inner Planets',
    color: '#a8a8a8',
    realRadius: 2439.7,
    visualRadius: 1.5,
    realDistance: 57.9,
    visualDistance: 32,
    orbitalPeriod: 88,
    rotationSpeed: 0.004,
    tilt: 0.03,
    atmosphereColor: '#666666',
    description: 'Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the Sun\'s planets.',
    stats: {
      'Distance from Sun': '57.9M km',
      'Orbital Period': '88 Days',
      'Day Length': '59 Earth Days',
      'Moons': '0',
      'Surface Temp': '-180 °C to 430 °C',
      'Gravity': '3.7 m/s²'
    }
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    category: 'Inner Planets',
    color: '#e3bb76',
    realRadius: 6051.8,
    visualRadius: 2.8,
    realDistance: 108.2,
    visualDistance: 48,
    orbitalPeriod: 224.7,
    rotationSpeed: -0.002,
    tilt: 177.3,
    atmosphereColor: '#ffaa44',
    description: 'Venus is the second planet from the Sun. It has a thick, toxic atmosphere dominated by carbon dioxide, with clouds of sulfuric acid, creating a runaway greenhouse effect.',
    stats: {
      'Distance from Sun': '108.2M km',
      'Orbital Period': '225 Days',
      'Day Length': '243 Earth Days',
      'Moons': '0',
      'Surface Temp': '465 °C (Hottest)',
      'Gravity': '8.87 m/s²'
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    category: 'Inner Planets',
    color: '#2b82c5',
    realRadius: 6371,
    visualRadius: 3.2,
    realDistance: 149.6,
    visualDistance: 68,
    orbitalPeriod: 365.25,
    rotationSpeed: 0.01,
    tilt: 23.44,
    atmosphereColor: '#41a0ff',
    hasAtmosphere: true,
    description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29.2% of Earth\'s surface is land and 70.8% is covered with water.',
    stats: {
      'Distance from Sun': '149.6M km',
      'Orbital Period': '365.25 Days',
      'Day Length': '24 Hours',
      'Moons': '1 (Luna)',
      'Surface Temp': '-88 °C to 58 °C',
      'Gravity': '9.81 m/s²'
    }
  },
  {
    id: 'moon',
    name: 'Moon (Luna)',
    type: 'moon',
    parentBodyId: 'earth',
    category: 'Moons',
    color: '#c2c2c2',
    realRadius: 1737.4,
    visualRadius: 0.8,
    realDistance: 0.384,
    visualDistance: 7,
    orbitalPeriod: 27.3,
    rotationSpeed: 0.005,
    tilt: 6.68,
    atmosphereColor: '#888888',
    description: 'The Moon is Earth\'s only natural satellite. It is the fifth largest satellite in the Solar System and the largest relative to its parent planet.',
    stats: {
      'Parent Planet': 'Earth',
      'Distance from Earth': '384,400 km',
      'Orbital Period': '27.3 Days',
      'Diameter': '3,474 km',
      'Gravity': '1.62 m/s² (16% Earth)',
      'Surface Temp': '-130 °C to 120 °C'
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    category: 'Inner Planets',
    color: '#c1440e',
    realRadius: 3389.5,
    visualRadius: 2.2,
    realDistance: 227.9,
    visualDistance: 92,
    orbitalPeriod: 687,
    rotationSpeed: 0.009,
    tilt: 25.19,
    atmosphereColor: '#ff5522',
    description: 'Mars is the fourth planet from the Sun. Known as the Red Planet due to iron oxide on its surface, it features Olympus Mons, the largest volcano in the Solar System.',
    stats: {
      'Distance from Sun': '227.9M km',
      'Orbital Period': '687 Days',
      'Day Length': '24h 37m',
      'Moons': '2 (Phobos, Deimos)',
      'Surface Temp': '-125 °C to 20 °C',
      'Gravity': '3.72 m/s²'
    }
  },
  {
    id: 'phobos',
    name: 'Phobos',
    type: 'moon',
    parentBodyId: 'mars',
    category: 'Moons',
    color: '#9e8a78',
    realRadius: 11.2,
    visualRadius: 0.4,
    realDistance: 0.009,
    visualDistance: 4.5,
    orbitalPeriod: 0.32,
    rotationSpeed: 0.02,
    tilt: 1.0,
    description: 'Phobos is the larger and innermost of the two natural satellites of Mars. It orbits Mars 3 times a day, so close to the planet that it will eventually crash into Mars.',
    stats: {
      'Parent Planet': 'Mars',
      'Orbital Period': '7 Hours 39 Mins',
      'Dimensions': '27 × 22 × 18 km',
      'Fate': 'Colliding with Mars in 50M yrs'
    }
  },
  {
    id: 'deimos',
    name: 'Deimos',
    type: 'moon',
    parentBodyId: 'mars',
    category: 'Moons',
    color: '#b0a090',
    realRadius: 6.2,
    visualRadius: 0.35,
    realDistance: 0.023,
    visualDistance: 7.0,
    orbitalPeriod: 1.26,
    rotationSpeed: 0.015,
    tilt: 0.9,
    description: 'Deimos is the smaller and outermost of the two natural satellites of Mars. It has a smooth surface covered with a thick layer of dust.',
    stats: {
      'Parent Planet': 'Mars',
      'Orbital Period': '30 Hours',
      'Dimensions': '15 × 12 × 11 km',
      'Surface': 'Covered in dark regolith'
    }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    category: 'Outer Planets',
    color: '#b07f35',
    realRadius: 69911,
    visualRadius: 9.0,
    realDistance: 778.5,
    visualDistance: 135,
    orbitalPeriod: 4333,
    rotationSpeed: 0.025,
    tilt: 3.13,
    atmosphereColor: '#d4a359',
    description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all other planets combined.',
    stats: {
      'Distance from Sun': '778.5M km',
      'Orbital Period': '11.86 Years',
      'Day Length': '9h 55m',
      'Moons': '95 (Io, Europa, Ganymede...)',
      'Great Red Spot': 'Storm > Earth size',
      'Gravity': '24.79 m/s²'
    }
  },
  {
    id: 'io',
    name: 'Io',
    type: 'moon',
    parentBodyId: 'jupiter',
    category: 'Moons',
    color: '#f5d442',
    realRadius: 1821.6,
    visualRadius: 0.7,
    realDistance: 0.421,
    visualDistance: 14,
    orbitalPeriod: 1.77,
    rotationSpeed: 0.01,
    tilt: 0,
    description: 'Io is the innermost of the four Galilean moons of Jupiter. It is the most geologically active body in the Solar System, with over 400 active volcanoes.',
    stats: {
      'Parent Planet': 'Jupiter',
      'Active Volcanoes': '400+',
      'Orbital Period': '42.5 Hours',
      'Diameter': '3,642 km',
      'Surface': 'Sulfur lakes & lava'
    }
  },
  {
    id: 'europa',
    name: 'Europa',
    type: 'moon',
    parentBodyId: 'jupiter',
    category: 'Moons',
    color: '#d4e2eb',
    realRadius: 1560.8,
    visualRadius: 0.65,
    realDistance: 0.670,
    visualDistance: 18,
    orbitalPeriod: 3.55,
    rotationSpeed: 0.008,
    tilt: 0.1,
    description: 'Europa is the smallest of the four Galilean moons orbiting Jupiter. Its smooth icy crust conceals a global liquid ocean containing more water than Earth.',
    stats: {
      'Parent Planet': 'Jupiter',
      'Ocean Depth': '60-150 km subsurface',
      'Orbital Period': '3.5 Days',
      'Diameter': '3,121 km',
      'Life Potential': 'High target for astrobiology'
    }
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    type: 'moon',
    parentBodyId: 'jupiter',
    category: 'Moons',
    color: '#9c8e80',
    realRadius: 2634.1,
    visualRadius: 0.85,
    realDistance: 1.07,
    visualDistance: 22,
    orbitalPeriod: 7.15,
    rotationSpeed: 0.007,
    tilt: 0.2,
    description: 'Ganymede is the largest moon in the Solar System—larger than Mercury. It is the only moon known to possess a magnetic field.',
    stats: {
      'Parent Planet': 'Jupiter',
      'Size': 'Largest moon in Solar System',
      'Diameter': '5,268 km (Larger than Mercury)',
      'Magnetic Field': 'Only moon with magnetic field'
    }
  },
  {
    id: 'callisto',
    name: 'Callisto',
    type: 'moon',
    parentBodyId: 'jupiter',
    category: 'Moons',
    color: '#6e6963',
    realRadius: 2410.3,
    visualRadius: 0.8,
    realDistance: 1.88,
    visualDistance: 26,
    orbitalPeriod: 16.69,
    rotationSpeed: 0.005,
    tilt: 0.3,
    description: 'Callisto is the second-largest moon of Jupiter. Its surface is the most heavily cratered of any object in the Solar System.',
    stats: {
      'Parent Planet': 'Jupiter',
      'Surface': 'Most heavily cratered in Solar System',
      'Diameter': '4,821 km',
      'Age': '4 Billion Year Old Surface'
    }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    category: 'Outer Planets',
    color: '#e2bf7d',
    realRadius: 58232,
    visualRadius: 7.5,
    realDistance: 1434,
    visualDistance: 180,
    orbitalPeriod: 10759,
    rotationSpeed: 0.022,
    tilt: 26.73,
    atmosphereColor: '#f7d08a',
    hasRings: true,
    ringInnerRadius: 10.5,
    ringOuterRadius: 18.0,
    description: 'Saturn is the sixth planet from the Sun and the second-largest. It is famous for its prominent ring system, composed mostly of ice particles and rocky debris.',
    stats: {
      'Distance from Sun': '1.43 Billion km',
      'Orbital Period': '29.45 Years',
      'Day Length': '10h 33m',
      'Moons': '146 (Titan, Enceladus...)',
      'Density': 'Less than water (0.69 g/cm³)',
      'Gravity': '10.44 m/s²'
    }
  },
  {
    id: 'titan',
    name: 'Titan',
    type: 'moon',
    parentBodyId: 'saturn',
    category: 'Moons',
    color: '#e69a24',
    realRadius: 2574.7,
    visualRadius: 0.9,
    realDistance: 1.22,
    visualDistance: 22,
    orbitalPeriod: 15.94,
    rotationSpeed: 0.006,
    tilt: 0.3,
    atmosphereColor: '#ffaa22',
    description: 'Titan is the largest moon of Saturn and the second-largest in the Solar System. It is the only known moon with a dense atmosphere and liquid methane lakes.',
    stats: {
      'Parent Planet': 'Saturn',
      'Atmosphere': '95% Nitrogen, 5% Methane',
      'Lakes': 'Liquid Ethane & Methane',
      'Orbital Period': '15.9 Days',
      'Diameter': '5,149 km'
    }
  },
  {
    id: 'enceladus',
    name: 'Enceladus',
    type: 'moon',
    parentBodyId: 'saturn',
    category: 'Moons',
    color: '#f0f8ff',
    realRadius: 252.1,
    visualRadius: 0.5,
    realDistance: 0.238,
    visualDistance: 15,
    orbitalPeriod: 1.37,
    rotationSpeed: 0.01,
    tilt: 0,
    description: 'Enceladus is an icy moon of Saturn that shoots massive water-ice geysers into space from an underground liquid ocean.',
    stats: {
      'Parent Planet': 'Saturn',
      'Geysers': '100+ Cryovolcanic plumes',
      'Ocean': 'Global subsurface ocean',
      'Diameter': '504 km'
    }
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    category: 'Outer Planets',
    color: '#70d6e3',
    realRadius: 25362,
    visualRadius: 5.0,
    realDistance: 2871,
    visualDistance: 225,
    orbitalPeriod: 30687,
    rotationSpeed: -0.015,
    tilt: 97.77,
    atmosphereColor: '#a1f3ff',
    hasRings: true,
    ringInnerRadius: 6.5,
    ringOuterRadius: 9.0,
    description: 'Uranus is the seventh planet from the Sun. It has the coldest planetary atmosphere in the Solar System, with a minimum temperature of -224 °C, and rotates almost on its side.',
    stats: {
      'Distance from Sun': '2.87 Billion km',
      'Orbital Period': '84 Years',
      'Day Length': '17h 14m',
      'Axial Tilt': '97.77° (Rotates sideways)',
      'Moons': '28 (Titania, Oberon...)',
      'Gravity': '8.69 m/s²'
    }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    category: 'Outer Planets',
    color: '#274687',
    realRadius: 24622,
    visualRadius: 4.8,
    realDistance: 4495,
    visualDistance: 270,
    orbitalPeriod: 60190,
    rotationSpeed: 0.018,
    tilt: 28.32,
    atmosphereColor: '#3a75ff',
    description: 'Neptune is the eighth and farthest-known solar planet from the Sun. It is 17 times the mass of Earth and features the fastest winds in the Solar System (up to 2,100 km/h).',
    stats: {
      'Distance from Sun': '4.50 Billion km',
      'Orbital Period': '164.8 Years',
      'Day Length': '16h 6m',
      'Winds': 'Up to 2,100 km/h',
      'Moons': '16 (Triton...)',
      'Gravity': '11.15 m/s²'
    }
  },
  {
    id: 'triton',
    name: 'Triton',
    type: 'moon',
    parentBodyId: 'neptune',
    category: 'Moons',
    color: '#d1e6e6',
    realRadius: 1353.4,
    visualRadius: 0.65,
    realDistance: 0.354,
    visualDistance: 16,
    orbitalPeriod: -5.88, // Retrograde orbit!
    rotationSpeed: 0.008,
    tilt: 156.8,
    description: 'Triton is the largest moon of Neptune. It is the only large moon in the Solar System with a retrograde orbit (orbiting in the opposite direction of its planet\'s rotation).',
    stats: {
      'Parent Planet': 'Neptune',
      'Orbit': 'Retrograde (Backward)',
      'Surface': 'Nitrogen ice & geysers',
      'Diameter': '2,706 km'
    }
  },
  {
    id: 'pluto',
    name: 'Pluto',
    type: 'dwarf_planet',
    category: 'Dwarf Planets',
    color: '#cfa686',
    realRadius: 1188.3,
    visualRadius: 1.2,
    realDistance: 5906,
    visualDistance: 310,
    orbitalPeriod: 90560,
    rotationSpeed: -0.003,
    tilt: 122.5,
    atmosphereColor: '#dfbca0',
    description: 'Pluto is a dwarf planet in the Kuiper Belt, a ring of bodies beyond Neptune. It was the first Kuiper belt object discovered and features a heart-shaped nitrogen glacier.',
    stats: {
      'Classification': 'Dwarf Planet (Kuiper Belt)',
      'Distance from Sun': '5.91 Billion km',
      'Orbital Period': '248 Years',
      'Surface Feature': 'Heart Glacier (Sputnik Planitia)',
      'Moons': '5 (Charon, Styx, Nix...)',
      'Gravity': '0.62 m/s²'
    }
  },
  {
    id: 'charon',
    name: 'Charon',
    type: 'moon',
    parentBodyId: 'pluto',
    category: 'Moons',
    color: '#998b7d',
    realRadius: 606,
    visualRadius: 0.5,
    realDistance: 0.019,
    visualDistance: 5.5,
    orbitalPeriod: 6.38,
    rotationSpeed: 0.005,
    tilt: 0,
    description: 'Charon is the largest moon of Pluto. It is so large relative to Pluto that the two form a binary dwarf planet system, tidally locked to each other.',
    stats: {
      'Parent Planet': 'Pluto',
      'System': 'Binary Dwarf Planet System',
      'Diameter': '1,212 km (Half of Pluto)',
      'Tidal Lock': 'Always shows same face to Pluto'
    }
  }
];

export const GALAXY_INFO = {
  id: 'milkyway',
  name: 'Milky Way Galaxy',
  type: 'galaxy',
  category: 'Deep Space',
  description: 'The Milky Way is the galaxy that contains our Solar System. It is a barred spiral galaxy with an estimated 100 to 400 billion stars.',
  stats: {
    'Type': 'Barred Spiral (SBbc)',
    'Diameter': '100,000 Light-Years',
    'Stars': '100 - 400 Billion',
    'Central Black Hole': 'Sagittarius A*',
    'Solar Position': 'Orion-Cygnus Arm'
  }
};

export const ANDROMEDA_INFO = {
  id: 'andromeda',
  name: 'Andromeda Galaxy',
  type: 'galaxy',
  category: 'Deep Space',
  color: '#3b82f6',
  description: 'Andromeda (M31) is a barred spiral galaxy and the nearest large galaxy to the Milky Way, located approximately 2.5 million light-years from Earth. It is on a collision course with the Milky Way, set to merge in about 4.5 billion years into a giant elliptical galaxy.',
  stats: {
    'Type': 'Barred Spiral (SA(s)b)',
    'Diameter': '220,000 Light-Years',
    'Stars': '1 Trillion',
    'Distance from Earth': '2.537M Light-Years',
    'Central Black Hole': 'Andromeda Core (P1/P2)',
    'Merger Countdown': '4.5 Billion Years'
  }
};

export const TRIANGULUM_INFO = {
  id: 'triangulum',
  name: 'Triangulum Galaxy',
  type: 'galaxy',
  category: 'Deep Space',
  color: '#60a5fa',
  description: 'Triangulum Galaxy (M33) is a beautiful spiral galaxy in the Local Group, orbiting the Milky Way and Andromeda. It is smaller but richer in star-forming regions and dust lanes than the Milky Way.',
  stats: {
    'Type': 'Unbarred Spiral (SA(s)cd)',
    'Diameter': '60,000 Light-Years',
    'Stars': '40 Billion',
    'Distance from Earth': '2.73M Light-Years',
    'Notable Feature': 'Large star-forming arms',
    'Local Group Role': 'Third-largest galaxy'
  }
};

export const EXTRA_COSMIC_OBJECTS = {
  triangulum: TRIANGULUM_INFO,
  'dwarf-m110': {
    id: 'dwarf-m110',
    name: 'M110 Dwarf Galaxy',
    type: 'dwarf_galaxy',
    category: 'Deep Space',
    color: '#ffd700',
    description: 'Messier 110 is a dwarf elliptical galaxy orbiting Andromeda. It is compact, dim, and rich in older stars with a smooth, low-surface-brightness glow.',
    stats: {
      'Type': 'Dwarf Elliptical',
      'Distance from Earth': '2.7M Light-Years',
      'Parent Galaxy': 'Andromeda',
      'Appearance': 'Smooth, diffuse stellar halo'
    }
  },
  'dwarf-m32': {
    id: 'dwarf-m32',
    name: 'M32 Elliptical Dwarf',
    type: 'dwarf_galaxy',
    category: 'Deep Space',
    color: '#ff6b9d',
    description: 'Messier 32 is a compact satellite galaxy of Andromeda. It is one of the closest dwarf galaxies to the Milky Way and shows signs of tidal disruption from Andromeda.',
    stats: {
      'Type': 'Compact Elliptical',
      'Distance from Earth': '2.5M Light-Years',
      'Parent Galaxy': 'Andromeda',
      'Notable Feature': 'Dense core and tidal distortion'
    }
  },
  'nebula-cluster-cygnus': {
    id: 'nebula-cluster-cygnus',
    name: 'Cygnus Nebula Cluster',
    type: 'nebula_cluster',
    category: 'Deep Space',
    color: '#00ccff',
    description: 'This bright nebula cluster is a diffuse emission region filled with glowing gas and dense stellar nurseries. It is a vivid example of active star formation within the galactic neighborhood.',
    stats: {
      'Type': 'Emission Nebula Cluster',
      'Primary Gas': 'Ionized hydrogen',
      'Appearance': 'Blue-green glowing filaments',
      'Star Formation': 'Active'
    }
  },
  'nebula-cluster-rose': {
    id: 'nebula-cluster-rose',
    name: 'Rose Dust Nebula',
    type: 'nebula_cluster',
    category: 'Deep Space',
    color: '#ff4d8d',
    description: 'A rose-hued dust and ionized gas cloud, rich in fine particulate matter and energetic stellar winds. It glows softly where hot young stars illuminate the surrounding gas.',
    stats: {
      'Type': 'Dust + Emission Nebula',
      'Dominant Color': 'Rose-pink',
      'Composition': 'Gas + dust lanes',
      'Star Formation': 'Bursting'
    }
  }
};

