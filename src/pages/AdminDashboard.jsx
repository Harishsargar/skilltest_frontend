import { useEffect, useState } from "react";
import axios from "axios";

const allRoles = ["USER", "ADMIN", "MANAGER"];

function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    email: "",
    password: "",
    roles: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // For creating new user
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    roles: [], // roles as an array
  });
  const [createShowPassword, setCreateShowPassword] = useState(false);

  // Fetch all users
  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/api/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete user with confirmation
  const handleDelete = (userId) => {
    const confirmation = window.confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      axios
        .delete(`http://localhost:8080/api/admin/deleteUserbyId/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status === 204) {
            alert("User deleted successfully!");
            fetchUsers();
          } else {
            alert("Failed to delete user.");
          }
        })
        .catch((err) => {
          console.error("Error deleting user:", err);
          alert("Failed to delete user.");
        });
    }
  };

  // Open update modal and pre-fill form fields
  const handleUpdateClick = (userData) => {
    setSelectedUser(userData);
    setUpdateForm({
      name: userData.name,
      email: userData.email,
      password: "", // Mandatory update; admin must enter a new password
      roles: userData.roleList.join(", "),
    });
    setShowPassword(false);
    setShowUpdateModal(true);
  };

  // Handle update form submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: selectedUser.id,
      name: updateForm.name,
      email: updateForm.email,
      password: updateForm.password,
      rollList: updateForm.roles.split(",").map((r) => r.trim()),
    };

    axios
      .put("http://localhost:8080/api/admin/updateUser", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("User updated successfully!");
        setShowUpdateModal(false);
        fetchUsers();
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        alert("Failed to update user.");
      });
  };

  // Handle create new user form submission
  const handleCreateSubmit = (e) => {
    e.preventDefault();

    // Validate password length
    if (newUserForm.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    const payload = {
      name: newUserForm.name,
      email: newUserForm.email,
      password: newUserForm.password,
      rollList: newUserForm.roles,
    };

    axios
      .post("http://localhost:8080/api/admin/createUser", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("User created successfully!");
        setShowCreateModal(false);
        // Reset form
        setNewUserForm({ name: "", email: "", password: "", roles: [] });
        fetchUsers();
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        alert("Failed to create user.");
      });
  };

  // Handle checkbox change in create user modal
  const handleCheckboxChange = (role) => {
    setNewUserForm((prevState) => {
      const roles = prevState.roles;
      if (roles.includes(role)) {
        return { ...prevState, roles: roles.filter((r) => r !== role) };
      } else {
        return { ...prevState, roles: [...roles, role] };
      }
    });
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar with Admin Info */}
      <div className="w-1/4 bg-gray-800 text-white p-6 flex flex-col items-center">
        <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center mb-4 border-4 border-gray-500">
          <span className="text-4xl font-bold">{user?.name?.charAt(0)}</span>
        </div>
        <h2 className="text-2xl font-semibold">{user?.name}</h2>
        <p className="text-gray-400">{user?.email}</p>
      </div>

      {/* Right Body */}
      <div className="w-3/4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Users List</h2>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setShowCreateModal(true)}
          >
            Create New User
          </button>
        </div>

        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Roles</th>
              <th className="border border-gray-300 p-2">Update</th>
              <th className="border border-gray-300 p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="border border-gray-300 p-2">{u.name}</td>
                  <td className="border border-gray-300 p-2">{u.email}</td>
                  <td className="border border-gray-300 p-2">{u.roleList.join(", ")}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleUpdateClick(u)}
                    >
                      Update
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center border border-gray-300 p-2">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-xl font-bold mb-4">Update User</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={updateForm.name}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, name: e.target.value })
                  }
                  className="w-full border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={updateForm.email}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, email: e.target.value })
                  }
                  className="w-full border p-2"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label className="block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={updateForm.password}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, password: e.target.value })
                    }
                    className="w-full border p-2 pr-12 rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Roles (comma separated)</label>
                <input
                  type="text"
                  value={updateForm.roles}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, roles: e.target.value })
                  }
                  className="w-full border p-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-xl font-bold mb-4">Create New User</h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, name: e.target.value })
                  }
                  className="w-full border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, email: e.target.value })
                  }
                  className="w-full border p-2"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label className="block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={createShowPassword ? "text" : "password"}
                    value={newUserForm.password}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, password: e.target.value })
                    }
                    className="w-full border p-2 pr-12 rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setCreateShowPassword(!createShowPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
                  >
                    {createShowPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Roles</label>
                <div className="flex space-x-4">
                  {allRoles.map((role) => (
                    <label key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        value={role}
                        checked={newUserForm.roles.includes(role)}
                        onChange={() => handleCheckboxChange(role)}
                        className="mr-1"
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
