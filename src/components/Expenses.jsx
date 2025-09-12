import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa'
import { useExpenseStore } from '../store/expenseStore'
import { useAuthStore } from '../store/authStore'

const Expenses = () => {
  const { expenses, isLoading, fetchExpenses, createExpense, deleteExpense } = useExpenseStore()
  const { hasPermission } = useAuthStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    category: 'Utilities',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'one-time'
  })

  useEffect(() => {
    if (hasPermission('expenses', 'read')) {
      fetchExpenses()
    }
  }, [fetchExpenses, hasPermission])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await createExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    })
    if (result.success) {
      setShowAddForm(false)
      setFormData({
        category: 'Utilities',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'one-time'
      })
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id)
    }
  }

  if (!hasPermission('expenses', 'read')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">You don't have permission to view expenses.</p>
        </div>
      </div>
    )
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyRecurring = expenses.filter(e => e.type === 'recurring').reduce((sum, expense) => sum + expense.amount, 0)

  const categories = ['Utilities', 'Maintenance', 'Supplies', 'Staff', 'Marketing', 'Other']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Expenses</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">₹{totalExpenses.toLocaleString()}</p>
          <span className="text-sm text-gray-500">This month</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Recurring Monthly</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">₹{monthlyRecurring.toLocaleString()}</p>
          <span className="text-sm text-gray-500">Fixed costs</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">One-time Expenses</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">₹{(totalExpenses - monthlyRecurring).toLocaleString()}</p>
          <span className="text-sm text-gray-500">Variable costs</span>
        </div>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Expense</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input 
                type="number" 
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input 
                type="text" 
                placeholder="Enter description"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input 
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Add Expense
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">No expenses found</td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{expense.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expense.type === 'recurring' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {expense.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {hasPermission('expenses', 'update') && (
                        <button className="text-blue-600 hover:text-blue-900">
                          <FaEdit />
                        </button>
                      )}
                      {hasPermission('expenses', 'delete') && (
                        <button 
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Expenses
