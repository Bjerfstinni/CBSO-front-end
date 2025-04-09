import axios from './axios'; // Ensure axios.js is correctly set up for your API base URL

/**
 * Fetch analytics reports with pagination.
 * @param {number} page - The page number.
 * @param {number} limit - The number of records per page.
 * @returns {Promise<Object>} - The report analytics response.
 */
export const fetchReportAnalytics = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/api/report-analytics`, {
      params: { page, limit },
    });
    return response.data; // Return the full response including pagination details
  } catch (error) {
    console.error('Error fetching report analytics:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch report analytics.'
    );
  }
};


/**
 * Fetch a specific order report by ID.
 * @param {number} id - The ID of the order report to fetch.
 * @returns {Promise<Object>} - The order report data.
 */
export const fetchOrderReport = async (id) => {
  if (!id) throw new Error('Order ID is required.');

  try {
    const response = await axios.get(`api/order-report/${id}`);
    return response.data; // Return the report data
  } catch (error) {
    console.error(`Error fetching order report for ID ${id}:`, error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch order report.'
    );
  }
};

export const getOrderReport = async (orderId, page = 1, limit = 100, token) => {
  try {
    const response = await axios.get(`/api/order-report/${orderId}`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching order report:", error);
    throw error;
  }
};


/**
 * Fetch order report by ID with authentication and pagination.
 * @param {number} id - The order report ID.
 * @param {string} token - The Bearer token for authentication.
 * @param {number} page - The page number (default: 1).
 * @param {number} limit - The number of records per page (default: 100).
 * @returns {Promise<Object>} - The order report response.
 */
export const getOrderReportById = async (id, token, page = 1, limit = 100) => {
  try {
    const response = await axios.get(`/api/order-report/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include Bearer token
      },
      params: { page, limit }, // Append pagination parameters
    });

    return response.data; // Return the complete response object
  } catch (error) {
    console.error('Error fetching order report:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch order report.');
  }
};


/**
 * Fetch orders assigned to a specific service engineer.
 *
 * @param {number} userId - The user ID of the service engineer.
 * @returns {Promise<Object[]>} - The list of orders.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchOrdersForEngineer = async (userId) => {
  if (!userId) throw new Error("User ID is required.");

  try {
    const response = await axios.get(`/api/specific-report-analytics/`, {
      params: { user_id: userId },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Successful response data
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch orders."
    );
  }
};

/**
 * Approve an order and update stock.
 *
 * @param {number} orderId - The ID of the order to approve.
 * @returns {Promise<Object>} - The response data from the backend.
 * @throws {Error} - Throws an error if the request fails.
 */
export const approveOrder = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required.");

  try {
    const response = await axios.patch(
      "/api/approve-orders", // Endpoint URL
      { order_id: orderId }, // Request payload
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Successful response
  } catch (error) {
    console.error("Error approving order:", error);
    throw new Error(
      error.response?.data?.error || "Failed to approve the order."
    );
  }
};

/**
 * Fetches specific history transactions based on the serial number.
 *
 * @param {string} serialNumber - The serial number to fetch the transaction history for.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of records per page.
 * @returns {Promise<Object>} - A promise that resolves to the transaction history response.
 */
export const fetchSpecificHistoryTransaction = async (serialNumber, page = 1, limit = 100) => {
  try {
    const response = await axios.get(`/api/specific-history-transaction/`, {
      params: {
        serial_number: serialNumber,
        page,
        limit,
      },
    });

    console.log("Fetched specific transaction history:", response.data);
    return response.data; // Includes page, limit, totalRecords, and data array
  } catch (error) {
    console.error("Error fetching specific history transaction:", error.response?.data || error.message);
    throw error;
  }
};


/**
 * Fetches all stock history transactions.
 *
 * @returns {Promise<Object[]>} - A promise that resolves to an array of stock history transactions.
 */
export const fetchAllHistoryTransactions = async () => {
  try {
    const response = await axios.get('/api/history-transaction/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all history transactions:', error.response?.data || error.message);
    throw error;
  }
};

export const getTotalStocks = async () => {
  try {
    const response = await axios.get(`api/total-stocks/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token-based auth
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total stocks:', error);
    throw error;
  }
};

export const getStockControlCard = async (serialNumber) => {
  try {
    const response = await axios.get(`/api/stock-control-card/${serialNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock control card:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchApprovedOrders = async (page = 1, limit = 100) => {
  try {
    const response = await axios.get(`/api/approved-orders`, {
      params: { page, limit },
    });

    return response.data; // Returns the full JSON response
  } catch (error) {
    console.error("Error fetching approved orders:", error);
    throw error;
  }
};
