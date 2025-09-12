import { useEffect } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import AddStudent from './components/AddStudent'
import ManageStudents from './components/ManageStudents'
import SeatingView from './components/SeatingView'
import Expenses from './components/Expenses'
import Alerts from './components/Alerts'
import StudentPayments from './components/StudentPayments'
import AdminManagement from './components/AdminManagement'
import UserProfile from './components/UserProfile'

function App() {
  const { isAuthenticated, user, checkAuth, logout } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Library Management System</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {user?.role?.replace('_', ' ').toUpperCase()}
              </span>
              <Link
                to="/profile"
                className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/manage-students" element={<ManageStudents />} />
            <Route path="/seating" element={<SeatingView />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/student-payments" element={<StudentPayments />} />
            <Route path="/admin-management" element={<AdminManagement />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
