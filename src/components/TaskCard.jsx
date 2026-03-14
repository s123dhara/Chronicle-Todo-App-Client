import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Badge, Button, Modal, Input } from './UI';
import { format } from 'date-fns';

export default function TaskCard({ task, compact = false }) {
  const { colors, completeTask, delayTask, completeDelayedTask, deleteTask, PRIORITY_COLORS } = useApp();
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const priorityColor = PRIORITY_COLORS[task.priority]?.dark || colors.textSub;

  const getTimeLabel = () => {
    if (!task.scheduledTime) return null;
    const d = new Date(task.scheduledTime);
    return format(d, 'h:mm a');
  };

  const getEndTime = () => {
    if (!task.scheduledTime || !task.duration) return null;
    const d = new Date(task.scheduledTime);
    d.setMinutes(d.getMinutes() + task.duration);
    return format(d, 'h:mm a');
  };

  const isNow = () => {
    if (!task.scheduledTime) return false;
    const now = new Date();
    const start = new Date(task.scheduledTime);
    const end = new Date(task.scheduledTime);
    end.setMinutes(end.getMinutes() + (task.duration || 30));
    return now >= start && now <= end;
  };

  const handleComplete = () => {
    if (task.delayed && !task.completed) {
      setShowDelayModal(true);
    } else {
      completeTask(task.id);
    }
  };

  const handleDelayComplete = () => {
    if (!delayReason.trim()) return;
    completeDelayedTask(task.id, delayReason.trim());
    setShowDelayModal(false);
    setDelayReason('');
  };

  const statusColor = task.completed ? colors.success
    : task.delayed ? colors.danger
    : isNow() ? colors.accent
    : colors.textMuted;

  return (
    <>
      <div className="anim-fade" style={{
        background: colors.surface, border: `1px solid ${task.completed ? colors.success + '30' : task.delayed && !task.completed ? colors.danger + '30' : isNow() ? colors.accent + '30' : colors.border}`,
        borderLeft: `3px solid ${priorityColor}`,
        borderRadius: '14px', padding: compact ? '14px 16px' : '18px 20px',
        transition: 'all 0.2s ease', opacity: task.completed ? 0.65 : 1,
        display: 'flex', gap: '16px', alignItems: 'flex-start',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Live pulse indicator */}
        {isNow() && !task.completed && (
          <div style={{
            position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px',
            borderRadius: '50%', background: colors.accent,
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        )}

        {/* Checkbox */}
        <button onClick={handleComplete} disabled={task.completed} style={{
          width: '22px', height: '22px', borderRadius: '7px', flexShrink: 0, marginTop: '1px',
          border: `2px solid ${task.completed ? colors.success : statusColor}`,
          background: task.completed ? colors.success : 'transparent', cursor: task.completed ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s ease',
        }}>
          {task.completed && <span style={{ color: '#fff', fontSize: '13px', lineHeight: 1 }}>✓</span>}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '15px', fontWeight: 500, color: task.completed ? colors.textMuted : colors.text, textDecoration: task.completed ? 'line-through' : 'none', wordBreak: 'break-word' }}>
              {task.title}
            </span>
            {isNow() && !task.completed && <Badge color={colors.accent}>Now</Badge>}
            {task.delayed && !task.completed && <Badge color={colors.danger}>Delayed</Badge>}
            {task.completed && <Badge color={colors.success}>Done</Badge>}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {getTimeLabel() && (
              <span style={{ fontSize: '12px', color: colors.textSub, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ opacity: 0.6 }}>◷</span>
                {getTimeLabel()}{getEndTime() ? ` – ${getEndTime()}` : ''}
                {task.duration && <span style={{ color: colors.textMuted }}>({task.duration}m)</span>}
              </span>
            )}
            {task.category && <Badge color={colors.info}>{task.category}</Badge>}
            <Badge color={priorityColor}>{task.priority}</Badge>
          </div>

          {task.notes && !compact && (
            <div style={{ marginTop: '8px', fontSize: '13px', color: colors.textMuted, fontStyle: 'italic' }}>
              {task.notes}
            </div>
          )}

          {task.delayed && task.delayReason && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: colors.warning, background: colors.warningBg, padding: '6px 10px', borderRadius: '8px' }}>
              Reason: {task.delayReason}
            </div>
          )}

          {task.completedAt && (
            <div style={{ marginTop: '6px', fontSize: '11px', color: colors.textMuted }}>
              Completed at {format(new Date(task.completedAt), 'h:mm a, MMM d')}
            </div>
          )}
        </div>

        {/* Actions */}
        {!compact && (
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button onClick={() => navigate(`/edit/${task.id}`)} style={{
              width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: colors.surfaceAlt, border: `1px solid ${colors.border}`, cursor: 'pointer', color: colors.textSub, fontSize: '14px',
              transition: 'all 0.18s ease',
            }}>✎</button>
            <button onClick={() => setShowConfirm(true)} style={{
              width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: colors.dangerBg, border: `1px solid ${colors.danger}30`, cursor: 'pointer', color: colors.danger, fontSize: '14px',
              transition: 'all 0.18s ease',
            }}>✕</button>
          </div>
        )}
      </div>

      {/* Delay Complete Modal */}
      <Modal isOpen={showDelayModal} onClose={() => setShowDelayModal(false)} title="Complete Delayed Task">
        <p style={{ fontSize: '14px', color: colors.textSub, marginBottom: '20px' }}>
          This task was delayed. Please provide a reason for the delay before marking it complete.
        </p>
        <Input
          label="Reason for delay *"
          value={delayReason}
          onChange={e => setDelayReason(e.target.value)}
          placeholder="e.g., Meeting ran over, needed more time for research..."
          multiline
          rows={3}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setShowDelayModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleDelayComplete} disabled={!delayReason.trim()}>
            ✓ Mark Complete
          </Button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Delete Task" width="360px">
        <p style={{ fontSize: '14px', color: colors.textSub, marginBottom: '20px' }}>
          Are you sure you want to delete "<strong>{task.title}</strong>"? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => { deleteTask(task.id); setShowConfirm(false); }}>Delete</Button>
        </div>
      </Modal>
    </>
  );
}
