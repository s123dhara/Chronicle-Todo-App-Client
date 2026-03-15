import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import config from '../config/index.js';

export default function StatusDashboard() {
  const { colors } = useApp();
  const [serverStatus, setServerStatus] = useState('checking');
  const [lastPing, setLastPing] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [pinging, setPinging] = useState(false);
  const [stats, setStats] = useState({ success: 0, failed: 0 });

  const checkServerStatus = async () => {
    const startTime = Date.now();
    // const TEST_API_URL = "https://chronicle-todo-app-server.onrender.com/api/v1"
    try {
      const response = await fetch(`${config.api.baseURL}/health/ping`, {
      // const response = await fetch(`${TEST_API_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const endTime = Date.now();
      
      if (response.ok) {
        setServerStatus('online');
        setResponseTime(endTime - startTime);
        setLastPing(new Date());
        setStats(prev => ({ ...prev, success: prev.success + 1 }));
      } else {
        setServerStatus('error');
        setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
      }
    } catch (error) {
      setServerStatus('offline');
      setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
    }
  };

  const handleManualPing = async () => {
    setPinging(true);
    await checkServerStatus();
    setTimeout(() => setPinging(false), 1000);
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'online': return colors.success;
      case 'offline': return colors.danger;
      case 'error': return colors.warning;
      default: return colors.textMuted;
    }
  };

  const getStatusText = () => {
    switch (serverStatus) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'error': return 'Error';
      default: return 'Checking...';
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: colors.bg,
      color: colors.text,
      padding: '32px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    title: {
      fontSize: '32px',
      fontFamily: "'DM Serif Display', Georgia, serif",
      color: colors.accent,
      margin: 0,
    },
    badge: {
      background: colors.dangerBg,
      color: colors.danger,
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
      border: `1px solid ${colors.danger}40`,
    },
    subtitle: {
      color: colors.textSub,
      fontSize: '14px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '28px',
    },
    card: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      padding: '20px',
      transition: 'all 0.2s ease',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    cardTitle: {
      fontSize: '12px',
      fontWeight: 600,
      color: colors.textSub,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      margin: 0,
    },
    statusDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      boxShadow: '0 0 10px currentColor',
      animation: 'pulse 2s ease-in-out infinite',
    },
    icon: {
      fontSize: '20px',
      opacity: 0.6,
    },
    statusValue: {
      marginBottom: '8px',
    },
    timeText: {
      fontSize: '24px',
      fontWeight: 700,
      color: colors.accent,
      fontFamily: "'DM Serif Display', Georgia, serif",
    },
    rateText: {
      fontSize: '28px',
      fontWeight: 700,
      color: colors.success,
      fontFamily: "'DM Serif Display', Georgia, serif",
    },
    cardMeta: {
      fontSize: '13px',
      color: colors.textMuted,
      margin: 0,
    },
    endpointBox: {
      background: colors.surfaceAlt,
      padding: '12px',
      borderRadius: '10px',
      marginBottom: '8px',
      overflowX: 'auto',
      border: `1px solid ${colors.borderLight}`,
    },
    endpoint: {
      color: colors.accent,
      fontSize: '13px',
      wordBreak: 'break-all',
      fontFamily: 'monospace',
    },
    actionSection: {
      textAlign: 'center',
      margin: '40px 0',
    },
    pingButton: {
      background: colors.accent,
      color: colors.bg,
      padding: '14px 32px',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: 600,
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.2s ease',
      boxShadow: `0 4px 16px ${colors.accent}40`,
    },
    buttonIcon: {
      fontSize: '18px',
    },
    spinner: {
      display: 'inline-block',
      animation: 'spin 1s linear infinite',
      fontSize: '18px',
    },
    actionHint: {
      marginTop: '12px',
      color: colors.textMuted,
      fontSize: '13px',
    },
    infoCard: {
      background: colors.surfaceAlt,
      border: `1px solid ${colors.border}`,
      borderRadius: '14px',
      padding: '20px',
      marginBottom: '28px',
    },
    infoTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.text,
      marginBottom: '12px',
    },
    infoList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    infoItem: {
      fontSize: '13px',
      color: colors.textSub,
      marginBottom: '8px',
      paddingLeft: '20px',
      position: 'relative',
    },
    infoBullet: {
      position: 'absolute',
      left: 0,
      color: colors.accent,
    },
    footer: {
      textAlign: 'center',
      paddingTop: '28px',
      borderTop: `1px solid ${colors.border}`,
    },
    footerText: {
      color: colors.textMuted,
      fontSize: '13px',
    },
    kbd: {
      background: colors.surfaceAlt,
      padding: '4px 8px',
      borderRadius: '6px',
      border: `1px solid ${colors.border}`,
      fontFamily: 'monospace',
      fontSize: '12px',
      color: colors.text,
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <h1 style={styles.title}>🔒 System Status</h1>
          <span style={styles.badge}>Secret Dashboard</span>
        </div>
        <p style={styles.subtitle}>Backend Health Monitor & Keep-Alive Control</p>
      </div>

      <div style={styles.grid}>
        {/* Server Status Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Server Status</h3>
            <div style={{ ...styles.statusDot, backgroundColor: getStatusColor() }} />
          </div>
          <div style={styles.statusValue}>
            <span style={{ color: getStatusColor(), fontSize: '28px', fontWeight: 700, fontFamily: "'DM Serif Display', Georgia, serif" }}>
              {getStatusText()}
            </span>
          </div>
          {responseTime && (
            <p style={styles.cardMeta}>Response time: {responseTime}ms</p>
          )}
        </div>

        {/* Last Ping Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Last Ping</h3>
            <span style={styles.icon}>📡</span>
          </div>
          <div style={styles.statusValue}>
            <span style={styles.timeText}>
              {lastPing ? lastPing.toLocaleTimeString() : '--:--:--'}
            </span>
          </div>
          <p style={styles.cardMeta}>
            {lastPing ? lastPing.toLocaleDateString() : 'No data'}
          </p>
        </div>

        {/* Success Rate Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Success Rate</h3>
            <span style={styles.icon}>📊</span>
          </div>
          <div style={styles.statusValue}>
            <span style={styles.rateText}>
              {stats.success + stats.failed > 0
                ? Math.round((stats.success / (stats.success + stats.failed)) * 100)
                : 0}%
            </span>
          </div>
          <p style={styles.cardMeta}>
            {stats.success} success / {stats.failed} failed
          </p>
        </div>

        {/* API Endpoint Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>API Endpoint</h3>
            <span style={styles.icon}>🌐</span>
          </div>
          <div style={styles.endpointBox}>
            <code style={styles.endpoint}>{config.api.baseURL}</code>
          </div>
          <p style={styles.cardMeta}>Timeout: {config.api.timeout / 1000}s</p>
        </div>
      </div>

      {/* Manual Ping Button */}
      <div style={styles.actionSection}>
        <button
          onClick={handleManualPing}
          disabled={pinging}
          style={{
            ...styles.pingButton,
            opacity: pinging ? 0.6 : 1,
            cursor: pinging ? 'not-allowed' : 'pointer',
          }}
        >
          {pinging ? (
            <>
              <span style={styles.spinner}>⟳</span>
              Pinging Server...
            </>
          ) : (
            <>
              <span style={styles.buttonIcon}>🚀</span>
              Send Keep-Alive Ping
            </>
          )}
        </button>
        <p style={styles.actionHint}>
          Manually trigger a ping to keep the backend container alive
        </p>
      </div>

      {/* Info Section */}
      <div style={styles.infoCard}>
        <h4 style={styles.infoTitle}>ℹ️ About Keep-Alive</h4>
        <ul style={styles.infoList}>
          <li style={styles.infoItem}>
            <span style={styles.infoBullet}>◆</span>
            Automatic health check runs every 60 seconds
          </li>
          <li style={styles.infoItem}>
            <span style={styles.infoBullet}>◆</span>
            Prevents Render free tier from spinning down after 15 min inactivity
          </li>
          <li style={styles.infoItem}>
            <span style={styles.infoBullet}>◆</span>
            Use external services (UptimeRobot/Cron-Job.org) for 24/7 monitoring
          </li>
          <li style={styles.infoItem}>
            <span style={styles.infoBullet}>◆</span>
            Manual ping useful for immediate wake-up during cold starts
          </li>
        </ul>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Press <kbd style={styles.kbd}>Ctrl</kbd> + <kbd style={styles.kbd}>Shift</kbd> + <kbd style={styles.kbd}>S</kbd> to exit
        </p>
      </div>
    </div>
  );
}
