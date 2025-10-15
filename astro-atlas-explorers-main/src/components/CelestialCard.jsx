import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';

const CelestialCard = ({ object, onClick }) => {
  return (
    <Card 
      className="glass-card hover-glow cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={object.image} 
          alt={object.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-heading cosmic-glow">{object.name}</CardTitle>
            <CardDescription className="text-muted-foreground">{object.category}</CardDescription>
          </div>
          <Badge variant="secondary" className="capitalize">{object.type}</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{object.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {object.tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CelestialCard;
