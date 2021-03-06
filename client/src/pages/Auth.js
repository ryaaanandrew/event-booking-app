import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

class Auth extends Component {
    state = {
        isLogIn: true
    }
    
    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    static contextType = AuthContext;
    
    submitHandler = e => {
        e.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        console.log(password)

        if(email.trim().length === 0 || password.trim().length === 0) {
            return;
        };

        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        if(!this.state.isLogIn) {
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!) {
                        createUser(userInput: {email: $email, password: $password}) {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData => {
            if(resData.data.login.token) {
                this.context.login(
                    resData.data.login.userId,
                    resData.data.login.token,
                    resData.data.login.tokenExpiration
                );
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    switchModeHandler = () => {
        this.setState(prevProps => {
            return { isLogIn: !prevProps.isLogIn };
        })
    }

    render() {
        return (
            <div className='auth'>
                <div className="auth__left">
                    <img className="auth__images auth__images--1" src="https://i.imgur.com/VZuQ5jf.png" alt="iphone"/>
                    <img className="auth__images auth__images--2" src="https://i.imgur.com/3y3Bbks.png" alt="macbook"/>
                </div>

                <div className="auth__right">
                    <form className='authform' onSubmit={e => this.submitHandler(e)}>
                        <div className='authform__header'><span>{ this.state.isLogIn ? 'Log in' : 'Sign up'}</span></div>
                        <div className="authform__control">
                            <label htmlFor="email">Email</label>
                            <input type="text" id='email' ref={this.emailEl} placeholder='Email'/>
                        </div>
                        <div className="authform__control">
                            <label htmlFor="password">Password</label>
                            <input type="password" id='password' ref={this.passwordEl} placeholder='Password'/>
                        </div>
                        <div className="authform__actions">
                            <button type='submit' className="button">Submit</button>
                            <button type='button' onClick={this.switchModeHandler} className="button">{ this.state.isLogIn ? 'Sign up' : 'Log in'}</button>
                        </div>
                    </form>
                </div>
            </div>     
        );
    };
};

export default Auth;