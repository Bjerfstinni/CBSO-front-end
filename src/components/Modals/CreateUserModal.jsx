import { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import CustomInput from './CustomInput';
import { createUser } from '../../api/auth'; // Import the createUser function
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateUser = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    middlename: '',
    email: '',
    role: '',
    password: '',
    confirmPass: '',
  });

  const handleClose = () => {
    setIsModalVisible(false);
    setFormData({
      firstname: '',
      lastname: '',
      middlename: '',
      email: '',
      role: '',
      password: '',
      confirmPass: '',
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
    if (formData.password !== formData.confirmPass) {
      toast.error('Passwords do not match!', { position: "top-right" });
      return;
    }
  
    try {
      await createUser({
        firstname: formData.firstname,
        lastname: formData.lastname,
        middlename: formData.middlename,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      });
  
      toast.success('User created successfully!', { position: "top-right" });
      handleClose(); // Close modal after success
    } catch (error) {
      toast.error(`Failed to create user: ${error.response?.data?.error || error.message}`, {
        position: "top-right",
      });
      console.error('Error creating user:', error);
    }
  };
  

  return (
    <>
      <button
        onClick={handleShow}
        className="rounded-md px-3 py-1 w-40 mb-2 border border-blue-600 bg-blue-500 text-white hover:bg-dark-green text-md font-medium outline-blue-400 focus:outline focus:outline-offset-2"
      >
        Create New
      </button>

      {isModalVisible && (
        <div className="flex backdrop-brightness-75 justify-center items-center fixed inset-0 z-50 overflow-auto">
          <div className="relative w-full sm:w-3/4 lg:w-2/6 lg:mx-5 mx-4">
            <div className="flex flex-col rounded-lg shadow-lg bg-white">
              <div className="flex items-center justify-between px-8 border-b rounded-t-md bg-gray-100">
                <h1 className="heading mb-2 pt-3 text-gray-700 text-2xl">Create New User</h1>
                <RiCloseFill
                  onClick={handleClose}
                  title="Close"
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <form className="p-6 flex flex-col" onSubmit={handleSubmit}>
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
                <label className="block text-md font-normal text-gray-700 mb-1" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="tracking-wide font-sans text-md font-normal shadow border border-gray-300 rounded w-full h-11 py-1 px-3 text-gray-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-cgreen ring-offset-2"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="president">President</option>
                  <option value="admin">Admin</option>
                  <option value="service engineer">Service Engineer</option>
                </select>
                <CustomInput
                  labelName="Password"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  isRequired
                />
                <CustomInput
                  labelName="Confirm Password"
                  id="confirmPass"
                  name="confirmPass"
                  type="password"
                  value={formData.confirmPass}
                  onChange={handleChange}
                  isRequired
                />
                <button
                  title="Create user"
                  className="mt-2 mb-2 border border-blue-500 bg-blue-600 text-white hover:bg-blue-500 text-md font-medium outline-blue-400 focus:outline focus:outline-offset-2 rounded-lg shadow hover:shadow-md w-full px-10 py-3"
                  type="submit"
                >
                  Create User
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

export default CreateUser;
