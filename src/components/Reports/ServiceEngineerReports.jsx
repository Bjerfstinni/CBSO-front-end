import React, { useState, useEffect } from "react";
import PaginateButton from "../CustomComponents/PaginateButton";
import ReportsModal from "../Modals/ReportsModal";
import { fetchOrdersForEngineer } from "../../api/reports"; // Import the new API function
import { approveOrder } from "../../api/reports"; // Assuming you have the approveOrder function
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import JwtDecoder from "../../utils/jwtDecoder";

const EngineerReports = ({ userId }) => {
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]); // Store fetched reports
  const [filteredReports, setFilteredReports] = useState([]); // Store filtered reports
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [approving, setApproving] = useState(null); // Track the order being approved
  const [sortColumn, setSortColumn] = useState("purchase_order_number"); // Default column to sort
  const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction
  const itemsPerPage = 10;
  const { decodedToken, isTokenValid, isLoading } = JwtDecoder();

  useEffect(() => {
    const fetchReports = async () => {
      if (!decodedToken || !isTokenValid) {
        setError("Invalid or expired token.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userId = decodedToken.id;

        if (!userId) {
          throw new Error("User ID is required.");
        }

        const data = await fetchOrdersForEngineer(userId);
        setReports(data);
        setFilteredReports(data); // Initialize filtered reports
      } catch (err) {
        toast.info("No Assigned Orders")
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      fetchReports();
    }
  }, [decodedToken, isTokenValid, isLoading]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter reports based on search term
    const filtered = reports.filter((report) => {
      return (
        report.purchase_order_number.toLowerCase().includes(value) ||
        report.machine_description.toLowerCase().includes(value) ||
        report.serial_number.toLowerCase().includes(value)
      );
    });

    setFilteredReports(filtered);
    setPage(1); // Reset to the first page when filtering
  };

  // Sorting logic
  const sortData = (column) => {
    const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);

    const sortedReports = [...filteredReports].sort((a, b) => {
      if (column === "purchase_order_number" || column === "machine_description" || column === "serial_number" || column === "status") {
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
      return 0;
    });

    setFilteredReports(sortedReports);
  };

  // Pagination logic
  const paginatedReports = filteredReports.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalRecords = filteredReports.length;
  const numberOfPages = Math.ceil(totalRecords / itemsPerPage);

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle order approval
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
      setFilteredReports((prevReports) =>
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">View Reports</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Search by P.O. Number, Machine Description, or S/N..."
          value={searchTerm}
          onChange={handleSearchChange}
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
                  <th className="py-3 px-6 text-left">Brand</th>
                  <th className="py-3 px-6 text-left">Model</th>
                  <th className="py-3 px-6 text-center">S/N</th>
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
                  <th className="py-3 px-6 text-center cursor-pointer" onClick={() => sortData("status")}>
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

export default EngineerReports;
