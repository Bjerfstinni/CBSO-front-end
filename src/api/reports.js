import axios from './axios'; // Ensure axios.js is correctly set up for your API base URL

/**
 * Fetch analytics reports.
 * @returns {Promise<Array>} - List of analytics reports.
 */
export const fetchReportAnalytics = async () => {
  try {
    const response = await axios.get('api/report-analytics');
    return response.data; // Return the list of reports
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


export const getOrderReportById = async (id) => {
  try {
    const response = await axios.get(`/api/order-report/${id}`);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching order report:', error.response?.data || error.message);
    throw error; // Re-throw the error for the calling function to handle
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
 * @returns {Promise<Object[]>} - A promise that resolves to an array of history transactions.
 */
export const fetchSpecificHistoryTransaction = async (serialNumber) => {
  try {
    const response = await axios.get(`/api/specific-history-transaction/`, {
      params: { serial_number: serialNumber },
    });
    console.log(response);
    return response.data;
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
