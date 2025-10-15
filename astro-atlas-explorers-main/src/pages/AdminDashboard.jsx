import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Database, Users, FileText, Plus, Edit, Trash2, Globe, Star, Shield, Activity, AlertCircle, CheckCircle, XCircle, Clock, TrendingUp, Eye, Search, Download, Upload, Sparkles, Settings, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (title, description, variant = 'default') => {
    setToastMessage({ title, description, variant });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Statistics
  const [stats, setStats] = useState({
    totalObjects: 15,
    totalUsers: 1234,
    activeSessions: 89,
    totalViews: 45200
  });

  // Stored Objects
  const [objects, setObjects] = useState([
    { id: 'obj-001', name: 'Mars', type: 'planet', category: 'Rocky Planet', addedBy: 'admin-001', date: '2024-03-15', status: 'active', description: 'The Red Planet, fourth from the Sun' },
    { id: 'obj-002', name: 'Sirius', type: 'star', category: 'Main Sequence', addedBy: 'admin-002', date: '2024-03-14', status: 'active', description: 'The brightest star in the night sky' },
    { id: 'obj-003', name: 'Andromeda', type: 'galaxy', category: 'Spiral Galaxy', addedBy: 'admin-001', date: '2024-03-13', status: 'active', description: 'The nearest major galaxy to the Milky Way' },
  ]);

  // Stored Users
  const [users, setUsers] = useState([
    { id: 'user-001', name: 'John Doe', email: 'john@example.com', role: 'user', joined: '2024-03-15', status: 'active' },
    { id: 'user-002', name: 'Jane Smith', email: 'jane@example.com', role: 'user', joined: '2024-03-14', status: 'active' },
    { id: 'user-003', name: 'Bob Wilson', email: 'bob@example.com', role: 'admin', joined: '2024-03-13', status: 'active' },
  ]);

  // Transaction Logs
  const [transactionLogs, setTransactionLogs] = useState([
    { id: 1, userId: 'user-123', action: 'login', details: 'User logged in successfully', timestamp: '2024-03-15 10:30:00', status: 'success', ip: '192.168.1.1' },
    { id: 2, userId: 'user-456', action: 'search', details: 'Searched for "Mars"', timestamp: '2024-03-15 11:15:00', status: 'success', ip: '192.168.1.2' },
    { id: 3, userId: 'admin-001', action: 'update', details: 'Updated object "Jupiter"', timestamp: '2024-03-15 12:00:00', status: 'success', ip: '192.168.1.3' },
    { id: 4, userId: 'user-789', action: 'add_favorite', details: 'Added "Saturn" to favorites', timestamp: '2024-03-15 13:20:00', status: 'success', ip: '192.168.1.4' },
  ]);

  // Form States
  const [newObject, setNewObject] = useState({
    name: '', type: 'planet', mass: '', diameter: '', distance: '', discoveryYear: '',
    description: '', category: '', tags: '', status: 'active', surfaceTemp: '', orbitalPeriod: '', imageUrl: ''
  });

  const [editObject, setEditObject] = useState({
    objectId: '', name: '', type: 'planet', description: '', status: 'active', updatedBy: 'admin-001'
  });

  const [foundObject, setFoundObject] = useState(null);
  const [deleteObjectId, setDeleteObjectId] = useState('');

  const [editUser, setEditUser] = useState({
    userId: '', fullName: '', email: '', role: 'user', status: 'active', adminId: 'admin-001'
  });

  const [foundUser, setFoundUser] = useState(null);

  // Add log entry
  const addLog = (action, details, status = 'success') => {
    const newLog = {
      id: transactionLogs.length + 1,
      userId: 'admin-001',
      action,
      details,
      timestamp: new Date().toLocaleString(),
      status,
      ip: '192.168.1.100'
    };
    setTransactionLogs([newLog, ...transactionLogs]);
  };

  // Search handlers
  const handleSearchObject = () => {
    const obj = objects.find(o => o.id === editObject.objectId.toLowerCase() || o.name.toLowerCase() === editObject.objectId.toLowerCase());
    if (obj) {
      setFoundObject(obj);
      setEditObject({ ...editObject, name: obj.name, type: obj.type, description: obj.description, status: obj.status });
      showToast('Object Found!', `Found: ${obj.name}`, 'success');
    } else {
      setFoundObject(null);
      showToast('Not Found', 'Object not found in database', 'error');
    }
  };

  const handleSearchUser = () => {
    const user = users.find(u => u.id === editUser.userId.toLowerCase() || u.email.toLowerCase() === editUser.userId.toLowerCase());
    if (user) {
      setFoundUser(user);
      setEditUser({ ...editUser, fullName: user.name, email: user.email, role: user.role, status: user.status });
      showToast('User Found!', `Found: ${user.name}`, 'success');
    } else {
      setFoundUser(null);
      showToast('Not Found', 'User not found in database', 'error');
    }
  };

  // Validation
  const validateEditObject = () => {
    if (!editObject.objectId) {
      showToast('Validation Error', 'Object ID is required', 'error');
      return false;
    }
    if (!editObject.name || editObject.name.length < 3) {
      showToast('Validation Error', 'Object name must be at least 3 characters', 'error');
      return false;
    }
    if (editObject.description && editObject.description.length > 0 && editObject.description.length < 20) {
      showToast('Validation Error', 'Description must be at least 20 characters if provided', 'error');
      return false;
    }
    return true;
  };

  const validateAddObject = () => {
    if (!newObject.name || newObject.name.length < 3) {
      showToast('Validation Error', 'Object name must be at least 3 characters', 'error');
      return false;
    }
    if (newObject.mass && isNaN(Number(newObject.mass))) {
      showToast('Validation Error', 'Mass must be a number', 'error');
      return false;
    }
    if (newObject.discoveryYear && isNaN(Number(newObject.discoveryYear))) {
      showToast('Validation Error', 'Discovery year must be a number', 'error');
      return false;
    }
    if (newObject.description.length < 50) {
      showToast('Validation Error', 'Description must be at least 50 characters', 'error');
      return false;
    }
    if (!newObject.tags) {
      showToast('Validation Error', 'Tags are required', 'error');
      return false;
    }
    if (!newObject.category) {
      showToast('Validation Error', 'Category is required', 'error');
      return false;
    }
    return true;
  };

  const validateEditUser = () => {
    if (!editUser.userId) {
      showToast('Validation Error', 'User ID is required', 'error');
      return false;
    }
    if (!editUser.fullName || editUser.fullName.length < 3) {
      showToast('Validation Error', 'Full name must be at least 3 characters', 'error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editUser.email)) {
      showToast('Validation Error', 'Please enter a valid email', 'error');
      return false;
    }
    return true;
  };

  // Form handlers
  const handleEditObject = (e) => {
    e.preventDefault();
    if (validateEditObject()) {
      const updatedObjects = objects.map(obj => 
        obj.id === editObject.objectId.toLowerCase() || obj.name.toLowerCase() === editObject.objectId.toLowerCase()
          ? { ...obj, name: editObject.name, type: editObject.type, description: editObject.description, status: editObject.status }
          : obj
      );
      setObjects(updatedObjects);
      addLog('object_update', `Updated object "${editObject.name}"`, 'success');
      showToast('Success!', `Object "${editObject.name}" updated successfully`, 'success');
      setEditObject({ objectId: '', name: '', type: 'planet', description: '', status: 'active', updatedBy: 'admin-001' });
      setFoundObject(null);
    }
  };

  const handleAddObject = (e) => {
    e.preventDefault();
    if (validateAddObject()) {
      const newObj = {
        id: `obj-${String(objects.length + 1).padStart(3, '0')}`,
        name: newObject.name,
        type: newObject.type,
        category: newObject.category,
        addedBy: 'admin-001',
        date: new Date().toISOString().split('T')[0],
        status: newObject.status,
        description: newObject.description
      };
      setObjects([newObj, ...objects]);
      setStats(prev => ({ ...prev, totalObjects: prev.totalObjects + 1 }));
      addLog('object_add', `Added new object "${newObject.name}"`, 'success');
      showToast('Success!', `Object "${newObject.name}" added successfully to AstroAtlas`, 'success');
      setNewObject({ name: '', type: 'planet', mass: '', diameter: '', distance: '', discoveryYear: '', description: '', category: '', tags: '', status: 'active', surfaceTemp: '', orbitalPeriod: '', imageUrl: '' });
    }
  };

  const handleDeleteObject = (e) => {
    e.preventDefault();
    if (!deleteObjectId) {
      showToast('Validation Error', 'Object ID is required', 'error');
      return;
    }
    const objToDelete = objects.find(o => o.id === deleteObjectId.toLowerCase() || o.name.toLowerCase() === deleteObjectId.toLowerCase());
    if (objToDelete) {
      setObjects(objects.filter(o => o.id !== objToDelete.id));
      setStats(prev => ({ ...prev, totalObjects: prev.totalObjects - 1 }));
      addLog('object_delete', `Deleted object "${objToDelete.name}"`, 'success');
      showToast('Object Deleted', `Object "${objToDelete.name}" removed from database`, 'error');
      setDeleteObjectId('');
    } else {
      showToast('Not Found', 'Object not found in database', 'error');
    }
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    if (validateEditUser()) {
      const updatedUsers = users.map(user => 
        user.id === editUser.userId.toLowerCase() || user.email.toLowerCase() === editUser.userId.toLowerCase()
          ? { ...user, name: editUser.fullName, email: editUser.email, role: editUser.role, status: editUser.status }
          : user
      );
      setUsers(updatedUsers);
      addLog('user_update', `Updated user "${editUser.fullName}"`, 'success');
      showToast('Success!', `User "${editUser.fullName}" updated successfully`, 'success');
      setEditUser({ userId: '', fullName: '', email: '', role: 'user', status: 'active', adminId: 'admin-001' });
      setFoundUser(null);
    }
  };

  const handleBackup = () => {
    addLog('backup', 'Database backup initiated', 'success');
    showToast('Backup Started', 'Database backup is in progress...', 'info');
  };

  const handleExport = () => {
    addLog('export', 'Data export completed', 'success');
    const dataStr = JSON.stringify({ objects, users }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'astroatlas-data.json';
    link.click();
    showToast('Export Complete', 'Data exported successfully', 'success');
  };

  const handleImport = () => {
    addLog('import', 'Data import attempted', 'success');
    showToast('Import Ready', 'Select a JSON file to import', 'success');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${
            toastMessage.variant === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
            toastMessage.variant === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' :
            toastMessage.variant === 'info' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' :
            'bg-purple-500/10 border-purple-500/50 text-purple-400'
          } backdrop-blur-xl animate-in slide-in-from-right`}>
            <div className="font-semibold">{toastMessage.title}</div>
            <div className="text-sm opacity-80">{toastMessage.description}</div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10"></div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-4">
            <Shield className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-red-300">Administrator Access</span>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Complete control over AstroAtlas - Manage celestial objects, users, and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Objects', value: stats.totalObjects, change: `+${stats.totalObjects - 10}`, icon: Globe, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Users', value: stats.totalUsers, change: '+127', icon: Users, color: 'from-purple-500 to-pink-500' },
            { label: 'Active Sessions', value: stats.activeSessions, change: '+12', icon: Activity, color: 'from-green-500 to-emerald-500' },
            { label: 'Total Views', value: `${(stats.totalViews / 1000).toFixed(1)}K`, change: '+2.4K', icon: Eye, color: 'from-amber-500 to-orange-500' }
          ].map((stat, i) => (
            <Card key={i} className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <CardContent className="pt-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500">
              <Plus className="mr-2 h-4 w-4" />
              Add Object
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Database className="mr-2 h-4 w-4" />
              Manage Data
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500">
              <FileText className="mr-2 h-4 w-4" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    Recent Objects ({objects.length})
                  </CardTitle>
                  <CardDescription className="text-slate-400">Recently added celestial objects</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {objects.slice(0, 5).map((obj) => (
                      <div key={obj.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-200">{obj.name}</p>
                          <p className="text-xs text-slate-500">{obj.type} • Added by {obj.addedBy}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={obj.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}>
                            {obj.status}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">{obj.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Recent Users ({users.length})
                  </CardTitle>
                  <CardDescription className="text-slate-400">Newly registered users</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-200">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={user.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}>
                            {user.role}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">{user.joined}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Backup DB', icon: Database, color: 'blue', handler: handleBackup },
                    { label: 'Export Data', icon: Download, color: 'purple', handler: handleExport },
                    { label: 'Import Data', icon: Upload, color: 'green', handler: handleImport },
                    { label: 'Settings', icon: Settings, color: 'amber', handler: () => showToast('Settings', 'Settings panel coming soon', 'info') }
                  ].map((action, i) => (
                    <Button key={i} onClick={action.handler} className="h-24 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 flex-col gap-2">
                      <action.icon className="h-6 w-6 text-slate-300" />
                      <span className="text-slate-200">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Object Tab */}
          <TabsContent value="add">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Plus className="h-6 w-6 text-green-400" />
                  Add New Celestial Object
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Add planets, stars, galaxies, or other celestial objects to the AstroAtlas database
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddObject} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                      <Star className="h-5 w-5 text-blue-400" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="objName" className="text-slate-300">Object Name *</Label>
                        <Input
                          id="objName"
                          value={newObject.name}
                          onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                          placeholder="e.g., Proxima Centauri"
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="objType" className="text-slate-300">Object Type *</Label>
                        <Select value={newObject.type} onValueChange={(val) => setNewObject({ ...newObject, type: val })}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planet">🪐 Planet</SelectItem>
                            <SelectItem value="star">⭐ Star</SelectItem>
                            <SelectItem value="galaxy">🌌 Galaxy</SelectItem>
                            <SelectItem value="nebula">☁️ Nebula</SelectItem>
                            <SelectItem value="blackhole">🕳️ Black Hole</SelectItem>
                            <SelectItem value="moon">🌙 Moon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="objCategory" className="text-slate-300">Category/Classification *</Label>
                        <Input
                          id="objCategory"
                          value={newObject.category}
                          onChange={(e) => setNewObject({ ...newObject, category: e.target.value })}
                          placeholder="e.g., Rocky Planet, Red Dwarf"
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="objStatus" className="text-slate-300">Status</Label>
                        <Select value={newObject.status} onValueChange={(val) => setNewObject({ ...newObject, status: val })}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">✅ Active</SelectItem>
                            <SelectItem value="draft">📝 Draft</SelectItem>
                            <SelectItem value="inactive">❌ Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                      <Database className="h-5 w-5 text-purple-400" />
                      Physical Properties
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="objMass" className="text-slate-300">Mass (kg)</Label>
                        <Input
                          id="objMass"
                          value={newObject.mass}
                          onChange={(e) => setNewObject({ ...newObject, mass: e.target.value })}
                          placeholder="e.g., 5.97e24"
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="objDiameter" className="text-slate-300">Diameter (km)</Label>
                        <Input
                          id="objDiameter"
                          value={newObject.diameter}
                          onChange={(e) => setNewObject({ ...newObject, diameter: e.target.value })}
                          placeholder="e.g., 12742"
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="objTemp" className="text-slate-300">Surface Temp (K)</Label>
                        <Input
                          id="objTemp"
                          value={newObject.surfaceTemp}
                          onChange={(e) => setNewObject({ ...newObject, surfaceTemp: e.target.value })}
                          placeholder="e.g., 288"
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-cyan-400" />
                      Orbital & Discovery Data
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="objDistance" className="text-slate-300">Distance from Sun (AU)</Label>
                        <Input
                          id="objDistance"
                          value={newObject.distance}
                          onChange={(e) => setNewObject({ ...newObject, distance: e.target.value })}
                          placeholder="e.g., 1.0"
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="objOrbital" className="text-slate-300">Orbital Period (days)</Label>
                        <Input
                          id="objOrbital"
                          value={newObject.orbitalPeriod}
                          onChange={(e) => setNewObject({ ...newObject, orbitalPeriod: e.target.value })}
                          placeholder="e.g., 365.25"
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="objYear" className="text-slate-300">Discovery Year</Label>
                        <Input
                          id="objYear"
                          value={newObject.discoveryYear}
                          onChange={(e) => setNewObject({ ...newObject, discoveryYear: e.target.value })}
                          placeholder="e.g., 1781"
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-amber-400" />
                      Description & Metadata
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="objDesc" className="text-slate-300">Description * (min 50 characters)</Label>
                        <Textarea
                          id="objDesc"
                          value={newObject.description}
                          onChange={(e) => setNewObject({ ...newObject, description: e.target.value })}
                          placeholder="Provide a detailed description of the celestial object..."
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100 min-h-[120px]"
                          required
                        />
                        <p className="text-xs text-slate-500">{newObject.description.length}/50 characters</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="objTags" className="text-slate-300">Tags * (comma-separated)</Label>
                          <Input
                            id="objTags"
                            value={newObject.tags}
                            onChange={(e) => setNewObject({ ...newObject, tags: e.target.value })}
                            placeholder="e.g., terrestrial, habitable, inner-planet"
                            className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="objImage" className="text-slate-300">Image URL (optional)</Label>
                          <Input
                            id="objImage"
                            value={newObject.imageUrl}
                            onChange={(e) => setNewObject({ ...newObject, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-6 text-lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Object to AstroAtlas
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Data Tab */}
          <TabsContent value="manage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Edit Object */}
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-blue-400" />
                    Edit Object
                  </CardTitle>
                  <CardDescription className="text-slate-400">Update existing celestial object data</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleEditObject} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Search Object (ID or Name)</Label>
                      <div className="flex gap-2">
                        <Input
                          value={editObject.objectId}
                          onChange={(e) => setEditObject({ ...editObject, objectId: e.target.value })}
                          placeholder="e.g., obj-001 or Mars"
                          className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        />
                        <Button type="button" onClick={handleSearchObject} className="bg-blue-500 hover:bg-blue-600">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {foundObject && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-400 text-sm font-semibold">✓ Found: {foundObject.name}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-slate-300">Object Name</Label>
                      <Input
                        value={editObject.name}
                        onChange={(e) => setEditObject({ ...editObject, name: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        disabled={!foundObject}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Type</Label>
                      <Select value={editObject.type} onValueChange={(val) => setEditObject({ ...editObject, type: val })} disabled={!foundObject}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planet">🪐 Planet</SelectItem>
                          <SelectItem value="star">⭐ Star</SelectItem>
                          <SelectItem value="galaxy">🌌 Galaxy</SelectItem>
                          <SelectItem value="nebula">☁️ Nebula</SelectItem>
                          <SelectItem value="blackhole">🕳️ Black Hole</SelectItem>
                          <SelectItem value="moon">🌙 Moon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Description</Label>
                      <Textarea
                        value={editObject.description}
                        onChange={(e) => setEditObject({ ...editObject, description: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        disabled={!foundObject}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Status</Label>
                      <Select value={editObject.status} onValueChange={(val) => setEditObject({ ...editObject, status: val })} disabled={!foundObject}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">✅ Active</SelectItem>
                          <SelectItem value="draft">📝 Draft</SelectItem>
                          <SelectItem value="inactive">❌ Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" disabled={!foundObject}>
                      <Edit className="mr-2 h-4 w-4" />
                      Update Object
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Delete Object */}
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
                <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-red-500/5 to-pink-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-400" />
                    Delete Object
                  </CardTitle>
                  <CardDescription className="text-slate-400">Permanently remove an object from the database</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleDeleteObject} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Object ID or Name</Label>
                      <Input
                        value={deleteObjectId}
                        onChange={(e) => setDeleteObjectId(e.target.value)}
                        placeholder="e.g., obj-001 or Mars"
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                      />
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-400 font-semibold text-sm">Warning</p>
                          <p className="text-red-300 text-xs mt-1">This action cannot be undone. The object will be permanently removed from the database.</p>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Object
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-slate-800/50">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Current Objects</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {objects.map((obj) => (
                        <div key={obj.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded text-xs">
                          <span className="text-slate-300">{obj.name}</span>
                          <span className="text-slate-500">{obj.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-400" />
                  User Management
                </CardTitle>
                <CardDescription className="text-slate-400">Search and edit user accounts</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleEditUser} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Search User (ID or Email)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={editUser.userId}
                        onChange={(e) => setEditUser({ ...editUser, userId: e.target.value })}
                        placeholder="e.g., user-001 or john@example.com"
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                      />
                      <Button type="button" onClick={handleSearchUser} className="bg-amber-500 hover:bg-amber-600">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {foundUser && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 text-sm font-semibold">✓ Found: {foundUser.name}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Full Name</Label>
                      <Input
                        value={editUser.fullName}
                        onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        disabled={!foundUser}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Email</Label>
                      <Input
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        className="bg-slate-800/50 border-slate-700/50 text-slate-100"
                        disabled={!foundUser}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Role</Label>
                      <Select value={editUser.role} onValueChange={(val) => setEditUser({ ...editUser, role: val })} disabled={!foundUser}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">👤 User</SelectItem>
                          <SelectItem value="admin">👑 Admin</SelectItem>
                          <SelectItem value="moderator">🛡️ Moderator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Status</Label>
                      <Select value={editUser.status} onValueChange={(val) => setEditUser({ ...editUser, status: val })} disabled={!foundUser}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">✅ Active</SelectItem>
                          <SelectItem value="suspended">⏸️ Suspended</SelectItem>
                          <SelectItem value="banned">🚫 Banned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" disabled={!foundUser}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update User
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-800/50">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">All Users ({users.length})</h4>
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-200">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email} • {user.id}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={user.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}>
                            {user.role}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">{user.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="logs">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-rose-500/5 to-pink-500/5">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-rose-400" />
                  Transaction Logs ({transactionLogs.length})
                </CardTitle>
                <CardDescription className="text-slate-400">Real-time system activity and user actions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {transactionLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                      <div className="mt-1">
                        {getStatusIcon(log.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-slate-200 text-sm">{log.action.replace('_', ' ').toUpperCase()}</p>
                          <Badge className="bg-slate-700/50 text-slate-300 text-xs">
                            {log.userId}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm">{log.details}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {log.timestamp}
                          </span>
                          <span>IP: {log.ip}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;