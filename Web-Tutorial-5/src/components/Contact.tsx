import React from 'react';

const Contact: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="flex items-center justify-center p-16">
                <div className="bg-gray-50 rounded-lg p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Address:</p>
                            <p className="text-gray-600">123 React Street, UI City, CA 90210</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Email:</p>
                            <p className="text-gray-600">hello@prodmanage.com</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Phone:</p>
                            <p className="text-gray-600">+1 (555) 123-4567</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;