import React, { useEffect, useState } from "react";
import { getStocks } from "../../api/stocks"; // Import the API function
import "react-toastify/dist/ReactToastify.css";

const OutOfStockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await getStocks();
        const outOfStockItems = response.data.filter((item) => item.quantity === 0);
        setStocks(outOfStockItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Out of Stock Items</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-center">S/N</th>
              <th className="py-3 px-6 text-left">Machine Description</th>
              <th className="py-3 px-6 text-left">Brand</th>
              <th className="py-3 px-6 text-left">Model</th>
              <th className="py-3 px-6 text-center">Stock Quantity</th>
              <th className="py-3 px-6 text-center">Warranty End Date</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length > 0 ? (
              stocks.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-6 text-center">{item.serial_number}</td>
                  <td className="py-3 px-6">{item.machine_description}</td>
                  <td className="py-3 px-6">{item.brand_name}</td>
                  <td className="py-3 px-6">{item.model_name}</td>
                  <td className="py-3 px-6 text-center text-red-600 font-bold">Out of Stock</td>
                  <td className="py-3 px-6 text-center">{new Date(item.warrant_end_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No out-of-stock items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutOfStockPage;
