export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    id: string;
    username: string
}



export interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    logout: () => Promise<void>
}

export type AuthState = {
    isAuthenticated: boolean
    isLoading: boolean
}

export type AuthAction = | {type: 'SET_AUTHENTICATED'; payload: boolean}
                         | {type: 'SET_LOADING', payload: boolean}
                         | {type: 'LOGOUT'}

                        