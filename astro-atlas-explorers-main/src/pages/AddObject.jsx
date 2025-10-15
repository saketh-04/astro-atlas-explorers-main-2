import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AddObject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'planet',
    description: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add object');
        return res.json();
      })
      .then(() => {
        alert('Celestial object added!');
        navigate('/explore');
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-lg w-full p-6">
        <CardHeader>
          <CardTitle>Add New Celestial Object</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full border rounded p-2">
                <option value="planet">Planet</option>
                <option value="star">Star</option>
                <option value="galaxy">Galaxy</option>
              </select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea id="description" name="description" required value={formData.description} onChange={handleChange} className="w-full border rounded p-2" rows={4} />
            </div>

            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full">Add Object</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddObject;
