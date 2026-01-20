// ============================================================
// LAYOUT COMPONENT
// Main app layout with sidebar navigation
// ============================================================

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Umbrella,
  Award,
  Briefcase,
  TrendingUp,
  Copy,
  Upload,
} from 'lucide-react';
import { UpliftLogo } from './UpliftLogo';

// Navigation items with role-based visibility
const getNavigation = (role) => {
  const isAdmin = role === 'admin';
  const isManager = role === 'manager' || isAdmin;
  
  return [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, show: true },
    { name: 'Employees', href: '/employees', icon: Users, show: isManager },
    { name: 'Schedule', href: '/schedule', icon: Calendar, show: true },
    { name: 'Templates', href: '/shift-templates', icon: Copy, show: isManager },
    { name: 'Time Tracking', href: '/time-tracking', icon: Clock, show: true },
    { name: 'Time Off', href: '/time-off', icon: Umbrella, show: true },
    { name: 'Locations', href: '/locations', icon: MapPin, show: isManager },
    // Differentiators
    { name: 'Skills', href: '/skills', icon: Award, show: isManager, highlight: true },
    { name: 'Opportunities', href: '/jobs', icon: Briefcase, show: true, highlight: true },
    { name: 'My Career', href: '/career', icon: TrendingUp, show: !isManager, highlight: true },
    // Admin
    { name: 'Bulk Import', href: '/bulk-import', icon: Upload, show: isManager },
    { name: 'Reports', href: '/reports', icon: BarChart3, show: isManager },
    { name: 'Settings', href: '/settings', icon: Settings, show: true },
  ].filter(item => item.show);
};

// Check if we're in demo mode (can be set via env var or org settings)
const isDemoMode = () => {
  // Check environment variable
  if (import.meta.env.VITE_DEMO_MODE === 'true') return true;
  // Check if URL contains 'demo'
  if (window.location.hostname.includes('demo')) return true;
  return false;
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoBannerVisible, setDemoBannerVisible] = useState(isDemoMode());
  
  const navigation = getNavigation(user?.role);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo Mode Banner */}
      {demoBannerVisible && (
        <div className="bg-gradient-to-r from-momentum-500 to-momentum-600 text-white px-4 py-2 text-center text-sm relative">
          <span className="font-medium">Demo Environment</span>
          <span className="mx-2">|</span>
          <span>The Grand Metropolitan Hotel Group - 150 employees across 5 locations</span>
          <span className="mx-2">|</span>
          <span className="opacity-90">All data is fictional</span>
          <button 
            onClick={() => setDemoBannerVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded p-1"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 transform transition-transform duration-200
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <UpliftLogo size={32} showWordmark={true} variant="dark" />
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-momentum-500 text-white' 
                  : item.highlight
                    ? 'text-momentum-300 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
              {item.highlight && (
                <span className="ml-auto text-xs px-1.5 py-0.5 bg-momentum-500/20 text-momentum-300 rounded">
                  NEW
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          {/* Notifications */}
          <button 
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            onClick={() => navigate('/settings/notifications')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-momentum-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative ml-2">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-momentum-100 text-momentum-600 rounded-full flex items-center justify-center font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700">
                {user?.firstName} {user?.lastName}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
