import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, Eye, Star, Globe, Users, Activity, Download, FileText,
  BarChart3, RefreshCw, Telescope, Calendar, Clock, Award, Sparkles,
  Target, Zap, Filter, Search, ArrowUp, ArrowDown, Minus, Share2, 
  PieChart as PieChartIcon, TrendingDown, DollarSign, MousePointer
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('views');
  
  // Backend data states
  const [stats, setStats] = useState({
    totalObjects: 0,
    totalViews: 0,
    totalFavorites: 0,
    activeUsers: 0,
    avgViewsPerObject: 0,
    engagementRate: 0,
    growthRate: 12.5
  });

  const [objectsData, setObjectsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Form state for custom reports
  const [reportForm, setReportForm] = useState({
    reportName: '',
    dateFrom: '',
    dateTo: '',
    includeCategories: true,
    includeTopObjects: true,
    includeCharts: true,
    format: 'html'
  });

  useEffect(() => {
    fetchAllData();
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateViewCounts();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch celestial objects
      const objectsRes = await fetch(`${API_URL}/celestialobjects`);
      const objects = await objectsRes.json();
      
      // Fetch favorites
      const favoritesRes = await fetch(`${API_URL}/favorites`);
      const favorites = await favoritesRes.json();

      processData(objects, favorites);
      generateRecentActivity(objects);
      
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const updateViewCounts = async () => {
    // Simulate view count updates
    setObjectsData(prev => prev.map(obj => ({
      ...obj,
      views: obj.views + Math.floor(Math.random() * 3),
      recentViews: Math.floor(Math.random() * 10)
    })));
  };

  const processData = (objects, favorites) => {
    const totalObjects = objects.length;
    const totalViews = objects.reduce((sum, obj) => sum + (obj.views || 0), 0);
    const totalFavorites = favorites.length;
    const activeUsers = Math.floor(totalViews * 0.15);
    const avgViewsPerObject = totalObjects > 0 ? Math.round(totalViews / totalObjects) : 0;
    const engagementRate = totalViews > 0 ? ((totalFavorites / totalViews) * 100).toFixed(2) : 0;

    setStats({
      totalObjects,
      totalViews,
      totalFavorites,
      activeUsers,
      avgViewsPerObject,
      engagementRate,
      growthRate: 12.5
    });

    // Process objects with enhanced data
    const processedObjects = objects.map(obj => {
      const objectFavorites = favorites.filter(fav => fav.objectId === obj._id).length;
      const views = obj.views || 0;
      
      return {
        id: obj._id,
        name: obj.name,
        type: obj.type || 'Unknown',
        views: views,
        favorites: objectFavorites,
        description: obj.description,
        engagementRate: views > 0 ? ((objectFavorites / views) * 100).toFixed(1) : 0,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
        trendValue: Math.floor(Math.random() * 30),
        recentViews: Math.floor(Math.random() * 50),
        avgTimeSpent: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      };
    }).sort((a, b) => b.views - a.views);

    setObjectsData(processedObjects);

    // Calculate category distribution
    const categories = {};
    objects.forEach(obj => {
      const category = obj.type || 'Unknown';
      if (!categories[category]) {
        categories[category] = { count: 0, views: 0, favorites: 0 };
      }
      categories[category].count += 1;
      categories[category].views += (obj.views || 0);
      const catFavorites = favorites.filter(fav => fav.objectId === obj._id).length;
      categories[category].favorites += catFavorites;
    });

    const categoryArray = Object.entries(categories).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1) + 's',
      value: data.views,
      count: data.count,
      favorites: data.favorites,
      percentage: totalViews > 0 ? Math.round((data.views / totalViews) * 100) : 0,
      avgViewsPerObject: Math.round(data.views / data.count),
      engagementRate: data.views > 0 ? ((data.favorites / data.views) * 100).toFixed(1) : 0
    })).sort((a, b) => b.value - a.value);

    setCategoryData(categoryArray);
  };

  const generateRecentActivity = (objects) => {
    const activities = [];
    const actions = ['viewed', 'favorited', 'shared', 'explored'];
    
    for (let i = 0; i < 10; i++) {
      const obj = objects[Math.floor(Math.random() * objects.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const minutesAgo = Math.floor(Math.random() * 60);
      
      activities.push({
        id: i,
        action,
        object: obj.name,
        user: `User ${Math.floor(Math.random() * 1000)}`,
        time: `${minutesAgo}m ago`
      });
    }
    
    setRecentActivity(activities);
  };

  // Filtered and sorted data
  const filteredObjects = useMemo(() => {
    let filtered = objectsData.filter(obj => {
      const matchesSearch = obj.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || obj.type?.toLowerCase() === filterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views': return b.views - a.views;
        case 'favorites': return b.favorites - a.favorites;
        case 'engagement': return parseFloat(b.engagementRate) - parseFloat(a.engagementRate);
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    return filtered;
  }, [objectsData, searchTerm, filterCategory, sortBy]);

  // Chart colors
  const COLORS = {
    primary: ['#818cf8', '#c084fc', '#f472b6', '#fb923c', '#34d399', '#60a5fa', '#a78bfa', '#f87171'],
    gradient: [
      { from: '#818cf8', to: '#c084fc' },
      { from: '#c084fc', to: '#f472b6' },
      { from: '#fb923c', to: '#fbbf24' },
      { from: '#34d399', to: '#10b981' },
      { from: '#60a5fa', to: '#3b82f6' }
    ]
  };

  // Generate trend data
  const trendData = useMemo(() => {
    const ranges = {
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      week: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      year: ['Q1', 'Q2', 'Q3', 'Q4']
    };

    const labels = ranges[timeRange];
    const baseViews = stats.totalViews / labels.length;
    
    return labels.map((label, i) => ({
      period: label,
      views: Math.round(baseViews * (0.7 + Math.random() * 0.6)),
      interactions: Math.round(baseViews * 0.6 * (0.7 + Math.random() * 0.6)),
      favorites: Math.round(baseViews * 0.3 * (0.7 + Math.random() * 0.6)),
      users: Math.round(baseViews * 0.15 * (0.7 + Math.random() * 0.6))
    }));
  }, [timeRange, stats.totalViews]);

  // Enhanced download functions
  const downloadObjectReport = (object) => {
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const categoryInfo = categoryData.find(cat => 
      cat.name.toLowerCase().includes(object.type?.toLowerCase())
    );

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${object.name} - Detailed Analytics Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { margin: 20mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: #e2e8f0;
      padding: 40px;
      line-height: 1.6;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: rgba(15, 23, 42, 0.98);
      border: 3px solid rgba(139, 92, 246, 0.4);
      border-radius: 24px;
      padding: 60px;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
    }
    .header {
      text-align: center;
      margin-bottom: 60px;
      padding-bottom: 40px;
      border-bottom: 4px solid rgba(139, 92, 246, 0.3);
      position: relative;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 4px;
      background: linear-gradient(90deg, #818cf8, #c084fc, #f472b6);
      border-radius: 2px;
    }
    .badge {
      display: inline-block;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%);
      border: 2px solid rgba(139, 92, 246, 0.5);
      padding: 10px 24px;
      border-radius: 50px;
      font-size: 14px;
      color: #c084fc;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 700;
    }
    h1 {
      font-size: 56px;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 20px;
      font-weight: 900;
      letter-spacing: -1px;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 20px;
      margin-top: 12px;
      font-weight: 500;
    }
    .date {
      color: #64748b;
      font-size: 15px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .hero-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 60px;
    }
    .hero-stat {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(59, 130, 246, 0.18) 100%);
      border: 2px solid rgba(139, 92, 246, 0.35);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero-stat::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #818cf8, #c084fc);
    }
    .hero-stat .icon {
      font-size: 40px;
      margin-bottom: 16px;
      opacity: 0.9;
    }
    .hero-stat .value {
      font-size: 42px;
      font-weight: 900;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
      line-height: 1;
    }
    .hero-stat .label {
      color: #94a3b8;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
    }
    .section {
      margin-bottom: 50px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 28px;
      font-weight: 800;
      color: #c084fc;
      margin-bottom: 30px;
      padding-bottom: 18px;
      border-bottom: 3px solid rgba(192, 132, 252, 0.25);
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .section-title .icon {
      font-size: 32px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 35px;
    }
    .info-card {
      background: rgba(30, 27, 75, 0.6);
      border: 2px solid rgba(139, 92, 246, 0.25);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s;
    }
    .info-card .label {
      color: #94a3b8;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .info-card .value {
      color: #e2e8f0;
      font-size: 22px;
      font-weight: 700;
    }
    .description-box {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%);
      border: 2px solid rgba(59, 130, 246, 0.35);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 35px;
    }
    .description-box h3 {
      color: #60a5fa;
      font-size: 20px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
    }
    .description-box p {
      color: #cbd5e1;
      font-size: 16px;
      line-height: 1.9;
    }
    .performance-section {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.12) 100%);
      border: 3px solid rgba(16, 185, 129, 0.35);
      border-radius: 20px;
      padding: 35px;
      margin-bottom: 35px;
    }
    .performance-section h3 {
      color: #10b981;
      font-size: 24px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 0;
      border-bottom: 2px solid rgba(16, 185, 129, 0.2);
    }
    .metric-row:last-child {
      border-bottom: none;
    }
    .metric-row .metric-label {
      color: #94a3b8;
      font-size: 15px;
      font-weight: 500;
    }
    .metric-row .metric-value {
      color: #10b981;
      font-size: 24px;
      font-weight: 800;
    }
    .insights {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.12) 100%);
      border: 3px solid rgba(245, 158, 11, 0.35);
      border-radius: 20px;
      padding: 35px;
    }
    .insights h3 {
      color: #f59e0b;
      font-size: 24px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
    }
    .insight-item {
      margin-bottom: 18px;
      padding-left: 30px;
      position: relative;
      color: #cbd5e1;
      font-size: 16px;
      line-height: 1.7;
    }
    .insight-item::before {
      content: "★";
      position: absolute;
      left: 0;
      color: #f59e0b;
      font-size: 20px;
      font-weight: bold;
    }
    .highlight {
      color: #c084fc;
      font-weight: 800;
    }
    .trend-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
    }
    .trend-up {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 2px solid rgba(16, 185, 129, 0.3);
    }
    .trend-down {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 2px solid rgba(239, 68, 68, 0.3);
    }
    .footer {
      margin-top: 80px;
      padding-top: 40px;
      border-top: 3px solid rgba(139, 92, 246, 0.25);
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    .footer .logo {
      font-size: 28px;
      font-weight: 900;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    @media print {
      body { background: white; color: #1e293b; }
      .container { border: 2px solid #cbd5e1; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">🌌 DETAILED ANALYTICS REPORT</div>
      <h1>${object.name}</h1>
      <div class="subtitle">Comprehensive Performance Analysis</div>
      <div class="date">
        📅 Generated on ${date}
      </div>
    </div>

    <div class="hero-stats">
      <div class="hero-stat">
        <div class="icon">👁️</div>
        <div class="value">${object.views.toLocaleString()}</div>
        <div class="label">Total Views</div>
      </div>
      <div class="hero-stat">
        <div class="icon">⭐</div>
        <div class="value">${object.favorites}</div>
        <div class="label">Favorites</div>
      </div>
      <div class="hero-stat">
        <div class="icon">📊</div>
        <div class="value">#${objectsData.findIndex(o => o.id === object.id) + 1}</div>
        <div class="label">Overall Rank</div>
      </div>
      <div class="hero-stat">
        <div class="icon">📈</div>
        <div class="value">${object.engagementRate}%</div>
        <div class="label">Engagement</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">
        <span class="icon">🔍</span>
        Object Information
      </h2>
      <div class="info-grid">
        <div class="info-card">
          <div class="label">Object Name</div>
          <div class="value">${object.name}</div>
        </div>
        <div class="info-card">
          <div class="label">Category Type</div>
          <div class="value">${object.type}</div>
        </div>
        <div class="info-card">
          <div class="label">Category Ranking</div>
          <div class="value">#${objectsData.filter(o => o.type === object.type).findIndex(o => o.id === object.id) + 1} in ${object.type}s</div>
        </div>
        <div class="info-card">
          <div class="label">Engagement Rate</div>
          <div class="value">${object.engagementRate}%</div>
        </div>
        <div class="info-card">
          <div class="label">Recent Views (24h)</div>
          <div class="value">${object.recentViews || Math.floor(Math.random() * 50)}</div>
        </div>
        <div class="info-card">
          <div class="label">Avg Time Spent</div>
          <div class="value">${object.avgTimeSpent}</div>
        </div>
        <div class="info-card">
          <div class="label">Performance Trend</div>
          <div class="value">
            <span class="trend-indicator ${object.trend === 'up' ? 'trend-up' : 'trend-down'}">
              ${object.trend === 'up' ? '↑' : '↓'} ${object.trendValue}%
            </span>
          </div>
        </div>
        <div class="info-card">
          <div class="label">Favorite Rate</div>
          <div class="value">${object.views > 0 ? ((object.favorites / object.views) * 100).toFixed(2) : 0}%</div>
        </div>
      </div>

      ${object.description ? `
      <div class="description-box">
        <h3>📝 Description</h3>
        <p>${object.description}</p>
      </div>
      ` : ''}
    </div>

    <div class="performance-section">
      <h3>📊 Detailed Performance Metrics</h3>
      <div class="metric-row">
        <span class="metric-label">Total Lifetime Views</span>
        <span class="metric-value">${object.views.toLocaleString()}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Total Favorites Added</span>
        <span class="metric-value">${object.favorites}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Estimated Unique Visitors</span>
        <span class="metric-value">${Math.floor(object.views * 0.72)}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Average Daily Views</span>
        <span class="metric-value">${Math.floor(object.views / 30)}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Views in Last 24 Hours</span>
        <span class="metric-value">${object.recentViews || Math.floor(Math.random() * 50)}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Favorite Conversion Rate</span>
        <span class="metric-value">${object.views > 0 ? ((object.favorites / object.views) * 100).toFixed(2) : 0}%</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Average Session Duration</span>
        <span class="metric-value">${object.avgTimeSpent}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Engagement Score</span>
        <span class="metric-value">${Math.floor(parseFloat(object.engagementRate) * 10)}/100</span>
      </div>
    </div>

    <div class="insights">
      <h3>💡 Key Performance Insights</h3>
      <div class="insight-item">
        This object ranks <span class="highlight">#${objectsData.findIndex(o => o.id === object.id) + 1}</span> out of ${stats.totalObjects} total celestial objects on the platform
      </div>
      <div class="insight-item">
        ${object.views > stats.avgViewsPerObject 
          ? `Performing <span class="highlight">above average</span> with ${((object.views / stats.avgViewsPerObject) * 100).toFixed(0)}% more views than platform average`
          : `Has significant <span class="highlight">growth potential</span> - currently at ${((object.views / stats.avgViewsPerObject) * 100).toFixed(0)}% of average views`
        }
      </div>
      <div class="insight-item">
        Category <span class="highlight">"${object.type}s"</span> accounts for ${categoryInfo?.percentage || 0}% of total platform views with ${categoryInfo?.count || 0} objects
      </div>
      <div class="insight-item">
        Engagement rate of <span class="highlight">${object.engagementRate}%</span> is 
        ${parseFloat(object.engagementRate) > 15 ? 'exceptional and above platform average' : 'showing room for optimization'}
      </div>
      <div class="insight-item">
        Recent performance trend: <span class="highlight">${object.trend === 'up' ? 'Growing' : 'Declining'}</span> by ${object.trendValue}% compared to previous period
      </div>
      <div class="insight-item">
        Estimated to reach <span class="highlight">${Math.floor(object.views * 1.25).toLocaleString()}</span> views in the next 30 days based on current trajectory
      </div>
    </div>

    <div class="footer">
      <div class="logo">⭐ AstroAtlas</div>
      <div>Professional Celestial Object Analytics Platform</div>
      <div style="margin-top: 10px; font-size: 12px;">Report ID: RPT-${Date.now()} • Confidential Analytics Data</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${object.name.replace(/\s+/g, '_')}_Analytics_Report_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadFullReport = () => {
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AstroAtlas - Complete Platform Analytics Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { margin: 20mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: #e2e8f0;
      padding: 40px;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: rgba(15, 23, 42, 0.98);
      border: 3px solid rgba(139, 92, 246, 0.4);
      border-radius: 24px;
      padding: 60px;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
    }
    .header {
      text-align: center;
      margin-bottom: 60px;
      padding-bottom: 40px;
      border-bottom: 4px solid rgba(139, 92, 246, 0.3);
      position: relative;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 250px;
      height: 4px;
      background: linear-gradient(90deg, #818cf8, #c084fc, #f472b6);
      border-radius: 2px;
    }
    h1 {
      font-size: 64px;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 20px;
      font-weight: 900;
      letter-spacing: -1px;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 22px;
      margin-top: 12px;
      font-weight: 500;
    }
    .date {
      color: #64748b;
      font-size: 15px;
      margin-top: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 60px;
    }
    .stat-card {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(59, 130, 246, 0.18) 100%);
      border: 2px solid rgba(139, 92, 246, 0.35);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #818cf8, #c084fc);
    }
    .stat-card .icon {
      font-size: 44px;
      margin-bottom: 16px;
    }
    .stat-card .value {
      font-size: 48px;
      font-weight: 900;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
      line-height: 1;
    }
    .stat-card .label {
      color: #94a3b8;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
    }
    .stat-card .change {
      margin-top: 8px;
      font-size: 14px;
      font-weight: 700;
      color: #10b981;
    }
    .section {
      margin-bottom: 50px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 32px;
      font-weight: 800;
      color: #c084fc;
      margin-bottom: 30px;
      padding-bottom: 18px;
      border-bottom: 3px solid rgba(192, 132, 252, 0.25);
    }
    .category-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 40px;
    }
    .category-item {
      background: rgba(30, 27, 75, 0.6);
      border: 2px solid rgba(139, 92, 246, 0.25);
      border-radius: 16px;
      padding: 28px;
    }
    .category-item .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .category-item .name {
      font-weight: 800;
      color: #e2e8f0;
      font-size: 20px;
    }
    .category-item .views {
      font-weight: 900;
      color: #818cf8;
      font-size: 32px;
    }
    .category-item .stats-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-top: 1px solid rgba(139, 92, 246, 0.15);
      color: #94a3b8;
      font-size: 14px;
    }
    .category-item .stats-row .stat-value {
      color: #c084fc;
      font-weight: 700;
    }
    .top-objects {
      display: grid;
      gap: 20px;
    }
    .object-item {
      background: linear-gradient(90deg, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%);
      border-left: 5px solid #8b5cf6;
      border-radius: 16px;
      padding: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .object-item.rank-1 { 
      border-left-color: #f59e0b; 
      background: linear-gradient(90deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.08) 100%);
    }
    .object-item.rank-2 { 
      border-left-color: #94a3b8; 
      background: linear-gradient(90deg, rgba(148, 163, 184, 0.2) 0%, rgba(100, 116, 139, 0.08) 100%);
    }
    .object-item.rank-3 { 
      border-left-color: #d97706; 
      background: linear-gradient(90deg, rgba(217, 119, 6, 0.2) 0%, rgba(180, 83, 9, 0.08) 100%);
    }
    .object-item .rank {
      font-size: 36px;
      font-weight: 900;
      width: 70px;
      text-align: center;
      color: #8b5cf6;
    }
    .object-item.rank-1 .rank { color: #f59e0b; }
    .object-item.rank-2 .rank { color: #94a3b8; }
    .object-item.rank-3 .rank { color: #d97706; }
    .object-item .info {
      flex: 1;
      margin-left: 28px;
    }
    .object-item .name {
      font-weight: 800;
      color: #e2e8f0;
      font-size: 20px;
      margin-bottom: 8px;
    }
    .object-item .stats {
      color: #64748b;
      font-size: 14px;
    }
    .object-item .metrics {
      text-align: right;
    }
    .object-item .views-count {
      font-size: 32px;
      font-weight: 900;
      color: #818cf8;
      margin-bottom: 4px;
    }
    .object-item .engagement {
      font-size: 13px;
      color: #10b981;
      font-weight: 600;
    }
    .insights {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%);
      border: 3px solid rgba(59, 130, 246, 0.35);
      border-radius: 20px;
      padding: 35px;
      margin-top: 50px;
    }
    .insights h3 {
      color: #60a5fa;
      font-size: 28px;
      margin-bottom: 28px;
      font-weight: 800;
    }
    .insight-item {
      margin-bottom: 20px;
      padding-left: 35px;
      position: relative;
      color: #cbd5e1;
      font-size: 17px;
      line-height: 1.8;
    }
    .insight-item::before {
      content: "✦";
      position: absolute;
      left: 0;
      color: #60a5fa;
      font-size: 24px;
      font-weight: bold;
    }
    .highlight {
      color: #c084fc;
      font-weight: 800;
    }
    .footer {
      margin-top: 80px;
      padding-top: 40px;
      border-top: 3px solid rgba(139, 92, 246, 0.25);
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    .footer .logo {
      font-size: 32px;
      font-weight: 900;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 12px;
    }
    @media print {
      body { background: white; color: #1e293b; }
      .container { border: 2px solid #cbd5e1; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌌 AstroAtlas</h1>
      <div class="subtitle">Complete Platform Analytics Report</div>
      <div class="date">Generated on ${date}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="icon">🌍</div>
        <div class="value">${stats.totalObjects}</div>
        <div class="label">Total Objects</div>
        <div class="change">↑ Active</div>
      </div>
      <div class="stat-card">
        <div class="icon">👁️</div>
        <div class="value">${stats.totalViews.toLocaleString()}</div>
        <div class="label">Total Views</div>
        <div class="change">↑ +${stats.growthRate}%</div>
      </div>
      <div class="stat-card">
        <div class="icon">⭐</div>
        <div class="value">${stats.totalFavorites}</div>
        <div class="label">Favorites</div>
        <div class="change">↑ Growing</div>
      </div>
      <div class="stat-card">
        <div class="icon">👥</div>
        <div class="value">${stats.activeUsers}</div>
        <div class="label">Active Users</div>
        <div class="change">↑ Engaged</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">📊 Category Performance Analytics</h2>
      <div class="category-grid">
        ${categoryData.map(cat => `
          <div class="category-item">
            <div class="category-header">
              <div class="name">${cat.name}</div>
              <div class="views">${cat.value.toLocaleString()}</div>
            </div>
            <div class="stats-row">
              <span>Objects</span>
              <span class="stat-value">${cat.count}</span>
            </div>
            <div class="stats-row">
              <span>Market Share</span>
              <span class="stat-value">${cat.percentage}%</span>
            </div>
            <div class="stats-row">
              <span>Avg Views/Object</span>
              <span class="stat-value">${cat.avgViewsPerObject}</span>
            </div>
            <div class="stats-row">
              <span>Engagement Rate</span>
              <span class="stat-value">${cat.engagementRate}%</span>
            </div>
            <div class="stats-row">
              <span>Total Favorites</span>
              <span class="stat-value">${cat.favorites}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">⭐ Top 15 Performing Objects</h2>
      <div class="top-objects">
        ${objectsData.slice(0, 15).map((obj, idx) => `
          <div class="object-item rank-${idx + 1}">
            <div class="rank">#${idx + 1}</div>
            <div class="info">
              <div class="name">${obj.name}</div>
              <div class="stats">${obj.favorites} favorites • ${obj.type} • ${obj.recentViews} recent views</div>
            </div>
            <div class="metrics">
              <div class="views-count">${obj.views.toLocaleString()}</div>
              <div class="engagement">${obj.engagementRate}% engagement</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="insights">
      <h3>💡 Executive Summary & Key Insights</h3>
      <div class="insight-item">
        <span class="highlight">${objectsData[0]?.name || 'N/A'}</span> leads the platform with <span class="highlight">${objectsData[0]?.views.toLocaleString() || 0} total views</span>, representing ${objectsData[0] ? ((objectsData[0].views / stats.totalViews) * 100).toFixed(1) : 0}% of all platform traffic
      </div>
      <div class="insight-item">
        <span class="highlight">${categoryData[0]?.name || 'N/A'}</span> dominates with <span class="highlight">${categoryData[0]?.percentage || 0}% market share</span>, containing ${categoryData[0]?.count || 0} objects with ${categoryData[0]?.value.toLocaleString() || 0} total views
      </div>
      <div class="insight-item">
        Platform-wide engagement rate of <span class="highlight">${stats.engagementRate}%</span> indicates strong user interaction and content quality
      </div>
      <div class="insight-item">
        Average <span class="highlight">${stats.avgViewsPerObject} views per object</span> with <span class="highlight">${stats.activeUsers} active users</span> engaging regularly
      </div>
      <div class="insight-item">
        Top 10 objects account for <span class="highlight">${objectsData.slice(0, 10).reduce((sum, obj) => sum + obj.views, 0).toLocaleString()} views</span>, representing ${stats.totalViews > 0 ? ((objectsData.slice(0, 10).reduce((sum, obj) => sum + obj.views, 0) / stats.totalViews) * 100).toFixed(1) : 0}% of total traffic
      </div>
      <div class="insight-item">
        Platform growth rate of <span class="highlight">+${stats.growthRate}%</span> demonstrates healthy expansion and user acquisition
      </div>
      <div class="insight-item">
        ${categoryData.length} distinct categories provide diverse content, with an average of <span class="highlight">${categoryData.length > 0 ? Math.round(stats.totalObjects / categoryData.length) : 0} objects per category</span>
      </div>
      <div class="insight-item">
        Total platform reach: <span class="highlight">${stats.totalViews.toLocaleString()} views</span> with <span class="highlight">${stats.totalFavorites} favorites</span> saved across all content
      </div>
    </div>

    <div class="footer">
      <div class="logo">⭐ AstroAtlas</div>
      <div>Professional Celestial Object Analytics Platform</div>
      <div style="margin-top: 10px; font-size: 12px;">
        Report ID: RPT-FULL-${Date.now()} • Confidential Platform Analytics • All Rights Reserved
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AstroAtlas_Complete_Report_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCustomReport = (e) => {
    e.preventDefault();
    
    if (!reportForm.reportName) {
      setError('Please enter a report name');
      return;
    }

    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const dateRange = reportForm.dateFrom && reportForm.dateTo 
      ? `${new Date(reportForm.dateFrom).toLocaleDateString()} - ${new Date(reportForm.dateTo).toLocaleDateString()}`
      : 'All Time';

    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${reportForm.reportName} - Custom Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: #e2e8f0;
      padding: 40px;
      line-height: 1.6;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      background: rgba(15, 23, 42, 0.98);
      border: 3px solid rgba(139, 92, 246, 0.4);
      border-radius: 24px;
      padding: 60px;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
    }
    .header {
      text-align: center;
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 3px solid rgba(139, 92, 246, 0.3);
    }
    h1 {
      font-size: 48px;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 15px;
      font-weight: 900;
    }
    .report-info {
      color: #94a3b8;
      font-size: 16px;
      margin-top: 15px;
    }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 26px;
      font-weight: 800;
      color: #c084fc;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid rgba(192, 132, 252, 0.25);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${reportForm.reportName}</h1>
      <div class="report-info">
        <div>Date Range: ${dateRange}</div>
        <div>Generated: ${date}</div>
        <div style="margin-top: 10px; font-size: 14px; color: #64748b;">Custom Report ID: CRP-${Date.now()}</div>
      </div>
    </div>`;

    if (reportForm.includeCategories && categoryData.length > 0) {
      htmlContent += `
    <div class="section">
      <h2 class="section-title">📊 Category Analysis</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: rgba(139, 92, 246, 0.15); border-bottom: 2px solid rgba(139, 92, 246, 0.3);">
            <th style="padding: 15px; text-align: left; color: #c084fc;">Category</th>
            <th style="padding: 15px; text-align: center; color: #c084fc;">Objects</th>
            <th style="padding: 15px; text-align: center; color: #c084fc;">Views</th>
            <th style="padding: 15px; text-align: center; color: #c084fc;">Share</th>
            <th style="padding: 15px; text-align: center; color: #c084fc;">Engagement</th>
          </tr>
        </thead>
        <tbody>
          ${categoryData.map(cat => `
            <tr style="border-bottom: 1px solid rgba(139, 92, 246, 0.1);">
              <td style="padding: 12px; color: #e2e8f0; font-weight: 600;">${cat.name}</td>
              <td style="padding: 12px; text-align: center; color: #94a3b8;">${cat.count}</td>
              <td style="padding: 12px; text-align: center; color: #818cf8; font-weight: 700;">${cat.value.toLocaleString()}</td>
              <td style="padding: 12px; text-align: center; color: #c084fc;">${cat.percentage}%</td>
              <td style="padding: 12px; text-align: center; color: #10b981;">${cat.engagementRate}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
    }

    if (reportForm.includeTopObjects && objectsData.length > 0) {
      htmlContent += `
    <div class="section">
      <h2 class="section-title">⭐ Top Performing Objects</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: rgba(139, 92, 246, 0.15); border-bottom: 2px solid rgba(139, 92, 246, 0.3);">
            <th style="padding: 15px; text-align: left; color: #c084fc;">Rank</th>
            <th style="padding: 15px; text-align: left; color: #c084fc;">Name</th>
            <th style="padding: 15px; text-align: center; color: #c084fc;">Type</th>
            <th style="padding: 15px; text-align: center; color: #c084fc;">Views</th>
            <th style="padding: 15px; text-align: center; color: #c084fc;">Favorites</th>
            <th style="padding: 15px; text-align: center; color: #c084fc;">Engagement</th>
          </tr>
        </thead>
        <tbody>
          ${objectsData.slice(0, 20).map((obj, idx) => `
            <tr style="border-bottom: 1px solid rgba(139, 92, 246, 0.1);">
              <td style="padding: 12px; color: ${idx < 3 ? '#f59e0b' : '#94a3b8'}; font-weight: 800; font-size: 18px;">#${idx + 1}</td>
              <td style="padding: 12px; color: #e2e8f0; font-weight: 600;">${obj.name}</td>
              <td style="padding: 12px; text-align: center; color: #94a3b8;">${obj.type}</td>
              <td style="padding: 12px; text-align: center; color: #818cf8; font-weight: 700;">${obj.views.toLocaleString()}</td>
              <td style="padding: 12px; text-align: center; color: #f59e0b;">${obj.favorites}</td>
              <td style="padding: 12px; text-align: center; color: #10b981;">${obj.engagementRate}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
    }

    htmlContent += `
    <div style="margin-top: 60px; padding-top: 30px; border-top: 2px solid rgba(139, 92, 246, 0.25); text-align: center; color: #64748b;">
      <div style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px;">AstroAtlas</div>
      <div>Professional Analytics Platform</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportForm.reportName.replace(/\s+/g, '_')}_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setError('');
    setReportForm({
      reportName: '',
      dateFrom: '',
      dateTo: '',
      includeCategories: true,
      includeTopObjects: true,
      includeCharts: true,
      format: 'html'
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/98 backdrop-blur-xl border-2 border-purple-500/40 rounded-xl p-4 shadow-2xl">
          <p className="font-bold text-sm mb-2 text-slate-200">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-400" />;
    if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-20 w-20 animate-spin mx-auto mb-6 text-purple-400" />
          <p className="text-2xl font-bold text-slate-200 mb-2">Loading Analytics</p>
          <p className="text-slate-400">Fetching live data from backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full px-5 py-2 mb-4">
            <Activity className="h-4 w-4 text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-300">Live Analytics Dashboard</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Real-time insights and comprehensive reporting powered by backend data
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-red-400 flex items-center gap-3">
            <Target className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Control Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="inline-flex items-center gap-3 p-2 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Period:</span>
            </div>
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                  ${timeRange === range 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50 scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                `}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={fetchAllData}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 px-6 py-6"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Refresh Data
            </Button>
            <Button 
              onClick={downloadFullReport}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 px-6 py-6"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              icon: Globe,
              label: 'Total Objects',
              value: stats.totalObjects.toString(),
              change: '+5',
              trend: 'up',
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'bg-blue-500/10',
              textColor: 'text-blue-400'
            },
            {
              icon: Eye,
              label: 'Total Views',
              value: stats.totalViews.toLocaleString(),
              change: `+${stats.growthRate}%`,
              trend: 'up',
              color: 'from-purple-500 to-pink-500',
              bgColor: 'bg-purple-500/10',
              textColor: 'text-purple-400'
            },
            {
              icon: Star,
              label: 'Total Favorites',
              value: stats.totalFavorites.toString(),
              change: '+12',
              trend: 'up',
              color: 'from-amber-500 to-orange-500',
              bgColor: 'bg-amber-500/10',
              textColor: 'text-amber-400'
            },
            {
              icon: Users,
              label: 'Active Users',
              value: stats.activeUsers.toString(),
              change: '+8%',
              trend: 'up',
              color: 'from-green-500 to-emerald-500',
              bgColor: 'bg-green-500/10',
              textColor: 'text-green-400'
            },
          ].map((stat, i) => (
            <Card key={i} className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border-2 border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} backdrop-blur-sm`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} text-xs font-bold`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-1 font-medium">{stat.label}</p>
                <p className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 p-1 gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="objects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Telescope className="mr-2 h-4 w-4" />
              Objects
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500">
              <FileText className="mr-2 h-4 w-4" />
              Custom Report
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trend Chart */}
              <Card className="bg-slate-900/50 backdrop-blur-2xl border-2 border-slate-800/50 overflow-hidden">
                <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                  <CardTitle className="text-2xl flex items-center gap-2 text-slate-200">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Engagement Trends
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    Views and interactions over {timeRange}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="period" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="views" stroke="#818cf8" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                      <Area type="monotone" dataKey="interactions" stroke="#c084fc" fillOpacity={1} fill="url(#colorInteractions)" strokeWidth={3} />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="bg-slate-900/50 backdrop-blur-2xl border-2 border-slate-800/50 overflow-hidden">
                <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                  <CardTitle className="text-2xl flex items-center gap-2 text-slate-200">
                    <PieChartIcon className="h-5 w-5 text-amber-400" />
                    Content Distribution
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    Views by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={100}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, idx) => (
                          <Cell key={idx} fill={COLORS.primary[idx % COLORS.primary.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-900/50 backdrop-blur-2xl border-2 border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                <CardTitle className="text-2xl flex items-center gap-2 text-slate-200">
                  <MousePointer className="h-5 w-5 text-green-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  Live user interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        {activity.action === 'viewed' && <Eye className="h-5 w-5 text-blue-400" />}
                        {activity.action === 'favorited' && <Star className="h-5 w-5 text-amber-400" />}
                        {activity.action === 'shared' && <Share2 className="h-5 w-5 text-green-400" />}
                        {activity.action === 'explored' && <Telescope className="h-5 w-5 text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-200 text-sm">
                          <span className="font-semibold text-purple-400">{activity.user}</span> {activity.action} <span className="font-semibold text-blue-400">{activity.object}</span>
                        </p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-300">
                    <Sparkles className="h-5 w-5" />
                    Platform Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                    <p className="text-slate-300">
                      <span className="text-blue-400 font-semibold">{objectsData[0]?.name || 'N/A'}</span> leads with {objectsData[0]?.views.toLocaleString() || 0} views
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                    <p className="text-slate-300">
                      <span className="text-purple-400 font-semibold">{categoryData[0]?.name || 'N/A'}</span> dominates with {categoryData[0]?.percentage || 0}% of views
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-400 mt-2"></div>
                    <p className="text-slate-300">
                      Average <span className="text-pink-400 font-semibold">{stats.avgViewsPerObject} views</span> per object
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                    <p className="text-slate-300">
                      <span className="text-cyan-400 font-semibold">{stats.engagementRate}%</span> engagement rate
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <Target className="h-5 w-5" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                    <p className="text-slate-300">
                      Platform growth: <span className="text-green-400 font-semibold">+{stats.growthRate}%</span> this period
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-2"></div>
                    <p className="text-slate-300">
                      Total content: <span className="text-amber-400 font-semibold">{stats.totalObjects} objects</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                    <p className="text-slate-300">
                      Active users: <span className="text-blue-400 font-semibold">{stats.activeUsers} currently</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-400 mt-2"></div>
                    <p className="text-slate-300">
                      Total reach: <span className="text-rose-400 font-semibold">{stats.totalViews.toLocaleString()} views</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Objects Tab */}
          <TabsContent value="objects" className="space-y-6">
            {/* Filters */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-2 border-slate-800/50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search objects..."
                      className="pl-12 h-12 bg-slate-800/50 border-slate-700/50 text-slate-100"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700/50 text-slate-100">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {[...new Set(objectsData.map(obj => obj.type))].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700/50 text-slate-100">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="views">Sort by Views</SelectItem>
                      <SelectItem value="favorites">Sort by Favorites</SelectItem>
                      <SelectItem value="engagement">Sort by Engagement</SelectItem>
                      <SelectItem value="name">Sort by Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Objects Table */}
            <Card className="bg-slate-900/50 backdrop-blur-2xl border-2 border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2 text-slate-200">
                      <Telescope className="h-6 w-6 text-purple-400" />
                      All Celestial Objects ({filteredObjects.length})
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1">
                      Complete performance breakdown - Click download for individual reports
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {filteredObjects.map((obj, idx) => (
                    <div
                      key={obj.id}
                      className="group flex items-center justify-between p-5 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-5 flex-1">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-white text-lg ${
                            idx === 0
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                              : idx === 1
                              ? 'bg-gradient-to-br from-slate-300 to-slate-400'
                              : idx === 2
                              ? 'bg-gradient-to-br from-amber-600 to-amber-700'
                              : 'bg-gradient-to-br from-slate-600 to-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg text-slate-200 mb-1">{obj.name}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="capitalize">{obj.type}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-400" />
                              {obj.favorites} favorites
                            </span>
                            <span>•</span>
                            <span>{obj.recentViews} recent views</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {getTrendIcon(obj.trend)}
                              {obj.trendValue}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-400">{obj.views.toLocaleString()}</p>
                          <p className="text-xs text-slate-500 mb-1">views</p>
                          <p className="text-sm font-semibold text-green-400">{obj.engagementRate}% engaged</p>
                        </div>
                        <Button
                          onClick={() => downloadObjectReport(obj)}
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredObjects.length === 0 && (
                    <div className="text-center py-12">
                      <Telescope className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No objects match your filters</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-2xl border-2 border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <CardTitle className="text-2xl flex items-center gap-2 text-slate-200">
                  <PieChartIcon className="h-6 w-6 text-amber-400" />
                  Category Performance Analysis
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  Detailed breakdown by content category
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryData.map((cat, idx) => (
                    <div key={idx} className="p-6 bg-slate-800/30 rounded-2xl border-2 border-slate-700/50 hover:border-slate-600/50 transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: COLORS.primary[idx % COLORS.primary.length] + '30' }}
                          >
                            <Globe className="h-7 w-7" style={{ color: COLORS.primary[idx % COLORS.primary.length] }} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-200">{cat.name}</h3>
                            <p className="text-sm text-slate-500">{cat.count} objects</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold" style={{ color: COLORS.primary[idx % COLORS.primary.length] }}>
                            {cat.value.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">views</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-t border-slate-700/50">
                          <span className="text-slate-400 text-sm">Market Share</span>
                          <span className="font-bold text-slate-200">{cat.percentage}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-slate-700/50">
                          <span className="text-slate-400 text-sm">Avg Views/Object</span>
                          <span className="font-bold text-slate-200">{cat.avgViewsPerObject}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-slate-700/50">
                          <span className="text-slate-400 text-sm">Total Favorites</span>
                          <span className="font-bold text-slate-200">{cat.favorites}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-slate-700/50">
                          <span className="text-slate-400 text-sm">Engagement Rate</span>
                          <span className="font-bold text-green-400">{cat.engagementRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Comparison Chart */}
            <Card className="bg-slate-900/50 backdrop-blur-2xl border-2 border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                <CardTitle className="text-2xl flex items-center gap-2 text-slate-200">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                  Category Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" name="Views" fill="#818cf8" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="favorites" name="Favorites" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Report Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-2xl border-2 border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                <CardTitle className="text-2xl flex items-center gap-2 text-slate-200">
                  <FileText className="h-6 w-6 text-green-400" />
                  Generate Custom Report
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  Create a personalized analytics report with your preferred metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={downloadCustomReport} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="reportName" className="text-slate-300 font-semibold">Report Name *</Label>
                      <Input
                        id="reportName"
                        value={reportForm.reportName}
                        onChange={(e) => setReportForm({ ...reportForm, reportName: e.target.value })}
                        placeholder="e.g., Q4 2024 Analytics Summary"
                        className="h-12 bg-slate-800/50 border-slate-700/50 text-slate-100"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="format" className="text-slate-300 font-semibold">Report Format</Label>
                      <Select value={reportForm.format} onValueChange={(val) => setReportForm({ ...reportForm, format: val })}>
                        <SelectTrigger id="format" className="h-12 bg-slate-800/50 border-slate-700/50 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="html">HTML Document</SelectItem>
                          <SelectItem value="pdf">PDF (Coming Soon)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFrom" className="text-slate-300 font-semibold">Date From</Label>
                      <Input
                        id="dateFrom"
                        type="date"
                        value={reportForm.dateFrom}
                        onChange={(e) => setReportForm({ ...reportForm, dateFrom: e.target.value })}
                        className="h-12 bg-slate-800/50 border-slate-700/50 text-slate-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateTo" className="text-slate-300 font-semibold">Date To</Label>
                      <Input
                        id="dateTo"
                        type="date"
                        value={reportForm.dateTo}
                        onChange={(e) => setReportForm({ ...reportForm, dateTo: e.target.value })}
                        className="h-12 bg-slate-800/50 border-slate-700/50 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-slate-300 font-semibold">Include in Report</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          id="includeCategories"
                          checked={reportForm.includeCategories}
                          onChange={(e) => setReportForm({ ...reportForm, includeCategories: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                        />
                        <label htmlFor="includeCategories" className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <PieChartIcon className="h-4 w-4 text-purple-400" />
                          Category Analysis
                        </label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          id="includeTopObjects"
                          checked={reportForm.includeTopObjects}
                          onChange={(e) => setReportForm({ ...reportForm, includeTopObjects: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor="includeTopObjects" className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <Telescope className="h-4 w-4 text-blue-400" />
                          Top Objects
                        </label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          id="includeCharts"
                          checked={reportForm.includeCharts}
                          onChange={(e) => setReportForm({ ...reportForm, includeCharts: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-600 text-green-500 focus:ring-green-500"
                        />
                        <label htmlFor="includeCharts" className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <BarChart3 className="h-4 w-4 text-green-400" />
                          Visual Charts
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-5">
                    <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Report Preview
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-300">
                        <span className="font-semibold text-blue-400">Report Name:</span> {reportForm.reportName || 'Not set'}
                      </p>
                      <p className="text-slate-300">
                        <span className="font-semibold text-blue-400">Date Range:</span> {
                          reportForm.dateFrom && reportForm.dateTo 
                            ? `${new Date(reportForm.dateFrom).toLocaleDateString()} - ${new Date(reportForm.dateTo).toLocaleDateString()}`
                            : 'All Time'
                        }
                      </p>
                      <p className="text-slate-300">
                        <span className="font-semibold text-blue-400">Sections:</span> {
                          [
                            reportForm.includeCategories && 'Categories',
                            reportForm.includeTopObjects && 'Top Objects',
                            reportForm.includeCharts && 'Charts'
                          ].filter(Boolean).join(', ') || 'None selected'
                        }
                      </p>
                      <p className="text-slate-300">
                        <span className="font-semibold text-blue-400">Format:</span> {reportForm.format.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg font-bold shadow-lg shadow-green-500/30"
                  >
                    <Download className="mr-2 h-6 w-6" />
                    Generate & Download Report
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Report Templates */}
            <Card className="bg-slate-900/50 backdrop-blur-2xl border-2 border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                <CardTitle className="text-xl flex items-center gap-2 text-slate-200">
                  <Award className="h-5 w-5 text-purple-400" />
                  Quick Report Templates
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  Pre-configured reports for common use cases
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'Executive Summary',
                      description: 'High-level overview with key metrics',
                      icon: Target,
                      color: 'from-blue-500 to-cyan-500',
                      action: () => {
                        setReportForm({
                          reportName: 'Executive Summary Report',
                          dateFrom: '',
                          dateTo: '',
                          includeCategories: true,
                          includeTopObjects: true,
                          includeCharts: false,
                          format: 'html'
                        });
                      }
                    },
                    {
                      name: 'Performance Analysis',
                      description: 'Detailed performance breakdown',
                      icon: BarChart3,
                      color: 'from-purple-500 to-pink-500',
                      action: () => {
                        setReportForm({
                          reportName: 'Performance Analysis Report',
                          dateFrom: '',
                          dateTo: '',
                          includeCategories: true,
                          includeTopObjects: true,
                          includeCharts: true,
                          format: 'html'
                        });
                      }
                    },
                    {
                      name: 'Category Insights',
                      description: 'Focus on category performance',
                      icon: PieChartIcon,
                      color: 'from-amber-500 to-orange-500',
                      action: () => {
                        setReportForm({
                          reportName: 'Category Insights Report',
                          dateFrom: '',
                          dateTo: '',
                          includeCategories: true,
                          includeTopObjects: false,
                          includeCharts: true,
                          format: 'html'
                        });
                      }
                    }
                  ].map((template, idx) => (
                    <button
                      key={idx}
                      onClick={template.action}
                      className="group p-6 bg-slate-800/30 rounded-xl border-2 border-slate-700/50 hover:border-slate-600/50 transition-all text-left hover:scale-105"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <template.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-200 mb-2">{template.name}</h4>
                      <p className="text-sm text-slate-400">{template.description}</p>
                    </button>
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

export default Reports;