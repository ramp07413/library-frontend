import { useState, useEffect } from 'react'
import { FaSearch, FaDownload, FaEye, FaEdit, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { usePaymentStore } from '../store/paymentStore'
import { useAuthStore } from '../store/authStore'

const StudentPayments = () => {
  const { payments, stats, isLoading, filters, setFilters, fetchPayments, fetchPaymentStats, updatePaymentStatus } = usePaymentStore()
  const { hasPermission } = useAuthStore()

  useEffect(() => {
    if (hasPermission('payments', 'read')) {
      fetchPayments()
      fetchPaymentStats()
    }
  }, [fetchPayments, fetchPaymentStats, hasPermission])

  const handleStatusUpdate = async (id, status) => {
    await updatePaymentStatus(id, { status })
  }

  if (!hasPermission('payments', 'read')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">You don't have permission to view payments.</p>
        </div>
      </div>
    )
  }

  // const payments = [
  //   {
  //     id: 1,
  //     studentName: 'John Doe',
  //     studentId: 'STU001',
  //     amount: 2500,
  //     dueDate: '2024-09-15',
  //     paidDate: '2024-09-10',
  //     status: 'paid',
  //     method: 'UPI'
  //   },
  //   {
  //     id: 2,
  //     studentName: 'Jane Smith',
  //     studentId: 'STU002',
  //     amount: 3000,
  //     dueDate: '2024-09-15',
  //     paidDate: null,
  //     status: 'pending',
  //     method: null
  //   },
  //   {
  //     id: 3,
  //     studentName: 'Mike Johnson',
  //     studentId: 'STU003',
  //     amount: 2500,
  //     dueDate: '2024-09-10',
  //     paidDate: null,
  //     status: 'overdue',
  //     method: null
  //   },
  //   {
  //     id: 4,
  //     studentName: 'Sarah Wilson',
  //     studentId: 'STU004',
  //     amount: 3500,
  //     dueDate: '2024-09-20',
  //     paidDate: '2024-09-18',
  //     status: 'paid',
  //     method: 'Cash'
  //   }
  // ]

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0)
  const pendingAmount = totalAmount - paidAmount

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          <FaCheckCircle className="mr-1" /> Paid
        </span>
      case 'overdue':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          <FaExclamationCircle className="mr-1" /> Overdue
        </span>
      default:
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <FaExclamationCircle className="mr-1" /> Pending
        </span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Student Payments</h1>
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <FaDownload />
          <span>Export Report</span>
        </button>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Expected</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalAmount.toLocaleString()}</p>
          <span className="text-sm text-gray-500">This month</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Amount Collected</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{paidAmount.toLocaleString()}</p>
          <span className="text-sm text-gray-500">{Math.round((paidAmount/totalAmount)*100)}% collected</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Amount</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">₹{pendingAmount.toLocaleString()}</p>
          <span className="text-sm text-gray-500">Outstanding</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {payment.studentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                        <div className="text-sm text-gray-500">{payment.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.method || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaEye />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudentPayments
