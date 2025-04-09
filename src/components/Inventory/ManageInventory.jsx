import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the hook
import PaginateButton from "../CustomComponents/PaginateButton";
import ReportsModal from "../Modals/ReportsModal";
import StockInModal from "../Modals/StockInModal";
import AddStockModal from "../Modals/AddStockModal";
import SpecificHistoryModal from "../Modals/SpecificHistoryModal";
import { getStocks } from "../../api/stocks";
import { fetchSpecificHistoryTransaction, getTotalStocks } from "../../api/reports";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OverallHistoryModal from "../Modals/OverallHistoryModal";

const ManageInventory = () => {
  const [page, setPage] = useState(1);
  const [stocks, setStocks] = useState([]);
  const [totalStocks, setTotalStocks] = useState(0); // New state for total stocks
  const [lowStockCount, setLowStockCount] = useState(0); // New state for low stock count
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isSpecificHistoryModalOpen, setIsSpecificHistoryModalOpen] = useState(false);
  const [specificTransactions, setSpecificTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [isOverallHistoryOpen, setIsOverallHistoryOpen] = useState(false);

  const [sortColumn, setSortColumn] = useState("serialNumber"); // Track the sorted column
  const [sortDirection, setSortDirection] = useState("asc"); // Track sort direction

  const navigate = useNavigate();

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const data = await getStocks(page, itemsPerPage);
        const transformedStocks = data.data.map((stock) => ({
          serialNumber: stock.serial_number,
          description: stock.machine_description,
          brand: stock.brand_name,
          model: stock.model_name,
          quantityStock: stock.quantity,
          warrantyDate: new Date(stock.warrant_end_date).toLocaleDateString(),
        }));
        setStocks(transformedStocks);
  
        const lowStocks = transformedStocks.filter((stock) => stock.quantityStock <= 10).length;
        setLowStockCount(lowStocks);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        toast.info("No stocks added");
      } finally {
        setLoading(false);
      }
    };
  
    const fetchTotalStocks = async () => {
      try {
        const response = await getTotalStocks(); // Fetch total stock count
    
        // Check if response contains the correct key
        if (response && response.total !== undefined) {
          setTotalStocks(response.total); // Use correct key from API response
        } else {
          console.error("Invalid total stocks response:", response);
        }
      } catch (error) {
        console.error("Error fetching total stocks:", error);
      }
    };
    
  
    fetchStocks();
    fetchTotalStocks(); // Fetch total stock count separately
  }, [page]); // Refetch when `page` changes
  
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to the first page when searching
  };

  const filteredStocks = stocks.filter(
    (item) =>
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortData = (column) => {
    const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);

    // Sorting logic here
    const sortedStocks = [...filteredStocks].sort((a, b) => {
      if (column === "serialNumber") {
        return direction === "asc"
          ? a.serialNumber.localeCompare(b.serialNumber)
          : b.serialNumber.localeCompare(a.serialNumber);
      }
      if (column === "description" || column === "brand" || column === "model") {
        return direction === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      if (column === "quantityStock") {
        return direction === "asc" ? a[column] - b[column] : b[column] - a[column];
      }
      if (column === "warrantyDate") {
        return direction === "asc"
          ? new Date(a[column]) - new Date(b[column])
          : new Date(b[column]) - new Date(a[column]);
      }
      return 0;
    });

    setStocks(sortedStocks);
  };

  const paginatedStocks = filteredStocks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalRecords = filteredStocks.length;
  const numberOfPages = Math.ceil(totalRecords / itemsPerPage);

  const handleStockInClick = (item) => {
    setSelectedStockItem(item);
    setIsStockInModalOpen(true);
  };

  const handleStockOutClick = (item) => {
    navigate("/dashboard/create-order", { state: { stockItem: item } });
  };

  const handleViewTransactionsClick = async (item) => {
    setSelectedStockItem(item);
    setIsFetchingHistory(true);

    try {
      const transactions = await fetchSpecificHistoryTransaction(item.serialNumber);
      setSpecificTransactions(transactions);
      setIsSpecificHistoryModalOpen(true);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("Failed to fetch transaction history");
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const closeModal = () => {
    setIsStockInModalOpen(false);
    setIsSpecificHistoryModalOpen(false);
    setIsOverallHistoryOpen(false);
  };

  if (loading) {
    return <p>Loading stocks...</p>;
  }

  return (
    <div className="min-h-screen mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage Inventory</h1>       
        <div className="bg-white border border-gray-300 rounded-md px-6 py-3 shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">
            Overall Stocks:{" "}
            <span className="text-green-600 text-2xl font-bold">{totalStocks}</span>
          </h2>
          <h2 className="text-xl font-semibold text-gray-700">
            Low Stocks:{" "}
            <span className="text-red-600 text-2xl font-bold">{lowStockCount}</span>
          </h2>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Serial Number or Description"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Add Stock and View History buttons */}
      <div className="flex gap-2 mb-2">
        <AddStockModal />
        <OverallHistoryModal />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="text-xs text-gray-500 uppercase bg-gray-100">
  <tr>
    <th
      className="py-3 px-6 text-center cursor-pointer border-l border-r border-gray-400 hover:border-gray-600 hover:bg-indigo-50"
      onClick={() => sortData("serialNumber")}
    >
      S/N{" "}
      {sortColumn === "serialNumber" && (sortDirection === "asc" ? "↑" : "↓")}
    </th>
    <th
      className="py-3 px-6 text-left cursor-pointer border-l border-r border-gray-400 hover:border-gray-600 hover:bg-indigo-50"
      onClick={() => sortData("description")}
    >
      Machine Description{" "}
      {sortColumn === "description" && (sortDirection === "asc" ? "↑" : "↓")}
    </th>
    <th
      className="py-3 px-6 text-left cursor-pointer border-l border-r border-gray-400 hover:border-gray-600 hover:bg-indigo-50"
      onClick={() => sortData("brand")}
    >
      Brand{" "}
      {sortColumn === "brand" && (sortDirection === "asc" ? "↑" : "↓")}
    </th>
    <th
      className="py-3 px-6 text-left cursor-pointer border-l border-r border-gray-400 hover:border-gray-600 hover:bg-indigo-50"
      onClick={() => sortData("model")}
    >
      Model{" "}
      {sortColumn === "model" && (sortDirection === "asc" ? "↑" : "↓")}
    </th>
    <th
      className="py-3 px-6 text-center cursor-pointer border-l border-r border-gray-400 hover:border-gray-600 hover:bg-indigo-50"
      onClick={() => sortData("quantityStock")}
    >
      Stock Quantity{" "}
      {sortColumn === "quantityStock" && (sortDirection === "asc" ? "↑" : "↓")}
    </th>
    <th
      className="py-3 px-6 text-center cursor-pointer border-l border-r border-gray-400 hover:border-gray-600 hover:bg-indigo-50"
      onClick={() => sortData("warrantyDate")}
    >
      Warranty End Date{" "}
      {sortColumn === "warrantyDate" && (sortDirection === "asc" ? "↑" : "↓")}
    </th>
    <th className="py-3 px-6 text-center">Action</th>
  </tr>
</thead>
<tbody>
  {paginatedStocks.map((item, index) => (
    <tr key={index} className="border-b">
      <td className="py-3 px-6 text-center">{item.serialNumber}</td>
      <td className="py-3 px-6">{item.description}</td>
      <td className="py-3 px-6">{item.brand}</td>
      <td className="py-3 px-6">{item.model}</td>
      <td
  className={`py-3 px-6= text-center ${
    item.quantityStock === 0
      ? "text-sm text-red-600 font-bold"
      : item.quantityStock <= 10
      ? "text-red-600 font-bold"
      : ""
  }`}
>
  {item.quantityStock === 0 ? "Out of Stock" : item.quantityStock}
</td>
      <td className="py-3 px-6 text-center">{item.warrantyDate}</td>
      <td className="py-3 px-6 text-center">
        <div className="flex gap-2 justify-center">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
            onClick={() => handleStockInClick(item)}
          >
            Stock In
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
            onClick={() => handleStockOutClick(item)}
          >
            Stock Out
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={() => handleViewTransactionsClick(item)}
          >
            History
          </button>
        </div>
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
        itemsPerPage={itemsPerPage}
        spanCSS="flex justify-between items-center gap-x-3"
        divTailwindcss="flex justify-between items-center mt-1"
        bttnTailwindcss="bg-white border border-blue-300 px-2 gap-2 h-8 text-gray-700 rounded-md px-2 focus:shadow-outline focus:outline-none focus:ring-1 ring-blue-300 ring-offset-2"
      />

      {isStockInModalOpen && <StockInModal item={selectedStockItem} closeModal={closeModal} />}
      {isSpecificHistoryModalOpen && (
        <SpecificHistoryModal
          serialNumber={selectedStockItem.serialNumber}
          onClose={() => setIsSpecificHistoryModalOpen(false)}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageInventory;