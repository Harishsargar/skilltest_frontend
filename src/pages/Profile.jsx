import { useState, useEffect } from "react";
import axios from "axios";

function Profile({ user }) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:8080/api/user/getUserProfile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUserProfile(res.data))
        .catch(() => setUserProfile(null));
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-6 flex flex-col items-center">
        {/* Profile Image (Placeholder) */}
        <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center mb-4 border-4 border-gray-500">
          <span className="text-4xl font-bold">{userProfile?.name?.charAt(0)}</span>
        </div>  

        {/* User Details */}
        <h2 className="text-2xl font-semibold">{userProfile?.name}</h2>
        <p className="text-gray-400">{userProfile?.email}</p>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Assigned Tasks</h3>

        {userProfile?.assignedTasks.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="border p-4">Task Name</th>
                  <th className="border p-4">Description</th>
                  <th className="border p-4">Assigned By</th>
                </tr>
              </thead>
              <tbody>
                {userProfile.assignedTasks.map((task, index) => (
                  <tr key={task.taskId} className={`border ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                    <td className="border p-4">{task.taskName}</td>
                    <td className="border p-4">{task.taskDescription}</td>
                    <td className="border p-4">{task.managerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-lg mt-4">No assigned tasks.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
