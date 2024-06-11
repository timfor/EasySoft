import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
let data = null;

const token = localStorage.getItem("token");

try {
  data = token ? jwtDecode(token) : null;
} catch (error) {
  console.error("Failed to decode token:", error);
  localStorage.removeItem("token");
}

const useAuthStore = create((set) => ({
  isAuthenticated: !!token,
  data: data,
  login: (token) => {
    localStorage.setItem("token", token);
    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      decodedToken = null;
    }

    set(() => ({ isAuthenticated: true, data: decodedToken }));
  },
  logout: () => {
    localStorage.removeItem("token");
    set(() => ({ isAuthenticated: false, data: null }));
  },
}));

export { useAuthStore };
