import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Swords, 
  LayoutDashboard, 
  DoorOpen, 
  Radio, 
  BarChart3, 
  Package, 
  Shield, 
  Map, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Zap,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './CommandHeader.css';

export default function CommandHeader({ onOpenSettings }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const currentPath = location.pathname;

  const navItems = [
    { path: '/arena', label: 'Arena', icon: Swords, highlight: true },
    { path: '/lobby', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/rooms', label: 'Custom Rooms', icon: DoorOpen },
    { path: '/stream', label: 'Live Stream', icon: Radio },
    { path: '/analytics', label: 'Telemetry', icon: BarChart3 },
    { path: '/inventory', label: 'Locker', icon: Package },
    { path: '/clan', label: 'Clans', icon: Shield },
    { path: '/theme', label: 'Sectors', icon: Map },
  ];

  const handleLogout = async () => {
    if (logout) await logout();
    navigate('/login');
  };

  const username = user?.username || 'GHOST_OPERATOR';
  const rank = user?.rank || 'Conqueror Tier';
  const mmr = user?.stats?.mmr || user?.mmr || '3,850';

  return (
    <header className="editorial-app-header">
      <div className="header-inner">
        {/* Left: Brand Identity */}
        <div className="header-left">
          <Link to="/" className="brand-badge-container">
            <span className="header-brand-dot"></span>
            <span className="header-brand-text">
              CODEBATTLE<span className="text-lime">.</span>
            </span>
          </Link>

          <div className="operator-quick-pill desktop-only">
            <span className="status-beacon-green"></span>
            <span className="operator-callsign">{username}</span>
            <span className="operator-tier-badge">{rank}</span>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="header-nav desktop-only">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-link-btn ${isActive ? 'active' : ''} ${item.highlight ? 'highlight-arena' : ''}`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {item.highlight && <span className="live-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Right: Telemetry & User Menu */}
        <div className="header-right">
          <div className="telemetry-pill desktop-only">
            <Zap size={13} className="text-lime" />
            <span className="telemetry-label">MMR</span>
            <span className="telemetry-val">{mmr}</span>
          </div>

          <button 
            onClick={onOpenSettings}
            className="action-icon-btn"
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {/* User Profile Pill / Logout */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="user-profile-btn"
            >
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`}
                alt="Avatar"
                className="user-avatar-tiny"
              />
              <span className="user-name-label desktop-only">{username}</span>
              <ChevronDown size={13} className="text-muted desktop-only" />
            </button>

            {userDropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-username">{username}</span>
                  <span className="dropdown-rank">{rank}</span>
                </div>
                <div className="dropdown-divider" />
                <button onClick={() => { setUserDropdownOpen(false); navigate('/analytics'); }} className="dropdown-item">
                  <BarChart3 size={14} />
                  <span>Player Telemetry</span>
                </button>
                <button onClick={() => { setUserDropdownOpen(false); navigate('/inventory'); }} className="dropdown-item">
                  <Package size={14} />
                  <span>3D Locker & Skins</span>
                </button>
                <button onClick={() => { setUserDropdownOpen(false); if (onOpenSettings) onOpenSettings(); }} className="dropdown-item">
                  <Settings size={14} />
                  <span>Settings</span>
                </button>
                <div className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item text-danger">
                  <LogOut size={14} />
                  <span>Disconnect Session</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle mobile-only"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer mobile-only">
          <div className="mobile-drawer-inner">
            <div className="mobile-operator-info">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-lime"
              />
              <div>
                <span className="font-display text-sm text-white font-bold block">{username}</span>
                <span className="font-mono text-[11px] text-lime">{rank} • {mmr} MMR</span>
              </div>
            </div>

            <div className="mobile-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(item.path);
                    }}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mobile-drawer-footer">
              <button 
                onClick={() => { setMobileMenuOpen(false); if (onOpenSettings) onOpenSettings(); }}
                className="mobile-footer-btn"
              >
                <Settings size={15} />
                <span>Settings</span>
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="mobile-footer-btn danger"
              >
                <LogOut size={15} />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
