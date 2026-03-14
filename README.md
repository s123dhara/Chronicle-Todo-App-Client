# Chronicle — Task Manager

A modern, full-featured React.js todo application with dark/light themes.

## Features

- **Smart Task Status** — Tasks auto-move to "Delayed" when time passes. Complete delayed tasks by providing a reason.
- **Dashboard** — Shows current active task + next upcoming task at a glance.
- **Calendar View** — Navigate any month, click a day to see its tasks with color-coded dots.
- **Timetable Listing** — Tasks grouped by Morning / Afternoon / Evening with filters.
- **Theme Toggle** — Dark/light mode with a warm, editorial color palette.
- **React Router** — 6 distinct pages: Dashboard, All Tasks, Delayed, Calendar, Add Task, Edit Task.
- **Edit & Reschedule** — Full edit form with date picker to reschedule any task.
- **Persistent Storage** — All tasks saved to localStorage.

## Setup

```bash
npm install
npm start
```

## Pages

| Route | Page |
|-------|------|
| `/` | Dashboard — current & next task, stats |
| `/tasks` | All Tasks — timetable with filters |
| `/delayed` | Delayed — tasks needing attention + reason |
| `/calendar` | Calendar — month view with task dots |
| `/add` | Add Task — create new task |
| `/edit/:id` | Edit Task — modify or reschedule |

## Tech Stack

- React 18
- React Router 6
- date-fns
- uuid
- Google Fonts: DM Serif Display + DM Sans
- No other UI library — 100% custom components

## Project Structure

```
src/
  context/
    AppContext.js     # Global state: tasks, theme, CRUD operations
  components/
    Layout.js         # Sidebar nav (desktop) + mobile bottom nav + drawer
    TaskCard.js       # Individual task with complete/delay/edit/delete
    TaskForm.js       # Add/Edit form with validation
    UI.js             # Button, Input, Select, Modal, Card, Badge, etc.
  pages/
    Home.js           # Dashboard
    Tasks.js          # All Tasks listing
    Delayed.js        # Delayed tasks
    Calendar.js       # Calendar view
    AddTask.js        # Add task page
    EditTask.js       # Edit task page
  index.css           # Global styles + animations
  App.js              # Router setup
  index.js            # Entry point
```
