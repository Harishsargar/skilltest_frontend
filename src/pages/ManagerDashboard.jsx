import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react"; // Importing delete icon

function ManagerDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [taskData, setTaskData] = useState({ taskName: "", taskDescription: "", userId: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/api/manager/getAllUserAndTask", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  const openTaskModal = (userId, tasks) => {
    setSelectedUserId(userId);
    setSelectedUserTasks(tasks);
    setShowTaskModal(true);
  };

  const openAssignModal = (userId) => {
    setTaskData({ ...taskData, userId });
    setShowAssignModal(true);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8080/api/manager/assignTask",
        {
          taskName: taskData.taskName,
          taskDescription: taskData.taskDescription,
          user: { id: taskData.userId },
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      alert("Task assigned successfully!");
      setShowAssignModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error assigning task:", err);
      alert("Failed to assign task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8080/api/manager/deleteTask/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task deleted successfully!");
      fetchUsers();
      setSelectedUserTasks(selectedUserTasks.filter((task) => task.taskId !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-6 flex flex-col items-center">
        <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center mb-4 border-4 border-gray-500">
          <span className="text-4xl font-bold">{user?.name?.charAt(0)}</span>
        </div>
        <h2 className="text-2xl font-semibold">{user?.name}</h2>
        <p className="text-gray-400">{user?.email}</p>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-xl font-bold mb-4">User Task Management</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">No. of Tasks</th>
              <th className="border p-2">View Tasks</th>
              <th className="border p-2">Assign Task</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.assignedTasks.length}</td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => openTaskModal(user.id, user.assignedTasks)}
                  >
                    View Tasks
                  </button>
                </td>
                <td className="border p-2">
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded"
                    onClick={() => openAssignModal(user.id)}
                  >
                    Assign Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-lg font-bold mb-4">Assigned Tasks</h3>
            {selectedUserTasks.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Task Name</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUserTasks.map((task) => (
                    <tr key={task.taskId} className="border">
                      <td className="border p-2">{task.taskName}</td>
                      <td className="border p-2">{task.taskDescription}</td>
                      <td className="border p-2 text-center">
                        <button onClick={() => handleDeleteTask(task.taskId)}>
                          <Trash2 className="text-red-500 hover:text-red-700 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No assigned tasks.</p>
            )}
            <button
              className="bg-red-500 text-white px-4 py-1 rounded mt-4"
              onClick={() => setShowTaskModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Assign Task</h3>
            <form onSubmit={handleAssignTask}>
              <input
                type="text"
                placeholder="Task Name"
                value={taskData.taskName}
                onChange={(e) => setTaskData({ ...taskData, taskName: e.target.value })}
                className="border p-2 w-full mb-2"
                required
              />
              <textarea
                placeholder="Task Description"
                value={taskData.taskDescription}
                onChange={(e) => setTaskData({ ...taskData, taskDescription: e.target.value })}
                className="border p-2 w-full mb-2"
                required
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Assign Task
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded ml-2"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerDashboard;
