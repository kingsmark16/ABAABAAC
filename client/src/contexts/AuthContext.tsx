import axiosInstance from "@/lib/axios";
import type { AuthAction, AuthState } from "@/types/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useReducer, type ReactNode } from "react";
import { AuthContext } from "./AuthContext.context";

const  reducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type){
        case 'SET_LOADING':
            return {...state, isLoading: action.payload}
        case 'SET_AUTHENTICATED':
            return {isAuthenticated: action.payload, isLoading: false}
        case 'LOGOUT':
            return {isAuthenticated: false, isLoading: false}
        default:
            return state
    }
}

const checkAuth = async () => {
    const { data } = await axiosInstance.get('/auth/session')
    return data?.authenticated === true
}

const AuthProviderContent = ({children}: {children: ReactNode}) => {
    const [state, dispatch] = useReducer(reducer, {
        isAuthenticated: false,
        isLoading: true
    })

    const queryClient = useQueryClient()

    const {isLoading, data: isAuthenticatedResult} = useQuery({
        queryKey: ['auth', 'session'],
        queryFn: checkAuth,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        dispatch({type: 'SET_LOADING', payload: isLoading})
        if(!isLoading){
            dispatch({type: 'SET_AUTHENTICATED', payload: isAuthenticatedResult === true})
        }
    }, [isLoading, isAuthenticatedResult])

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout')
        } catch (error) {
            console.error('Logout failed: ', error)
        } finally {
            dispatch({type: 'LOGOUT'})
            await queryClient.invalidateQueries({queryKey: ['auth']})
            await queryClient.removeQueries({queryKey: ['user']})
            window.location.href = '/login'
        }
    }

    return (
        <AuthContext.Provider value={{...state, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const AuthProvider = ({children}: {children: ReactNode}) => {
    return <AuthProviderContent>{children}</AuthProviderContent>
}