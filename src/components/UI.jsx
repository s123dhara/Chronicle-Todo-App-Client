import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, style, type = 'button', ...rest }) {
  const { colors } = useApp();
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    borderRadius: '10px', fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, transition: 'all 0.18s ease', border: 'none', whiteSpace: 'nowrap',
    fontFamily: 'inherit', letterSpacing: '0.01em',
  };
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '9px 18px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '15px' },
  };
  const variants = {
    primary: { background: colors.accent, color: '#0d0d0f' },
    secondary: { background: colors.surfaceAlt, color: colors.text, border: `1px solid ${colors.border}` },
    ghost: { background: 'transparent', color: colors.textSub, border: `1px solid transparent` },
    danger: { background: colors.dangerBg, color: colors.danger, border: `1px solid ${colors.danger}30` },
    success: { background: colors.successBg, color: colors.success, border: `1px solid ${colors.success}30` },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, color, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
      borderRadius: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em',
      textTransform: 'uppercase', background: `${color}18`, color, border: `1px solid ${color}30`,
      ...style
    }}>{children}</span>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder, type = 'text', required, style, multiline, rows = 3, ...rest }) {
  const { colors } = useApp();
  const base = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
    background: colors.surfaceAlt, color: colors.text, border: `1px solid ${colors.border}`,
    transition: 'border-color 0.18s ease', resize: 'vertical', fontFamily: 'inherit',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label style={{ fontSize: '12px', fontWeight: 600, color: colors.textSub, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}{required && <span style={{ color: colors.danger }}> *</span>}</label>}
      {multiline
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...base, ...style }} {...rest} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} style={{ ...base, ...style }} {...rest} />
      }
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options, style }) {
  const { colors } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label style={{ fontSize: '12px', fontWeight: 600, color: colors.textSub, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>}
      <select value={value} onChange={onChange} style={{
        width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
        background: colors.surfaceAlt, color: colors.text, border: `1px solid ${colors.border}`,
        cursor: 'pointer', fontFamily: 'inherit', ...style
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, width = '480px' }) {
  const { colors } = useApp();
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.addEventListener('keydown', handler); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: colors.overlay,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      backdropFilter: 'blur(4px)',
    }}>
      <div onClick={e => e.stopPropagation()} className="anim-scale" style={{
        background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '18px',
        padding: '28px', width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', color: colors.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: '22px', lineHeight: 1, padding: '4px', borderRadius: '6px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style, onClick, hover = false }) {
  const { colors } = useApp();
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: colors.surface, border: `1px solid ${hov && hover ? colors.accent + '40' : colors.border}`,
        borderRadius: '16px', padding: '20px', transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        transform: hov && hover ? 'translateY(-2px)' : 'none',
        boxShadow: hov && hover ? `0 8px 32px rgba(0,0,0,0.15)` : 'none',
        ...style
      }}>
      {children}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action }) {
  const { colors } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: '12px' }}>
      <div style={{ fontSize: '48px', opacity: 0.4 }}>{icon}</div>
      <div style={{ fontSize: '16px', fontWeight: 600, color: colors.textSub }}>{title}</div>
      {subtitle && <div style={{ fontSize: '13px', color: colors.textMuted, textAlign: 'center', maxWidth: '280px' }}>{subtitle}</div>}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
export function ProgressRing({ value, max, size = 64, strokeWidth = 5, color }) {
  const { colors } = useApp();
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? value / max : 0;
  const offset = circ * (1 - pct);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.border} strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color || colors.accent} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size/2}px ${size/2}px`, fill: color || colors.accent, fontSize: '13px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
export function Tooltip({ text, children }) {
  const { colors } = useApp();
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
          background: colors.text, color: colors.bg, fontSize: '12px', padding: '4px 10px', borderRadius: '6px',
          whiteSpace: 'nowrap', zIndex: 100, pointerEvents: 'none',
        }}>{text}</div>
      )}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  const { colors } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
      <div style={{ flex: 1, height: '1px', background: colors.border }} />
      {label && <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>}
      <div style={{ flex: 1, height: '1px', background: colors.border }} />
    </div>
  );
}
