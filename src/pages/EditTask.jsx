import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TaskForm from '../components/TaskForm';
import { Button } from '../components/UI';

export default function EditTask() {
  const { id } = useParams();
  const { colors, tasks } = useApp();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === id || t._id === id);

  if (!task) {
    return (
      <div style={{ padding: '32px', maxWidth: '640px' }}>
        <div style={{ color: colors.danger, fontSize: '16px', marginBottom: '16px' }}>Task not found.</div>
        <Button variant="secondary" onClick={() => navigate('/tasks')}>← Back to Tasks</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', color: colors.text }}>Edit Task</h1>
        <p style={{ fontSize: '14px', color: colors.textSub, marginTop: '4px' }}>
          Modify details or reschedule to a different date
        </p>
      </div>
      <TaskForm existing={task} />
    </div>
  );
}
