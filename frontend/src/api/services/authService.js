import api from "../axios.js";

const authService = {
  register: async (userData) => {
    const responce = await api.post("/auth/register", userData);
    return responce.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export default authService;
