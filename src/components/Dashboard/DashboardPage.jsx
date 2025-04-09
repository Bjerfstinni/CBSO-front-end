import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxes, faClipboardList, faUsers, faTasks } from "@fortawesome/free-solid-svg-icons";
import { getTotalStocks, fetchReportAnalytics, fetchOrderReport } from "../../api/reports";
import { getAllUsers } from "../../api/auth";
import { getStocks } from "../../api/stocks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const InventoryDashboard = () => {
  const [totalInventory, setTotalInventory] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [approvedOrders, setApprovedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to handle button click
  const handleAddInventoryClick = () => {
    navigate("/dashboard/manage-inventory");
  };

  // Function to recalculate low stock items
  const calculateLowStockItems = (stocks) => {
    return stocks.filter((stock) => stock.quantity <= 10).length;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalStocks = await getTotalStocks();
        setTotalInventory(totalStocks.total);
  
        const reports = await fetchReportAnalytics();
        const reportsArray = Array.isArray(reports?.data) ? reports.data : [];
        setPendingOrders(reportsArray.filter((report) => report.status === "pending").length);
  
        const approvedReports = reportsArray.filter((report) => report.status === "approved").slice(0, 5);
  
        const users = await getAllUsers();
        setTotalUsers(users.length);
  
        const inventoryResponse = await getStocks();
  
        // Check if inventoryResponse contains an array inside
        let inventory = [];
        if (Array.isArray(inventoryResponse)) {
          inventory = inventoryResponse;
        } else if (Array.isArray(inventoryResponse.data)) {
          inventory = inventoryResponse.data; // If API wraps the array inside a `data` key
        } else {
          console.error("Unexpected inventory structure:", inventoryResponse);
        }
  
  
        const lowStockCount = inventory.filter((stock) => {
          return stock.quantity !== undefined && stock.quantity !== null && stock.quantity <= 10;
        }).length;
  
        setLowStockItems(lowStockCount);
  
        const approvedOrdersWithDetails = await Promise.all(
          approvedReports.map(async (order) => {
            try {
              const orderResponse = await fetchOrderReport(order.id);
              const orderDetails = orderResponse.data;
              return {
                ...order,
                client_name: orderDetails.client_name || "N/A",
                assigned_user_name: orderDetails.assigned_user_name || "N/A",
                stock_machine_description: orderDetails.stock_machine_description || "N/A",
                brand_name: orderDetails.brand_name || "N/A",
                model_name: orderDetails.model_name || "N/A",
                serial_number: orderDetails.serial_number || "N/A",
                quantity: orderDetails.quantity || "N/A",
                purchase_order_number: orderDetails.purchase_order_number || "N/A",
              };
            } catch (error) {
              console.error("Error fetching order details:", error);
              return { ...order, client_name: "N/A", assigned_user_name: "N/A" };
            }
          })
        );
  
        setApprovedOrders(approvedOrdersWithDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  
  

  const stats = [
    {
      icon: faBoxes,
      title: "Total Inventory",
      count: totalInventory,
      description: "Total Stock on Hand",
      color: "text-green-600",
      glowClass: "animate-glow-green delay-0", // No delay for the first one
    },
    {
      icon: faClipboardList,
      title: "Pending Orders",
      count: pendingOrders,
      description: "Orders to fulfill",
      color: "text-yellow-400",
      glowClass: "animate-glow-yellow delay-1000",
      path: "/dashboard/view-reports", // Add navigation path
    },
    {
      icon: faTasks,
      title: "Low Stocks",
      count: lowStockItems,
      description: "Critical items",
      color: "text-red-600",
      glowClass: "animate-glow-red delay-2000", // Delay for the third one
      path: "/dashboard/low-stocks", // Add navigation path
    },
    {
      icon: faUsers,
      title: "Manage Users",
      count: totalUsers,
      description: "Active users",
      color: "text-blue-600",
      glowClass: "animate-glow-blue delay-3000", // Delay for the fourth one
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleAddInventoryClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Inventory
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer ${stat.glowClass}`}
            onClick={() => stat.path && navigate(stat.path)} // Navigate only if a path is defined
          >
            <div className="flex-1 p-4">
              <h3 className={`font-semibold text-lg ${stat.color}`}>{stat.title}</h3>
              <p className="text-gray-500">{stat.description}</p>
              {loading ? (
                <p className="text-xl font-bold">Loading...</p>
              ) : (
                <p className={`text-xl font-bold ${stat.color}`}>{stat.count}</p>
              )}
            </div>
            <div className="flex items-center justify-center w-24 bg-gray-100 rounded-r-lg">
              <FontAwesomeIcon icon={stat.icon} className={`text-6xl ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>


      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading recent transactions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : approvedOrders.length === 0 ? (
          <p className="text-center text-gray-500">No approved orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left">Client Name</th>
                  <th className="py-3 px-6 text-left">PO Number</th>
                  <th className="py-3 px-6 text-left">Machine Description</th>
                  <th className="py-3 px-6 text-left">Brand</th>
                  <th className="py-3 px-6 text-left">Model</th>
                  <th className="py-3 px-6 text-center">S/N</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-left">Assigned Engineer</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{order.client_name}</td>
                    <td className="py-3 px-6">{order.purchase_order_number}</td>
                    <td className="py-3 px-6">{order.stock_machine_description}</td>
                    <td className="py-3 px-6">{order.brand_name}</td>
                    <td className="py-3 px-6">{order.model_name}</td>
                    <td className="py-3 px-6 text-center">{order.serial_number}</td>
                    <td className="py-3 px-6 text-center">{order.quantity}</td>
                    <td className="py-3 px-6">{order.assigned_user_name}</td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`py-1 px-3 rounded-full text-sm ${order.status === "approved" ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-700"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default InventoryDashboard;
