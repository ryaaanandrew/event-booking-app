import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthPage from './Auth'
import BookingPage from './Bookings';
import EventsPage from './Events';
import Navigation from '../components/Navigation'

const App = () => {
    return (
        <BrowserRouter>
        <Navigation/>
            <main className='main-content'>
                <Switch>
                    <Redirect from='/' to='/auth' exact />
                    <Route path='/auth' component={AuthPage} />
                    <Route path='/events' component={EventsPage} />
                    <Route path='/bookings' component={BookingPage} />
                </Switch>
            </main>
        </BrowserRouter>
    );
};

export default App;

