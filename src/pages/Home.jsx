import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isToday } from 'date-fns';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge, ProgressRing, EmptyState } from '../components/UI';
import TaskCard from '../components/TaskCard';

function PageHeader({ colors, title, subtitle }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h1 style={{ fontSize: '28px', color: colors.text, marginBottom: '4px' }}>{title}</h1>
      <p style={{ fontSize: '14px', color: colors.textSub }}>{subtitle}</p>
    </div>
  );
}

export default function Home() {
  const { colors, tasks } = useApp();
  const navigate = useNavigate();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const todayTasks = useMemo(() =>
    tasks.filter(t => t.scheduledDate === todayStr)
      .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)),
    [tasks, todayStr]
  );

  const completedToday = todayTasks.filter(t => t.completed).length;
  const delayedToday = todayTasks.filter(t => t.delayed && !t.completed).length;
  const pendingToday = todayTasks.filter(t => !t.completed && !t.delayed).length;

  const currentTask = useMemo(() => {
    return todayTasks.find(t => {
      if (t.completed || t.delayed) return false;
      const start = new Date(t.scheduledTime);
      const end = new Date(t.scheduledTime);
      end.setMinutes(end.getMinutes() + (t.duration || 30));
      return now >= start && now <= end;
    });
  }, [todayTasks, now]);

  const nextTask = useMemo(() => {
    return todayTasks.find(t => {
      if (t.completed || t.delayed || t === currentTask) return false;
      const start = new Date(t.scheduledTime);
      return start > now;
    });
  }, [todayTasks, now, currentTask]);

  const allDelayed = tasks.filter(t => t.delayed && !t.completed);

  const StatCard = ({ label, value, color, icon, onClick }) => (
    <div onClick={onClick} style={{
      background: colors.surface, border: `1px solid ${colors.border}`,
      borderRadius: '16px', padding: '20px', cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease', flex: '1 1 140px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: color || colors.text, fontFamily: 'DM Serif Display' }}>{value}</div>
          <div style={{ fontSize: '13px', color: colors.textSub, marginTop: '2px' }}>{label}</div>
        </div>
        <div style={{ fontSize: '24px', opacity: 0.5 }}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1800px' }}>
      <PageHeader colors={colors}
        title={`Good ${now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'} ✦`}
        subtitle={format(now, "EEEE, MMMM d, yyyy")}
      />

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <StatCard label="Today's Tasks" value={todayTasks.length} color={colors.accent} icon="◻" />
        <StatCard label="Completed" value={completedToday} color={colors.success} icon="✓" />
        <StatCard label="Pending" value={pendingToday} color={colors.info} icon="◷" />
        <StatCard label="Delayed" value={delayedToday + allDelayed.filter(t => t.scheduledDate !== todayStr).length} color={colors.danger} icon="!" onClick={() => navigate('/delayed')} />
      </div>

      {/* Progress */}
      {todayTasks.length > 0 && (
        <Card style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <ProgressRing value={completedToday} max={todayTasks.length} size={72} />
          <div>
            <div style={{ fontSize: '18px', fontFamily: 'DM Serif Display', color: colors.text }}>
              Today's Progress
            </div>
            <div style={{ fontSize: '14px', color: colors.textSub, marginTop: '4px' }}>
              {completedToday} of {todayTasks.length} tasks done
              {delayedToday > 0 && <span style={{ color: colors.danger }}> · {delayedToday} delayed</span>}
            </div>
          </div>
          <Button style={{ marginLeft: 'auto' }} variant="secondary" onClick={() => navigate('/tasks')}>View All →</Button>
        </Card>
      )}

      {/* Current & Next Task */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Current Task */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: colors.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: colors.accent, animation: 'pulse 2s ease-in-out infinite' }} />
            Current Task
          </div>
          {currentTask ? (
            <TaskCard task={currentTask} />
          ) : (
            <Card>
              <EmptyState icon="◑" title="No active task" subtitle="Nothing scheduled for this time slot" />
            </Card>
          )}
        </div>

        {/* Next Task */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: colors.textSub, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
            ▷ Up Next
          </div>
          {nextTask ? (
            <TaskCard task={nextTask} />
          ) : (
            <Card>
              <EmptyState icon="✦" title="No upcoming tasks" subtitle="You're all caught up for today!" />
            </Card>
          )}
        </div>
      </div>

      {/* Delayed alert */}
      {allDelayed.length > 0 && (
        <div onClick={() => navigate('/delayed')} style={{
          background: colors.dangerBg, border: `1px solid ${colors.danger}40`, borderRadius: '14px',
          padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
          transition: 'all 0.18s ease', marginBottom: '28px',
        }}>
          <span style={{ fontSize: '24px' }}>⚠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: colors.danger, marginBottom: '2px' }}>
              {allDelayed.length} delayed task{allDelayed.length > 1 ? 's' : ''} need attention
            </div>
            <div style={{ fontSize: '13px', color: colors.textSub }}>
              Click to review and complete with reason
            </div>
          </div>
          <span style={{ color: colors.danger, fontSize: '18px' }}>→</span>
        </div>
      )}

      {/* Quick add */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant="primary" onClick={() => navigate('/add')}>+ Add Task</Button>
        <Button variant="secondary" onClick={() => navigate('/calendar')}>◫ Calendar View</Button>
        <Button variant="secondary" onClick={() => navigate('/tasks')}>◻ All Tasks</Button>
      </div>
    </div>
  );
}
