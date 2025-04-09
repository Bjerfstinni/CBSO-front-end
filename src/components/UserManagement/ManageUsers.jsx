import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash, faEdit } from "@fortawesome/free-solid-svg-icons";
import PaginateButton from "../CustomComponents/PaginateButton";
import CreateUserModal from "../Modals/CreateUserModal";
import { getAllUsers, deactivateUser } from "../../api/auth";
import EditUserModal from "../Modals/EditUserModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginHistoryModal from "../Modals/LoginHistoryModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [editUserId, setEditUserId] = useState(null);
  const [loading, setLoading] = useState(null);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      const formattedUsers = allUsers.map((user) => ({
        id: user.id,
        name: `${user.firstname || ""} ${user.middlename || ""} ${user.lastname || ""}`,
        email: user.email,
        dateCreated: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "N/A",
        role: user.role || "N/A",
        status: user.isActive ? "Active" : "Inactive", // Use isActive instead of status
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeactivateUser = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) {
      return;
    }
  
    setLoading(id);
    try {
      const response = await deactivateUser(id);
      toast.success(response.message);
  
      // Refetch users after deactivating to ensure latest data
      await fetchUsers();
    } catch (error) {
      toast.error("Failed to deactivate user.");
      console.error("Error deactivating user:", error);
    } finally {
      setLoading(null);
    }
  };
  
  

  const openEditModal = (id) => {
    setEditUserId(id);
  };

  const closeEditModal = () => {
    setEditUserId(null);
    fetchUsers(); // Refresh user list after editing
  };

  const paginatedUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalRecords = users.length;
  const numberOfPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));

  return (
    <div className="min-h-screen mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      <div className="flex gap-2 mb-2">
        <CreateUserModal />
        <LoginHistoryModal />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg table-fixed">
          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left w-1/4">Name</th>
              <th className="py-3 px-6 text-left w-1/4">Date Created</th>
              <th className="py-3 px-6 text-left w-1/6">Role</th>
              <th className="py-3 px-6 text-left w-1/6">Status</th>
              <th className="py-3 px-6 text-center w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-3 px-6 truncate">{user.name}</td>
                <td className="py-3 px-6">{user.dateCreated}</td>
                <td className="py-3 px-6">{user.role}</td>
                <td className="py-3 px-6">
                  <span
                    className={`py-1 px-3 rounded-full text-sm ${
                      user.status === "Active"
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center space-x-2">
                  <button
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => openEditModal(user.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-200"
                    onClick={() => handleDeactivateUser(user.id)}
                    disabled={loading === user.id} // Disable button while loading
                  >
                    {loading === user.id ? "..." : <FontAwesomeIcon icon={faUserSlash} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginateButton
        dataLength={totalRecords}
        numberOfPage={numberOfPages}
        setPage={setPage}
        page={page}
        data={paginatedUsers}
        spanCSS="flex justify-between items-center gap-x-3"
        divTailwindcss="flex justify-between items-center mt-1"
        bttnTailwindcss="bg-white border border-blue-300 px-2 gap-2 h-8 text-gray-700 rounded-md px-2 focus:shadow-outline focus:outline-none focus:ring-1 ring-blue-300 ring-offset-2"
      />

      {/* Render EditUser Modal */}
      {editUserId && <EditUserModal userId={editUserId} onClose={closeEditModal} onUserUpdated={fetchUsers} />}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserManagement;
