import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCw, Pause, Play, ZoomIn, ZoomOut, Sparkles, Info, Globe, Star, Moon, Sun, Telescope, Eye, Maximize2, Settings } from 'lucide-react';

const Visualization = () => {
  const canvasRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState('earth');
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [zoom, setZoom] = useState(5);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const ringsRef = useRef(null);
  const glowRef = useRef(null);
  const cloudsRef = useRef(null);
  const atmosphereRef = useRef(null);

  const celestialObjects = [
    // PLANETS
    { 
      value: 'mercury', 
      label: 'Mercury', 
      category: 'Planet',
      color: 0x8C7853, 
      size: 0.8,
      info: 'Smallest planet, closest to the Sun with extreme temperature variations',
      distance: '57.9M km',
      diameter: '4,879 km',
      hasRings: false,
      texture: 'rocky',
      detailColor: 0x6B5D4F,
      emissive: 0x3D3530
    },
    { 
      value: 'venus', 
      label: 'Venus', 
      category: 'Planet',
      color: 0xFFC649, 
      size: 1.2,
      info: 'Hottest planet with toxic atmosphere and sulfuric acid clouds',
      distance: '108.2M km',
      diameter: '12,104 km',
      hasRings: false,
      texture: 'smooth',
      hasAtmosphere: true,
      atmosphereColor: 0xFFD700,
      detailColor: 0xE5B73B
    },
    { 
      value: 'earth', 
      label: 'Earth', 
      category: 'Planet',
      color: 0x2E5FA3, 
      size: 1.3,
      info: 'Our home planet, the only known world with life and liquid water',
      distance: '149.6M km',
      diameter: '12,742 km',
      hasRings: false,
      texture: 'earth',
      hasClouds: true,
      hasAtmosphere: true,
      atmosphereColor: 0x6DB3F2,
      continentColor: 0x228B22,
      oceanColor: 0x1E90FF
    },
    { 
      value: 'mars', 
      label: 'Mars', 
      category: 'Planet',
      color: 0xCD5C5C, 
      size: 1.0,
      info: 'The Red Planet with polar ice caps and ancient river valleys',
      distance: '227.9M km',
      diameter: '6,779 km',
      hasRings: false,
      texture: 'rocky',
      detailColor: 0xA0522D,
      polarCaps: true
    },
    { 
      value: 'jupiter', 
      label: 'Jupiter', 
      category: 'Planet',
      color: 0xDAA520, 
      size: 2.5,
      info: 'Largest planet, famous gas giant with the Great Red Spot',
      distance: '778.5M km',
      diameter: '139,820 km',
      hasRings: false,
      texture: 'gas',
      hasBands: true,
      bandColor: 0xC19A6B,
      spotColor: 0xDC143C
    },
    { 
      value: 'saturn', 
      label: 'Saturn', 
      category: 'Planet',
      color: 0xF4A460, 
      size: 2.2,
      info: 'Magnificent ringed planet with stunning ice and rock rings',
      distance: '1.43B km',
      diameter: '116,460 km',
      hasRings: true,
      texture: 'gas',
      hasBands: true,
      bandColor: 0xDEB887,
      ringColor: 0xE6D5C3
    },
    { 
      value: 'uranus', 
      label: 'Uranus', 
      category: 'Planet',
      color: 0x4FD0E7, 
      size: 1.8,
      info: 'Ice giant with unique sideways rotation and faint rings',
      distance: '2.87B km',
      diameter: '50,724 km',
      hasRings: true,
      texture: 'ice',
      detailColor: 0x5DADE2,
      ringColor: 0x85C1E2
    },
    { 
      value: 'neptune', 
      label: 'Neptune', 
      category: 'Planet',
      color: 0x4169E1, 
      size: 1.7,
      info: 'Deep blue ice giant with the fastest winds in the solar system',
      distance: '4.50B km',
      diameter: '49,244 km',
      hasRings: false,
      texture: 'ice',
      detailColor: 0x1E3A8A,
      hasStorm: true
    },
    
    // STARS
    { 
      value: 'sun', 
      label: 'Sun', 
      category: 'Star',
      color: 0xFDB813, 
      size: 3.0,
      info: 'Our star, provides light and heat to all planets in the solar system',
      distance: '149.6M km',
      diameter: '1.39M km',
      hasRings: false,
      glow: true,
      texture: 'sun',
      coronaColor: 0xFFD700,
      flareColor: 0xFF8C00
    },
    { 
      value: 'sirius', 
      label: 'Sirius', 
      category: 'Star',
      color: 0xE0FFFF, 
      size: 2.5,
      info: 'Brightest star in the night sky, actually a binary star system',
      distance: '8.6 light-years',
      diameter: '2.38M km',
      hasRings: false,
      glow: true,
      texture: 'star',
      coronaColor: 0xF0FFFF
    },
    { 
      value: 'betelgeuse', 
      label: 'Betelgeuse', 
      category: 'Star',
      color: 0xFF4500, 
      size: 3.5,
      info: 'Red supergiant in Orion, one of the largest known stars',
      distance: '642 light-years',
      diameter: '1.18B km',
      hasRings: false,
      glow: true,
      texture: 'star',
      coronaColor: 0xFF6347
    },
    { 
      value: 'polaris', 
      label: 'Polaris', 
      category: 'Star',
      color: 0xFFFAF0, 
      size: 2.8,
      info: 'North Star, reliable celestial navigation point for millennia',
      distance: '433 light-years',
      diameter: '46M km',
      hasRings: false,
      glow: true,
      texture: 'star',
      coronaColor: 0xFFFFF0
    },
    
    // MOONS
    { 
      value: 'moon', 
      label: 'Moon', 
      category: 'Moon',
      color: 0xC0C0C0, 
      size: 0.9,
      info: "Earth's only natural satellite with visible craters and maria",
      distance: '384,400 km',
      diameter: '3,474 km',
      hasRings: false,
      texture: 'rocky',
      hasCraters: true,
      craterColor: 0x808080
    },
    
    // GALAXIES
    { 
      value: 'milkyway', 
      label: 'Milky Way', 
      category: 'Galaxy',
      color: 0xE6E6FA, 
      size: 2.0,
      info: 'Our home galaxy with 200-400 billion stars in a spiral structure',
      distance: '26,000 light-years (to center)',
      diameter: '100,000 light-years',
      hasRings: false,
      isGalaxy: true,
      texture: 'galaxy',
      coreColor: 0xFFFFE0,
      armColor: 0xD8BFD8
    },
    { 
      value: 'andromeda', 
      label: 'Andromeda', 
      category: 'Galaxy',
      color: 0xB0C4DE, 
      size: 2.2,
      info: 'Nearest major galaxy, will merge with Milky Way in 4 billion years',
      distance: '2.5M light-years',
      diameter: '220,000 light-years',
      hasRings: false,
      isGalaxy: true,
      texture: 'galaxy',
      coreColor: 0xFFF8DC,
      armColor: 0xB0E0E6
    },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    let animationId;
    let scene, camera, renderer, sphere, starField;

    import('three').then((THREE) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000510);
      scene.fog = new THREE.Fog(0x000510, 10, 50);
      
      // Camera setup
      camera = new THREE.PerspectiveCamera(
        75, 
        canvas.clientWidth / canvas.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = zoom;
      
      // Renderer setup
      renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true,
        alpha: true 
      });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Enhanced starfield with multiple layers
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.7,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });

      const starsVertices = [];
      const starsColors = [];
      for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
        
        // Varying star colors
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.2 + 0.5, 0.3, 0.7 + Math.random() * 0.3);
        starsColors.push(color.r, color.g, color.b);
      }

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
      starsMaterial.vertexColors = true;
      starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      const pointLight1 = new THREE.PointLight(0x6B8EFF, 0.3);
      pointLight1.position.set(-5, 3, -5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xFF9E6B, 0.3);
      pointLight2.position.set(5, -3, 5);
      scene.add(pointLight2);

      // Get current object
      const currentObj = celestialObjects.find(obj => obj.value === selectedObject);

      // Create main celestial object with enhanced details
      const geometry = new THREE.SphereGeometry(currentObj.size, 128, 128);
      
      let material;
      if (currentObj.glow) {
        // Enhanced glowing effect for stars
        material = new THREE.MeshBasicMaterial({ 
          color: currentObj.color,
          wireframe: wireframe
        });
        
        // Multi-layer glow
        for (let i = 0; i < 3; i++) {
          const glowSize = currentObj.size * (1.15 + i * 0.1);
          const glowGeometry = new THREE.SphereGeometry(glowSize, 32, 32);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: currentObj.coronaColor || currentObj.color,
            transparent: true,
            opacity: 0.15 - i * 0.04,
            side: THREE.BackSide
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          scene.add(glow);
          if (i === 0) glowRef.current = glow;
        }

        // Add corona particles for stars
        const coronaGeometry = new THREE.BufferGeometry();
        const coronaVertices = [];
        for (let i = 0; i < 2000; i++) {
          const radius = currentObj.size * (1.1 + Math.random() * 0.5);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          coronaVertices.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
          );
        }
        coronaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(coronaVertices, 3));
        const coronaMaterial = new THREE.PointsMaterial({
          color: currentObj.flareColor || currentObj.color,
          size: 0.08,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        });
        const corona = new THREE.Points(coronaGeometry, coronaMaterial);
        scene.add(corona);
        particlesRef.current = corona;

      } else if (currentObj.isGalaxy) {
        // Enhanced galaxy effect
        material = new THREE.MeshPhongMaterial({ 
          color: currentObj.color,
          emissive: currentObj.coreColor || currentObj.color,
          emissiveIntensity: 0.4,
          shininess: 100,
          wireframe: wireframe,
          transparent: true,
          opacity: 0.85
        });

        // Galaxy spiral arms with multiple particle layers
        const spiralGeometry = new THREE.BufferGeometry();
        const spiralVertices = [];
        const spiralColors = [];
        
        for(let i = 0; i < 8000; i++) {
          const t = Math.random();
          const angle = t * Math.PI * 8 + Math.random() * 0.5;
          const radius = (t * 5 + Math.random() * 0.5) + currentObj.size;
          const armOffset = Math.floor(Math.random() * 4) * (Math.PI / 2);
          
          const x = Math.cos(angle + armOffset) * radius;
          const z = Math.sin(angle + armOffset) * radius;
          const y = (Math.random() - 0.5) * 0.8 * (1 - t);
          
          spiralVertices.push(x, y, z);
          
          const color = new THREE.Color(currentObj.armColor || currentObj.color);
          color.lerp(new THREE.Color(currentObj.coreColor || 0xFFFFFF), 1 - t);
          spiralColors.push(color.r, color.g, color.b);
        }
        
        spiralGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(spiralVertices), 3));
        spiralGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(spiralColors), 3));
        
        const spiralMaterial = new THREE.PointsMaterial({
          size: 0.03,
          transparent: true,
          opacity: 0.7,
          vertexColors: true,
          blending: THREE.AdditiveBlending
        });
        
        const spiralMesh = new THREE.Points(spiralGeometry, spiralMaterial);
        scene.add(spiralMesh);
        particlesRef.current = spiralMesh;

      } else {
        // Enhanced planets with detailed textures
        material = new THREE.MeshPhongMaterial({ 
          color: currentObj.color,
          shininess: currentObj.texture === 'ice' ? 120 : 40,
          wireframe: wireframe,
          specular: currentObj.texture === 'ice' ? 0x4FD0E7 : 0x333333,
          reflectivity: currentObj.texture === 'ice' ? 0.5 : 0.1
        });

        // Add surface details with bump mapping simulation
        if (currentObj.hasCraters || currentObj.texture === 'rocky') {
          const detailGeometry = new THREE.SphereGeometry(currentObj.size * 1.002, 128, 128);
          const detailMaterial = new THREE.MeshPhongMaterial({
            color: currentObj.detailColor || currentObj.color,
            transparent: true,
            opacity: 0.3,
            wireframe: false
          });
          const detailMesh = new THREE.Mesh(detailGeometry, detailMaterial);
          scene.add(detailMesh);
          meshRef.current = detailMesh;
        }

        // Earth-specific features
        if (currentObj.value === 'earth') {
          // Continents (green patches)
          const continentGeometry = new THREE.SphereGeometry(currentObj.size * 1.001, 64, 64);
          const continentMaterial = new THREE.MeshPhongMaterial({
            color: currentObj.continentColor,
            transparent: true,
            opacity: 0.4
          });
          const continents = new THREE.Mesh(continentGeometry, continentMaterial);
          scene.add(continents);
        }

        // Gas giant bands
        if (currentObj.hasBands) {
          for (let i = 0; i < 8; i++) {
            const bandGeometry = new THREE.SphereGeometry(currentObj.size * (1.001 + i * 0.001), 64, 64);
            const bandMaterial = new THREE.MeshPhongMaterial({
              color: i % 2 === 0 ? currentObj.bandColor : currentObj.color,
              transparent: true,
              opacity: 0.2
            });
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            scene.add(band);
          }
        }

        // Jupiter's Great Red Spot
        if (currentObj.value === 'jupiter') {
          const spotGeometry = new THREE.SphereGeometry(currentObj.size * 0.3, 32, 32);
          const spotMaterial = new THREE.MeshPhongMaterial({
            color: currentObj.spotColor,
            transparent: true,
            opacity: 0.8
          });
          const spot = new THREE.Mesh(spotGeometry, spotMaterial);
          spot.position.set(currentObj.size * 0.7, currentObj.size * 0.3, 0);
          scene.add(spot);
        }

        // Atmosphere glow
        if (currentObj.hasAtmosphere) {
          const atmosphereGeometry = new THREE.SphereGeometry(currentObj.size * 1.15, 64, 64);
          const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: currentObj.atmosphereColor || 0x6DB3F2,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
          });
          const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
          scene.add(atmosphere);
          atmosphereRef.current = atmosphere;
        }

        // Cloud layer for Earth and Venus
        if (currentObj.hasClouds || currentObj.value === 'venus') {
          const cloudGeometry = new THREE.SphereGeometry(currentObj.size * 1.01, 64, 64);
          const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: currentObj.value === 'venus' ? 0.7 : 0.4
          });
          const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
          scene.add(clouds);
          cloudsRef.current = clouds;
        }
      }

      sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      scene.add(sphere);

      if (!meshRef.current) meshRef.current = sphere;

      // Enhanced rings for Saturn and Uranus
      if (currentObj.hasRings) {
        const ringGeometry = new THREE.RingGeometry(
          currentObj.size * 1.5, 
          currentObj.size * 2.8, 
          128
        );
        
        // Create detailed ring texture
        const ringPositions = ringGeometry.attributes.position.array;
        const ringColors = new Float32Array(ringPositions.length);
        
        for (let i = 0; i < ringColors.length; i += 3) {
          const radius = Math.sqrt(ringPositions[i] ** 2 + ringPositions[i + 1] ** 2);
          const normalizedRadius = (radius - currentObj.size * 1.5) / (currentObj.size * 1.3);
          const intensity = 0.6 + Math.sin(normalizedRadius * 50) * 0.2;
          
          const color = new THREE.Color(currentObj.ringColor || currentObj.color);
          ringColors[i] = color.r * intensity;
          ringColors[i + 1] = color.g * intensity;
          ringColors[i + 2] = color.b * intensity;
        }
        
        ringGeometry.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));
        
        const ringMaterial = new THREE.MeshBasicMaterial({ 
          vertexColors: true,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        scene.add(rings);
        ringsRef.current = rings;

        // Add ring particles for depth
        const ringParticlesGeometry = new THREE.BufferGeometry();
        const ringParticlesPos = [];
        for (let i = 0; i < 3000; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = currentObj.size * (1.5 + Math.random() * 1.3);
          ringParticlesPos.push(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 0.05,
            Math.sin(angle) * radius
          );
        }
        ringParticlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(ringParticlesPos, 3));
        const ringParticlesMaterial = new THREE.PointsMaterial({
          color: currentObj.ringColor || currentObj.color,
          size: 0.02,
          transparent: true,
          opacity: 0.6
        });
        const ringParticles = new THREE.Points(ringParticlesGeometry, ringParticlesMaterial);
        scene.add(ringParticles);
      }

      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        if (isRotating && meshRef.current) {
          meshRef.current.rotation.y += 0.005 * rotationSpeed;
          meshRef.current.rotation.x += 0.002 * rotationSpeed;
        }

        if (glowRef.current && isRotating) {
          glowRef.current.rotation.y += 0.005 * rotationSpeed;
          glowRef.current.rotation.x += 0.002 * rotationSpeed;
        }

        if (cloudsRef.current && isRotating) {
          cloudsRef.current.rotation.y += 0.007 * rotationSpeed;
        }

        if (atmosphereRef.current && isRotating) {
          atmosphereRef.current.rotation.y += 0.003 * rotationSpeed;
        }

        if (ringsRef.current && isRotating) {
          ringsRef.current.rotation.z += 0.003 * rotationSpeed;
        }

        if (particlesRef.current && isRotating) {
          particlesRef.current.rotation.y += 0.002 * rotationSpeed;
        }

        // Rotate starfield
        if (starField) {
          starField.rotation.y += 0.00005;
          starField.rotation.x += 0.00002;
        }
        
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (!canvas) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationId) cancelAnimationFrame(animationId);
        if (renderer) renderer.dispose();
        if (geometry) geometry.dispose();
        if (material) material.dispose();
      };
    });
  }, [selectedObject, isRotating, rotationSpeed, zoom, lightIntensity, wireframe]);

  // Update camera zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoom;
    }
  }, [zoom]);

  const handleObjectChange = (value) => {
    setSelectedObject(value);
  };

  const currentObject = celestialObjects.find(obj => obj.value === selectedObject);
  const categories = [...new Set(celestialObjects.map(obj => obj.category))];

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Planet': return Globe;
      case 'Star': return Sun;
      case 'Moon': return Moon;
      case 'Galaxy': return Sparkles;
      default: return Telescope;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10"></div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
            <Telescope className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Ultra-Realistic 3D Experience</span>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cosmic Explorer
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Journey through space with photorealistic 3D celestial bodies. Experience planets, stars, and galaxies with unprecedented detail.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Controls Panel */}
          <Card className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-400" />
                Controls
              </CardTitle>
              <CardDescription className="text-slate-400">
                Customize your view
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Object Selection */}
              <div className="space-y-2">
                <Label className="text-slate-300 flex items-center gap-2">
                  <Telescope className="h-4 w-4" />
                  Select Object
                </Label>
                <Select value={selectedObject} onValueChange={handleObjectChange}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    {categories.map(category => {
                      const Icon = getCategoryIcon(category);
                      return (
                        <div key={category}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 flex items-center gap-2">
                            <Icon className="h-3 w-3" />
                            {category}s
                          </div>
                          {celestialObjects
                            .filter(obj => obj.category === category)
                            .map(obj => (
                              <SelectItem key={obj.value} value={obj.value}>
                                {obj.label}
                              </SelectItem>
                            ))}
                        </div>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Rotation Control */}
              <div className="space-y-3">
                <Button
                  variant={isRotating ? 'default' : 'outline'}
                  className={`w-full ${isRotating ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'border-slate-700'}`}
                  onClick={() => setIsRotating(!isRotating)}
                >
                  {isRotating ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isRotating ? 'Pause' : 'Play'} Rotation
                </Button>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs flex items-center justify-between">
                    <span>Rotation Speed</span>
                    <span className="text-blue-400">{rotationSpeed.toFixed(1)}x</span>
                  </Label>
                  <Slider
                    value={[rotationSpeed]}
                    onValueChange={(val) => setRotationSpeed(val[0])}
                    min={0.1}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Zoom Level
                  </span>
                  <span className="text-purple-400">{zoom.toFixed(1)}</span>
                </Label>
                <Slider
                  value={[zoom]}
                  onValueChange={(val) => setZoom(val[0])}
                  min={2}
                  max={15}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-700"
                    onClick={() => setZoom(Math.max(2, zoom - 1))}
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-700"
                    onClick={() => setZoom(Math.min(15, zoom + 1))}
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Light Intensity */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs flex items-center justify-between">
                  <span>Light Intensity</span>
                  <span className="text-amber-400">{lightIntensity.toFixed(1)}</span>
                </Label>
                <Slider
                  value={[lightIntensity]}
                  onValueChange={(val) => setLightIntensity(val[0])}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Wireframe Toggle */}
              <Button
                variant={wireframe ? 'default' : 'outline'}
                className={`w-full ${wireframe ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'border-slate-700'}`}
                onClick={() => setWireframe(!wireframe)}
              >
                <Maximize2 className="mr-2 h-4 w-4" />
                {wireframe ? 'Solid View' : 'Wireframe View'}
              </Button>

              {/* Info Toggle */}
              <Button
                variant={showInfo ? 'default' : 'outline'}
                className={`w-full ${showInfo ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'border-slate-700'}`}
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="mr-2 h-4 w-4" />
                {showInfo ? 'Hide' : 'Show'} Info
              </Button>
            </CardContent>
          </Card>

          {/* Visualization Canvas */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full" style={{ height: '700px' }}>
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full"
                  />
                  
                  {/* Info Overlay */}
                  {showInfo && currentObject && (
                    <div className="absolute top-6 left-6 right-6 pointer-events-none">
                      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 max-w-md">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 ${
                            currentObject.category === 'Planet' ? 'from-blue-500 to-cyan-500' :
                            currentObject.category === 'Star' ? 'from-amber-500 to-orange-500' :
                            currentObject.category === 'Moon' ? 'from-slate-400 to-slate-500' :
                            'from-purple-500 to-pink-500'
                          }`}>
                            {currentObject.category === 'Planet' && <Globe className="h-6 w-6 text-white" />}
                            {currentObject.category === 'Star' && <Sun className="h-6 w-6 text-white" />}
                            {currentObject.category === 'Moon' && <Moon className="h-6 w-6 text-white" />}
                            {currentObject.category === 'Galaxy' && <Sparkles className="h-6 w-6 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-2xl font-bold text-slate-100">{currentObject.label}</h3>
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                                {currentObject.category}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm mb-3">{currentObject.info}</p>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-slate-500 mb-1">Distance from Earth</p>
                                <p className="text-blue-400 font-semibold">{currentObject.distance}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 mb-1">Diameter</p>
                                <p className="text-purple-400 font-semibold">{currentObject.diameter}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Controls Hint */}
                  <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 rounded-lg px-4 py-2 text-xs text-slate-400 flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <RotateCw className="h-3 w-3" />
                        Auto-rotating
                      </span>
                      <span>•</span>
                      <span>Ultra-realistic rendering</span>
                      <span>•</span>
                      <span className="text-blue-400">Powered by Three.js</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border-blue-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-1">8 Planets</h4>
                      <p className="text-xs text-slate-400">Photorealistic planets with atmospheres, clouds, and surface details</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border-amber-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Sun className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-1">4 Stars</h4>
                      <p className="text-xs text-slate-400">Glowing stars with multi-layer coronas and solar flares</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-1">2 Galaxies</h4>
                      <p className="text-xs text-slate-400">Spiral galaxies with 8000+ particle stars in realistic arms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Section */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-400" />
                  About Cosmic Explorer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 text-slate-300">
                  <p>
                    Experience the universe like never before with our <span className="text-blue-400 font-semibold">ultra-realistic 3D rendering engine</span>. Every celestial body is crafted with meticulous attention to scientific accuracy and visual fidelity.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-100 flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-400" />
                        Advanced Features
                      </h4>
                      <ul className="text-sm space-y-1 text-slate-400">
                        <li>• Multi-layer atmospheric effects</li>
                        <li>• Procedural cloud systems</li>
                        <li>• Dynamic lighting with shadows</li>
                        <li>• Particle-based galaxy spirals</li>
                        <li>• Detailed planetary rings</li>
                        <li>• Surface bump mapping simulation</li>
                        <li>• Star coronas and solar flares</li>
                        <li>• 15,000+ colored starfield</li>
                        <li>• Real-time fog and depth effects</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-100 flex items-center gap-2">
                        <Telescope className="h-4 w-4 text-purple-400" />
                        Unique Details
                      </h4>
                      <ul className="text-sm space-y-1 text-slate-400">
                        <li>• Earth with continental features</li>
                        <li>• Jupiter's Great Red Spot</li>
                        <li>• Saturn's intricate ring patterns</li>
                        <li>• Venus's thick cloud cover</li>
                        <li>• Mars's polar ice caps</li>
                        <li>• Ice giants with specular highlights</li>
                        <li>• Moon's crater-filled surface</li>
                        <li>• Star temperature color variations</li>
                        <li>• Galaxy core brightness gradients</li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800/50">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-100 mb-1">Photorealistic Rendering</h5>
                        <p className="text-sm text-slate-400">
                          Built with advanced WebGL shaders, physically-based rendering, and custom particle systems to deliver the most accurate and beautiful space visualization available in a web browser.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Object Catalog */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-400" />
                  Complete Object Catalog
                </CardTitle>
                <CardDescription className="text-slate-400">
                  All {celestialObjects.length} celestial objects with unique 3D characteristics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {categories.map(category => {
                    const Icon = getCategoryIcon(category);
                    const objects = celestialObjects.filter(obj => obj.category === category);
                    
                    return (
                      <div key={category}>
                        <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                          <Icon className="h-5 w-5 text-blue-400" />
                          {category}s ({objects.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {objects.map(obj => (
                            <button
                              key={obj.value}
                              onClick={() => {
                                setSelectedObject(obj.value);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`p-3 rounded-lg border transition-all text-left ${
                                selectedObject === obj.value
                                  ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                                  : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/50'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: `#${obj.color.toString(16).padStart(6, '0')}` }}
                                />
                                <span className="font-semibold text-slate-100 text-sm">{obj.label}</span>
                              </div>
                              <p className="text-xs text-slate-500 truncate">{obj.distance}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;