import React, { useState, useEffect } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import CustomInput from './CustomInput';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { stockIn } from "../../api/stocks";
import { getAllSuppliers } from "../../api/supplier";

const StockIn = ({ item, closeModal }) => {
  const [formData, setFormData] = useState({
    serial_number: "",
    quantity: "",
    supplier_id: "",
    stockInDate: "",
  });

  const [headerData, setHeaderData] = useState({
    serial_number: "",
    machine_description: "",
    quantity: "",
  });

  const [suppliers, setSuppliers] = useState([]);

  // Fetch suppliers when component mounts
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Failed to load suppliers.");
      }
    };

    fetchSuppliers();
  }, []);

  // Populate data from the selected item
  useEffect(() => {
    if (item) {
      setHeaderData({
        serial_number: item.serialNumber,
        machine_description: item.description,
        quantity: item.quantityStock,
      });

      setFormData({
        serial_number: item.serialNumber,
        quantity: "",
        supplier_id: "",
        stockInDate: "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.quantity || !formData.supplier_id || !formData.stockInDate) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await stockIn({
        serial_number: formData.serial_number,
        quantity: parseInt(formData.quantity, 10),
        supplier_id: parseInt(formData.supplier_id, 10),
        stockInDate: new Date(formData.stockInDate).toISOString(),
      });

      if (response.message === "Stock updated successfully") {
        toast.success("Stocks updated successfully!");
        closeModal();
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error during stock-in:", error.message);
      toast.error("Failed to update stocks. Please try again.");
    }
  };

  const isLowStock = parseInt(headerData.quantity, 10) <= 10;

  return (
    <div className="flex backdrop-brightness-75 justify-center items-center fixed inset-0 z-50 overflow-auto">
      <div className="relative w-full sm:w-3/4 lg:w-2/6 lg:mx-5 mx-4">
        <div className="flex flex-col rounded-lg shadow-lg bg-white">
          <div className="flex flex-col px-8 border-b rounded-t-md bg-gray-100 py-4">
            <div className="flex items-center justify-between">
              <h1 className="heading mb-2 pt-3 text-gray-700 text-2xl">Stock In</h1>
              <RiCloseFill className="text-3xl cursor-pointer text-red-500" onClick={closeModal} />
            </div>
            <div className="mt-3">
              <label className="block text-md text-gray-700 font-normal mb-1">Serial Number</label>
              <input
                id="serial_number"
                name="serial_number"
                type="text"
                value={formData.serial_number}
                readOnly
                disabled
                className="tracking-wide font-sans text-md font-normal shadow border border-gray-300 rounded w-full h-11 py-1 px-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-gray-600"><strong>Machine Description:</strong></p>
                <p className="text-gray-700 font-medium">{headerData.machine_description}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-lg"><strong>Stock on hand:</strong></p>
                <p
                  className={`text-xl font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}
                >
                  {headerData.quantity}
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 flex flex-col">
            <div className="mb-4">
              <label className="block text-md text-gray-700 font-normal mb-1">Supplier</label>
              <select
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                className="w-full h-11 border border-gray-300 rounded px-3"
                required
              >
                <option value="">Select a supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.supplier_name}
                  </option>
                ))}
              </select>
            </div>
            <CustomInput
              labelName="Quantity"
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              isRequired
            />
            <CustomInput
              labelName="Transaction Date"
              id="stockInDate"
              name="stockInDate"
              type="date"
              value={formData.stockInDate}
              onChange={handleChange}
              isRequired
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mt-2"
            >
              Stock In
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StockIn;
