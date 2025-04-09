import React, { useState, useEffect } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { fetchAllHistoryTransactions, getTotalStocks } from '../../api/reports';
import { getStocks } from '../../api/stocks';
import { getAllSuppliers } from '../../api/supplier';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OverallHistory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState({});
  const [totalStocks, setTotalStocks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortColumn, setSortColumn] = useState('transaction_id');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleShow = () => {
    setIsModalVisible(true);
    loadTransactions();
    loadTotalStocks();
    loadSuppliers();
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setTransactions([]);
    setLoading(true);
    setError(null);
  };

  const loadTransactions = async () => {
    try {
      const response = await fetchAllHistoryTransactions();
  
      if (!response || !Array.isArray(response.data)) {
        console.error("Invalid transactions data received:", response);
        setTransactions([]); // Ensure transactions is always an array
        return;
      }
  
      setTransactions(response.data); // Extract only the array part
      await loadStocks();
    } catch (err) {
      console.error("Error loading transactions:", err);
      setTransactions([]); // Ensure transactions is always an array
      setError("No transactions yet.");
      toast.info("No transactions yet.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };
  
  

  const loadStocks = async () => {
    try {
      const stockData = await getStocks(1, 100);
      console.log("Fetched stocks:", stockData);
  
      // Ensure we extract the `data` array correctly
      setStocks(stockData.data || []);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError('Failed to fetch stock data.');
      toast.error('Failed to fetch stock data.', { position: 'top-right' });
    }
  };
  
  

  const loadTotalStocks = async () => {
    try {
      const data = await getTotalStocks();
      setTotalStocks(data.total);
    } catch (err) {
      console.error('Error fetching total stocks:', err);
      setError('Failed to fetch total stocks.');
      toast.error('Failed to fetch total stocks.', { position: 'top-right' });
    }
  };

  const loadSuppliers = async () => {
    try {
      const supplierData = await getAllSuppliers();
      const supplierMap = supplierData.reduce((map, supplier) => {
        map[supplier.id] = supplier.supplier_name;
        return map;
      }, {});
      setSuppliers(supplierMap);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      toast.error('Failed to fetch supplier data.', { position: 'top-right' });
    }
  };

  const getStockDetailsBySerialNumber = (serialNumber) => {
    if (!serialNumber) return undefined;
  
    // Convert serial numbers to lowercase & trim spaces for a more robust match
    const stock = stocks.find(stock => stock.serial_number.trim().toLowerCase() === serialNumber.trim().toLowerCase());
  
    if (!stock) {
      console.warn(`No stock found for serial number: "${serialNumber}"`);
      console.log("All stock serial numbers:", stocks.map(stock => stock.serial_number));
    }
  
    return stock;
  };
  
  

  const sortTransactions = (transactions2) => {
    if (!Array.isArray(transactions2)) {
      console.error("sortTransactions expected an array but got:", transactions2);
      return [];
    }
  
    return transactions2.sort((a, b) => {
      if (sortColumn === 'transaction_id') {
        return sortDirection === 'desc' ? b.id - a.id : a.id - b.id;
      } else if (sortColumn === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
  };
  
  

  return (
    <>
      <button onClick={handleShow} className="rounded-md px-3 py-1 w-40 mb-2 border border-blue-600 bg-blue-500 text-white hover:bg-blue-600 text-md font-medium outline-blue-400 focus:outline focus:outline-offset-2">
        View History
      </button>

      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b bg-gray-100">
              <h2 className="text-xl font-semibold text-gray-700">Overall Transaction History</h2>
              <RiCloseFill className="text-3xl text-red-500 cursor-pointer hover:text-red-600" onClick={handleClose} title="Close" />
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <p className="text-center">Loading transactions...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : transactions.length === 0 ? (
                <p className="text-center">No transactions found.</p>
              ) : (
                <>
                  <p className="mb-4 text-lg font-bold">Total Stocks Remaining: {totalStocks}</p>
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th className="py-2 px-4">Serial Number</th>
                        <th className="py-2 px-4">Transaction ID</th>
                        <th className="py-2 px-4">Type</th>
                        <th className="py-2 px-4">Quantity</th>
                        <th className="py-2 px-4">Supplier</th>
                        <th className="py-2 px-4">Model</th>
                        <th className="py-2 px-4">Brand</th>
                        <th className="py-2 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortTransactions(transactions).map((transaction) => {
                        const stock = getStockDetailsBySerialNumber(transaction.serial_number);
                        return (
                          <tr key={transaction.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{transaction.serial_number}</td>
                            <td className="py-2 px-4">{transaction.id}</td>
                            <td className={`py-2 px-4 font-medium ${transaction.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>{transaction.type}</td>
                            <td className="py-2 px-4">{transaction.quantity}</td>
                            <td className="py-2 px-4">{suppliers[transaction.supplier_id] || 'N/A'}</td>
                            <td className="py-2 px-4">{stock?.model_name || 'N/A'}</td>
                            <td className="py-2 px-4">{stock?.brand_name || 'N/A'}</td>
                            <td className="py-2 px-4">{new Date(transaction.date).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default OverallHistory;
