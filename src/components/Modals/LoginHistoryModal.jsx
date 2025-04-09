import React, { useEffect, useState } from "react";
import { getLoginHistory } from "../../api/auth";
import { RiCloseFill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginHistoryModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isModalVisible) {
      fetchLogs(page);
    }
  }, [isModalVisible, page]);

  const fetchLogs = async (page) => {
    setLoading(true);
    setError("");

    try {
      const data = await getLoginHistory(page, 5);
      setLogs(data.logs);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError("Failed to load login history.");
      toast.error("Error fetching login history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalVisible(true)}
        className="rounded-md px-3 py-1 w-40 mb-2 border border-green-600 bg-green-500 text-white hover:bg-green-600 text-md font-medium outline-green-400 focus:outline focus:outline-offset-2"
      >
        Login History
      </button>
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-100">
              <h2 className="text-xl font-semibold text-gray-700">User Login History</h2>
              <RiCloseFill
                className="text-3xl text-red-500 cursor-pointer hover:text-red-600"
                onClick={() => setIsModalVisible(false)}
                title="Close"
              />
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <p className="text-center">Loading login history...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : logs.length === 0 ? (
                <p className="text-center">No login history found.</p>
              ) : (
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th className="py-2 px-4">User</th>
                      <th className="py-2 px-4">Action</th>
                      <th className="py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{`${log.user.firstname} ${log.user.middlename} ${log.user.lastname}`}</td>
                        <td className="py-2 px-4">{log.action}</td>
                        <td className="py-2 px-4">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="p-4 flex justify-center space-x-2 border-t">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page} of {totalPages}</span>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default LoginHistoryModal;
