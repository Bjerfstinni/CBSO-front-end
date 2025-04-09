import React, { useState, useEffect } from "react";
import PaginateButton from "../CustomComponents/PaginateButton";
import ReportsModal from "../Modals/ReportsModal";
import { fetchOrderReport } from "../../api/reports"; // Import the API function

const Distribution = () => {
  const [reports, setReports] = useState([]); // Dynamic reports data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch data for a specific ID (you can dynamically update the ID based on your needs)
        const report = await fetchOrderReport(7); // Example: Fetch report for ID 8
        setReports([report]); // Wrap the single response in an array for table display
      } catch (err) {
        setError("Failed to load reports. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const paginatedReports = reports.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalRecords = reports.length;
  const numberOfPages = Math.ceil(totalRecords / itemsPerPage);

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Distribution History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg table-fixed">
          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Hospital/Client</th>
              <th className="py-3 px-6 text-left">Location</th>
              <th className="py-3 px-6 text-left">Region</th>
              <th className="py-3 px-6 text-left">P.O. Number</th>
              <th className="py-3 px-6 text-left">Machine Description</th>
              <th className="py-3 px-6 text-left">Brand</th>
              <th className="py-3 px-6 text-left">Model</th>
              <th className="py-3 px-6 text-center">S/N</th>
              <th className="py-3 px-6 text-center">Delivery Date</th>
              <th className="py-3 px-6 text-center">Service Engineer</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-6">{item.client_name}</td>
                <td className="py-3 px-6">{`${item.location?.city_name}, ${item.location?.barangay_name}`}</td>
                <td className="py-3 px-6">{item.location?.region_name}</td>
                <td className="py-3 px-6">{item.purchase_order_number}</td>
                <td className="py-3 px-6">{item.stock_machine_description}</td>
                <td className="py-3 px-6">{item.brand_name}</td>
                <td className="py-3 px-6">{item.model_name}</td>
                <td className="py-3 px-6 text-center">{item.serial_number}</td>
                <td className="py-3 px-6 text-center">{item.delivery_date.split("T")[0]}</td>
                <td className="py-3 px-6 text-center">{item.assigned_user_name}</td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`py-1 px-3 rounded-full text-sm ${
                      item.status === "OKAY"
                        ? "bg-green-200 text-green-700"
                        : "bg-yellow-200 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginateButton
        dataLength={totalRecords}
        numberOfPage={Array.from({ length: numberOfPages }, (_, i) => i + 1)}
        setPage={setPage}
        page={page}
        data={paginatedReports}
        spanCSS="flex justify-between items-center gap-x-3"
        divTailwindcss="flex justify-between items-center mt-1"
        bttnTailwindcss="bg-white border border-blue-300 px-2 gap-2 h-8 text-gray-700 rounded-md px-2 focus:shadow-outline focus:outline-none focus:ring-1 ring-blue-300 ring-offset-2"
      />

      <ReportsModal show={isModalOpen} onClose={closeModal} item={selectedItem} />
    </div>
  );
};

export default Distribution;
