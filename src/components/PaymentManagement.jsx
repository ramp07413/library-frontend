import React, { useEffect, useState } from 'react';
import { usePaymentStore } from '../store/paymentStore';

const PaymentManagement = () => {
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
  const [selectedPayment, setSelectedPayment] = useState(null);
  
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
  }, [fetchPayments]);

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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) return <div className="p-4">Loading payments...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Pending Payment
          </button>
          <button
            onClick={() => setShowDepositForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Deposit Payment
          </button>
        </div>
      </div>

      {/* Add Pending Payment Form */}
      {showAddForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Add Pending Payment</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Student ID"
              value={addFormData.studentId}
              onChange={(e) => setAddFormData({...addFormData, studentId: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={addFormData.amount}
              onChange={(e) => setAddFormData({...addFormData, amount: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <select
              value={addFormData.month}
              onChange={(e) => setAddFormData({...addFormData, month: e.target.value})}
              className="border p-2 rounded"
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
              className="border p-2 rounded"
              required
            />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Add Payment
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deposit Payment Form */}
      {showDepositForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Deposit Payment</h2>
          <form onSubmit={handleDepositSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Student ID"
              value={depositFormData.studentId}
              onChange={(e) => setDepositFormData({...depositFormData, studentId: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={depositFormData.amount}
              onChange={(e) => setDepositFormData({...depositFormData, amount: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <select
              value={depositFormData.month}
              onChange={(e) => setDepositFormData({...depositFormData, month: e.target.value})}
              className="border p-2 rounded"
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
              className="border p-2 rounded"
              required
            />
            <select
              value={depositFormData.paymentType}
              onChange={(e) => setDepositFormData({...depositFormData, paymentType: e.target.value})}
              className="border p-2 rounded col-span-2"
              required
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Deposit Payment
              </button>
              <button
                type="button"
                onClick={() => setShowDepositForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Month/Year</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment Type</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No payments found. Add some payments to get started.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="border-t">
                    <td className="px-4 py-3">
                      {payment.studentId?.name || payment.studentId}
                    </td>
                    <td className="px-4 py-3">${payment.amount}</td>
                    <td className="px-4 py-3">{payment.month} {payment.year}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{payment.paymentType || '-'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
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

export default PaymentManagement;
