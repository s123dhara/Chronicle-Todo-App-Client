import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { Button, EmptyState, Badge } from '../components/UI';
import TaskCard from '../components/TaskCard';

export default function Delayed() {
  const { colors, tasks } = useApp();
  const navigate = useNavigate();

  const pending = useMemo(() =>
    tasks.filter(t => t.delayed && !t.completed)
      .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)),
    [tasks]
  );
  const completed = useMemo(() =>
    tasks.filter(t => t.delayed && t.completed)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)),
    [tasks]
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: colors.text }}>Delayed Tasks</h1>
          <p style={{ fontSize: '14px', color: colors.textSub, marginTop: '4px' }}>
            Tasks that passed their scheduled time without completion
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/tasks')}>← All Tasks</Button>
      </div>

      {/* Info Banner */}
      <div style={{
        background: colors.warningBg, border: `1px solid ${colors.warning}40`, borderRadius: '12px',
        padding: '14px 18px', marginBottom: '24px', fontSize: '13px', color: colors.warning,
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ</span>
        <div>
          To mark a delayed task as complete, you must provide a reason for the delay.
          Click the checkbox on any delayed task to open the completion dialog.
        </div>
      </div>

      {/* Pending Delayed */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: colors.danger, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: colors.danger }} />
          Pending ({pending.length})
        </div>
        {pending.length === 0 ? (
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '14px' }}>
            <EmptyState icon="✦" title="No pending delayed tasks" subtitle="You're caught up! All delayed tasks have been resolved." />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pending.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        )}
      </div>

      {/* Completed Delayed */}
      {completed.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: colors.success, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: colors.success }} />
            Completed ({completed.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {completed.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        </div>
      )}
    </div>
  );
}
