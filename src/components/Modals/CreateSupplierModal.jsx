import { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import CustomInput from './CustomInput';
import { createSupplier } from '../../api/supplier'; // Use the new createSupplier API function
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateSupplierModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    region_name: '',
    region_code: '',
    city_name: '',
    barangay_name: '',
    purok: '',
    house_number: '',
    street_name: '',
    supplier_name: '', 
    province_name: ''
  });

  const handleClose = () => {
    setIsModalVisible(false);
    setFormData({
      region_name: '',
      region_code: '',
      city_name: '',
      barangay_name: '',
      purok: '',
      house_number: '',
      street_name: '',
      supplier_name: '', 
      province_name: '',
    });
  };

  const handleShow = () => setIsModalVisible(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.region_name ||
      !formData.region_code ||
      !formData.city_name ||
      !formData.barangay_name ||
      !formData.purok ||
      !formData.house_number ||
      !formData.street_name ||
      !formData.province_name ||
      !formData.supplier_name
    ) {
      toast.error('All fields are required!', { position: 'top-right' });
      return;
    }

    try {
      await createSupplier(formData); // Call the new API function
      toast.success('Supplier created successfully!', { position: 'top-right' });
      handleClose(); // Close the modal after successful creation
    } catch (error) {
      toast.error(`Failed to create supplier: ${error.response?.data?.error || error.message}`, {
        position: 'top-right',
      });
      console.error('Error creating supplier:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleShow}
        className="rounded-md px-3 py-1 w-40 mb-2 border border-green-600 bg-green-500 hover:bg-green-600 text-white hover:bg-dark-green text-md font-medium outline-green-400 focus:outline focus:outline-offset-2"
      >
        Add Supplier
      </button>

      {isModalVisible && (
        <div className="flex backdrop-brightness-75 justify-center items-center fixed inset-0 z-50 overflow-auto">
          <div className="relative w-full sm:w-3/4 lg:w-2/6 lg:mx-5 mx-4">
            <div className="flex flex-col rounded-lg shadow-lg bg-white">
              <div className="flex items-center justify-between px-8 border-b rounded-t-md bg-gray-100">
                <h1 className="heading mb-2 pt-3 text-gray-700 text-2xl">Create Supplier</h1>
                <RiCloseFill
                  onClick={handleClose}
                  title="Close"
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <form className="p-6 flex flex-col" onSubmit={handleSubmit}>
                <CustomInput
                  labelName="Region Name"
                  id="region_name"
                  name="region_name"
                  type="text"
                  value={formData.region_name}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Region Code"
                  id="region_code"
                  name="region_code"
                  type="text"
                  value={formData.region_code}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Province Name"
                  id="province_name"
                  name="province_name"
                  type="text"
                  value={formData.province_name}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="City Name"
                  id="city_name"
                  name="city_name"
                  type="text"
                  value={formData.city_name}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Barangay Name"
                  id="barangay_name"
                  name="barangay_name"
                  type="text"
                  value={formData.barangay_name}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Purok"
                  id="purok"
                  name="purok"
                  type="text"
                  value={formData.purok}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="House Number"
                  id="house_number"
                  name="house_number"
                  type="number"
                  value={formData.house_number}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Street Name"
                  id="street_name"
                  name="street_name"
                  type="text"
                  value={formData.street_name}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Supplier Name"
                  id="supplier_name"
                  name="supplier_name"
                  type="text"
                  value={formData.supplier_name}
                  onChange={handleChange}
                  isRequired
                />
                <button
                  title="Create Supplier"
                  className="mt-2 mb-2 border border-blue-500 bg-blue-600 text-white hover:bg-blue-500 text-md font-medium outline-blue-400 focus:outline focus:outline-offset-2 rounded-lg shadow hover:shadow-md w-full px-10 py-3"
                  type="submit"
                >
                  Create Supplier
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

export default CreateSupplierModal;
