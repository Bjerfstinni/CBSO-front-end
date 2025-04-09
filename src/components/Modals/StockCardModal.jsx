import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import { fetchStockControlCard } from '../../api/stocks'; // Import the new API function
import 'react-toastify/dist/ReactToastify.css';

const StockCard = ({ serialNumber, onClose }) => {
  const [stockControlData, setStockControlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchStockControlCard(serialNumber);
        setStockControlData(data);
      } catch (err) {
        console.error('Error fetching stock control card data:', err);
        setError('Failed to fetch stock control data.');
        toast.error('Failed to fetch stock control data.');
      } finally {
        setLoading(false);
      }
    };

    if (serialNumber) {
      fetchData();
    }
  }, [serialNumber]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-700">Stock Control Card</h2>
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
          ) : stockControlData.length === 0 ? (
            <p className="text-center">No stock control data found for this serial number.</p>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Stock In</th>
                  <th className="py-2 px-4">Stock Out</th>
                  <th className="py-2 px-4">Remaining Stock</th>
                </tr>
              </thead>
              <tbody>
                {stockControlData.map((record, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{record.date}</td>
                    <td className="py-2 px-4 text-green-600">{record.IN}</td>
                    <td className="py-2 px-4 text-red-600">{record.OUT}</td>
                    <td className="py-2 px-4 font-medium">{record.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default StockCard;
