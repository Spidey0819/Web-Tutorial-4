import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    fullName?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Check for existing token on app load
        const savedToken = localStorage.getItem('jwt_token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
                setIsAuthenticated(true);
            } catch (error) {
                // Clear invalid data
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            console.log('Attempting login with:', { email, password: '***' });
            
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('Login response status:', response.status);
            const data = await response.json();
            console.log('Login response data:', data);

            if (response.ok) {
                // Handle different possible response structures
                const token = data.token || data.accessToken || data.jwt;
                const userInfo = data.user || data.data || data;
                
                if (token && userInfo) {
                    const userData = {
                        _id: userInfo._id || userInfo.id,
                        name: userInfo.fullName || userInfo.name || userInfo.email,
                        email: userInfo.email,
                        fullName: userInfo.fullName || userInfo.name
                    };

                    console.log('Setting user data:', userData);
                    
                    setToken(token);
                    setUser(userData);
                    setIsAuthenticated(true);

                    // Save to localStorage
                    localStorage.setItem('jwt_token', token);
                    localStorage.setItem('user', JSON.stringify(userData));

                    return true;
                } else {
                    console.error('Missing token or user data in response:', data);
                    return false;
                }
            } else {
                console.error('Login failed with status:', response.status, 'Data:', data);
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
    };

    const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        // If token is invalid, logout
        if (response.status === 401) {
            logout();
        }

        return response;
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        login,
        logout,
        makeAuthenticatedRequest,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};