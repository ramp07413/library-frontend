import { 
  FaHome, 
  FaUserPlus, 
  FaUsers, 
  FaChair, 
  FaMoneyBillWave, 
  FaBell, 
  FaFileInvoiceDollar,
  FaGraduationCap,
  FaUserShield
} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const Sidebar = () => {
  const { user } = useAuthStore()
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/add-student', label: 'Add Student', icon: FaUserPlus },
    { path: '/manage-students', label: 'Manage Students', icon: FaUsers },
    { path: '/seating', label: 'Seating View', icon: FaChair },
    { path: '/expenses', label: 'Manage Expenses', icon: FaMoneyBillWave },
    { path: '/alerts', label: 'Alerts', icon: FaBell },
    // { path: '/student-payments', label: 'Student Payments', icon: FaFileInvoiceDollar },
  ]

  // Add admin management for admin and super_admin roles
  if (user?.role === 'admin' || user?.role === 'super_admin') {
    menuItems.push({
      path: '/admin-management',
      label: 'Admin Management',
      icon: FaUserShield
    })
  }

  return (
    <nav className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <FaGraduationCap className="text-2xl text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Admin Panel</span>
        </div>
        
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default Sidebar
