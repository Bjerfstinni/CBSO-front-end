import React, { useEffect, useState } from "react";
import { fetchApprovedOrders } from "../../api/reports";
import { RiCloseFill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApprovedOrdersModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isModalVisible) {
      fetchOrders(page);
    }
  }, [isModalVisible, page]);

  const fetchOrders = async (page) => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchApprovedOrders(page, 5);
      setOrders(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError("Failed to load approved orders.");
      toast.error("Error fetching approved orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalVisible(true)}
        className="rounded-md px-3 py-1 w-40 mb-2 border border-blue-600 bg-blue-500 text-white hover:bg-blue-600 text-md font-medium outline-blue-400 focus:outline focus:outline-offset-2"
      >
        Approved Orders
      </button>

      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-100">
              <h2 className="text-xl font-semibold text-gray-700">Approved Orders History</h2>
              <RiCloseFill
                className="text-3xl text-red-500 cursor-pointer hover:text-red-600"
                onClick={() => setIsModalVisible(false)}
                title="Close"
              />
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <p className="text-center">Loading approved orders...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : orders.length === 0 ? (
                <p className="text-center">No approved orders found.</p>
              ) : (
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th className="py-2 px-4">Client Name</th>
                      <th className="py-2 px-4">Order No.</th>
                      <th className="py-2 px-4">Quantity</th>
                      <th className="py-2 px-4">Approved By</th>
                      <th className="py-2 px-4">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{order.client_name}</td>
                        <td className="py-2 px-4">{order.purchase_order_number}</td>
                        <td className="py-2 px-4">{order.quantity}</td>
                        <td className="py-2 px-4">
                          {`${order.AssignedUser.firstname} ${order.AssignedUser.middlename} ${order.AssignedUser.lastname}`}
                        </td>
                        <td className="py-2 px-4">{new Date(order.delivery_date).toLocaleDateString()}</td>
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

export default ApprovedOrdersModal;
