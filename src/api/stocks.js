import api from './axios';


/**
 * Add a new stock.
 * 
 * @param {Object} stockData - The stock data to be added.
 * @param {string} stockData.serial_number - The serial number of the stock.
 * @param {string} stockData.model_name - The model name of the stock.
 * @param {string} stockData.brand_name - The brand name of the stock.
 * @param {string} stockData.machine_description - The description of the stock.
 * @param {string} stockData.warrant_end_date - The warranty end date (YYYY-MM-DD).
 * @param {number} stockData.quantity - The quantity of the stock.
 * @param {number} stockData.supplier_id - The supplier ID for the stock.
 * 
 * @returns {Promise<Object>} The response from the API.
 */
export const addStock = async (stockData) => {
  try {
    const response = await api.post('/api/add-stock', stockData);
    return response.data; // Assuming the response contains a JSON object
  } catch (error) {
    console.error('Error adding stock:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};


// Function to get all stocks
export const getStocks = async (page = 1, limit = 100) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token (adjust storage if needed)
    const response = await api.get(`/api/get-stocks?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stocks:", error.response?.data || error.message);
    throw error;
  }
};


// Function to fetch a single stock by ID
export const getStockById = async (id) => {
  try {
    const response = await api.get(`/stocks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock by ID:", error.response?.data || error.message);
    throw error;
  }
};

// Function to update stock details
export const updateStock = async (id, updatedData) => {
  try {
    const response = await api.put(`/stocks/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating stock:", error.response?.data || error.message);
    throw error;
  }
};

// Function to delete a stock by ID
export const deleteStock = async (id) => {
  try {
    const response = await api.delete(`/stocks/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting stock:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Sends a stock-in request to the server.
 * @param {Object} stockInData - The data for the stock-in operation.
 * @param {string} stockInData.serial_number - The serial number of the stock.
 * @param {number} stockInData.quantity - The quantity to stock in.
 * @param {number} stockInData.supplier_id - The ID of the supplier.
 * @param {string} stockInData.stockInDate - The date of the stock-in operation in ISO 8601 format.
 * @returns {Promise<Object>} - A promise resolving to the API response.
 */
export const stockIn = async (stockInData) => {
  try {
    const response = await api.post('/api/stock-in', stockInData);
    return response.data; // Expected to contain { message: "Stock updated successfully" }
  } catch (error) {
    console.error('Error during stock-in operation:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to stock in.');
  }
};

/**
 * Fetch stock control card data for a specific serial number.
 *
 * @param {string} serialNumber - The serial number to fetch the stock control card data for.
 * @returns {Promise<Array>} - A promise that resolves to the stock control card data.
 */
export const fetchStockControlCard = async (serialNumber) => {
  try {
    const response = await api.get('/api/stock-control-card/', {
      params: { serialNumber },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error fetching stock control card:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch stock control card.');
  }
};