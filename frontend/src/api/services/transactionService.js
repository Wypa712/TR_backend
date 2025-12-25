import api from "../axios.js";

const transactionService = {
  getStats: async () => {
    const response = await api.get("/transactions/stats");
    return response.data;
  },

  getTransactions: async (filters) => {
    const response = await api.get("/transactions", { params: filters });
    return response.data;
  },

  createTransactions: async (data) => {
    const response = await api.post("/transactions", data);
    return response.data;
  },

  daleteTransactions: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getGlobalStats: async () => {
    const response = await api.get("/transactions/global-stats");
    return response.data;
  },
};

export default transactionService;
