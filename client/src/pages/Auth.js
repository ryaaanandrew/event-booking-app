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

        if(email.trim().length === 0 || password.trim().length === 0) {
            return;
        };

        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };

        if(!this.state.isLogIn) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput:{email:"${email}", password:"${password}"}){
                            _id
                            email
                        }
                    }
                `
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
            console.log(resData)
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
            <form className='authform' onSubmit={e => this.submitHandler(e)}>
                <h1>{ this.state.isLogIn ? 'Log in' : 'Sign up'}</h1>
                <div className="authform__control">
                    <label htmlFor="email">Email</label>
                    <input type="text" id='email' ref={this.emailEl} />
                </div>
                <div className="authform__control">
                    <label htmlFor="password">password</label>
                    <input type="text" id='password' ref={this.passwordEl} />
                </div>
                <div className="authform__actions">
                <button type='submit'>Submit</button>
                <button type='button' onClick={this.switchModeHandler}>Switch to { this.state.isLogIn ? 'Sign up' : 'Log in'}</button>
                </div>
            </form>
        );
    };
};

export default Auth;