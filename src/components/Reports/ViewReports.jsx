import React, { useState, useEffect } from "react";
import PaginateButton from "../CustomComponents/PaginateButton";
import ReportsModal from "../Modals/ReportsModal";
import { fetchReportAnalytics, approveOrder, getOrderReportById } from "../../api/reports";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JwtDecoder from "../../utils/jwtDecoder";
import ApprovedOrdersModal from "../Modals/ApprovedHistoryModal";

const Reports = () => {
  const { isTokenValid } = JwtDecoder();
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [clientNames, setClientNames] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isTokenValid) return;
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetchReportAnalytics(page, itemsPerPage, token);
        setReports(response.data);
        setFilteredReports(response.data);
        setTotalRecords(response.totalRecords);
      } catch (err) {
        toast.info("No reports yet");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [page, isTokenValid]);

  useEffect(() => {
    if (!isTokenValid || reports.length === 0) return;
  
    const fetchClientNames = async () => {
      const clientData = {};
      await Promise.all(
        reports.map(async (report) => {
          try {
            const response = await getOrderReportById(report.id, token);
            clientData[report.id] = response.data.client_name;
          } catch (err) {
            console.error(`Error fetching client name for ID ${report.id}:`, err.message);
            clientData[report.id] = "N/A";
          }
        })
      );
      setClientNames((prev) => ({ ...prev, ...clientData }));
    };
  
    fetchClientNames();
  }, [reports, isTokenValid]);
  

  useEffect(() => {
    const filtered = reports.filter((report) =>
      report.purchase_order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.machine_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.serial_number.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [searchQuery, reports]);

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
      const response = await approveOrder(orderId, token);
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

  const numberOfPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <div className="min-h-screen mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">View Reports</h1>
      <div className="flex gap-2 mb-2">
        <ApprovedOrdersModal />
      </div>
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
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left">Client Name</th>
                  <th className="py-3 px-6 text-left">P.O. Number</th>
                  <th className="py-3 px-6 text-left">Machine Description</th>
                  <th className="py-3 px-6 text-left">Brand</th>
                  <th className="py-3 px-6 text-left">Model</th>
                  <th className="py-3 px-6 text-center">S/N</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-center">Delivery Date</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-6">{clientNames[item.id] || "Loading..."}</td>
                    <td className="py-3 px-6">{item.purchase_order_number}</td>
                    <td className="py-3 px-6">{item.machine_description}</td>
                    <td className="py-3 px-6">{item.brand_name}</td>
                    <td className="py-3 px-6">{item.model_name}</td>
                    <td className="py-3 px-6 text-center">{item.serial_number}</td>
                    <td className="py-3 px-6 text-center">{item.quantity}</td>
                    <td className="py-3 px-6 text-center">{new Date(item.delivery_date).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-center">
                      <span className={`py-1 px-3 rounded-full text-sm ${item.status === "approved" ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center space-x-2 flex items-center justify-center">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200" onClick={() => handleViewClick(item)}>View</button>
                      {item.status !== "approved" && (
                        <button className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 ${approving === item.id ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => handleApproveClick(item.id)} disabled={approving === item.id}>
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
