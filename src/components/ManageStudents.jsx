import { useState, useEffect } from 'react'
import { FaSearch, FaEdit, FaTrash, FaEye, FaFilter, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import { useStudentStore } from '../store/studentStore'
import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const ManageStudents = () => {
  const { students, isLoading, filters, setFilters, fetchStudents, deleteStudent, updateStudent, getStudentById } = useStudentStore()
  const { hasPermission } = useAuthStore()
  
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deletePhoneInput, setDeletePhoneInput] = useState('')

  useEffect(() => {
    if (hasPermission('students', 'read')) {
      fetchStudents()
    }
  }, [fetchStudents, hasPermission])

  const handleDelete = (student) => {
    setSelectedStudent(student)
    setDeletePhoneInput('')
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (deletePhoneInput !== selectedStudent.phone) {
      toast.error('Phone number does not match!')
      return
    }
    
    const result = await deleteStudent(selectedStudent._id)
    if (result.success) {
      // toast.success('Student deleted successfully!')
      setShowDeleteModal(false)
      setSelectedStudent(null)
    } else {
      toast.error('Failed to delete student')
    }
  }

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setEditForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      address: student.address,
      shift: student.shift,
      seatingType : student.seatingType,
      status: student.status,
      Type: student.seatingType
    })
    setShowEditModal(true)
  }

  const handleView = async (studentId) => {
    const result = await getStudentById(studentId)
    if (result.success) {
      setSelectedStudent(result.student)
      setShowViewModal(true)
    } else {
      toast.error('Failed to fetch student details')
    }
  }

  const handleUpdateStudent = async (e) => {
    e.preventDefault()
    const result = await updateStudent(selectedStudent._id, editForm)
    if (result.success) {
      // toast.success('Student updated successfully!')
      setShowEditModal(false)
      setSelectedStudent(null)
    } else {
      toast.error('Failed to update student')
    }
  }

  const toggleStatus = async (student) => {
    const newStatus = student.status === 'active' ? 'inactive' : 'active'
    const result = await updateStudent(student._id, { status: newStatus })
    if (result.success) {
      // toast.success(`Student ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
    } else {
      toast.error('Failed to update student status')
    }
  }

  if (!hasPermission('students', 'read')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">You don't have permission to view students.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
        <Link className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" to={"/add-student"}>
          Add New Student
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filters.shift}
            onChange={(e) => setFilters({ shift: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Shifts</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
          <select
            value={filters.seatingType}
            onChange={(e) => setFilters({ seatingType: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Type</option>
            <option value="half">half</option>
            <option value="full">full</option>
           
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {student.shift}
                    </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {student.seatingType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(student._id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {hasPermission('students', 'update') && (
                        <>
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Student"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => toggleStatus(student)}
                            className={`${student.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                            title={`${student.status === 'active' ? 'Deactivate' : 'Activate'} Student`}
                          >
                            {student.status === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                        </>
                      )}
                      {hasPermission('students', 'delete') && (
                        <button
                          onClick={() => handleDelete(student)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Student"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Student</h3>
              <button onClick={() => setShowEditModal(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleUpdateStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shift</label>
                <select
                  value={editForm.shift}
                  onChange={(e) => setEditForm({...editForm, shift: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={editForm.seatingType}
                  onChange={(e) => setEditForm({...editForm, seatingType: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="full">full</option>
                  <option value="half">half</option>
            
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Student Details</h3>
              <button onClick={() => setShowViewModal(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{selectedStudent.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{selectedStudent.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{selectedStudent.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900">{selectedStudent.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Shift</label>
                <p className="text-gray-900 capitalize">{selectedStudent.shift}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900 capitalize">{selectedStudent.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Type</label>
                <p className="text-gray-900 capitalize">{selectedStudent.seatingType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Joined Date</label>
                <p className="text-gray-900">{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Delete Student</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <strong>{selectedStudent.name}</strong>?
              </p>
              <p className="text-sm text-gray-600 mb-4">
                To confirm, please enter the student's phone number:
              </p>
              <p className="text-sm font-medium text-gray-800 mb-2">
                Phone: {selectedStudent.phone}
              </p>
              <input
                type="text"
                placeholder="Enter phone number to confirm"
                value={deletePhoneInput}
                onChange={(e) => setDeletePhoneInput(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={confirmDelete}
                disabled={deletePhoneInput !== selectedStudent.phone}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading students...</div>
        </div>
      )}
    </div>
  )
}

export default ManageStudents
