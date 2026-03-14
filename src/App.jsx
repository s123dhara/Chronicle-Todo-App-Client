import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Tasks from './pages/Tasks.jsx';
import Delayed from './pages/Delayed.jsx';
import Calendar from './pages/Calender.jsx';
import AddTask from './pages/AddTask.jsx';
import EditTask from './pages/EditTask.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import './index.css';
import config from './config/index.js';

console.log('config : ', config);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Routes - No Auth Required */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes - Auth Required */}
            <Route path="/" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute><Layout><Tasks /></Layout></PrivateRoute>} />
            <Route path="/delayed" element={<PrivateRoute><Layout><Delayed /></Layout></PrivateRoute>} />
            <Route path="/calendar" element={<PrivateRoute><Layout><Calendar /></Layout></PrivateRoute>} />
            <Route path="/add" element={<PrivateRoute><Layout><AddTask /></Layout></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><Layout><EditTask /></Layout></PrivateRoute>} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
