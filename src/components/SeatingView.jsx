import { useState, useEffect } from 'react'
import { FaTimes, FaChair, FaPlus, FaTrash } from 'react-icons/fa'
import { useSeatStore } from '../store/seatStore'
import { useStudentStore } from '../store/studentStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const SeatingView = () => {
  const { seats, isLoading, fetchSeats, assignSeat, unassignSeat, getStats, createSeat, deleteSeat } = useSeatStore()
  const { students, fetchStudents } = useStudentStore()
  const { hasPermission } = useAuthStore()
  
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showUnassignModal, setShowUnassignModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [seatNumberInput, setSeatNumberInput] = useState('')
  const [newSeatNumber, setNewSeatNumber] = useState('')
  const [deleteSeatNumber, setDeleteSeatNumber] = useState('')
  const [seatTiming, setSeatTiming] = useState('full')
  const [stats, setStats] = useState({ 
    totalSeats: 0, 
    occupiedSeats: 0, 
    availableSeats: 0,
    halfseat: 0,
    fullseat: 0
  })

  useEffect(() => {
    if (hasPermission('seats', 'read')) {
      loadData()
    }
  }, [hasPermission])

  const loadData = async () => {
    await fetchSeats()
    await fetchStudents()
    await loadStats()
  }

  const loadStats = async () => {
    try {
      const response = await getStats()
      setStats(response || {
        totalSeats: 0,
        occupiedSeats: 0,
        availableSeats: 0,
        halfseat: 0,
        fullseat: 0
      })
    } catch (error) {
      console.error('Failed to load seat stats:', error)
    }
  }

  const handleSeatClick = (seat) => {
    if (!hasPermission('seats', 'update')) {
      toast.error('You don\'t have permission to manage seats')
      return
    }

    setSelectedSeat(seat)
    
    // Check if seat is occupied
    if (seat.occupied === true) {
      setSeatNumberInput('')
      setShowUnassignModal(true)
    } else {
      setSelectedStudent('')
      setShowAssignModal(true)
    }
  }

  const handleAssignSeat = async (e) => {
    e.preventDefault()
    if (!selectedStudent) {
      toast.error('Please select a student')
      return
    }

    const result = await assignSeat({
      seatId: selectedSeat._id,
      studentId: selectedStudent,
      seatOcupiedTiming: seatTiming
    })

    if (result.success) {
      toast.success('Seat assigned successfully!')
      setShowAssignModal(false)
      loadData()
    } else {
      toast.error('Failed to assign seat')
    }
  }

  const handleUnassignSeat = async () => {
    if (seatNumberInput !== selectedSeat.seatNumber.toString()) {
      toast.error('Seat number does not match!')
      return
    }

    const result = await unassignSeat(selectedSeat._id)
    
    if (result.success) {
      toast.success('Seat unassigned successfully!')
      setShowUnassignModal(false)
      loadData()
    } else {
      toast.error('Failed to unassign seat')
    }
  }

  const handleCreateSeat = async (e) => {
    e.preventDefault()
    if (!newSeatNumber) {
      toast.error('Please enter seat number')
      return
    }

    const result = await createSeat({ seatNumber: parseInt(newSeatNumber) })
    
    if (result.success) {
      setShowCreateModal(false)
      setNewSeatNumber('')
    }
  }

  const handleDeleteSeat = async (e) => {
    e.preventDefault()
    if (!deleteSeatNumber) {
      toast.error('Please enter seat number')
      return
    }

    const result = await deleteSeat({ seatNumber: parseInt(deleteSeatNumber) })
    
    if (result.success) {
      setShowDeleteModal(false)
      setDeleteSeatNumber('')
    }
  }

  const getSeatColor = (seat) => {
    if (seat.occupied === true) {
      const timing = seat.seatOcupiedTiming
      if (timing === 'full') return 'bg-red-600 text-white cursor-pointer hover:bg-red-700'
      if (timing === 'half') return 'bg-orange-500 text-white cursor-pointer hover:bg-orange-600'
      return 'bg-red-500 text-white cursor-pointer hover:bg-red-600'
    }
    
    switch (seat.type) {
      case 'premium': return 'bg-yellow-200 hover:bg-yellow-300 cursor-pointer text-gray-800'
      case 'vip': return 'bg-purple-200 hover:bg-purple-300 cursor-pointer text-gray-800'
      default: return 'bg-green-200 hover:bg-green-300 cursor-pointer text-gray-800'
    }
  }

  const getSeatTooltip = (seat) => {
    const isOccupied = seat.occupied === true
    const studentName = seat.student?.[0]?.studentId?.name || 'Occupied'
    const timing = seat.seatOcupiedTiming || 'none'
    
    return `Seat ${seat.seatNumber} - ${seat.type || 'regular'} ${
      isOccupied 
        ? `(${studentName} - ${timing}) - Click to Unassign` 
        : '(Available) - Click to Assign'
    }`
  }

  if (!hasPermission('seats', 'read')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">You don't have permission to view seats.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Seating View</h1>
        <div className="flex space-x-2">
          {hasPermission('seats', 'create') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
            >
              <FaPlus />
              <span>Create Seat</span>
            </button>
          )}
          {hasPermission('seats', 'delete') && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center space-x-2"
            >
              <FaTrash />
              <span>Delete Seat</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-600">Total Seats</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalSeats}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-600">Occupied Seats</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.occupiedSeats}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-600">Available Seats</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.availableSeats}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-600">Full Day</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.fullseat}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-600">Half Day</h3>
          <p className="text-2xl font-bold text-orange-600 mt-1">{stats.halfseat}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-200 rounded border"></div>
            <span className="text-sm">Available Regular</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-200 rounded border"></div>
            <span className="text-sm">Available Premium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-200 rounded border"></div>
            <span className="text-sm">Available VIP</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-600 rounded border"></div>
            <span className="text-sm text-white">Full Day Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-orange-500 rounded border"></div>
            <span className="text-sm text-white">Half Day Occupied</span>
          </div>
        </div>
      </div>

      {/* Library Layout */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Library Layout</h3>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading seats...</div>
          </div>
        ) : (
          <div className="grid grid-cols-10 gap-2 max-w-4xl mx-auto">
            {seats.map((seat) => (
              <div
                key={seat._id}
                onClick={() => handleSeatClick(seat)}
                className={`
                  w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-xs font-semibold
                  transition-colors duration-200 ${getSeatColor(seat)}
                `}
                title={getSeatTooltip(seat)}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Seat Modal */}
      {showAssignModal && selectedSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assign Seat {selectedSeat.seatNumber}</h3>
              <button onClick={() => setShowAssignModal(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAssignSeat} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Seat Details</label>
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Seat Number:</strong> {selectedSeat.seatNumber}</p>
                  <p><strong>Type:</strong> {selectedSeat.type}</p>
                  <p><strong>Location:</strong> {selectedSeat.location || 'Main Hall'}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Choose a student...</option>
                  {students.filter(s => s.status === 'active').map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} - {student.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Seat Timing</label>
                <select
                  value={seatTiming}
                  onChange={(e) => setSeatTiming(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="full">Full Day</option>
                  <option value="half">Half Day</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Assign Seat
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unassign Seat Modal */}
      {showUnassignModal && selectedSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Unassign Seat</h3>
              <button onClick={() => setShowUnassignModal(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>Seat Number:</strong> {selectedSeat.seatNumber}</p>
                <p><strong>Type:</strong> {selectedSeat.seatOcupiedTiming || 'none'}</p>
                <p><strong>Assigned to:</strong> {selectedSeat.student?.[0]?.studentId?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  To confirm unassignment, please enter the seat number:
                </p>
                <input
                  type="text"
                  placeholder="Enter seat number to confirm"
                  value={seatNumberInput}
                  onChange={(e) => setSeatNumberInput(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleUnassignSeat}
                  disabled={seatNumberInput !== selectedSeat.seatNumber.toString()}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unassign Seat
                </button>
                <button
                  onClick={() => setShowUnassignModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Seat Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Seat</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateSeat} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Seat Number</label>
                <input
                  type="number"
                  value={newSeatNumber}
                  onChange={(e) => setNewSeatNumber(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter seat number"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create Seat
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Seat Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Delete Seat</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleDeleteSeat} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Seat Number</label>
                <input
                  type="number"
                  value={deleteSeatNumber}
                  onChange={(e) => setDeleteSeatNumber(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter seat number to delete"
                  required
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. The seat will be permanently deleted.
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete Seat
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeatingView

//       {/* Assign Seat Modal */}
//       {showAssignModal && selectedSeat && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Assign Seat {selectedSeat.seatNumber}</h3>
//               <button onClick={() => setShowAssignModal(false)}>
//                 <FaTimes className="text-gray-500" />
//               </button>
//             </div>
//             <form onSubmit={handleAssignSeat} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Seat Details</label>
//                 <div className="bg-gray-50 p-3 rounded">
//                   <p><strong>Seat Number:</strong> {selectedSeat.seatNumber}</p>
//                   <p><strong>Type:</strong> {selectedSeat.type}</p>
//                   <p><strong>Location:</strong> {selectedSeat.location || 'Main Hall'}</p>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Select Student</label>
//                 <select
//                   value={selectedStudent}
//                   onChange={(e) => setSelectedStudent(e.target.value)}
//                   className="w-full border rounded px-3 py-2"
//                   required
//                 >
//                   <option value="">Choose a student...</option>
//                   {students.filter(s => s.status === 'active').map((student) => (
//                     <option key={student._id} value={student._id}>
//                       {student.name} - {student.email}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   Assign Seat
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowAssignModal(false)}
//                   className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Unassign Seat Modal */}
//       {showUnassignModal && selectedSeat && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-red-600">Unassign Seat</h3>
//               <button onClick={() => setShowUnassignModal(false)}>
//                 <FaTimes className="text-gray-500" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-3 rounded">
//                 <p><strong>Seat Number:</strong> {selectedSeat.seatNumber}</p>
//                 <p><strong>Type:</strong> {selectedSeat.type}</p>
//                 <p><strong>Assigned to:</strong> {selectedSeat.assignedTo?.name || 'Unknown'}</p>
//                 <p><strong>Student Email:</strong> {selectedSeat.assignedTo?.email || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 mb-2">
//                   To confirm unassignment, please enter the seat number:
//                 </p>
//                 <input
//                   type="text"
//                   placeholder="Enter seat number to confirm"
//                   value={seatNumberInput}
//                   onChange={(e) => setSeatNumberInput(e.target.value)}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={handleUnassignSeat}
//                   disabled={seatNumberInput !== selectedSeat.seatNumber.toString()}
//                   className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Unassign Seat
//                 </button>
//                 <button
//                   onClick={() => setShowUnassignModal(false)}
//                   className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default SeatingView
