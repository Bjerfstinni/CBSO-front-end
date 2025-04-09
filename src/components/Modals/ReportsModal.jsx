import React, { useEffect, useState } from "react";
import { getOrderReportById } from "../../api/reports"; // Updated API function
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportPDF from "../ReportsPdf";

const ReportsModal = ({ show, onClose, item, token }) => {
  const [detailedReport, setDetailedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && item) {
      const loadReportDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          const report = await getOrderReportById(item.id, token); // Pass token
          setDetailedReport(report.data); // Extract the 'data' object
        } catch (err) {
          setError("Failed to fetch detailed report.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      loadReportDetails();
    }
  }, [show, item, token]);

  if (!show) return null; // Prevent rendering if the modal is closed

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-4xl p-8 transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()} // Prevents closing on modal click
      >
        <div className="flex items-center justify-between px-4 border-b rounded-t-md bg-gray-100 mb-2">
          <h1 className="text-2xl font-semibold">Order Report</h1>
        </div>
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client Name
                </label>
                <input
                  type="text"
                  value={detailedReport?.client_name || ""}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Region
                </label>
                <input
                  type="text"
                  value={detailedReport?.region_name || ""}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={`${detailedReport?.city_name || ""}, ${detailedReport?.barangay_name || ""}`}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  P.O. Number
                </label>
                <input
                  type="text"
                  value={detailedReport?.purchase_order_number || ""}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Machine Description
                </label>
                <input
                  type="text"
                  value={detailedReport?.stock_machine_description || ""}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  value={detailedReport?.brand_name || ""}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  value={detailedReport?.model_name || ""}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={detailedReport?.serial_number || ""}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="text"
                  value={detailedReport?.quantity || ""}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Date
                </label>
                <input
                  type="text"
                  value={
                    detailedReport?.delivery_date
                      ? new Date(detailedReport.delivery_date).toLocaleDateString()
                      : "N/A"
                  }
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Complete Date
                </label>
                <input
                  type="text"
                  value={
                    detailedReport?.service_complete_date
                      ? new Date(detailedReport.service_complete_date).toLocaleDateString()
                      : "N/A"
                  }
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Type(s)
                </label>
                <textarea
                  value={
                    detailedReport?.order_types?.length
                      ? detailedReport.order_types.map((type) => type.service_type_name).join(", ")
                      : "N/A"
                  }
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              {detailedReport && (
                <PDFDownloadLink
                  document={<ReportPDF detailedReport={detailedReport} />}
                  fileName="report.pdf"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  {({ loading }) =>
                    loading ? "Generating PDF..." : "Download PDF"
                  }
                </PDFDownloadLink>
              )}
            </div>
          </>
        )}
        <div className="flex justify-end mt-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
