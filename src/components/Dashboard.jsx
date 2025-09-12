import { useEffect } from 'react';
import { FaUsers, FaChair, FaMoneyBillWave, FaExclamationCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { Line, Doughnut } from 'react-chartjs-2'
import { useDashboardStore } from '../store/dashboardStore';
import { useAuthStore } from '../store/authStore';
import AuthDebug from './AuthDebug';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);



const Dashboard = () => {
  const { stats, isLoading, fetchDashboardData } = useDashboardStore();
  const { hasPermission } = useAuthStore();

  useEffect(() => {
    if (hasPermission('dashboard', 'read')) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, hasPermission]);

  if (!hasPermission('dashboard', 'read')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">You don't have permission to view the dashboard.</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Students',
      value: stats.totalStudents || '0',
      change: '+12%',
      positive: true,
      icon: FaUsers,
      color: 'blue',
      path : '/manage-students'
    },
    {
      title: 'Available Seats',
      value: stats.availableSeats || '0',
      change: '-5%',
      positive: false,
      icon: FaChair,
      color: 'green',
      path : '/seating'
    },
    {
      title: 'Occupied Seats',
      value: stats.occupiedSeats || '0',
      change: '+8%',
      positive: true,
      icon: FaChair,
      color: 'red',
      path : '/seating'
    },
    {
      title: 'Active Students',
      value: stats.activeStudents || '0',
      change: '+3%',
      positive: true,
      icon: FaExclamationCircle,
      color: 'orange',
      path : '/manage-students'
    }
  ]

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [stats.monthlyRevenue || 0, stats.monthlyRevenue * 0.9 || 0, stats.monthlyRevenue * 1.2 || 0, stats.monthlyRevenue * 1.1 || 0, stats.monthlyRevenue * 0.8 || 0, stats.monthlyRevenue || 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    }
  }

  const distributionData = {
    labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
    datasets: [
      {
        label: 'Students',
        data: [45, 35, 50, 26],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  const distributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  const activities = [
    { id: 1, action: 'New student registration', student: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Payment received', student: 'Jane Smith', time: '4 hours ago' },
    { id: 3, action: 'Seat assignment updated', student: 'Mike Johnson', time: '6 hours ago' },
    { id: 4, action: 'Late payment reminder sent', student: 'Sarah Wilson', time: '1 day ago' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
                <Link to={stat.path}>
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'purple' ? 'bg-purple-100' : 'bg-red-100'
                }`}>
                  <Icon className={`text-xl ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' : 'text-red-600'
                  }`} />
                </div>
                {stat.change && (
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.positive ? 'text-green-600' : stat.positive === false ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <span>{stat.change}</span>
                    {stat.positive === true && <FaArrowUp />}
                    {stat.positive === false && <FaArrowDown />}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
                </Link>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-80">
            <Line data={revenueData} options={revenueOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Timing Distribution</h3>
          <div className="h-80">
            <Doughnut data={distributionData} options={distributionOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.student}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
