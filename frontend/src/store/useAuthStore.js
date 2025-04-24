import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
        } catch(error) {
            console.log(error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (email, username, password) => {
        set({ isSigningUp: true });
        try {
            console.log("FIELDS: ", email, username, password);
            const response = await axiosInstance.post("/auth/signup", { email, username, password });
            set({ authUser: response.data });
            toast.success("Account created successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (email, password) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post("/auth/login", { email, password });
            set({ authUser: response.data });
            toast.success("Logged in successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully!");
            set({ authUser: null });
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (profilePic) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put("/auth/update-profile", profilePic);
            set({ authUser: response.data });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            set({ isUpdatingProfile: false });
        } 
    } 
}));