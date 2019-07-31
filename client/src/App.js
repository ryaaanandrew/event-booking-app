import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthPage from './pages/Auth'
import BookingPage from './pages/Bookings';
import EventsPage from './pages/Events';
import Navigation from './components/Navigation';
import AuthContext from './context/auth-context';

const App = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = (userId, token, tokenExpiration) => {
        setToken(token);
        setUserId(userId);
    };

    const logout = () => {
        token(null);
        userId(null);
    };

    return (
        <BrowserRouter>
            <AuthContext.Provider value={{ token: token, userId: userId, login: login, logout: logout }}>
            <Navigation/>
                <main className='main-content'>
                    <Switch>
                        <Redirect from='/' to='/auth' exact />
                        <Route path='/auth' component={AuthPage} />
                        <Route path='/events' component={EventsPage} />
                        <Route path='/bookings' component={BookingPage} />
                    </Switch>
                </main>
            </AuthContext.Provider>
        </BrowserRouter>
    );
};

export default App;

