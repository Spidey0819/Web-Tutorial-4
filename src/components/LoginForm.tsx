import React, { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, CheckCircle, AlertCircle, X, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
    email: string;
    password: string;
}

interface Toast {
    type: 'success' | 'error';
    title: string;
    message: string;
}

// Validation Schema
const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Must be a valid email format')
        .required('Email is required')
        .lowercase()
        .trim(),

    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long'),
});

// Toast Component
interface ToastProps {
    toast: Toast | null;
    onClear: () => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClear }) => {
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(onClear, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast, onClear]);

    if (!toast) return null;

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                    {toast.type === 'success' ? (
                        <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                    ) : (
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                        <p className="font-medium">{toast.title}</p>
                        <p className="text-sm opacity-90">{toast.message}</p>
                    </div>
                </div>
                <button onClick={onClear} className="ml-2 text-white hover:text-gray-200">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

// Input Field Component
interface InputFieldProps {
    name: string;
    type: string;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
}

const InputField: React.FC<InputFieldProps> = ({ name, type, placeholder, icon: Icon }) => {
    return (
        <div className="space-y-1">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-sm mt-1 flex items-center space-x-1"
            >
                {(msg: string) => (
                    <span className="flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>{msg}</span>
                    </span>
                )}
            </ErrorMessage>
        </div>
    );
};

interface LoginFormProps {
    onPageChange?: (page: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onPageChange }) => {
    const [toast, setToast] = useState<Toast | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { login, isAuthenticated, user, logout } = useAuth();

    const showToast = (type: 'success' | 'error', title: string, message: string): void => {
        setToast({ type, title, message });
    };

    const clearToast = (): void => {
        setToast(null);
    };

    const handleSubmit = async (
        values: LoginFormData,
        { setSubmitting, setFieldError, resetForm }: FormikHelpers<LoginFormData>
    ): Promise<void> => {
        setIsSubmitting(true);
        console.log('Login form submitted with values:', { email: values.email, password: '***' });
        
        try {
            const success = await login(values.email, values.password);
            
            if (success) {
                showToast('success', 'Login Successful!', 'Redirecting to products...');
                resetForm();
                
                // Redirect to products page after successful login
                setTimeout(() => {
                    if (onPageChange) {
                        onPageChange('products');
                    }
                }, 1500); // Give time for the user to see the success message
                
            } else {
                showToast('error', 'Login Failed', 'Invalid email or password. Please check the console for more details.');
                setFieldError('email', ' ');
                setFieldError('password', 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login submission error:', error);
            showToast('error', 'Network Error', 'Please check your connection and try again. Check console for details.');
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        logout();
        showToast('success', 'Logged Out', 'You have been successfully logged out.');
    };

    const initialValues: LoginFormData = {
        email: '',
        password: ''
    };

    // If user is already authenticated, show user info
    if (isAuthenticated && user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                            <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                                Welcome back!
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                You are logged in as
                            </p>
                            <p className="mt-1 text-lg font-medium text-gray-900">
                                {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                            
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => onPageChange && onPageChange('products')}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Go to Products
                                </button>
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Logout
                                </button>
                            </div>
                            
                            <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                <p className="text-sm text-blue-800">
                                    🔐 You can now access the Products page with full functionality!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastComponent toast={toast} onClear={clearToast} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <LogIn className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your credentials to access protected features
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={loginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit, isSubmitting: formSubmitting }) => (
                            <div className="space-y-6">
                                <InputField
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    icon={Mail}
                                />

                                <InputField
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    icon={Lock}
                                />

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => handleSubmit()}
                                        disabled={isSubmitting || formSubmitting}
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {(isSubmitting || formSubmitting) ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Signing in...</span>
                                            </div>
                                        ) : (
                                            'Sign in'
                                        )}
                                    </button>
                                </div>

                                <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                                    <p className="text-sm text-yellow-800">
                                        💡 Don't have an account? Use the Registration page to create one first.
                                    </p>
                                </div>
                            </div>
                        )}
                    </Formik>
                </div>
            </div>

            <ToastComponent toast={toast} onClear={clearToast} />
        </div>
    );
};

export default LoginForm;