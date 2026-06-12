import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import PublicLayout from '@/components/layouts/PublicLayout'
import AdminLayout from '@/components/layouts/AdminLayout'
import Home from '@/pages/Home'
import Projects from '@/pages/Projects'
import Trainings from '@/pages/Trainings'
import Login from '@/pages/admin/Login'
import ResetPassword from '@/pages/admin/ResetPassword'
import Dashboard from '@/pages/admin/Dashboard'
import ManageProfile from '@/pages/admin/ManageProfile'
import ManageProjects from '@/pages/admin/ManageProjects'
import ManageTrainings from '@/pages/admin/ManageTrainings'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes inside PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/trainings" element={<Trainings />} />
        </Route>

        {/* Standalone Admin Login screen */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        {/* Protected Admin routes inside AdminLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/profile" element={<ManageProfile />} />
          <Route path="/admin/projects" element={<ManageProjects />} />
          <Route path="/admin/trainings" element={<ManageTrainings />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  )
}
