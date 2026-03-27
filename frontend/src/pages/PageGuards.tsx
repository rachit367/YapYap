import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import SplashScreen from "../components/common/SplashScreen";

export function PrivateRoute() {
    const { user: storedUser, setUser, logout } = useAuthStore();
    const {data: user, isLoading, isError} = useAuth(storedUser ? { success: true, user: storedUser } : undefined);

    useEffect(() => {
        if (user?.user) {
            setUser(user.user);
        } else if (isError) {
            logout();
        }
    }, [user, setUser, isError, logout]);

    if (isLoading && !storedUser) return <SplashScreen />

    if ((isError || !user?.user) && !isLoading) return <Navigate to="/auth" />

    return <Outlet />
}

export function GuestRoute() {
    const { user: storedUser } = useAuthStore();
    const {data: user, isLoading, isError} = useAuth(storedUser ? { success: true, user: storedUser } : undefined);

    if (isLoading && !storedUser) return <SplashScreen />

    if (user?.user && !isError) return <Navigate to="/"/> 

    return <Outlet /> 
}