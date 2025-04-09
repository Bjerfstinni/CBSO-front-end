import api from './axios';

/**
 * Sends a new order request to the server.
 * @param {Object} orderData - The data for the new order.
 * @param {string} orderData.region_name - The name of the region.
 * @param {string} orderData.region_code - The region code.
 * @param {string} orderData.city_name - The name of the city.
 * @param {string} orderData.barangay_name - The name of the barangay.
 * @param {string} orderData.purok - The purok information.
 * @param {number} orderData.house_number - The house number.
 * @param {string} orderData.street_name - The name of the street.
 * @param {string} orderData.client_name - The name of the client.
 * @param {number} orderData.assigned_user - The ID of the assigned user.
 * @param {number} orderData.prepared_by - The ID of the user who prepared the order.
 * @param {string} orderData.purchase_order_number - The purchase order number.
 * @param {string} orderData.status - The order status (e.g., "pending").
 * @param {string} orderData.delivery_date - The delivery date in ISO format.
 * @param {string} orderData.service_complete_date - The service completion date in ISO format.
 * @param {Array} orderData.orders - Array of order items.
 * @param {string} orderData.orders[].serial_number - The serial number of the order item.
 * @param {number} orderData.orders[].quantity - The quantity of the order item.
 * @param {Array<number>} orderData.orders[].service_type_ids - Array of service type IDs.
 * @returns {Promise<Object>} - A promise resolving to the API response.
 */
export const createNewOrder = async (orderData) => {
  try {
    const response = await api.post('/api/new-order', orderData);
    return response.data; // Return the response data for further processing
  } catch (error) {
    console.error('Error creating new order:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to create new order.');
  }
};


/**
 * Get details of an order by ID
 * @param {string} orderId - ID of the order
 * @returns {Promise<Object>} - Order details
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing order
 * @param {string} orderId - ID of the order
 * @param {Object} orderData - Updated order details
 * @returns {Promise<Object>} - Response from the API
 */
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await api.put(`/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete an order by ID
 * @param {string} orderId - ID of the order
 * @returns {Promise<Object>} - Response from the API
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch all orders
 * @returns {Promise<Array>} - List of all orders
 */
export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw error;
  }
};
