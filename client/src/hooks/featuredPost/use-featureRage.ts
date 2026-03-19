import { publicService } from "@/services/public.service"
import { useQuery } from "@tanstack/react-query"



export const useFeatureRage = () => {
    return useQuery({
        queryKey: ['featureRage'],
        queryFn: publicService.getFeaturedPost,
    })
}