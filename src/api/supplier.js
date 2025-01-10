// api/supplier.js
import api from './axios';

/**
 * Creates a new supplier.
 * @param {Object} supplierData - The data for the new supplier.
 * @param {string} supplierData.region_name - Region name of the supplier.
 * @param {string} supplierData.region_code - Region code of the supplier.
 * @param {string} supplierData.city_name - City name of the supplier.
 * @param {string} supplierData.barangay_name - Barangay name of the supplier.
 * @param {string} supplierData.purok - Purok of the supplier.
 * @param {number} supplierData.house_number - House number of the supplier.
 * @param {string} supplierData.street_name - Street name of the supplier.
 * @param {string} supplierData.supplier_name - Name of the supplier.
 * @returns {Promise<Object>} - The response from the API.
 */
export const createSupplier = async (supplierData) => {
  try {
    const response = await api.post('/api/create-supplier', supplierData);
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to create supplier.');
  }
};


/**
 * Fetches all suppliers from the API.
 * @returns {Promise<Array>} - A promise resolving to an array of suppliers.
 */
export const getAllSuppliers = async () => {
  try {
    const response = await api.get('/api/all-supplier');
    return response.data; // The array of suppliers
  } catch (error) {
    console.error('Error fetching all suppliers:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch suppliers.');
  }
};



/**
 * Deletes a supplier by ID.
 * @param {number} id - The ID of the supplier to delete.
 * @returns {Promise<Object>} - A promise resolving to the server's response message.
 */
export const deleteSupplier = async (id) => {
  try {
    const response = await api.delete(`/api/delete-supplier/${id}`);
    return response.data; // { message: "successfully delete user" }
  } catch (error) {
    console.error('Error deleting supplier:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to delete supplier.');
  }
};
