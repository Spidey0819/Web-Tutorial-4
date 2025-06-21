import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import RegistrationForm from './components/RegistrationForm';
import ProductsWithJWT from './components/LoginForm'; 
import Home from './components/Home';
import Contact from './components/Contact';
import LoginForm from './components/LoginForm'; 
import './App.css';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState('home');
    
    const handlePageChange = (page: string) => {
        console.log('App: Page changing from', currentPage, 'to', page);
        setCurrentPage(page);
    };

    const renderPage = () => {
        console.log('App: Rendering page:', currentPage);
        switch (currentPage) {
            case 'home':
                return <Home />;
            case 'products':
                return <ProductsWithJWT />; 
            case 'contact':
                return <Contact />;
            case 'register':
                return <RegistrationForm />;
            case 'login':
                return <LoginForm onPageChange={handlePageChange} />;
            default:
                return <Home />;
        }
    };

    return (
        <Provider store={store}>
            <AuthProvider>
                <div className="App">
                    <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
                    <main>{renderPage()}</main>
                </div>
            </AuthProvider>
        </Provider>
    );
};

export default App;