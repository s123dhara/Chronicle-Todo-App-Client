import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Input, Select, Card } from './UI';
import { format } from 'date-fns';

const DURATIONS = [
  { value: '15', label: '15 minutes' }, { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' }, { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' }, { value: '120', label: '2 hours' },
  { value: '180', label: '3 hours' },
];

export default function TaskForm({ existing }) {
  const { colors, addTask, updateTask, CATEGORIES, PRIORITY_COLORS } = useApp();
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().slice(0, 10);
  const nowTime = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const [form, setForm] = useState({
    title: existing?.title || '',
    category: existing?.category || 'Work',
    priority: existing?.priority || 'medium',
    scheduledDate: existing?.scheduledDate || todayStr,
    scheduledTime: existing?.scheduledTime ? existing.scheduledTime.slice(0, 16) : nowTime,
    duration: String(existing?.duration || 30),
    notes: existing?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.scheduledDate) e.scheduledDate = 'Date is required';
    if (!form.scheduledTime) e.scheduledTime = 'Time is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        priority: form.priority,
        scheduledDate: form.scheduledDate,
        scheduledTime: form.scheduledTime,
        duration: parseInt(form.duration),
        notes: form.notes.trim(),
      };
      if (existing) { await updateTask(existing.id, payload); }
      else { await addTask(payload); }
      navigate('/tasks');
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = ['low', 'medium', 'high'].map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }));
  const categoryOptions = CATEGORIES.map(c => ({ value: c, label: c }));

  const PriorityButton = ({ level }) => {
    const active = form.priority === level;
    const col = PRIORITY_COLORS[level]?.dark;
    return (
      <button onClick={() => set('priority', level)} type="button" style={{
        flex: 1, padding: '9px', borderRadius: '10px', border: `2px solid ${active ? col : colors.border}`,
        background: active ? `${col}15` : colors.surfaceAlt, color: active ? col : colors.textSub,
        cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize',
        transition: 'all 0.18s ease', fontFamily: 'inherit',
      }}>{level}</button>
    );
  };

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Title */}
        <div>
          <Input label="Task Title" value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="What needs to be done?" required />
          {errors.title && <div style={{ fontSize: '12px', color: colors.danger, marginTop: '4px' }}>{errors.title}</div>}
        </div>

        {/* Priority */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: colors.textSub, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>Priority</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <PriorityButton level="low" />
            <PriorityButton level="medium" />
            <PriorityButton level="high" />
          </div>
        </div>

        {/* Category */}
        <Select label="Category" value={form.category} onChange={e => set('category', e.target.value)} options={categoryOptions} />

        {/* Schedule */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <Input label="Date" type="date" value={form.scheduledDate} onChange={e => set('scheduledDate', e.target.value)} required />
            {errors.scheduledDate && <div style={{ fontSize: '12px', color: colors.danger, marginTop: '4px' }}>{errors.scheduledDate}</div>}
          </div>
          <div>
            <Input label="Start Time" type="time" value={form.scheduledTime?.slice(11, 16) || ''} onChange={e => {
              const timeVal = e.target.value;
              set('scheduledTime', `${form.scheduledDate}T${timeVal}`);
            }} required />
            {errors.scheduledTime && <div style={{ fontSize: '12px', color: colors.danger, marginTop: '4px' }}>{errors.scheduledTime}</div>}
          </div>
        </div>

        {/* Duration */}
        <Select label="Duration" value={form.duration} onChange={e => set('duration', e.target.value)} options={DURATIONS} />

        {/* Notes */}
        <Input label="Notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Any additional context..." multiline rows={3} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px', borderTop: `1px solid ${colors.border}` }}>
          <Button variant="secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⟳</span>
                {existing ? 'Saving...' : 'Adding...'}
              </>
            ) : (
              existing ? '✓ Save Changes' : '+ Add Task'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
