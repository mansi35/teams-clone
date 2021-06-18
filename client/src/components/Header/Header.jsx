import React, { useEffect, useState } from 'react';
import MicrosoftLogin from 'react-microsoft-login';
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Avatar } from '@material-ui/core';
import {ReactComponent as Apps} from '../../assets/apps.svg'
import './Header.scss'
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Header = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const clientId="a7c1752f-adb0-437f-a95a-0bb44ae8ef58";
    const [msalInstance, onMsalInstanceChange] = useState();
    const location = useLocation();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const loginHandler = (err, data, msal) => {
        if (!err && data && !msalInstance) {
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
        dispatch({ type: 'LOGOUT' });
        history.push('/');

        setUser(null);
    };

    return (
        <div className="header">
            <div className="header__logo">
                <Apps />
                <h5 className="d-none d-md-block">Microsoft Teams</h5>
            </div>
            {user ?
                <div className="header__search">
                    <SearchIcon />
                    <input type="text" placeholder="Search" />
                </div>
            : null}
            <div className="header__options">
                <MoreHorizIcon />
                {user && msalInstance ? (
                    <>
                    <h6>{user.data.displayName}</h6>
                    <div className="header__profile">
                    {user.data.displayName ?
                        <Avatar src={user.data.photoUrl} alt={user.data.displayName} onClick={logoutHandler}>{user.data.displayName.charAt(0)}</Avatar>
                    : null}
                    </div>
                    </>
                ) : (
                    <MicrosoftLogin clientId={clientId} authCallback={loginHandler} withUserData={true} buttonTheme="light_short" />
                )}
            </div>
        </div>
    )
}

export default Header
