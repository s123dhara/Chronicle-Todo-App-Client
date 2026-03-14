import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const COLORS = {
  dark: {
    bg: '#0d0d0f',
    surface: '#141416',
    surfaceAlt: '#1a1a1e',
    border: '#2a2a30',
    borderLight: '#222228',
    text: '#f0ede8',
    textMuted: '#6b6875',
    textSub: '#9b97a8',
    accent: '#e8c547',
    accentDim: '#c9a92e',
    accentBg: 'rgba(232,197,71,0.08)',
    danger: '#e05c5c',
    dangerBg: 'rgba(224,92,92,0.08)',
    success: '#5cb891',
    successBg: 'rgba(92,184,145,0.08)',
    info: '#5c9ee0',
    infoBg: 'rgba(92,158,224,0.08)',
    warning: '#e0935c',
    warningBg: 'rgba(224,147,92,0.08)',
    overlay: 'rgba(0,0,0,0.7)',
    scrollbar: '#2a2a30',
  },
  light: {
    bg: '#f8f5f0',
    surface: '#ffffff',
    surfaceAlt: '#f2efe9',
    border: '#e2ddd6',
    borderLight: '#ede9e2',
    text: '#1a1714',
    textMuted: '#9e998f',
    textSub: '#6b6660',
    accent: '#b8860b',
    accentDim: '#9a7209',
    accentBg: 'rgba(184,134,11,0.08)',
    danger: '#c0392b',
    dangerBg: 'rgba(192,57,43,0.08)',
    success: '#1e8449',
    successBg: 'rgba(30,132,73,0.08)',
    info: '#1a6fa8',
    infoBg: 'rgba(26,111,168,0.08)',
    warning: '#a04000',
    warningBg: 'rgba(160,64,0,0.08)',
    overlay: 'rgba(0,0,0,0.4)',
    scrollbar: '#d0ccc5',
  }
};

const PRIORITY_COLORS = {
  high: { dark: '#e05c5c', light: '#c0392b' },
  medium: { dark: '#e0935c', light: '#a04000' },
  low: { dark: '#5cb891', light: '#1e8449' },
};

const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];

const SAMPLE_TASKS = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fmt = (d) => d.toISOString().slice(0, 16);
  
  const h = (hr, min = 0) => {
    const d = new Date(today);
    d.setHours(hr, min, 0, 0);
    return fmt(d);
  };

  return [
    { id: uuidv4(), title: 'Morning standup meeting', category: 'Work', priority: 'high', scheduledTime: h(9, 0), duration: 30, completed: false, delayed: false, notes: 'Discuss sprint progress', createdAt: now.toISOString(), scheduledDate: today.toISOString().slice(0,10) },
    { id: uuidv4(), title: 'Review Q2 roadmap document', category: 'Work', priority: 'medium', scheduledTime: h(10, 30), duration: 60, completed: false, delayed: false, notes: '', createdAt: now.toISOString(), scheduledDate: today.toISOString().slice(0,10) },
    { id: uuidv4(), title: 'Lunch & short walk', category: 'Health', priority: 'low', scheduledTime: h(13, 0), duration: 45, completed: false, delayed: false, notes: '', createdAt: now.toISOString(), scheduledDate: today.toISOString().slice(0,10) },
    { id: uuidv4(), title: 'Client presentation prep', category: 'Work', priority: 'high', scheduledTime: h(15, 0), duration: 90, completed: false, delayed: false, notes: 'Slides + demo flow', createdAt: now.toISOString(), scheduledDate: today.toISOString().slice(0,10) },
    { id: uuidv4(), title: 'Read: Atomic Habits chapter 5', category: 'Learning', priority: 'low', scheduledTime: h(20, 0), duration: 30, completed: false, delayed: false, notes: '', createdAt: now.toISOString(), scheduledDate: today.toISOString().slice(0,10) },
  ];
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('chronicle-theme') || 'dark');
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem('chronicle-tasks');
      return stored ? JSON.parse(stored) : SAMPLE_TASKS();
    } catch { return SAMPLE_TASKS(); }
  });

  const colors = COLORS[theme];

  useEffect(() => {
    localStorage.setItem('chronicle-theme', theme);
    document.body.style.background = colors.bg;
    document.body.style.color = colors.text;
  }, [theme, colors]);

  useEffect(() => {
    localStorage.setItem('chronicle-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const addTask = useCallback((task) => {
    setTasks(prev => [...prev, { ...task, id: uuidv4(), createdAt: new Date().toISOString(), completed: false, delayed: false, delayReason: '' }]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const completeTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t));
  }, []);

  const delayTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, delayed: true } : t));
  }, []);

  const completeDelayedTask = useCallback((id, reason) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true, delayed: true, delayReason: reason, completedAt: new Date().toISOString() } : t));
  }, []);

  const getTasksForDate = useCallback((dateStr) => {
    return tasks.filter(t => t.scheduledDate === dateStr).sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
  }, [tasks]);

  const checkAndMarkDelayed = useCallback(() => {
    const now = new Date();
    setTasks(prev => prev.map(t => {
      if (!t.completed && !t.delayed && t.scheduledTime) {
        const end = new Date(t.scheduledTime);
        end.setMinutes(end.getMinutes() + (t.duration || 30));
        if (end < now) return { ...t, delayed: true };
      }
      return t;
    }));
  }, []);

  useEffect(() => {
    checkAndMarkDelayed();
    const interval = setInterval(checkAndMarkDelayed, 60000);
    return () => clearInterval(interval);
  }, [checkAndMarkDelayed]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, colors, tasks, addTask, updateTask, deleteTask,
      completeTask, delayTask, completeDelayedTask, getTasksForDate,
      CATEGORIES, PRIORITY_COLORS
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
