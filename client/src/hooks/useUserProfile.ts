import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./auth/useAuth"
import type { UserProfile } from "@/types/profile";
import axiosInstance from "@/lib/axios";

export const useUserProfile = () => {
    const {isAuthenticated} = useAuth();

    return useQuery<UserProfile>({
        queryKey: ['user', 'profile'],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/profile')
            return response.data
        },
        enabled: isAuthenticated,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1
    })
}