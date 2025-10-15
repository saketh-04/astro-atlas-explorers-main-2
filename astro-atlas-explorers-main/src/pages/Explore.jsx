import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, X, Eye, Edit2, Trash2, Star, Globe, Sparkles, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [celestialObjects, setCelestialObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingObject, setEditingObject] = useState(null);
  const [alert, setAlert] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    name: '',
    type: 'planet',
    description: '',
    distance: '',
    mass: '',
    diameter: '',
    temperature: '',
    tags: '',
    imageUrl: ''
  });

  // Fetch data from backend API
  const fetchData = () => {
    fetch('http://localhost:5000/api/objects')
      .then(res => res.json())
      .then(data => setCelestialObjects(data))
      .catch(err => showAlert('Failed to fetch data', 'error'));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add new celestial object
  const handleAdd = (e) => {
    e.preventDefault();
    const newObject = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      distance: parseFloat(formData.distance) || 0,
      mass: parseFloat(formData.mass) || 0,
      diameter: parseFloat(formData.diameter) || 0,
      temperature: parseFloat(formData.temperature) || 0
    };

    fetch('http://localhost:5000/api/objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newObject)
    })
      .then(res => res.json())
      .then(() => {
        fetchData();
        setShowAddModal(false);
        resetForm();
        showAlert('Object added successfully!');
      })
      .catch(err => showAlert('Failed to add object', 'error'));
  };

  // Update celestial object
  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedObject = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      distance: parseFloat(formData.distance) || 0,
      mass: parseFloat(formData.mass) || 0,
      diameter: parseFloat(formData.diameter) || 0,
      temperature: parseFloat(formData.temperature) || 0
    };

    fetch(`http://localhost:5000/api/objects/${editingObject._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedObject)
    })
      .then(res => res.json())
      .then(() => {
        fetchData();
        setEditingObject(null);
        resetForm();
        showAlert('Object updated successfully!');
      })
      .catch(err => showAlert('Failed to update object', 'error'));
  };

  // Delete single object
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this object?')) {
      fetch(`http://localhost:5000/api/objects/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Delete failed');
          fetchData();
          showAlert('Object deleted successfully!');
        })
        .catch(err => showAlert('Failed to delete object', 'error'));
    }
  };

  // Delete multiple selected objects
  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    if (window.confirm(`Delete ${selectedItems.size} selected objects?`)) {
      Promise.all(
        Array.from(selectedItems).map(id =>
          fetch(`http://localhost:5000/api/objects/${id}`, { method: 'DELETE' })
        )
      )
        .then(() => {
          fetchData();
          setSelectedItems(new Set());
          showAlert(`${selectedItems.size} objects deleted successfully!`);
        })
        .catch(err => showAlert('Failed to delete objects', 'error'));
    }
  };

  // Toggle item selection
  const toggleSelection = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Select all filtered items
  const selectAll = () => {
    if (selectedItems.size === filteredAndSortedObjects.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredAndSortedObjects.map(obj => obj._id)));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'planet',
      description: '',
      distance: '',
      mass: '',
      diameter: '',
      temperature: '',
      tags: '',
      imageUrl: ''
    });
  };

  const openEditModal = (object) => {
    setEditingObject(object);
    setFormData({
      name: object.name,
      type: object.type,
      description: object.description,
      distance: object.distance?.toString() || '',
      mass: object.mass?.toString() || '',
      diameter: object.diameter?.toString() || '',
      temperature: object.temperature?.toString() || '',
      tags: object.tags?.join(', ') || '',
      imageUrl: object.imageUrl || ''
    });
  };

  const openDetailsModal = (object) => {
    setSelectedObject(object);
    setShowDetailsModal(true);
  };

  // Filter and sort objects
  const filteredAndSortedObjects = useMemo(() => {
    let filtered = [...celestialObjects];

    if (searchQuery.length >= 2) {
      filtered = filtered.filter(obj =>
        obj.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(obj => obj.type === typeFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name?.localeCompare(b.name) || 0;
      if (sortBy === 'type') return a.type?.localeCompare(b.type) || 0;
      if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
      return 0;
    });

    return filtered;
  }, [searchQuery, typeFilter, sortBy, celestialObjects]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'planet': return <Globe className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      case 'galaxy': return <Sparkles className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'planet': return 'from-blue-500 to-cyan-500';
      case 'star': return 'from-yellow-500 to-orange-500';
      case 'galaxy': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-8 px-4">
      {/* Alert Notification */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
          <Alert className={`${alert.type === 'error' ? 'bg-red-500/20 border-red-500 text-red-100' : 'bg-green-500/20 border-green-500 text-green-100'} backdrop-blur-lg shadow-2xl`}>
            {alert.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
            <AlertDescription className="font-semibold ml-2">{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
            Celestial Explorer
          </h1>
          <p className="text-xl text-blue-200/80 font-light">Discover and manage the wonders of the universe</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <Plus className="h-5 w-5" /> Add New Object
          </button>
          
          {selectedItems.size > 0 && (
            <div className="flex gap-3 items-center bg-slate-800/70 backdrop-blur-lg px-6 py-3 rounded-xl border border-slate-600 shadow-xl">
              <span className="text-white font-semibold">{selectedItems.size} selected</span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold"
              >
                <Trash2 className="h-4 w-4" /> Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Search and Filter Card */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 mb-10 shadow-2xl">
          <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
            <CardTitle className="flex items-center gap-3 text-white text-2xl">
              <Filter className="h-6 w-6 text-blue-400" /> Search & Filter
            </CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Find celestial objects by name, description, or tags
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            {/* Search Input */}
            <div className="space-y-3">
              <Label htmlFor="search" className="text-slate-300 text-base font-semibold">Search Query</Label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search planets, stars, galaxies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-12 text-base"
                />
              </div>
              {searchQuery.length > 0 && searchQuery.length < 2 && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Please enter at least 2 characters
                </p>
              )}
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="type" className="text-slate-300 text-base font-semibold">Category</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type" className="bg-slate-800/60 border-slate-700 text-white h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">🌌 All Types</SelectItem>
                    <SelectItem value="planet">🪐 Planets</SelectItem>
                    <SelectItem value="star">⭐ Stars</SelectItem>
                    <SelectItem value="galaxy">🌠 Galaxies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="sort" className="text-slate-300 text-base font-semibold">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="bg-slate-800/60 border-slate-700 text-white h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="name">📝 Name (A-Z)</SelectItem>
                    <SelectItem value="type">🏷️ Type</SelectItem>
                    <SelectItem value="distance">📏 Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-300 text-base font-semibold">Bulk Actions</Label>
                <button
                  onClick={selectAll}
                  className="w-full h-12 bg-slate-800/60 border border-slate-700 text-white rounded-lg hover:bg-slate-700/60 transition-all font-semibold"
                >
                  {selectedItems.size === filteredAndSortedObjects.length && filteredAndSortedObjects.length > 0 ? '❌ Deselect All' : '✅ Select All'}
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="pt-6 border-t border-slate-700/50">
              <p className="text-slate-300 text-lg">
                Found <span className="text-blue-400 font-bold text-2xl">{filteredAndSortedObjects.length}</span> celestial {filteredAndSortedObjects.length === 1 ? 'object' : 'objects'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Objects Grid */}
        {filteredAndSortedObjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedObjects.map((object) => (
              <div
                key={object._id}
                className={`group relative bg-gradient-to-br ${getTypeColor(object.type)} p-[2px] rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 ${
                  selectedItems.has(object._id) ? 'ring-4 ring-blue-400 scale-105' : ''
                }`}
              >
                <div className="bg-slate-900 rounded-2xl p-6 h-full flex flex-col">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.has(object._id)}
                    onChange={() => toggleSelection(object._id)}
                    className="absolute top-4 left-4 w-5 h-5 z-10 cursor-pointer accent-blue-600"
                  />

                  {/* Image */}
                  <div className="mb-4 rounded-xl overflow-hidden bg-slate-800 h-44 flex items-center justify-center shadow-inner">
                    {object.imageUrl ? (
                      <img src={object.imageUrl} alt={object.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className={`bg-gradient-to-br ${getTypeColor(object.type)} p-10 rounded-full shadow-2xl`}>
                        {getTypeIcon(object.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white truncate flex-1 pr-2">{object.name}</h3>
                      <div className={`bg-gradient-to-r ${getTypeColor(object.type)} p-2 rounded-lg`}>
                        {getTypeIcon(object.type)}
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{object.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {object.tags?.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-slate-800/80 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                          {tag}
                        </span>
                      ))}
                      {object.tags?.length > 3 && (
                        <span className="text-xs bg-slate-800/80 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                          +{object.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 text-sm text-slate-400 mb-4 bg-slate-800/30 p-3 rounded-lg">
                      {object.distance ? <p className="flex items-center gap-2">🌍 <span className="font-semibold">{object.distance}</span> AU</p> : null}
                      {object.diameter ? <p className="flex items-center gap-2">📏 <span className="font-semibold">{object.diameter}</span> km</p> : null}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => openDetailsModal(object)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg flex items-center justify-center gap-1 transition-all hover:scale-105 shadow-lg"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(object)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-lg flex items-center justify-center gap-1 transition-all hover:scale-105 shadow-lg"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(object._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 rounded-lg flex items-center justify-center gap-1 transition-all hover:scale-105 shadow-lg"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="inline-block p-12 bg-slate-900/60 rounded-3xl backdrop-blur-xl border border-slate-700/50 shadow-2xl">
              <Search className="h-20 w-20 text-slate-600 mx-auto mb-6" />
              <p className="text-2xl text-slate-400 font-semibold">
                {searchQuery.length >= 2 ? 'No objects found matching your search' : 'Enter a search query to begin exploring'}
              </p>
              <p className="text-slate-500 mt-3">Try adjusting your filters or search terms</p>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || editingObject) && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-slate-700 shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-slate-700 p-8 flex justify-between items-center z-10">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  {editingObject ? <Edit2 className="h-8 w-8 text-green-400" /> : <Plus className="h-8 w-8 text-blue-400" />}
                  {editingObject ? 'Edit Object' : 'Add New Object'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingObject(null);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-white transition-colors hover:bg-slate-800 p-2 rounded-lg"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>

              <form onSubmit={editingObject ? handleUpdate : handleAdd} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-slate-300 font-semibold text-base">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-slate-700 text-white h-12"
                      placeholder="e.g., Mars"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="type" className="text-slate-300 font-semibold text-base">Type *</Label>
                    <Select name="type" value={formData.type} onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="planet">🪐 Planet</SelectItem>
                        <SelectItem value="star">⭐ Star</SelectItem>
                        <SelectItem value="galaxy">🌌 Galaxy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-slate-300 font-semibold text-base">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="Describe this celestial object..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="distance" className="text-slate-300 font-semibold text-base">Distance (AU)</Label>
                    <Input
                      id="distance"
                      name="distance"
                      type="number"
                      step="0.01"
                      value={formData.distance}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white h-12"
                      placeholder="1.52"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="mass" className="text-slate-300 font-semibold text-base">Mass (kg)</Label>
                    <Input
                      id="mass"
                      name="mass"
                      type="number"
                      step="0.01"
                      value={formData.mass}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white h-12"
                      placeholder="6.39e23"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="diameter" className="text-slate-300 font-semibold text-base">Diameter (km)</Label>
                    <Input
                      id="diameter"
                      name="diameter"
                      type="number"
                      step="0.01"
                      value={formData.diameter}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white h-12"
                      placeholder="6779"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="temperature" className="text-slate-300 font-semibold text-base">Temperature (K)</Label>
                    <Input
                      id="temperature"
                      name="temperature"
                      type="number"
                      step="0.01"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white h-12"
                      placeholder="210"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tags" className="text-slate-300 font-semibold text-base">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                    placeholder="e.g., rocky, habitable, red"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="imageUrl" className="text-slate-300 font-semibold text-base">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-700">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
                  >
                    {editingObject ? '✓ Update Object' : '+ Add Object'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingObject(null);
                      resetForm();
                    }}
                    className="px-8 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold text-lg transition-all border-2 border-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedObject && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-slate-700 shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-slate-700 p-8 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{selectedObject.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className={`bg-gradient-to-r ${getTypeColor(selectedObject.type)} text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg`}>
                      {getTypeIcon(selectedObject.type)}
                      {selectedObject.type.charAt(0).toUpperCase() + selectedObject.type.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-slate-400 hover:text-white transition-colors hover:bg-slate-800 p-3 rounded-lg"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Image */}
                {selectedObject.imageUrl && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700">
                    <img 
                      src={selectedObject.imageUrl} 
                      alt={selectedObject.name} 
                      className="w-full h-80 object-cover" 
                    />
                  </div>
                )}

                {/* Description */}
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    📝 Description
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {selectedObject.description || 'No description available'}
                  </p>
                </div>

                {/* Properties Grid */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    📊 Properties
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedObject.distance && (
                      <div className="bg-gradient-to-br from-blue-900/50 to-slate-800/50 p-6 rounded-2xl border border-blue-700/50 shadow-xl">
                        <p className="text-blue-300 text-sm font-semibold mb-2">🌍 Distance from Sun</p>
                        <p className="text-white text-3xl font-bold">{selectedObject.distance} <span className="text-lg text-slate-400">AU</span></p>
                      </div>
                    )}
                    {selectedObject.mass && (
                      <div className="bg-gradient-to-br from-purple-900/50 to-slate-800/50 p-6 rounded-2xl border border-purple-700/50 shadow-xl">
                        <p className="text-purple-300 text-sm font-semibold mb-2">⚖️ Mass</p>
                        <p className="text-white text-3xl font-bold">{selectedObject.mass} <span className="text-lg text-slate-400">kg</span></p>
                      </div>
                    )}
                    {selectedObject.diameter && (
                      <div className="bg-gradient-to-br from-green-900/50 to-slate-800/50 p-6 rounded-2xl border border-green-700/50 shadow-xl">
                        <p className="text-green-300 text-sm font-semibold mb-2">📏 Diameter</p>
                        <p className="text-white text-3xl font-bold">{selectedObject.diameter} <span className="text-lg text-slate-400">km</span></p>
                      </div>
                    )}
                    {selectedObject.temperature && (
                      <div className="bg-gradient-to-br from-orange-900/50 to-slate-800/50 p-6 rounded-2xl border border-orange-700/50 shadow-xl">
                        <p className="text-orange-300 text-sm font-semibold mb-2">🌡️ Temperature</p>
                        <p className="text-white text-3xl font-bold">{selectedObject.temperature} <span className="text-lg text-slate-400">K</span></p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {selectedObject.tags && selectedObject.tags.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      🏷️ Tags
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedObject.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-200 px-6 py-3 rounded-full border-2 border-blue-500/50 font-semibold text-base shadow-lg hover:scale-105 transition-transform"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t-2 border-slate-700">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openEditModal(selectedObject);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl"
                  >
                    <Edit2 className="h-6 w-6" /> Edit Object
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleDelete(selectedObject._id);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl"
                  >
                    <Trash2 className="h-6 w-6" /> Delete Object
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;