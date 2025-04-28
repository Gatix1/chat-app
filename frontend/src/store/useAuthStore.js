import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    onlineUsers: [],
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
            get().connectSocket();
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
            get().connectSocket();
            toast.success("Account created successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (email, password) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post("/auth/login", { email, password });
            set({ authUser: response.data });
            get().connectSocket();
            toast.success("Logged in successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully!");
            set({ authUser: null });
            get().disconnectSocket();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
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
    },
    connectSocket: () => {
        const { authUser } = get();

        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }
}));