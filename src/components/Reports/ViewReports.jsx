import React, { useState, useEffect } from "react";
import PaginateButton from "../CustomComponents/PaginateButton";
import ReportsModal from "../Modals/ReportsModal";
import { fetchReportAnalytics } from "../../api/reports";
import { approveOrder } from "../../api/reports";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reports = () => {
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for sorting
  const [sortColumn, setSortColumn] = useState("purchase_order_number");
  const [sortDirection, setSortDirection] = useState("asc");

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await fetchReportAnalytics();
        setReports(data);
      } catch (err) {
        toast.info("No reports yet");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(
    (item) =>
      item.purchase_order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.machine_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortData = (column) => {
    const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);

    const sortedReports = [...filteredReports].sort((a, b) => {
      if (column === "purchase_order_number" || column === "machine_description" || column === "serial_number") {
        return direction === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      if (column === "quantity") {
        return direction === "asc" ? a[column] - b[column] : b[column] - a[column];
      }
      if (column === "delivery_date") {
        return direction === "asc"
          ? new Date(a[column]) - new Date(b[column])
          : new Date(b[column]) - new Date(a[column]);
      }
      if (column === "status") {
        return direction === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      return 0;
    });

    setReports(sortedReports);
  };

  const paginatedReports = filteredReports.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalRecords = filteredReports.length;
  const numberOfPages = Math.ceil(totalRecords / itemsPerPage);

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleApproveClick = async (orderId) => {
    try {
      setApproving(orderId);
      const response = await approveOrder(orderId);
      toast.success(response.message || "Order approved successfully.");
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === orderId ? { ...report, status: "approved" } : report
        )
      );
    } catch (err) {
      console.error("Approval error:", err.message);
      toast.error(err.message || "Failed to approve the order.");
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="min-h-screen mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">View Reports</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by P.O. Number, Machine Description, or S/N"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                <tr>
                  <th
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => sortData("purchase_order_number")}
                  >
                    P.O. Number
                    {sortColumn === "purchase_order_number" && (sortDirection === "asc" ? " ↑" : " ↓")}
                  </th>
                  <th
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => sortData("machine_description")}
                  >
                    Machine Description
                    {sortColumn === "machine_description" && (sortDirection === "asc" ? " ↑" : " ↓")}
                  </th>
                  <th
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => sortData("brand_name")}
                  >
                    Brand
                    {sortColumn === "brand_name" && (sortDirection === "asc" ? " ↑" : " ↓")}
                  </th>
                  <th
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => sortData("model_name")}
                  >
                    Model
                    {sortColumn === "model_name" && (sortDirection === "asc" ? " ↑" : " ↓")}
                  </th>
                  <th
                    className="py-3 px-6 text-center cursor-pointer"
                    onClick={() => sortData("serial_number")}
                  >
                    S/N
                    {sortColumn === "serial_number" && (sortDirection === "asc" ? " ↑" : " ↓")}
                  </th>
                  <th
                    className="py-3 px-6 text-center cursor-pointer"
                    onClick={() => sortData("quantity")}
                  >
                    Quantity
                    {sortColumn === "quantity" && (sortDirection === "asc" ? " ↑" : " ↓")}
                  </th>
                  <th
                    className="py-3 px-6 text-center cursor-pointer"
                    onClick={() => sortData("delivery_date")}
                  >
                    Delivery Date
                    {sortColumn === "delivery_date" && (sortDirection === "asc" ? " ↑" : " ↓")}
                  </th>
                  <th
                    className="py-3 px-6 text-center cursor-pointer"
                    onClick={() => sortData("status")}
                  >
                    Status
                    {sortColumn === "status" && (sortDirection === "asc" ? " ↑" : " ↓")}
                  </th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-6">{item.purchase_order_number}</td>
                    <td className="py-3 px-6">{item.machine_description}</td>
                    <td className="py-3 px-6">{item.brand_name}</td>
                    <td className="py-3 px-6">{item.model_name}</td>
                    <td className="py-3 px-6 text-center">{item.serial_number}</td>
                    <td className="py-3 px-6 text-center">{item.quantity}</td>
                    <td className="py-3 px-6 text-center">
                      {new Date(item.delivery_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`py-1 px-3 rounded-full text-sm ${
                          item.status === "approved"
                            ? "bg-green-200 text-green-700"
                            : "bg-yellow-200 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center space-x-2 flex items-center justify-center">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                        onClick={() => handleViewClick(item)}
                      >
                        View
                      </button>
                      {item.status !== "approved" && (
                        <button
                          className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 ${
                            approving === item.id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handleApproveClick(item.id)}
                          disabled={approving === item.id}
                        >
                          {approving === item.id ? "Approving..." : "Approve"}
                        </button>
                      )}
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
            spanCSS="flex justify-between items-center gap-x-3"
            divTailwindcss="flex justify-between items-center mt-1"
            bttnTailwindcss="bg-white border border-blue-300 px-2 gap-2 h-8 text-gray-700 rounded-md px-2 focus:shadow-outline focus:outline-none focus:ring-1 ring-blue-300 ring-offset-2"
          />
        </>
      )}

      <ReportsModal show={isModalOpen} onClose={closeModal} item={selectedItem} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Reports;
