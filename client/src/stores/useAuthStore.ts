import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

type CredentialsType = {
  isEmail: boolean;
  password: string;
  loginField: string;
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      loading: false,
      isAuthenticated: false,
      error: null,

      // Actions
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: any) => set({ error }),

      // Check authentication status
      checkAuth: async () => {
        try {
          set({ loading: true, error: null });
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/user/verify`,
            {
              withCredentials: true,
            }
          );

          set({
            user: response.data.user,
            isAuthenticated: true,
            loading: false,
          });

          return true;
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: error.response?.data?.message || "Authentication failed",
          });
          return false;
        }
      },

      // Register user
      register: async (
        name: string,
        username: string,
        email: string,
        password: string,
        avatar: string
      ) => {
        try {
          set({ loading: true, error: null });
          await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/user/register`,
            {
              name,
              userName: username,
              email,
              password,
              avatar,
            }
          );

          set({
            loading: false,
          });

          return { success: true };
        } catch (error : any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Registration failed",
          });
          return {
            success: false,
            error: error.response?.data?.message || "Registration failed",
          };
        }
      },

      // Login user
      login: async (credentials: CredentialsType) => {
        try {
          set({ loading: true, error: null });
          const response = credentials.isEmail
            ? await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/user/login`,
                {
                  email: credentials.loginField,
                  password: credentials.password,
                },
                {
                  withCredentials: true,
                }
              )
            : await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/user/login`,
                {
                  userName: credentials.loginField,
                  password: credentials.password,
                },
                {
                  withCredentials: true,
                }
              );

          set({
            user: response.data.user,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (error: any) {
          console.log(error);

          set({
            loading: false,
            error: error.response?.data?.message || "Login failed",
          });
          return {
            success: false,
            error: error.response?.data?.message || "Login failed",
          };
        }
      },

      // Logout
      logout: async () => {
        const user = get().user;

        try {
          set({ loading: true, error: null });
          await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/user/logout`,
            {
              email: user.email,
            },
            {
              withCredentials: true,
            }
          );

          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });

          return { success: true };
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Logout failed",
          });
          return {
            success: false,
            error: error.response?.data?.message || "Logout failed",
          };
        }
      },

      // Clear all errors
      clearErrors: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
