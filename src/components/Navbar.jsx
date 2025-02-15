import { useNavigate } from "react-router-dom";

function Navbar({ user, setUser, selectedRole, setSelectedRole }) {
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    // No immediate navigate here; AppContent's useEffect will handle navigation
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setSelectedRole(null);
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center mb-1">
      <div className="font-bold text-lg">Team Management System</div>

      {user && (
        <div className="flex items-center">
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="text-black p-1 mx-4 rounded"
          >
            <option value="USER">USER</option>
            {user.roleList.map(
              (role) =>
                role !== "USER" && (
                  <option key={role} value={role}>
                    {role}
                  </option>
                )
            )}
          </select>

          <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
