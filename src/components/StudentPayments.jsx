import React, { useEffect, useState } from 'react';
import { FaSearch, FaDownload, FaPlus } from 'react-icons/fa';
import { usePaymentStore } from '../store/paymentStore';
import { studentService } from '../services/studentService';

const StudentPayments = () => {
  const {
    payments,
    loading,
    fetchPayments,
    addPendingPayment,
    depositPayment,
    updatePayment,
    deletePayment
  } = usePaymentStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [students, setStudents] = useState([]);
  
  const [addFormData, setAddFormData] = useState({
    studentId: '',
    amount: '',
    month: '',
    year: new Date().getFullYear()
  });

  const [depositFormData, setDepositFormData] = useState({
    studentId: '',
    amount: '',
    month: '',
    year: new Date().getFullYear(),
    paymentType: 'cash'
  });

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, [fetchPayments]);

  const fetchStudents = async () => {
    try {
      const data = await studentService.getAll();
      console.log('Students data:', data); // Debug log
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPendingPayment({
        ...addFormData,
        year: parseInt(addFormData.year),
        amount: parseFloat(addFormData.amount)
      });
      setAddFormData({ studentId: '', amount: '', month: '', year: new Date().getFullYear() });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    try {
      await depositPayment({
        ...depositFormData,
        year: parseInt(depositFormData.year),
        amount: parseFloat(depositFormData.amount)
      });
      setDepositFormData({ studentId: '', amount: '', month: '', year: new Date().getFullYear(), paymentType: 'cash' });
      setShowDepositForm(false);
    } catch (error) {
      console.error('Error depositing payment:', error);
    }
  };

  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment(paymentId);
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const handleUpdateStatus = async (paymentId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
    try {
      await updatePayment(paymentId, { status: newStatus });
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredPayments = payments.filter(payment => {
    const studentName = payment.studentId?.name || '';
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.studentId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  if (loading) return <div className="p-4">Loading payments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Student Payments</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Pending</span>
          </button>
          <button 
            onClick={() => setShowDepositForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Deposit Payment</span>
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Expected</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalAmount.toLocaleString()}</p>
          <span className="text-sm text-gray-500">All payments</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Amount Collected</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{paidAmount.toLocaleString()}</p>
          <span className="text-sm text-gray-500">{totalAmount > 0 ? Math.round((paidAmount/totalAmount)*100) : 0}% collected</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Amount</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">₹{pendingAmount.toLocaleString()}</p>
          <span className="text-sm text-gray-500">Outstanding</span>
        </div>
      </div>

      {/* Add Pending Payment Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Add Pending Payment</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-2 gap-4">
            <select
              value={addFormData.studentId}
              onChange={(e) => setAddFormData({...addFormData, studentId: e.target.value})}
              className="border p-3 rounded-lg"
              required
            >
              <option value="">Select Student ({students.length} available)</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.email}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={addFormData.amount}
              onChange={(e) => setAddFormData({...addFormData, amount: e.target.value})}
              className="border p-3 rounded-lg"
              required
            />
            <select
              value={addFormData.month}
              onChange={(e) => setAddFormData({...addFormData, month: e.target.value})}
              className="border p-3 rounded-lg"
              required
            >
              <option value="">Select Month</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Year"
              value={addFormData.year}
              onChange={(e) => setAddFormData({...addFormData, year: e.target.value})}
              className="border p-3 rounded-lg"
              required
            />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Add Payment
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deposit Payment Form */}
      {showDepositForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Deposit Payment</h2>
          <form onSubmit={handleDepositSubmit} className="grid grid-cols-2 gap-4">
            <select
              value={depositFormData.studentId}
              onChange={(e) => setDepositFormData({...depositFormData, studentId: e.target.value})}
              className="border p-3 rounded-lg"
              required
            >
              <option value="">Select Student ({students.length} available)</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.email}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={depositFormData.amount}
              onChange={(e) => setDepositFormData({...depositFormData, amount: e.target.value})}
              className="border p-3 rounded-lg"
              required
            />
            <select
              value={depositFormData.month}
              onChange={(e) => setDepositFormData({...depositFormData, month: e.target.value})}
              className="border p-3 rounded-lg"
              required
            >
              <option value="">Select Month</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Year"
              value={depositFormData.year}
              onChange={(e) => setDepositFormData({...depositFormData, year: e.target.value})}
              className="border p-3 rounded-lg"
              required
            />
            <select
              value={depositFormData.paymentType}
              onChange={(e) => setDepositFormData({...depositFormData, paymentType: e.target.value})}
              className="border p-3 rounded-lg col-span-2"
              required
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Deposit Payment
              </button>
              <button
                type="button"
                onClick={() => setShowDepositForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or email..."
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No payments found. Add some payments to get started.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {payment.studentId?.name ? payment.studentId.name.split(' ').map(n => n[0]).join('') : 'N/A'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.studentId?.name || 'Unknown Student'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.studentId?.email || payment.studentId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{payment.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.month} {payment.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentType || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(payment._id, payment.status)}
                          className={`px-2 py-1 rounded text-sm ${
                            payment.status === 'pending' 
                              ? 'bg-green-500 text-white hover:bg-green-600' 
                              : 'bg-yellow-500 text-white hover:bg-yellow-600'
                          }`}
                        >
                          {payment.status === 'pending' ? 'Mark Paid' : 'Mark Pending'}
                        </button>
                        <button
                          onClick={() => handleDelete(payment._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
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
  );
};

export default StudentPayments;
