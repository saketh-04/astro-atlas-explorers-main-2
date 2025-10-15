# AstroAtlas - Space Exploration Platform

## 🌌 Project Overview

AstroAtlas is a comprehensive full-stack educational platform for exploring celestial objects including planets, stars, and galaxies. The application features a cosmic-themed design with two main dashboards: **User Dashboard** and **Admin Dashboard**.

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom cosmic theme
- **UI Components**: shadcn/ui components
- **3D Graphics**: Three.js for visualization
- **Charts**: Recharts for analytics
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

## 📋 React Concepts Implemented

### ✅ All Required Concepts:
1. **Functional Components** - All page components (Home, Gallery, Explore, etc.)
2. **Class Components** - ProfileDisplay component in UserDashboard
3. **Conditional Rendering** - Throughout app (Gallery filters, explore results, etc.)
4. **Properties (Props)** - CelestialCard component receives object props
5. **State Management** - useState hooks in all interactive components + AuthContext
6. **Stateless Components** - Navigation, Starfield, CelestialCard (presentational)
7. **Hooks** - useState, useEffect, useMemo, useContext, custom useLocalStorage
8. **List & Keys** - Map function used extensively (Gallery, Explore, Reports)
9. **Routing** - Complete routing setup with React Router
10. **Map Function** - Used for rendering celestial objects, navigation links, stats, etc.

## 🎨 Design System

### Color Palette
- **Primary**: Deep space blue (#6366f1)
- **Secondary**: Cosmic purple (#8b5cf6)
- **Accent**: Nebula pink (#ec4899)
- **Background**: Dark space (#0a0e27)

### Features
- Nebula gradients
- Glowing text effects
- Glassmorphism cards
- Animated starfield background
- Smooth transitions and hover effects
- Floating animations

### Fonts
- **Headings**: Orbitron
- **Body**: Exo 2

## 📁 Project Structure

```
src/
├── assets/              # Generated celestial images
│   ├── hero-nebula.jpg
│   ├── planets/         # Planet images
│   └── galaxies/        # Galaxy images
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Navigation.tsx   # Main navigation bar
│   ├── Starfield.tsx    # Animated background
│   └── CelestialCard.tsx # Reusable object card
├── contexts/
│   └── AuthContext.tsx  # Authentication context
├── data/
│   └── celestialObjects.ts # Celestial objects database
├── hooks/
│   └── useLocalStorage.ts  # Custom hook example
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── Gallery.tsx      # Object gallery with filters
│   ├── Explore.tsx      # Search & filter page
│   ├── Visualization.tsx # 3D Three.js viewer
│   ├── Reports.tsx      # Analytics & charts
│   ├── UserDashboard.tsx # User management
│   ├── AdminDashboard.tsx # Admin tools
│   └── NotFound.tsx     # 404 page
└── App.tsx              # Main app with routing
```

## 🌟 Core Features

### 1. Home Page
- Hero section with nebula background
- Feature cards linking to main sections
- Quick access to dashboards

### 2. Space Gallery
- View all celestial objects (planets, stars, galaxies)
- Filter by type
- Detailed modal view with specifications
- Real generated images for all objects

### 3. Explore Page
- Advanced search (min 2 characters)
- Category filtering
- Sort functionality
- Live results count

### 4. 3D Visualization
- Interactive Three.js spheres
- Planet selection
- Rotation controls
- Real-time rendering

### 5. Reports & Analytics
- View statistics
- Bar and pie charts
- Popular objects tracking
- Admin analytics

### 6. User Dashboard
**Three Tabs:**
- **Profile & Settings**: 
  - Name validation (min 3 chars)
  - Email validation (unique, valid format)
  - Password validation (min 8 chars, number + special char)
  - Confirm password matching
  - Dark mode & language preferences
  - Account deletion with reason
  
- **My Library**:
  - Favorites collection
  - Custom collections
  - PDF download functionality
  
- **Explore**:
  - Search form (min 2 chars)
  - Category & sort filters
  - Pagination support

### 7. Admin Dashboard
**Three Tabs:**
- **Data Management**:
  - Add celestial objects
  - Unique name validation
  - Numeric validation for mass/distance
  - Discovery year (integer)
  - Image/video upload support
  - Description (min 50 chars)
  - Tags (required, array)
  - Status (active/inactive)
  
- **User Management**:
  - Edit user information
  - Role assignment (user/admin/super-admin)
  - Status management (active/banned/deactivated)
  - Admin tracking
  
- **Reports & Logs**:
  - Transaction logs
  - User actions tracking
  - Timestamp & IP logging
  - Status monitoring

## 🔧 Form Validations

All forms include comprehensive validation:
- Client-side validation with react-hook-form + zod
- Real-time error messages
- Min/max length checks
- Email format validation
- Password strength requirements
- Number format validation
- Required field enforcement

## 🎯 Milky Way Static Page

A special HTML+CSS page is included at `public/milky-way.html`. This standalone page features:
- Pure HTML/CSS implementation
- Animated spiral galaxy visualization
- Information cards about the Milky Way
- Responsive design
- Cosmic styling matching the main app

**To access**: Navigate to `/milky-way.html` after deployment or in development.

**Integration**: You can add a link to this page in the navigation or home page:
```tsx
<a href="/milky-way.html" target="_blank">Explore Milky Way</a>
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Access the App
- Development: `http://localhost:8080`
- Milky Way page: `http://localhost:8080/milky-way.html`

## 📊 Celestial Objects Database

The app includes 15+ celestial objects:
- **Planets**: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
- **Stars**: Sun, Sirius, Betelgeuse
- **Galaxies**: Milky Way, Andromeda, Whirlpool, Sombrero

Each object includes:
- High-quality generated images
- Detailed descriptions
- Discovery dates
- Distances
- Physical properties (mass, diameter)
- Categorized tags

## 🔐 Authentication (Ready for Backend)

The app includes authentication structure:
- AuthContext for state management
- Login/logout flows
- localStorage for session persistence
- Ready to integrate with backend APIs

## 🎨 Customization

### Adding New Celestial Objects
Edit `src/data/celestialObjects.ts` and add new objects following the `CelestialObject` interface.

### Changing Colors
Update the CSS variables in `src/index.css` under the `:root` selector.

### Adding New Pages
1. Create page in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navigation.tsx`

## 📦 Key Dependencies

- `react` & `react-dom` - Core React
- `react-router-dom` - Routing
- `three` & `@types/three` - 3D visualization
- `recharts` - Charts and analytics
- `react-hook-form` & `zod` - Form handling
- `@radix-ui/*` - UI primitives
- `tailwindcss` - Styling
- `lucide-react` - Icons

## 🌐 Deployment

The app is ready to deploy to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Lovable.dev (recommended)

The `milky-way.html` file will be served from the `public` folder automatically.

## 🎓 Educational Use

This project demonstrates:
- Modern React patterns
- TypeScript best practices
- Component architecture
- State management strategies
- Form validation
- 3D web graphics
- Responsive design
- Accessibility considerations

## 📝 Notes

- All forms are functional in the frontend with validation
- Backend integration ready (API endpoints can be added)
- Images are generated and stored in the repository
- Design follows space/cosmic theme consistently
- Mobile responsive across all pages

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more celestial objects
- Enhance 3D visualizations
- Improve form validations
- Add more chart types
- Integrate with real astronomy APIs

## 📄 License

Educational project - feel free to use and modify.

---

**Built with ❤️ for space enthusiasts and astronomy learners**
