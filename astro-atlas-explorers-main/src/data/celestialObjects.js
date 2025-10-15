// Celestial Objects Data

export const celestialObjects = [
  // Planets
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    category: 'Rocky Planet',
    image: '/src/assets/planets/mercury.jpg',
    description: 'The smallest planet in our solar system and closest to the Sun. Mercury has a heavily cratered surface similar to our Moon.',
    discoveryDate: 'Known to ancients',
    distance: '57.9 million km from Sun',
    mass: '3.285 × 10²³ kg',
    diameter: '4,879 km',
    tags: ['inner planet', 'terrestrial', 'no atmosphere']
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    category: 'Rocky Planet',
    image: '/src/assets/planets/venus.jpg',
    description: "The second planet from the Sun, often called Earth's twin due to similar size. Has a thick, toxic atmosphere.",
    discoveryDate: 'Known to ancients',
    distance: '108.2 million km from Sun',
    mass: '4.867 × 10²⁴ kg',
    diameter: '12,104 km',
    tags: ['inner planet', 'terrestrial', 'thick atmosphere']
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    category: 'Rocky Planet',
    image: '/src/assets/planets/earth.jpg',
    description: 'Our home planet, the only known world with life. Earth has liquid water, a protective atmosphere, and diverse ecosystems.',
    discoveryDate: 'N/A',
    distance: '149.6 million km from Sun',
    mass: '5.972 × 10²⁴ kg',
    diameter: '12,742 km',
    tags: ['inner planet', 'terrestrial', 'habitable', 'life']
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    category: 'Rocky Planet',
    image: '/src/assets/planets/mars.jpg',
    description: 'The Red Planet, known for its rusty color from iron oxide. Mars has polar ice caps and the largest volcano in the solar system.',
    discoveryDate: 'Known to ancients',
    distance: '227.9 million km from Sun',
    mass: '6.39 × 10²³ kg',
    diameter: '6,779 km',
    tags: ['inner planet', 'terrestrial', 'potential colonization']
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    category: 'Gas Giant',
    image: '/src/assets/planets/jupiter.jpg',
    description: 'The largest planet in our solar system. Jupiter is a gas giant with a Great Red Spot storm and over 79 moons.',
    discoveryDate: 'Known to ancients',
    distance: '778.5 million km from Sun',
    mass: '1.898 × 10²⁷ kg',
    diameter: '139,820 km',
    tags: ['outer planet', 'gas giant', 'great red spot']
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    category: 'Gas Giant',
    image: '/src/assets/planets/saturn.jpg',
    description: 'Famous for its spectacular ring system made of ice and rock. Saturn is the second-largest planet in our solar system.',
    discoveryDate: 'Known to ancients',
    distance: '1.43 billion km from Sun',
    mass: '5.683 × 10²⁶ kg',
    diameter: '116,460 km',
    tags: ['outer planet', 'gas giant', 'rings', 'beautiful']
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    category: 'Ice Giant',
    image: '/src/assets/planets/uranus.jpg',
    description: 'An ice giant that rotates on its side. Uranus has a blue-green color from methane in its atmosphere.',
    discoveryDate: '1781',
    distance: '2.87 billion km from Sun',
    mass: '8.681 × 10²⁵ kg',
    diameter: '50,724 km',
    tags: ['outer planet', 'ice giant', 'tilted rotation']
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    category: 'Ice Giant',
    image: '/src/assets/planets/neptune.jpg',
    description: 'The farthest planet from the Sun. Neptune has the strongest winds in the solar system and a deep blue color.',
    discoveryDate: '1846',
    distance: '4.50 billion km from Sun',
    mass: '1.024 × 10²⁶ kg',
    diameter: '49,244 km',
    tags: ['outer planet', 'ice giant', 'extreme weather']
  },
 
  // Stars
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    category: 'G-type Main Sequence Star',
    image: '/src/assets/stars/sun.jpg',
    description: "Our home star, a yellow dwarf that provides light and energy to our solar system. The Sun contains 99.86% of the solar system's mass.",
    discoveryDate: 'N/A',
    distance: '0 km (our star)',
    mass: '1.989 × 10³⁰ kg',
    diameter: '1.39 million km',
    tags: ['yellow dwarf', 'main sequence', 'solar system']
  },
  {
    id: 'sirius',
    name: 'Sirius',
    type: 'star',
    category: 'A-type Main Sequence Star',
    image: '/src/assets/stars/sun.jpg',
    description: "The brightest star in Earth's night sky, also known as the Dog Star. Sirius is actually a binary star system.",
    discoveryDate: 'Known to ancients',
    distance: '8.6 light-years',
    mass: '2.063 solar masses',
    diameter: '2.4 million km',
    tags: ['brightest', 'binary system', 'canis major']
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    type: 'star',
    category: 'Red Supergiant',
    image: '/src/assets/stars/sun.jpg',
    description: 'A massive red supergiant star in the constellation Orion. Betelgeuse is nearing the end of its life and could explode as a supernova.',
    discoveryDate: 'Known to ancients',
    distance: '643 light-years',
    mass: '16.5-19 solar masses',
    diameter: '1.2 billion km',
    tags: ['red supergiant', 'orion', 'variable star']
  },
 
  // Galaxies
  {
    id: 'milky-way',
    name: 'Milky Way',
    type: 'galaxy',
    category: 'Barred Spiral Galaxy',
    image: '/src/assets/galaxies/milkyway.jpg',
    description: 'Our home galaxy containing 100-400 billion stars, including our Sun. The Milky Way is a barred spiral galaxy.',
    discoveryDate: 'Known to ancients',
    distance: '0 (our galaxy)',
    mass: '1.5 trillion solar masses',
    diameter: '105,700 light-years',
    tags: ['spiral', 'barred', 'home galaxy', 'local group']
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    type: 'galaxy',
    category: 'Spiral Galaxy',
    image: '/src/assets/galaxies/andromeda.jpg',
    description: 'The nearest major galaxy to the Milky Way. Andromeda (M31) is on a collision course with our galaxy, expected to merge in 4.5 billion years.',
    discoveryDate: '964 AD',
    distance: '2.537 million light-years',
    mass: '1.5 trillion solar masses',
    diameter: '220,000 light-years',
    tags: ['spiral', 'nearest major galaxy', 'local group']
  },
  {
    id: 'whirlpool',
    name: 'Whirlpool Galaxy',
    type: 'galaxy',
    category: 'Spiral Galaxy',
    image: '/src/assets/galaxies/whirlpool.jpg',
    description: 'A classic spiral galaxy (M51) famous for its beautiful face-on spiral structure. Interacting with a smaller companion galaxy.',
    discoveryDate: '1773',
    distance: '23 million light-years',
    mass: '160 billion solar masses',
    diameter: '76,900 light-years',
    tags: ['spiral', 'interacting', 'face-on', 'messier']
  },
  {
    id: 'sombrero',
    name: 'Sombrero Galaxy',
    type: 'galaxy',
    category: 'Spiral Galaxy',
    image: '/src/assets/galaxies/sombrero.jpg',
    description: 'Named for its resemblance to a Mexican hat. The Sombrero Galaxy (M104) has a bright nucleus and prominent dust lane.',
    discoveryDate: '1781',
    distance: '29.3 million light-years',
    mass: '800 billion solar masses',
    diameter: '50,000 light-years',
    tags: ['spiral', 'edge-on', 'bright core', 'messier']
  }
];
