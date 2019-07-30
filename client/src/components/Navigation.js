import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <header className='main-navigation'>
            <div className="main-navigation__logo">
                <h1>Logo</h1>
            </div>
            <nav className="main-navigation__items">
                <ul>
                    <li><NavLink to='/events'>Events</NavLink></li>
                    <li><NavLink to='/bookings'>Bookings</NavLink></li>
                    <li><NavLink to='/auth'>Authenticate</NavLink></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navigation;
