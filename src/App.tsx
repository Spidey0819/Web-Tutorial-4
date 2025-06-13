// src/App.tsx

import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Navigation from './components/Navigation';
import RegistrationForm from './components/RegistrationForm';
import Products from './components/Products';
import Home from './components/Home';
import Contact from './components/Contact';
import './App.css';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState('home');
    const handlePageChange = (page: string) => {
        console.log('App: Page changing from', currentPage, 'to', page); // Debug log
        setCurrentPage(page);
    };

    const renderPage = () => {
        console.log('App: Rendering page:', currentPage); // Debug log
        switch (currentPage) {
            case 'home':
                return <Home />;
            case 'products':
                return <Products />;
            case 'contact':
                return <Contact />;
            case 'register':
                return <RegistrationForm />;
            default:
                return <Home />;
        }
    };

    return (
        <Provider store={store}>
            <div className="App">
                <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
                <main>{renderPage()}</main>
            </div>
        </Provider>
    );
};

export default App;