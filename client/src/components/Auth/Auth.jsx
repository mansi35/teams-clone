import teams from '../../assets/teams_login.svg'
import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Input from './Input';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signin, signup } from '../../actions/auth';
import { useIsAuthenticated } from "@azure/msal-react";
import './Auth.scss';
import { callMsGraph } from '../../api/graph';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const dispatch = useDispatch();
    const { instance } = useMsal();
    const history = useHistory();
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const isAuthenticated = useIsAuthenticated();

    const handleLogin = async (instance) => {
        instance.loginPopup(loginRequest)
        .then((data) => {
            const tokenId = data.accessToken;
            callMsGraph(tokenId).then((response) => {
                console.log(response);
                try {
                    dispatch({ type: 'AUTH' , data: { data: response, tokenId } });
                    history.push('/calendar');
                } catch (error) {
                    console.log('error')
                }
            });
        })
        .catch(e => {
            console.error(e);
        });
    }
    
    const handleLogout = (instance) => {
        instance.logoutPopup()
        .then(() => {
            dispatch({ type: 'LOGOUT' });
            history.push('/auth');
        })
        .catch(e => {
            console.error(e);
        });
    }

    const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = () => {
        setForm(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(form, history));
        } else {
            dispatch(signin(form, history));
        }
    }

    return (
        <div className="auth">
            <h3>Microsoft Teams</h3>
            <div className="auth__form">
                <img src={teams} alt="" />
                { !isSignup && <h3>Enter your work, school, or Microsoft account</h3> }
                <form onSubmit={handleSubmit}>
                    { isSignup && (
                    <div className="auth__name">
                        <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                        <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                    </div>
                    )}
                    <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                    { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    <Button type="submit" fullWidth variant="contained" color="primary" className="submit">
                        { isSignup ? 'Sign Up' : 'Sign In' }
                    </Button>
                    { isAuthenticated ?
                    <Button className="microsoft__login ml-auto" fullWidth variant="contained" onClick={() => handleLogout(instance)}>
                        <img src="https://img.icons8.com/color/48/000000/microsoft.png" alt="" />
                        Sign Out
                    </Button>
                    :
                    <Button className="microsoft__login ml-auto" fullWidth variant="contained" onClick={() => handleLogin(instance)}>
                        <img src="https://img.icons8.com/color/48/000000/microsoft.png" alt="" />
                        Sign in with Microsoft
                    </Button>}
                </form>
                <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
                </Button>
            </div>
        </div>
    );
}

export default Auth
