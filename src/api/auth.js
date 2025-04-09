// api/auth.js
import api from './axios';

// Function to create a new user (register)
export const createUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error.response.data);
    throw error;
  }
};

// Function to log in a user
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response.data);
    throw error;
  }
};

// Function to get user information
export const getUserInformation = async (id) => {
  try {
    const response = await api.get(`auth/user-information/${id}`); // Updated path
    return response.data;
  } catch (error) {
    console.error("Error fetching user information:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Deactivate a user by ID.
 * @param {number} userId - The ID of the user to deactivate.
 * @returns {Promise<Object>} - The response data.
 */
export const deactivateUser = async (userId) => {
  try {
    const response = await api.put(`/auth/deactivate-user/${userId}`);
    return response.data; // Expected: { "message": "User has been deactivated successfully" }
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw new Error(error.response?.data?.message || "Failed to deactivate user.");
  }
};



// Function to delete a user
export const removeUser = async (id) => {
  try {
    const response = await api.delete(`/auth/delete-user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error.response.data);
    throw error;
  }
};

// Function to update user status
export const updateUserStatus = async (id, status) => {
  try {
    const response = await api.put(`/auth/update-status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error.response.data);
    throw error;
  }
};

// Function to get all service engineers
export const getServiceEngineers = async () => {
  try {
    const response = await api.get('/auth/service-engineer');
    return response.data;
  } catch (error) {
    console.error("Error fetching service engineers:", error.response.data);
    throw error;
  }
};

// Function to get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/auth/all-users');
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error.response.data);
    throw error;
  }
};

// Function to fetch login history logs with pagination
export const getLoginHistory = async (page = 1, limit = 5) => {
  try {
    const response = await api.get(`/auth/logs?page=${page}&limit=${limit}`);
    return response.data; // This will return { currentPage, totalPages, totalLogs, logs }
  } catch (error) {
    console.error("Error fetching login history:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Updates user information.
 *
 * @param {number} userId - The ID of the user to update.
 * @param {Object} updateData - The fields to update (email, firstname, lastname, middlename).
 * @returns {Promise<Object>} - The response data.
 */
export const updateUser = async (userId, updateData) => {
  if (!userId) throw new Error("User ID is required.");

  try {
    const response = await api.patch(
      `/auth/update-user/?user_id=${userId}`, // Endpoint URL with query parameter
      updateData, // Request payload with fields to update
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // Return the successful response
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(error.response?.data?.error || "Failed to update user.");
  }
};

