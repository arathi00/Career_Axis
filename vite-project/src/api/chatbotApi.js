import axios from "./axiosConfig";

/**
 * Chatbot API
 * -------------------------
 * Handles all chatbot-related API calls
 * Used by: Chatbot page, ChatContext
 */

/**
 * Send a message to the chatbot
 * @param {string} message - User's message
 * @returns {Promise<Object>} chatbot response
 */
export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post("/chatbot/message", {
      message,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

/**
 * Fetch chat history of logged-in student
 * @returns {Promise<Array>} chat history
 */
export const getChatHistory = async () => {
  try {
    const response = await axios.get("/chatbot/history");
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

/**
 * Clear chat history (optional feature)
 * @returns {Promise<Object>}
 */
export const clearChatHistory = async () => {
  try {
    const response = await axios.delete("/chatbot/history");
    return response.data;
  } catch (error) {
    console.error("Error clearing chat history:", error);
    throw error;
  }
};

export default {
  sendChatMessage,
  getChatHistory,
  clearChatHistory,
};
