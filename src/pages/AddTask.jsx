// import React from 'react';
// import { useApp } from '../context/AppContext';
// import TaskForm from '../components/TaskForm';

// export default function AddTask() {
//   const { colors } = useApp();
//   return (
//     <div style={{ padding: '32px', maxWidth: '640px' }}>
//       <div style={{ marginBottom: '28px' }}>
//         <h1 style={{ fontSize: '28px', color: colors.text }}>Add Task</h1>
//         <p style={{ fontSize: '14px', color: colors.textSub, marginTop: '4px' }}>Schedule a new task with time and priority</p>
//       </div>
//       <TaskForm />
//     </div>
//   );
// }


import React from 'react';
import { useApp } from '../context/AppContext';
import TaskForm from '../components/TaskForm';

export default function AddTask() {
  const { colors } = useApp();
  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', color: colors.text }}>Add Task</h1>
        <p style={{ fontSize: '14px', color: colors.textSub, marginTop: '4px' }}>Schedule a new task with time and priority</p>
      </div>
      <TaskForm />
    </div>
  );
}
