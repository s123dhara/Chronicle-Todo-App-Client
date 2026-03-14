import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { Button, Badge, EmptyState, Divider } from '../components/UI';
import TaskCard from '../components/TaskCard';

export default function Tasks() {
  const { colors, tasks, CATEGORIES } = useApp();
  const navigate = useNavigate();
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filterDate && t.scheduledDate !== filterDate) return false;
      if (filterCategory !== 'All' && t.category !== filterCategory) return false;
      if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
      if (filterStatus === 'Completed' && !t.completed) return false;
      if (filterStatus === 'Pending' && (t.completed || t.delayed)) return false;
      if (filterStatus === 'Delayed' && (!t.delayed || t.completed)) return false;
      return true;
    }).sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
  }, [tasks, filterDate, filterCategory, filterPriority, filterStatus]);

  // Group by time blocks
  const grouped = useMemo(() => {
    const groups = { morning: [], afternoon: [], evening: [], other: [] };
    filtered.forEach(t => {
      if (!t.scheduledTime) { groups.other.push(t); return; }
      const hr = new Date(t.scheduledTime).getHours();
      if (hr < 12) groups.morning.push(t);
      else if (hr < 17) groups.afternoon.push(t);
      else groups.evening.push(t);
    });
    return groups;
  }, [filtered]);

  const groupLabels = {
    morning: { label: 'Morning', icon: '◉', range: '12:00 AM – 11:59 AM' },
    afternoon: { label: 'Afternoon', icon: '◎', range: '12:00 PM – 4:59 PM' },
    evening: { label: 'Evening', icon: '◐', range: '5:00 PM – 11:59 PM' },
    other: { label: 'Unscheduled', icon: '◌', range: '' },
  };

  const FilterPill = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
      border: `1px solid ${active ? colors.accent : colors.border}`,
      background: active ? colors.accentBg : 'transparent',
      color: active ? colors.accent : colors.textSub, fontFamily: 'inherit', fontWeight: active ? 600 : 400,
      transition: 'all 0.18s ease', whiteSpace: 'nowrap',
    }}>{label}</button>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: colors.text }}>Task List</h1>
          <p style={{ fontSize: '14px', color: colors.textSub, marginTop: '4px' }}>
            {filtered.length} task{filtered.length !== 1 ? 's' : ''} · sorted by time
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/add')}>+ Add Task</Button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: colors.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>Date:</label>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{
            padding: '6px 12px', borderRadius: '10px', fontSize: '13px',
            background: colors.surfaceAlt, color: colors.text, border: `1px solid ${colors.border}`, fontFamily: 'inherit', cursor: 'pointer',
          }} />
          <button onClick={() => setFilterDate('')} style={{ fontSize: '12px', color: colors.textMuted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Clear date
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '4px' }}>Status:</span>
          {['All', 'Pending', 'Completed', 'Delayed'].map(s =>
            <FilterPill key={s} label={s} active={filterStatus === s} onClick={() => setFilterStatus(s)} />
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '4px' }}>Priority:</span>
          {['All', 'high', 'medium', 'low'].map(p =>
            <FilterPill key={p} label={p.charAt(0).toUpperCase() + p.slice(1)} active={filterPriority === p} onClick={() => setFilterPriority(p)} />
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '4px' }}>Category:</span>
          {['All', ...CATEGORIES].map(c =>
            <FilterPill key={c} label={c} active={filterCategory === c} onClick={() => setFilterCategory(c)} />
          )}
        </div>
      </div>

      {/* Task Groups */}
      {filtered.length === 0 ? (
        <EmptyState icon="◌" title="No tasks found" subtitle="Try adjusting your filters or add a new task"
          action={<Button variant="primary" onClick={() => navigate('/add')}>+ Add Task</Button>} />
      ) : (
        Object.entries(grouped).map(([key, groupTasks]) => {
          if (groupTasks.length === 0) return null;
          const grp = groupLabels[key];
          return (
            <div key={key} style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '16px' }}>{grp.icon}</span>
                <span style={{ fontSize: '15px', fontFamily: 'DM Serif Display', color: colors.text }}>{grp.label}</span>
                {grp.range && <span style={{ fontSize: '12px', color: colors.textMuted }}>{grp.range}</span>}
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: colors.textMuted }}>{groupTasks.length} task{groupTasks.length > 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '8px', borderLeft: `2px solid ${colors.border}` }}>
                {groupTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
