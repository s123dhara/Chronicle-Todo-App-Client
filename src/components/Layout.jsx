import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { path: '/', label: 'Dashboard', icon: '◈' },
  { path: '/tasks', label: 'All Tasks', icon: '◻' },
  { path: '/delayed', label: 'Delayed', icon: '◷' },
  { path: '/calendar', label: 'Calendar', icon: '◫' },
  { path: '/add', label: 'Add Task', icon: '+' },
];

export default function Layout({ children }) {
  const { colors, theme, toggleTheme, tasks } = useApp();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const delayedCount = tasks.filter(t => t.delayed && !t.completed).length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayPending = tasks.filter(t => t.scheduledDate === todayStr && !t.completed && !t.delayed).length;

  const sidebarStyle = {
    width: '240px', flexShrink: 0, background: colors.surface,
    borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column',
    height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
    transition: 'background 0.3s ease',
  };

  const NavItem = ({ item }) => {
    const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
    const badge = item.path === '/delayed' && delayedCount > 0 ? delayedCount : null;
    return (
      <NavLink to={item.path} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px',
          borderRadius: '10px', margin: '2px 10px', cursor: 'pointer', transition: 'all 0.18s ease',
          background: active ? colors.accentBg : 'transparent',
          color: active ? colors.accent : colors.textSub,
          fontWeight: active ? 600 : 400, fontSize: '14px',
        }}>
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center', lineHeight: 1 }}>{item.icon}</span>
          <span style={{ flex: 1 }}>{item.label}</span>
          {badge && (
            <span style={{ background: colors.danger, color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 700 }}>
              {badge}
            </span>
          )}
          {item.path === '/tasks' && todayPending > 0 && (
            <span style={{ background: colors.accent, color: '#0d0d0f', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 700 }}>
              {todayPending}
            </span>
          )}
        </div>
      </NavLink>
    );
  };

  const SidebarContent = () => (
    <>
      <div style={{ padding: '28px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0d0d0f', fontWeight: 700, fontSize: '16px', fontFamily: 'DM Serif Display' }}>C</span>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontFamily: 'DM Serif Display', color: colors.text }}>Chronicle</div>
            <div style={{ fontSize: '11px', color: colors.textMuted }}>Task Manager</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ padding: '0 10px 8px', fontSize: '11px', fontWeight: 600, color: colors.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: '16px', marginBottom: '4px' }}>Navigation</div>
        {NAV.map(item => <NavItem key={item.path} item={item} />)}
      </div>

      <div style={{ padding: '20px', borderTop: `1px solid ${colors.border}` }}>
        <button onClick={toggleTheme} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: '10px', background: colors.surfaceAlt,
          border: `1px solid ${colors.border}`, color: colors.textSub, cursor: 'pointer',
          fontSize: '13px', fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.18s ease',
        }}>
          <span style={{ fontSize: '16px' }}>{theme === 'dark' ? '☀' : '◑'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        {/* User Info & Logout */}
        <div style={{ marginTop: '12px', padding: '10px', background: colors.surfaceAlt, borderRadius: '10px', border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: '12px', color: colors.text, fontWeight: 600, marginBottom: '4px' }}>
            {user?.name || 'User'}
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '8px' }}>
            {user?.email || ''}
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '6px 10px', borderRadius: '8px',
            background: colors.dangerBg, border: `1px solid ${colors.danger}40`,
            color: colors.danger, fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s ease',
          }}>
            Logout
          </button>
        </div>
        
        <div style={{ marginTop: '12px', fontSize: '11px', color: colors.textMuted, textAlign: 'center' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg }}>
      {/* Desktop Sidebar */}
      <aside style={{ ...sidebarStyle, display: 'flex' }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="mobile-header" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: colors.surface, borderBottom: `1px solid ${colors.border}`,
        padding: '14px 16px', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0d0d0f', fontWeight: 700, fontSize: '14px' }}>C</span>
          </div>
          <span style={{ fontSize: '15px', fontFamily: 'DM Serif Display', color: colors.text }}>Chronicle</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSub, fontSize: '18px', padding: '4px' }}>
            {theme === 'dark' ? '☀' : '◑'}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text, fontSize: '20px', padding: '4px' }}>
            {mobileOpen ? '×' : '≡'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 199, background: colors.overlay }} onClick={() => setMobileOpen(false)}>
          <aside style={{ ...sidebarStyle, width: '260px', boxShadow: '4px 0 32px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: '56px' }} />
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, overflowX: 'hidden', paddingTop: 0 }} className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav" style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: colors.surface, borderTop: `1px solid ${colors.border}`,
        padding: '8px 0', justifyContent: 'space-around',
      }}>
        {NAV.map(item => {
          const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '4px 12px' }}>
              <span style={{ fontSize: '18px', color: active ? colors.accent : colors.textMuted }}>{item.icon}</span>
              <span style={{ fontSize: '10px', color: active ? colors.accent : colors.textMuted, fontWeight: active ? 600 : 400 }}>
                {item.label.split(' ')[0]}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .mobile-bottom-nav { display: flex !important; }
          .main-content { padding-top: 56px !important; padding-bottom: 70px !important; }
        }
      `}</style>
    </div>
  );
}
