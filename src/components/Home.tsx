import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white p-16">
            <div className="max-w-6xl w-full">
                <div className="flex items-center justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl font-bold mb-6">Welcome to ProdManage</h2>
                        <p className="text-xl mb-8 text-blue-100">
                            Effortlessly manage your products with our all-in-one tool. Create, view,
                            edit, and delete products — fast, simple, and reliable.
                        </p>
                        <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded font-semibold hover:bg-yellow-300 transition-colors">
                            Explore Products
                        </button>
                    </div>

                    <div className="ml-12">
                        <div className="bg-white bg-opacity-20 rounded-lg p-6 w-64 h-80">
                            <div className="bg-white rounded-lg p-4 mb-4">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                    <div className="ml-3 space-y-2">
                                        <div className="w-20 h-2 bg-gray-300 rounded"></div>
                                        <div className="w-16 h-2 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="w-24 h-20 bg-blue-400 rounded mb-3"></div>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                    <div className="ml-3 space-y-2">
                                        <div className="w-20 h-2 bg-gray-300 rounded"></div>
                                        <div className="w-16 h-2 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;