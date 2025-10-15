import { useState, useEffect, useRef } from 'react';
import { Rocket, Telescope, BookOpen, BarChart3, Star, Sparkles, Globe, Moon, Zap, ArrowRight, Users, Database, Eye, Activity, X, Search, Filter, Layers, TrendingUp } from 'lucide-react';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedQuickLink, setSelectedQuickLink] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2,
      opacity: Math.random(),
      speed: Math.random() * 0.5
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2
    }));

    let animationFrame;
    const animate = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.5 + Math.random() * 0.5})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const features = [
    {
      icon: Telescope,
      title: 'Explore the Cosmos',
      description: 'Discover planets, stars, and galaxies with detailed information',
      color: 'from-blue-500 to-cyan-500',
      details: {
        overview: 'Journey through the universe with our comprehensive cosmic gallery featuring stunning imagery and detailed astronomical data.',
        features: [
          'High-resolution images of planets, nebulae, and galaxies',
          'Detailed astronomical data and specifications',
          'Interactive sky maps and constellation guides',
          'Real-time celestial event tracking',
          'Curated collections by object type and discovery',
          'Educational resources and fun facts'
        ],
        capabilities: [
          { label: 'Browse', desc: 'Explore thousands of celestial objects' },
          { label: 'Search', desc: 'Find specific objects instantly' },
          { label: 'Learn', desc: 'Access detailed information' },
          { label: 'Save', desc: 'Create your personal collection' }
        ]
      }
    },
    {
      icon: BookOpen,
      title: 'Interactive Learning',
      description: 'Access comprehensive celestial object database with search and filters',
      color: 'from-purple-500 to-pink-500',
      details: {
        overview: 'Dive deep into our extensive astronomical encyclopedia with powerful search and filtering capabilities.',
        features: [
          'Advanced search with multiple parameters',
          'Filter by object type, constellation, and distance',
          'Sort by magnitude, size, and discovery date',
          'Detailed articles and scientific documentation',
          'Historical data and discovery timeline',
          'Cross-referenced celestial relationships'
        ],
        capabilities: [
          { label: 'Search', desc: 'Find objects by name or properties' },
          { label: 'Filter', desc: 'Narrow down by specific criteria' },
          { label: 'Compare', desc: 'Analyze multiple objects side-by-side' },
          { label: 'Export', desc: 'Download data for your research' }
        ]
      }
    },
    {
      icon: Rocket,
      title: '3D Visualization',
      description: 'Experience celestial objects in immersive 3D previews',
      color: 'from-green-500 to-emerald-500',
      details: {
        overview: 'Experience space like never before with cutting-edge 3D visualization technology that brings the cosmos to life.',
        features: [
          'Real-time 3D rendering of celestial bodies',
          '360-degree rotation and zoom capabilities',
          'Interactive surface exploration with details',
          'Accurate scale representations',
          'Orbital path visualization',
          'Time-lapse animations of celestial movements'
        ],
        capabilities: [
          { label: 'Rotate', desc: 'View objects from any angle' },
          { label: 'Zoom', desc: 'Explore surface details up close' },
          { label: 'Animate', desc: 'Watch orbital movements' },
          { label: 'Interact', desc: 'Click for detailed information' }
        ]
      }
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      description: 'View detailed reports and insights about space exploration',
      color: 'from-amber-500 to-orange-500',
      details: {
        overview: 'Access comprehensive analytics and insights about space exploration with real-time data visualization and reporting.',
        features: [
          'Real-time exploration statistics and trends',
          'Interactive data visualizations and charts',
          'Mission tracking and progress reports',
          'Discovery timeline and milestones',
          'User engagement metrics and patterns',
          'Export reports in multiple formats'
        ],
        capabilities: [
          { label: 'Analyze', desc: 'Deep dive into exploration data' },
          { label: 'Track', desc: 'Monitor ongoing missions' },
          { label: 'Visualize', desc: 'Interactive charts and graphs' },
          { label: 'Report', desc: 'Generate custom reports' }
        ]
      }
    }
  ];

  const quickLinks = [
    {
      title: 'User Dashboard',
      description: 'Track your favorites',
      color: 'blue',
      icon: Users,
      details: {
        overview: 'Your personal space exploration hub where you can manage favorites, track viewing history, and customize your experience.',
        features: [
          'Save and organize favorite celestial objects',
          'View your exploration history and statistics',
          'Create custom collections and playlists',
          'Set alerts for celestial events',
          'Track your learning progress',
          'Personalize your dashboard layout'
        ],
        actions: [
          { icon: Star, label: 'Favorites', desc: 'Quick access to saved objects' },
          { icon: Activity, label: 'Activity', desc: 'Your exploration timeline' },
          { icon: Eye, label: 'Watchlist', desc: 'Track upcoming events' },
          { icon: Database, label: 'Collections', desc: 'Organized galleries' }
        ]
      }
    },
    {
      title: 'Admin Dashboard',
      description: 'Manage the platform',
      color: 'red',
      icon: Database,
      details: {
        overview: 'Comprehensive platform management tools for administrators to maintain content, monitor usage, and manage users.',
        features: [
          'Content management and moderation',
          'User account administration',
          'System analytics and monitoring',
          'Database maintenance tools',
          'Security and access control',
          'Platform configuration settings'
        ],
        actions: [
          { icon: Users, label: 'Users', desc: 'Manage user accounts' },
          { icon: Database, label: 'Content', desc: 'Update celestial data' },
          { icon: BarChart3, label: 'Analytics', desc: 'Platform statistics' },
          { icon: Zap, label: 'Settings', desc: 'System configuration' }
        ]
      }
    },
    {
      title: 'Explore Gallery',
      description: 'Browse celestial objects',
      color: 'purple',
      icon: Telescope,
      details: {
        overview: 'Immerse yourself in a stunning visual gallery featuring thousands of celestial objects from across the universe.',
        features: [
          'Grid and list view options',
          'High-resolution image previews',
          'Quick filters by object category',
          'Sorting by popularity and recency',
          'Lightbox for detailed viewing',
          'Share objects with friends'
        ],
        actions: [
          { icon: Search, label: 'Search', desc: 'Find specific objects' },
          { icon: Filter, label: 'Filter', desc: 'Refine your results' },
          { icon: Layers, label: 'Categories', desc: 'Browse by type' },
          { icon: Star, label: 'Featured', desc: 'Curated highlights' }
        ]
      }
    },
    {
      title: '3D Solar System',
      description: 'Interactive 3D experience',
      color: 'green',
      icon: Globe,
      external: true,
      link: 'https://saketh-04.github.io/ThreeDimensional/',
      details: {
        overview: 'Experience our solar system in stunning 3D with accurate planetary positions, orbital mechanics, and interactive controls.',
        features: [
          'Real-time 3D solar system simulation',
          'Accurate orbital mechanics and positions',
          'Interactive planet selection and info',
          'Time controls to view past/future positions',
          'Multiple camera angles and perspectives',
          'Educational overlays and annotations'
        ],
        actions: [
          { icon: Globe, label: 'Navigate', desc: 'Fly through the solar system' },
          { icon: Zap, label: 'Interact', desc: 'Click planets for details' },
          { icon: Activity, label: 'Animate', desc: 'Watch orbital movements' },
          { icon: Eye, label: 'Explore', desc: 'Discover planetary features' }
        ]
      }
    }
  ];

  const stats = [
    { label: 'Celestial Objects', value: '10,000+', icon: Globe },
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Data Points', value: '1M+', icon: Database },
    { label: 'Daily Views', value: '100K+', icon: Eye }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="fixed inset-0 z-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${2 + star.speed}s infinite ease-in-out`,
              animationDelay: `${star.speed}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 z-10">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />
        
        <div className="container mx-auto text-center relative z-20">
          <h1 
            className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient drop-shadow-2xl"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
              transition: 'transform 0.3s ease-out',
              textShadow: '0 0 80px rgba(139, 92, 246, 0.5)'
            }}
          >
            AstroAtlas
          </h1>

          <p className="text-xl md:text-3xl text-slate-300 mb-4 max-w-4xl mx-auto font-light">
            Your Gateway to the <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text font-semibold drop-shadow-lg">Cosmos</span>
          </p>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Discover celestial wonders, explore 3D visualizations, and dive deep into the mysteries of the universe
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <a 
              href="/gallery"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Telescope className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Explore Gallery</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </a>
            
            <a 
              href="/visualization"
              className="group relative inline-flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 border-2 border-purple-500/50 hover:border-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <Rocket className="h-5 w-5" />
              3D Visualization
              <Sparkles className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            </a>

            <a 
              href="https://saketh-04.github.io/ThreeDimensional/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border-2 border-green-500/50 hover:border-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50"
            >
              <Globe className="h-5 w-5 animate-spin-slow" />
              3D Solar System
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all animate-pulse-slow" />
                <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30">
                  <stat.icon className="h-8 w-8 text-purple-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-slate-400 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4 z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-2 mb-4 backdrop-blur-sm">
              <Star className="h-4 w-4 text-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-300">Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Explore the Universe
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powerful tools to discover, learn, and visualize the cosmos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <button
                key={i}
                onClick={() => setSelectedFeature(feature)}
                className="group relative text-left w-full"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-all duration-500`} />
                <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-slate-700/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} bg-opacity-10 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-4">{feature.description}</p>
                  <div className="inline-flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-4 transition-all">
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="relative py-32 px-4 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full px-6 py-2 mb-4 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-green-400 animate-pulse" />
              <span className="text-sm font-medium text-green-300">Quick Access</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Jump Right In
            </h2>
            <p className="text-xl text-slate-400">
              Access dashboards and special features instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {quickLinks.map((link, i) => {
              if (link.external) {
                return (
                  <a
                    key={i}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 hover:border-slate-700/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                            <link.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{link.title}</h3>
                            <p className="text-slate-400">{link.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-6 w-6 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                        <Globe className="h-4 w-4" />
                        External Link
                      </div>
                    </div>
                  </a>
                );
              }

              return (
                <button
                  key={i}
                  onClick={() => setSelectedQuickLink(link)}
                  className="group relative w-full text-left"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-${link.color}-500/20 to-${link.color === 'blue' ? 'cyan' : link.color === 'red' ? 'orange' : 'pink'}-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                  <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 hover:border-slate-700/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 bg-gradient-to-br from-${link.color}-500 to-${link.color === 'blue' ? 'cyan' : link.color === 'red' ? 'orange' : 'pink'}-500 rounded-xl`}>
                          <link.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{link.title}</h3>
                          <p className="text-slate-400">{link.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-6 w-6 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Milky Way Feature */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all animate-pulse-slow" />
            <div className="relative bg-slate-900/70 backdrop-blur-xl border-2 border-slate-700/50 rounded-3xl p-12 text-center hover:border-purple-500/50 transition-all">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-2 mb-6 backdrop-blur-sm">
                <Moon className="h-5 w-5 text-purple-400 animate-pulse" />
                <span className="text-sm font-semibold text-purple-300">Special Feature</span>
              </div>
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Explore the Milky Way Galaxy
              </h3>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Take an immersive journey through our home galaxy with stunning visualizations and interactive experiences
              </p>
              <a 
                href="/src/pages/milky-way.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-10 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <Star className="h-6 w-6 animate-spin-slow relative z-10" />
                <span className="relative z-10">Launch Milky Way Explorer</span>
                <ArrowRight className="h-6 w-6 relative z-10" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-20 px-4 z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to explore the cosmos?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of space enthusiasts discovering the universe
          </p>
          <a 
            href="/gallery"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">Start Exploring Now</span>
            <Rocket className="h-6 w-6 relative z-10" />
          </a>
        </div>
      </section>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedFeature(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className={`sticky top-0 bg-gradient-to-r ${selectedFeature.color} p-8 rounded-t-3xl`}>
              <button onClick={() => setSelectedFeature(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all">
                <X className="h-6 w-6 text-white" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <selectedFeature.icon className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{selectedFeature.title}</h2>
                  <p className="text-white/80 text-lg">{selectedFeature.description}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{selectedFeature.details.overview}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedFeature.details.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedFeature.color} mt-2 flex-shrink-0`} />
                      <p className="text-slate-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedFeature.details.capabilities.map((cap, i) => (
                    <div key={i} className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r ${selectedFeature.color} opacity-10 rounded-2xl blur-xl`} />
                      <div className="relative bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all">
                        <h4 className={`text-xl font-bold mb-2 bg-gradient-to-r ${selectedFeature.color} bg-clip-text text-transparent`}>
                          {cap.label}
                        </h4>
                        <p className="text-slate-400">{cap.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Link Detail Modal */}
      {selectedQuickLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedQuickLink(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className={`sticky top-0 bg-gradient-to-r from-${selectedQuickLink.color}-500 to-${selectedQuickLink.color === 'blue' ? 'cyan' : selectedQuickLink.color === 'red' ? 'orange' : 'pink'}-500 p-8 rounded-t-3xl`}>
              <button onClick={() => setSelectedQuickLink(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all">
                <X className="h-6 w-6 text-white" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <selectedQuickLink.icon className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{selectedQuickLink.title}</h2>
                  <p className="text-white/80 text-lg">{selectedQuickLink.description}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{selectedQuickLink.details.overview}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Features & Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedQuickLink.details.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-${selectedQuickLink.color}-500 to-${selectedQuickLink.color === 'blue' ? 'cyan' : selectedQuickLink.color === 'red' ? 'orange' : 'pink'}-500 mt-2 flex-shrink-0`} />
                      <p className="text-slate-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedQuickLink.details.actions.map((action, i) => (
                    <div key={i} className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r from-${selectedQuickLink.color}-500/20 to-${selectedQuickLink.color === 'blue' ? 'cyan' : selectedQuickLink.color === 'red' ? 'orange' : 'pink'}-500/20 rounded-2xl blur-xl`} />
                      <div className="relative bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 bg-gradient-to-br from-${selectedQuickLink.color}-500 to-${selectedQuickLink.color === 'blue' ? 'cyan' : selectedQuickLink.color === 'red' ? 'orange' : 'pink'}-500 rounded-xl flex-shrink-0`}>
                            <action.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">{action.label}</h4>
                            <p className="text-slate-400 text-sm">{action.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(12px); opacity: 0; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;