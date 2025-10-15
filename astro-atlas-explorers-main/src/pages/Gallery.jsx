import { useState } from 'react';
import { celestialObjects } from '@/data/celestialObjects';
import CelestialCard from '@/components/CelestialCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Filter } from 'lucide-react';

const Gallery = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredObjects = filter === 'all' 
    ? celestialObjects 
    : celestialObjects.filter(obj => obj.type === filter);

  const filterOptions = [
    { value: 'all', label: 'All Objects', count: celestialObjects.length },
    { value: 'planet', label: 'Planets', count: celestialObjects.filter(o => o.type === 'planet').length },
    { value: 'star', label: 'Stars', count: celestialObjects.filter(o => o.type === 'star').length },
    { value: 'galaxy', label: 'Galaxies', count: celestialObjects.filter(o => o.type === 'galaxy').length }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-16 space-y-6">
          
          
          <h1 className="text-6xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
            Space Gallery
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Journey through the universe and discover breathtaking celestial wonders from distant galaxies, mysterious planets, and brilliant stars
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex items-center gap-3 p-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter:</span>
            </div>
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`
                  relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                  ${filter === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50 scale-105' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <span className="relative z-10">{option.label}</span>
                <span className={`ml-2 text-xs ${filter === option.value ? 'opacity-90' : 'opacity-60'}`}>
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredObjects.map((object, index) => (
            <div
              key={object.id}
              className="animate-in fade-in-50 zoom-in-95 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CelestialCard
                object={object}
                onClick={() => setSelectedObject(object)}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredObjects.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-6">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No Objects Found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={!!selectedObject} onOpenChange={() => setSelectedObject(null)}>
          <DialogContent className="max-w-3xl bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border-2 border-white/10 shadow-2xl">
            {selectedObject && (
              <>
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-4xl font-heading font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {selectedObject.name}
                  </DialogTitle>
                  <DialogDescription className="text-lg text-gray-400">
                    {selectedObject.category}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Image with overlay gradient */}
                  <div className="relative rounded-2xl overflow-hidden group">
                    <img 
                      src={selectedObject.image} 
                      alt={selectedObject.name}
                      className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {selectedObject.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedObject.discoveryDate && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                        <p className="text-sm text-purple-300 mb-1 font-medium">Discovery Date</p>
                        <p className="text-white text-lg font-bold">{selectedObject.discoveryDate}</p>
                      </div>
                    )}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                      <p className="text-sm text-blue-300 mb-1 font-medium">Distance</p>
                      <p className="text-white text-lg font-bold">{selectedObject.distance}</p>
                    </div>
                    {selectedObject.mass && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20">
                        <p className="text-sm text-pink-300 mb-1 font-medium">Mass</p>
                        <p className="text-white text-lg font-bold">{selectedObject.mass}</p>
                      </div>
                    )}
                    {selectedObject.diameter && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                        <p className="text-sm text-cyan-300 mb-1 font-medium">Diameter</p>
                        <p className="text-white text-lg font-bold">{selectedObject.diameter}</p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <p className="text-sm text-gray-400 mb-3 font-medium">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedObject.tags.map((tag, idx) => (
                        <Badge 
                          key={idx} 
                          className="px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-200 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Gallery;