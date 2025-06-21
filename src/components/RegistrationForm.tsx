import React, { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Phone, Lock, CheckCircle, AlertCircle, X, UserPlus } from 'lucide-react';

interface RegistrationFormData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface User {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
    isActive: boolean;
}

interface ApiResponse {
    message: string;
    user?: User;
    users?: User[];
    count?: number;
}

interface ApiError {
    error: string;
    errors?: Record<string, string>;
}

interface Toast {
    type: 'success' | 'error';
    title: string;
    message: string;
}

// Validation Schema
const registrationSchema = Yup.object().shape({
    fullName: Yup.string()
        .required('Full Name is required')
        .min(2, 'Full Name must be at least 2 characters long')
        .trim(),

    email: Yup.string()
        .email('Must be a valid email format')
        .required('Email is required')
        .lowercase()
        .trim(),

    phone: Yup.string()
        .required('Phone number is required')
        .test('phone-validation', 'Phone must contain 10 to 15 digits only', function(value) {
            if (!value) return false;
            const phoneDigits = value.replace(/\D/g, '');
            return phoneDigits.length >= 10 && phoneDigits.length <= 15;
        }),

    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long'),

    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password')], 'Passwords do not match')
});

// Toast Component
interface ToastProps {
    toast: Toast | null;
    onClear: () => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClear }) => {
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(onClear, 5000);
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
    as?: string;
    rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({ name, type, placeholder, icon: Icon, as, rows }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 capitalize">
                {name === 'fullName' ? 'Full Name' : 
                 name === 'confirmPassword' ? 'Confirm Password' : 
                 name}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                    id={name}
                    name={name}
                    type={type}
                    as={as}
                    rows={rows}
                    placeholder={placeholder}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-sm flex items-center space-x-1"
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

const RegistrationForm: React.FC = () => {
    const [toast, setToast] = useState<Toast | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const API_BASE_URL = 'http://localhost:5001/api';

    const showToast = (type: 'success' | 'error', title: string, message: string): void => {
        setToast({ type, title, message });
    };

    const clearToast = (): void => {
        setToast(null);
    };

    const handleSubmit = async (
        values: RegistrationFormData,
        { setSubmitting, setFieldError, resetForm }: FormikHelpers<RegistrationFormData>
    ): Promise<void> => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data: ApiResponse | ApiError = await response.json();

            if (response.ok) {
                const successData = data as ApiResponse;
                showToast('success', 'Registration Successful!', 'Your account has been created successfully. You can now login!');
                resetForm();
            } else {
                const errorData = data as ApiError;
                if (errorData.errors) {
                    // Set field-specific errors
                    Object.keys(errorData.errors).forEach(field => {
                        setFieldError(field, errorData.errors![field]);
                    });
                }
                showToast('error', 'Registration Failed', errorData.error || 'Please check your input and try again.');
            }
        } catch (error) {
            showToast('error', 'Network Error', 'Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    const initialValues: RegistrationFormData = {
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <UserPlus className="h-12 w-12 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Fill in the form below to register and join our platform
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={registrationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit, isSubmitting: formSubmitting }) => (
                            <div className="space-y-6">
                                <InputField
                                    name="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    icon={User}
                                />

                                <InputField
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    icon={Mail}
                                />

                                <InputField
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    icon={Phone}
                                />

                                <InputField
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password (min 6 characters)"
                                    icon={Lock}
                                />

                                <InputField
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    icon={Lock}
                                />

                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={() => handleSubmit()}
                                        disabled={isSubmitting || formSubmitting}
                                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {(isSubmitting || formSubmitting) ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Registering...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Register
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800 text-center">
                                        💡 After registration, use the Login page to access protected features!
                                    </p>
                                </div>
                            </div>
                        )}
                    </Formik>
                </div>

                <ToastComponent toast={toast} onClear={clearToast} />
            </div>
        </div>
    );
};

export default RegistrationForm;