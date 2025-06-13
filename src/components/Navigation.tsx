import React from 'react';

interface NavigationProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'products', label: 'Products' },
        { id: 'register', label: 'Register' },    // ← ADDED THIS LINE
        { id: 'contact', label: 'Contact' },
    ];

    const handleClick = (pageId: string): void => {
        console.log('Navigation clicked:', pageId); // Debug log
        onPageChange(pageId);
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">ProdManager</h1>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleClick(item.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                        currentPage === item.id
                                            ? 'bg-blue-700 text-white'
                                            : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                                    }`}
                                    type="button"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Mobile menu for smaller screens */}
                    <div className="md:hidden">
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleClick(item.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                        currentPage === item.id
                                            ? 'bg-blue-700 text-white'
                                            : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                                    }`}
                                    type="button"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;