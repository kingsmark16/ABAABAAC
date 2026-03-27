import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
})

axiosInstance.interceptors.response.use((response) => response, (error) => {
    const isUnauthorized = error.response?.status === 401;
    const isOnLoginPage = window.location.pathname.startsWith('/login');
    
    if(isUnauthorized && !isOnLoginPage){
        window.location.replace('/login');
    }
    return Promise.reject(error)
})

export default axiosInstance;