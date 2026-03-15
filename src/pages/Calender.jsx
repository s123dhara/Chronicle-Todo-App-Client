import React, { useState, useMemo, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths, getDay } from 'date-fns';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button, EmptyState } from '../components/UI';
import TaskCard from '../components/TaskCard';
import config from '../config';



export default function Calendar() {
  const { colors, tasks, PRIORITY_COLORS } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);



  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const taskMap = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (!map[t.scheduledDate]) map[t.scheduledDate] = [];
      map[t.scheduledDate].push(t);
    });
    return map;
  }, [tasks]);

  // const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  // const selectedTasks = useMemo(() =>
  //   (taskMap[selectedDateStr] || []).sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)),
  //   [taskMap, selectedDateStr]
  // );


  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const fetchTasksForDate = async () => {
    setLoadingTasks(true);
    try {
      const token = localStorage.getItem(config.auth.tokenKey);
      const response = await fetch(`${config.api.baseURL}/tasks/by-date/${selectedDateStr}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const result = await response.json();

        // Wait 500ms before showing results
        await new Promise(resolve => setTimeout(resolve, 500));

        setSelectedTasks(result.data.tasks.map(task => ({
          ...task,
          id: task._id || task.id,
        })).sort((a, b) => 
          new Date(a.scheduledTime) - new Date(b.scheduledTime)
        ));
      }
    } catch (error) {
      console.error('Error:', error);
      setSelectedTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasksForDate();
  }, [selectedDateStr]);


  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDow = getDay(days[0]);

  const getDayMeta = (d) => {
    const str = format(d, 'yyyy-MM-dd');
    const dayTasks = taskMap[str] || [];
    const completed = dayTasks.filter(t => t.completed).length;
    const delayed = dayTasks.filter(t => t.delayed && !t.completed).length;
    const pending = dayTasks.filter(t => !t.completed && !t.delayed).length;
    return { total: dayTasks.length, completed, delayed, pending };
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1700px' }} className="cal-container">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', color: colors.text }}>Calendar</h1>
        <p style={{ fontSize: '14px', color: colors.textSub, marginTop: '4px' }}>
          Browse tasks by date. Click any day to see its tasks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }} className="cal-grid">
        {/* Calendar */}
        <Card style={{ padding: '24px' }}>
          {/* Month nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} style={{
              width: '36px', height: '36px', borderRadius: '10px', background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
              cursor: 'pointer', color: colors.textSub, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>‹</button>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: '20px', color: colors.text }}>
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} style={{
              width: '36px', height: '36px', borderRadius: '10px', background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
              cursor: 'pointer', color: colors.textSub, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>›</button>
          </div>

          {/* Today button */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <button onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} style={{
              padding: '6px 16px', borderRadius: '20px', background: colors.accentBg, border: `1px solid ${colors.accent}40`,
              color: colors.accent, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>Go to Today</button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {weekdays.map(w => (
              <div key={w} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: colors.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 0' }}>
                {w}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {/* Empty cells for start day */}
            {Array.from({ length: startDow }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => {
              const str = format(day, 'yyyy-MM-dd');
              const meta = getDayMeta(day);
              const selected = isSameDay(day, selectedDate);
              const today = isToday(day);
              return (
                <button key={str} onClick={() => setSelectedDate(day)} style={{
                  aspectRatio: '1', borderRadius: '10px', cursor: 'pointer', position: 'relative',
                  background: selected ? colors.accent : today ? colors.accentBg : 'transparent',
                  border: `1px solid ${selected ? colors.accent : today ? colors.accent + '50' : colors.border}`,
                  transition: 'all 0.18s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                  minHeight: '42px',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: today ? 700 : 400, color: selected ? '#0d0d0f' : today ? colors.accent : colors.text }}>
                    {format(day, 'd')}
                  </span>
                  {meta.total > 0 && (
                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                      {meta.pending > 0 && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: selected ? '#0d0d0f' : colors.info }} />}
                      {meta.completed > 0 && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: selected ? '#0d0d0f' : colors.success }} />}
                      {meta.delayed > 0 && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: selected ? '#0d0d0f' : colors.danger }} />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px', borderTop: `1px solid ${colors.border}`, paddingTop: '14px' }}>
            {[
              { color: colors.info, label: 'Pending' },
              { color: colors.success, label: 'Done' },
              { color: colors.danger, label: 'Delayed' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: colors.textSub }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </Card>

        {/* Selected Day Tasks */}
        <div>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontFamily: 'DM Serif Display', color: colors.text }}>
                {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}
              </div>
              <div style={{ fontSize: '12px', color: colors.textMuted }}>{format(selectedDate, 'MMMM d, yyyy')}</div>
            </div>
            <Badge color={colors.accent}>{selectedTasks.length} tasks</Badge>
          </div>

          {loadingTasks ? (
              <Card style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: `3px solid ${colors.border}`,
                  borderTop: `3px solid ${colors.accent}`,
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 12px',
                }} />
                <div style={{ fontSize: '13px', color: colors.textMuted }}>Loading tasks...</div>
              </Card>
            ) : selectedTasks.length === 0 ? (
            <Card>
              <EmptyState icon="◌" title="No tasks" subtitle="Nothing scheduled for this day" />
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedTasks.map(task => (
                <TaskCard key={task._id || task.id} task={task} compact onUpdate={fetchTasksForDate} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cal-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 430px) {
            .cal-container { padding: 16px !important; }
            .cal-grid { gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}
