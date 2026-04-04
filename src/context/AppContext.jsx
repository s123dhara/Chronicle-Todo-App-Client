import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import config from '../config';

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

// const API_BASE = 'http://localhost:5000/api/v1';
const API_BASE = config.api.baseURL

const getToken = () => localStorage.getItem('chronicle-access-token');

const setTokens = (access, refresh) => {
  localStorage.setItem('chronicle-access-token', access);
  localStorage.setItem('chronicle-refresh-token', refresh);
};

const authFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: localStorage.getItem('chronicle-refresh-token') }),
    });
    if (refreshRes.ok) {
      const { data } = await refreshRes.json();
      setTokens(data.accessToken, data.refreshToken);
      return authFetch(path, options);
    }
    localStorage.removeItem('chronicle-access-token');
    localStorage.removeItem('chronicle-refresh-token');
    localStorage.removeItem('chronicle-user');
    window.location.href = '/login';
    return null;
  }

  return res.json();
};

// Normalize backend task (_id → id) so components work unchanged
const normalizeTask = (task) => ({
  ...task,
  id: task._id || task.id,
});

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('chronicle-theme') || 'dark');
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  const colors = COLORS[theme];

  useEffect(() => {
    localStorage.setItem('chronicle-theme', theme);
    document.body.style.background = colors.bg;
    document.body.style.color = colors.text;
  }, [theme, colors]);

  // Fetch tasks on mount if already logged in (page refresh case)
  useEffect(() => {
    if (getToken()) {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    setTasksLoading(true);
    const data = await authFetch('/tasks?limit=100&sortBy=scheduledTime&order=asc');
    if (data?.data?.tasks) {
      setTasks(data.data.tasks.map(normalizeTask));
    }
    setTasksLoading(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (getToken()) {
      authFetch('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ theme: newTheme }),
      }).catch(() => {});
    }
  };

  const addTask = async (payload) => {
    const data = await authFetch('/tasks', { method: 'POST', body: JSON.stringify(payload) });
    if (data?.data?.task) {
      setTasks(prev => [...prev, normalizeTask(data.data.task)]);
    }
  };

  const updateTask = async (id, updates) => {
    const data = await authFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    if (data?.data?.task) {
      setTasks(prev => prev.map(t => t.id === id ? normalizeTask(data.data.task) : t));
    }
  };

  const deleteTask = async (id) => {
    await authFetch(`/tasks/${id}`, { method: 'DELETE' });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completeTask = async (id) => {
    const data = await authFetch(`/tasks/${id}/complete`, { method: 'PATCH' });
    if (data?.data?.task) {
      setTasks(prev => prev.map(t => t.id === id ? normalizeTask(data.data.task) : t));
    }
  };

  const delayTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, delayed: true } : t));
  }, []);

  const completeDelayedTask = async (id, reason) => {
    const data = await authFetch(`/tasks/${id}/complete-delayed`, {
      method: 'PATCH',
      body: JSON.stringify({ delayReason: reason }),
    });
    if (data?.data?.task) {
      setTasks(prev => prev.map(t => t.id === id ? normalizeTask(data.data.task) : t));
    }
  };

  const getTasksForDate = useCallback((dateStr) => {
    return tasks
      .filter(t => t.scheduledDate === dateStr)
      .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
  }, [tasks]);

  // Local delay detection — keeps UI in sync between API calls
  const checkAndMarkDelayed = useCallback(() => {
    const now = new Date();
    setTasks(prev => prev.map(t => {
      if (!t.completed && !t.delayed && t.scheduledTime) {
        const end = new Date(t.scheduledTime);
        end.setMinutes(end.getMinutes() + (t.duration || 30));
        console.log(`t: ${t.title}, end: ${end}, now: ${now}`)
        console.log(
          `Delayed? ${!t.completed && !t.delayed && t.scheduledTime && end < now}`
        )
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
      theme, toggleTheme, colors, tasks, tasksLoading, fetchTasks,
      addTask, updateTask, deleteTask,
      completeTask, delayTask, completeDelayedTask, getTasksForDate,
      CATEGORIES, PRIORITY_COLORS,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
