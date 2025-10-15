import { Link, useLocation } from 'react-router-dom';
import { Rocket } from 'lucide-react';

// Stateless Functional Component
const Navigation = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/explore', label: 'Explore' },
    { path: '/visualization', label: 'Visualization' },
    { path: '/reports', label: 'Reports' },
    { path: '/user-dashboard', label: 'User Dashboard' },
    { path: '/admin-dashboard', label: 'Admin Dashboard' }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Rocket className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
            <span className="text-2xl font-heading font-bold cosmic-glow">AstroAtlas</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-primary text-primary-foreground shadow-glow-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
