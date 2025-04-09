import { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import CustomInput from './CustomInput';
import { addStock } from '../../api/stocks';
import { getAllSuppliers } from '../../api/supplier';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStock = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    serial_number: '',
    machine_description: '',
    brand_name: '',
    model_name: '',
    warrant_end_date: '',
    quantity: '',
    supplier_id: '',
  });
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    // Fetch suppliers when the modal is shown
    if (isModalVisible) {
      const fetchSuppliers = async () => {
        try {
          const supplierList = await getAllSuppliers();
          setSuppliers(supplierList);
        } catch (error) {
          toast.error('Failed to fetch suppliers. Please try again later.');
          console.error('Error fetching suppliers:', error);
        }
      };

      fetchSuppliers();
    }
  }, [isModalVisible]);

  const handleClose = () => {
    setIsModalVisible(false);
    setFormData({
      serial_number: '',
      machine_description: '',
      brand_name: '',
      model_name: '',
      warrant_end_date: '',
      quantity: '',
      supplier_id: '',
    });
  };

  const handleShow = () => {
    setIsModalVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.serial_number ||
      !formData.machine_description ||
      !formData.brand_name ||
      !formData.model_name ||
      !formData.warrant_end_date ||
      !formData.quantity ||
      !formData.supplier_id
    ) {
      toast.error('All fields are required!', { position: 'top-right' });
      return;
    }

    try {
      await addStock({
        serial_number: formData.serial_number,
        model_name: formData.model_name,
        brand_name: formData.brand_name,
        machine_description: formData.machine_description,
        warrant_end_date: formData.warrant_end_date,
        quantity: parseInt(formData.quantity, 10),
        supplier_id: parseInt(formData.supplier_id, 10),
      });

      toast.success('Stock added successfully!', { position: 'top-right' });
      handleClose();
    } catch (error) {
      toast.error(
        `Failed to add stock: ${error.response?.data?.message || error.message}`,
        { position: 'top-right' }
      );
      console.error('Error adding stock:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleShow}
        className="rounded-md px-3 py-1 w-40 mb-2 border border-green-600 bg-green-500 hover:bg-green-600 text-white hover:bg-dark-green text-md font-medium outline-green-400 focus:outline focus:outline-offset-2"
      >
        Add Stock
      </button>

      {isModalVisible && (
        <div className="flex backdrop-brightness-75 justify-center items-center fixed inset-0 z-50 overflow-auto">
          <div className="relative w-full sm:w-3/4 lg:w-2/6 lg:mx-5 mx-4">
            <div className="flex flex-col rounded-lg shadow-lg bg-white">
              <div className="flex items-center justify-between px-8 border-b rounded-t-md bg-gray-100">
                <h1 className="heading mb-2 pt-3 text-gray-700 text-2xl">Add Stock</h1>
                <RiCloseFill
                  onClick={handleClose}
                  title="Close"
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <form className="p-6 flex flex-col" onSubmit={handleSubmit}>
                <label className="block text-md font-normal text-gray-700 mb-1" htmlFor="supplier_id">
                  Supplier Name
                </label>
                <select
                  id="supplier_id"
                  name="supplier_id"
                  value={formData.supplier_id}
                  onChange={handleChange}
                  required
                  className="tracking-wide font-sans text-md font-normal shadow border border-gray-300 rounded w-full h-11 py-1 px-3 text-gray-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-cgreen ring-offset-2"
                >
                  <option value="" disabled>
                    Select a supplier
                  </option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.supplier_name}
                    </option>
                  ))}
                </select>
                <CustomInput
                  labelName="Serial Number"
                  id="serial_number"
                  name="serial_number"
                  type="text"
                  value={formData.serial_number}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Machine Description"
                  id="machine_description"
                  name="machine_description"
                  type="text"
                  value={formData.machine_description}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Brand"
                  id="brand_name"
                  name="brand_name"
                  type="text"
                  value={formData.brand_name}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Model"
                  id="model_name"
                  name="model_name"
                  type="text"
                  value={formData.model_name}
                  onChange={handleChange}
                  isRequired
                />
                <label className="block text-md font-normal text-gray-700 mb-1" htmlFor="warrant_end_date">
                  Warranty End Date
                </label>
                <input
                  id="warrant_end_date"
                  name="warrant_end_date"
                  type="date"
                  value={formData.warrant_end_date}
                  onChange={handleChange}
                  required
                  className="tracking-wide font-sans text-md font-normal shadow border border-gray-300 rounded w-full h-11 py-1 px-3 text-gray-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-cgreen ring-offset-2"
                />
                <CustomInput
                  labelName="Quantity"
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  isRequired
                />
                <button
                  title="Add inventory"
                  className="mt-2 mb-2 border border-blue-500 bg-blue-600 text-white hover:bg-blue-500 text-md font-medium outline-blue-400 focus:outline focus:outline-offset-2 rounded-lg shadow hover:shadow-md w-full px-10 py-3"
                  type="submit"
                >
                  Add Inventory
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default AddStock;
