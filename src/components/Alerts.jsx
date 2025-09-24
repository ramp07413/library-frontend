import { useEffect } from 'react'
import { FaBell, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimes } from 'react-icons/fa'
import { useAlertStore } from '../store/alertStore'
import { useAuthStore } from '../store/authStore'

const Alerts = () => {
  const { alerts, isLoading, fetchAlerts, markAsRead, markAllAsRead,DeleteAlert } = useAlertStore()
  const { hasPermission } = useAuthStore()


  useEffect(() => {
    if (hasPermission('alerts', 'read')) {
      fetchAlerts()
    }
  }, [fetchAlerts, hasPermission])

  const handleMarkAsRead = async (id) => {
    const data=await markAsRead(id)
    console.log(data)
  }
  
  const handleMarkAllAsRead = async () => {
    const value=await markAllAsRead()
  }

  const handleDeleteAlert = async () =>{
    const del= await DeleteAlert()
  }

  if (!hasPermission('alerts', 'read')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">You don't have permission to view alerts.</p>
        </div>
      </div>
    )
  }
  //   {
  //     id: 3,
  //     type: 'success',
  //     title: 'Payment Received',
  //     message: 'Mike Johnson has paid ₹3,000 for this month',
  //     time: '6 hours ago',
  //     read: true
  //   },
  //   {
  //     id: 4,
  //     type: 'error',
  //     title: 'System Maintenance',
  //     message: 'Scheduled maintenance will occur tonight at 2 AM',
  //     time: '1 day ago',
  //     read: true
  //   }
  // ]

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />
      case 'error': return <FaExclamationTriangle className="text-red-500" />
      case 'success': return <FaCheckCircle className="text-green-500" />
      default: return <FaInfoCircle className="text-blue-500" />
    }
  }

  const getAlertBg = (type, read) => {
    const opacity = read ? 'bg-opacity-50' : 'bg-opacity-100'
    switch (type) {
      case 'warning': return `bg-yellow-50 border-yellow-200 ${opacity}`
      case 'error': return `bg-red-50 border-red-200 ${opacity}`
      case 'success': return `bg-green-50 border-green-200 ${opacity}`
      default: return `bg-blue-50 border-blue-200 ${opacity}`
    }
  }

  const unreadCount = alerts.filter(alert => !alert.read).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button onClick={()=>markAllAsRead()} className="text-blue-600 hover:text-blue-800 font-medium">
          Mark all as read
        </button>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Alerts</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{alerts.length}</p>
            </div>
            <FaBell className="text-2xl text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Unread</h3>
              <p className="text-2xl font-bold text-red-600 mt-1">{unreadCount}</p>
            </div>
            <FaExclamationTriangle className="text-2xl text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Warnings</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {alerts.filter(a => a.type === 'warning').length}
              </p>
            </div>
            <FaExclamationTriangle className="text-2xl text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Success</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {alerts.filter(a => a.type === 'success').length}
              </p>
            </div>
            <FaCheckCircle className="text-2xl text-green-400" />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <div
              onClick={markAsRead(alert._id)}
              key={alert.id}
              className={`p-6 border-l-4 ${getAlertBg(alert.type, alert.read)} ${
                !alert.read ? 'font-medium' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-gray-700 mb-2">{alert.message}</p>
                    <span className="text-sm text-gray-500">{alert.time}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!alert.read && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                  <button onClick={()=>DeleteAlert(alert._id)} disabled={isLoading} className="text-gray-400 hover:text-gray-600">
                    <FaTimes />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Alerts
