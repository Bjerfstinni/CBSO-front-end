import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { fetchSpecificHistoryTransaction } from '../../api/reports'; // Import the API function
import { getStocks } from '../../api/stocks'; // Import the getStocks function
import { getAllSuppliers } from '../../api/supplier'; // Import the getAllSuppliers function
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SpecificHistory = ({ serialNumber, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // State for suppliers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Fetch transactions
        const transactionData = await fetchSpecificHistoryTransaction(serialNumber);
        setTransactions(transactionData.data); // Ensure it's an array
  
        // Fetch stocks
        const stockData = await getStocks();
        setStocks(stockData);
  
        // Fetch suppliers
        const supplierData = await getAllSuppliers();
        setSuppliers(supplierData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data.');
        toast.error('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
  
    if (serialNumber) {
      fetchData();
    }
  }, [serialNumber]);
  

  const getStockDetailsBySerialNumber = (serialNumber) => {
    return stocks.find((stock) => stock.serial_number === serialNumber);
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((sup) => sup.id === supplierId);
    return supplier ? supplier.supplier_name : 'N/A';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-700">Transaction History</h2>
          <RiCloseFill
            className="text-2xl text-gray-500 cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : transactions.length === 0 ? (
            <p className="text-center">No transactions found for this serial number.</p>
          ) : (
            <div>
              {/* Display stock details */}
              {stocks.length > 0 && (
                <div className="mb-6 p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Details</h3>
                  {serialNumber && (
                    <div>
                      {getStockDetailsBySerialNumber(serialNumber) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">Serial Number:</span>
                            <span className="text-gray-800">{getStockDetailsBySerialNumber(serialNumber).serial_number}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">Machine Description:</span>
                            <span className="text-gray-800">{getStockDetailsBySerialNumber(serialNumber).machine_description}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">Model Name:</span>
                            <span className="text-gray-800">{getStockDetailsBySerialNumber(serialNumber).model_name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">Brand:</span>
                            <span className="text-gray-800">{getStockDetailsBySerialNumber(serialNumber).brand_name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">Total Stocks Remaining:</span>
                            <span className="text-gray-800">{getStockDetailsBySerialNumber(serialNumber).quantity}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600">No stock details found for this serial number.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* Display transaction details */}
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="py-2 px-4">Transaction ID</th>
                    <th className="py-2 px-4">Type</th>
                    <th className="py-2 px-4">Quantity</th>
                    <th className="py-2 px-4">Supplier</th>
                    <th className="py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{transaction.id}</td>
                      <td
                        className={`py-2 px-4 font-medium ${
                          transaction.type === 'IN' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type}
                      </td>
                      <td className="py-2 px-4">{transaction.quantity}</td>
                      <td className="py-2 px-4">{getSupplierName(transaction.supplier_id)}</td>
                      <td className="py-2 px-4">
                        {new Date(transaction.date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex justify-end p-4 border-t">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SpecificHistory;