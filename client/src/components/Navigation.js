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
                            <h1>Logo</h1>
                        </div>
                        <nav className="main-navigation__items">
                            <ul>
                                {!context.token && <li><NavLink to='/auth' className='main-navigation__links'>Log in</NavLink></li>}
                                <li><NavLink to='/events' className='main-navigation__links'>Events</NavLink></li>
                                {context.token && <li><NavLink to='/bookings' className='main-navigation__links'>Bookings</NavLink></li>}
                                {context.token && <li><div onClick={context.logout} className='main-navigation__links'>Log out</div></li>}
                            </ul>
                        </nav>
                    </div>

                    <div className="main-navigation__legal">
                        <p>Copyright 2019, all rights resvered</p>
                    </div>
                </header>
            )
        }}
    </AuthContext.Consumer>
);

export default Navigation;
