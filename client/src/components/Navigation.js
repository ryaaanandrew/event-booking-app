import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../context/auth-context';

const Navigation = () => (
    <AuthContext.Consumer>
        {context => {
            return (
                <header className='main-navigation'>
                    <div className="main-navigation__content">
                        <div className="main-navigation__logo">
                            <h1>Bookings</h1>
                        </div>
                        <nav className="main-navigation__items">
                            <ul>
                                {!context.token && <li><div className='main-navigation__links'><NavLink to='/auth'>Log in</NavLink></div></li>}
                                <li><div className='main-navigation__links'><NavLink to='/events'>Events</NavLink></div></li>
                                {context.token && <li><div className='main-navigation__links'><NavLink to='/bookings'>Bookings</NavLink></div></li>}
                                {context.token && <li><div onClick={context.logout} className='main-navigation__links'>Log out</div></li>}
                            </ul>
                        </nav>
                    </div>

                    <div className="main-navigation__legal">
                        <p>Copyright 2019, all rights reservered</p>
                    </div>
                </header>
            )
        }}
    </AuthContext.Consumer>
);

export default Navigation;
