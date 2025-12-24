import { create } from "zustand";
import authService from "../api/services/authService";
import api from "../api/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuth: !!localStorage.getItem("token"),
  isChecking: true,

  checkAuth: async () => {
    const startTime = Date.now();
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data.user, isAuth: true });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, isAuth: false, isChecking: false });
    } finally {
      const duration = Date.now() - startTime;
      const minDelay = 800;
      if (duration < minDelay) {
        await new Promise((resolve) =>
          setTimeout(resolve, minDelay - duration)
        );
      }
      set({ isChecking: false });
    }
  },

  registration: async (credentials) => {
    try {
      await authService.register(credentials);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Помилка регістрації",
      };
    }
  },

  login: async (credentials) => {
    try {
      const data = await authService.login(credentials);

      set({ user: data.user, isAuth: data.token });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Ошибка входа",
      };
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuth: false });
  },
}));
