// src/components/Navigation.tsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Home, Package, Phone, UserPlus, LogIn, LogOut, User, Shield } from 'lucide-react';

interface NavigationProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onPageChange('home');
    };

    const navItems = [
        { key: 'home', label: 'Home', icon: Home },
        { key: 'products', label: 'Products', icon: Package },
        { key: 'contact', label: 'Contact', icon: Phone },
        { key: 'register', label: 'Register', icon: UserPlus },
    ];

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center space-x-2">
                        <Package className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-800">MyApp</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => onPageChange(key)}
                                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
                                    currentPage === key
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Authentication Section */}
                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                {/* User Info */}
                                <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-md">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-800">
                                        Welcome, <span className="font-medium">{user?.name}</span>
                                    </span>
                                </div>
                                
                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center space-x-1 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Login Button */}
                                <button
                                    onClick={() => onPageChange('login')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
                                        currentPage === 'login'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            aria-label="Main menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - You can expand this if needed */}
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => onPageChange(key)}
                                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${
                                    currentPage === key
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                            </button>
                        ))}
                        
                        {/* Mobile Auth Section */}
                        {isAuthenticated ? (
                            <>
                                <div className="px-3 py-2 text-sm text-green-800 bg-green-50 rounded-md">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>{user?.name}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center space-x-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => onPageChange('login')}
                                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${
                                    currentPage === 'login'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;