import { useAuth } from "@/hooks/auth/useAuth";
import { type ReactNode } from "react";
import { Navigate } from "react-router";

interface ProtectedRoutesProps {
    children: ReactNode;
}

export const ProtectedRoute = ({children}: ProtectedRoutesProps) => {
    const {isAuthenticated, isLoading} = useAuth();

    if(isLoading){
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto" />
                <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        )
    }
    if(!isAuthenticated){
        return <Navigate to='/login' replace/>;
    }

    return <>{children}</>
}
