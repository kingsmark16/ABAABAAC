import axiosInstance from "@/lib/axios";
import type { LoginCredentials, LoginResponse } from "@/types/auth";

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const {data} = await axiosInstance.post('/auth/login', credentials, {
            withCredentials: true,
        });
        return data;
    },
    logout: async () : Promise<void> => {
        await axiosInstance.post('/auth/logout');
    }
} as const