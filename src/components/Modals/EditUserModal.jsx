import React, { useState, useEffect } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { getUserInformation, updateUser } from '../../api/auth';
import CustomInput from './CustomInput'; 
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const EditUserModal = ({ userId, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    middlename: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch user details when the modal opens
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userDetails = await getUserInformation(userId);
        setFormData({
          firstname: userDetails.data.firstname || '',
          lastname: userDetails.data.lastname || '',
          middlename: userDetails.data.middlename || '',
          email: userDetails.data.email || '',
        });
      } catch (error) {
        toast.error('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDetails();
  }, [userId]);

  const handleClose = () => {
    setFormData({
      firstname: '',
      lastname: '',
      middlename: '',
      email: '',
    });
    onClose();
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userId, formData);
      toast.success('User details updated successfully!', { position: "top-right" });
      onUserUpdated(); // Refresh user list in parent component
      setTimeout(() => {
        handleClose();
      }, 1000);// Use handleClose to reset and close modal
    } catch (error) {
      toast.error(`Failed to update user: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex backdrop-brightness-75 justify-center items-center fixed inset-0 z-50 overflow-auto">
        <div className="relative w-full sm:w-3/4 lg:w-2/6 lg:mx-5 mx-4">
          <div className="flex flex-col rounded-lg shadow-lg bg-white p-6">
            Loading user details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex backdrop-brightness-75 justify-center items-center fixed inset-0 z-50 overflow-auto">
      <div className="relative w-full sm:w-3/4 lg:w-2/6 lg:mx-5 mx-4">
        <div className="flex flex-col rounded-lg shadow-lg bg-white">
          <div className="flex items-center justify-between px-8 border-b rounded-t-md bg-gray-100 py-4">
            <h1 className="heading mb-2 pt-3 text-gray-700 text-2xl">Edit User</h1>
            <RiCloseFill
              className="text-3xl cursor-pointer text-red-500"
              onClick={handleClose} // Use handleClose here
            />
          </div>
          <form onSubmit={handleSubmit} className="p-6 flex flex-col">
            <CustomInput
              labelName="Firstname"
              id="firstname"
              name="firstname"
              type="text"
              value={formData.firstname}
              onChange={handleChange}
              isRequired
            />
            <CustomInput
              labelName="Middlename"
              id="middlename"
              name="middlename"
              type="text"
              value={formData.middlename}
              onChange={handleChange}
            />
            <CustomInput
              labelName="Lastname"
              id="lastname"
              name="lastname"
              type="text"
              value={formData.lastname}
              onChange={handleChange}
              isRequired
            />
            <CustomInput
              labelName="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              isRequired
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mt-2"
            >
              Update User
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditUserModal;
