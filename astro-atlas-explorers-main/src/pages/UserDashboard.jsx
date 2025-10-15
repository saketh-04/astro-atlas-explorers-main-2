import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, BookOpen, Search, Trash2, Star, Heart, Clock, Award, Telescope, Bell, Palette, Eye, Share2, Plus, Edit, Save, X, RefreshCw, Lock, Settings, Filter, History, Globe, AlertCircle, Check } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const ProfileDisplay = ({ name, email, memberSince, level, achievements }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 p-6 mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 blur-2xl"></div>
      <div className="relative flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <User className="h-12 w-12 text-blue-400" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-slate-900">
            <Award className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-slate-100">{name}</h3>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              Level {level}
            </span>
          </div>
          <p className="text-slate-400 mb-3">{email}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="h-4 w-4" />
              Member since {memberSince}
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="h-4 w-4" />
              {achievements} Achievements
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    language: 'en',
    bio: '',
    darkMode: 'enabled',
    notifications: 'all',
    privacy: 'public',
    level: 1,
    achievements: 0,
    memberSince: new Date().toLocaleDateString()
  });

  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [history, setHistory] = useState([]);
  const [celestialObjects, setCelestialObjects] = useState([]);
  
  const [newObject, setNewObject] = useState({
    name: '',
    type: '',
    description: '',
    distance: '',
    mass: '',
    discoveryDate: '',
    imageUrl: ''
  });
  
  const [editingObject, setEditingObject] = useState(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    items: 0,
    shared: false,
    color: 'from-blue-500 to-cyan-500',
    description: ''
  });
  const [editingCollection, setEditingCollection] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await fetchCelestialObjects();
    await fetchCollections();
    await fetchFavorites();
    loadHistory();
    loadCurrentUser();
  };

  const loadCurrentUser = () => {
    const savedUser = {
      name: 'Demo User',
      email: 'demo@astroatlas.com',
      level: 5,
      achievements: 12,
      memberSince: '01/15/2024',
      location: 'Earth',
      language: 'en',
      bio: 'Space enthusiast exploring the cosmos!',
      darkMode: 'enabled',
      notifications: 'all',
      privacy: 'public'
    };
    setCurrentUser(savedUser);
    setProfileForm(savedUser);
  };

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccess('');
    } else {
      setSuccess(msg);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  const addToHistory = (action, object) => {
    const newHistoryItem = {
      action,
      object,
      timestamp: new Date().toLocaleString()
    };
    const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
  };

  const loadHistory = () => {
    const mockHistory = [
      { action: 'Viewed', object: 'Mars Details', timestamp: new Date().toLocaleString() },
      { action: 'Added', object: 'Jupiter to Favorites', timestamp: new Date().toLocaleString() },
      { action: 'Created', object: 'Solar System Collection', timestamp: new Date().toLocaleString() }
    ];
    setHistory(mockHistory);
  };

 const APIURL = "http://localhost:5000/api";
 // use your actual backend URL

const fetchCelestialObjects = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${APIURL}/celestialobjects`);
    const data = await res.json();
    setCelestialObjects(data);
    addToHistory("Loaded", "Celestial Objects");
  } catch (err) {
    showMessage("Failed to fetch celestial objects", true);
  }
  setLoading(false);
};

  const validateObjectForm = () => {
    if (!newObject.name || newObject.name.length < 3) {
      showMessage('Object name must be at least 3 characters', true);
      return false;
    }
    if (!newObject.type) {
      showMessage('Please select object type', true);
      return false;
    }
    if (newObject.imageUrl && !newObject.imageUrl.startsWith('http')) {
      showMessage('Image URL must start with http:// or https://', true);
      return false;
    }
    return true;
  };

  const addCelestialObject = async (e) => {
    e.preventDefault();
    if (!validateObjectForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newObject,
          discoveryDate: newObject.discoveryDate || new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to add object');

      showMessage('Celestial object added successfully!');
      addToHistory('Added', `Object: ${newObject.name}`);
      setNewObject({
        name: '',
        type: '',
        description: '',
        distance: '',
        mass: '',
        discoveryDate: '',
        imageUrl: ''
      });
      fetchCelestialObjects();
    } catch (err) {
      showMessage('Failed to add object: ' + err.message, true);
    }
    setLoading(false);
  };

  const updateCelestialObject = async () => {
    if (!editingObject) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/favorites/${editingObject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingObject)
      });

      if (!res.ok) throw new Error('Failed to update');

      showMessage('Object updated successfully!');
      addToHistory('Updated', `Object: ${editingObject.name}`);
      setEditingObject(null);
      fetchCelestialObjects();
    } catch (err) {
      showMessage('Update failed: ' + err.message, true);
    }
    setLoading(false);
  };

  const deleteCelestialObject = async (id) => {
    if (!window.confirm('Delete this celestial object?')) return;

    setLoading(true);
    try {
      const obj = celestialObjects.find(o => o._id === id);
      const res = await fetch(`${API_URL}/favorites/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      showMessage('Object deleted successfully!');
      addToHistory('Deleted', `Object: ${obj?.name || 'Unknown'}`);
      fetchCelestialObjects();
    } catch (err) {
      showMessage('Delete failed: ' + err.message, true);
    }
    setLoading(false);
  };

  const fetchCollections = async () => {
  try {
    const res = await fetch(`${API_URL}/collections`);
    if (!res.ok) throw new Error(`Failed to fetch collections: ${res.status}`);
    const data = await res.json();
    setCollections(data);
  } catch (err) {
    console.error('Failed to fetch collections:', err);
    showMessage('Error loading collections', true);
  }
};

// ✅ Form validation
const validateCollectionForm = () => {
  if (!newCollection.name || newCollection.name.trim().length < 3) {
    showMessage('Collection name must be at least 3 characters long', true);
    return false;
  }
  return true;
};

// ✅ Create new collection
const addCollection = async (e) => {
  e.preventDefault();
  if (!validateCollectionForm()) return;

  setLoading(true);

  try {
    // Log the outgoing body for debugging
    console.log('📤 Sending new collection:', newCollection);

    const res = await fetch(`${API_URL}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newCollection.name.trim(),
        description: newCollection.description || '',
        color: newCollection.color || 'from-blue-500 to-cyan-500',
        items: newCollection.items || 0,
        shared: newCollection.shared || false,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create collection');

    showMessage('✅ Collection created successfully!');
    addToHistory('Created', `Collection: ${newCollection.name}`);

    // Reset form
    setNewCollection({
      name: '',
      items: 0,
      shared: false,
      color: 'from-blue-500 to-cyan-500',
      description: ''
    });

    await fetchCollections();
  } catch (err) {
    console.error('❌ Failed to create collection:', err);
    showMessage(`Failed to create collection: ${err.message}`, true);
  }

  setLoading(false);
};

// ✅ Update existing collection
const updateCollection = async () => {
  if (!editingCollection) return;

  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/collections/${editingCollection._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editingCollection,
        lastModified: new Date().toISOString()
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update collection');

    showMessage('✅ Collection updated successfully!');
    addToHistory('Updated', `Collection: ${editingCollection.name}`);

    setEditingCollection(null);
    await fetchCollections();
  } catch (err) {
    console.error('❌ Update failed:', err);
    showMessage(`Update failed: ${err.message}`, true);
  }

  setLoading(false);
};

// ✅ Delete a collection
const deleteCollection = async (id) => {
  if (!window.confirm('Are you sure you want to delete this collection?')) return;

  setLoading(true);
  try {
    const coll = collections.find(c => c._id === id);
    const res = await fetch(`${API_URL}/collections/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete collection');

    showMessage('🗑️ Collection deleted!');
    addToHistory('Deleted', `Collection: ${coll?.name || 'Collection'}`);

    await fetchCollections();
  } catch (err) {
    console.error('❌ Delete failed:', err);
    showMessage(`Delete failed: ${err.message}`, true);
  }

  setLoading(false);
};

// ✅ Fetch favorites (unchanged)
const fetchFavorites = async () => {
  try {
    const res = await fetch(`${API_URL}/favorites`);
    if (!res.ok) throw new Error(`Failed to fetch favorites: ${res.status}`);
    const data = await res.json();
    setFavorites(data.slice(0, 5));
  } catch (err) {
    console.error('Failed to fetch favorites:', err);
  }
};


  const validateProfileForm = () => {
    if (profileForm.name.length < 3) {
      showMessage('Name must be at least 3 characters', true);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileForm.email)) {
      showMessage('Please enter a valid email', true);
      return false;
    }
    if (profileForm.password && profileForm.password.length > 0) {
      if (profileForm.password.length < 8) {
        showMessage('Password must be at least 8 characters', true);
        return false;
      }
      if (profileForm.password !== profileForm.confirmPassword) {
        showMessage('Passwords do not match', true);
        return false;
      }
      if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(profileForm.password)) {
        showMessage('Password must contain a number and special character', true);
        return false;
      }
    }
    return true;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      showMessage('Profile updated successfully!');
      addToHistory('Updated', 'Profile Settings');
      setCurrentUser({ ...currentUser, ...profileForm });
    } catch (err) {
      showMessage('Update failed: ' + err.message, true);
    }
    setLoading(false);
  };

  const filteredObjects = celestialObjects.filter(obj => {
    const matchesSearch = obj.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && obj.type?.toLowerCase() === filterType.toLowerCase();
  });

  const stats = [
    { label: 'Celestial Objects', value: celestialObjects.length.toString(), icon: Telescope, color: 'from-blue-500 to-cyan-500' },
    { label: 'My Collections', value: collections.length.toString(), icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Favorites', value: favorites.length.toString(), icon: Heart, color: 'from-rose-500 to-pink-500' },
    { label: 'Level', value: currentUser?.level?.toString() || '1', icon: Award, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {(error || success) && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-xl border flex items-center gap-2 ${error ? 'bg-red-500/90 border-red-400' : 'bg-green-500/90 border-green-400'} text-white font-semibold`}>
            {error ? <AlertCircle className="h-5 w-5" /> : <Check className="h-5 w-5" />}
            {error || success}
          </div>
        )}

        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10"></div>
          <div className="inline-flex items-center gap-3 mb-4">
            <Telescope className="h-12 w-12 text-blue-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AstroAtlas
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Your Personal Space Exploration Dashboard
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all group cursor-pointer">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-3 mb-3 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-full w-full text-white" />
                </div>
                <p className="text-3xl font-bold text-slate-100 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="explore" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 p-1 gap-1">
            <TabsTrigger value="explore">
              <Telescope className="mr-2 h-4 w-4" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="library">
              <BookOpen className="mr-2 h-4 w-4" />
              My Library
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Settings className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Telescope className="h-6 w-6 text-blue-400" />
                      Explore Celestial Objects
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Browse and discover amazing celestial objects
                    </CardDescription>
                  </div>
                  <Button onClick={fetchCelestialObjects} variant="outline" className="border-slate-700 hover:bg-slate-800">
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search celestial objects..."
                        className="pl-12 h-12 bg-slate-800/50 border-slate-700/50 text-slate-100"
                      />
                    </div>
                  </div>
                  <div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700/50 text-slate-100">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="planet">Planets</SelectItem>
                        <SelectItem value="star">Stars</SelectItem>
                        <SelectItem value="galaxy">Galaxies</SelectItem>
                        <SelectItem value="nebula">Nebulae</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-400" />
                    <p className="text-slate-400">Loading celestial objects...</p>
                  </div>
                ) : filteredObjects.length === 0 ? (
                  <div className="text-center py-12">
                    <Telescope className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No celestial objects found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredObjects.map((obj) => (
                      <div key={obj._id} className="group relative overflow-hidden rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-all hover:shadow-xl hover:shadow-blue-500/10">
                        <div className="relative h-48 overflow-hidden bg-slate-800">
                          {obj.imageUrl ? (
                            <img src={obj.imageUrl} alt={obj.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                              <Telescope className="h-16 w-16 text-slate-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                          <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center hover:bg-blue-500 transition-colors">
                            <Eye className="h-5 w-5 text-blue-400" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-lg text-slate-100 mb-1">{obj.name}</h4>
                          <p className="text-sm text-slate-400 mb-3 capitalize">{obj.type}</p>
                          {obj.description && (
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{obj.description}</p>
                          )}
                          {obj.distance && (
                            <div className="text-xs text-slate-500">
                              Distance: {obj.distance} light years
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                <CardTitle className="text-xl flex items-center gap-2">
                  {editingObject ? <Edit className="h-5 w-5 text-blue-400" /> : <Plus className="h-5 w-5 text-green-400" />}
                  {editingObject ? 'Edit Celestial Object' : 'Add New Celestial Object'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={editingObject ? (e) => { e.preventDefault(); updateCelestialObject(); } : addCelestialObject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Object Name</Label>
                      <Input
                        value={editingObject ? editingObject.name : newObject.name}
                        onChange={(e) => editingObject ? setEditingObject({...editingObject, name: e.target.value}) : setNewObject({ ...newObject, name: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        placeholder="e.g., Mars, Andromeda Galaxy"
                        required
                        minLength={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Type</Label>
                      <Select 
                        value={editingObject ? editingObject.type : newObject.type} 
                        onValueChange={(val) => editingObject ? setEditingObject({...editingObject, type: val}) : setNewObject({ ...newObject, type: val })}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planet">Planet</SelectItem>
                          <SelectItem value="star">Star</SelectItem>
                          <SelectItem value="galaxy">Galaxy</SelectItem>
                          <SelectItem value="nebula">Nebula</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Distance (light years)</Label>
                      <Input
                        type="number"
                        value={editingObject ? editingObject.distance : newObject.distance}
                        onChange={(e) => editingObject ? setEditingObject({...editingObject, distance: e.target.value}) : setNewObject({ ...newObject, distance: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        placeholder="e.g., 4.24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Image URL</Label>
                      <Input
                        value={editingObject ? editingObject.imageUrl : newObject.imageUrl}
                        onChange={(e) => editingObject ? setEditingObject({...editingObject, imageUrl: e.target.value}) : setNewObject({ ...newObject, imageUrl: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-slate-300">Description</Label>
                      <Textarea
                        value={editingObject ? editingObject.description : newObject.description}
                        onChange={(e) => editingObject ? setEditingObject({...editingObject, description: e.target.value}) : setNewObject({ ...newObject, description: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100 min-h-[80px]"
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                      {editingObject ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                      {loading ? 'Processing...' : (editingObject ? 'Update Object' : 'Add Object')}
                    </Button>
                    {editingObject && (
                      <Button type="button" onClick={() => setEditingObject(null)} variant="outline" className="border-slate-700 hover:bg-slate-800">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>

                <div className="mt-6 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Manage Objects ({celestialObjects.length})</h3>
                  {celestialObjects.map((obj) => (
                    <div key={obj._id} className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:bg-slate-800/50 transition-colors">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        {obj.imageUrl ? (
                          <img src={obj.imageUrl} alt={obj.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Telescope className="h-8 w-8 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-100 mb-1">{obj.name}</h4>
                        <p className="text-sm text-slate-400 capitalize">{obj.type}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button 
                          onClick={() => setEditingObject(obj)} 
                          size="sm" 
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => deleteCelestialObject(obj._id)} 
                          size="sm" 
                          variant="destructive" 
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {celestialObjects.length === 0 && (
                    <p className="text-center text-slate-400 py-8">No celestial objects yet. Add one above!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-rose-500/5 to-pink-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-400" />
                    My Favorites
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Quick access to your favorite objects
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {favorites.map((fav) => (
                      <div key={fav._id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                          {fav.imageUrl ? (
                            <img src={fav.imageUrl} alt={fav.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Telescope className="h-6 w-6 text-slate-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-100 truncate">{fav.name}</h4>
                          <p className="text-xs text-slate-400 capitalize">{fav.type}</p>
                        </div>
                        <Heart className="h-5 w-5 text-rose-400 fill-rose-400 flex-shrink-0" />
                      </div>
                    ))}
                    {favorites.length === 0 && (
                      <p className="text-center text-slate-400 py-8">No favorites yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-purple-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Your recent actions and history
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm">
                            <span className="font-semibold text-purple-400">{item.action}</span> {item.object}
                          </p>
                          <p className="text-xs text-slate-500">{item.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <p className="text-center text-slate-400 py-8">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-amber-400" />
                  My Collections
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Organize your celestial objects into collections
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <form onSubmit={editingCollection ? (e) => { e.preventDefault(); updateCollection(); } : addCollection} className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    {editingCollection ? <Edit className="h-5 w-5 text-blue-400" /> : <Plus className="h-5 w-5 text-purple-400" />}
                    {editingCollection ? 'Edit Collection' : 'Create New Collection'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Collection Name</Label>
                      <Input
                        value={editingCollection ? editingCollection.name : newCollection.name}
                        onChange={(e) => editingCollection ? setEditingCollection({...editingCollection, name: e.target.value}) : setNewCollection({ ...newCollection, name: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        placeholder="e.g., Solar System Planets"
                        required
                        minLength={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Number of Items</Label>
                      <Input
                        type="number"
                        value={editingCollection ? editingCollection.items : newCollection.items}
                        onChange={(e) => editingCollection ? setEditingCollection({...editingCollection, items: parseInt(e.target.value) || 0}) : setNewCollection({ ...newCollection, items: parseInt(e.target.value) || 0 })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Color Theme</Label>
                      <Select 
                        value={editingCollection ? editingCollection.color : newCollection.color} 
                        onValueChange={(val) => editingCollection ? setEditingCollection({...editingCollection, color: val}) : setNewCollection({ ...newCollection, color: val })}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="from-blue-500 to-cyan-500">Blue</SelectItem>
                          <SelectItem value="from-purple-500 to-pink-500">Purple</SelectItem>
                          <SelectItem value="from-amber-500 to-orange-500">Orange</SelectItem>
                          <SelectItem value="from-green-500 to-emerald-500">Green</SelectItem>
                          <SelectItem value="from-rose-500 to-pink-500">Rose</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Sharing</Label>
                      <Select 
                        value={editingCollection ? editingCollection.shared.toString() : newCollection.shared.toString()} 
                        onValueChange={(val) => editingCollection ? setEditingCollection({...editingCollection, shared: val === 'true'}) : setNewCollection({ ...newCollection, shared: val === 'true' })}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">Private</SelectItem>
                          <SelectItem value="true">Shared</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-slate-300">Description</Label>
                      <Textarea
                        value={editingCollection ? editingCollection.description : newCollection.description}
                        onChange={(e) => editingCollection ? setEditingCollection({...editingCollection, description: e.target.value}) : setNewCollection({ ...newCollection, description: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100 min-h-[80px]"
                        placeholder="Describe your collection..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      {editingCollection ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                      {loading ? 'Processing...' : (editingCollection ? 'Update Collection' : 'Create Collection')}
                    </Button>
                    {editingCollection && (
                      <Button type="button" onClick={() => setEditingCollection(null)} variant="outline" className="border-slate-700 hover:bg-slate-800">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collections.map((collection) => (
                    <div key={collection._id} className="group relative overflow-hidden rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-all p-6">
                      <div className={`absolute inset-0 bg-gradient-to-r ${collection.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                      <div className="relative">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${collection.color} flex items-center justify-center flex-shrink-0`}>
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xl text-slate-100 mb-1 truncate">{collection.name}</h4>
                            <p className="text-sm text-slate-400">{collection.items} items</p>
                          </div>
                          {collection.shared && (
                            <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold flex items-center gap-1 flex-shrink-0">
                              <Share2 className="h-3 w-3" />
                              Shared
                            </span>
                          )}
                        </div>
                        {collection.description && (
                          <p className="text-sm text-slate-400 mb-3">{collection.description}</p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={() => setEditingCollection(collection)} 
                            size="sm" 
                            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            onClick={() => deleteCollection(collection._id)} 
                            size="sm" 
                            variant="destructive" 
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {collections.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No collections yet. Create one above!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-pink-500/5 to-rose-500/5">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Settings className="h-6 w-6 text-pink-400" />
                  Profile and Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your profile, change password, and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {currentUser && (
                    <ProfileDisplay 
                      name={profileForm.name || currentUser.name} 
                      email={profileForm.email || currentUser.email}
                      memberSince={profileForm.memberSince || currentUser.memberSince}
                      level={profileForm.level || currentUser.level}
                      achievements={profileForm.achievements || currentUser.achievements}
                    />
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Edit Profile
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Full Name</Label>
                          <Input
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                            required
                            minLength={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Email Address</Label>
                          <Input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Location</Label>
                          <Input
                            value={profileForm.location}
                            onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                            className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                            placeholder="e.g., New York, USA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Language</Label>
                          <Select value={profileForm.language} onValueChange={(val) => setProfileForm({ ...profileForm, language: val })}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label className="text-slate-300">Bio</Label>
                        <Textarea
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100 min-h-[100px]"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-800/50 pt-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Change Password
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">New Password</Label>
                          <Input
                            type="password"
                            value={profileForm.password}
                            onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                            className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                            placeholder="Min 8 chars, 1 number, 1 special char"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Confirm Password</Label>
                          <Input
                            type="password"
                            value={profileForm.confirmPassword}
                            onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                            className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/50 pt-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-4">Preferences</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300 flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Theme
                          </Label>
                          <Select value={profileForm.darkMode} onValueChange={(val) => setProfileForm({ ...profileForm, darkMode: val })}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="enabled">Dark Mode</SelectItem>
                              <SelectItem value="disabled">Light Mode</SelectItem>
                              <SelectItem value="auto">Auto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300 flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Notifications
                          </Label>
                          <Select value={profileForm.notifications} onValueChange={(val) => setProfileForm({ ...profileForm, notifications: val })}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Notifications</SelectItem>
                              <SelectItem value="important">Important Only</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Privacy
                          </Label>
                          <Select value={profileForm.privacy} onValueChange={(val) => setProfileForm({ ...profileForm, privacy: val })}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="friends">Friends Only</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30">
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? 'Saving...' : 'Save All Changes'}
                    </Button>

                    <div className="border-t border-slate-800/50 pt-6">
                      <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <Trash2 className="h-5 w-5" />
                        Delete Account
                      </h3>
                      <p className="text-slate-400 mb-4 text-sm">This action cannot be undone. All your data will be permanently deleted.</p>
                      <Button 
                        type="button"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                            showMessage('Account deletion requested. Please contact support to complete this action.', false);
                          }
                        }}
                        variant="destructive" 
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account Permanently
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;