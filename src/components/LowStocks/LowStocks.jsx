import React, { useEffect, useState } from "react";
import { getStocks } from "../../api/stocks"; // Import the API function
import "react-toastify/dist/ReactToastify.css";

const LowStockInventory = () => {
    const [lowStocks, setLowStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchLowStocks = async () => {
        try {
          const response = await getStocks();
          const filteredStocks = response.data.filter((item) => item.quantity <= 10);
          setLowStocks(filteredStocks);
        } catch (err) {
          setError("Failed to fetch low stocks.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchLowStocks();
    }, []);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
  
    return (
      <div className="min-h-screen mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Low Stocks</h1>
  
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="text-xs text-gray-500 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-center border">S/N</th>
                <th className="py-3 px-6 text-left border">Machine Description</th>
                <th className="py-3 px-6 text-left border">Brand</th>
                <th className="py-3 px-6 text-left border">Model</th>
                <th className="py-3 px-6 text-center border">Stock Quantity</th>
                <th className="py-3 px-6 text-center border">Warranty End Date</th>
              </tr>
            </thead>
            <tbody>
              {lowStocks.length > 0 ? (
                lowStocks.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-6 text-center">{item.serial_number}</td>
                    <td className="py-3 px-6">{item.machine_description}</td>
                    <td className="py-3 px-6">{item.brand_name}</td>
                    <td className="py-3 px-6">{item.model_name}</td>
                    <td className="py-3 px-6 text-center text-red-600 font-bold">
                      {item.quantity === 0 ? "Out of Stock" : item.quantity}
                    </td>
                    <td className="py-3 px-6 text-center">{new Date(item.warrant_end_date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No low stocks available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

export default LowStockInventory;
