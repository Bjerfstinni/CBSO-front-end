import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createNewOrder } from '../../api/order'; 
import { getServiceEngineers } from '../../api/auth'; 
import { getStocks } from '../../api/stocks'; 
import JwtDecoder from "../../utils/jwtDecoder";
import axios from 'axios';

const CreateOrderPage = () => {
  const { decodedToken, isTokenValid } = JwtDecoder();

  const [formData, setFormData] = useState({
    clientName: '',
    zipCode: '',
    regionCode: '',
    provinceCode: '',
    cityCode: '',
    barangayCode: '',
    purok: '',
    houseNumber: '',
    streetName: '',
    poNumber: '',
    assignedEngineer: '',
    preparedBy: '',
    deliveryDate: '',
  });

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [orders, setOrders] = useState([
    { serialNumber: '', quantity: '', serviceTypes: [], remainingQuantity: null },
  ]);

  const [loading, setLoading] = useState(false);
  const [engineersLoading, setEngineersLoading] = useState(false);
  const [engineers, setEngineers] = useState([]);
  const [stocks, setStocks] = useState([]);

  const serviceOptions = [
    { id: 1, name: 'Distribution' },
    { id: 2, name: 'Installation' },
    { id: 3, name: 'Demonstration' },
    { id: 4, name: 'Inspection' },
    { id: 5, name: 'Repair and Maintenance' },
  ];

  useEffect(() => {
    const fetchEngineers = async () => {
      setEngineersLoading(true);
      try {
        const data = await getServiceEngineers();
        setEngineers(data);
      } catch (err) {
        console.error('Error fetching service engineers:', err);
        toast.warning('No service engineer found');
      } finally {
        setEngineersLoading(false);
      }
    };

    const fetchStocks = async () => {
      try {
        const data = await getStocks();
        setStocks(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Error fetching stocks:", err);
        toast.error("Error fetching stocks data.");
      }
    };

    const fetchRegions = async () => {
      try {
        const response = await axios.get('https://psgc.gitlab.io/api/regions/');
        setRegions(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchEngineers();
    fetchStocks();
    fetchRegions();

    if (isTokenValid && decodedToken?.id) {
      setFormData((prevState) => ({
        ...prevState,
        preparedBy: decodedToken.id,
      }));
    }
  }, [isTokenValid, decodedToken]);

  useEffect(() => {
    const fetchProvinces = async () => {
      if (formData.regionCode) {
        try {
          const response = await axios.get(`https://psgc.gitlab.io/api/regions/${formData.regionCode}/provinces/`);
          setProvinces(response.data);
        } catch (error) {
          console.error('Error fetching provinces:', error);
        }
      } else {
        setProvinces([]);
      }
    };

    fetchProvinces();
  }, [formData.regionCode]);

  useEffect(() => {
    const fetchCities = async () => {
      if (formData.provinceCode) {
        try {
          const response = await axios.get(`https://psgc.gitlab.io/api/provinces/${formData.provinceCode}/cities-municipalities/`);
          setCities(response.data);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [formData.provinceCode]);

  useEffect(() => {
    const fetchBarangays = async () => {
      if (formData.cityCode) {
        try {
          const response = await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${formData.cityCode}/barangays/`);
          setBarangays(response.data);
        } catch (error) {
          console.error('Error fetching barangays:', error);
        }
      } else {
        setBarangays([]);
      }
    };

    fetchBarangays();
  }, [formData.cityCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOrderChange = (index, field, value) => {
    const updatedOrders = [...orders];
    if (field === 'serialNumber') {
      updatedOrders[index][field] = value;
      debouncedCheckRemainingQuantity(index, value);
    } else if (field === 'serviceTypes') {
      const serviceType = parseInt(value);
      updatedOrders[index].serviceTypes = updatedOrders[index].serviceTypes.includes(serviceType)
        ? updatedOrders[index].serviceTypes.filter((id) => id !== serviceType)
        : [...updatedOrders[index].serviceTypes, serviceType];
    } else {
      updatedOrders[index][field] = value;
    }
    setOrders(updatedOrders);
  };

  const addOrder = () => {
    setOrders([...orders, { serialNumber: '', quantity: '', serviceTypes: [] }]);
  };

  const removeOrder = (index) => {
    setOrders(orders.filter((_, i) => i !== index));
  };

  const debouncedCheckRemainingQuantity = (index, serialNumber) => {
    clearTimeout(window.debounceTimer);
    window.debounceTimer = setTimeout(() => {
      checkRemainingQuantity(index, serialNumber);
    }, 500); // 500ms debounce delay
  };

  const checkRemainingQuantity = (index, serialNumber) => {
    if (!Array.isArray(stocks)) {
      console.error("Stocks is not an array", stocks);
      return;
    }
  
    const stockItem = stocks.find(stock => stock.serial_number?.toLowerCase() === serialNumber.toLowerCase());
  
    const updatedOrders = [...orders];
    updatedOrders[index].remainingQuantity = stockItem ? stockItem.quantity : null;
    setOrders(updatedOrders);
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const orderData = {
      region_code: formData.zipCode,
      region_name: formData.regionCode,
      province_name: formData.provinceCode,
      city_name: formData.cityCode,
      barangay_name: formData.barangayCode,
      purok: formData.purok,
      house_number: parseInt(formData.houseNumber, 10), // Ensure number type
      street_name: formData.streetName,
      client_name: formData.clientName,
      assigned_user: parseInt(formData.assignedEngineer, 10), // Ensure number type
      prepared_by: parseInt(formData.preparedBy, 10), // Ensure number type
      purchase_order_number: formData.poNumber,
      delivery_date: formData.deliveryDate,
      service_complete_date: "2024-01-10", // Placeholder; update based on your logic
      status: "pending",
      orders: orders.map(({ serialNumber, quantity, serviceTypes }) => ({
        serial_number: serialNumber,
        quantity: parseInt(quantity, 10),
        service_type_ids: serviceTypes.map((id) => parseInt(id, 10)), // Ensure number type for service IDs
      })),
    };
  
    try {
      const response = await createNewOrder(orderData);
      toast.success("Order created successfully!");
      console.log("Response:", response);
      // Reset form
      setFormData({
        clientName: '',
        zipCode: '',
        regionCode: '',
        provinceCode: '',
        cityCode: '',
        barangayCode: '',
        purok: '',
        houseNumber: '',
        streetName: '',
        poNumber: '',
        assignedEngineer: '',
        preparedBy: '',
        deliveryDate: '',
      });
      setOrders([{ serialNumber: '', quantity: '', serviceTypes: [] }]);
    } catch (error) {
      console.error("Error creating order: ", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred while creating the order.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Create New Order</h1>
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <form onSubmit={handleSubmit}>
          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter Zip Code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                name="regionCode"
                value={formData.regionCode}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select a region</option>
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                name="provinceCode"
                value={formData.provinceCode}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                disabled={!formData.regionCode}
              >
                <option value="">Select a province</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City/Municipality</label>
              <select
                name="cityCode"
                value={formData.cityCode}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                disabled={!formData.provinceCode}
              >
                <option value="">Select a city/municipality</option>
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
              <select
                name="barangayCode"
                value={formData.barangayCode}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                disabled={!formData.cityCode}
              >
                <option value="">Select a barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay.code} value={barangay.code}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purok</label>
              <input
                type="text"
                name="purok"
                value={formData.purok}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter purok"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter house number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Name</label>
              <input
                type="text"
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter street name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Order Number</label>
              <input
                type="text"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter PO number"
              />
            </div>  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Engineer Dropdown */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Engineer</label>
            {engineersLoading ? (
              <p>Loading engineers...</p>
            ) : (
              <select
                name="assignedEngineer"
                value={formData.assignedEngineer}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select an engineer</option>
                {engineers.map((engineer) => (
                  <option key={engineer.id} value={engineer.id}>
                    {`${engineer.firstname} ${engineer.middlename} ${engineer.lastname}`}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {/* Orders Section */}
          <h2 className="text-xl font-bold mt-6">Items</h2>
          {orders.map((order, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <h3 className="font-bold mb-2">Item {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Serial Number"
                  value={order.serialNumber}
                  onChange={(e) => handleOrderChange(index, 'serialNumber', e.target.value)}
                  className="block w-full px-4 py-2 border rounded-md"
                />
                {order.remainingQuantity !== null && (
                  <p className="mt-2 text-sm text-green-600">
                    Remaining Quantity: {order.remainingQuantity}
                  </p>
                )}
                {order.remainingQuantity === null && order.serialNumber && (
                  <p className="mt-2 text-sm text-red-600">Serial Number not found.</p>
                )}
                <input
                  type="number"
                  placeholder="Quantity"
                  value={order.quantity}
                  onChange={(e) => handleOrderChange(index, 'quantity', e.target.value)}
                  className="block w-full px-4 py-2 border rounded-md"
                />
                <div>
                  {serviceOptions.map((service) => (
                    <label key={service.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={service.id}
                        checked={order.serviceTypes.includes(service.id)}
                        onChange={(e) => handleOrderChange(index, 'serviceTypes', e.target.value)}
                      />
                      <span>{service.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {orders.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOrder(index)}
                  className="text-red-600 mt-2"
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOrder}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Add Item
          </button>

          {/* Submit Button */}
          <div className="mt-8 text-right">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateOrderPage;
