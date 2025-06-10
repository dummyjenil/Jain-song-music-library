import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin, googleLogout } from "@react-oauth/google";
import { useToast } from '@/hooks/use-toast';

type User = {
    name: string;
    email: string;
    picture: string;
};

type AuthContextType = {
    user: User | null;
    login: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            toast({
                title: `Welcome back, ${parsed.name}`,
            });
        }
    }, []);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Fetch user info from Google
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                const profile = await res.json();
                const userData: User = {
                    name: profile.name,
                    email: profile.email,
                    picture: profile.picture,
                };

                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                toast({
                    title: `Welcome, ${userData.name}`,
                });
            } catch (err) {
                toast({
                    title: "Login failed: Could not fetch profile",
                    variant: "destructive",
                });
            }
        },
        onError: () =>
            toast({
                title: "Login failed",
                variant: "destructive",
            }),
    });

    const logout = () => {
        googleLogout();
        localStorage.removeItem("user");
        setUser(null);
        toast({
            title: "Logged out",
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <GoogleOAuthProvider clientId="869048207283-r2f7hnt1kfqkmd26o3qgsq6co3gbipeh.apps.googleusercontent.com">
        <AuthProviderInner>{children}</AuthProviderInner>
    </GoogleOAuthProvider>
);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
