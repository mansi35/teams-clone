import teams from '../../assets/teams_login.svg'
import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Input from './Input';
import MicrosoftLogin from 'react-microsoft-login';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './Auth.scss';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const clientId="a7c1752f-adb0-437f-a95a-0bb44ae8ef58";
    const [msalInstance, onMsalInstanceChange] = useState();
    const dispatch = useDispatch();
    const history = useHistory();
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);


    const loginHandler = (err, data, msal) => {
        if (!err && data) {
            onMsalInstanceChange(msal);
            const tokenId = data.accessToken;
            try {
                dispatch({ type: 'AUTH' , data: { data, tokenId } });
                history.push('/calendar');
            } catch (error) {
                console.log('error')
            }
        } else {
            console.log(err);
        }
    };

    const logoutHandler = () => {
        msalInstance.logout();
    };

    const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = () => {
        setForm(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className="auth">
            <h3>Microsoft Teams</h3>
            <div className="auth__form">
                <img src={teams} alt="" />
                { !isSignup && <h3>Enter your work, school, or Microsoft account</h3> }
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
                { msalInstance ? (
                    <Button fullWidth variant="contained" onClick={logoutHandler}>Logout</Button>
                ) : (
                    <MicrosoftLogin clientId={clientId} authCallback={loginHandler}>
                        <Button className="microsoft__login" fullWidth variant="contained">
                            <img src="https://img.icons8.com/color/48/000000/microsoft.png" alt="" />
                            Sign in with Microsoft
                        </Button>
                    </MicrosoftLogin>
                )}
                <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
                </Button>
            </div>
        </div>
    );
}

export default Auth
