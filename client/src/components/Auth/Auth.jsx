import React, { useState } from 'react';
import MicrosoftLogin from 'react-microsoft-login';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Auth = () => {
    const clientId="fd3b6574-30a9-47e5-8890-024c28e95c00";
    const [msalInstance, onMsalInstanceChange] = useState();
    const dispatch = useDispatch();
    const history = useHistory();

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

    return msalInstance ? (
        <button onClick={logoutHandler}>Logout</button>
    ) : (
        <MicrosoftLogin clientId={clientId} authCallback={loginHandler} withUserData={true} buttonTheme="light_short" />
    );
}

export default Auth
